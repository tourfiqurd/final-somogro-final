import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { getGpa, getSubjectResult } from '@/lib/grading';
import { SUBJECTS, type AppUser, type MarkRecord, type Student } from '@/data/demo';
import { Badge, Card, PageHeader, inputClass } from '@/components/dashboard/ui';
import { MarkSheet } from '@/components/dashboard/shared/MarkSheet';
import { getClassSections, getInstitutionStudents } from '@/lib/marks';

export function TabulationSection({ user }: { user: AppUser }) {
  const { students, marks, academicYear, institutions } = useAppData();
  const institution = institutions.find((item) => item.id === user.institutionId);
  const classStudents = getInstitutionStudents(students, user.institutionId ?? '', academicYear);
  const classSections = getClassSections(classStudents);
  const [selectedClass, setSelectedClass] = useState(classSections[0] ? `${classSections[0].className}|${classSections[0].section}` : '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [className, section] = selectedClass.split('|');
  const rows = classStudents
    .filter((item) => item.className === className && item.section === section)
    .sort((a, b) => a.roll - b.roll);
  const instMarks = marks.filter((mark) => classStudents.some((item) => item.id === mark.studentId));
  const detailStudent = classStudents.find((item) => item.id === selectedStudentId) ?? null;

  return (
    <>
      <PageHeader title="টেবুলেশন ও মার্কশিট" subtitle={institution?.name} />

      {classSections.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-500">এই বর্ষে কোনো শিক্ষার্থী নেই।</Card>
      ) : (
        <>
          <div className="mb-4">
            <select className={`${inputClass} sm:w-72`} value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              {classSections.map((cs) => (
                <option key={`${cs.className}|${cs.section}`} value={`${cs.className}|${cs.section}`}>
                  {cs.className} · শাখা {cs.section}
                </option>
              ))}
            </select>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
                <tr>
                  <th className="px-4 py-3">রোল</th>
                  <th className="px-4 py-3">নাম</th>
                  {SUBJECTS.map((subject) => <th key={subject} className="px-4 py-3 text-center">{subject}</th>)}
                  <th className="px-4 py-3 text-center">GPA</th>
                  <th className="px-4 py-3 text-center">ফলাফল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.map((student) => (
                  <TabulationRow
                    key={student.id}
                    student={student}
                    marks={instMarks.filter((mark) => mark.studentId === student.id)}
                    onOpen={() => setSelectedStudentId(student.id)}
                  />
                ))}
              </tbody>
            </table>
          </Card>

          {detailStudent && (
            <div className="mt-6">
              <MarkSheet
                student={detailStudent}
                institutionName={institution?.name ?? ''}
                marks={instMarks.filter((mark) => mark.studentId === detailStudent.id)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

function TabulationRow({ student, marks, onOpen }: { student: Student; marks: MarkRecord[]; onOpen: () => void }) {
  const published = marks.filter((mark) => mark.status === 'approved');
  const pending = marks.length === 0 || marks.some((mark) => mark.status !== 'approved');
  const passed = published.length > 0 && published.every((mark) => getSubjectResult(mark).passed);
  const subjectCell = (subject: string) => {
    const mark = published.find((item) => item.subject === subject);
    if (!mark) return <span className="text-stone-400">—</span>;
    const result = getSubjectResult(mark);
    return <span className={result.passed ? 'font-semibold text-stone-900' : 'font-semibold text-rose-600'}>{result.grade.letter}</span>;
  };

  return (
    <tr onClick={onOpen} className="cursor-pointer transition hover:bg-orange-50/50">
      <td className="px-4 py-3 font-mono">{student.roll}</td>
      <td className="px-4 py-3 font-semibold text-stone-900">{student.name}</td>
      {SUBJECTS.map((subject) => <td key={subject} className="px-4 py-3 text-center">{subjectCell(subject)}</td>)}
      <td className="px-4 py-3 text-center font-semibold">{published.length ? getGpa(published).toFixed(2) : '—'}</td>
      <td className="px-4 py-3 text-center">
        {published.length === 0 || pending ? <Badge tone="amber">অপেক্ষমাণ</Badge> : <Badge tone={passed ? 'emerald' : 'rose'}>{passed ? 'উত্তীর্ণ' : 'অকৃতকার্য'}</Badge>}
      </td>
    </tr>
  );
}
