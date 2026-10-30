import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, Clock, Ban, GraduationCap, ScrollText, Trash2, Users } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import {
  INSTITUTION_STATUS_LABELS,
  INSTITUTION_TYPE_LABELS,
  ROLE_LABELS,
  type AppUser,
  type InstitutionStatus,
} from '@/data/demo';
import { Badge, Button, Card, PageHeader, StatCard, inputClass } from '@/components/dashboard/ui';

const STATUS_TONE: Record<InstitutionStatus, 'emerald' | 'amber' | 'rose'> = {
  active: 'emerald',
  pending: 'amber',
  suspended: 'rose',
};

export function AdminOverview() {
  const { institutions, students, users, notices, setInstitutionStatus } = useAppData();
  const pending = institutions.filter((item) => item.status === 'pending');

  return (
    <>
      <PageHeader title="এডমিন ড্যাশবোর্ড" subtitle="প্ল্যাটফর্মের সার্বিক অবস্থা এক নজরে" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Building2} label="মোট প্রতিষ্ঠান" value={institutions.length} />
        <StatCard icon={CheckCircle2} label="সক্রিয় প্রতিষ্ঠান" value={institutions.filter((item) => item.status === 'active').length} tone="emerald" />
        <StatCard icon={GraduationCap} label="মোট শিক্ষার্থী" value={students.length} tone="sky" />
        <StatCard icon={Users} label="মোট ব্যবহারকারী" value={users.length} tone="rose" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-bold text-stone-900">অনুমোদনের অপেক্ষায় প্রতিষ্ঠান</h2>
          {pending.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-500">কোনো আবেদন অপেক্ষমাণ নেই।</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {pending.map((item) => (
                <li key={item.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-xs text-stone-500">{INSTITUTION_TYPE_LABELS[item.type]} · EIIN {item.eiin} · {item.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="success" onClick={() => setInstitutionStatus(item.id, 'active')}><CheckCircle2 size={15} /> অনুমোদন</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-bold text-stone-900">সাম্প্রতিক নোটিশ</h2>
          <ul className="divide-y divide-stone-100">
            {notices.slice(0, 4).map((notice) => (
              <li key={notice.id} className="py-3">
                <p className="font-semibold text-stone-900">{notice.title}</p>
                <p className="text-xs text-stone-500">{notice.audience} · {notice.date}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

export function InstitutionsSection() {
  const { institutions, students, setInstitutionStatus, deleteInstitution } = useAppData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InstitutionStatus>('all');

  const rows = institutions.filter((item) => {
    const matchesText = item.name.includes(query.trim()) || item.eiin.includes(query.trim());
    return matchesText && (statusFilter === 'all' || item.status === statusFilter);
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`"${name}" প্রতিষ্ঠান এবং এর সব তথ্য মুছে ফেলতে চান?`)) deleteInstitution(id);
  };

  return (
    <>
      <PageHeader title="প্রতিষ্ঠান নিয়ন্ত্রণ" subtitle="নিবন্ধন অনুমোদন, স্থগিত ও মুছে ফেলা" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input className={inputClass} placeholder="নাম বা EIIN দিয়ে খুঁজুন" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={`${inputClass} sm:w-48`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | InstitutionStatus)}>
          <option value="all">সব অবস্থা</option>
          {(Object.keys(INSTITUTION_STATUS_LABELS) as InstitutionStatus[]).map((status) => (
            <option key={status} value={status}>{INSTITUTION_STATUS_LABELS[status]}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">প্রতিষ্ঠান</th>
              <th className="px-4 py-3">ধরন</th>
              <th className="px-4 py-3">EIIN</th>
              <th className="px-4 py-3">শিক্ষার্থী</th>
              <th className="px-4 py-3">অবস্থা</th>
              <th className="px-4 py-3 text-right">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((item) => (
              <tr key={item.id} className="transition hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-stone-900">{item.name}</p>
                  <p className="text-xs text-stone-500">{item.address}</p>
                </td>
                <td className="px-4 py-3">{INSTITUTION_TYPE_LABELS[item.type]}</td>
                <td className="px-4 py-3 font-mono">{item.eiin}</td>
                <td className="px-4 py-3">{students.filter((student) => student.institutionId === item.id).length}</td>
                <td className="px-4 py-3"><Badge tone={STATUS_TONE[item.status]}>{INSTITUTION_STATUS_LABELS[item.status]}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.status !== 'active' && (
                      <Button variant="success" className="px-2.5 py-1.5 text-xs" onClick={() => setInstitutionStatus(item.id, 'active')}>
                        <CheckCircle2 size={14} /> সক্রিয়
                      </Button>
                    )}
                    {item.status === 'active' && (
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setInstitutionStatus(item.id, 'suspended')}>
                        <Ban size={14} /> স্থগিত
                      </Button>
                    )}
                    {item.status === 'pending' && (
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setInstitutionStatus(item.id, 'suspended')}>
                        <Clock size={14} /> স্থগিত রাখুন
                      </Button>
                    )}
                    <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => handleDelete(item.id, item.name)}>
                      <Trash2 size={14} /> মুছুন
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-500">কোনো প্রতিষ্ঠান পাওয়া যায়নি।</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function UsersSection({ currentUser }: { currentUser: AppUser }) {
  const { users, institutions, deleteUser } = useAppData();

  const handleDelete = (user: AppUser) => {
    if (window.confirm(`"${user.name}" ব্যবহারকারীকে মুছে ফেলতে চান?`)) deleteUser(user.id);
  };

  return (
    <>
      <PageHeader title="ইউজার ও পাসওয়ার্ড" subtitle="সব ব্যবহারকারীর অ্যাকাউন্ট ও ভূমিকা" />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500">
            <tr>
              <th className="px-4 py-3">নাম</th>
              <th className="px-4 py-3">ইমেইল</th>
              <th className="px-4 py-3">ভূমিকা</th>
              <th className="px-4 py-3">প্রতিষ্ঠান</th>
              <th className="px-4 py-3 text-right">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => {
              const institution = institutions.find((item) => item.id === user.institutionId);
              const isSelf = user.id === currentUser.id;
              return (
                <tr key={user.id} className="transition hover:bg-stone-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">{user.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{user.email}</td>
                  <td className="px-4 py-3"><Badge tone="orange">{ROLE_LABELS[user.role]}</Badge></td>
                  <td className="px-4 py-3 text-stone-600">{institution?.name ?? 'সমগ্র প্ল্যাটফর্ম'}</td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => handleDelete(user)}>
                        <Trash2 size={14} /> মুছুন
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function AuditSection({ actorNames }: { actorNames?: string[] }) {
  const { auditLogs: allLogs } = useAppData();
  const auditLogs = actorNames ? allLogs.filter((item) => actorNames.includes(item.actor)) : allLogs;
  const [query, setQuery] = useState('');
  const [actor, setActor] = useState('all');

  const actors = useMemo(() => Array.from(new Set(auditLogs.map((item) => item.actor))), [auditLogs]);
  const rows = auditLogs.filter((item) => {
    const matchesText = item.action.includes(query.trim()) || item.actor.includes(query.trim());
    return matchesText && (actor === 'all' || item.actor === actor);
  });

  return (
    <>
      <PageHeader title="অডিট ও নিরাপত্তা লগ" subtitle="সব গুরুত্বপূর্ণ কার্যক্রমের নথি" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input className={inputClass} placeholder="কাজ বা ব্যক্তির নাম দিয়ে খুঁজুন" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={`${inputClass} sm:w-64`} value={actor} onChange={(event) => setActor(event.target.value)}>
          <option value="all">সব ব্যবহারকারী</option>
          {actors.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <Card className="divide-y divide-stone-100">
        {rows.length === 0 && <p className="p-10 text-center text-sm text-stone-500">কোনো লগ পাওয়া যায়নি।</p>}
        {rows.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-600">
              <ScrollText size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-stone-900"><span className="font-semibold">{item.actor}</span> {item.action}</p>
              <p className="mt-0.5 text-xs text-stone-400">{item.at}</p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
