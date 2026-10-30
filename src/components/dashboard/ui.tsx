import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { X, type LucideIcon } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const STAT_TONES = {
  orange: 'bg-orange-50 text-orange-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
};

export function StatCard({ icon: Icon, label, value, tone = 'orange' }: { icon: LucideIcon; label: string; value: number | string; tone?: keyof typeof STAT_TONES }) {
  return (
    <Card className="flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${STAT_TONES[tone]}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-stone-500">{label}</p>
        <p className="text-2xl font-bold text-stone-900">{typeof value === 'number' ? value.toLocaleString('bn-BD') : value}</p>
      </div>
    </Card>
  );
}

const BADGE_TONES = {
  neutral: 'bg-stone-100 text-stone-700',
  orange: 'bg-orange-50 text-orange-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  sky: 'bg-sky-50 text-sky-700',
};

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone]}`}>{children}</span>;
}

const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20 hover:shadow-lg',
  secondary: 'border border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-600',
  danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof BUTTON_VARIANTS }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${BUTTON_VARIANTS[variant]} ${className}`}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  );
}

export const inputClass = 'h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100';

export function Modal({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-stone-900/50 px-4 pb-10 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`mx-auto w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
