import { BookOpen, Users } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { SUBJECTS, type AppUser } from '@/data/demo';
import { PASS_MARK, getMaxTotal, getSubjectMax } from '@/lib/grading';
import { Badge, Card, PageHeader } from '@/components/dashboard/ui';
import { getClassSections, getInstitutionStudents } from '@/lib/marks';

const toBn = (value: number) => value.toLocaleString('bn-BD');

export function ClassesSection({ user }: { user: AppUser }) {
  const { students, users, academicYear } = useAppData();
  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const classSections = getClassSections(classStudents);
  const teachers = users.filter((item) => item.role === 'teacher' && item.institutionId === user.institutionId);

  return (
    <>
      <PageHeader title="শ্রেণি, শাখা ও বিষয়" subtitle={`শিক্ষাবর্ষ ${toBn(academicYear)} এর কাঠামো`} />

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-stone-500">শ্রেণি ও শাখা</h2>
      {classSections.length === 0 ? (
        <Card className="mb-8 p-8 text-center text-sm text-stone-500">এই বর্ষে এখনো কোনো শ্রেণি তৈরি হয়নি। শিক্ষার্থী ভর্তি করলে শ্রেণি যুক্ত হবে।</Card>
      ) : (
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classSections.map((cs) => {
            const count = classStudents.filter((item) => item.className === cs.className && item.section === cs.section).length;
            return (
              <Card key={`${cs.className}|${cs.section}`} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-lg font-bold text-stone-900">{cs.className} · শাখা {cs.section}</p>
                  <p className="text-sm text-stone-500">{toBn(count)} জন শিক্ষার্থী</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600">
                  <Users size={20} />
                </span>
              </Card>
            );
          })}
        </div>
      )}

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-stone-500">বিষয়, নম্বর বিভাজন ও শিক্ষক</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">বিষয়</th>
              <th className="px-4 py-3 text-center">CQ</th>
              <th className="px-4 py-3 text-center">MCQ</th>
              <th className="px-4 py-3 text-center">PR</th>
              <th className="px-4 py-3 text-center">মোট</th>
              <th className="px-4 py-3">বরাদ্দকৃত শিক্ষক</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {SUBJECTS.map((subject) => {
              const max = getSubjectMax(subject);
              const assigned = teachers.filter((teacher) => teacher.teaching.some((item) => item.subject === subject));
              return (
                <tr key={subject} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 flex items-center gap-2 font-semibold text-stone-900"><BookOpen size={16} className="text-orange-600" /> {subject}</td>
                  <td className="px-4 py-3 text-center">{toBn(max.cq)}</td>
                  <td className="px-4 py-3 text-center">{toBn(max.mcq)}</td>
                  <td className="px-4 py-3 text-center">{max.pr > 0 ? toBn(max.pr) : '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold">{toBn(getMaxTotal(subject))}</td>
                  <td className="px-4 py-3">
                    {assigned.length === 0 ? <Badge tone="amber">শিক্ষক নির্ধারিত নেই</Badge> : (
                      <div className="flex flex-wrap gap-1.5">
                        {assigned.map((teacher) => <Badge key={teacher.id} tone="sky">{teacher.name}</Badge>)}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <p className="mt-3 text-xs text-stone-500">উত্তীর্ণ হওয়ার ন্যূনতম নম্বর: মোট নম্বরের {toBn(PASS_MARK)}%। বিজ্ঞানে PR নম্বর যুক্ত থাকে।</p>
    </>
  );
}
