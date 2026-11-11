/*
 * Analyse d'une alerte de flotte par Claude.
 * Les règles du prototype détectent l'anomalie ; Claude l'explique, propose une action
 * et rédige un message au conducteur. La décision reste au gestionnaire.
 *
 * Appel direct depuis le navigateur avec la clé du visiteur : la clé n'est ni stockée
 * ni envoyée ailleurs qu'à l'API Anthropic. Aucun serveur intermédiaire.
 */
import Anthropic from '@anthropic-ai/sdk';
import { betaJSONSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/beta/json-schema.mjs';
import { CONSIGNE, MODELE, type AnalyseClaude, type ResultatAnalyse } from './consigne';

const SCHEMA = {
  type: 'object',
  properties: {
    resume: { type: 'string', description: 'Ce qui s\'est passé, en 2 phrases maximum.' },
    hypotheses: {
      type: 'array',
      description: '2 ou 3 explications possibles, de la plus à la moins probable.',
      items: {
        type: 'object',
        properties: {
          hypothese: { type: 'string' },
          indice: { type: 'string', description: 'Le fait fourni qui soutient ou affaiblit cette hypothèse.' },
        },
        required: ['hypothese', 'indice'],
        additionalProperties: false,
      },
    },
    risque: { type: 'string', enum: ['faible', 'modéré', 'élevé'] },
    action_recommandee: { type: 'string', enum: ['Surveiller', 'Contacter le conducteur', 'Suspendre temporairement la carte'] },
    justification: { type: 'string', description: 'Pourquoi cette action, en une phrase.' },
    message_conducteur: { type: 'string' },
    points_a_verifier: { type: 'array', items: { type: 'string' } },
  },
  required: ['resume', 'hypotheses', 'risque', 'action_recommandee', 'justification', 'message_conducteur', 'points_a_verifier'],
  additionalProperties: false,
} as const;

export async function analyserAlerte(cleApi: string, faits: unknown): Promise<ResultatAnalyse> {
  const client = new Anthropic({ apiKey: cleApi, dangerouslyAllowBrowser: true, maxRetries: 1 });
  const response = await client.beta.messages.parse({
    model: MODELE,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: CONSIGNE,
    output_config: { effort: 'medium', format: betaJSONSchemaOutputFormat(SCHEMA) },
    messages: [{ role: 'user', content: `Alerte et données du véhicule (JSON) :\n${JSON.stringify(faits, null, 2)}` }],
  });
  if (response.stop_reason === 'refusal') throw new Error('Claude a refusé de traiter cette demande.');
  if (response.stop_reason === 'max_tokens') throw new Error('La réponse a été coupée avant la fin. Réessayez.');
  if (!response.parsed_output) throw new Error('La réponse de Claude n\'a pas le format attendu.');
  return { analyse: response.parsed_output as AnalyseClaude, modele: response.model, date: new Date().toISOString() };
}

export function messageErreur(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Clé API refusée. Vérifiez la clé saisie.';
  if (e instanceof Anthropic.PermissionDeniedError) return 'Cette clé n\'a pas accès à ce modèle.';
  if (e instanceof Anthropic.RateLimitError) return 'Trop de demandes pour cette clé. Réessayez dans une minute.';
  if (e instanceof Anthropic.APIConnectionError) return 'Connexion à l\'API impossible. Vérifiez votre réseau.';
  if (e instanceof Anthropic.APIError) return `Erreur de l'API (${e.status}).`;
  return e instanceof Error ? e.message : 'Erreur inconnue.';
}
