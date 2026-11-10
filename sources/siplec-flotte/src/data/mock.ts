// Données entièrement fictives, utilisées uniquement pour la démonstration.

export const COMPANY = {
  name: 'Transports Martin',
  period: 'Octobre 2026',
  contract: 'Contrat Carte Carburant Pro n° CP-0047-2291',
};

export const CURRENT_USER = {
  name: 'Marc Lefèvre',
  role: 'Gestionnaire de flotte',
  initials: 'ML',
};

export const MAIN_MANAGER = {
  name: 'Isabelle Martin',
  role: 'Gestionnaire principale – Direction',
};

export const KPIS = {
  activeCards: 24,
  vehicles: 18,
  litres: 12480,
  budget: 21840,
  budgetPlanned: 23500,
  evolution: 8.4,
};

// Consommation hebdomadaire (litres, carburants liquides)
export const WEEKLY_CONSUMPTION = [
  { week: 'S35', label: '24 août', litres: 2540 },
  { week: 'S36', label: '31 août', litres: 2610 },
  { week: 'S37', label: '7 sept.', litres: 2580 },
  { week: 'S38', label: '14 sept.', litres: 2650 },
  { week: 'S39', label: '21 sept.', litres: 2620 },
  { week: 'S40', label: '28 sept.', litres: 2710 },
  { week: 'S41', label: '5 oct.', litres: 2790 },
  { week: 'S42', label: '12 oct.', litres: 2870 },
  { week: 'S43', label: '19 oct.', litres: 3140 },
];

export type EnergyKey = 'gazole' | 'sp95' | 'e85' | 'electrique';

export const ENERGY_MIX: {
  key: EnergyKey;
  name: string;
  amount: number;
  volume: string;
  color: string;
}[] = [
  { key: 'gazole', name: 'Gazole', amount: 17410, volume: '10 240 L', color: '#0066CC' },
  { key: 'sp95', name: 'SP95-E10', amount: 2940, volume: '1 650 L', color: '#F26430' },
  { key: 'e85', name: 'E85', amount: 480, volume: '590 L', color: '#1E9E8F' },
  { key: 'electrique', name: 'Recharge électrique', amount: 1010, volume: '4 120 kWh', color: '#7B5EC7' },
];

export type Vehicle = {
  plate: string;
  model: string;
  energy: string;
  driver: string;
  km: number;
  avgFill: number;
  site: string;
};

