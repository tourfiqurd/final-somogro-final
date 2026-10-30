import { LogOut, Sparkles } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { ROLE_LABELS } from '@/data/demo';

export default function DashboardPage() {
  const { currentUser, institutions, logout } = useAppData();
  if (!currentUser) return null;

  const institution = institutions.find((item) => item.id === currentUser.institutionId);

  const handleLogout = () => {
    logout();
    window.location.hash = '#home';
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
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-400 hover:text-orange-600"
        >
          <LogOut size={16} /> লগআউট
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
            {ROLE_LABELS[currentUser.role]}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-stone-900">স্বাগতম, {currentUser.name}</h1>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-stone-100 pb-3">
              <dt className="text-stone-500">ইমেইল</dt>
              <dd className="font-mono text-stone-800">{currentUser.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 pb-3">
              <dt className="text-stone-500">প্রতিষ্ঠান</dt>
              <dd className="text-right text-stone-800">{institution ? institution.name : 'সমগ্র প্ল্যাটফর্ম'}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-stone-500">
            ভূমিকা অনুযায়ী পূর্ণাঙ্গ ড্যাশবোর্ড (সাইডবার ও মেনু সহ) এর কাজ পরবর্তী ধাপে যুক্ত হবে।
          </p>
        </div>
      </main>
    </div>
  );
}
