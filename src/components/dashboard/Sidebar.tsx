import { ChevronLeft, ChevronRight, Home, LogOut, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppDataContext';
import { INSTITUTION_TYPE_LABELS, ROLE_LABELS } from '@/data/demo';
import { NAVIGATION, sectionPath } from '@/data/navigation';
import { AcademicYearSelect } from '@/components/dashboard/AcademicYearSelect';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const { currentUser, institutions, logout } = useAppData();
  const navigate = useNavigate();
  if (!currentUser) return null;

  const institution = institutions.find((item) => item.id === currentUser.institutionId);
  const items = NAVIGATION[currentUser.role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-3 rounded-lg text-sm font-medium transition ${
      collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
    } ${isActive ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Profile card at the top */}
      <div className="border-b border-stone-200 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <UserRound size={16} />
            </span>
            <button
              type="button"
              onClick={handleLogout}
              title="লগআউট"
              className="rounded-lg p-1.5 text-stone-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-stone-50 p-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <UserRound size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-stone-900">{currentUser.name}</p>
                <p className="truncate text-[11px] text-stone-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                {ROLE_LABELS[currentUser.role]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2 py-1 text-[11px] font-semibold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
              >
                <LogOut size={13} /> লগআউট
              </button>
            </div>
            {institution && (
              <p className="mt-1.5 truncate text-[10px] text-stone-400">{institution?.name ?? 'সমগ্র প্ল্যাটফর্ম'}</p>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div className={`flex items-center border-b border-stone-200 py-2 ${collapsed ? 'justify-center px-2' : 'justify-end px-4'}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'}
          className="hidden rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 lg:inline-flex"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Academic year selector */}
      {!collapsed && (
        <div className="border-b border-stone-200 px-4 py-3">
          <AcademicYearSelect />
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="প্রধান মেনু">
        <NavLink to="/" title="ওয়েবসাইট হোমপেজ" onClick={onNavigate} className={linkClass}>
          <Home size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">ওয়েবসাইট হোমপেজ</span>}
        </NavLink>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={sectionPath(currentUser.role, item)}
              end={item.path === ''}
              title={item.label}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