export const VEHICLES: Vehicle[] = [
  { plate: 'AB-123-CD', model: 'Renault Master', energy: 'Gazole', driver: 'Julien Moreau', km: 84210, avgFill: 58, site: 'Rungis' },
  { plate: 'GH-456-JK', model: 'Peugeot Expert', energy: 'Gazole', driver: 'Sophie Lambert', km: 62480, avgFill: 49, site: 'Rungis' },
  { plate: 'EF-789-GH', model: 'Citroën Jumpy', energy: 'Gazole', driver: 'Karim Benali', km: 71930, avgFill: 51, site: 'Créteil' },
  { plate: 'KL-012-MN', model: 'Renault Trafic', energy: 'Gazole', driver: 'Thomas Garnier', km: 98340, avgFill: 55, site: 'Massy' },
  { plate: 'PQ-345-RS', model: 'Ford Transit', energy: 'Gazole', driver: 'Nadia Rousseau', km: 55120, avgFill: 60, site: 'Rungis' },
  { plate: 'TU-678-VW', model: 'Renault Kangoo', energy: 'SP95-E10', driver: 'Lucas Petit', km: 38760, avgFill: 38, site: 'Évry' },
  { plate: 'XY-901-ZA', model: 'Iveco Daily', energy: 'Gazole', driver: 'Antoine Leroy', km: 121400, avgFill: 72, site: 'Massy' },
  { plate: 'BC-234-DE', model: 'Renault Master', energy: 'Gazole', driver: 'Mélanie Fournier', km: 67890, avgFill: 57, site: 'Créteil' },
  { plate: 'FG-567-HI', model: 'Peugeot Partner', energy: 'SP95-E10', driver: 'Hugo Girard', km: 29340, avgFill: 41, site: 'Rungis' },
  { plate: 'JK-890-LM', model: 'Renault Kangoo E-Tech', energy: 'Électrique', driver: 'Camille Bonnet', km: 18450, avgFill: 0, site: 'Évry' },
  { plate: 'NO-123-PQ', model: 'Citroën Berlingo', energy: 'SP95-E10', driver: 'Yanis Mercier', km: 44210, avgFill: 40, site: 'Massy' },
  { plate: 'RS-456-TU', model: 'Ford Transit Custom', energy: 'Gazole', driver: 'Léa Dupont', km: 59870, avgFill: 56, site: 'Créteil' },
  { plate: 'VW-789-XY', model: 'Dacia Jogger', energy: 'E85', driver: 'Romain Faure', km: 33120, avgFill: 39, site: 'Rungis' },
  { plate: 'ZA-012-BC', model: 'Peugeot e-Expert', energy: 'Électrique', driver: 'Inès Chevalier', km: 21980, avgFill: 0, site: 'Rungis' },
  { plate: 'DE-345-FG', model: 'Renault Trafic', energy: 'Gazole', driver: 'Maxime Robin', km: 87650, avgFill: 54, site: 'Évry' },
  { plate: 'HI-678-JK', model: 'Ford Kuga FHEV', energy: 'E85', driver: 'Sarah Blanc', km: 26540, avgFill: 44, site: 'Massy' },
  { plate: 'LM-901-NO', model: 'Iveco Daily', energy: 'Gazole', driver: 'Kevin Gauthier', km: 108230, avgFill: 70, site: 'Créteil' },
  { plate: 'PQ-234-RS', model: 'Citroën Jumpy', energy: 'Gazole', driver: 'Émilie Perrin', km: 49870, avgFill: 52, site: 'Rungis' },
];

export type CardStatus = 'active' | 'suspended';

export type FuelCard = {
  id: string;
  last4: string;
  holder: string;
  vehicle: string | null;
  products: string;
  monthlyLimit: number;
  spent: number;
};

const cardFromVehicle = (v: Vehicle, last4: string, limit: number, spent: number): FuelCard => ({
  id: `card-${last4}`,
  last4,
  holder: v.driver,
  vehicle: v.plate,
  products:
    v.energy === 'Électrique' ? 'Recharge électrique' : v.energy === 'E85' ? 'E85, SP95-E10' : v.energy,
  monthlyLimit: limit,
  spent,
});

const CARD_SPECS: [string, number, number][] = [
  ['4582', 1400, 1312.4],
  ['7319', 1200, 1048.6],
  ['2207', 1200, 986.2],
  ['6650', 1300, 1104.9],
  ['9034', 1400, 1220.3],
  ['1186', 800, 512.7],
  ['3471', 1800, 1655.1],
  ['8820', 1400, 1190.8],
  ['5093', 800, 498.4],
  ['6127', 400, 168.9],
  ['2748', 800, 546.2],
  ['9315', 1300, 1062.5],
  ['4406', 600, 352.8],
  ['7781', 400, 201.4],
  ['3054', 1300, 1088.0],
  ['6692', 600, 389.5],
  ['1937', 1800, 1598.7],
  ['8263', 1200, 977.3],
];

