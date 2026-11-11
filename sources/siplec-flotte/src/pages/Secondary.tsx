import { useMemo, useState } from 'react';
import { BarChart3, Bell, CalendarClock, FileDown, History, Leaf, Lock, MapPin, Search, ShieldAlert, Unlock, Wallet } from 'lucide-react';
import { ALERTS, CARDS, DRIVERS, TRANSACTIONS, VEHICLES } from '../data/mock';
import { DURATION_LABELS, useFleet } from '../state/FleetContext';
import { Button, CardStatusBadge, PageHeader, Panel, Select, TableWrap, td, th } from '../components/ui';
import { ActivityLog } from './AlertDetail';
import { formatDateTime, formatEur, formatNum } from '../utils';

const EYEBROW = 'Transports Martin · Octobre 2026';

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full max-w-sm">
      <span className="sr-only">{placeholder}</span>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-navy placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      />
    </label>
  );
}

const matches = (q: string, ...fields: (string | null)[]) => {
  const needle = q.trim().toLowerCase();
  return !needle || fields.some((f) => f?.toLowerCase().includes(needle));
};

export function Cards() {
  const { suspensions, reactivateCard, log } = useFleet();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const rows = CARDS.filter((c) => {
    const suspended = Boolean(suspensions[c.id]);
    if (status === 'active' && suspended) return false;
    if (status === 'suspended' && !suspended) return false;
    return matches(q, c.last4, c.holder, c.vehicle);
  });
  const suspendedCount = Object.keys(suspensions).length;
  const cardLog = log.filter((e) => e.cardId);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={EYEBROW} title="Cartes carburant" subtitle={`${CARDS.length - suspendedCount} cartes actives · ${suspendedCount} suspendue${suspendedCount > 1 ? 's' : ''}`} />
      <Panel padded={false}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-end">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher une carte, un titulaire, une immatriculation" />
          <div className="w-full sm:w-56">
            <Select
              label="Statut"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'Toutes les cartes' },
                { value: 'active', label: 'Actives' },
                { value: 'suspended', label: 'Suspendues' },
              ]}
            />
          </div>
        </div>
        <TableWrap>
          <table className="w-full min-w-[960px]">
            <thead className="bg-slate-50/80">
              <tr>
                <th className={th}>Carte</th>
                <th className={th}>Titulaire</th>
                <th className={th}>Véhicule</th>
                <th className={th}>Produits autorisés</th>
                <th className={th}>Consommé / plafond</th>
                <th className={th}>Statut</th>
                <th className={th}>
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => {
                const s = suspensions[c.id];
                const pct = Math.min(100, Math.round((c.spent / c.monthlyLimit) * 100));
                return (
                  <tr key={c.id} className={s ? 'bg-accent-50/40' : undefined}>
                    <td className={`${td} whitespace-nowrap font-semibold text-navy tabular`}>**** {c.last4}</td>
                    <td className={td}>{c.holder}</td>
                    <td className={`${td} whitespace-nowrap tabular`}>{c.vehicle ?? '—'}</td>
                    <td className={td}>{c.products}</td>
                    <td className={`${td} w-56`}>
                      <div className="flex items-center justify-between text-xs tabular">
                        <span className="font-semibold text-navy">{formatEur(c.spent)}</span>
                        <span className="text-slate-500">{formatEur(c.monthlyLimit)}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${pct >= 90 ? 'bg-accent-700' : 'bg-brand'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className={td}>
                      <CardStatusBadge suspended={Boolean(s)} />
                      {s && <div className="mt-1 text-xs text-slate-500">{s.until ? `Jusqu’au ${formatDateTime(s.until)}` : DURATION_LABELS[s.duration]}</div>}
                    </td>
                    <td className={`${td} text-right`}>
                      {s && (
                        <Button
                          size="sm"
                          variant="success"
                          icon={<Unlock size={14} aria-hidden />}
                          onClick={() => reactivateCard(c.id, ALERTS.find((a) => a.cardId === c.id)?.id)}
                        >
                          Réactiver
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
        {rows.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-500">Aucune carte ne correspond à la recherche.</p>}
      </Panel>

      <Panel
        title={
          <div className="flex items-center gap-2">
            <History size={17} className="text-brand" aria-hidden />
            <h2 className="font-title text-[15px] font-semibold text-navy">Journal d’activité des cartes</h2>
          </div>
        }
        padded={false}
      >
        {cardLog.length ? (
          <ActivityLog entries={cardLog} />
        ) : (
          <p className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-slate-500">
            <Lock size={15} aria-hidden /> Aucune suspension ou réactivation sur la période.
          </p>
        )}
      </Panel>
    </div>
  );
}

export function Vehicles() {
  const [q, setQ] = useState('');
  const flagged = new Set(ALERTS.filter((a) => a.priority === 'critique' || a.priority === 'haute').map((a) => a.vehicle));
  const rows = VEHICLES.filter((v) => matches(q, v.plate, v.model, v.driver, v.site));
  return (
    <div>
      <PageHeader eyebrow={EYEBROW} title="Véhicules" subtitle={`${VEHICLES.length} véhicules répartis sur 4 sites d’exploitation`} />
      <Panel padded={false}>
        <div className="border-b border-slate-100 p-5">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un véhicule" />
        </div>
        <TableWrap>
          <table className="w-full min-w-[820px]">
            <thead className="bg-slate-50/80">
              <tr>
                <th className={th}>Immatriculation</th>
                <th className={th}>Modèle</th>
                <th className={th}>Énergie</th>
                <th className={th}>Conducteur</th>
                <th className={th}>Site</th>
                <th className={`${th} text-right`}>Kilométrage</th>
                <th className={`${th} text-right`}>Plein moyen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((v) => (
                <tr key={v.plate}>
                  <td className={`${td} font-semibold text-navy tabular`}>
                    <span className="inline-flex items-center gap-2">
                      {v.plate}
                      {flagged.has(v.plate) && (
                        <a href="#/alertes" title="Alerte ouverte" className="text-accent-700">
                          <ShieldAlert size={15} aria-label="Alerte ouverte" />
                        </a>
                      )}
                    </span>
                  </td>
                  <td className={td}>{v.model}</td>
                  <td className={td}>{v.energy}</td>
                  <td className={td}>{v.driver}</td>
                  <td className={td}>{v.site}</td>
                  <td className={`${td} text-right tabular`}>{formatNum(v.km)} km</td>
                  <td className={`${td} text-right tabular`}>{v.avgFill ? `${v.avgFill} L` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </div>
  );
}

export function Drivers() {
  const [q, setQ] = useState('');
  const rows = DRIVERS.filter((d) => matches(q, d.name, d.vehicle, d.site));
  return (
    <div>
      <PageHeader eyebrow={EYEBROW} title="Conducteurs" subtitle={`${DRIVERS.length} conducteurs rattachés à un véhicule`} />
      <Panel padded={false}>
        <div className="border-b border-slate-100 p-5">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un conducteur" />
        </div>
        <TableWrap>
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50/80">
              <tr>
                <th className={th}>Conducteur</th>
                <th className={th}>Véhicule</th>
                <th className={th}>Site</th>
                <th className={th}>Horaires habituels</th>
                <th className={th}>Téléphone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((d) => (
                <tr key={d.name}>
                  <td className={`${td} font-semibold text-navy`}>{d.name}</td>
                  <td className={`${td} tabular`}>{d.vehicle}</td>
                  <td className={td}>{d.site}</td>
                  <td className={td}>{d.workingHours}</td>
                  <td className={`${td} tabular`}>{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </div>
  );
}

export function Transactions() {
  const [q, setQ] = useState('');
  const rows = useMemo(() => TRANSACTIONS.filter((t) => matches(q, t.card, t.vehicle, t.driver, t.station, t.product)), [q]);
  return (
    <div>
      <PageHeader eyebrow={EYEBROW} title="Transactions" subtitle="Dernières opérations réalisées avec les cartes de la flotte" />
      <Panel padded={false}>
        <div className="border-b border-slate-100 p-5">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher une carte, un véhicule, une station" />
        </div>
        <TableWrap>
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-50/80">
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Carte</th>
                <th className={th}>Véhicule</th>
                <th className={th}>Conducteur</th>
                <th className={th}>Station</th>
                <th className={th}>Produit</th>
                <th className={`${th} text-right`}>Quantité</th>
                <th className={`${th} text-right`}>Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((t) => (
                <tr key={t.id} className={t.flagged ? 'bg-accent-50/40' : undefined}>
                  <td className={`${td} whitespace-nowrap tabular`}>{formatDateTime(t.date)}</td>
                  <td className={`${td} tabular`}>**** {t.card}</td>
                  <td className={`${td} tabular`}>{t.vehicle}</td>
                  <td className={td}>{t.driver}</td>
                  <td className={td}>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <MapPin size={13} className="text-slate-400" aria-hidden />
                      {t.station}
                    </span>
                  </td>
                  <td className={td}>
                    {t.product}
                    {t.flagged && (
                      <a href="#/alertes/ALR-1042" className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-700 hover:underline">
                        <ShieldAlert size={13} aria-hidden /> Alerte
                      </a>
                    )}
                  </td>
                  <td className={`${td} text-right tabular`}>{t.quantity}</td>
                  <td className={`${td} text-right font-semibold text-navy tabular`}>{formatEur(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </div>
  );
}

const SERVICES = [
  { icon: FileDown, title: 'Rapport mensuel de consommation', text: 'Synthèse PDF par site, véhicule et énergie, prête pour la comptabilité.', state: 'Disponible le 1er novembre' },
  { icon: Wallet, title: 'Pilotage budgétaire', text: 'Plafonds par carte ajustés selon la saisonnalité et alertes de dépassement.', state: 'Piste de service additionnel' },
  { icon: Leaf, title: 'Empreinte carbone de la flotte', text: 'Émissions estimées par énergie et trajectoire de transition (E85, électrique).', state: 'Piste de service additionnel' },
  { icon: CalendarClock, title: 'Règles d’usage personnalisées', text: 'Horaires, zones et produits autorisés par carte, définis en libre-service.', state: 'Piste de service additionnel' },
  { icon: Bell, title: 'Alertes en temps réel', text: 'Notification mobile dès la transaction, avec suspension en un geste.', state: 'Illustré dans ce prototype' },
  { icon: BarChart3, title: 'Benchmark de flotte', text: 'Comparaison anonymisée avec des flottes de taille et d’activité similaires.', state: 'Piste de service additionnel' },
];

export function Reports() {
  return (
    <div>
      <PageHeader eyebrow={EYEBROW} title="Rapports" subtitle="Cette rubrique n’est pas développée dans le prototype. Elle illustre les services additionnels envisageables autour de la Carte Carburant Pro." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, text, state }) => (
          <div key={title} className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand">
              <Icon size={20} aria-hidden />
            </span>
            <h2 className="mt-4 font-title text-[15px] font-semibold text-navy">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-600">{text}</p>
            <span className="mt-4 self-start rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
