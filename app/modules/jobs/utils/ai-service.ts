import { HfInference } from "@huggingface/inference";
import { JobListing } from "./types";
import { aiPerformanceMonitor, monitorAICall } from '@/app/modules/utils/ai-performance-monitor';
import { chatCompletion } from '@/app/lib/ai-client';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

/**
 * Evaluate job match score using Hugging Face
 * @param jobDescription Job description text
 * @param userSkills User skills text
 * @returns Match score between 0-100
 */
export async function evaluateJobMatchHF(
  jobDescription: string,
  userSkills: string
): Promise<number> {
  try {
    const prompt = `En tant qu'expert en recrutement, évaluez la correspondance entre cette offre d'emploi et les compétences d'un candidat.
    
Offre d'emploi:
${jobDescription}

Compétences du candidat:
${userSkills}

Répondez uniquement avec un nombre entre 0 et 100 représentant le pourcentage de correspondance. Ne donnez aucune autre information.`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 10,
        return_full_text: false,
      },
    });

    // Extract number from response
    const match = response.generated_text?.match(/\d+/);
    return match ? Math.min(100, Math.max(0, parseInt(match[0], 10))) : 50;
  } catch (error) {
    console.error("Error evaluating job match with Hugging Face:", error);
    return 50; // Default score if evaluation fails
  }
}

/**
 * Evaluate job match score using OpenRouter with Mistral
 * @param jobDescription Job description text
 * @param userSkills User skills text
 * @returns Match score between 0-100
 */
export async function evaluateJobMatchMistral(
  jobDescription: string,
  userSkills: string
): Promise<number> {
  return monitorAICall('evaluateJobMatchMistral', async () => {
    try {
      const result = await chatCompletion(
        [
          {
            role: "user",
            content: `En tant qu'expert en recrutement, évaluez la correspondance entre cette offre d'emploi et les compétences d'un candidat.
    
Offre d'emploi:
${jobDescription}

Compétences du candidat:
${userSkills}

Répondez uniquement avec un nombre entre 0 et 100 représentant le pourcentage de correspondance. Ne donnez aucune autre information.`,
          },
        ],
        { maxTokens: 10 }
      );

      // Extract number from response
      const match = result.match(/\d+/);
      return match ? Math.min(100, Math.max(0, parseInt(match[0], 10))) : 50;
    } catch (error) {
      console.error("Error evaluating job match with Mistral:", error);
      return 50; // Default score if evaluation fails
    }
  });
}

/**
 * Generate job recommendations using OpenRouter with Mistral
 * @param userSkills User skills text
 * @param jobListings Array of job listings
 * @returns Array of job listings with match scores
 */
export async function generateJobRecommendations(
  userSkills: string,
  jobListings: JobListing[]
): Promise<JobListing[]> {
  try {
    // Prepare job descriptions for the prompt
    const jobDescriptions = jobListings
      .map(
        (job, index) =>
          `${index + 1}. ${job.title} chez ${
            job.company
          }: ${job.description.substring(0, 200)}...`
      )
      .join("\n\n");

    const result = await chatCompletion(
      [
        {
          role: "user",
          content: `En tant qu'expert en recrutement, évaluez la correspondance entre les compétences d'un candidat et ces offres d'emploi.
    
Compétences du candidat:
${userSkills}

Offres d'emploi:
${jobDescriptions}

Pour chaque offre, répondez uniquement avec un nombre entre 0 et 100 représentant le pourcentage de correspondance.
Format de réponse: "1: 85, 2: 72, 3: 65" (numéro de l'offre: score) sans autres informations.`,
        },
      ],
      { maxTokens: 200 }
    );

    // Parse the results
    const scores: Record<number, number> = {};
    const matches = result.match(/(\d+):\s*(\d+)/g);
    
    if (matches) {
      matches.forEach((match: string) => {
        const [, index, score] = match.match(/(\d+):\s*(\d+)/) || [];
        if (index && score) {
          scores[parseInt(index, 10) - 1] = Math.min(
            100,
            Math.max(0, parseInt(score, 10))
          );
        }
      });
    }

    // Add match scores to job listings
    return jobListings.map((job, index) => ({
      ...job,
      matchScore: scores[index] || 50,
    }));
  } catch (error) {
    console.error("Error generating job recommendations:", error);
    // Return job listings with default scores
    return jobListings.map((job) => ({
      ...job,
      matchScore: job.matchScore || 50,
    }));
  }
}

/**
 * Generate a personalized job search summary using OpenRouter with Mistral
 * @param userSkills User skills text
 * @param jobListings Array of job listings
 * @returns Personalized summary text
 */
export async function generateJobSearchSummary(
  userSkills: string,
  jobListings: JobListing[]
): Promise<string> {
  try {
    // Prepare job descriptions for the prompt
    const topJobs = jobListings
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 3)
      .map(
        (job) =>
          `${job.title} chez ${job.company} (${
            job.matchScore || 0
          }% de correspondance)`
      )
      .join(", ");

    const summary = await chatCompletion(
      [
        {
          role: "user",
          content: `En tant qu'assistant IA pour la recherche d'emploi, créez un résumé personnalisé pour un candidat basé sur ses compétences et les offres trouvées.
    
Compétences du candidat:
${userSkills}

Meilleures correspondances trouvées:
${topJobs}

Créez un court résumé (2-3 sentences) encourageant le candidat et mettant en avant les opportunités pertinentes.`,
        },
      ],
      { maxTokens: 200 }
    );

    return summary || "Voici vos résultats de recherche d'emploi.";
  } catch (error) {
    console.error("Error generating job search summary:", error);
    return "Voici vos résultats de recherche d'emploi.";
  }
}
