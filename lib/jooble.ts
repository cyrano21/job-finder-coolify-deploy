// lib/jooble.ts
export async function fetchJoobleJobs(query: string, location: string) {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) {
    throw new Error("JOOBLE_API_KEY is not configured");
  }

  const url = `https://jooble.org/api/${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywords: query, location: location }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error("Error fetching Jooble jobs:", error);
    throw error;
  }
}
