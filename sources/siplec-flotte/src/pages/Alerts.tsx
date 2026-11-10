import { useMemo, useState } from 'react';
import { ChevronRight, FilterX, MapPin } from 'lucide-react';
import { ALERTS, ANOMALY_LABELS, CARDS, PRIORITY_LABELS, STATUS_LABELS, type AlertStatus, type AnomalyType, type Priority } from '../data/mock';
import { navigate } from '../router';
import { useFleet } from '../state/FleetContext';
import { Button, CardStatusBadge, PageHeader, Panel, PriorityBadge, Select, StatusBadge, TableWrap, td, th } from '../components/ui';
import { DEMO_TODAY, formatDate, formatEur, formatTime } from '../utils';

const PRIORITY_ORDER: Priority[] = ['critique', 'haute', 'moyenne', 'faible'];

const PERIODS = [
  { value: 'all', label: 'Octobre 2026' },
  { value: '7', label: '7 derniers jours' },
  { value: '14', label: '14 derniers jours' },
];

const DEFAULT_FILTERS = { priority: 'all', status: 'open', type: 'all', vehicle: 'all', period: 'all' };

export function Alerts() {
  const { alertStatuses, suspensions } = useFleet();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const set = (key: keyof typeof filters) => (value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const vehicles = useMemo(() => Array.from(new Set(ALERTS.map((a) => a.vehicle))).sort(), []);

  const rows = useMemo(() => {
    return ALERTS.filter((a) => {
      const status = alertStatuses[a.id];
      if (filters.priority !== 'all' && a.priority !== filters.priority) return false;
      if (filters.status === 'open' && !(status === 'a_traiter' || status === 'en_cours')) return false;
      if (filters.status !== 'open' && filters.status !== 'all' && status !== filters.status) return false;
      if (filters.type !== 'all' && a.type !== filters.type) return false;
      if (filters.vehicle !== 'all' && a.vehicle !== filters.vehicle) return false;
      if (filters.period !== 'all') {
        const days = Number(filters.period);
        const limit = new Date(DEMO_TODAY.getTime() - days * 86400_000);
        if (new Date(a.date) < limit) return false;
      }
      return true;
    }).sort((x, y) => PRIORITY_ORDER.indexOf(x.priority) - PRIORITY_ORDER.indexOf(y.priority) || y.date.localeCompare(x.date));
  }, [alertStatuses, filters]);

  const counts = PRIORITY_ORDER.map((p) => ({
    p,
    n: ALERTS.filter((a) => a.priority === p && (alertStatuses[a.id] === 'a_traiter' || alertStatuses[a.id] === 'en_cours')).length,
  }));

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div>
      <PageHeader
        eyebrow="Transports Martin · Octobre 2026"
        title="Alertes"
        subtitle="Anomalies détectées automatiquement sur les opérations réalisées avec vos cartes carburant."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {counts.map(({ p, n }) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, priority: f.priority === p ? 'all' : p }))}
            aria-pressed={filters.priority === p}
            className={`rounded-xl border bg-white p-4 text-left shadow-card transition-colors hover:border-brand/40 ${filters.priority === p ? 'border-brand ring-2 ring-brand/15' : 'border-slate-200/80'}`}
          >
            <PriorityBadge priority={p} />
            <div className="mt-2 font-title text-2xl font-semibold text-navy tabular">{n}</div>
            <div className="text-xs text-slate-500">ouverte{n > 1 ? 's' : ''}</div>
          </button>
        ))}
      </div>

      <Panel padded={false}>
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-5 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
          <Select label="Priorité" value={filters.priority} onChange={set('priority')} options={[{ value: 'all', label: 'Toutes' }, ...PRIORITY_ORDER.map((p) => ({ value: p, label: PRIORITY_LABELS[p] }))]} />
          <Select
            label="Statut"
            value={filters.status}
            onChange={set('status')}
            options={[{ value: 'open', label: 'Ouvertes (à traiter, en cours)' }, { value: 'all', label: 'Tous les statuts' }, ...(Object.keys(STATUS_LABELS) as AlertStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] }))]}
          />
          <Select label="Type d’anomalie" value={filters.type} onChange={set('type')} options={[{ value: 'all', label: 'Tous les types' }, ...(Object.keys(ANOMALY_LABELS) as AnomalyType[]).map((t) => ({ value: t, label: ANOMALY_LABELS[t] }))]} />
          <Select label="Véhicule" value={filters.vehicle} onChange={set('vehicle')} options={[{ value: 'all', label: 'Tous les véhicules' }, ...vehicles.map((v) => ({ value: v, label: v }))]} />
          <Select label="Période" value={filters.period} onChange={set('period')} options={PERIODS} />
          <Button variant="ghost" onClick={() => setFilters(DEFAULT_FILTERS)} disabled={!isFiltered} icon={<FilterX size={16} aria-hidden />} className="h-10">
            Réinitialiser
          </Button>
        </div>

        <div className="px-5 py-3 text-[13px] text-slate-500">
          {rows.length} alerte{rows.length > 1 ? 's' : ''} affichée{rows.length > 1 ? 's' : ''}
        </div>

        {rows.length === 0 ? (
          <div className="px-5 pb-10 pt-4 text-center">
            <p className="text-sm font-semibold text-navy">Aucune alerte ne correspond à ces filtres.</p>
            <p className="mt-1 text-sm text-slate-500">Élargissez la période ou affichez tous les statuts.</p>
          </div>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[1100px] border-t border-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className={th}>Priorité</th>
                  <th className={th}>Anomalie</th>
                  <th className={th}>Véhicule</th>
                  <th className={th}>Conducteur</th>
                  <th className={th}>Carte</th>
                  <th className={th}>Date</th>
                  <th className={`${th} text-right`}>Montant</th>
                  <th className={th}>Station</th>
                  <th className={th}>Statut</th>
                  <th className={th}>
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((a) => {
                  const card = CARDS.find((c) => c.id === a.cardId)!;
                  return (
                    <tr key={a.id} className="cursor-pointer hover:bg-slate-50/80" onClick={() => navigate(`/alertes/${a.id}`)}>
                      <td className={td}>
                        <PriorityBadge priority={a.priority} />
                      </td>
                      <td className={`${td} max-w-[240px]`}>
                        <div className="font-semibold text-navy">{ANOMALY_LABELS[a.type]}</div>
                        <div className="truncate text-xs text-slate-500" title={a.summary}>
                          {a.id} · {a.summary}
                        </div>
                      </td>
                      <td className={td}>
                        <div className="whitespace-nowrap font-semibold text-navy tabular">{a.vehicle}</div>
                        <div className="whitespace-nowrap text-xs text-slate-500">{a.vehicleModel}</div>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>{a.driver}</td>
                      <td className={td}>
                        <div className="tabular">**** {card.last4}</div>
                        <div className="mt-1">
                          <CardStatusBadge suspended={Boolean(suspensions[card.id])} />
                        </div>
                      </td>
                      <td className={`${td} whitespace-nowrap tabular`}>
                        {formatDate(a.date)}
                        <div className="text-xs text-slate-500">{formatTime(a.date)}</div>
                      </td>
                      <td className={`${td} text-right font-semibold text-navy tabular`}>{formatEur(a.amount)}</td>
                      <td className={td}>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <MapPin size={13} className="text-slate-400" aria-hidden />
                          {a.station}
                        </span>
                      </td>
                      <td className={td}>
                        <StatusBadge status={alertStatuses[a.id]} />
                      </td>
                      <td className={`${td} text-right`}>
                        <Button
                          size="sm"
                          variant={a.priority === 'critique' ? 'primary' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/alertes/${a.id}`);
                          }}
                          aria-label={`Consulter le détail de l’alerte ${a.id}`}
                        >
                          Détail <ChevronRight size={15} aria-hidden />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>
    </div>
  );
}
