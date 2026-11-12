import { useState } from 'react';
import { Bot, Copy, KeyRound, Loader2, PlayCircle } from 'lucide-react';
import { CONSIGNE, MODELE, type ResultatAnalyse } from '../claude/consigne';
import { Button, Panel } from './ui';
import { cx } from '../utils';

/*
 * Exemple affiché par défaut, pour l'alerte principale : réponse au format exact de l'API,
 * préparée avec Claude Code à partir de la même consigne et des mêmes faits.
 * Le mode « en direct » appelle réellement l'API avec la clé du visiteur.
 */
const EXEMPLES: Record<string, ResultatAnalyse> = {
  'ALR-1042': {
    modele: 'exemple',
    date: '2026-11-11T17:00:00.000Z',
    analyse: {
      resume: 'Le 18 octobre, la carte du Renault Master AB-123-CD a servi deux fois en moins de 15 heures : 52 L à 8 h 12, puis 94 L à 22 h 47, hors de la plage habituelle du véhicule. Le second plein dépasse de 62 % le plein habituel de 58 L.',
      hypotheses: [
        { hypothese: 'Carburant versé dans un autre réservoir que celui du véhicule (jerrican, autre véhicule).', indice: '146 L en une journée pour un plein habituel de 58 L.' },
        { hypothese: 'Mission exceptionnelle de longue distance ou de nuit.', indice: 'Possible, mais aucune mission n\'apparaît dans les données fournies.' },
        { hypothese: 'Erreur d\'affectation de l\'opération à cette carte.', indice: 'Les deux opérations portent la même carte et le même véhicule : à vérifier sur le ticket.' },
      ],
      risque: 'élevé',
      action_recommandee: 'Contacter le conducteur',
      justification: 'Le volume et l\'horaire justifient une vérification rapide, mais une mission exceptionnelle reste possible : un échange avec le conducteur doit précéder toute suspension.',
      message_conducteur: 'Bonjour Julien, la carte du Renault Master AB-123-CD a enregistré un plein de 94 L le 18 octobre à 22 h 47, à la station d\'Orly. Pouvez-vous me préciser le contexte de cette opération ? Si vous avez conservé le ticket, merci de me le transmettre. Bonne journée.',
      points_a_verifier: [
        'Capacité du réservoir du véhicule : un plein de 94 L est-il possible ?',
        'Planning du véhicule le 18 octobre : une mission de nuit était-elle prévue ?',
        'Ticket de l\'opération de 22 h 47.',
      ],
    },
  },
};

const RISQUE_STYLE: Record<string, string> = {
  faible: 'bg-emerald-50 text-emerald-800',
  modéré: 'bg-amber-50 text-amber-800',
  élevé: 'bg-red-50 text-red-800',
};

