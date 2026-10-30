import { CalendarDays, GraduationCap, Home, LogOut, Menu, UserRound, X } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { INSTITUTION_TYPE_LABELS, ROLE_LABELS } from '@/data/demo';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AcademicYearSelect } from '@/components/dashboard/AcademicYearSelect';

export function DashboardLayout() {
  const { currentUser, institutions, logout } = useAppData();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!currentUser) return null;
  const institution = institutions.find((item) => item.id === currentUser.institutionId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-4 shadow-sm">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="মেনু খুলুন"
          className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <GraduationCap size={18} />
          </span>
          <span className="hidden sm:block">
            <strong className="block text-sm leading-none text-stone-900">সমগ্র</strong>
            <small className="text-[11px] text-stone-500">{ROLE_LABELS[currentUser.role]}</small>
          </span>
        </a>

        <div className="mx-1 hidden h-8 w-px bg-stone-200 md:block" />

        {/* Institution */}
        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="truncate text-sm font-semibold text-stone-700">{institution?.name ?? 'সমগ্র প্ল্যাটফর্ম'}</span>
          {institution && (
            <span className="hidden shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500 lg:inline-block">
              {INSTITUTION_TYPE_LABELS[institution.type]} · EIIN {institution.eiin}
            </span>
          )}
        </div>

        {/* Academic year */}
        <div className="ml-auto hidden w-44 items-center sm:flex">
          <AcademicYearSelect />
        </div>

        {/* Homepage */}
        <a
          href="/"
          className="hidden items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700 md:inline-flex"
        >
          <Home size={16} /> ওয়েবসাইট
        </a>

        {/* Profile */}
        <div className="flex items-center gap-2.5 border-l border-stone-200 pl-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <UserRound size={16} />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-stone-900">{currentUser.name}</p>
            <p className="truncate text-[11px] text-stone-500">{currentUser.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="লগআউট"
            title="লগআউট"
            className="rounded-lg p-1.5 text-stone-500 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar: full height from top of viewport */}
        <aside className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-stone-200 transition-[width] duration-300 lg:block ${collapsed ? 'w-20' : 'w-72'}`}>
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} onNavigate={() => undefined} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/40 lg:hidden" onClick={() => setDrawerOpen(false)}>
            <aside onClick={(event) => event.stopPropagation()} className="h-full w-72 max-w-[85%] bg-white shadow-2xl">
              <div className="flex justify-end p-3">
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="মেনু বন্ধ করুন" className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100">
                  <X size={20} />
                </button>
              </div>
              <Sidebar collapsed={false} onToggleCollapse={() => undefined} onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