export const CARDS: FuelCard[] = [
  ...VEHICLES.map((v, i) => cardFromVehicle(v, CARD_SPECS[i][0], CARD_SPECS[i][1], CARD_SPECS[i][2])),
  { id: 'card-5510', last4: '5510', holder: 'Carte pool – Rungis', vehicle: null, products: 'Tous carburants', monthlyLimit: 1500, spent: 1124.6 },
  { id: 'card-0384', last4: '0384', holder: 'Carte pool – Massy', vehicle: null, products: 'Tous carburants', monthlyLimit: 1500, spent: 1032.9 },
  { id: 'card-7462', last4: '7462', holder: 'Carte pool – Créteil', vehicle: null, products: 'Tous carburants', monthlyLimit: 1200, spent: 845.2 },
  { id: 'card-2915', last4: '2915', holder: 'Carte pool – Évry', vehicle: null, products: 'Tous carburants', monthlyLimit: 1000, spent: 624.1 },
  { id: 'card-6038', last4: '6038', holder: 'Véhicule de remplacement', vehicle: null, products: 'Gazole, SP95-E10', monthlyLimit: 600, spent: 212.5 },
  { id: 'card-4179', last4: '4179', holder: 'Direction – Isabelle Martin', vehicle: null, products: 'Tous carburants', monthlyLimit: 800, spent: 286.0 },
];

export const DRIVERS = VEHICLES.map((v, i) => ({
  name: v.driver,
  vehicle: v.plate,
  site: v.site,
  phone: `06 ${String(12 + i * 3).padStart(2, '0')} ${String(40 + i).padStart(2, '0')} ${String(18 + i * 2).padStart(2, '0')} ${String(70 + i).padStart(2, '0')}`,
  workingHours: v.plate === 'AB-123-CD' ? '7 h 00 – 19 h 00' : i % 3 === 0 ? '6 h 00 – 14 h 00' : '8 h 00 – 18 h 00',
}));

export type Priority = 'critique' | 'haute' | 'moyenne' | 'faible';
export type AlertStatus = 'a_traiter' | 'en_cours' | 'mesure_prise' | 'verifiee';
export type AnomalyType = 'consommation' | 'pleins_rapproches' | 'hors_horaires' | 'kilometrage' | 'hors_zone';

export const ANOMALY_LABELS: Record<AnomalyType, string> = {
  consommation: 'Consommation inhabituelle',
  pleins_rapproches: 'Plusieurs pleins sur une période courte',
  hors_horaires: 'Achat en dehors des horaires habituels',
  kilometrage: 'Kilométrage incohérent',
  hors_zone: 'Carte utilisée loin de la zone habituelle',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  critique: 'Critique',
  haute: 'Haute',
  moyenne: 'Moyenne',
  faible: 'Faible',
};

export const STATUS_LABELS: Record<AlertStatus, string> = {
  a_traiter: 'À traiter',
  en_cours: 'En cours',
  mesure_prise: 'Mesure prise',
  verifiee: 'Vérifiée',
};

export type FleetAlert = {
  id: string;
  type: AnomalyType;
  priority: Priority;
  initialStatus: AlertStatus;
  vehicle: string;
  vehicleModel: string;
  driver: string;
  cardId: string;
  date: string; // ISO local
  amount: number;
  station: string;
  summary: string;
};

