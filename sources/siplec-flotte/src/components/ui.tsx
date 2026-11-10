import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, CircleDot, Clock, Info, Lock, ShieldCheck, X } from 'lucide-react';
import { PRIORITY_LABELS, STATUS_LABELS, type AlertStatus, type Priority } from '../data/mock';
import { useFleet } from '../state/FleetContext';
import { cx } from '../utils';

export function Panel({ title, action, children, className, padded = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cx('rounded-xl border border-slate-200/80 bg-white shadow-card', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          {typeof title === 'string' ? <h2 className="font-title text-[15px] font-semibold text-navy">{title}</h2> : title}
          {action}
        </header>
      )}
      <div className={padded ? 'p-5' : undefined}>{children}</div>
    </section>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'warning' | 'success';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-700 focus-visible:ring-brand/40',
  secondary: 'border border-slate-300 bg-white text-navy hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-brand/30',
  ghost: 'text-brand hover:bg-brand-50 focus-visible:ring-brand/30',
  warning: 'bg-accent-700 text-white hover:bg-[#A8380A] focus-visible:ring-accent/40',
  success: 'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-600/40',
};

export function Button({ variant = 'primary', size = 'md', icon, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md'; icon?: ReactNode }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-2.5 text-sm',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  critique: 'bg-red-50 text-red-700 ring-red-200',
  haute: 'bg-accent-50 text-accent-700 ring-accent-100',
  moyenne: 'bg-amber-50 text-amber-800 ring-amber-200',
  faible: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const PRIORITY_ICONS: Record<Priority, ReactNode> = {
  critique: <AlertOctagon size={13} aria-hidden />,
  haute: <AlertTriangle size={13} aria-hidden />,
  moyenne: <Info size={13} aria-hidden />,
  faible: <CircleDot size={13} aria-hidden />,
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', PRIORITY_STYLES[priority])}>
      {PRIORITY_ICONS[priority]}
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

const STATUS_STYLES: Record<AlertStatus, string> = {
  a_traiter: 'bg-brand-50 text-brand-700',
  en_cours: 'bg-amber-50 text-amber-800',
  mesure_prise: 'bg-navy-50 text-navy',
  verifiee: 'bg-emerald-50 text-emerald-700',
};

const STATUS_ICONS: Record<AlertStatus, ReactNode> = {
  a_traiter: <CircleDot size={13} aria-hidden />,
  en_cours: <Clock size={13} aria-hidden />,
  mesure_prise: <ShieldCheck size={13} aria-hidden />,
  verifiee: <CheckCircle2 size={13} aria-hidden />,
};

export function StatusBadge({ status }: { status: AlertStatus }) {
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold', STATUS_STYLES[status])}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </span>
  );
}

export function CardStatusBadge({ suspended }: { suspended: boolean }) {
  return suspended ? (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700 ring-1 ring-inset ring-accent-100">
      <Lock size={12} aria-hidden /> Suspendue
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
      <CheckCircle2 size={12} aria-hidden /> Active
    </span>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="mb-1.5 text-[13px] font-medium text-slate-600">{eyebrow}</div>}
        <h1 className="font-title text-2xl font-semibold text-navy md:text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, icon, children, footer, labelId }: { open: boolean; onClose: () => void; title: string; subtitle?: string; icon?: ReactNode; children: ReactNode; footer: ReactNode; labelId: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true }), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-navy-900/50 animate-fade" onClick={onClose} aria-hidden />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={labelId} className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop animate-pop sm:rounded-2xl">
        <header className="flex items-start gap-3 border-b border-slate-100 px-6 py-5">
          {icon}
          <div className="flex-1">
            <h2 id={labelId} className="font-title text-lg font-semibold text-navy">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy" aria-label="Fermer">
            <X size={18} />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">{footer}</footer>
      </div>
    </div>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useFleet();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(380px,calc(100vw-2.5rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-pop animate-pop">
          {t.tone === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} aria-hidden /> : <Info className="mt-0.5 shrink-0 text-brand" size={20} aria-hidden />}
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">{t.title}</p>
            {t.text && <p className="mt-0.5 text-[13px] text-slate-600">{t.text}</p>}
          </div>
          <button type="button" onClick={() => dismissToast(t.id)} className="rounded p-0.5 text-slate-400 hover:text-navy" aria-label="Fermer la notification">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  // « relative » : contient les libellés sr-only positionnés en absolu, sinon ils élargissent la page.
  return <div className="relative overflow-x-auto">{children}</div>;
}

export const th = 'whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500';
export const td = 'px-4 py-3.5 text-sm text-slate-700 align-middle';
