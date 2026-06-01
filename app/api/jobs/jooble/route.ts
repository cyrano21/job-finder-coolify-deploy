export async function POST(req: Request) {
  try {
    const body = await req.json()
    const query = body?.keywords || body?.query || ''
    const location = body?.location || ''

    const apiKey = process.env.JOOBLE_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server is missing JOOBLE_API_KEY.' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }

    const url = `https://jooble.org/api/${apiKey}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: query, location })
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(
        JSON.stringify({ error: `Jooble fetch failed: ${res.status}`, details: text }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      )
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Error in /api/jobs/jooble:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }
}