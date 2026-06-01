export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const locale = searchParams.get('locale') || 'fr'
    const page = searchParams.get('page') || '1'
    const resultsPerPage = searchParams.get('results_per_page') || '50'
    const postedSince = searchParams.get('postedSince') // 'day' | 'week' | 'month'

    const appId = process.env.ADZUNA_APP_ID
    const appKey = process.env.ADZUNA_APP_KEY

    if (!appId || !appKey) {
      return new Response(
        JSON.stringify({ error: 'Server is missing Adzuna credentials (ADZUNA_APP_ID/ADZUNA_APP_KEY).' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }

    const base = `https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(locale)}/search/${encodeURIComponent(page)}`
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: resultsPerPage,
      'content-type': 'application/json'
    })

    if (query) params.append('what', query)
    if (location) params.append('where', location)

    if (postedSince && postedSince !== 'any') {
      const days = postedSince === 'day' ? '1' : postedSince === 'week' ? '7' : '30'
      params.append('max_days_old', days)
    }

    const url = `${base}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) {
      const text = await res.text()
      return new Response(
        JSON.stringify({ error: `Adzuna fetch failed: ${res.status}`, details: text }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      )
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Error in /api/jobs/adzuna:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }
}