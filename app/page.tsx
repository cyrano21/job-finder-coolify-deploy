'use client'

import { useEffect } from 'react'
import EnhancedHero from './components/EnhancedHero'
import EnhancedFeatures from './components/EnhancedFeatures'
import EnhancedPricingCTA from './components/EnhancedPricingCTA'
import EnhancedFooter from './components/EnhancedFooter'

export default function HomePage() {
  // Optimisation des performances avec le chargement différé des ressources
  useEffect(() => {
    // Préchargement des modules principaux après le chargement de la page
    const timer = setTimeout(() => {
      import('./modules/cv/utils/types')
      import('./modules/lettre/utils/types')
      import('./modules/profil/utils/types')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="min-h-screen overflow-hidden">
      <EnhancedHero />
      <EnhancedFeatures />
      <EnhancedPricingCTA />
      <EnhancedFooter />
    </div>
  )
}
