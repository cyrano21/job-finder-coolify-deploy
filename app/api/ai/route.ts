// API route pour gérer les appels AI
import { NextRequest } from 'next/server';
import { 
  generateCVFeedback,
  generateCoverLetterFeedback,
  generateInterviewQuestions,
  analyzeInterviewAnswer,
  generateInterviewFeedback,
  generateProfileImprovements,
  generateAffirmations
} from '@/app/modules/coaching/utils/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    let result;
    
    switch (action) {
      case 'generateCVFeedback':
        result = await generateCVFeedback(data);
        break;
      case 'generateCoverLetterFeedback':
        result = await generateCoverLetterFeedback(data);
        break;
      case 'generateInterviewQuestions':
        result = await generateInterviewQuestions(data.context, data.category, data.difficulty);
        break;
      case 'analyzeInterviewAnswer':
        result = await analyzeInterviewAnswer(data.question, data.answer);
        break;
      case 'generateInterviewFeedback':
        result = await generateInterviewFeedback(data.history);
        break;
      case 'generateProfileImprovements':
        result = await generateProfileImprovements(data);
        break;
      case 'generateAffirmations':
        result = await generateAffirmations(data.category);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Action not supported' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process AI request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}