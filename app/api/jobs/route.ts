import { scrapeGermanJobs } from "@/app/modules/jobs/utils/german-job-scraper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const locale = searchParams.get("locale") || "fr";
    const page = searchParams.get("page") || "1";
    const resultsPerPage = searchParams.get("results_per_page") || "100";
    const postedSince = searchParams.get("postedSince"); // 'day' | 'week' | 'month' | 'any'

    // Read provider credentials (some may be missing; we'll skip those providers)
    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
    const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
    const SEARCHAPI_API_KEY = process.env.SEARCHAPI_API_KEY;
    const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

    // Helper to normalize Adzuna result to our JobListing-like object
    const normalizeAdzuna = (j: any) => ({
      id: String(j.id),
      title: j.title,
      company: j.company?.display_name || "",
      location: j.location?.display_name || "",
      description: j.description || "",
      salary:
        j.salary_min && j.salary_max
          ? `${j.salary_min} - ${j.salary_max}`
          : undefined,
      contractType:
        j.contract_type === "full_time"
          ? "full-time"
          : j.contract_type === "part_time"
          ? "part-time"
          : "freelance",
      experienceLevel: "entry",
      remote: "no",
      url: j.redirect_url,
      source: "adzuna",
      postedDate: j.created,
    });

    // Helper to normalize SearchAPI (google_jobs) result
    const normalizeSearchApi = (j: any) => {
      const schedule = (
        j.detected_extensions?.schedule_type || ""
      ).toLowerCase();
      let contractType: string = "freelance";
      if (schedule.includes("full")) contractType = "full-time";
      else if (schedule.includes("part")) contractType = "part-time";

      // Try various fields for posted date
      const postedAt =
        j.detected_extensions?.posted_at || j.date || j.timestamp || undefined;

      return {
        id: String(
          j.job_id ||
            j.id ||
            j.link ||
            `${j.title}-${j.company_name}-${j.location}`
        ),
        title: j.title || "",
        company: j.company_name || j.company || "",
        location: j.location || "",
        description: j.description || j.snippet || "",
        salary: j.detected_extensions?.salary || j.salary || undefined,
        contractType,
        experienceLevel: "entry",
        remote: j.detected_extensions?.work_from_home ? "full" : "no",
        url:
          j.apply_link ||
          j.link ||
          (j.apply_options && j.apply_options[0]?.link) ||
          "#",
        source: "searchapi",
        postedDate: postedAt,
      };
    };

    // Helper to normalize Jooble result
    const normalizeJooble = (j: any) => {
      const contractRaw = (j.type || j.job_type || "").toLowerCase();
      let contractType: string = "freelance";
      if (contractRaw.includes("full")) contractType = "full-time";
      else if (contractRaw.includes("part")) contractType = "part-time";

      return {
        id: String(j.id || j.link || `${j.title}-${j.company}-${j.location}`),
        title: j.title || "",
        company: j.company || "",
        location: j.location || "",
        description: j.snippet || j.description || "",
        salary: j.salary || undefined,
        contractType,
        experienceLevel: "entry",
        remote: "no",
        url: j.link || j.url || "#",
        source: "jooble",
        postedDate: j.updated || j.posted || undefined,
      };
    };

    // Build provider requests in parallel (skip those without keys)
    const tasks: Promise<any>[] = [];

    if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
      const base = `https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(
        locale
      )}/search/${encodeURIComponent(page)}`;
      const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: resultsPerPage,
        "content-type": "application/json",
      });
      if (query) params.append("what", query);
      if (location) params.append("where", location);
      if (postedSince && postedSince !== "any") {
        const days =
          postedSince === "day" ? "1" : postedSince === "week" ? "7" : "30";
        params.append("max_days_old", days);
      }
      const url = `${base}?${params.toString()}`;
      tasks.push(
        fetch(url)
          .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.text())))
          .then((data) =>
            Array.isArray(data?.results)
              ? data.results.map(normalizeAdzuna)
              : []
          )
          .catch((e) => {
            console.error("Adzuna error:", e);
            return [];
          })
      );
    }

    if (SEARCHAPI_API_KEY) {
      // Set language parameters based on locale
      let hl = "fr";
      let gl = "fr";
      if (locale === "de") {
        hl = "de";
        gl = "de";
      }

      const url = `https://www.searchapi.io/api/v1/search?engine=google_jobs&q=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(
        location
      )}&api_key=${SEARCHAPI_API_KEY}&hl=${hl}&gl=${gl}&num=50`;
      tasks.push(
        fetch(url, { headers: { "User-Agent": "JobFinder/1.0" } })
          .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.text())))
          .then((data) => {
            const arr = Array.isArray(data?.jobs_results)
              ? data.jobs_results
              : Array.isArray(data?.results)
              ? data.results
              : [];
            return arr.map(normalizeSearchApi);
          })
          .catch((e) => {
            console.error("SearchAPI error:", e);
            return [];
          })
      );
    }

    if (JOOBLE_API_KEY) {
      const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;
      tasks.push(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: query,
            location,
            page: parseInt(page),
            count: 50, // Demander jusqu'à 50 résultats par page
          }),
        })
          .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.text())))
          .then((data) => {
            const arr = Array.isArray(data?.jobs)
              ? data.jobs
              : Array.isArray(data?.results)
              ? data.results
              : [];
            return arr.map(normalizeJooble);
          })
          .catch((e) => {
            console.error("Jooble error:", e);
            return [];
          })
      );
    }

    // Add German job scraping for German locale
    if (locale === "de") {
      tasks.push(scrapeGermanJobs(query, location));
    }

    const resultsArrays = await Promise.all(tasks);
    const merged = ([] as any[]).concat(...resultsArrays);

    // Deduplicate by URL, then by title+company+location
    const seen = new Set<string>();
    const deduped: any[] = [];
    for (const j of merged) {
      const key = j.url || `${j.title}|${j.company}|${j.location}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(j);
      }
    }

    // Pagination
    const pageInt = parseInt(page);
    const resultsPerPageInt = parseInt(resultsPerPage);
    const startIndex = (pageInt - 1) * resultsPerPageInt;
    const endIndex = startIndex + resultsPerPageInt;
    const paginatedResults = deduped.slice(startIndex, endIndex);

    // Calculate total pages
    const totalCount = deduped.length;
    const totalPages = Math.ceil(totalCount / resultsPerPageInt);

    return new Response(
      JSON.stringify({
        results: paginatedResults,
        count: totalCount,
        totalPages: totalPages,
        currentPage: pageInt,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/jobs aggregator:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
