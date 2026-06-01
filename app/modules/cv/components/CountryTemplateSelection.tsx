'use client'

import { useState } from 'react'
import { useCV } from '../utils/cv-context'
import { CountryTemplate, countryDefaults } from '../utils/types'

interface CountryTemplateSelectionProps {
  className?: string
}

const countryNames: Record<CountryTemplate, string> = {
  france: 'France',
  germany: 'Allemagne',
  usa: 'États-Unis',
  uk: 'Royaume-Uni',
  china: 'Chine',
  japan: 'Japon',
  india: 'Inde',
  brazil: 'Brésil',
  canada: 'Canada',
  australia: 'Australie'
}

const countryDescriptions: Record<CountryTemplate, string> = {
  france: "Format chronologique avec un résumé professionnel en tête.",
  germany: "Format fonctionnel mettant l'accent sur les compétences et l'éducation.",
  usa: "Format chronologique avec un résumé professionnel détaillé.",
  uk: "Format similaire au modèle américain, adapté au marché britannique.",
  china: "Format avec photo en tête et détails personnels importants.",
  japan: "Format mettant l'accent sur l'éducation et l'expérience détaillée.",
  india: "Format avec un objectif de carrière clairement défini en tête.",
  brazil: "Format avec photo et détails personnels étendus.",
  canada: "Format bilingue (français/anglais) adapté au marché canadien.",
  australia: "Format similaire au modèle britannique/US, adapté au marché australien."
}

export default function CountryTemplateSelection({ className }: CountryTemplateSelectionProps) {
  const { cv, updateCV } = useCV()
  const [isOpen, setIsOpen] = useState(false)

  const handleCountryChange = (country: CountryTemplate) => {
    const countryDefault = countryDefaults[country]
    updateCV({
      ...cv,
      countryTemplate: country,
      sections: countryDefault.sections || cv.sections
    })
    setIsOpen(false)
  }

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-medium mb-4">Format de CV par pays</h3>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
        >
          <span>
            {countryNames[cv.countryTemplate] || 'Sélectionnez un pays'}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden">
            {Object.entries(countryNames).map(([key, name]) => (
              <button
                key={key}
                className={`block w-full px-4 py-2 text-left hover:bg-blue-50 ${
                  cv.countryTemplate === key ? 'bg-blue-100 text-blue-700' : ''
                }`}
                onClick={() => handleCountryChange(key as CountryTemplate)}
              >
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-600">{countryDescriptions[key as CountryTemplate]}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-800">Format actuel : {countryNames[cv.countryTemplate]}</h4>
        <p className="text-sm text-blue-700 mt-1">{countryDescriptions[cv.countryTemplate]}</p>
      </div>
    </div>
  )
}