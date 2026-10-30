import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import App from '@/App';
import { useAppData } from '@/context/AppDataContext';
import type { Role } from '@/data/demo';
import { NAVIGATION, dashboardPath } from '@/data/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { renderSection } from '@/components/dashboard/SectionRouter';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const ROLES = Object.keys(NAVIGATION) as Role[];

function DashboardEntry() {
  const { currentUser } = useAppData();
  return <Navigate to={currentUser ? dashboardPath(currentUser.role) : '/login'} replace />;
}

function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { currentUser } = useAppData();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role) return <Navigate to={dashboardPath(currentUser.role)} replace />;
  return <>{children}</>;
}

function SectionPage({ sectionId }: { sectionId: string }) {
  const { currentUser } = useAppData();
  if (!currentUser) return null;
  return <>{renderSection(currentUser, sectionId)}</>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardEntry />} />
      {ROLES.map((role) => (
        <Route
          key={role}
          path={dashboardPath(role)}
          element={
            <RoleGuard role={role}>
              <DashboardLayout />
            </RoleGuard>
          }
        >
          {NAVIGATION[role].map((item) =>
            item.path ? (
              <Route key={item.id} path={item.path} element={<SectionPage sectionId={item.id} />} />
            ) : (
              <Route key={item.id} index element={<SectionPage sectionId={item.id} />} />
            ),
          )}
          <Route path="*" element={<Navigate to={dashboardPath(role)} replace />} />
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
