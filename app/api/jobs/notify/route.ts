import { NextResponse, type NextRequest } from 'next/server'
import { runJobAlerts } from '@/app/lib/job-alerts'

// POST /api/jobs/notify
// Triggers processing of all active job alerts. Intended to be called by a
// scheduler (cron job, Vercel Cron, GitHub Action, etc.).
//
// Security: this endpoint is protected by a shared secret. The caller must send
// `Authorization: Bearer <CRON_SECRET>`. Without a configured CRON_SECRET the
// endpoint refuses to run to avoid being publicly abusable.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET non configuré côté serveur' },
      { status: 500 }
    )
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const result = await runJobAlerts()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur lors de l\'exécution des alertes emploi:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
