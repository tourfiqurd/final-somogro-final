import { useState, type FormEvent } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { AppUser } from '@/data/demo';
import { Badge, Button, Card, Modal, PageHeader, inputClass } from '@/components/dashboard/ui';

interface NoticesSectionProps {
  user: AppUser;
  audienceOptions: string[];
  canPublish: boolean;
}

export function NoticesSection({ user, audienceOptions, canPublish }: NoticesSectionProps) {
  const { notices, addNotice, deleteNotice } = useAppData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState(audienceOptions[0] ?? '');
  const [error, setError] = useState<string | null>(null);

  const isPlatformAdmin = user.role === 'super_admin';
  const visible = notices.filter((notice) => isPlatformAdmin || notice.institutionId === null || notice.institutionId === user.institutionId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('শিরোনাম ও বিস্তারিত দুটোই লিখুন।');
      return;
    }
    addNotice({
      title: title.trim(),
      body: body.trim(),
      audience,
      institutionId: isPlatformAdmin ? null : user.institutionId,
    });
    setTitle('');
    setBody('');
    setError(null);
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="নোটিশ বোর্ড"
        subtitle="প্রকাশিত ঘোষণা ও গুরুত্বপূর্ণ তথ্য"
        actions={canPublish && <Button onClick={() => setOpen(true)}><Plus size={16} /> নতুন নোটিশ</Button>}
      />

      {visible.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-500">কোনো নোটিশ নেই।</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((notice) => {
            const ownNotice = isPlatformAdmin ? notice.institutionId === null : notice.institutionId === user.institutionId;
            return (
              <Card key={notice.id} className="flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                    <Bell size={18} />
                  </span>
                  <Badge tone="neutral">{notice.audience}</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">{notice.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{notice.body}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="text-xs text-stone-400">{notice.date}</span>
                  {canPublish && ownNotice && (
                    <button
                      type="button"
                      onClick={() => deleteNotice(notice.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 size={14} /> মুছুন
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} title="নতুন নোটিশ প্রকাশ" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-700">শিরোনাম</span>
            <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-700">বিস্তারিত</span>
            <textarea rows={4} className={`${inputClass} h-auto py-2`} value={body} onChange={(event) => setBody(event.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-700">প্রাপক</span>
            <select className={inputClass} value={audience} onChange={(event) => setAudience(event.target.value)}>
              {audienceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>বাতিল</Button>
            <Button type="submit">প্রকাশ করুন</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
