import { Badge, Card } from '@/components/dashboard/ui';
import { MARK_STATUS_LABELS, type MarkRecord, type Student } from '@/data/demo';
import { getGpa, getMaxTotal, getSubjectMax, getSubjectResult } from '@/lib/grading';

interface MarkSheetProps {
  student: Student;
  institutionName: string;
  marks: MarkRecord[];
}

const toBn = (value: number) => value.toLocaleString('bn-BD');
const cell = (value: number | null) => (value === null ? '—' : toBn(value));

export function MarkSheet({ student, institutionName, marks }: MarkSheetProps) {
  const published = marks.filter((mark) => mark.status === 'approved');
  const pending = marks.filter((mark) => mark.status !== 'approved');
  const allPassed = published.length > 0 && published.every((mark) => getSubjectResult(mark).passed);
  const gpa = getGpa(published);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-stone-200 bg-gradient-to-r from-orange-50 to-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">মার্কশিট · {toBn(student.year)}</p>
        <h3 className="mt-1 text-xl font-bold text-stone-900">{student.name}</h3>
        <p className="mt-1 text-sm text-stone-500">
          {institutionName} · {student.className} ({student.section}) · রোল {toBn(student.roll)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-stone-200 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs text-stone-500">গড় GPA</p>
          <p className="text-2xl font-bold text-stone-900">{published.length ? gpa.toFixed(2) : '—'}</p>
        </div>
        <div>
          <p className="text-xs text-stone-500">প্রকাশিত বিষয়</p>
          <p className="text-2xl font-bold text-stone-900">{toBn(published.length)}</p>
        </div>
        <div className="col-span-2 flex items-end sm:col-span-1">
          {published.length === 0 ? (
            <Badge tone="amber">ফলাফল প্রকাশিত হয়নি</Badge>
          ) : (
            <Badge tone={allPassed ? 'emerald' : 'rose'}>{allPassed ? 'উত্তীর্ণ' : 'অকৃতকার্য'}</Badge>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">বিষয়</th>
              <th className="px-4 py-3 text-center">CQ</th>
              <th className="px-4 py-3 text-center">MCQ</th>
              <th className="px-4 py-3 text-center">PR</th>
              <th className="px-4 py-3 text-center">মোট</th>
              <th className="px-4 py-3 text-center">গ্রেড</th>
              <th className="px-4 py-3 text-center">ফলাফল</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {published.map((mark) => {
              const result = getSubjectResult(mark);
              return (
                <tr key={mark.subject} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">{mark.subject}</td>
                  <td className="px-4 py-3 text-center">{cell(mark.cq)}</td>
                  <td className="px-4 py-3 text-center">{cell(mark.mcq)}</td>
                  <td className="px-4 py-3 text-center">{getSubjectMax(mark.subject).pr > 0 ? cell(mark.pr) : '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {toBn(result.total)} / {toBn(getMaxTotal(mark.subject))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone="sky">{result.grade.letter}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone={result.passed ? 'emerald' : 'rose'}>{result.passed ? 'উত্তীর্ণ' : 'অকৃতকার্য'}</Badge>
                  </td>
                </tr>
              );
            })}
            {pending.map((mark) => (
              <tr key={`pending-${mark.subject}`} className="text-stone-400">
                <td className="px-4 py-3 font-semibold">{mark.subject}</td>
                <td colSpan={5} className="px-4 py-3 text-center text-xs">
                  {MARK_STATUS_LABELS[mark.status]} · ফলাফল এখনো প্রকাশিত হয়নি
                </td>
                <td className="px-4 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
