"use client";

import { createContext, useContext, useState } from "react";
import {
  InterviewQuestion,
  InterviewFeedback,
  CVFeedback,
  CoverLetterFeedback,
  ProfileImprovement,
  Affirmation,
} from "./types";
import {
  generateCVFeedback,
  generateCoverLetterFeedback,
  generateInterviewQuestions,
  analyzeInterviewAnswer,
  generateInterviewFeedback,
  generateProfileImprovements as aiGenerateProfileImprovements,
  generateAffirmations as aiGenerateAffirmations
} from "./ai-client-service";
import { useCV } from "../../cv/utils/cv-context";
import { useCoverLetters } from "../../lettre/utils/cover-letters-context";

interface CoachingContextType {
  // Simulateur d'entretien
  currentQuestion: InterviewQuestion | null;
  interviewHistory: { question: InterviewQuestion; answer: string; feedback?: any }[];
  interviewFeedback: InterviewFeedback | null;
  startInterview: (context?: any, category?: string, difficulty?: string) => Promise<void>;
  answerQuestion: (answer: string) => Promise<void>;
  getNextQuestion: () => void;
  endInterview: () => Promise<InterviewFeedback>;

  // Corrections CV et lettre
  analyzeCv: (cvId: string) => Promise<CVFeedback>;
  analyzeCoverLetter: (letterId: string) => Promise<CoverLetterFeedback>;

  // Suggestions d'amélioration
  profileImprovements: ProfileImprovement[];
  generateProfileImprovements: () => Promise<ProfileImprovement[]>;
  implementImprovement: (id: string) => void;

  // Affirmations
  dailyAffirmations: Affirmation[];
  generateAffirmations: (category?: string) => Promise<Affirmation[]>;
}

const CoachingContext = createContext<CoachingContextType | undefined>(
  undefined
);

