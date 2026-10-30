import { useState } from 'react';
import { Award, BookOpen, Phone, UserRound } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { AppUser, Student } from '@/data/demo';
import { getGpa } from '@/lib/grading';
import { Badge, Card, PageHeader, StatCard } from '@/components/dashboard/ui';
import { MarkSheet } from '@/components/dashboard/shared/MarkSheet';

function useLinkedStudents(user: AppUser): Student[] {
  const { students } = useAppData();
  const ids = user.role === 'parent' ? user.childIds : [user.studentId].filter((id): id is string => Boolean(id));
  return ids.map((id) => students.find((item) => item.id === id)).filter((item): item is Student => Boolean(item));
}

function ProfileCard({ student }: { student: Student }) {
  const rows: [string, string][] = [
    ['রোল', student.roll.toLocaleString('bn-BD')],
    ['শ্রেণি ও শাখা', `${student.className} (${student.section})`],
    ['শিক্ষাবর্ষ', student.year.toLocaleString('bn-BD')],
    ['পিতার নাম', student.fatherName],
    ['মাতার নাম', student.motherName],
    ['চতুর্থ বিষয়', student.fourthSubject ?? 'নেই'],
  ];
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <UserRound size={24} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-stone-900">{student.name}</h3>
          <p className="flex items-center gap-1.5 text-sm text-stone-500"><Phone size={14} /> {student.guardianPhone}</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-stone-50 px-3 py-2">
            <dt className="text-xs text-stone-500">{label}</dt>
            <dd className="font-semibold text-stone-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function StudentOverview({ user }: { user: AppUser }) {
  const { marks, institutions, notices } = useAppData();
  const [student] = useLinkedStudents(user);
  const institution = institutions.find((item) => item.id === user.institutionId);
  if (!student) return <NoLinkedStudent />;

  const published = marks.filter((mark) => mark.studentId === student.id && mark.status === 'approved');
  const visibleNotices = notices.filter((notice) => notice.institutionId === null || notice.institutionId === user.institutionId);

  return (
    <>
      <PageHeader title="শিক্ষার্থী ড্যাশবোর্ড" subtitle={institution?.name} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Award} label="গড় GPA" value={published.length ? getGpa(published).toFixed(2) : '—'} />
        <StatCard icon={BookOpen} label="প্রকাশিত বিষয়" value={published.length} tone="sky" />
        <StatCard icon={BookOpen} label="নোটিশ" value={visibleNotices.length} tone="emerald" />
      </div>
      <div className="mt-6"><ProfileCard student={student} /></div>
    </>
  );
}

export function ParentOverview({ user }: { user: AppUser }) {
  const children = useLinkedStudents(user);
  const { institutions } = useAppData();
  const institution = institutions.find((item) => item.id === user.institutionId);

  return (
    <>
      <PageHeader title="সন্তানের প্রোফাইল" subtitle={institution?.name} />
      {children.length === 0 ? (
        <NoLinkedStudent />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {children.map((child) => <ProfileCard key={child.id} student={child} />)}
        </div>
      )}
    </>
  );
}

export function ResultsSection({ user }: { user: AppUser }) {
  const { marks, institutions } = useAppData();
  const children = useLinkedStudents(user);
  const institution = institutions.find((item) => item.id === user.institutionId);
  const [activeId, setActiveId] = useState(children[0]?.id ?? '');
  const active = children.find((item) => item.id === activeId) ?? children[0];

  if (!active || !institution) return <NoLinkedStudent />;

  return (
    <>
      <PageHeader title="ফলাফল ও মার্কশিট" subtitle="শুধু অনুমোদিত ও প্রকাশিত ফলাফল দেখানো হয়" />
      {children.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              role="tab"
              aria-selected={child.id === active.id}
              onClick={() => setActiveId(child.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${child.id === active.id ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:border-orange-400'}`}
            >
              {child.name}
            </button>
          ))}
        </div>
      )}
      <MarkSheet student={active} institutionName={institution.name} marks={marks.filter((mark) => mark.studentId === active.id)} />
    </>
  );
}

function NoLinkedStudent() {
  return (
    <Card className="p-10 text-center">
      <Badge tone="amber">তথ্য পাওয়া যায়নি</Badge>
      <p className="mt-3 text-sm text-stone-500">এই অ্যাকাউন্টের সঙ্গে এখনো কোনো শিক্ষার্থীর তথ্য যুক্ত নেই।</p>
    </Card>
  );
}
