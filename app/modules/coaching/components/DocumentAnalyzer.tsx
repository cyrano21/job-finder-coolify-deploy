'use client'

import { useState } from 'react'
import { useCoaching } from '../utils/coaching-context'
import { CVFeedback, CoverLetterFeedback } from '../utils/types'
import { useCVs } from '../../cv/utils/cvs-context'
import { useCoverLetters } from '../../lettre/utils/cover-letters-context'

export default function DocumentAnalyzer() {
  const { analyzeCv, analyzeCoverLetter } = useCoaching()
  const { cvs } = useCVs()
  const { coverLetters } = useCoverLetters()
  
  const [selectedDocType, setSelectedDocType] = useState<'cv' | 'letter'>('cv')
  const [selectedDocId, setSelectedDocId] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [cvFeedback, setCvFeedback] = useState<CVFeedback | null>(null)
  const [letterFeedback, setCoverLetterFeedback] = useState<CoverLetterFeedback | null>(null)
  
  const handleAnalyze = async () => {
    if (!selectedDocId) return
    
    setIsAnalyzing(true)
    
    try {
      if (selectedDocType === 'cv') {
        const feedback = await analyzeCv(selectedDocId)
        setCvFeedback(feedback)
        setCoverLetterFeedback(null)
      } else {
        const feedback = await analyzeCoverLetter(selectedDocId)
        setCoverLetterFeedback(feedback)
        setCvFeedback(null)
      }
    } catch (error) {
      console.error('Error analyzing document:', error)
      alert('Erreur lors de l\'analyse du document. Veuillez réessayer.')
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  const handleReset = () => {
    setCvFeedback(null)
    setCoverLetterFeedback(null)
    setSelectedDocId('')
  }
  
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-medium">Analyse de documents par IA</h3>
      
      {!cvFeedback && !letterFeedback ? (
        <div className="space-y-4">
          <p className="mb-4 text-gray-600">
            Notre IA peut analyser vos CV et lettres de motivation pour vous donner des suggestions d&apos;amélioration personnalisées.
          </p>
          
          {selectedDocType === 'cv' && cvs.length === 0 && (
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
              <p className="mb-2 text-sm text-blue-800">
                <strong>Vous n&apos;avez pas encore de CV</strong>. Créez votre premier CV pour pouvoir l&apos;analyser et recevoir des conseils personnalisés.
              </p>
              <a href="/cv" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Créer mon CV
              </a>
            </div>
          )}

          {selectedDocType === 'letter' && coverLetters.length === 0 && (
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
              <p className="mb-2 text-sm text-blue-800">
                <strong>Vous n&apos;avez pas encore de lettre de motivation</strong>. Créez votre première lettre pour pouvoir l&apos;analyser et recevoir des conseils personnalisés.
              </p>
              <a href="/lettre" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Créer ma lettre de motivation
              </a>
            </div>
          )}
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type de document
            </label>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedDocType === 'cv' 
                    ? 'bg-brand-gradient text-white shadow-soft' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedDocType('cv')}
              >
                CV
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedDocType === 'letter' 
                    ? 'bg-brand-gradient text-white shadow-soft' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedDocType('letter')}
              >
                Lettre de motivation
              </button>
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sélectionner un document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              aria-label="Sélectionner un document à analyser"
            >
              <option value="">Sélectionnez un document</option>
              {selectedDocType === 'cv' ? (
                (cvs || []).length > 0 ? (
                  (cvs || []).map(cv => (
                    <option key={cv.id} value={cv.id}>
                      {cv.personalInfo?.firstName && cv.personalInfo?.lastName ? 
                        `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}` : 
                        `${cv.title || `CV ${cv.id}`}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Aucun CV disponible</option>
                )
              ) : (
                (coverLetters || []).length > 0 ? (
                  (coverLetters || []).map(letter => (
                    <option key={letter.id} value={letter.id}>
                      {letter.title ? letter.title : `Lettre ${letter.id}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Aucune lettre disponible</option>
                )
              )}
            </select>
          </div>
          
          <div className="flex justify-center pt-2">
            <button
              onClick={handleAnalyze}
              disabled={!selectedDocId || isAnalyzing}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {cvFeedback && (
            <div className="space-y-4">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Score global</h4>
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {cvFeedback.overallScore}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Format</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${cvFeedback.formatScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{cvFeedback.formatScore}/100</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Contenu</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${cvFeedback.contentScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{cvFeedback.contentScore}/100</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Impact</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${cvFeedback.impactScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{cvFeedback.impactScore}/100</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-green-600">Points forts</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {cvFeedback.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium text-amber-600">Points faibles</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {cvFeedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="mb-2 font-medium">Suggestions d&apos;amélioration</h4>
                <ul className="list-disc space-y-1 pl-5">
                  {cvFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {letterFeedback && (
            <div className="space-y-4">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Score global</h4>
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {letterFeedback.overallScore}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Pertinence</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${letterFeedback.relevanceScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{letterFeedback.relevanceScore}/100</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Persuasion</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${letterFeedback.persuasionScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{letterFeedback.persuasionScore}/100</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="mb-1 text-sm font-medium">Langage</p>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${letterFeedback.languageScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-right text-xs">{letterFeedback.languageScore}/100</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-green-600">Points forts</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {letterFeedback.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium text-amber-600">Points faibles</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {letterFeedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="mb-2 font-medium">Suggestions d&apos;amélioration</h4>
                <ul className="list-disc space-y-1 pl-5">
                  {letterFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Analyser un autre document
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
