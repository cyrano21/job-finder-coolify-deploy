import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'
import { runDiagnostic } from '@/app/modules/orientation/utils/ai-service'
import type { YoungProfileInput, Horizon, CareerCategory } from '@/app/modules/orientation/utils/types'

// Borne un score IA dans [0, 100], avec fallback 0.
function clampScore(v: unknown): number {
  return Math.max(0, Math.min(100, Number(v) || 0))
}

// POST /api/orientation/diagnostic
// Lance le diagnostic agentique pour le profil du jeune, persiste la session,
// les pistes métiers et le plan d'action.
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const profileInput = (await request.json()) as YoungProfileInput

    // Upsert du profil jeune lié à l'utilisateur.
    const profileData = {
      age: profileInput.age ?? null,
      city: profileInput.city ?? null,
      education: profileInput.education ?? null,
      lastJob: profileInput.lastJob ?? null,
      savingsBand: profileInput.savingsBand ?? null,
      urgency: profileInput.urgency ?? null,
      charges: profileInput.charges ?? null,
      hasLicense: profileInput.hasLicense ?? null,
      mobility: profileInput.mobility ?? null,
      appetences: profileInput.appetences ?? [],
      motivations: profileInput.motivations ?? [],
      interests: profileInput.interests ?? [],
      constraints: profileInput.constraints ?? [],
    }
    const profile = await prisma.youngProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...profileData },
      update: profileData,
    })

    // Appel à l'agent.
    const result = await runDiagnostic(profileInput)

    // Persistance de la session + pistes + plan en une transaction.
    const session = await prisma.orientationSession.create({
      data: {
        userId: user.id,
        profileId: profile.id,
        status: 'planned',
        summary: result.summary,
        urgencyScore: clampScore(result.scores?.urgency),
        autonomyScore: clampScore(result.scores?.autonomy),
        clarityScore: clampScore(result.scores?.clarity),
        immediateRisks: result.immediateRisks ?? [],
        doNotDo: result.doNotDo ?? [],
        remainingQuestions: result.remainingQuestions ?? [],
        careerTracks: {
          create: (result.careerTracks ?? []).map((t) => ({
            title: t.title,
            category: (t.category as CareerCategory) ?? 'autre',
            score: clampScore(t.score),
            reasons: t.reasons ?? [],
            risks: t.risks ?? [],
            nextActions: t.nextActions ?? [],
          })),
        },
        actionPlans: {
          create: (result.actionPlans ?? []).map((a) => ({
            horizon: (a.horizon as Horizon) ?? '7j',
            title: a.title,
            description: a.description ?? '',
            priority: Number(a.priority) || 1,
            status: 'todo',
          })),
        },
      },
      include: { careerTracks: true, actionPlans: true },
    })

    return NextResponse.json({
      session,
      recommendedResources: result.recommendedResources ?? [],
    })
  } catch (error) {
    console.error('Erreur lors du diagnostic orientation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
