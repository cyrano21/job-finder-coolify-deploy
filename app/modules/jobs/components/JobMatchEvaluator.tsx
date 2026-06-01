import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '../utils/jobs-context';

interface JobMatchEvaluatorProps {
  jobId: string;
  initialScore?: number;
}

export default function JobMatchEvaluator({ jobId, initialScore }: JobMatchEvaluatorProps) {
  const { evaluateJobMatch, filters } = useJobs();
  const [score, setScore] = useState(initialScore || 0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const isGerman = filters.language === 'de';

  const handleEvaluate = async () => {
    if (isEvaluating) return;
    
    setIsEvaluating(true);
    try {
      const matchScore = await evaluateJobMatch(jobId);
      setScore(matchScore);
      setEvaluated(true);
    } catch (error) {
      console.error('Error evaluating job match:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine background color based on score
  const getScoreBgColor = () => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-blue-100 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="flex flex-col items-end">
      {score > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center px-3 py-1 rounded-full border ${getScoreBgColor()} ${getScoreColor()}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{score}%</span>
        </motion.div>
      ) : (
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isGerman ? 'Bewertung...' : 'Évaluation...'}
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {isGerman ? 'Mit KI bewerten' : 'Évaluer avec IA'}
            </>
          )}
        </button>
      )}
      
      {evaluated && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-1"
        >
          {isGerman ? 'Bewertet von Mistral KI' : 'Évalué par Mistral AI'}
        </motion.p>
      )}
    </div>
  );
}