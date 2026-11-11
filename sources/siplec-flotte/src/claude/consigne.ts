/* Consigne, modèle et types partagés (chargés avec la page ; le SDK est chargé à la demande). */
export const MODELE = 'claude-opus-5-5';

export const CONSIGNE = `Tu assistes le gestionnaire de flotte d'une entreprise cliente d'une carte carburant professionnelle.
On te transmet une alerte détectée par des règles automatiques et les opérations récentes du véhicule.
Ta mission : expliquer l'alerte en langage clair, proposer une action et rédiger un message au conducteur.
Règles :
- N'utilise que les faits fournis. N'invente aucun chiffre, aucun lieu, aucun motif.
- Une anomalie n'est pas une fraude : formule des hypothèses, n'accuse personne.
- Si une information manque pour trancher, mets-la dans « points_a_verifier ».
- La décision appartient au gestionnaire : ta recommandation est une aide.
- Français, phrases courtes. Message au conducteur : vouvoiement, ton neutre, 4 phrases maximum.`;

export type AnalyseClaude = {
  resume: string;
  hypotheses: { hypothese: string; indice: string }[];
  risque: 'faible' | 'modéré' | 'élevé';
  action_recommandee: 'Surveiller' | 'Contacter le conducteur' | 'Suspendre temporairement la carte';
  justification: string;
  message_conducteur: string;
  points_a_verifier: string[];
};

export type ResultatAnalyse = { analyse: AnalyseClaude; modele: string; date: string };

