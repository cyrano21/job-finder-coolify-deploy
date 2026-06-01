export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''

    const apiKey = process.env.SEARCHAPI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server is missing SEARCHAPI_API_KEY.' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }

    const encodedQuery = encodeURIComponent(query)
    const encodedLocation = encodeURIComponent(location)
    const url = `https://www.searchapi.io/api/v1/search?engine=google_jobs&q=${encodedQuery}&location=${encodedLocation}&api_key=${apiKey}&hl=fr&gl=fr&num=20`

    const res = await fetch(url, { headers: { 'User-Agent': 'JobFinder/1.0' } })
    if (!res.ok) {
      const text = await res.text()
      return new Response(
        JSON.stringify({ error: `SearchAPI fetch failed: ${res.status}`, details: text }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      )
    }

    const data = await res.json()
    if (data.error) {
      return new Response(
        JSON.stringify({ error: `SearchAPI returned error: ${data.error}` }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Error in /api/jobs/searchapi:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }
}