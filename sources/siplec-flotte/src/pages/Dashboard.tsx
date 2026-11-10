import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertOctagon, ArrowRight, ArrowUpRight, CheckCircle2, CreditCard, Droplets, Euro, Lock, TrendingUp, Truck } from 'lucide-react';
import type { ReactNode } from 'react';
import { ALERTS, ANOMALY_LABELS, CARDS, COMPANY, ENERGY_MIX, KPIS, PRIMARY_ALERT_ID, WEEKLY_CONSUMPTION } from '../data/mock';
import { navigate } from '../router';
import { DURATION_LABELS, useFleet } from '../state/FleetContext';
import { Button, Panel, PriorityBadge, StatusBadge } from '../components/ui';
import { cx, formatDateTime, formatEur, formatEur0, formatNum } from '../utils';

function Kpi({ icon, label, value, hint, tone = 'default' }: { icon: ReactNode; label: string; value: string; hint?: ReactNode; tone?: 'default' | 'up' }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
        <span className={cx('grid h-8 w-8 place-items-center rounded-lg', tone === 'up' ? 'bg-accent-50 text-accent-700' : 'bg-brand-50 text-brand')}>{icon}</span>
        {label}
      </div>
      <div className="mt-3 font-title text-[26px] font-semibold leading-none text-navy tabular">{value}</div>
      {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

const avg = Math.round(WEEKLY_CONSUMPTION.slice(0, -1).reduce((s, w) => s + w.litres, 0) / (WEEKLY_CONSUMPTION.length - 1));

function ConsumptionTooltip({ active, payload }: { active?: boolean; payload?: { payload: (typeof WEEKLY_CONSUMPTION)[number] }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-pop">
      <div className="font-semibold text-navy">
        {p.week} · semaine du {p.label}
      </div>
      <div className="mt-1 tabular text-slate-700">{formatNum(p.litres)} litres</div>
    </div>
  );
}

function EnergyTooltip({ active, payload }: { active?: boolean; payload?: { payload: (typeof ENERGY_MIX)[number] }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-pop">
      <div className="font-semibold text-navy">{p.name}</div>
      <div className="mt-1 tabular text-slate-700">
        {formatEur0(p.amount)} · {p.volume}
      </div>
    </div>
  );
}

function PriorityAlert() {
  const { alertStatuses, suspensions } = useFleet();
  const alert = ALERTS.find((a) => a.id === PRIMARY_ALERT_ID)!;
  const status = alertStatuses[alert.id];
  const suspension = suspensions[alert.cardId];
  const handled = status === 'mesure_prise' || status === 'verifiee';

  if (handled) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 md:flex-row md:items-center">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
          <CheckCircle2 size={22} aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-title text-[15px] font-semibold text-emerald-900">Alerte prioritaire traitée – {alert.vehicleModel} {alert.vehicle}</p>
          <p className="mt-0.5 text-sm text-emerald-800">
            {suspension
              ? `Carte **** 4582 suspendue (${DURATION_LABELS[suspension.duration].toLowerCase()}). Action tracée dans le journal d’activité.`
              : 'Opération vérifiée. Action tracée dans le journal d’activité.'}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/alertes/${alert.id}`)} icon={<ArrowRight size={16} aria-hidden />}>
          Voir le détail
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-red-200 bg-white p-5 shadow-card">
      <div className="absolute inset-y-0 left-0 w-1 bg-red-600" aria-hidden />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
          <AlertOctagon size={22} aria-hidden />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority="critique" />
            <span className="text-xs font-medium text-slate-500">Alerte prioritaire · {formatDateTime(alert.date)}</span>
          </div>
          <p className="mt-1.5 font-title text-base font-semibold text-navy">
            Consommation inhabituelle – {alert.vehicleModel} {alert.vehicle}
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            94 L de gazole à {alert.station}, soit +62 % par rapport au plein habituel du véhicule, en dehors de sa plage horaire.
          </p>
        </div>
        <Button onClick={() => navigate(`/alertes/${alert.id}`)} icon={<ArrowRight size={16} aria-hidden />} className="shrink-0">
          Analyser l’alerte
        </Button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { suspensions, alertStatuses } = useFleet();
  const suspendedCount = Object.keys(suspensions).length;
  const activeCards = KPIS.activeCards - suspendedCount;
  const open = ALERTS.filter((a) => alertStatuses[a.id] === 'a_traiter' || alertStatuses[a.id] === 'en_cours');
  const totalEnergy = ENERGY_MIX.reduce((s, e) => s + e.amount, 0);
  const budgetPct = Math.round((KPIS.budget / KPIS.budgetPlanned) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-1.5 text-[13px] font-medium text-slate-600">
            {COMPANY.name} · {COMPANY.contract}
          </div>
          <h1 className="font-title text-2xl font-semibold text-navy md:text-[26px]">Gestion de flotte</h1>
          <p className="mt-1 text-sm text-slate-600">Bonjour Marc, voici la situation de votre flotte au 21 octobre 2026.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-navy md:self-auto">
          Période : {COMPANY.period}
        </div>
      </div>

      <PriorityAlert />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          icon={<CreditCard size={17} aria-hidden />}
          label="Cartes actives"
          value={String(activeCards)}
          hint={
            suspendedCount ? (
              <span className="inline-flex items-center gap-1 font-semibold text-accent-700">
                <Lock size={12} aria-hidden /> {suspendedCount} carte suspendue
              </span>
            ) : (
              `sur ${CARDS.length} cartes émises`
            )
          }
        />
        <Kpi icon={<Truck size={17} aria-hidden />} label="Véhicules" value={String(KPIS.vehicles)} hint="4 sites d’exploitation" />
        <Kpi icon={<Droplets size={17} aria-hidden />} label="Consommation totale" value={`${formatNum(KPIS.litres)} L`} hint="+ 4 120 kWh de recharge" />
        <Kpi
          icon={<Euro size={17} aria-hidden />}
          label="Budget consommé"
          value={formatEur0(KPIS.budget)}
          hint={
            <div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${budgetPct} % du budget prévu`}>
                <div className="h-full rounded-full bg-brand" style={{ width: `${budgetPct}%` }} />
              </div>
              <div className="mt-1.5">
                {budgetPct} % du budget prévu ({formatEur0(KPIS.budgetPlanned)})
              </div>
            </div>
          }
        />
        <Kpi
          icon={<TrendingUp size={17} aria-hidden />}
          tone="up"
          label="Évolution"
          value={`+${String(KPIS.evolution).replace('.', ',')} %`}
          hint={
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight size={12} className="text-accent-700" aria-hidden /> par rapport à septembre 2026
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title={
            <div>
              <h2 className="font-title text-[15px] font-semibold text-navy">Consommation hebdomadaire</h2>
              <p className="text-xs text-slate-500">Litres de carburant, 9 dernières semaines</p>
            </div>
          }
          action={<span className="rounded-md bg-accent-50 px-2 py-1 text-xs font-semibold text-accent-700">S43 : +{Math.round(((3140 - avg) / avg) * 100)} % vs moyenne</span>}
        >
          <div className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_CONSUMPTION} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="consoFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066CC" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0066CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} domain={[2000, 3400]} ticks={[2000, 2400, 2800, 3200]} tickFormatter={(v: number) => formatNum(v)} width={56} />
                <ReferenceLine y={avg} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: `Moyenne ${formatNum(avg)} L`, position: 'insideBottomRight', fill: '#64748B', fontSize: 11 }} />
                <Tooltip content={<ConsumptionTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="litres" stroke="#0066CC" strokeWidth={2} fill="url(#consoFill)" animationDuration={800} dot={{ r: 3, fill: '#0066CC', strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title={
            <div>
              <h2 className="font-title text-[15px] font-semibold text-navy">Répartition par énergie</h2>
              <p className="text-xs text-slate-500">Part du budget d’octobre</p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative h-[170px] w-[170px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ENERGY_MIX} dataKey="amount" nameKey="name" innerRadius={52} outerRadius={80} stroke="#fff" strokeWidth={2} startAngle={90} endAngle={-270} animationDuration={800}>
                    {ENERGY_MIX.map((e) => (
                      <Cell key={e.key} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<EnergyTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-title text-base font-semibold text-navy tabular">{formatEur0(totalEnergy)}</div>
                  <div className="text-[11px] text-slate-500">total</div>
                </div>
              </div>
            </div>
            <ul className="w-full space-y-2.5">
              {ENERGY_MIX.map((e) => (
                <li key={e.key} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: e.color }} aria-hidden />
                  <span className="flex-1 text-slate-700">
                    {e.name}
                    <span className="block text-xs text-slate-500">{e.volume}</span>
                  </span>
                  <span className="text-right tabular">
                    <span className="font-semibold text-navy">{Math.round((e.amount / totalEnergy) * 100)} %</span>
                    <span className="block text-xs text-slate-500">{formatEur0(e.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <Panel
        title={
          <div className="flex items-center gap-2">
            <h2 className="font-title text-[15px] font-semibold text-navy">Alertes à traiter</h2>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">{open.length}</span>
          </div>
        }
        action={
          <a href="#/alertes" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            Toutes les alertes <ArrowRight size={15} aria-hidden />
          </a>
        }
        padded={false}
      >
        {open.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Aucune alerte en attente. Bon travail !</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {open.slice(0, 5).map((a) => (
              <li key={a.id}>
                <a href={`#/alertes/${a.id}`} className="flex flex-col gap-2 px-5 py-3.5 hover:bg-slate-50 md:flex-row md:items-center md:gap-4">
                  <div className="w-24 shrink-0">
                    <PriorityBadge priority={a.priority} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{ANOMALY_LABELS[a.type]}</p>
                    <p className="truncate text-[13px] text-slate-500">
                      {a.vehicleModel} {a.vehicle} · {a.driver} · {a.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[13px] text-slate-500 md:justify-end">
                    <span className="tabular">{formatEur(a.amount)}</span>
                    <span className="w-40 whitespace-nowrap tabular">{formatDateTime(a.date)}</span>
                    <StatusBadge status={alertStatuses[a.id]} />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
