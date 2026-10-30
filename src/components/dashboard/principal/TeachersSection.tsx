import { useState, type FormEvent } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { SUBJECTS, type AppUser, type TeachingAssignment } from '@/data/demo';
import { Badge, Button, Card, Field, Modal, PageHeader, inputClass } from '@/components/dashboard/ui';
import { getClassSections, getInstitutionStudents } from '@/lib/marks';

export function TeachersSection({ user }: { user: AppUser }) {
  const { users, students, academicYear, addTeacher, setTeaching } = useAppData();
  const [addOpen, setAddOpen] = useState(false);
  const [assigning, setAssigning] = useState<AppUser | null>(null);

  const teachers = users.filter((item) => item.role === 'teacher' && item.institutionId === user.institutionId);
  const classSections = getClassSections(getInstitutionStudents(students, user.institutionId ?? '', academicYear));

  return (
    <>
      <PageHeader
        title="শিক্ষক ও বিষয় বণ্টন"
        subtitle="শিক্ষকদের অ্যাকাউন্ট তৈরি ও শ্রেণি-বিষয় নির্ধারণ"
        actions={<Button onClick={() => setAddOpen(true)}><Plus size={16} /> নতুন শিক্ষক</Button>}
      />

      {teachers.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-500">এখনো কোনো শিক্ষক যুক্ত করা হয়নি।</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="flex flex-col gap-4 p-5">
              <div>
                <p className="font-bold text-stone-900">{teacher.name}</p>
                <p className="text-xs text-stone-500">{teacher.email} · {teacher.phone}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.teaching.length === 0 && <span className="text-xs text-stone-400">কোনো বিষয় বরাদ্দ নেই</span>}
                {teacher.teaching.map((item) => (
                  <Badge key={`${item.className}${item.section}${item.subject}`} tone="sky">
                    {item.className} ({item.section}) · {item.subject}
                  </Badge>
                ))}
              </div>
              <Button variant="secondary" className="mt-auto" onClick={() => setAssigning(teacher)}>বিষয় বণ্টন করুন</Button>
            </Card>
          ))}
        </div>
      )}

      <AddTeacherModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addTeacher} />
      {assigning && (
        <AssignModal
          key={assigning.id}
          teacher={assigning}
          classSections={classSections}
          onClose={() => setAssigning(null)}
          onSave={(assignments) => {
            setTeaching(assigning.id, assignments);
            setAssigning(null);
          }}
        />
      )}
    </>
  );
}

const EMPTY_TEACHER = { name: '', email: '', phone: '', password: '' };

function AddTeacherModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (input: typeof EMPTY_TEACHER) => string | null }) {
  const [form, setForm] = useState(EMPTY_TEACHER);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof EMPTY_TEACHER) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('নাম, ইমেইল ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।');
      return;
    }
    const result = onSubmit(form);
    if (result) {
      setError(result);
      return;
    }
    setForm(EMPTY_TEACHER);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} title="নতুন শিক্ষকের অ্যাকাউন্ট" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="শিক্ষকের নাম"><input className={inputClass} value={form.name} onChange={update('name')} /></Field>
        <Field label="ইমেইল"><input type="email" className={inputClass} value={form.email} onChange={update('email')} /></Field>
        <Field label="ফোন"><input className={inputClass} value={form.phone} onChange={update('phone')} /></Field>
        <Field label="অস্থায়ী পাসওয়ার্ড"><input type="text" className={inputClass} value={form.password} onChange={update('password')} /></Field>
        {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>বাতিল</Button>
          <Button type="submit"><UserPlus size={16} /> অ্যাকাউন্ট তৈরি</Button>
        </div>
      </form>
    </Modal>
  );
}

function AssignModal({
  teacher,
  classSections,
  onClose,
  onSave,
}: {
  teacher: AppUser;
  classSections: { className: string; section: string }[];
  onClose: () => void;
  onSave: (assignments: TeachingAssignment[]) => void;
}) {
  const [selected, setSelected] = useState<TeachingAssignment[]>(teacher.teaching);
  const isChecked = (item: TeachingAssignment) =>
    selected.some((entry) => entry.className === item.className && entry.section === item.section && entry.subject === item.subject);

  const toggle = (item: TeachingAssignment) => {
    setSelected((prev) => (isChecked(item) ? prev.filter((entry) => !(entry.className === item.className && entry.section === item.section && entry.subject === item.subject)) : [...prev, item]));
  };

  return (
    <Modal open title={`${teacher.name} · বিষয় বণ্টন`} onClose={onClose} wide>
      {classSections.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-500">প্রথমে শিক্ষার্থী ভর্তি করুন, তারপর বিষয় বণ্টন করা যাবে।</p>
      ) : (
        <div className="space-y-5">
          {classSections.map((cs) => (
            <div key={`${cs.className}${cs.section}`}>
              <p className="mb-2 text-sm font-bold text-stone-900">{cs.className} · শাখা {cs.section}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SUBJECTS.map((subject) => {
                  const item = { className: cs.className, section: cs.section, subject };
                  const checked = isChecked(item);
                  return (
                    <label
                      key={subject}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${checked ? 'border-orange-400 bg-orange-50 text-orange-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}
                    >
                      <input type="checkbox" className="accent-orange-600" checked={checked} onChange={() => toggle(item)} />
                      {subject}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>বাতিল</Button>
            <Button onClick={() => onSave(selected)}>সংরক্ষণ করুন</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
