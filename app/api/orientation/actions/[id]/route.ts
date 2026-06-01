import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'

// PATCH /api/orientation/actions/[id]
// Met à jour le statut d'une tâche du plan d'action (todo|doing|done).
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

    // Vérifie que l'action appartient bien à une session de l'utilisateur.
    const action = await prisma.actionPlan.findUnique({
      where: { id },
      include: { session: true },
    })
    if (!action || action.session.userId !== user.id) {
      return NextResponse.json({ error: 'Action introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const allowed = ['todo', 'doing', 'done']
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const updated = await prisma.actionPlan.update({
      where: { id },
      data: { status: body.status },
    })

    return NextResponse.json({ action: updated })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'action:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
