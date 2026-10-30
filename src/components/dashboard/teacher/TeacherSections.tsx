import { BookOpen, PenLine, Save, Send } from 'lucide-react';
import { useAppData, type MarkRow } from '@/context/AppDataContext';
import { MARK_STATUS_LABELS, type AppUser, type MarkStatus, type Student, type TeachingAssignment } from '@/data/demo';
import { getMaxTotal, getSubjectMax, getSubjectResult, PASS_MARK } from '@/lib/grading';
import { Badge, Button, Card, PageHeader, StatCard, inputClass } from '@/components/dashboard/ui';
import { getInstitutionStudents } from '@/lib/marks';

import { useState } from 'react';

const assignmentKey = (item: TeachingAssignment) => `${item.className}|${item.section}|${item.subject}`;

function uniqueAssignments(list: TeachingAssignment[]) {
  const map = new Map<string, TeachingAssignment>();
  list.forEach((item) => map.set(assignmentKey(item), item));
  return Array.from(map.values());
}

function assignmentStudents(students: Student[], item: TeachingAssignment) {
  return students.filter((student) => student.className === item.className && student.section === item.section);
}

export function TeacherOverview({ user }: { user: AppUser }) {
  const { students, marks, academicYear } = useAppData();
  const assignments = uniqueAssignments(user.teaching);
  const scoped = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const scopedMarks = marks.filter((mark) => scoped.some((item) => item.id === mark.studentId));
  const pendingCount = scopedMarks.filter((mark) => mark.status !== 'approved').length;

  return (
    <>
      <PageHeader title="ক্লাস ও শাখা" subtitle="আপনার বরাদ্দকৃত শ্রেণি ও বিষয়সমূহ" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="বরাদ্দকৃত বিষয়" value={assignments.length} />
        <StatCard icon={PenLine} label="নম্বর বাকি" value={pendingCount} tone="rose" />
        <StatCard icon={BookOpen} label="মোট শিক্ষার্থী" value={new Set(assignments.flatMap((item) => assignmentStudents(scoped, item).map((s) => s.id))).size} tone="sky" />
      </div>
      {assignments.length === 0 ? (
        <Card className="mt-6 p-10 text-center text-sm text-stone-500">এখনো কোনো বিষয় বরাদ্দ করা হয়নি। অধ্যক্ষের সঙ্গে যোগাযোগ করুন।</Card>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((item) => {
            const list = assignmentStudents(scoped, item);
            return (
              <Card key={assignmentKey(item)} className="p-5">
                <Badge tone="orange">{item.className} · শাখা {item.section}</Badge>
                <h3 className="mt-3 text-lg font-bold text-stone-900">{item.subject}</h3>
                <p className="mt-1 text-sm text-stone-500">{list.length} জন শিক্ষার্থী</p>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

export function MarksEntrySection({ user }: { user: AppUser }) {
  const { students, academicYear } = useAppData();
  const assignments = uniqueAssignments(user.teaching);
  const [selectedKey, setSelectedKey] = useState(assignments[0] ? assignmentKey(assignments[0]) : '');
  const selected = assignments.find((item) => assignmentKey(item) === selectedKey) ?? assignments[0];

  if (!selected) {
    return (
      <>
        <PageHeader title="নম্বর এন্ট্রি" subtitle="বিষয়ভিত্তিক নম্বর জমা" />
        <Card className="p-10 text-center text-sm text-stone-500">নম্বর এন্ট্রির জন্য কোনো বিষয় বরাদ্দ নেই।</Card>
      </>
    );
  }

  const list = assignmentStudents(getInstitutionStudents(students, user.institutionId ?? '', academicYear), selected);

  return (
    <>
      <PageHeader title="নম্বর এন্ট্রি" subtitle="CQ, MCQ ও PR নম্বর দিন। মোট ও গ্রেড স্বয়ংক্রিয়ভাবে হিসাব হবে।" />
      <div className="mb-4">
        <select className={`${inputClass} sm:w-80`} value={assignmentKey(selected)} onChange={(event) => setSelectedKey(event.target.value)}>
          {assignments.map((item) => (
            <option key={assignmentKey(item)} value={assignmentKey(item)}>
              {item.className} · শাখা {item.section} · {item.subject}
            </option>
          ))}
        </select>
      </div>
      <MarkEntryTable key={assignmentKey(selected)} subject={selected.subject} students={list} />
    </>
  );
}

type Draft = Record<string, { cq: string; mcq: string; pr: string }>;

const toNumber = (value: string) => (value.trim() === '' ? null : Number(value));

function MarkEntryTable({ subject, students }: { subject: string; students: Student[] }) {
  const { marks, saveMarks } = useAppData();
  const max = getSubjectMax(subject);
  const hasPr = max.pr > 0;
  const [draft, setDraft] = useState<Draft>(() => {
    const initial: Draft = {};
    students.forEach((student) => {
      const existing = marks.find((mark) => mark.studentId === student.id && mark.subject === subject);
      initial[student.id] = {
        cq: existing?.cq?.toString() ?? '',
        mcq: existing?.mcq?.toString() ?? '',
        pr: existing?.pr?.toString() ?? '',
      };
    });
    return initial;
  });
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const statusOf = (studentId: string): MarkStatus => marks.find((mark) => mark.studentId === studentId && mark.subject === subject)?.status ?? 'draft';
  const editable = students.filter((student) => statusOf(student.id) !== 'approved');

  const updateCell = (studentId: string, field: keyof Draft[string], value: string) => {
    setDraft((prev) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const rowFor = (studentId: string): MarkRow => ({
    studentId,
    cq: toNumber(draft[studentId].cq),
    mcq: toNumber(draft[studentId].mcq),
    pr: hasPr ? toNumber(draft[studentId].pr) : null,
  });

  const validate = (rows: MarkRow[], complete: boolean): string | null => {
    for (const row of rows) {
      const parts: [number | null, number, string][] = [
        [row.cq, max.cq, 'CQ'],
        [row.mcq, max.mcq, 'MCQ'],
      ];
      if (hasPr) parts.push([row.pr, max.pr, 'PR']);
      for (const [value, limit, label] of parts) {
        if (value === null) {
          if (complete) return `${label} নম্বর সব শিক্ষার্থীর জন্য দিন।`;
          continue;
        }
        if (!Number.isInteger(value) || value < 0 || value > limit) return `${label} নম্বর ০ থেকে ${limit} এর মধ্যে হতে হবে।`;
      }
    }
    return null;
  };

  const handleSave = (status: Exclude<MarkStatus, 'approved'>) => {
    const rows = editable.map((student) => rowFor(student.id));
    const error = validate(rows, status === 'submitted');
    if (error) {
      setMessage({ tone: 'error', text: error });
      return;
    }
    saveMarks(subject, rows, status);
    setMessage({ tone: 'ok', text: status === 'draft' ? 'খসড়া সংরক্ষণ করা হয়েছে।' : 'নম্বর অধ্যক্ষের কাছে জমা দেওয়া হয়েছে।' });
  };

  return (
    <>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">রোল</th>
              <th className="px-4 py-3">শিক্ষার্থী</th>
              <th className="px-4 py-3 text-center">CQ ({max.cq})</th>
              <th className="px-4 py-3 text-center">MCQ ({max.mcq})</th>
              {hasPr && <th className="px-4 py-3 text-center">PR ({max.pr})</th>}
              <th className="px-4 py-3 text-center">মোট ({getMaxTotal(subject)})</th>
              <th className="px-4 py-3 text-center">গ্রেড</th>
              <th className="px-4 py-3 text-center">ফলাফল</th>
              <th className="px-4 py-3 text-center">অবস্থা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {students.map((student) => {
              const locked = statusOf(student.id) === 'approved';
              const row = rowFor(student.id);
              const result = getSubjectResult({ studentId: student.id, subject, cq: row.cq, mcq: row.mcq, pr: row.pr, status: 'draft' });
              const filled = row.cq !== null && row.mcq !== null && (!hasPr || row.pr !== null);
              return (
                <tr key={student.id} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 font-mono">{student.roll}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{student.name}</td>
                  <ScoreCell value={draft[student.id].cq} max={max.cq} disabled={locked} onChange={(v) => updateCell(student.id, 'cq', v)} />
                  <ScoreCell value={draft[student.id].mcq} max={max.mcq} disabled={locked} onChange={(v) => updateCell(student.id, 'mcq', v)} />
                  {hasPr && <ScoreCell value={draft[student.id].pr} max={max.pr} disabled={locked} onChange={(v) => updateCell(student.id, 'pr', v)} />}
                  <td className="px-4 py-3 text-center font-semibold">{result.total}</td>
                  <td className="px-4 py-3 text-center"><Badge tone="sky">{filled ? result.grade.letter : '—'}</Badge></td>
                  <td className="px-4 py-3 text-center">
                    {filled ? <Badge tone={result.passed ? 'emerald' : 'rose'}>{result.passed ? 'উত্তীর্ণ' : 'অকৃতকার্য'}</Badge> : <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center"><Badge tone={locked ? 'emerald' : 'neutral'}>{MARK_STATUS_LABELS[statusOf(student.id)]}</Badge></td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-stone-500">এই শ্রেণিতে কোনো শিক্ষার্থী নেই।</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">পাস মার্ক {PASS_MARK}%। শিক্ষার্থীদের নম্বর জমা হলে অধ্যক্ষ অনুমোদন করবেন।</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleSave('draft')} disabled={editable.length === 0}><Save size={16} /> খসড়া সংরক্ষণ</Button>
          <Button onClick={() => handleSave('submitted')} disabled={editable.length === 0}><Send size={16} /> জমা দিন</Button>
        </div>
      </div>
      {message && (
        <p className={`mt-3 text-sm font-semibold ${message.tone === 'ok' ? 'text-emerald-700' : 'text-rose-600'}`}>{message.text}</p>
      )}
    </>
  );
}

function ScoreCell({ value, max, disabled, onChange }: { value: string; max: number; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <td className="px-4 py-2 text-center">
      <input
        type="number"
        min={0}
        max={max}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`সর্বোচ্চ ${max}`}
        className={`${inputClass} mx-auto h-9 w-20 text-center disabled:bg-stone-100 disabled:text-stone-500`}
      />
    </td>
  );
}
