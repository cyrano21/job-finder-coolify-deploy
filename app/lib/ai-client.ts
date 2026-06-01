import OpenAI from 'openai'
import { resolveAIConfig } from './ai-config'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
}

/**
 * Helper de complétion partagé par tous les modules IA (orientation, coaching,
 * jobs). Résout dynamiquement le fournisseur/modèle actif depuis la config
 * (modèle par défaut défini en admin, sinon env), crée le client compatible
 * OpenAI, et essaie les modèles de repli en cascade sur erreur transitoire
 * (429 rate limit) ou de crédit (402).
 *
 * Renvoie le contenu texte de la réponse (chaîne vide si aucun contenu).
 */
export async function chatCompletion(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<string> {
  const cfg = await resolveAIConfig()
  const client = new OpenAI({
    apiKey: cfg.apiKey || 'not-needed-for-local',
    baseURL: cfg.baseURL,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
      'X-Title': 'Job Finder',
    },
  })

  const chain = Array.from(new Set([cfg.model, ...cfg.fallbackModels]))
  let lastError: unknown = null
  for (const model of chain) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 1000,
      })
      return response.choices[0]?.message?.content || ''
    } catch (e) {
      const status = (e as { status?: number })?.status
      lastError = e
      if (status === 429 || status === 402) {
        console.warn(
          `AI: modèle ${model} indisponible (${status}), repli sur le suivant.`
        )
        continue
      }
      throw e
    }
  }
  throw lastError ?? new Error('Aucun modèle IA disponible')
}
