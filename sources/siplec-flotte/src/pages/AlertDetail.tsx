import { useState, type ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Droplets,
  Fuel,
  History,
  Lock,
  MapPin,
  MessageSquare,
  Repeat,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
  User,
} from 'lucide-react';
import { ALERTS, ANOMALY_LABELS, CARDS, DRIVERS, MAIN_MANAGER, PRIMARY_ALERT_DETAIL, PRIMARY_ALERT_ID, VEHICLES, type FleetAlert, type LogEntry } from '../data/mock';
import { DURATION_LABELS, useFleet, type Suspension, type SuspensionDuration } from '../state/FleetContext';
import { Button, CardStatusBadge, Modal, Panel, PriorityBadge, StatusBadge, TableWrap, td, th } from '../components/ui';
import { cx, formatDate, formatDateTime, formatEur, formatLongDate, formatTime } from '../utils';

type Factor = { icon: ReactNode; title: string; detail: string; value: string };

function buildAnalysis(alert: FleetAlert) {
  const vehicle = VEHICLES.find((v) => v.plate === alert.vehicle)!;
  if (alert.id === PRIMARY_ALERT_ID) {
    const d = PRIMARY_ALERT_DETAIL;
    return {
      explanation: 'Cette opération dépasse de 62 % la consommation habituelle de ce véhicule et a été réalisée en dehors de sa plage horaire habituelle.',
      factors: [
        { icon: <Droplets size={18} aria-hidden />, title: 'Volume inhabituel', detail: `${d.litres} L en une seule opération pour un plein habituel de ${d.usualFill} L`, value: `${d.litres} L` },
        { icon: <Clock size={18} aria-hidden />, title: 'Horaire inhabituel', detail: `Opération à 22 h 47, plage habituelle du véhicule : ${d.usualHours}`, value: '22 h 47' },
        { icon: <Repeat size={18} aria-hidden />, title: 'Deux opérations en moins de 24 heures', detail: '52 L à E.Leclerc Rungis à 8 h 12, puis 94 L à E.Leclerc Orly à 22 h 47', value: '2 en 14 h 35' },
        { icon: <BarChart3 size={18} aria-hidden />, title: 'Écart avec la moyenne du véhicule', detail: `+${d.deviation} % par rapport à la moyenne des 30 derniers pleins, +84 % vs moyenne flotte`, value: `+${d.deviation} %` },
      ] as Factor[],
      comparison: d.comparison,
      confidence: d.confidence,
      operation: `${d.litres} litres de gazole`,
      recent: d.recentOperations,
    };
  }
  const observed = Math.round(alert.amount / 1.76);
  return {
    explanation: `${ANOMALY_LABELS[alert.type]} : ${alert.summary.charAt(0).toLowerCase()}${alert.summary.slice(1)}.`,
    factors: [
      { icon: <ShieldAlert size={18} aria-hidden />, title: ANOMALY_LABELS[alert.type], detail: alert.summary, value: '1 facteur' },
      { icon: <Droplets size={18} aria-hidden />, title: 'Volume de l’opération', detail: `${observed} L pour un plein habituel de ${vehicle.avgFill} L`, value: `${observed} L` },
    ] as Factor[],
    comparison: [
      { name: 'Plein habituel du véhicule', short: 'Habituel', litres: vehicle.avgFill, kind: 'usual' },
      { name: 'Opération observée', short: 'Observé', litres: observed, kind: 'observed' },
      { name: 'Moyenne de la flotte (utilitaires)', short: 'Flotte', litres: 51, kind: 'fleet' },
    ],
    confidence: alert.priority === 'haute' ? 72 : alert.priority === 'moyenne' ? 58 : 34,
    operation: `${observed} litres – ${vehicle.energy}`,
    recent: [{ date: alert.date, station: alert.station, litres: observed, amount: alert.amount, flagged: true }],
  };
}

// Résultat mis en cache : des données stables évitent que Recharts ne rejoue l’animation à chaque rendu.
const analysisCache = new Map<string, ReturnType<typeof buildAnalysis>>();
function getAnalysis(alert: FleetAlert) {
  if (!analysisCache.has(alert.id)) analysisCache.set(alert.id, buildAnalysis(alert));
  return analysisCache.get(alert.id)!;
}

