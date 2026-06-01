// Types du module Orientation — copilote d'insertion pour jeunes

export type Urgency = 'low' | 'medium' | 'high'

export type Appetence =
  | 'manuel'
  | 'numerique'
  | 'commerce'
  | 'technique'
  | 'social'

export type Motivation =
  | 'alternance'
  | 'formation-courte'
  | 'interim'
  | 'freelance'
  | 'emploi-direct'

export interface YoungProfileInput {
  age?: number
  city?: string
  education?: string
  lastJob?: string
  savingsBand?: string
  urgency?: Urgency
  // Champs enrichis (vision "diagnostic initial")
  charges?: string // dettes / charges mensuelles
  hasLicense?: boolean // permis de conduire
  mobility?: string // mobilité (transports, rayon)
  appetences?: Appetence[] // manuel / numérique / commerce / technique / social
  motivations?: Motivation[] // alternance / formation courte / intérim / freelance
  interests: string[]
  constraints: string[]
}

export interface YoungProfile extends YoungProfileInput {
  id: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export type SessionStatus = 'draft' | 'diagnosed' | 'planned' | 'completed'

export interface OrientationSession {
  id: string
  profileId: string
  userId: string
  status: SessionStatus
  summary?: string | null
  urgencyScore?: number | null
  autonomyScore?: number | null
  clarityScore?: number | null
  immediateRisks?: string[]
  doNotDo?: string[]
  remainingQuestions?: string[]
  createdAt?: string
  updatedAt?: string
  careerTracks?: CareerTrack[]
  actionPlans?: ActionPlan[]
}

export type CareerCategory =
  | 'sans-diplome'
  | 'alternance'
  | 'formation-courte'
  | 'service-civique'
  | 'autre'

export interface CareerTrack {
  id?: string
  sessionId?: string
  title: string
  category: CareerCategory
  score: number // 0-100
  reasons: string[]
  risks: string[]
  nextActions: string[]
}

export type Horizon = '48h' | '7j' | '30j' | '90j'
export type ActionStatus = 'todo' | 'doing' | 'done'

export interface ActionPlan {
  id?: string
  sessionId?: string
  horizon: Horizon
  title: string
  description: string
  priority: number // 1 = haute
  status: ActionStatus
  dueDate?: string | null
}

export type ResourceType =
  | 'dispositif'
  | 'formation'
  | 'aide'
  | 'organisme'
  | 'lien'

export type ResourceCategory =
  | 'revenu'
  | 'formation'
  | 'accompagnement'
  | 'mobilite'

export interface Resource {
  id?: string
  title: string
  type: ResourceType
  url?: string | null
  source?: string | null
  category: ResourceCategory
  summary?: string | null
  tags: string[]
}

// Résultat complet d'un diagnostic produit par l'agent
export interface DiagnosticResult {
  summary: string
  // Scores de profil (vision : urgence / autonomie / clarté), 0-100
  scores: {
    urgency: number
    autonomy: number
    clarity: number
  }
  // Risques immédiats identifiés (financiers, démarches, etc.)
  immediateRisks: string[]
  careerTracks: CareerTrack[]
  actionPlans: ActionPlan[]
  // Ce que le jeune ne doit PAS faire (garde-fous concrets)
  doNotDo: string[]
  // Questions restantes strictement nécessaires
  remainingQuestions: string[]
  recommendedResources: string[] // titres / sources suggérés par l'agent
}
