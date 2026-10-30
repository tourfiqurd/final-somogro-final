import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-stone-50">
      <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-stone-200 transition-[width] duration-300 lg:block ${collapsed ? 'w-20' : 'w-72'}`}>
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} onNavigate={() => undefined} />
      </aside>

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
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700 lg:hidden"
        >
          <Menu size={18} /> মেনু
        </button>
        <Outlet />
      </main>
    </div>
  );
}
