import { monitorAICall } from '@/app/modules/utils/ai-performance-monitor'
import { chatCompletion } from '@/app/lib/ai-client'
import { knowledgeBaseForPrompt } from './knowledge-base'
import type {
  YoungProfileInput,
  DiagnosticResult,
  CareerTrack,
  ActionPlan,
} from './types'

// Helper local : délègue au helper IA partagé (résolution dynamique du modèle
// + repli en cascade), en conservant la signature utilisée plus bas.
async function chatWithFallback(
  messages: { role: 'system' | 'user'; content: string }[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  return chatCompletion(messages, {
    temperature: opts.temperature,
    maxTokens: opts.maxTokens ?? 1800,
  })
}

// Agent d'orientation-action pour jeunes 16-25 ans.
// Le prompt intègre les GARDE-FOUS (vision produit + CNIL) : pas de promesse
// d'emploi, pas de diagnostic santé, pas de crédit, pas de formation payante
// non vérifiée, protection de l'épargne, minimisation des données, orientation
// systématique vers les dispositifs officiels.
const SYSTEM_PROMPT = `Tu es un agent d'orientation-action pour les jeunes de 16 à 25 ans en France.
Ta mission : transformer une situation floue en plan concret — revenus rapides, démarches administratives, choix de pistes métiers réalistes, tests pratiques (immersion PMSMP, mini-projets), formations courtes, alternance, et construction de preuves concrètes.

POSTURE
- Tu agis, tu ne fais pas de discours motivationnel vague. Pas de "quel est ton rêve ?".
- Tu privilégies l'action vérifiable : rendez-vous, candidature, immersion, mini-projet, portfolio, appel, simulation d'aides.
- Tu distingues ce qui est certain, probable, ou à vérifier localement.
- Tu t'appuies UNIQUEMENT sur des dispositifs réels. Base de connaissances disponible :
${knowledgeBaseForPrompt()}

GARDE-FOUS STRICTS (non négociables)
- Tu ne promets JAMAIS un emploi ni un revenu garanti.
- Tu ne fais AUCUN diagnostic de santé physique ou mentale. Si détresse, tu orientes vers un professionnel ou le 3114 (prévention suicide).
- Tu ne conseilles JAMAIS un crédit, un prêt, ni un achat coûteux. Tu protèges l'épargne du jeune tant qu'il n'a pas de trajectoire claire.
- Tu ne pousses JAMAIS une formation payante non vérifiée. Tu privilégies les dispositifs gratuits/financés (CPF, POEI, Mission Locale, alternance).
- Tu ne remplaces PAS la Mission Locale, France Travail, un conseiller d'orientation ou un assistant social : tu prépares le jeune AVANT, PENDANT et APRÈS ces rendez-vous.
- Tu ne demandes que les informations strictement nécessaires (minimisation des données, RGPD). Pas de données de santé sensibles.
- Tu n'orientes pas uniquement vers des services privés.

Réponds STRICTEMENT en JSON valide, sans aucun texte autour.`

function profileToText(profile: YoungProfileInput): string {
  return [
    `Âge : ${profile.age ?? 'non précisé'}`,
    `Ville : ${profile.city ?? 'non précisée'}`,
    `Niveau d'études : ${profile.education ?? 'non précisé'}`,
    `Dernier emploi : ${profile.lastJob ?? 'aucun'}`,
    `Épargne : ${profile.savingsBand ?? 'non précisée'}`,
    `Charges / dettes : ${profile.charges ?? 'non précisées'}`,
    `Urgence de revenu : ${profile.urgency ?? 'non précisée'}`,
    `Permis de conduire : ${
      profile.hasLicense === undefined ? 'non précisé' : profile.hasLicense ? 'oui' : 'non'
    }`,
    `Mobilité : ${profile.mobility ?? 'non précisée'}`,
    `Appétences : ${profile.appetences?.join(', ') || 'non précisées'}`,
    `Motivations (alternance/formation/intérim/freelance) : ${
      profile.motivations?.join(', ') || 'non précisées'
    }`,
    `Centres d'intérêt : ${profile.interests?.join(', ') || 'non précisés'}`,
    `Contraintes : ${profile.constraints?.join(', ') || 'aucune'}`,
  ].join('\n')
}

function safeParse<T>(content: string, fallback: T): T {
  try {
    // Retire d'éventuels fences ```json … ```
    const cleaned = content
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/i, '')
      .trim()
    return JSON.parse(cleaned) as T
  } catch (e) {
    console.error('Orientation: JSON parse failed, using fallback.', e)
    return fallback
  }
}

/**
 * Diagnostic complet : synthèse "brutale", pistes métiers, plan d'action et
 * ressources recommandées, en un seul appel.
 */
