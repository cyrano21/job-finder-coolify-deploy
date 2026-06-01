import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'

// GET /api/orientation/sessions
// Liste les sessions d'orientation de l'utilisateur (avec pistes et plan).
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const sessions = await prisma.orientationSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        careerTracks: { orderBy: { score: 'desc' } },
        actionPlans: { orderBy: { priority: 'asc' } },
      },
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
