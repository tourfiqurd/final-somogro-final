import { CheckCircle2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { AppUser } from '@/data/demo';
import { Badge, Button, Card, PageHeader } from '@/components/dashboard/ui';
import { getInstitutionStudents, getSubmittedGroups } from '@/lib/marks';

export function ApprovalSection({ user }: { user: AppUser }) {
  const { students, marks, academicYear, approveMarks, institutions } = useAppData();
  const institution = institutions.find((item) => item.id === user.institutionId);
  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const studentIds = classStudents.map((item) => item.id);
  const instMarks = marks.filter((item) => studentIds.includes(item.studentId));
  const groups = getSubmittedGroups(instMarks, classStudents);

  return (
    <>
      <PageHeader title="ফলাফল অনুমোদন ও প্রকাশ" subtitle={`${institution?.name ?? ''} · শিক্ষকের জমা দেওয়া নম্বর যাচাই করে প্রকাশ করুন`} />
      {groups.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-500">অনুমোদনের অপেক্ষায় কোনো নম্বর নেই।</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-3">শ্রেণি</th>
                <th className="px-4 py-3">বিষয়</th>
                <th className="px-4 py-3">শিক্ষার্থী</th>
                <th className="px-4 py-3">অবস্থা</th>
                <th className="px-4 py-3 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {groups.map((group) => (
                <tr key={`${group.className}${group.section}${group.subject}`} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">{group.className} ({group.section})</td>
                  <td className="px-4 py-3">{group.subject}</td>
                  <td className="px-4 py-3">{group.count} জন</td>
                  <td className="px-4 py-3"><Badge tone="amber">জমা হয়েছে</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="success" className="px-2.5 py-1.5 text-xs" onClick={() => approveMarks(group.className, group.section, group.subject)}>
                      <CheckCircle2 size={14} /> অনুমোদন ও প্রকাশ
                    </Button>
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
