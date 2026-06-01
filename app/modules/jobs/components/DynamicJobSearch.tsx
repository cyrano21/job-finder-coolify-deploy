'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useJobs } from '../utils/jobs-context'

export default function DynamicJobSearch() {
  const { searchJobsRealTime, loading, totalJobs, error } = useJobs()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchScore, setSearchScore] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const controls = useAnimation()

  // Suggestions de recherche populaires
  const popularSearches = [
    'Développeur JavaScript',
    'Designer UX/UI', 
    'Chef de projet',
    'Data Scientist',
    'Marketing Digital',
    'Commercial'
  ]

  const popularLocations = [
    'Paris',
    'Lyon', 
    'Marseille',
    'Toulouse',
    'Nantes',
    'Bordeaux'
  ]

  // Hook personnalisé pour le debouncing
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }

  // Debouncing des valeurs de recherche
  const debouncedQueryValue = useDebounce(query, 500)
  const debouncedLocationValue = useDebounce(location, 500)

  // Calcul du score de recherche IA
  const calculateSearchScore = useCallback((searchTerm: string, locationTerm: string) => {
    let score = 0

    // Score basé sur la longueur de la recherche
    if (searchTerm.length > 0) score += Math.min(searchTerm.length * 2, 40)

    // Score basé sur la localisation
    if (locationTerm.length > 0) score += Math.min(locationTerm.length * 1.5, 30)

    // Bonus pour les termes techniques
    const techTerms = ['javascript', 'react', 'python', 'java', 'php', 'node', 'vue', 'angular']
    const hasTechTerm = techTerms.some(term =>
      searchTerm.toLowerCase().includes(term)
    )
    if (hasTechTerm) score += 20

    // Bonus pour les villes majeures
    const majorCities = ['paris', 'lyon', 'marseille', 'toulouse', 'nantes', 'bordeaux']
    const hasMajorCity = majorCities.some(city =>
      locationTerm.toLowerCase().includes(city)
    )
    if (hasMajorCity) score += 10

    return Math.min(score, 100)
  }, [])

  // Gestion de la frappe
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsTyping(true)

    // Effet de particules lors de la frappe
    if (value.length > 0 && !showParticles) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 1000)
    }

    // Animation de frappe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    setIsTyping(true)

    if (value.length > 0 && !showParticles) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 1000)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  // Déclencher la recherche avec debouncing
  useEffect(() => {
    if (debouncedQueryValue.trim() || debouncedLocationValue.trim()) {
      searchJobsRealTime(debouncedQueryValue, debouncedLocationValue)

      // Calculer le score de recherche
      const score = calculateSearchScore(debouncedQueryValue, debouncedLocationValue)
      setSearchScore(score)

      // Animation de succès
      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3 }
      })
    }
  }, [debouncedQueryValue, debouncedLocationValue, searchJobsRealTime, calculateSearchScore, controls])

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setIsExpanded(false)
  }

  const handleQuickLocation = (searchLocation: string) => {
    setLocation(searchLocation)
    setIsExpanded(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Barre de recherche principale */}
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        {/* Indicateur de frappe */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-green-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Indicateur de debouncing */}
        <AnimatePresence>
          {(debouncedQueryValue !== query || debouncedLocationValue !== location) && (query || location) && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5 }}
              style={{ originX: 0 }}
            />
          )}
        </AnimatePresence>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Champ de recherche */}
          <div className="flex-1 relative">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Titre du poste, compétences, entreprise..."
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  isTyping ? 'border-blue-400 shadow-lg' : 'border-gray-300'
                }`}
                onFocus={() => setIsExpanded(true)}
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Champ de localisation */}
          <div className="flex-1 relative">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="Ville, région, pays..."
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  isTyping ? 'border-green-400 shadow-lg' : 'border-gray-300'
                }`}
                onFocus={() => setIsExpanded(true)}
              />
            </div>
          </div>
        </div>

        {/* Indicateur de résultats avec score IA */}
        <AnimatePresence>
          {(query || location) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Recherche en cours...</span>
                    </div>
                  ) : error ? (
                    <span className="text-red-600 text-sm">{error}</span>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600 font-medium">
                        {totalJobs} offres trouvées
                      </span>
                      {/* Score IA */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Score IA:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                searchScore >= 80 ? 'bg-green-500' :
                                searchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${searchScore}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            searchScore >= 80 ? 'text-green-600' :
                            searchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {searchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setQuery('')
                    setLocation('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effets de particules */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  initial={{
                    x: Math.random() * 400,
                    y: 100,
                    opacity: 1,
                    scale: 0
                  }}
                  animate={{
                    y: -20,
                    opacity: 0,
                    scale: 1
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestions rapides */}
      <AnimatePresence>
        {isExpanded && !query && !location && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recherches populaires */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recherches populaires</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <motion.button
                      key={search}
                      onClick={() => handleQuickSearch(search)}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-all duration-200 relative overflow-hidden group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{search}</span>
                      <motion.div
                        className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Localisations populaires */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Villes populaires</h3>
                <div className="flex flex-wrap gap-2">
                  {popularLocations.map((loc, index) => (
                    <motion.button
                      key={loc}
                      onClick={() => handleQuickLocation(loc)}
                      className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-all duration-200 relative overflow-hidden group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{loc}</span>
                      <motion.div
                        className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-100"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                      {/* Indicateur de popularité */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
