import type { MarkRecord } from '@/data/demo';

export const PASS_MARK = 33;

const SUBJECT_MAX: Record<string, { cq: number; mcq: number; pr: number }> = {
  বিজ্ঞান: { cq: 50, mcq: 25, pr: 25 },
};
const DEFAULT_MAX = { cq: 70, mcq: 30, pr: 0 };

export function getSubjectMax(subject: string) {
  return SUBJECT_MAX[subject] ?? DEFAULT_MAX;
}

export function getTotal(mark: Pick<MarkRecord, 'cq' | 'mcq' | 'pr'>) {
  return (mark.cq ?? 0) + (mark.mcq ?? 0) + (mark.pr ?? 0);
}

export function getMaxTotal(subject: string) {
  const max = getSubjectMax(subject);
  return max.cq + max.mcq + max.pr;
}

const GRADE_SCALE = [
  { min: 80, letter: 'A+', point: 5 },
  { min: 70, letter: 'A', point: 4 },
  { min: 60, letter: 'A-', point: 3.5 },
  { min: 50, letter: 'B', point: 3 },
  { min: 40, letter: 'C', point: 2 },
  { min: 33, letter: 'D', point: 1 },
  { min: 0, letter: 'F', point: 0 },
];

export function getGrade(percent: number) {
  return GRADE_SCALE.find((grade) => percent >= grade.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

export function getSubjectResult(mark: MarkRecord) {
  const total = getTotal(mark);
  const percent = (total / getMaxTotal(mark.subject)) * 100;
  const grade = getGrade(percent);
  const passed = percent >= PASS_MARK;
  return { total, percent, grade, passed };
}

export function getGpa(marks: MarkRecord[]) {
  if (marks.length === 0) return 0;
  const points = marks.map((mark) => getSubjectResult(mark).grade.point);
  return points.reduce((sum, point) => sum + point, 0) / points.length;
}
