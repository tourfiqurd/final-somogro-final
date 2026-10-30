import { useState, type FormEvent } from 'react';
import { CheckCircle2, GraduationCap, Plus, Search, Users } from 'lucide-react';
import { useAppData, type StudentInput } from '@/context/AppDataContext';
import { CLASS_NAMES, FOURTH_SUBJECTS, SECTIONS, type AppUser } from '@/data/demo';
import { Badge, Button, Card, Field, Modal, PageHeader, StatCard, inputClass } from '@/components/dashboard/ui';
import { getInstitutionStudents, getSubmittedGroups } from '@/lib/marks';

export function PrincipalOverview({ user }: { user: AppUser }) {
  const { institutions, students, marks, users, academicYear } = useAppData();
  const institution = institutions.find((item) => item.id === user.institutionId);
  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const studentIds = classStudents.map((item) => item.id);
  const instMarks = marks.filter((item) => studentIds.includes(item.studentId));
  const pendingGroups = getSubmittedGroups(instMarks, classStudents).length;
  const teachers = users.filter((item) => item.role === 'teacher' && item.institutionId === user.institutionId);

  return (
    <>
      <PageHeader title="স্কুল কন্ট্রোল" subtitle={`${institution?.name ?? ''} · শিক্ষাবর্ষ ${academicYear.toLocaleString('bn-BD').replace(/,/g, '')}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="শিক্ষার্থী (এই বর্ষে)" value={classStudents.length} />
        <StatCard icon={Users} label="শিক্ষক" value={teachers.length} tone="sky" />
        <StatCard icon={CheckCircle2} label="অনুমোদনের অপেক্ষায়" value={pendingGroups} tone="rose" />
        <StatCard icon={CheckCircle2} label="প্রকাশিত ফলাফল" value={instMarks.filter((item) => item.status === 'approved').length} tone="emerald" />
      </div>
      <Card className="mt-6 p-5">
        <h2 className="font-bold text-stone-900">প্রতিষ্ঠানের তথ্য</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-stone-500">প্রতিষ্ঠানের নাম</dt><dd className="font-semibold text-stone-900">{institution?.name}</dd></div>
          <div><dt className="text-stone-500">EIIN</dt><dd className="font-semibold text-stone-900">{institution?.eiin}</dd></div>
          <div><dt className="text-stone-500">ঠিকানা</dt><dd className="text-stone-900">{institution?.address}</dd></div>
          <div><dt className="text-stone-500">যোগাযোগ</dt><dd className="text-stone-900">{institution?.phone}</dd></div>
        </dl>
      </Card>
    </>
  );
}

export function StudentsSection({ user }: { user: AppUser }) {
  const { students, academicYear, addStudent } = useAppData();
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [open, setOpen] = useState(false);

  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const rows = classStudents.filter((item) => {
    const matchesText = item.name.includes(query.trim()) || String(item.roll).includes(query.trim());
    return matchesText && (classFilter === 'all' || item.className === classFilter);
  });

  return (
    <>
      <PageHeader
        title="শিক্ষার্থী ব্যবস্থাপনা"
        subtitle={`${classStudents.length} জন শিক্ষার্থী`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> নতুন ভর্তি</Button>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className={`${inputClass} pl-9`} placeholder="নাম বা রোল দিয়ে খুঁজুন" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select className={`${inputClass} sm:w-48`} value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
          <option value="all">সব শ্রেণি</option>
          {CLASS_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">রোল</th>
              <th className="px-4 py-3">নাম</th>
              <th className="px-4 py-3">শ্রেণি</th>
              <th className="px-4 py-3">পিতার নাম</th>
              <th className="px-4 py-3">অভিভাবকের ফোন</th>
              <th className="px-4 py-3">চতুর্থ বিষয়</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((item) => (
              <tr key={item.id} className="transition hover:bg-stone-50">
                <td className="px-4 py-3 font-mono">{item.roll}</td>
                <td className="px-4 py-3 font-semibold text-stone-900">{item.name}</td>
                <td className="px-4 py-3"><Badge tone="orange">{item.className} ({item.section})</Badge></td>
                <td className="px-4 py-3">{item.fatherName}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.guardianPhone}</td>
                <td className="px-4 py-3">{item.fourthSubject ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-500">কোনো শিক্ষার্থী পাওয়া যায়নি।</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <AdmissionModal open={open} onClose={() => setOpen(false)} onSubmit={addStudent} />
    </>
  );
}

const EMPTY_STUDENT = { name: '', roll: '', className: CLASS_NAMES[3], section: SECTIONS[0], fatherName: '', motherName: '', guardianPhone: '', fourthSubject: '' };

function AdmissionModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (input: StudentInput) => string | null }) {
  const { academicYear } = useAppData();
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof EMPTY_STUDENT) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const roll = Number(form.roll);
    if (!form.name.trim() || !form.fatherName.trim() || !form.motherName.trim() || !form.guardianPhone.trim()) {
      setError('নাম, পিতা-মাতার নাম ও অভিভাবকের ফোন নম্বর আবশ্যক।');
      return;
    }
    if (!Number.isInteger(roll) || roll <= 0) {
      setError('রোল নম্বর একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে।');
      return;
    }
    const result = onSubmit({
      name: form.name.trim(),
      roll,
      className: form.className,
      section: form.section,
      year: academicYear,
      fatherName: form.fatherName.trim(),
      motherName: form.motherName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      fourthSubject: form.fourthSubject || null,
    });
    if (result) {
      setError(result);
      return;
    }
    setForm(EMPTY_STUDENT);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} title="নতুন শিক্ষার্থী ভর্তি" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="শিক্ষার্থীর নাম"><input className={inputClass} value={form.name} onChange={update('name')} /></Field>
        <Field label="রোল নম্বর"><input type="number" min={1} className={inputClass} value={form.roll} onChange={update('roll')} /></Field>
        <Field label="শ্রেণি">
          <select className={inputClass} value={form.className} onChange={update('className')}>
            {CLASS_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </Field>
        <Field label="শাখা">
          <select className={inputClass} value={form.section} onChange={update('section')}>
            {SECTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </Field>
        <Field label="পিতার নাম"><input className={inputClass} value={form.fatherName} onChange={update('fatherName')} /></Field>
        <Field label="মাতার নাম"><input className={inputClass} value={form.motherName} onChange={update('motherName')} /></Field>
        <Field label="অভিভাবকের ফোন"><input className={inputClass} value={form.guardianPhone} onChange={update('guardianPhone')} /></Field>
        <Field label="চতুর্থ বিষয় (ঐচ্ছিক)">
          <select className={inputClass} value={form.fourthSubject} onChange={update('fourthSubject')}>
            <option value="">নেই</option>
            {FOURTH_SUBJECTS.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </Field>
        {error && <p className="text-sm font-semibold text-rose-600 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button variant="secondary" type="button" onClick={onClose}>বাতিল</Button>
          <Button type="submit"><CheckCircle2 size={16} /> ভর্তি সম্পন্ন করুন</Button>
        </div>
      </form>
    </Modal>
  );
}