const BAR_COLORS: Record<string, string> = { usual: '#0066CC', observed: '#F26430', fleet: '#94A3B8' };

function ComparisonTooltip({ active, payload }: { active?: boolean; payload?: { payload: { name: string; litres: number } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-pop">
      <div className="font-semibold text-navy">{p.name}</div>
      <div className="mt-1 tabular text-slate-700">{p.litres} litres</div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-sm font-semibold text-navy">{children}</div>
      </div>
    </div>
  );
}

function ActivityLog({ entries }: { entries: LogEntry[] }) {
  const tone: Record<LogEntry['status'], string> = {
    info: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-accent-50 text-accent-700',
  };
  return (
    <TableWrap>
      <table className="w-full min-w-[820px]">
        <thead className="bg-slate-50/80">
          <tr>
            <th className={th}>Date et heure</th>
            <th className={th}>Action réalisée</th>
            <th className={th}>Utilisateur</th>
            <th className={th}>Motif</th>
            <th className={th}>Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((e) => (
            <tr key={e.id} className={e.id.startsWith('log-live') ? 'bg-brand-50/40' : undefined}>
              <td className={`${td} whitespace-nowrap tabular`}>{formatDateTime(e.date)}</td>
              <td className={`${td} font-semibold text-navy`}>{e.action}</td>
              <td className={`${td} whitespace-nowrap`}>{e.user}</td>
              <td className={`${td} max-w-[280px] text-slate-600`}>{e.reason}</td>
              <td className={td}>
                <span className={cx('inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold', tone[e.status])}>{e.statusLabel}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

const DURATIONS: { value: SuspensionDuration; label: string; hint: string }[] = [
  { value: '24h', label: '24 heures', hint: 'Réactivation automatique demain' },
  { value: '48h', label: '48 heures', hint: 'Le temps d’un échange avec le conducteur' },
  { value: 'manual', label: 'Jusqu’à réactivation manuelle', hint: 'La carte reste bloquée jusqu’à votre décision' },
];

const REASON_SUGGESTIONS = ['Volume anormal en attente de justification', 'Vérification en cours avec le conducteur', 'Suspicion d’usage non professionnel'];

function SuspendModal({ open, onClose, onConfirm, alert, cardLast4 }: { open: boolean; onClose: () => void; onConfirm: (d: SuspensionDuration, reason: string) => void; alert: FleetAlert; cardLast4: string }) {
  const [duration, setDuration] = useState<SuspensionDuration>('24h');
  const [reason, setReason] = useState('');

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelId="suspend-title"
      title="Suspendre temporairement la carte"
      subtitle="Vérifiez les informations avant de confirmer."
      icon={
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-700">
          <Lock size={20} aria-hidden />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="warning" onClick={() => onConfirm(duration, reason.trim())} icon={<Lock size={16} aria-hidden />}>
            Confirmer la suspension
          </Button>
        </>
      }
    >
      <dl className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-slate-500">Carte concernée</dt>
          <dd className="mt-0.5 text-sm font-semibold text-navy tabular">**** {cardLast4}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Véhicule</dt>
          <dd className="mt-0.5 text-sm font-semibold text-navy">
            {alert.vehicleModel} <span className="tabular">{alert.vehicle}</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Conducteur</dt>
          <dd className="mt-0.5 text-sm font-semibold text-navy">{alert.driver}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy">Conséquences de la suspension</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-700" aria-hidden />
            Toute nouvelle transaction avec cette carte sera refusée en station et sur les bornes de recharge.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-700" aria-hidden />
            {alert.driver} sera informé(e) par SMS de l’indisponibilité de sa carte.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
            Les autres cartes de la flotte ne sont pas impactées. La carte n’est pas annulée et peut être réactivée à tout moment.
          </li>
        </ul>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-navy">Durée de la suspension</legend>
        <div className="mt-2 space-y-2">
          {DURATIONS.map((d) => (
            <label
              key={d.value}
              className={cx(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                duration === d.value ? 'border-brand bg-brand-50/60 ring-2 ring-brand/15' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <input
                type="radio"
                name="duration"
                value={d.value}
                checked={duration === d.value}
                onChange={() => setDuration(d.value)}
                className="mt-0.5 h-4 w-4 accent-[#0066CC]"
                data-autofocus={d.value === '24h' ? true : undefined}
              />
              <span>
                <span className="block text-sm font-semibold text-navy">{d.label}</span>
                <span className="block text-xs text-slate-500">{d.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="suspend-reason" className="text-sm font-semibold text-navy">
          Motif <span className="font-normal text-slate-500">(facultatif)</span>
        </label>
        <textarea
          id="suspend-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={240}
          placeholder="Ex. : volume anormal, justification demandée au conducteur"
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {REASON_SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setReason(s)} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-brand/40 hover:text-brand">
              {s}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function NoteModal({ open, onClose, onConfirm, title, subtitle, label, placeholder, confirmLabel, icon, initial = '' }: { open: boolean; onClose: () => void; onConfirm: (note: string) => void; title: string; subtitle: string; label: string; placeholder: string; confirmLabel: string; icon: ReactNode; initial?: string }) {
  const [note, setNote] = useState(initial);
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelId="note-title"
      title={title}
      subtitle={subtitle}
      icon={icon}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onConfirm(note.trim())}>{confirmLabel}</Button>
        </>
      }
    >
      <label htmlFor="note-field" className="text-sm font-semibold text-navy">
        {label}
      </label>
      <textarea
        id="note-field"
        data-autofocus
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      />
    </Modal>
  );
}

function SuspendedBanner({ suspension, last4, onReactivate }: { suspension: Suspension; last4: string; onReactivate: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 animate-pop md:flex-row md:items-center" role="status">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
        <CheckCircle2 size={22} aria-hidden />
      </span>
      <div className="flex-1">
        <p className="font-title text-[15px] font-semibold text-emerald-900">La carte **** {last4} a bien été suspendue</p>
        <p className="mt-0.5 text-sm text-emerald-800">
          Durée : {DURATION_LABELS[suspension.duration].toLowerCase()}
          {suspension.until ? ` – réactivation automatique le ${formatDateTime(suspension.until)}` : ''}. Le conducteur a été informé et l’action est enregistrée dans le journal d’activité.
        </p>
      </div>
      <Button variant="secondary" onClick={onReactivate} icon={<Unlock size={16} aria-hidden />} className="shrink-0">
        Réactiver la carte
      </Button>
    </div>
  );
}

export function AlertDetail({ id }: { id: string }) {
  const fleet = useFleet();
  const [modal, setModal] = useState<null | 'suspend' | 'verify' | 'contact' | 'escalate'>(null);
  const [compact] = useState(() => window.innerWidth < 640);
  const alert = ALERTS.find((a) => a.id === id);

  if (!alert) {
    return (
      <Panel>
        <p className="text-sm text-slate-600">Cette alerte est introuvable.</p>
        <a href="#/alertes" className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline">
          Retour aux alertes
        </a>
      </Panel>
    );
  }

  const card = CARDS.find((c) => c.id === alert.cardId)!;
  const driver = DRIVERS.find((d) => d.name === alert.driver);
  const suspension = fleet.suspensions[card.id];
  const status = fleet.alertStatuses[alert.id];
  const analysis = getAnalysis(alert);
  const entries = fleet.log.filter((e) => e.alertId === alert.id || e.cardId === card.id);
  const close = () => setModal(null);

  return (
    <div>
      <nav className="mb-4 flex items-center gap-1.5 text-[13px] text-slate-500" aria-label="Fil d’Ariane">
        <a href="#/alertes" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
          <ArrowLeft size={14} aria-hidden /> Alertes
        </a>
        <ChevronRight size={14} aria-hidden />
        <span>{alert.id}</span>
      </nav>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={alert.priority} />
            <StatusBadge status={status} />
            <span className="text-[13px] text-slate-500">Détectée le {formatDateTime(alert.date)}</span>
          </div>
          <h1 className="font-title text-2xl font-semibold text-navy md:text-[26px]">{ANOMALY_LABELS[alert.type]}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {alert.vehicleModel} {alert.vehicle} · {alert.driver} · Carte **** {card.last4}
          </p>
        </div>
      </div>

      {suspension && <SuspendedBanner suspension={suspension} last4={card.last4} onReactivate={() => fleet.reactivateCard(card.id, alert.id)} />}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white">
                <Sparkles size={18} aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-title text-[15px] font-semibold text-navy">Pourquoi cette alerte ?</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-navy">{analysis.explanation}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span>
                    Indice de confiance : <strong className="text-navy">{analysis.confidence} / 100</strong>
                  </span>
                  <span>Calculé à partir des 90 derniers jours d’opérations du véhicule et de la flotte</span>
                </div>
              </div>
            </div>
          </section>

          <Panel title={`Facteurs ayant déclenché l’alerte (${analysis.factors.length})`}>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {analysis.factors.map((f) => (
                <li key={f.title} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-50 text-accent-700">{f.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">{f.title}</p>
                      <span className="whitespace-nowrap rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-navy tabular">{f.value}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-slate-600">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title={
              <div>
                <h2 className="font-title text-[15px] font-semibold text-navy">Comparaison des volumes</h2>
                <p className="text-xs text-slate-500">Litres par opération</p>
              </div>
            }
          >
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.comparison} margin={{ top: 24, right: 8, left: -12, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={compact ? 'short' : 'name'} tick={{ fill: '#475569', fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} interval={0} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} unit=" L" width={56} />
                  <Tooltip content={<ComparisonTooltip />} cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="litres" radius={[4, 4, 0, 0]} maxBarSize={72} animationDuration={700}>
                    {analysis.comparison.map((c) => (
                      <Cell key={c.kind} fill={BAR_COLORS[c.kind]} />
                    ))}
                    <LabelList dataKey="litres" position="top" formatter={(v: number) => `${v} L`} style={{ fill: '#1C2E5D', fontSize: 13, fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {alert.id === PRIMARY_ALERT_ID && (
              <p className="mt-3 text-[13px] text-slate-600">
                L’opération observée représente <strong className="text-navy">1,6 fois</strong> le plein habituel de ce véhicule et <strong className="text-navy">1,8 fois</strong> la moyenne des utilitaires de la flotte.
              </p>
            )}
          </Panel>

          <Panel title="Dernières opérations du véhicule" padded={false}>
            <TableWrap>
              <table className="w-full min-w-[560px]">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className={th}>Date</th>
                    <th className={th}>Station</th>
                    <th className={`${th} text-right`}>Volume</th>
                    <th className={`${th} text-right`}>Montant</th>
                    <th className={th}>Analyse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.recent.map((op) => (
                    <tr key={op.date} className={op.flagged ? 'bg-accent-50/40' : undefined}>
                      <td className={`${td} whitespace-nowrap tabular`}>{formatDateTime(op.date)}</td>
                      <td className={td}>{op.station}</td>
                      <td className={`${td} text-right font-semibold text-navy tabular`}>{op.litres} L</td>
                      <td className={`${td} text-right tabular`}>{formatEur(op.amount)}</td>
                      <td className={td}>
                        {op.flagged ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-700">
                            <ShieldAlert size={13} aria-hidden /> Retenue dans l’alerte
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Conforme</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Opération concernée">
            <div className="divide-y divide-slate-100">
              <InfoRow icon={<Fuel size={17} aria-hidden />} label="Véhicule">
                {alert.vehicleModel} <span className="tabular">{alert.vehicle}</span>
              </InfoRow>
              <InfoRow icon={<User size={17} aria-hidden />} label="Conducteur">
                {alert.driver}
                {driver && <span className="block text-xs font-normal text-slate-500">Horaires habituels : {driver.workingHours}</span>}
              </InfoRow>
              <InfoRow icon={<CreditCard size={17} aria-hidden />} label="Carte">
                <span className="flex items-center gap-2">
                  <span className="tabular">**** {card.last4}</span>
                  <CardStatusBadge suspended={Boolean(suspension)} />
                </span>
                {suspension && <span className="block text-xs font-normal text-slate-500">Durée : {DURATION_LABELS[suspension.duration].toLowerCase()}</span>}
              </InfoRow>
              <InfoRow icon={<Droplets size={17} aria-hidden />} label="Opération">
                {analysis.operation}
              </InfoRow>
              <InfoRow icon={<span className="text-[15px] font-bold">€</span>} label="Montant">
                <span className="tabular">{formatEur(alert.amount)}</span>
              </InfoRow>
              <InfoRow icon={<MapPin size={17} aria-hidden />} label="Station">
                {alert.station}
              </InfoRow>
              <InfoRow icon={<Clock size={17} aria-hidden />} label="Date">
                {formatLongDate(alert.date)} à {formatTime(alert.date)}
              </InfoRow>
            </div>
          </Panel>

          <Panel title="Actions possibles">
            <div className="space-y-2.5">
              {suspension ? (
                <Button variant="success" className="w-full" onClick={() => fleet.reactivateCard(card.id, alert.id)} icon={<Unlock size={17} aria-hidden />}>
                  Réactiver la carte
                </Button>
              ) : (
                <Button variant="warning" className="w-full py-3" onClick={() => setModal('suspend')} icon={<Lock size={17} aria-hidden />}>
                  Suspendre temporairement la carte
                </Button>
              )}
              <Button variant="secondary" className="w-full" onClick={() => setModal('contact')} icon={<MessageSquare size={16} aria-hidden />}>
                Contacter le conducteur
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setModal('verify')} disabled={status === 'verifiee'} icon={<ShieldCheck size={16} aria-hidden />}>
                {status === 'verifiee' ? 'Alerte vérifiée' : 'Marquer comme vérifiée'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setModal('escalate')} icon={<Send size={16} aria-hidden />}>
                Signaler au gestionnaire principal
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">Chaque action est horodatée et enregistrée dans le journal d’activité, sans passer par le support.</p>
          </Panel>
        </div>
      </div>

      <Panel
        className="mt-6"
        title={
          <div className="flex items-center gap-2">
            <History size={17} className="text-brand" aria-hidden />
            <h2 className="font-title text-[15px] font-semibold text-navy">Journal d’activité</h2>
          </div>
        }
        action={<span className="text-xs text-slate-500">{entries.length} évènements</span>}
        padded={false}
      >
        <ActivityLog entries={entries} />
      </Panel>

      {modal === 'suspend' && (
        <SuspendModal
          open
          onClose={close}
          alert={alert}
          cardLast4={card.last4}
          onConfirm={(duration, reason) => {
            fleet.suspendCard(card.id, duration, reason, alert.id);
            close();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
      {modal === 'verify' && (
        <NoteModal
          open
          onClose={close}
          title="Marquer l’alerte comme vérifiée"
          subtitle="L’alerte sera clôturée et retirée des alertes à traiter."
          label="Commentaire de vérification"
          placeholder="Ex. : livraison exceptionnelle confirmée par le conducteur"
          confirmLabel="Marquer comme vérifiée"
          icon={
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={20} aria-hidden />
            </span>
          }
          onConfirm={(note) => {
            fleet.markVerified(alert.id, note);
            close();
          }}
        />
      )}
      {modal === 'contact' && (
        <NoteModal
          open
          onClose={close}
          title={`Contacter ${alert.driver}`}
          subtitle={driver ? `SMS au ${driver.phone} – envoi simulé dans ce prototype` : 'Envoi simulé dans ce prototype'}
          label="Message"
          placeholder="Votre message"
          confirmLabel="Envoyer le SMS"
          initial={`Bonjour ${alert.driver.split(' ')[0]}, une opération de ${analysis.operation} a été enregistrée le ${formatDate(alert.date)} à ${formatTime(alert.date)} (${alert.station}) avec votre carte. Pouvez-vous m’en préciser le contexte ? Merci, Marc Lefèvre`}
          icon={
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
              <MessageSquare size={20} aria-hidden />
            </span>
          }
          onConfirm={(message) => {
            fleet.contactDriver(alert.id, alert.driver, 'SMS', message || 'Demande de justification');
            close();
          }}
        />
      )}
      {modal === 'escalate' && (
        <NoteModal
          open
          onClose={close}
          title="Signaler au gestionnaire principal"
          subtitle={`${MAIN_MANAGER.name} – ${MAIN_MANAGER.role}`}
          label="Note pour le gestionnaire principal"
          placeholder="Ex. : demande d’arbitrage avant sanction éventuelle"
          confirmLabel="Signaler l’alerte"
          icon={
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
              <Send size={20} aria-hidden />
            </span>
          }
          onConfirm={(note) => {
            fleet.escalate(alert.id, note);
            close();
          }}
        />
      )}
    </div>
  );
}

export { ActivityLog };
