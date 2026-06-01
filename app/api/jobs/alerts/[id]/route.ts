import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'

// DELETE /api/jobs/alerts/[id] - delete one of the current user's alerts
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params

    // Ensure the alert belongs to the requesting user before deleting.
    const alert = await prisma.jobAlert.findUnique({ where: { id } })
    if (!alert || alert.userId !== user.id) {
      return NextResponse.json({ error: 'Alerte introuvable' }, { status: 404 })
    }

    await prisma.jobAlert.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'alerte:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/jobs/alerts/[id] - toggle active / update an alert
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const alert = await prisma.jobAlert.findUnique({ where: { id } })
    if (!alert || alert.userId !== user.id) {
      return NextResponse.json({ error: 'Alerte introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const data: { name?: string; active?: boolean; frequency?: string } = {}

    if (typeof body.name === 'string') data.name = body.name
    if (typeof body.active === 'boolean') data.active = body.active
    if (['instant', 'daily', 'weekly'].includes(body.frequency))
      data.frequency = body.frequency

    const updated = await prisma.jobAlert.update({ where: { id }, data })

    return NextResponse.json({ alert: updated })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'alerte:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
