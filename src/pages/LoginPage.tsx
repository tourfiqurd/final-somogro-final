import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppDataContext';
import { ROLE_LABELS, SEED_USERS, type AppUser, type Role } from '@/data/demo';

const ROLE_ICONS: Record<Role, LucideIcon> = {
  super_admin: ShieldCheck,
  principal: Building2,
  teacher: BookOpen,
  student: GraduationCap,
  parent: Users,
};

const DEMO_ACCOUNTS = SEED_USERS.filter((user) => user.id !== 'u-principal-pending');

export default function LoginPage() {
  const { login } = useAppData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDemo = (account: AppUser) => {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(email, password);
    if (result) {
      setError(result);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img src="/images/Secure_Education_Dashboard_Network.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 via-orange-500/75 to-red-500/85" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <a href="/" className="inline-flex w-fit items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles size={20} />
            </span>
            <span>
              <strong className="block text-2xl leading-none">সমগ্র</strong>
              <small className="text-xs opacity-80">সব শিক্ষা, এক প্ল্যাটফর্মে</small>
            </span>
          </a>
          <div className="max-w-md">
            <h2 className="mb-4 text-4xl font-bold leading-tight">আপনার প্রতিষ্ঠানের ফলাফল ব্যবস্থাপনা</h2>
            <p className="text-base leading-relaxed text-white/90">
              ভূমিকা অনুযায়ী আলাদা ড্যাশবোর্ড থেকে শিক্ষার্থী, নম্বর, অনুমোদন ও ফলাফল এক জায়গায় পরিচালনা করুন।
            </p>
          </div>
          <p className="text-xs text-white/70">© ২০২৬ সমগ্র। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-orange-600">
            <ArrowLeft size={16} /> ওয়েবসাইটে ফিরে যান
          </a>

          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">লগইন</span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">স্বাগতম</h1>
          <p className="mt-2 text-sm text-stone-600">আপনার ইমেইল ও পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে প্রবেশ করুন।</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">ইমেইল</span>
              <span className="relative block">
                <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-stone-300 bg-white pl-11 pr-4 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">পাসওয়ার্ড</span>
              <span className="relative block">
                <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="h-12 w-full rounded-xl border border-stone-300 bg-white pl-11 pr-12 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition hover:text-orange-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              <LogIn size={18} /> লগইন করুন
            </button>
          </form>

          <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-stone-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">ডেমো লগইন</span>
              <span className="h-px flex-1 bg-stone-200" />
            </div>
            <p className="mb-4 text-xs leading-relaxed text-stone-500">
              যেকোনো ভূমিকায় একবার ক্লিক করলে ইমেইল ও পাসওয়ার্ড বসে যাবে। সব ডেমো অ্যাকাউন্টের পাসওয়ার্ড: <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-stone-800">Demo@1234</code>
            </p>
            <div className="grid gap-2.5">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = ROLE_ICONS[account.role];
                const selected = email === account.email;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => fillDemo(account)}
                    className={`flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      selected ? 'border-orange-500 ring-4 ring-orange-100' : 'border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-stone-900">{ROLE_LABELS[account.role]}</span>
                      <span className="block truncate font-mono text-xs text-stone-500">{account.email}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-orange-600">ব্যবহার করুন</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
