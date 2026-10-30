import { useAppData } from '@/context/AppDataContext';
import { getGpa, getSubjectResult } from '@/lib/grading';
import { Badge, Modal } from '@/components/dashboard/ui';

interface ResultSearchModalProps {
  open: boolean;
  query: string;
  onClose: () => void;
}

export function ResultSearchModal({ open, query, onClose }: ResultSearchModalProps) {
  const { students, marks, institutions } = useAppData();
  const needle = query.trim().toLowerCase();

  const matches = needle
    ? students.filter((student) => student.name.toLowerCase().includes(needle) || String(student.roll) === needle)
    : [];

  return (
    <Modal open={open} title="ফলাফল অনুসন্ধান" onClose={onClose} wide>
      {matches.length === 0 ? (
        <p className="py-8 text-center text-sm text-stone-500">"{query}" নামে বা রোলে কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {matches.map((student) => {
            const approved = marks.filter((mark) => mark.studentId === student.id && mark.status === 'approved');
            const passed = approved.length > 0 && approved.every((mark) => getSubjectResult(mark).passed);
            const institution = institutions.find((item) => item.id === student.institutionId);
            return (
              <li key={student.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{student.name}</p>
                  <p className="text-xs text-stone-500">
                    {institution?.name} · {student.className} ({student.section}) · রোল {student.roll} · {student.year}
                  </p>
                </div>
                {approved.length === 0 ? (
                  <Badge tone="amber">ফলাফল প্রকাশিত হয়নি</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge tone="sky">GPA {getGpa(approved).toFixed(2)}</Badge>
                    <Badge tone={passed ? 'emerald' : 'rose'}>{passed ? 'উত্তীর্ণ' : 'অকৃতকার্য'}</Badge>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
