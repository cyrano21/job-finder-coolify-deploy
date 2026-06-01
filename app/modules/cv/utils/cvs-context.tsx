// Context for managing all CVs for a user
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserContext } from '../../user-context'
import { CV } from './types'

interface CVsContextType {
  cvs: CV[]
  addCV: (cv: CV) => void
  updateCV: (id: string, cv: Partial<CV>) => void
  removeCV: (id: string) => void
}

const CVsContext = createContext<CVsContextType | undefined>(undefined)

export function CVsProvider({ children }: { children: ReactNode }) {
  const [cvs, setCVs] = useState<CV[]>([])
  // Auth Clerk
  const { user } = useUser();
  const userId = user?.id;
  
  // Utiliser useUserContext seulement si il est disponible
  let subscription = null;
  try {
    const userContext = useUserContext();
    subscription = userContext.subscription;
  } catch (error) {
    // Si le context n'est pas encore disponible, on continue sans
    console.log('UserContext pas encore disponible dans CVsProvider');
  }

  // Limites selon le plan
  const planLimits: Record<string, number | undefined> = {
    'FREE': 1,
    'PRO': 5,
    'COACH': undefined // illimité
  }

  // Charger les CVs depuis l'API au montage
  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/cvs?userId=${userId}`)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Erreur de chargement des CVs')
      })
      .then(data => setCVs(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error('Erreur lors du chargement des CVs:', error);
        setCVs([]); // Définir un tableau vide en cas d'erreur
      })
  }, [userId])

  const addCV = async (cv: CV) => {
    // Guard: prompt login before creating CV
    if (!userId) {
      alert('Veuillez vous connecter pour créer un CV.');
      return;
    }
    const plan = subscription?.role || 'FREE';
    const limit = planLimits[plan];
    if (limit !== undefined && cvs.length >= limit) {
      alert("Limite atteinte pour votre abonnement. Passez à une offre supérieure pour créer plus de CVs.");
      return;
    }
    const response = await fetch('/api/cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cv, userId })
    })
    const newCV = await response.json()
    setCVs(prev => [...prev, newCV])
  }

  const updateCV = async (id: string, cv: Partial<CV>) => {
    const response = await fetch('/api/cvs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...cv })
    })
    const updated = await response.json()
    setCVs(prev => prev.map(c => c.id === id ? updated : c))
  }

  const removeCV = async (id: string) => {
    await fetch(`/api/cvs?id=${id}`, { method: 'DELETE' })
    setCVs(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CVsContext.Provider value={{ cvs, addCV, updateCV, removeCV }}>
      {children}
    </CVsContext.Provider>
  )
}

export function useCVs() {
  const context = useContext(CVsContext)
  if (!context) throw new Error('useCVs must be used within a CVsProvider')
  return context
}
