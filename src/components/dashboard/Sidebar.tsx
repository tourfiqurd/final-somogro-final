import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppData } from '@/context/AppDataContext';
import { NAVIGATION, sectionPath } from '@/data/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const { currentUser } = useAppData();
  if (!currentUser) return null;

  const items = NAVIGATION[currentUser.role];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-3 rounded-lg text-sm font-medium transition ${
      collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
    } ${isActive ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Collapse toggle */}
      <div className={`flex items-center border-b border-stone-200 py-2 ${collapsed ? 'justify-center px-2' : 'justify-end px-4'}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'}
          className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="প্রধান মেনু">
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
