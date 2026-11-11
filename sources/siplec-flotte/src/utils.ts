const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const eur0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('fr-FR');

export const formatEur = (n: number) => eur.format(n);
export const formatEur0 = (n: number) => eur0.format(n);
export const formatNum = (n: number) => num.format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, '0')}`;
};

export const formatDateTime = (iso: string) => `${formatDate(iso)} à ${formatTime(iso)}`;

export const formatLongDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

// Horloge de démonstration : on reste au 21 octobre 2026, avec l’heure réelle du jour,
// afin que les actions horodatées restent cohérentes avec la période affichée.
export const DEMO_TODAY = new Date(2026, 9, 21);

export function demoNow(): Date {
  const real = new Date();
  return new Date(2026, 9, 21, real.getHours(), real.getMinutes(), real.getSeconds());
}

export function toLocalIso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
