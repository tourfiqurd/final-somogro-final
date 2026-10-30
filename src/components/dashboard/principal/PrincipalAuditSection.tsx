import { useAppData } from '@/context/AppDataContext';
import type { AppUser } from '@/data/demo';
import { AuditSection } from '@/components/dashboard/admin/AdminSections';

export function PrincipalAuditSection({ user }: { user: AppUser }) {
  const { users } = useAppData();
  const names = users.filter((item) => item.institutionId === user.institutionId).map((item) => item.name);
  return <AuditSection actorNames={names} />;
}