export const ALERTS: FleetAlert[] = [
  {
    id: 'ALR-1042',
    type: 'consommation',
    priority: 'critique',
    initialStatus: 'a_traiter',
    vehicle: 'AB-123-CD',
    vehicleModel: 'Renault Master',
    driver: 'Julien Moreau',
    cardId: 'card-4582',
    date: '2026-10-18T22:47:00',
    amount: 173.9,
    station: 'E.Leclerc Orly',
    summary: '94 L de gazole, +62 % par rapport au plein habituel, à 22 h 47',
  },
  {
    id: 'ALR-1041',
    type: 'pleins_rapproches',
    priority: 'haute',
    initialStatus: 'a_traiter',
    vehicle: 'GH-456-JK',
    vehicleModel: 'Peugeot Expert',
    driver: 'Sophie Lambert',
    cardId: 'card-7319',
    date: '2026-10-17T13:40:00',
    amount: 142.6,
    station: 'E.Leclerc Rungis',
    summary: '2 pleins en 6 h 28 min pour 41 km parcourus',
  },
  {
    id: 'ALR-1039',
    type: 'hors_zone',
    priority: 'haute',
    initialStatus: 'en_cours',
    vehicle: 'PQ-345-RS',
    vehicleModel: 'Ford Transit',
    driver: 'Nadia Rousseau',
    cardId: 'card-9034',
    date: '2026-10-16T18:32:00',
    amount: 131.75,
    station: 'E.Leclerc Saint-Priest',
    summary: 'Transaction à 465 km de la zone habituelle (Île-de-France)',
  },
  {
    id: 'ALR-1037',
    type: 'hors_horaires',
    priority: 'moyenne',
    initialStatus: 'a_traiter',
    vehicle: 'EF-789-GH',
    vehicleModel: 'Citroën Jumpy',
    driver: 'Karim Benali',
    cardId: 'card-2207',
    date: '2026-10-15T05:18:00',
    amount: 96.4,
    station: 'E.Leclerc Créteil',
    summary: 'Achat à 5 h 18, plage habituelle 8 h 00 – 18 h 00',
  },
  {
    id: 'ALR-1034',
    type: 'kilometrage',
    priority: 'moyenne',
    initialStatus: 'en_cours',
    vehicle: 'KL-012-MN',
    vehicleModel: 'Renault Trafic',
    driver: 'Thomas Garnier',
    cardId: 'card-6650',
    date: '2026-10-12T12:05:00',
    amount: 118.2,
    station: 'E.Leclerc Massy',
    summary: 'Kilométrage saisi inférieur au précédent (−1 240 km)',
  },
  {
    id: 'ALR-1029',
    type: 'hors_horaires',
    priority: 'faible',
    initialStatus: 'verifiee',
    vehicle: 'TU-678-VW',
    vehicleModel: 'Renault Kangoo',
    driver: 'Lucas Petit',
    cardId: 'card-1186',
    date: '2026-10-09T06:02:00',
    amount: 58.3,
    station: 'E.Leclerc Évry',
    summary: 'Achat à 6 h 02 – tournée anticipée confirmée',
  },
  {
    id: 'ALR-1024',
    type: 'kilometrage',
    priority: 'faible',
    initialStatus: 'verifiee',
    vehicle: 'BC-234-DE',
    vehicleModel: 'Renault Master',
    driver: 'Mélanie Fournier',
    cardId: 'card-8820',
    date: '2026-10-06T09:47:00',
    amount: 104.15,
    station: 'E.Leclerc Créteil',
    summary: 'Erreur de saisie du kilométrage, corrigée',
  },
  {
    id: 'ALR-1018',
    type: 'pleins_rapproches',
    priority: 'moyenne',
    initialStatus: 'verifiee',
    vehicle: 'XY-901-ZA',
    vehicleModel: 'Iveco Daily',
    driver: 'Antoine Leroy',
    cardId: 'card-3471',
    date: '2026-10-02T16:21:00',
    amount: 162.8,
    station: 'E.Leclerc Massy',
    summary: 'Deux pleins le même jour – longue tournée justifiée',
  },
];

export const PRIMARY_ALERT_ID = 'ALR-1042';

// Détail de l’alerte principale
export const PRIMARY_ALERT_DETAIL = {
  litres: 94,
  usualFill: 58,
  fleetAverage: 51,
  deviation: 62,
  usualHours: '7 h 00 – 19 h 00',
  confidence: 86,
  comparison: [
    { name: 'Plein habituel du véhicule', short: 'Habituel', litres: 58, kind: 'usual' },
    { name: 'Opération observée', short: 'Observé', litres: 94, kind: 'observed' },
    { name: 'Moyenne de la flotte (utilitaires)', short: 'Flotte', litres: 51, kind: 'fleet' },
  ],
  recentOperations: [
    { date: '2026-10-18T22:47:00', station: 'E.Leclerc Orly', litres: 94, amount: 173.9, flagged: true },
    { date: '2026-10-18T08:12:00', station: 'E.Leclerc Rungis', litres: 52, amount: 96.2, flagged: true },
    { date: '2026-10-14T07:46:00', station: 'E.Leclerc Rungis', litres: 61, amount: 112.85, flagged: false },
    { date: '2026-10-10T17:58:00', station: 'E.Leclerc Massy', litres: 57, amount: 105.45, flagged: false },
    { date: '2026-10-06T08:31:00', station: 'E.Leclerc Rungis', litres: 59, amount: 109.15, flagged: false },
  ],
};

