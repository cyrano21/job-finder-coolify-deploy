"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

import { JobListing, JobSearchFilters, defaultFilters } from "./types";
import { evaluateJobMatchMistral, generateJobRecommendations, generateJobSearchSummary } from "./ai-service";

// Check if AI services are available
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const isAIServicesEnabled = OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "YOUR_OPENROUTER_API_KEY" && OPENROUTER_API_KEY.length > 10;

interface JobsContextType {
  jobs: JobListing[];
  filters: JobSearchFilters;
  loading: boolean;
  error: string | null;
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  searchSummary: string;
  updateFilters: (filters: Partial<JobSearchFilters>) => void;
  searchJobs: (page?: number) => Promise<void>;
  searchJobsRealTime: (query: string, location: string) => void;
  toggleFavorite: (jobId: string) => void;
  getFavorites: () => JobListing[];
  evaluateJobMatch: (jobId: string) => Promise<number>;
  clearJobs: () => void;
  setCurrentPage: (page: number) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filters, setFilters] = useState<JobSearchFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSummary, setSearchSummary] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilters = (newFilters: Partial<JobSearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const searchJobs = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    setSearchSummary("");

    try {
      // Use unified aggregator that merges Adzuna, SearchAPI and Jooble
      const params = new URLSearchParams({
        locale: filters.language || "fr",
        page: page.toString(),
        results_per_page: "20", // Réduire le nombre de résultats par page
      });
      if (filters.query) params.append("query", filters.query);
      if (filters.location) params.append("location", filters.location);
      if (filters.postedSince && filters.postedSince !== "any")
        params.append("postedSince", filters.postedSince);

      console.log("🔍 Recherche d'emplois avec les paramètres:", Object.fromEntries(params));

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(`Jobs aggregator fetch failed: ${res.status}`);
      const data = await res.json();

      // Fonctions de validation pour les types union
      const validateContractType = (value: unknown): JobListing['contractType'] => {
        const validTypes: JobListing['contractType'][] = ['full-time', 'part-time', 'freelance', 'internship', 'apprenticeship'];
        const strValue = String(value || 'freelance');
        return validTypes.includes(strValue as JobListing['contractType']) ? strValue as JobListing['contractType'] : 'freelance';
      };

      const validateExperienceLevel = (value: unknown): JobListing['experienceLevel'] => {
        const validLevels: JobListing['experienceLevel'][] = ['entry', 'intermediate', 'senior', 'executive'];
        const strValue = String(value || 'entry');
        return validLevels.includes(strValue as JobListing['experienceLevel']) ? strValue as JobListing['experienceLevel'] : 'entry';
      };

      const validateRemote = (value: unknown): JobListing['remote'] => {
        const validTypes: JobListing['remote'][] = ['no', 'hybrid', 'full'];
        const strValue = String(value || 'no');
        return validTypes.includes(strValue as JobListing['remote']) ? strValue as JobListing['remote'] : 'no';
      };

      const validateSource = (value: unknown): JobListing['source'] => {
        const validSources: JobListing['source'][] = ['indeed', 'linkedin', 'monster', 'glassdoor', 'adzuna', 'jooble', 'searchapi', 'other'];
        const strValue = String(value || 'other');
        return validSources.includes(strValue as JobListing['source']) ? strValue as JobListing['source'] : 'other';
      };

      let fetched: JobListing[] = (Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []).map((j: Record<string, unknown>) => ({
        id: String(j.id ?? j.url ?? `${j.title}-${j.company}-${j.location}`),
        title: String(j.title || ""),
        company: String(j.company || ""),
        location: String(j.location || ""),
        description: String(j.description || ""),
        salary: j.salary as string | undefined,
        contractType: validateContractType(j.contractType),
        experienceLevel: validateExperienceLevel(j.experienceLevel),
        remote: validateRemote(j.remote),
        url: String(j.url || "#"),
        source: validateSource(j.source),
        postedDate: String(j.postedDate || new Date().toISOString()),
        matchScore: Number(j.matchScore) || Math.floor(Math.random() * 100), // Score IA simulé
        isFavorite: Boolean(j.isFavorite),
      }));

      console.log(`✅ ${fetched.length} offres trouvées depuis les APIs`);

      // Utiliser les vraies données si disponibles
      if (fetched.length > 0) {
        // Generate AI-powered match scores and recommendations only if AI services are enabled
        if (isAIServicesEnabled) {
          const userSkills = "Développement web, JavaScript, React, Node.js"; // This would come from user profile in a real implementation
          try {
            fetched = await generateJobRecommendations(userSkills, fetched);

            // Generate search summary
            const summary = await generateJobSearchSummary(userSkills, fetched);
            setSearchSummary(summary);
          } catch (aiError) {
            console.warn("AI services failed, using default scores:", aiError);
            // Continue with default scores if AI fails
          }
        } else {
          console.log("ℹ️ AI services disabled, using default match scores");
        }

        setJobs(fetched);
        setTotalJobs(data.count || fetched.length);
        setTotalPages(data.totalPages || Math.ceil((data.count || fetched.length) / 20));
        setCurrentPage(data.currentPage || page);
      } else {
        console.log("⚠️ Aucune offre trouvée");
        setJobs([]);
        setTotalJobs(0);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la recherche d'emplois:", error);
      setError("Erreur lors de la recherche.");
      setJobs([]);
      setTotalJobs(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Recherche en temps réel avec debouncing
  const searchJobsRealTime = useCallback((query: string, location: string) => {
    // Annuler la recherche précédente
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Mettre à jour les filtres immédiatement
    setFilters(prev => ({ ...prev, query, location }));

    // Déclencher la recherche après un délai
    searchTimeoutRef.current = setTimeout(() => {
      searchJobs(1); // Rechercher à partir de la première page
    }, 800); // 800ms de délai pour éviter trop de requêtes
  }, [searchJobs]);

  const clearJobs = () => {
    setJobs([]);
    setTotalJobs(0);
    setTotalPages(1);
    setCurrentPage(1);
    setError(null);
    setSearchSummary("");
  };

  const toggleFavorite = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isFavorite: !job.isFavorite } : job
      )
    );
  };

  const getFavorites = () => {
    return jobs.filter((job) => job.isFavorite);
  };

  const evaluateJobMatch = async (jobId: string): Promise<number> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return 0;

    // Use Mistral AI for job matching only if AI services are enabled
    if (isAIServicesEnabled) {
      const userSkills = "Développement web, JavaScript, React, Node.js"; // This would come from user profile in a real implementation
      try {
        const matchScore = await evaluateJobMatchMistral(job.description, userSkills);

        // Update the job with the new match score
        setJobs(prev => prev.map(j =>
          j.id === jobId ? { ...j, matchScore } : j
        ));

        return matchScore;
      } catch (aiError) {
        console.warn("AI evaluation failed, using default score:", aiError);
        return job.matchScore || 50;
      }
    } else {
      console.log("ℹ️ AI services disabled, using existing match score");
      return job.matchScore || 50;
    }
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        filters,
        loading,
        error,
        totalJobs,
        totalPages,
        currentPage,
        searchSummary,
        updateFilters,
        searchJobs,
        searchJobsRealTime,
        toggleFavorite,
        getFavorites,
        evaluateJobMatch,
        clearJobs,
        setCurrentPage,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
