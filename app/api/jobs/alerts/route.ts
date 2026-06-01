import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'

// GET /api/jobs/alerts - list the current user's job alerts
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const alerts = await prisma.jobAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/jobs/alerts - create a new job alert
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { name, filters, frequency } = body ?? {}

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Le nom de l'alerte est requis" },
        { status: 400 }
      )
    }

    const allowedFrequencies = ['instant', 'daily', 'weekly']
    const safeFrequency = allowedFrequencies.includes(frequency)
      ? frequency
      : 'daily'

    const alert = await prisma.jobAlert.create({
      data: {
        name,
        filters: filters ?? {},
        frequency: safeFrequency,
        email: user.email!,
        userId: user.id,
      },
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'alerte:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
