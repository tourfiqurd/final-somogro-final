import { ChevronLeft, ChevronRight, LogOut, UserRound } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { INSTITUTION_TYPE_LABELS, ROLE_LABELS } from '@/data/demo';
import { NAVIGATION } from '@/data/navigation';
import { AcademicYearSelect } from '@/components/dashboard/AcademicYearSelect';

interface SidebarProps {
  activeId: string;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Sidebar({ activeId, collapsed, onSelect, onToggleCollapse, onLogout }: SidebarProps) {
  const { currentUser, institutions } = useAppData();
  if (!currentUser) return null;

  const institution = institutions.find((item) => item.id === currentUser.institutionId);
  const items = NAVIGATION[currentUser.role];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={`flex items-center border-b border-stone-200 py-4 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {!collapsed && (
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
              {ROLE_LABELS[currentUser.role]}
            </span>
            <p className="mt-1 truncate text-sm font-semibold text-stone-900">{institution?.name ?? 'সমগ্র প্ল্যাটফর্ম'}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'}
          className="hidden rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 lg:inline-flex"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="border-b border-stone-200 px-4 py-3">
          <AcademicYearSelect />
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="প্রধান মেনু">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          const className = `flex w-full items-center gap-3 rounded-lg text-sm font-medium transition ${
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
          } ${active ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`;
          const content = (
            <>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </>
          );
          return item.href ? (
            <a key={item.id} href={item.href} title={item.label} className={className}>
              {content}
            </a>
          ) : (
            <button key={item.id} type="button" title={item.label} onClick={() => onSelect(item.id)} className={className} aria-current={active ? 'page' : undefined}>
              {content}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-stone-200 p-3">
        {collapsed ? (
          <button type="button" onClick={onLogout} title="লগআউট" className="grid w-full place-items-center rounded-lg p-2.5 text-stone-600 transition hover:bg-rose-50 hover:text-rose-600">
            <LogOut size={18} />
          </button>
        ) : (
          <div className="rounded-xl bg-stone-50 p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <UserRound size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900">{currentUser.name}</p>
                <p className="truncate text-xs text-stone-500">{currentUser.email}</p>
              </div>
            </div>
            {institution && (
              <p className="mt-2 text-xs text-stone-500">{INSTITUTION_TYPE_LABELS[institution.type]} · EIIN {institution.eiin}</p>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
            >
              <LogOut size={16} /> লগআউট
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