export function ClaudeAnalyse({ alertId, faits }: { alertId: string; faits: unknown }) {
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(EXEMPLES[alertId] ?? null);
  const [ouvert, setOuvert] = useState(false);
  const [cle, setCle] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);

  const lancer = async () => {
    setErreur(null);
    setChargement(true);
    try {
      const { analyserAlerte } = await import('../claude/explainAlert');
      setResultat(await analyserAlerte(cle.trim(), faits));
      setOuvert(false);
    } catch (e) {
      const { messageErreur } = await import('../claude/explainAlert').catch(() => ({ messageErreur: () => 'Chargement du module Claude impossible.' }));
      setErreur(messageErreur(e));
    } finally {
      setChargement(false);
      setCle('');
    }
  };

  const copier = async () => {
    if (!resultat) return;
    try {
      await navigator.clipboard.writeText(resultat.analyse.message_conducteur);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable */
    }
  };

  const enDirect = resultat && resultat.modele !== 'exemple';

  return (
    <Panel
      title={
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white"><Bot size={17} aria-hidden /></span>
          <div>
            <h2 className="font-title text-[15px] font-semibold text-navy">Analyse par Claude</h2>
            <p className="text-xs text-slate-500">Les règles détectent, Claude explique et propose. Vous décidez.</p>
          </div>
        </div>
      }
      action={
        <Button size="sm" variant="secondary" className="whitespace-nowrap" icon={<PlayCircle size={15} aria-hidden />} onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-controls="claude-direct">
          Analyser en direct
        </Button>
      }
    >
      <div role="note" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] leading-snug text-navy">
        <strong>Comment ça marche :</strong> par défaut, vous voyez un <strong>exemple enregistré</strong>, préparé avec Claude Code selon la même consigne. Pour un <strong>appel réel à Claude</strong>, cliquez sur « Analyser en direct » et saisissez votre clé API Anthropic : l’appel est facturé sur votre compte (moins d’un centime), la clé n’est jamais stockée.
      </div>
      {ouvert && (
        <form
          id="claude-direct"
          className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (cle.trim()) void lancer();
          }}
        >
          <label htmlFor="cle-api" className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            <KeyRound size={15} aria-hidden /> Votre clé API Anthropic
          </label>
          <p id="cle-aide" className="mt-1 text-xs text-slate-600">
            La clé reste dans votre navigateur : elle n'est envoyée qu'à l'API Anthropic, n'est pas enregistrée et est effacée après l'appel. Modèle : {MODELE}.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input id="cle-api" type="password" autoComplete="off" spellCheck={false} value={cle} onChange={(e) => setCle(e.target.value)} aria-describedby="cle-aide" className="min-w-0 flex-1 rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-navy" placeholder="sk-ant-…" />
            <Button type="submit" disabled={!cle.trim() || chargement} icon={chargement ? <Loader2 size={15} className="animate-spin" aria-hidden /> : undefined}>
              {chargement ? 'Analyse en cours…' : 'Lancer l\'analyse'}
            </Button>
          </div>
          <p role="status" aria-live="polite" className="mt-2 text-sm text-red-700">{erreur ?? ''}</p>
        </form>
      )}

      {!resultat ? (
        <p className="text-sm text-slate-600">Lancez l'analyse en direct pour obtenir l'explication de cette alerte.</p>
      ) : (
        <div aria-live="polite">
          <p className={cx('mb-3 inline-block rounded-md px-2 py-0.5 text-xs font-semibold', enDirect ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-700')}>
            {enDirect
              ? `Réponse en direct de l'API Claude (${resultat.modele}), à valider par le gestionnaire`
              : 'Exemple enregistré, préparé avec Claude Code selon la même consigne et le même format'}
          </p>
          <p className="text-[15px] leading-relaxed text-navy">{resultat.analyse.resume}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className={cx('rounded-full px-2.5 py-0.5 font-semibold', RISQUE_STYLE[resultat.analyse.risque])}>Risque {resultat.analyse.risque}</span>
            <span className="rounded-full bg-navy px-2.5 py-0.5 font-semibold text-white">Recommandé : {resultat.analyse.action_recommandee}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{resultat.analyse.justification}</p>

          <h3 className="mt-4 text-sm font-semibold text-navy">Hypothèses</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {resultat.analyse.hypotheses.map((h) => (
              <li key={h.hypothese}>
                <span className="font-medium text-navy">{h.hypothese}</span> <span className="text-slate-600">— {h.indice}</span>
              </li>
            ))}
          </ol>

          <h3 className="mt-4 text-sm font-semibold text-navy">À vérifier avant de décider</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {resultat.analyse.points_a_verifier.map((p) => <li key={p}>{p}</li>)}
          </ul>

          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-navy">Message proposé au conducteur</h3>
              <Button size="sm" variant="ghost" icon={<Copy size={14} aria-hidden />} onClick={copier}>{copie ? 'Copié' : 'Copier'}</Button>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{resultat.analyse.message_conducteur}</p>
          </div>
        </div>
      )}

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-navy">Consigne et données envoyées à Claude</summary>
        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700" tabIndex={0}>{CONSIGNE}</pre>
        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700" tabIndex={0}>{JSON.stringify(faits, null, 2)}</pre>
      </details>
    </Panel>
  );
}