export async function runDiagnostic(
  profile: YoungProfileInput
): Promise<DiagnosticResult> {
  return monitorAICall(
    'orientation.runDiagnostic',
    async () => {
      const prompt = `Voici la situation du jeune :
${profileToText(profile)}

Produis un diagnostic-action complet au format JSON suivant (structure en 8 points) :
{
  "summary": "diagnostic de situation : direct, structuré, sans promesse (3-5 phrases)",
  "scores": {
    "urgency": 0-100,    // urgence financière / besoin de revenu rapide
    "autonomy": 0-100,   // capacité à agir seul sur les démarches
    "clarity": 0-100     // clarté du projet professionnel
  },
  "immediateRisks": ["risque immédiat 1 (ex: épargne qui fond, charge non couverte)", "..."],
  "careerTracks": [
    {
      "title": "intitulé de la piste",
      "category": "sans-diplome|alternance|formation-courte|service-civique|autre",
      "score": 0-100,
      "reasons": ["raison 1", "raison 2"],
      "risks": ["risque 1"],
      "nextActions": ["action concrète 1", "action concrète 2"]
    }
  ],
  "actionPlans": [
    {
      "horizon": "48h|7j|30j|90j",
      "title": "titre court de la tâche",
      "description": "action concrète et vérifiable",
      "priority": 1,
      "status": "todo"
    }
  ],
  "doNotDo": ["ce qu'il ne doit PAS faire (ex: acheter du matériel coûteux, prendre un crédit, s'inscrire à une formation payante non vérifiée)"],
  "remainingQuestions": ["question strictement nécessaire encore manquante"],
  "recommendedResources": ["nom exact du dispositif 1", "nom exact du dispositif 2"]
}

Contraintes : 3 pistes métiers cohérentes, au moins une action par horizon (48h, 7j, 30j, 90j), et au moins 2 éléments dans doNotDo en cohérence avec l'épargne et l'urgence du jeune.`

      const content =
        (await chatWithFallback(
          [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          { temperature: 0.6, maxTokens: 2200 }
        )) || '{}'
      return safeParse<DiagnosticResult>(content, {
        summary:
          "Le diagnostic automatique n'a pas pu être généré. Première étape sûre : contacter la Mission Locale et vérifier l'inscription à France Travail pour activer un accompagnement (CEJ).",
        scores: { urgency: 50, autonomy: 50, clarity: 50 },
        immediateRisks: [
          "Situation à clarifier avant toute dépense ou engagement.",
        ],
        careerTracks: [],
        actionPlans: [],
        doNotDo: [
          "Ne fais aucun achat de matériel coûteux tant que la piste n'est pas validée.",
          "Ne prends aucun crédit et ne t'inscris à aucune formation payante non vérifiée.",
        ],
        remainingQuestions: [
          'Quelle est ta ville exacte ?',
          'De combien de temps disposes-tu avant de manquer de revenu ?',
        ],
        recommendedResources: [
          'Mission Locale',
          "Contrat d'Engagement Jeune (CEJ)",
        ],
      })
    },
    { model: 'dynamic' }
  )
}

/**
 * Régénère uniquement les pistes métiers (career-matcher).
 */
export async function matchCareers(
  profile: YoungProfileInput
): Promise<CareerTrack[]> {
  return monitorAICall(
    'orientation.matchCareers',
    async () => {
      const prompt = `Situation du jeune :
${profileToText(profile)}

Propose 4 pistes métiers cohérentes au format JSON (tableau) :
[{ "title": "", "category": "sans-diplome|alternance|formation-courte|service-civique|autre", "score": 0-100, "reasons": [], "risks": [], "nextActions": [] }]`

      const content =
        (await chatWithFallback(
          [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          { temperature: 0.7, maxTokens: 1200 }
        )) || '[]'
      return safeParse<CareerTrack[]>(content, [])
    },
    { model: 'dynamic' }
  )
}

/**
 * Génère un plan d'action 48h / 7j / 30j / 90j (action-planner).
 */
export async function planActions(
  profile: YoungProfileInput,
  chosenTrack?: string
): Promise<ActionPlan[]> {
  return monitorAICall(
    'orientation.planActions',
    async () => {
      const prompt = `Situation du jeune :
${profileToText(profile)}
${chosenTrack ? `Piste choisie : ${chosenTrack}` : ''}

Génère un plan d'action concret échelonné au format JSON (tableau) avec au moins une tâche par horizon :
[{ "horizon": "48h|7j|30j|90j", "title": "", "description": "", "priority": 1, "status": "todo" }]`

      const content =
        (await chatWithFallback(
          [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          { temperature: 0.6, maxTokens: 1200 }
        )) || '[]'
      return safeParse<ActionPlan[]>(content, [])
    },
    { model: 'dynamic' }
  )
}
