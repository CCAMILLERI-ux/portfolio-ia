import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ALERTS,
  CARDS,
  CURRENT_USER,
  INITIAL_LOG,
  MAIN_MANAGER,
  type AlertStatus,
  type LogEntry,
} from '../data/mock';
import { demoNow, formatDateTime, toLocalIso } from '../utils';

export type SuspensionDuration = '24h' | '48h' | 'manual';

export const DURATION_LABELS: Record<SuspensionDuration, string> = {
  '24h': '24 heures',
  '48h': '48 heures',
  manual: 'Jusqu’à réactivation manuelle',
};

export type Suspension = {
  duration: SuspensionDuration;
  since: string;
  until: string | null;
  reason: string;
};

export type Toast = { id: number; tone: 'success' | 'info'; title: string; text?: string };

type FleetState = {
  suspensions: Record<string, Suspension>;
  alertStatuses: Record<string, AlertStatus>;
  log: LogEntry[];
  toasts: Toast[];
  suspendCard: (cardId: string, duration: SuspensionDuration, reason: string, alertId?: string) => Suspension;
  reactivateCard: (cardId: string, alertId?: string) => void;
  markVerified: (alertId: string, note: string) => void;
  contactDriver: (alertId: string, driver: string, channel: string, message: string) => void;
  escalate: (alertId: string, note: string) => void;
  dismissToast: (id: number) => void;
  resetDemo: () => void;
};

const FleetContext = createContext<FleetState | null>(null);

const initialStatuses = () => Object.fromEntries(ALERTS.map((a) => [a.id, a.initialStatus]));

const cardLabel = (cardId: string) => {
  const card = CARDS.find((c) => c.id === cardId);
  return card ? `**** ${card.last4}` : cardId;
};

export function FleetProvider({ children }: { children: ReactNode }) {
  const [suspensions, setSuspensions] = useState<Record<string, Suspension>>({});
  const [alertStatuses, setAlertStatuses] = useState<Record<string, AlertStatus>>(initialStatuses);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = ++seq.current;
      setToasts((t) => [...t, { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast],
  );

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'date' | 'user'> & { user?: string }) => {
    const id = `log-live-${++seq.current}`;
    setLog((l) => [{ id, date: toLocalIso(demoNow()), user: CURRENT_USER.name, ...entry }, ...l]);
  }, []);

  const suspendCard = useCallback<FleetState['suspendCard']>(
    (cardId, duration, reason, alertId) => {
      const now = demoNow();
      const hours = duration === '24h' ? 24 : duration === '48h' ? 48 : 0;
      const until = hours ? toLocalIso(new Date(now.getTime() + hours * 3600_000)) : null;
      const suspension: Suspension = { duration, since: toLocalIso(now), until, reason };
      setSuspensions((s) => ({ ...s, [cardId]: suspension }));
      if (alertId) setAlertStatuses((s) => ({ ...s, [alertId]: 'mesure_prise' }));
      addLog({
        action: `Suspension temporaire de la carte ${cardLabel(cardId)} – ${DURATION_LABELS[duration].toLowerCase()}`,
        reason: reason || 'Non renseigné',
        status: 'warning',
        statusLabel: until ? `Suspendue jusqu’au ${formatDateTime(until)}` : 'Suspendue',
        alertId,
        cardId,
      });
      pushToast({
        tone: 'success',
        title: `Carte ${cardLabel(cardId)} suspendue`,
        text: until ? `Réactivation automatique le ${formatDateTime(until)}.` : 'Jusqu’à réactivation manuelle.',
      });
      return suspension;
    },
    [addLog, pushToast],
  );

  const reactivateCard = useCallback<FleetState['reactivateCard']>(
    (cardId, alertId) => {
      setSuspensions((s) => {
        const next = { ...s };
        delete next[cardId];
        return next;
      });
      if (alertId) setAlertStatuses((s) => ({ ...s, [alertId]: 'a_traiter' }));
      addLog({
        action: `Réactivation de la carte ${cardLabel(cardId)}`,
        reason: 'Réactivation manuelle',
        status: 'success',
        statusLabel: 'Active',
        alertId,
        cardId,
      });
      pushToast({ tone: 'info', title: `Carte ${cardLabel(cardId)} réactivée`, text: 'Les transactions sont de nouveau autorisées.' });
    },
    [addLog, pushToast],
  );

  const markVerified = useCallback<FleetState['markVerified']>(
    (alertId, note) => {
      setAlertStatuses((s) => ({ ...s, [alertId]: 'verifiee' }));
      addLog({ action: `Alerte ${alertId} marquée comme vérifiée`, reason: note || 'Non renseigné', status: 'success', statusLabel: 'Clôturée', alertId });
      pushToast({ tone: 'success', title: 'Alerte marquée comme vérifiée', text: 'Elle a été retirée des alertes à traiter.' });
    },
    [addLog, pushToast],
  );

  const contactDriver = useCallback<FleetState['contactDriver']>(
    (alertId, driver, channel, message) => {
      setAlertStatuses((s) => (s[alertId] === 'a_traiter' ? { ...s, [alertId]: 'en_cours' } : s));
      addLog({ action: `${driver} contacté par ${channel}`, reason: message, status: 'info', statusLabel: 'Message envoyé', alertId });
      pushToast({ tone: 'success', title: `Message envoyé à ${driver}`, text: 'La réponse apparaîtra dans le journal d’activité.' });
    },
    [addLog, pushToast],
  );

  const escalate = useCallback<FleetState['escalate']>(
    (alertId, note) => {
      setAlertStatuses((s) => (s[alertId] === 'a_traiter' ? { ...s, [alertId]: 'en_cours' } : s));
      addLog({ action: `Alerte signalée à ${MAIN_MANAGER.name}`, reason: note || 'Non renseigné', status: 'info', statusLabel: 'Signalée', alertId });
      pushToast({ tone: 'success', title: 'Alerte signalée', text: `${MAIN_MANAGER.name} a été notifiée.` });
    },
    [addLog, pushToast],
  );

  const resetDemo = useCallback(() => {
    setSuspensions({});
    setAlertStatuses(initialStatuses());
    setLog(INITIAL_LOG);
    pushToast({ tone: 'info', title: 'Démonstration réinitialisée' });
  }, [pushToast]);

  const value = useMemo(
    () => ({ suspensions, alertStatuses, log, toasts, suspendCard, reactivateCard, markVerified, contactDriver, escalate, dismissToast, resetDemo }),
    [suspensions, alertStatuses, log, toasts, suspendCard, reactivateCard, markVerified, contactDriver, escalate, dismissToast, resetDemo],
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet() {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error('useFleet doit être utilisé dans FleetProvider');
  return ctx;
}
