// Context pour l'utilisateur connecté et son statut d'abonnement
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

export interface UserSubscription {
  plan: string
  role: string
  subscriptionStatus: string
  stripeCustomerId?: string
  email?: string
}

interface UserContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  subscription: UserSubscription | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchSubscription() {
      if (!user || !mounted) {
        setSubscription(null)
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        // Appelle une API pour récupérer le statut d'abonnement de l'utilisateur
        const res = await fetch(`/api/users?email=${user.emailAddresses[0]?.emailAddress}`)
        if (res.ok) {
          const data = await res.json()
          setSubscription({
            plan: data.plan,
            role: data.role,
            subscriptionStatus: data.subscriptionStatus,
            stripeCustomerId: data.stripeCustomerId,
            email: data.email,
          })
        } else {
          setSubscription(null)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'abonnement:', error)
        setSubscription(null)
      }
      setLoading(false)
    }
    if (isLoaded && mounted) fetchSubscription()
  }, [user, isLoaded, mounted])

  // Éviter le rendu côté serveur jusqu'à ce que le composant soit monté
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <UserContext.Provider value={{ user, subscription, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used within a UserProvider')
  return ctx
}
