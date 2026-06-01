// Configuration IA centralisée — provider-agnostique.
//
// Tous les fournisseurs ci-dessous exposent une API compatible OpenAI
// (endpoint /chat/completions), donc le même client OpenAI SDK fonctionne en
// changeant seulement baseURL / apiKey / model.
//
// Le modèle actif est résolu dynamiquement :
//   1. modèle marqué isDefault=true et enabled=true dans la table AIModelConfig
//   2. sinon, fallback sur les variables d'env (AI_PROVIDER / AI_MODEL)
//
// Les CLÉS API ne sont jamais stockées en base : on référence le nom de la
// variable d'env (apiKeyEnv) qui contient la clé.

import prisma from './prisma'

export type AIProvider =
  | 'groq'
  | 'openai'
  | 'deepseek'
  | 'mistral'
  | 'xai'
  | 'gemini'
  | 'openrouter'
  | 'local'

export interface ProviderCatalogEntry {
  baseURL: string
  apiKeyEnv: string
  defaultModel: string
  label: string
  requiresKey: boolean
}

// Catalogue des fournisseurs connus (URL + nom de variable d'env de la clé).
export const PROVIDER_CATALOG: Record<AIProvider, ProviderCatalogEntry> = {
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    defaultModel: 'llama-3.3-70b-versatile',
    label: 'Groq',
    requiresKey: true,
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o-mini',
    label: 'OpenAI',
    requiresKey: true,
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    defaultModel: 'deepseek-chat',
    label: 'DeepSeek',
    requiresKey: true,
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    defaultModel: 'mistral-small-latest',
    label: 'Mistral',
    requiresKey: true,
  },
  xai: {
    baseURL: 'https://api.x.ai/v1',
    apiKeyEnv: 'GROK_API_KEY',
    defaultModel: 'grok-2-1212',
    label: 'xAI (Grok)',
    requiresKey: true,
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    label: 'Google Gemini',
    requiresKey: true,
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    label: 'OpenRouter',
    requiresKey: true,
  },
  local: {
    // Par défaut Ollama ; surchargeable par baseUrl dans la config DB.
    baseURL: process.env.LOCAL_AI_BASE_URL || 'http://localhost:11434/v1',
    apiKeyEnv: '',
    defaultModel: 'llama3.1',
    label: 'Local (Ollama / LM Studio)',
    requiresKey: false,
  },
}

// Résolution de configuration effective utilisée par les clients IA.
export interface ResolvedAIConfig {
  provider: AIProvider
  baseURL: string
  apiKey: string
  model: string
  fallbackModels: string[]
}

// ── Fallback statique basé sur l'env (si aucun modèle par défaut en base) ──

const ENV_PROVIDER = (process.env.AI_PROVIDER || 'groq') as AIProvider

function envConfig(): ResolvedAIConfig {
  const entry = PROVIDER_CATALOG[ENV_PROVIDER] || PROVIDER_CATALOG.groq
  return {
    provider: ENV_PROVIDER,
    baseURL: entry.baseURL,
    apiKey: entry.apiKeyEnv ? process.env[entry.apiKeyEnv] || '' : '',
    model: process.env.AI_MODEL || entry.defaultModel,
    fallbackModels: staticFallbacks(ENV_PROVIDER, entry.defaultModel),
  }
}

function staticFallbacks(provider: AIProvider, defaultModel: string): string[] {
  switch (provider) {
    case 'groq':
      return ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
    case 'openrouter':
      return [
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen3-next-80b-a3b-instruct:free',
        'google/gemma-4-31b-it:free',
      ]
    default:
      return [defaultModel]
  }
}

/**
 * Résout la configuration IA active. Lit d'abord le modèle par défaut en base
 * (AIModelConfig isDefault + enabled). Retombe sur l'env en cas d'absence ou
 * d'erreur DB, pour ne jamais bloquer les appels IA.
 */
export async function resolveAIConfig(): Promise<ResolvedAIConfig> {
  try {
    const def = await prisma.aIModelConfig.findFirst({
      where: { isDefault: true, enabled: true },
    })
    if (!def) return envConfig()

    const provider = def.provider as AIProvider
    const catalog = PROVIDER_CATALOG[provider]
    const baseURL = def.baseUrl || catalog?.baseURL || ''
    const apiKeyEnv = def.apiKeyEnv || catalog?.apiKeyEnv || ''
    const apiKey = apiKeyEnv ? process.env[apiKeyEnv] || '' : ''

    // Autres modèles activés du même fournisseur = repli.
    const others = await prisma.aIModelConfig.findMany({
      where: { enabled: true, provider: def.provider, id: { not: def.id } },
      select: { model: true },
    })

    return {
      provider,
      baseURL,
      apiKey,
      model: def.model,
      fallbackModels: [def.model, ...others.map((o) => o.model)],
    }
  } catch (e) {
    console.warn('resolveAIConfig: DB indisponible, fallback env.', e)
    return envConfig()
  }
}

// ── Compat : exports statiques encore utilisés par certains modules ──
// (résolus depuis l'env ; les services migrés utilisent resolveAIConfig()).
const _env = envConfig()
export const AI_PROVIDER = _env.provider
export const AI_BASE_URL = _env.baseURL
export const AI_API_KEY = _env.apiKey
export const AI_MODEL = _env.model
export const AI_FALLBACK_MODELS = _env.fallbackModels
export const OPENROUTER_MODEL = _env.model
export const OPENROUTER_BASE_URL = _env.baseURL
export const OPENROUTER_FALLBACK_MODELS = _env.fallbackModels