export function CoachingProvider({ children }: { children: React.ReactNode }) {
  // Utiliser les contextes CV et Lettres pour accéder aux données
  const { cv } = useCV();
  const { coverLetters } = useCoverLetters();
  
  // État pour le simulateur d'entretien
  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<
    { question: InterviewQuestion; answer: string; feedback?: any }[]
  >([]);
  const [interviewFeedback, setInterviewFeedback] =
    useState<InterviewFeedback | null>(null);

  // État pour les suggestions d'amélioration
  const [profileImprovements, setProfileImprovements] = useState<
    ProfileImprovement[]
  >([]);

  // État pour les affirmations
  const [dailyAffirmations, setDailyAffirmations] = useState<Affirmation[]>([]);

  // Fonctions pour le simulateur d'entretien
  const startInterview = async (context?: any, category?: string, difficulty?: string) => {
    try {
      // Générer des questions personnalisées avec l'IA
      const questions = await generateInterviewQuestions(context || {}, category, difficulty);
      
      // Réinitialiser l'état de l'entretien
      setInterviewHistory([]);
      setInterviewFeedback(null);

      // Définir la première question
      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
      } else {
        // Fallback si aucune question n'est générée
        setCurrentQuestion({
          id: "1",
          question: "Parlez-moi de vous et de votre parcours professionnel.",
          category: "personal",
          difficulty: "easy"
        });
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      // Fallback avec des questions simulées
      setCurrentQuestion({
        id: "1",
        question: "Parlez-moi de vous et de votre parcours professionnel.",
        category: "personal",
        difficulty: "easy"
      });
    }
  };

  const answerQuestion = async (answer: string) => {
    if (!currentQuestion) return;

    try {
      // Analyser la réponse avec l'IA
      const feedback = await analyzeInterviewAnswer(currentQuestion.question, answer);
      
      // Ajouter la question, la réponse et le feedback à l'historique
      setInterviewHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer, feedback },
      ]);
    } catch (error) {
      console.error("Error analyzing answer:", error);
      // Ajouter la question et la réponse sans feedback en cas d'erreur
      setInterviewHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer },
      ]);
    }
  };

  const getNextQuestion = () => {
    // Pour l'instant, nous simulons la fin de l'entretien après une question
    // Dans une implémentation plus avancée, nous pourrions générer plus de questions
    setCurrentQuestion(null);
  };

  const endInterview = async (): Promise<InterviewFeedback> => {
    try {
      // Générer un feedback global avec l'IA
      const feedback = await generateInterviewFeedback(interviewHistory);
      setInterviewFeedback(feedback);
      return feedback;
    } catch (error) {
      console.error("Error generating interview feedback:", error);
      // Fallback avec un feedback simulé
      const fallbackFeedback: InterviewFeedback = {
        strengths: [
          "Bonne articulation des idées",
          "Exemples concrets et pertinents",
        ],
        improvements: [
          "Structurer davantage les réponses",
          "Être plus concis sur certaines questions",
        ],
        overallScore: 75,
        confidenceScore: 70,
        clarityScore: 75,
        relevanceScore: 80,
        suggestions:
          "Continuez à pratiquer les entretiens. Préparez des exemples concrets pour illustrer vos compétences.",
      };
      setInterviewFeedback(fallbackFeedback);
      return fallbackFeedback;
    }
  };

  // Fonctions pour les corrections CV et lettre
  const analyzeCv = async (cvId: string): Promise<CVFeedback> => {
    try {
      // Trouver le CV par son ID
      // Note: Dans une implémentation complète, nous devrions récupérer le CV depuis une API
      // Pour l'instant, nous utilisons le CV du contexte
      const cvToAnalyze = cv;
      
      // Générer un feedback avec l'IA
      const feedback = await generateCVFeedback(cvToAnalyze);
      return feedback;
    } catch (error) {
      console.error("Error analyzing CV:", error);
      throw new Error("Impossible d'analyser le CV");
    }
  };

  const analyzeCoverLetter = async (letterId: string): Promise<CoverLetterFeedback> => {
    try {
      // Trouver la lettre par son ID
      const letter = coverLetters.find(l => l.id === letterId);
      if (!letter) {
        throw new Error("Lettre non trouvée");
      }
      
      // Générer un feedback avec l'IA
      const feedback = await generateCoverLetterFeedback(letter);
      return feedback;
    } catch (error) {
      console.error("Error analyzing cover letter:", error);
      throw new Error("Impossible d'analyser la lettre de motivation");
    }
  };

  // Fonctions pour les suggestions d'amélioration
  const generateProfileImprovements = async (): Promise<
    ProfileImprovement[]
  > => {
    try {
      // Combiner les données du CV et des lettres pour une analyse complète
      const profileData = {
        cv: cv,
        coverLetters: coverLetters
      };
      
      // Générer des suggestions avec l'IA
      const improvements = await aiGenerateProfileImprovements(profileData);
      setProfileImprovements(improvements);
      return improvements;
    } catch (error) {
      console.error("Error generating profile improvements:", error);
      throw new Error("Impossible de générer les suggestions d'amélioration");
    }
  };

  const implementImprovement = (id: string) => {
    setProfileImprovements((prev) =>
      prev.map((improvement) =>
        improvement.id === id
          ? { ...improvement, implemented: true }
          : improvement
      )
    );
  };

  // Fonctions pour les affirmations
  const generateAffirmations = async (
    category?: string
  ): Promise<Affirmation[]> => {
    try {
      // Générer des affirmations avec l'IA
      const affirmations = await aiGenerateAffirmations(category);
      setDailyAffirmations(affirmations);
      return affirmations;
    } catch (error) {
      console.error("Error generating affirmations:", error);
      throw new Error("Impossible de générer les affirmations positives");
    }
  };

  return (
    <CoachingContext.Provider
      value={{
        // Simulateur d'entretien
        currentQuestion,
        interviewHistory,
        interviewFeedback,
        startInterview,
        answerQuestion,
        getNextQuestion,
        endInterview,

        // Corrections CV et lettre
        analyzeCv,
        analyzeCoverLetter,

        // Suggestions d'amélioration
        profileImprovements,
        generateProfileImprovements,
        implementImprovement,

        // Affirmations
        dailyAffirmations,
        generateAffirmations,
      }}
    >
      {children}
    </CoachingContext.Provider>
  );
}

export function useCoaching() {
  const context = useContext(CoachingContext);
  if (context === undefined) {
    throw new Error("useCoaching must be used within a CoachingProvider");
  }
  return context;
}
