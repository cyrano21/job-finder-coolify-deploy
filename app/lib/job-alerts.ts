import prisma from './prisma'
import { sendEmail } from './email'

interface AggregatedJob {
  id?: string
  title?: string
  company?: string
  location?: string
  url?: string
  redirect_url?: string
  salary?: string
  source?: string
}

interface AlertFilters {
  query?: string
  location?: string
  language?: 'fr' | 'de'
  postedSince?: 'day' | 'week' | 'month' | 'any'
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3005'
  )
}

// Fetch jobs for a given alert's filters through the existing aggregator route.
async function fetchJobsForFilters(filters: AlertFilters): Promise<AggregatedJob[]> {
  const params = new URLSearchParams({
    locale: filters.language || 'fr',
    page: '1',
    results_per_page: '50',
  })
  if (filters.query) params.append('query', filters.query)
  if (filters.location) params.append('location', filters.location)
  if (filters.postedSince && filters.postedSince !== 'any')
    params.append('postedSince', filters.postedSince)

  const res = await fetch(`${getBaseUrl()}/api/jobs?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Aggregator fetch failed: ${res.status}`)
  }
  const data = await res.json()
  return Array.isArray(data?.results) ? data.results : []
}

function jobUrl(job: AggregatedJob): string {
  return job.url || job.redirect_url || ''
}

function buildEmailHtml(alertName: string, jobs: AggregatedJob[]): string {
  const items = jobs
    .map((j) => {
      const url = jobUrl(j)
      const title = j.title || 'Offre'
      const company = j.company || 'Entreprise non spécifiée'
      const location = j.location || ''
      return `<li style="margin-bottom:8px;">
        <a href="${url}" style="color:#2563eb;font-weight:600;text-decoration:none;">${title}</a>
        <br/><span style="color:#374151;">${company}${location ? ' — ' + location : ''}</span>
      </li>`
    })
    .join('')

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <h2 style="color:#111827;">Nouvelles offres pour « ${alertName} »</h2>
    <p style="color:#374151;">${jobs.length} nouvelle(s) offre(s) correspondent à vos critères :</p>
    <ul style="padding-left:18px;">${items}</ul>
  </div>`
}

/**
 * Run all active job alerts: for each alert, fetch matching jobs, detect the ones
 * not yet seen (by URL), email the user, persist them, and update lastNotifiedAt.
 * Returns a summary suitable for logging or an API response.
 */
export async function runJobAlerts() {
  const alerts = await prisma.jobAlert.findMany({ where: { active: true } })

  const summary: Array<{
    alertId: string
    name: string
    newJobs: number
    emailed: boolean
    error?: string
  }> = []

  for (const alert of alerts) {
    try {
      const filters = (alert.filters as AlertFilters) || {}
      const jobs = await fetchJobsForFilters(filters)

      // Determine which of the fetched jobs we have never stored before.
      const urls = jobs.map(jobUrl).filter(Boolean)
      const existing = await prisma.job.findMany({
        where: { url: { in: urls } },
        select: { url: true },
      })
      const knownUrls = new Set(existing.map((j) => j.url))

      const newJobs = jobs.filter((j) => {
        const url = jobUrl(j)
        return url && !knownUrls.has(url)
      })

      let emailed = false
      if (newJobs.length > 0) {
        // Persist new jobs so they are not re-notified next run.
        for (const j of newJobs) {
          const url = jobUrl(j)
          if (!url) continue
          await prisma.job.create({
            data: {
              title: j.title || 'Offre sans titre',
              company: j.company || 'Entreprise non spécifiée',
              location: j.location || 'Localisation non spécifiée',
              description: '',
              url,
              source: j.source || 'alert',
            },
          })
        }

        await sendEmail({
          to: alert.email,
          subject: `${newJobs.length} nouvelle(s) offre(s) — ${alert.name}`,
          html: buildEmailHtml(alert.name, newJobs),
          text: newJobs
            .map(
              (j) =>
                `${j.title} - ${j.company || ''} - ${j.location || ''}\n${jobUrl(j)}`
            )
            .join('\n\n'),
        })
        emailed = true
      }

      await prisma.jobAlert.update({
        where: { id: alert.id },
        data: { lastNotifiedAt: new Date() },
      })

      summary.push({
        alertId: alert.id,
        name: alert.name,
        newJobs: newJobs.length,
        emailed,
      })
    } catch (error) {
      console.error(`Erreur lors du traitement de l'alerte ${alert.id}:`, error)
      summary.push({
        alertId: alert.id,
        name: alert.name,
        newJobs: 0,
        emailed: false,
        error: error instanceof Error ? error.message : 'unknown',
      })
    }
  }

  return { processed: alerts.length, results: summary }
}