export type Transaction = {
  id: string;
  date: string;
  card: string;
  vehicle: string;
  driver: string;
  station: string;
  product: string;
  quantity: string;
  amount: number;
  flagged?: boolean;
};

const STATIONS = ['E.Leclerc Rungis', 'E.Leclerc Massy', 'E.Leclerc Créteil', 'E.Leclerc Évry', 'E.Leclerc Orly'];

export const TRANSACTIONS: Transaction[] = (() => {
  const list: Transaction[] = [
    { id: 'TX-88231', date: '2026-10-18T22:47:00', card: '4582', vehicle: 'AB-123-CD', driver: 'Julien Moreau', station: 'E.Leclerc Orly', product: 'Gazole', quantity: '94,0 L', amount: 173.9, flagged: true },
    { id: 'TX-88204', date: '2026-10-18T08:12:00', card: '4582', vehicle: 'AB-123-CD', driver: 'Julien Moreau', station: 'E.Leclerc Rungis', product: 'Gazole', quantity: '52,0 L', amount: 96.2, flagged: true },
  ];
  let day = 20;
  let hour = 7;
  VEHICLES.slice(1).forEach((v, i) => {
    const elec = v.energy === 'Électrique';
    const qty = elec ? 38 + (i % 4) * 6 : v.avgFill - 6 + (i % 5) * 3;
    const unit = elec ? 0.26 : v.energy === 'E85' ? 0.84 : v.energy === 'SP95-E10' ? 1.79 : 1.73;
    list.push({
      id: `TX-${88250 - i * 7}`,
      date: `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}:00`,
      card: CARD_SPECS[i + 1][0],
      vehicle: v.plate,
      driver: v.driver,
      station: elec ? 'Borne E.Leclerc Rungis' : STATIONS[i % STATIONS.length],
      product: elec ? 'Recharge électrique' : v.energy,
      quantity: elec ? `${qty} kWh` : `${qty.toFixed(1).replace('.', ',')} L`,
      amount: Math.round(qty * unit * 100) / 100,
    });
    hour += 3;
    if (hour > 18) {
      hour = 7;
      day -= 1;
    }
  });
  return list.sort((a, b) => b.date.localeCompare(a.date));
})();

export type LogEntry = {
  id: string;
  date: string; // ISO
  action: string;
  user: string;
  reason: string;
  status: 'info' | 'success' | 'warning';
  statusLabel: string;
  alertId?: string;
  cardId?: string;
};

export const INITIAL_LOG: LogEntry[] = [
  {
    id: 'log-3',
    date: '2026-10-19T08:04:00',
    action: 'Alerte consultée',
    user: 'Marc Lefèvre',
    reason: '—',
    status: 'info',
    statusLabel: 'Consultée',
    alertId: 'ALR-1042',
  },
  {
    id: 'log-2',
    date: '2026-10-18T22:48:00',
    action: 'Notification envoyée au gestionnaire (e-mail et application)',
    user: 'Système de détection',
    reason: 'Alerte de priorité critique',
    status: 'info',
    statusLabel: 'Envoyée',
    alertId: 'ALR-1042',
  },
  {
    id: 'log-1',
    date: '2026-10-18T22:47:00',
    action: 'Alerte « Consommation inhabituelle » générée',
    user: 'Système de détection',
    reason: '4 facteurs de risque détectés',
    status: 'warning',
    statusLabel: 'Alerte ouverte',
    alertId: 'ALR-1042',
  },
  {
    id: 'log-0',
    date: '2026-10-09T11:20:00',
    action: 'Alerte ALR-1029 marquée comme vérifiée',
    user: 'Marc Lefèvre',
    reason: 'Tournée anticipée confirmée par le conducteur',
    status: 'success',
    statusLabel: 'Clôturée',
    alertId: 'ALR-1029',
  },
];
