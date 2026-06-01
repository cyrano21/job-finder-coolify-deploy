import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'

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

// PATCH /api/admin/ai-models/[id]
// Met à jour un modèle : champs, enabled, ou isDefault (exclusif).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  const existing = await prisma.aIModelConfig.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
  }

  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (typeof body.label === 'string') data.label = body.label
  if (typeof body.model === 'string') data.model = body.model
  if (typeof body.baseUrl === 'string') data.baseUrl = body.baseUrl || null
  if (typeof body.apiKeyEnv === 'string') data.apiKeyEnv = body.apiKeyEnv || null
  if (['free', 'paid', 'local'].includes(body.type)) data.type = body.type
  if (typeof body.enabled === 'boolean') data.enabled = body.enabled

  // Définir comme défaut : on retire le flag des autres (un seul défaut actif).
  if (body.isDefault === true) {
    await prisma.aIModelConfig.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })
    data.isDefault = true
    data.enabled = true // un modèle par défaut doit être actif
  } else if (body.isDefault === false) {
    data.isDefault = false
  }

  const updated = await prisma.aIModelConfig.update({ where: { id }, data })
  return NextResponse.json({ model: updated })
}

// DELETE /api/admin/ai-models/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  const existing = await prisma.aIModelConfig.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
  }

  await prisma.aIModelConfig.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
