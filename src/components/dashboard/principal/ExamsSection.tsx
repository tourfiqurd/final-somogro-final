import { useAppData } from '@/context/AppDataContext';
import { MARK_STATUS_LABELS, SUBJECTS, type AppUser, type MarkStatus } from '@/data/demo';
import { Badge, Card, PageHeader } from '@/components/dashboard/ui';
import { getClassSections, getInstitutionStudents } from '@/lib/marks';

const toBn = (value: number) => value.toLocaleString('bn-BD');
const STATUS_TONE: Record<MarkStatus, 'neutral' | 'amber' | 'emerald'> = { draft: 'neutral', submitted: 'amber', approved: 'emerald' };

export function ExamsSection({ user }: { user: AppUser }) {
  const { students, marks, academicYear } = useAppData();
  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const classSections = getClassSections(classStudents);

  const rows = classSections.flatMap((cs) =>
    SUBJECTS.map((subject) => {
      const ids = classStudents
        .filter((item) => item.className === cs.className && item.section === cs.section)
        .map((item) => item.id);
      const entries = marks.filter((mark) => mark.subject === subject && ids.includes(mark.studentId));
      const statusOf = (status: MarkStatus) => entries.filter((mark) => mark.status === status).length;
      const overall: MarkStatus = entries.length > 0 && entries.every((mark) => mark.status === 'approved')
        ? 'approved'
        : entries.some((mark) => mark.status === 'submitted') ? 'submitted' : 'draft';
      return { key: `${cs.className}${cs.section}${subject}`, label: `${cs.className} (${cs.section})`, subject, total: ids.length, entered: entries.length, overall, approved: statusOf('approved') };
    }),
  );

  return (
    <>
      <PageHeader title="পরীক্ষা ও নম্বর বিভাজন" subtitle="প্রতিটি শ্রেণি ও বিষয়ের নম্বর এন্ট্রির অগ্রগতি" />
      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-500">এই বর্ষে কোনো শ্রেণি নেই।</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-3">শ্রেণি</th>
                <th className="px-4 py-3">বিষয়</th>
                <th className="px-4 py-3 text-center">শিক্ষার্থী</th>
                <th className="px-4 py-3 text-center">নম্বর এন্ট্রি</th>
                <th className="px-4 py-3 text-center">অনুমোদিত</th>
                <th className="px-4 py-3 text-center">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((row) => (
                <tr key={row.key} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">{row.label}</td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="px-4 py-3 text-center">{toBn(row.total)}</td>
                  <td className="px-4 py-3 text-center">{toBn(row.entered)} / {toBn(row.total)}</td>
                  <td className="px-4 py-3 text-center">{toBn(row.approved)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone={STATUS_TONE[row.overall]}>{MARK_STATUS_LABELS[row.overall]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
