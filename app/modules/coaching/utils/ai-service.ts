import { monitorAICall } from '@/app/modules/utils/ai-performance-monitor';
import { chatCompletion } from '@/app/lib/ai-client';

// Tous les appels passent par chatCompletion : le fournisseur/modèle est résolu
// dynamiquement (modèle par défaut défini en admin, sinon env) avec repli en
// cascade. Plus aucun id de modèle codé en dur ici.

/**
 * Génère un feedback pour un CV
 */
export async function generateCVFeedback(cvData: any): Promise<any> {
  return monitorAICall('generateCVFeedback', async () => {
    try {
      const prompt = `
        Analyse ce CV et fournis un feedback détaillé avec les éléments suivants :
        1. Points forts (3-4 éléments)
        2. Points faibles (3-4 éléments)
        3. Suggestions d'amélioration (4-5 éléments)
        4. Score global (0-100)
        5. Score de format (0-100)
        6. Score de contenu (0-100)
        7. Score d'impact (0-100)

        CV à analyser :
        ${JSON.stringify(cvData, null, 2)}

        Réponds uniquement en JSON avec la structure suivante :
        {
          "strengths": ["point 1", "point 2", ...],
          "weaknesses": ["point 1", "point 2", ...],
          "suggestions": ["suggestion 1", "suggestion 2", ...],
          "overallScore": 85,
          "formatScore": 90,
          "contentScore": 80,
          "impactScore": 85
        }
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              'Tu es un expert en recrutement et en optimisation de CV. Tu analyses les CV et fournis des feedbacks détaillés et constructifs.',
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.7, maxTokens: 1000 }
      );

      try {
        return JSON.parse(content || '{}');
      } catch {
        console.error('Failed to parse CV feedback JSON:', content);
        return {
          strengths: [],
          weaknesses: [],
          suggestions: [],
          overallScore: 50,
          formatScore: 50,
          contentScore: 50,
          impactScore: 50,
        };
      }
    } catch (error) {
      console.error('Error generating CV feedback:', error);
      throw new Error('Impossible de générer le feedback pour le CV');
    }
  });
}

/**
 * Génère un feedback pour une lettre de motivation
 */
export async function generateCoverLetterFeedback(letterData: any): Promise<any> {
  return monitorAICall('generateCoverLetterFeedback', async () => {
    try {
      const prompt = `
        Analyse cette lettre de motivation et fournis un feedback détaillé avec les éléments suivants :
        1. Points forts (3-4 éléments)
        2. Points faibles (3-4 éléments)
        3. Suggestions d'amélioration (4-5 éléments)
        4. Score global (0-100)
        5. Score de pertinence (0-100)
        6. Score de persuasion (0-100)
        7. Score de langage (0-100)

        Lettre à analyser :
        ${JSON.stringify(letterData, null, 2)}

        Réponds uniquement en JSON avec la structure suivante :
        {
          "strengths": ["point 1", "point 2", ...],
          "weaknesses": ["point 1", "point 2", ...],
          "suggestions": ["suggestion 1", "suggestion 2", ...],
          "overallScore": 85,
          "relevanceScore": 90,
          "persuasionScore": 80,
          "languageScore": 85
        }
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              'Tu es un expert en recrutement et en rédaction de lettres de motivation. Tu analyses les lettres et fournis des feedbacks détaillés et constructifs.',
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.7, maxTokens: 1000 }
      );

      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error generating cover letter feedback:', error);
      throw new Error('Impossible de générer le feedback pour la lettre de motivation');
    }
  });
}

/**
 * Génère des questions d'entretien personnalisées
 */
