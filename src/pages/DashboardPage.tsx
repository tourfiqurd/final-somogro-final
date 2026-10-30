import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { NAVIGATION } from '@/data/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNavbar } from '@/components/dashboard/TopNavbar';
import { renderSection } from '@/components/dashboard/SectionRouter';

export default function DashboardPage() {
  const { currentUser, logout } = useAppData();
  const [activeId, setActiveId] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!currentUser) return null;

  const items = NAVIGATION[currentUser.role];
  const activeItem = items.find((item) => item.id === activeId && !item.href) ?? items.find((item) => !item.href) ?? items[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#home';
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50">
      <TopNavbar onToggleDrawer={() => setDrawerOpen((open) => !open)} drawerOpen={drawerOpen} />

      <div className="flex min-h-0 flex-1">
        <aside
          className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-stone-200 transition-[width] duration-300 lg:block ${collapsed ? 'w-20' : 'w-72'}`}
        >
          <Sidebar
            activeId={activeItem.id}
            collapsed={collapsed}
            onSelect={handleSelect}
            onToggleCollapse={() => setCollapsed((value) => !value)}
            onLogout={handleLogout}
          />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/40 lg:hidden" onClick={() => setDrawerOpen(false)}>
            <aside onClick={(event) => event.stopPropagation()} className="h-full w-72 max-w-[85%] bg-white shadow-2xl">
              <Sidebar
                activeId={activeItem.id}
                collapsed={false}
                onSelect={handleSelect}
                onToggleCollapse={() => undefined}
                onLogout={handleLogout}
              />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {renderSection(currentUser, activeItem.id)}
        </main>
      </div>
    </div>
  );
}
