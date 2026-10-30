import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useAppData, type RegistrationInput } from '@/context/AppDataContext';
import { INSTITUTION_TYPE_LABELS, type InstitutionType } from '@/data/demo';
import { Button, Card, Field, inputClass } from '@/components/dashboard/ui';

const EMPTY_FORM = {
  name: '',
  type: 'school' as InstitutionType,
  eiin: '',
  address: '',
  principalName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const { registerInstitution } = useAppData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof EMPTY_FORM) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const required = [form.name, form.eiin, form.address, form.principalName, form.phone, form.email];
    if (required.some((value) => !value.trim())) {
      setError('সব তথ্য পূরণ করুন।');
      return;
    }
    if (!/^\d{6}$/.test(form.eiin.trim())) {
      setError('EIIN নম্বর ৬ সংখ্যার হতে হবে।');
      return;
    }
    if (!/^01\d{9}$/.test(form.phone.trim())) {
      setError('সঠিক মোবাইল নম্বর দিন (০১ দিয়ে শুরু, ১১ সংখ্যা)।');
      return;
    }
    if (form.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('পাসওয়ার্ড দুটি মেলেনি।');
      return;
    }
    const input: RegistrationInput = {
      name: form.name,
      type: form.type,
      eiin: form.eiin,
      address: form.address,
      principalName: form.principalName,
      phone: form.phone,
      email: form.email,
      password: form.password,
    };
    const result = registerInstitution(input);
    if (result) {
      setError(result);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50">
      <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-5">
        <a href="#home" className="inline-flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <Sparkles size={18} />
          </span>
          <strong className="text-lg text-stone-900">সমগ্র</strong>
        </a>
        <a href="#home" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-600">
          <ArrowLeft size={16} /> হোমপেজে ফিরুন
        </a>
      </header>

      <main className="flex flex-1 items-start justify-center p-4 sm:p-8">
        <Card className="w-full max-w-3xl p-6 sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={34} />
              </span>
              <h1 className="mt-5 text-2xl font-bold text-stone-900">আবেদন জমা হয়েছে</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500">
                সুপার অ্যাডমিন আপনার প্রতিষ্ঠান যাচাই করে অনুমোদন দিলে আপনি উপরের ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
              </p>
              <a href="#/login" className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20">
                লগইন পাতায় যান
              </a>
            </div>
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-wide text-orange-700">প্রতিষ্ঠান নিবন্ধন</span>
              <h1 className="mt-2 text-2xl font-bold text-stone-900">আপনার প্রতিষ্ঠান নিবন্ধন করুন</h1>
              <p className="mt-2 text-sm text-stone-500">তথ্য জমা দেওয়ার পর সুপার অ্যাডমিন যাচাই করে অনুমোদন দেবেন।</p>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="প্রতিষ্ঠানের নাম"><input className={inputClass} value={form.name} onChange={update('name')} /></Field>
                <Field label="প্রতিষ্ঠানের ধরন">
                  <select className={inputClass} value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as InstitutionType }))}>
                    {(Object.keys(INSTITUTION_TYPE_LABELS) as InstitutionType[]).map((type) => (
                      <option key={type} value={type}>{INSTITUTION_TYPE_LABELS[type]}</option>
                    ))}
                  </select>
                </Field>
                <Field label="EIIN নম্বর (৬ সংখ্যা)"><input inputMode="numeric" maxLength={6} className={inputClass} value={form.eiin} onChange={update('eiin')} /></Field>
                <Field label="অধ্যক্ষের নাম"><input className={inputClass} value={form.principalName} onChange={update('principalName')} /></Field>
                <Field label="ঠিকানা"><input className={inputClass} value={form.address} onChange={update('address')} /></Field>
                <Field label="মোবাইল নম্বর"><input inputMode="tel" className={inputClass} value={form.phone} onChange={update('phone')} /></Field>
                <Field label="ইমেইল (লগইন আইডি)"><input type="email" className={inputClass} value={form.email} onChange={update('email')} /></Field>
                <span className="hidden sm:block" />
                <Field label="পাসওয়ার্ড"><input type="password" className={inputClass} value={form.password} onChange={update('password')} /></Field>
                <Field label="পাসওয়ার্ড নিশ্চিত করুন"><input type="password" className={inputClass} value={form.confirmPassword} onChange={update('confirmPassword')} /></Field>

                {error && <p className="text-sm font-semibold text-rose-600 sm:col-span-2">{error}</p>}

                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full py-3">নিবন্ধনের আবেদন জমা দিন</Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
