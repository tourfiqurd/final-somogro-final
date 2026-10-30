import { useState, type FormEvent } from 'react';
import { CalendarPlus, Save, Trash2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { AppUser } from '@/data/demo';
import { Button, Card, Field, PageHeader, inputClass } from '@/components/dashboard/ui';

const toBn = (value: number) => value.toLocaleString('bn-BD', { useGrouping: false });

export function SettingsSection({ user }: { user: AppUser }) {
  return (
    <>
      <PageHeader title="প্রতিষ্ঠান সেটিংস" subtitle="প্রতিষ্ঠানের তথ্য ও শিক্ষাবর্ষ ব্যবস্থাপনা" />
      <div className="grid gap-6 xl:grid-cols-2">
        <InstitutionForm user={user} />
        <AcademicYearManager />
      </div>
    </>
  );
}

function InstitutionForm({ user }: { user: AppUser }) {
  const { institutions, updateInstitution } = useAppData();
  const institution = institutions.find((item) => item.id === user.institutionId);
  const [form, setForm] = useState({
    name: institution?.name ?? '',
    principalName: institution?.principalName ?? '',
    phone: institution?.phone ?? '',
    address: institution?.address ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!institution) return null;

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.principalName.trim() || !form.address.trim()) {
      setError('প্রতিষ্ঠানের নাম, অধ্যক্ষের নাম ও ঠিকানা আবশ্যক।');
      return;
    }
    if (!/^01\d{9}$/.test(form.phone.trim())) {
      setError('সঠিক মোবাইল নম্বর দিন (০১ দিয়ে শুরু, ১১ সংখ্যা)।');
      return;
    }
    setError(null);
    updateInstitution(institution.id, {
      name: form.name.trim(),
      principalName: form.principalName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    setSaved(true);
  };

  return (
    <Card className="p-6">
      <h2 className="font-bold text-stone-900">প্রতিষ্ঠানের তথ্য</h2>
      <p className="mt-1 text-xs text-stone-500">EIIN ({institution.eiin}) পরিবর্তন করা যাবে না।</p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <Field label="প্রতিষ্ঠানের নাম"><input className={inputClass} value={form.name} onChange={update('name')} /></Field>
        <Field label="অধ্যক্ষের নাম"><input className={inputClass} value={form.principalName} onChange={update('principalName')} /></Field>
        <Field label="মোবাইল নম্বর"><input className={inputClass} value={form.phone} onChange={update('phone')} /></Field>
        <Field label="ঠিকানা"><input className={inputClass} value={form.address} onChange={update('address')} /></Field>
        {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
        {saved && <p className="text-sm font-semibold text-emerald-700">তথ্য সংরক্ষণ করা হয়েছে।</p>}
        <div className="flex justify-end">
          <Button type="submit"><Save size={16} /> সংরক্ষণ করুন</Button>
        </div>
      </form>
    </Card>
  );
}

function AcademicYearManager() {
  const { academicYears, academicYear, addAcademicYear, deleteAcademicYear, students } = useAppData();
  const [yearInput, setYearInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const year = Number(yearInput);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      setError('সঠিক বছর লিখুন (২০০০ থেকে ২১০০)।');
      return;
    }
    const result = addAcademicYear(year);
    if (result) {
      setError(result);
      return;
    }
    setError(null);
    setYearInput('');
  };

  const handleDelete = (year: number) => {
    const count = students.filter((item) => item.year === year).length;
    if (count > 0) {
      setError(`${toBn(year)} শিক্ষাবর্ষে ${toBn(count)} জন শিক্ষার্থী আছে, তাই মোছা যাবে না।`);
      return;
    }
    if (window.confirm(`${toBn(year)} শিক্ষাবর্ষ মুছে ফেলতে চান?`)) {
      setError(deleteAcademicYear(year));
    }
  };

  return (
    <Card className="p-6">
      <h2 className="font-bold text-stone-900">শিক্ষাবর্ষ ব্যবস্থাপনা</h2>
      <p className="mt-1 text-xs text-stone-500">বর্তমান বর্ষ: {toBn(academicYear)}</p>

      <ul className="mt-5 divide-y divide-stone-100 rounded-xl border border-stone-200">
        {academicYears.map((year) => {
          const count = students.filter((item) => item.year === year).length;
          return (
            <li key={year} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-semibold text-stone-900">শিক্ষাবর্ষ {toBn(year)}</p>
                <p className="text-xs text-stone-500">{toBn(count)} জন শিক্ষার্থী</p>
              </div>
              <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => handleDelete(year)}>
                <Trash2 size={14} /> মুছুন
              </Button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAdd} className="mt-5 flex gap-2">
        <input
          inputMode="numeric"
          placeholder="নতুন বছর, যেমন ২০২৮"
          value={yearInput}
          onChange={(event) => setYearInput(event.target.value)}
          className={inputClass}
        />
        <Button type="submit" variant="secondary"><CalendarPlus size={16} /> যুক্ত করুন</Button>
      </form>
      {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
    </Card>
  );
}
