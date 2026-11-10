import { useState, type ReactNode } from 'react';
import { BarChart3, Bell, CreditCard, FlaskConical, LayoutDashboard, Menu, Receipt, RotateCcw, Truck, Users, X, Zap } from 'lucide-react';
import { COMPANY, CURRENT_USER } from '../data/mock';
import type { Route } from '../router';
import { useFleet } from '../state/FleetContext';
import { cx } from '../utils';

const NAV: { key: Route['page']; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Vue d’ensemble', href: '#/', icon: LayoutDashboard },
  { key: 'cards', label: 'Cartes carburant', href: '#/cartes', icon: CreditCard },
  { key: 'vehicles', label: 'Véhicules', href: '#/vehicules', icon: Truck },
  { key: 'drivers', label: 'Conducteurs', href: '#/conducteurs', icon: Users },
  { key: 'transactions', label: 'Transactions', href: '#/transactions', icon: Receipt },
  { key: 'alerts', label: 'Alertes', href: '#/alertes', icon: Bell },
  { key: 'reports', label: 'Rapports', href: '#/rapports', icon: BarChart3 },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-navy" aria-hidden>
        <Zap size={19} strokeWidth={2.5} />
      </span>
      <div className="leading-tight">
        <div className="font-title text-[17px] font-semibold text-white">Énergie Pro</div>
        <div className="text-[11px] font-medium text-white/60">Carte Carburant Pro</div>
      </div>
    </div>
  );
}

function SidebarContent({ route, openAlerts, onNavigate }: { route: Route; openAlerts: number; onNavigate: () => void }) {
  const active = route.page === 'alert' ? 'alerts' : route.page;
  return (
    <div className="flex h-full flex-col bg-navy px-4 py-5">
      <div className="px-2">
        <Brand />
      </div>
      <div className="mt-7 rounded-lg bg-white/[0.06] px-3 py-2.5">
        <div className="text-[11px] font-medium uppercase tracking-wider text-white/50">Compte client</div>
        <div className="mt-0.5 text-sm font-semibold text-white">{COMPANY.name}</div>
      </div>
      <nav className="mt-6 flex-1" aria-label="Navigation principale">
        <ul className="space-y-1">
          {NAV.map(({ key, label, href, icon: Icon }) => {
            const isActive = active === key;
            return (
              <li key={key}>
                <a
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={cx(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white text-navy' : 'text-white/75 hover:bg-white/[0.08] hover:text-white',
                  )}
                >
                  <Icon size={18} className={isActive ? 'text-brand' : 'text-white/60 group-hover:text-white'} aria-hidden />
                  <span className="flex-1">{label}</span>
                  {key === 'alerts' && openAlerts > 0 && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-navy" aria-label={`${openAlerts} alertes à traiter`}>
                      {openAlerts}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-6 border-t border-white/10 px-2 pt-4 text-[11px] leading-relaxed text-white/55">
        <div className="flex items-center gap-1.5 font-semibold text-white/75">
          <FlaskConical size={13} aria-hidden /> Prototype conceptuel
        </div>
        Projet de démonstration · Caroline Camilleri
        <br />
        Données entièrement fictives
      </div>
    </div>
  );
}

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { alertStatuses, resetDemo } = useFleet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openAlerts = Object.values(alertStatuses).filter((s) => s === 'a_traiter' || s === 'en_cours').length;

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent route={route} openAlerts={openAlerts} onNavigate={() => undefined} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="relative h-full w-72 animate-fade">
            <SidebarContent route={route} openAlerts={openAlerts} onNavigate={() => setMobileOpen(false)} />
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-3 top-5 rounded-lg p-1.5 text-white/70 hover:bg-white/10" aria-label="Fermer le menu">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <aside aria-label="Mention" className="bg-accent-50 px-4 py-2 text-xs text-navy md:px-8">
          Projet fictif réalisé à titre de démonstration, sans lien avec SIPLEC ni E.Leclerc. Les marques citées appartiennent à leurs propriétaires. Données fictives.{' '}
          <a href="../../cas-siplec.html" className="font-semibold underline">Retour à l’étude de cas</a>
        </aside>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:px-8">
            <button type="button" className="rounded-lg p-2 text-navy hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 sm:flex">
              <FlaskConical size={14} aria-hidden />
              Prototype conceptuel – Projet de démonstration
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={resetDemo}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-navy md:flex"
              title="Remet les cartes, alertes et journal dans leur état initial"
            >
              <RotateCcw size={15} aria-hidden /> Réinitialiser la démo
            </button>
            <a href="#/alertes" className="relative rounded-lg p-2 text-navy hover:bg-slate-100" aria-label={`Alertes : ${openAlerts} à traiter`}>
              <Bell size={20} />
              {openAlerts > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />}
            </a>
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">{CURRENT_USER.initials}</span>
              <div className="hidden leading-tight md:block">
                <div className="text-sm font-semibold text-navy">{CURRENT_USER.name}</div>
                <div className="text-xs text-slate-500">{CURRENT_USER.role}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
