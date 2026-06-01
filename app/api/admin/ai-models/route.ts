import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'
import { PROVIDER_CATALOG, type AIProvider } from '@/app/lib/ai-config'

// Vérifie que l'appelant est un ADMIN. Renvoie l'erreur NextResponse sinon null.
async function requireAdmin() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }) }
  }
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Accès réservé aux admins' }, { status: 403 }) }
  }
  return { user: dbUser }
}

// Indique si la clé d'env d'un fournisseur est présente (sans révéler sa valeur).
function keyPresent(provider: string, apiKeyEnv?: string | null): boolean {
  const envName =
    apiKeyEnv || PROVIDER_CATALOG[provider as AIProvider]?.apiKeyEnv || ''
  if (!envName) return true // local : pas de clé requise
  return Boolean(process.env[envName])
}

// GET /api/admin/ai-models — liste des modèles + catalogue des fournisseurs
export async function GET() {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const models = await prisma.aIModelConfig.findMany({
    orderBy: [{ isDefault: 'desc' }, { label: 'asc' }],
  })

  // Statut de clé par modèle (présente ou non), sans jamais exposer la clé.
  const withStatus = models.map((m) => ({
    ...m,
    keyConfigured: keyPresent(m.provider, m.apiKeyEnv),
  }))

  const catalog = Object.entries(PROVIDER_CATALOG).map(([id, c]) => ({
    provider: id,
    label: c.label,
    defaultModel: c.defaultModel,
    apiKeyEnv: c.apiKeyEnv,
    requiresKey: c.requiresKey,
    keyConfigured: keyPresent(id, c.apiKeyEnv),
  }))

  return NextResponse.json({ models: withStatus, catalog })
}

// POST /api/admin/ai-models — créer un modèle
export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const body = await request.json()
  const { label, provider, model, type, baseUrl, apiKeyEnv } = body ?? {}

  if (!label || !provider || !model) {
    return NextResponse.json(
      { error: 'label, provider et model sont requis' },
      { status: 400 }
    )
  }

  const created = await prisma.aIModelConfig.create({
    data: {
      label,
      provider,
      model,
      type: ['free', 'paid', 'local'].includes(type) ? type : 'paid',
      baseUrl: baseUrl || null,
      apiKeyEnv:
        apiKeyEnv ||
        PROVIDER_CATALOG[provider as AIProvider]?.apiKeyEnv ||
        null,
      enabled: true,
    },
  })

  return NextResponse.json({ model: created }, { status: 201 })
}
