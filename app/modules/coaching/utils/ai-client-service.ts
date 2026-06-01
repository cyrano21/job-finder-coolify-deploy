// Service client pour appeler l'API AI
export async function callAIService(action: string, data: any) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
}

// Fonctions spécifiques pour chaque action
export async function generateCVFeedback(cvData: any) {
  return callAIService('generateCVFeedback', cvData);
}

export async function generateCoverLetterFeedback(letterData: any) {
  return callAIService('generateCoverLetterFeedback', letterData);
}

export async function generateInterviewQuestions(context: any, category?: string, difficulty?: string) {
  return callAIService('generateInterviewQuestions', { context, category, difficulty });
}

export async function analyzeInterviewAnswer(question: string, answer: string) {
  return callAIService('analyzeInterviewAnswer', { question, answer });
}

export async function generateInterviewFeedback(history: any[]) {
  return callAIService('generateInterviewFeedback', { history });
}

export async function generateProfileImprovements(profileData: any) {
  return callAIService('generateProfileImprovements', profileData);
}

export async function generateAffirmations(category?: string) {
  return callAIService('generateAffirmations', { category });
}