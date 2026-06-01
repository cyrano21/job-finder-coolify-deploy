export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'experience' | 'company' | 'personal';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewFeedback {
  strengths: string[];
  improvements: string[];
  overallScore: number; // 0-100
  confidenceScore: number; // 0-100
  clarityScore: number; // 0-100
  relevanceScore: number; // 0-100
  suggestions: string;
}

export interface CVFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number; // 0-100
  formatScore: number; // 0-100
  contentScore: number; // 0-100
  impactScore: number; // 0-100
}

export interface CoverLetterFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number; // 0-100
  relevanceScore: number; // 0-100
  persuasionScore: number; // 0-100
  languageScore: number; // 0-100
}

export interface ProfileImprovement {
  id: string;
  category: 'skills' | 'experience' | 'education' | 'projects' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implemented: boolean;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'confidence' | 'motivation' | 'resilience' | 'growth' | 'success';
}
