import { useState, type FormEvent } from 'react';
import { Activity, LogOut, Menu, Search, Sparkles, X } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { DEMO_PASSWORD, ROLE_LABELS, SEED_USERS } from '@/data/demo';
import { AcademicYearSelect } from '@/components/dashboard/AcademicYearSelect';
import { ResultSearchModal } from '@/components/dashboard/ResultSearchModal';
import { inputClass } from '@/components/dashboard/ui';

interface TopNavbarProps {
  onToggleDrawer: () => void;
  drawerOpen: boolean;
}

export function TopNavbar({ onToggleDrawer, drawerOpen }: TopNavbarProps) {
  const { currentUser, institutions, login, logout } = useAppData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [switchError, setSwitchError] = useState<string | null>(null);

  const institution = institutions.find((item) => item.id === currentUser?.institutionId);
  const demoAccounts = SEED_USERS.filter((user) => {
    const owner = institutions.find((item) => item.id === user.institutionId);
    return owner?.status !== 'pending';
  });

  const handleRoleSwitch = (email: string) => {
    if (!email) return;
    logout();
    const error = login(email, DEMO_PASSWORD);
    setSwitchError(error);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) setSearchOpen(true);
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#home';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label={drawerOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          className="inline-flex rounded-lg p-2 text-stone-700 transition hover:bg-stone-100 lg:hidden"
        >
          {drawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a href="#home" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <Sparkles size={18} />
          </span>
          <span className="min-w-0 hidden sm:block">
            <strong className="block text-base leading-tight text-stone-900">সমগ্র</strong>
            <span className="block truncate text-xs text-stone-500">
              {institution ? `${institution.name} · EIIN ${institution.eiin}` : 'সব শিক্ষা, এক প্ল্যাটফর্মে'}
            </span>
          </span>
        </a>

        <a href="#home" className="hidden rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-400 hover:text-orange-600 md:inline-flex">
          হোমপেজ
        </a>

        <form onSubmit={handleSearch} className="ml-auto hidden min-w-0 max-w-xs flex-1 md:flex">
          <label className="relative w-full">
            <span className="sr-only">ফলাফল খুঁজুন</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="রোল বা নাম দিয়ে ফলাফল খুঁজুন"
              className={`${inputClass} pl-9`}
            />
          </label>
        </form>

        <div className="ml-auto hidden xl:block">
          <AcademicYearSelect />
        </div>

        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 2xl:inline-flex" title="ডেটা এখন মেমোরিতে সংরক্ষিত">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <Activity size={14} /> ডেটাবেস সক্রিয়
        </span>

        <label className="hidden lg:block">
          <span className="sr-only">ডেমো ভূমিকা পরিবর্তন</span>
          <select
            value={currentUser?.email ?? ''}
            onChange={(event) => handleRoleSwitch(event.target.value)}
            className="h-9 max-w-[11rem] cursor-pointer rounded-lg border border-stone-300 bg-white px-2 text-xs font-semibold text-stone-700 outline-none focus:border-orange-500"
          >
            {demoAccounts.map((user) => (
              <option key={user.id} value={user.email}>
                {ROLE_LABELS[user.role]} · {user.email}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">লগআউট</span>
        </button>
      </div>

      {switchError && (
        <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 lg:px-6">{switchError}</p>
      )}

      <ResultSearchModal open={searchOpen} query={searchValue} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
