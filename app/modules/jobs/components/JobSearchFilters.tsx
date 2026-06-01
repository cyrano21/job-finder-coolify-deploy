'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useJobs } from '../utils/jobs-context'
import type { JobSearchFilters } from '../utils/types'
import { defaultFilters } from '../utils/types'

export default function JobSearchFilters() {
  const { filters, updateFilters, searchJobs, searchJobsRealTime, loading, searchSummary } = useJobs()
  const [isExpanded, setIsExpanded] = useState(false)
  const [quickSearch, setQuickSearch] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchJobs()
  }
  
  const handleContractTypeChange = (type: string) => {
    const currentTypes = filters.contractType || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    updateFilters({ contractType: newTypes })
  }
  
  const handleExperienceLevelChange = (level: string) => {
    const currentLevels = filters.experienceLevel || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]
    
    updateFilters({ experienceLevel: newLevels })
  }
  
  const handleRemoteChange = (remote: string) => {
    const currentRemote = filters.remote || []
    const newRemote = currentRemote.includes(remote)
      ? currentRemote.filter(r => r !== remote)
      : [...currentRemote, remote]
    
    updateFilters({ remote: newRemote })
  }
  
  const handleLanguageChange = (language: 'fr' | 'de') => {
    updateFilters({ language })
  }
  
  // Recherche rapide en temps réel
  useEffect(() => {
    if (quickSearch.trim()) {
      const timer = setTimeout(() => {
        searchJobsRealTime(quickSearch, filters.location)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [quickSearch, filters.location, searchJobsRealTime])

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Recherche rapide */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Recherche rapide
        </h3>
        <div className="relative">
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Tapez pour rechercher en temps réel..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        {/* AI Search Summary */}
        {searchSummary && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200"
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-blue-800 text-sm">{searchSummary}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filtres avancés */}
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Filtres avancés</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? 'Réduire' : 'Développer'}
          </button>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champs de base toujours visibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Mots-clés
            </label>
            <input
              type="text"
              id="query"
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Titre, compétences, entreprise..."
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <input
              type="text"
              id="location"
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ville, région, pays..."
            />
          </div>
        </div>

        {/* Language selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Langue de recherche
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="language-fr"
                name="language"
                checked={filters.language === 'fr' || !filters.language}
                onChange={() => handleLanguageChange('fr')}
                className="mr-2"
              />
              <label htmlFor="language-fr" className="text-sm">Français</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="language-de"
                name="language"
                checked={filters.language === 'de'}
                onChange={() => handleLanguageChange('de')}
                className="mr-2"
              />
              <label htmlFor="language-de" className="text-sm">Allemand</label>
            </div>
          </div>
        </div>

        {/* Filtres avancés avec animation */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rayon de recherche
              </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={filters.radius || 50}
                onChange={(e) => updateFilters({ radius: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-gray-500">0 km</span>
              <span className="text-sm font-medium text-blue-600">{filters.radius || 50} km</span>
              <span className="text-xs text-gray-500">100 km</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de contrat
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="full-time"
                checked={filters.contractType?.includes('full-time') || false}
                onChange={() => handleContractTypeChange('full-time')}
                className="mr-2"
              />
              <label htmlFor="full-time" className="text-sm">CDI</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="part-time"
                checked={filters.contractType?.includes('part-time') || false}
                onChange={() => handleContractTypeChange('part-time')}
                className="mr-2"
              />
              <label htmlFor="part-time" className="text-sm">Temps partiel</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="freelance"
                checked={filters.contractType?.includes('freelance') || false}
                onChange={() => handleContractTypeChange('freelance')}
                className="mr-2"
              />
              <label htmlFor="freelance" className="text-sm">Freelance</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="internship"
                checked={filters.contractType?.includes('internship') || false}
                onChange={() => handleContractTypeChange('internship')}
                className="mr-2"
              />
              <label htmlFor="internship" className="text-sm">Stage</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="apprenticeship"
                checked={filters.contractType?.includes('apprenticeship') || false}
                onChange={() => handleContractTypeChange('apprenticeship')}
                className="mr-2"
              />
              <label htmlFor="apprenticeship" className="text-sm">Alternance</label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d&apos;expérience
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="entry"
                checked={filters.experienceLevel?.includes('entry') || false}
                onChange={() => handleExperienceLevelChange('entry')}
                className="mr-2"
              />
              <label htmlFor="entry" className="text-sm">Débutant</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="intermediate"
                checked={filters.experienceLevel?.includes('intermediate') || false}
                onChange={() => handleExperienceLevelChange('intermediate')}
                className="mr-2"
              />
              <label htmlFor="intermediate" className="text-sm">Intermédiaire</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="senior"
                checked={filters.experienceLevel?.includes('senior') || false}
                onChange={() => handleExperienceLevelChange('senior')}
                className="mr-2"
              />
              <label htmlFor="senior" className="text-sm">Senior</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="executive"
                checked={filters.experienceLevel?.includes('executive') || false}
                onChange={() => handleExperienceLevelChange('executive')}
                className="mr-2"
              />
              <label htmlFor="executive" className="text-sm">Direction</label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Télétravail
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="no-remote"
                checked={filters.remote?.includes('no') || false}
                onChange={() => handleRemoteChange('no')}
                className="mr-2"
              />
              <label htmlFor="no-remote" className="text-sm">Sur site</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hybrid"
                checked={filters.remote?.includes('hybrid') || false}
                onChange={() => handleRemoteChange('hybrid')}
                className="mr-2"
              />
              <label htmlFor="hybrid" className="text-sm">Hybride</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="full-remote"
                checked={filters.remote?.includes('full') || false}
                onChange={() => handleRemoteChange('full')}
                className="mr-2"
              />
              <label htmlFor="full-remote" className="text-sm">100% télétravail</label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de publication
          </label>
          <select
            value={filters.postedSince || 'any'}
            onChange={(e) => updateFilters({ postedSince: e.target.value as JobSearchFilters['postedSince'] })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Toutes les dates</option>
            <option value="day">Dernières 24 heures</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
          </select>
            </div>
          </div>
        </motion.div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => updateFilters(defaultFilters)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>
      </form>
    </div>
  </motion.div>
  )
}
