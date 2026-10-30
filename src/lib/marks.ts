import type { MarkRecord, Student } from '@/data/demo';

export interface SubmittedGroup {
  className: string;
  section: string;
  subject: string;
  count: number;
}

export function getInstitutionStudents(students: Student[], institutionId: string, year: number) {
  return students.filter((item) => item.institutionId === institutionId && item.year === year);
}

export function getSubmittedGroups(marks: MarkRecord[], classStudents: Student[]): SubmittedGroup[] {
  const groups = new Map<string, SubmittedGroup>();
  marks.forEach((mark) => {
    if (mark.status !== 'submitted') return;
    const student = classStudents.find((item) => item.id === mark.studentId);
    if (!student) return;
    const key = `${student.className}|${student.section}|${mark.subject}`;
    const existing = groups.get(key);
    if (existing) existing.count += 1;
    else groups.set(key, { className: student.className, section: student.section, subject: mark.subject, count: 1 });
  });
  return Array.from(groups.values());
}

export function getClassSections(students: Student[]) {
  const pairs = new Map<string, { className: string; section: string }>();
  students.forEach((item) => pairs.set(`${item.className}|${item.section}`, { className: item.className, section: item.section }));
  return Array.from(pairs.values()).sort((a, b) => `${a.className}${a.section}`.localeCompare(`${b.className}${b.section}`));
}