export async function generateInterviewQuestions(
  context: any,
  category?: string,
  difficulty?: string
): Promise<any[]> {
  return monitorAICall('generateInterviewQuestions', async () => {
    try {
      const prompt = `
        Génère 5 questions d'entretien personnalisées basées sur le contexte suivant :
        Poste : ${context.jobTitle || 'Non spécifié'}
        Entreprise : ${context.company || 'Non spécifiée'}
        Secteur : ${context.industry || 'Non spécifié'}
        Profil du candidat : ${context.userContext || 'Non spécifié'}
        Catégorie : ${category || 'Toutes'}
        Difficulté : ${difficulty || 'Moyenne'}

        Réponds uniquement en JSON avec la structure suivante :
        [
          {
            "id": "1",
            "question": "Question 1",
            "category": "technical|behavioral|experience|company|personal",
            "difficulty": "easy|medium|hard"
          },
          ...
        ]
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              "Tu es un expert en recrutement qui conçoit des questions d'entretien pertinentes et personnalisées.",
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.8, maxTokens: 1000 }
      );

      return JSON.parse(content || '[]');
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error("Impossible de générer les questions d'entretien");
    }
  });
}

/**
 * Analyse une réponse d'entretien et fournit un feedback
 */
export async function analyzeInterviewAnswer(question: string, answer: string): Promise<any> {
  return monitorAICall('analyzeInterviewAnswer', async () => {
    try {
      const prompt = `
        Analyse cette réponse d'entretien et fournis un feedback détaillé :
        Question : ${question}
        Réponse : ${answer}

        Fournis :
        1. Points forts (2-3 éléments)
        2. Points à améliorer (2-3 éléments)
        3. Score de confiance (0-100)
        4. Score de clarté (0-100)
        5. Score de pertinence (0-100)

        Réponds uniquement en JSON avec la structure suivante :
        {
          "strengths": ["point 1", "point 2", ...],
          "improvements": ["point 1", "point 2", ...],
          "confidenceScore": 85,
          "clarityScore": 90,
          "relevanceScore": 80
        }
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              "Tu es un expert en coaching d'entretien qui analyse les réponses et fournit des feedbacks constructifs.",
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.7, maxTokens: 800 }
      );

      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error analyzing interview answer:', error);
      throw new Error("Impossible d'analyser la réponse d'entretien");
    }
  });
}

/**
 * Génère un feedback global pour un entretien
 */
export async function generateInterviewFeedback(interviewHistory: any[]): Promise<any> {
  return monitorAICall('generateInterviewFeedback', async () => {
    try {
      const prompt = `
        Fournis un feedback global pour cet entretien basé sur l'historique suivant :
        ${JSON.stringify(interviewHistory, null, 2)}

        Inclus :
        1. Points forts généraux (3-4 éléments)
        2. Points à améliorer (3-4 éléments)
        3. Score global (0-100)
        4. Score de confiance (0-100)
        5. Score de clarté (0-100)
        6. Score de pertinence (0-100)
        7. Suggestions générales (2-3 éléments)

        Réponds uniquement en JSON avec la structure suivante :
        {
          "strengths": ["point 1", "point 2", ...],
          "improvements": ["point 1", "point 2", ...],
          "overallScore": 85,
          "confidenceScore": 90,
          "clarityScore": 80,
          "relevanceScore": 85,
          "suggestions": ["suggestion 1", "suggestion 2", ...]
        }
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              "Tu es un expert en coaching d'entretien qui fournit des feedbacks globaux et des conseils d'amélioration.",
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.7, maxTokens: 1000 }
      );

      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error generating interview feedback:', error);
      throw new Error("Impossible de générer le feedback global pour l'entretien");
    }
  });
}

/**
 * Génère des suggestions d'amélioration de profil
 */
export async function generateProfileImprovements(profileData: any): Promise<any[]> {
  return monitorAICall('generateProfileImprovements', async () => {
    try {
      const prompt = `
        Analyse ce profil et suggère des améliorations avec les éléments suivants :
        1. Catégorie (skills|experience|education|projects|general)
        2. Titre de l'amélioration
        3. Description détaillée
        4. Priorité (low|medium|high)

        Profil à analyser :
        ${JSON.stringify(profileData, null, 2)}

        Génère 5 suggestions d'amélioration variées.

        Réponds uniquement en JSON avec la structure suivante :
        [
          {
            "id": "1",
            "category": "skills|experience|education|projects|general",
            "title": "Titre de l'amélioration",
            "description": "Description détaillée",
            "priority": "low|medium|high",
            "implemented": false
          },
          ...
        ]
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              "Tu es un expert en développement de carrière qui identifie les opportunités d'amélioration de profil.",
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.8, maxTokens: 1000 }
      );

      return JSON.parse(content || '[]');
    } catch (error) {
      console.error('Error generating profile improvements:', error);
      throw new Error("Impossible de générer les suggestions d'amélioration de profil");
    }
  });
}

/**
 * Génère des affirmations positives personnalisées
 */
export async function generateAffirmations(category?: string): Promise<any[]> {
  return monitorAICall('generateAffirmations', async () => {
    try {
      const prompt = `
        Génère 3 affirmations positives personnalisées pour la recherche d'emploi.
        Catégorie : ${category || 'Toutes'}

        Réponds uniquement en JSON avec la structure suivante :
        [
          {
            "id": "1",
            "text": "Affirmation positive",
            "category": "confidence|motivation|resilience|growth|success"
          },
          ...
        ]
      `;

      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              'Tu es un expert en développement personnel qui crée des affirmations positives motivantes.',
          },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.9, maxTokens: 500 }
      );

      return JSON.parse(content || '[]');
    } catch (error) {
      console.error('Error generating affirmations:', error);
      throw new Error('Impossible de générer les affirmations positives');
    }
  });
}
