'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import type {
  YoungProfileInput,
  OrientationSession,
  Resource,
  ActionStatus,
} from './types'

interface OrientationContextType {
  profile: YoungProfileInput
  session: OrientationSession | null
  resources: Resource[]
  recommendedResources: string[]
  loading: boolean
  error: string | null
  updateProfile: (partial: Partial<YoungProfileInput>) => void
  runDiagnostic: () => Promise<void>
  loadSessions: () => Promise<void>
  loadResources: (category?: string) => Promise<void>
  updateActionStatus: (actionId: string, status: ActionStatus) => Promise<void>
}

const defaultProfile: YoungProfileInput = {
  interests: [],
  constraints: [],
}

const OrientationContext = createContext<OrientationContextType | undefined>(
  undefined
)

export function OrientationProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<YoungProfileInput>(defaultProfile)
  const [session, setSession] = useState<OrientationSession | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [recommendedResources, setRecommendedResources] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useCallback((partial: Partial<YoungProfileInput>) => {
    setProfile((prev) => ({ ...prev, ...partial }))
  }, [])

  const runDiagnostic = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/orientation/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.status === 401) {
        setError('Connecte-toi pour lancer ton diagnostic.')
        return
      }
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json()
      setSession(data.session)
      setRecommendedResources(data.recommendedResources ?? [])
    } catch (e) {
      console.error('Erreur diagnostic:', e)
      setError("Le diagnostic n'a pas pu être généré.")
    } finally {
      setLoading(false)
    }
  }, [profile])

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/orientation/sessions')
      if (!res.ok) return
      const data = await res.json()
      if (data.sessions?.length > 0) {
        setSession(data.sessions[0])
      }
    } catch (e) {
      console.error('Erreur chargement sessions:', e)
    }
  }, [])

  const loadResources = useCallback(async (category?: string) => {
    try {
      const url = category
        ? `/api/orientation/resources?category=${encodeURIComponent(category)}`
        : '/api/orientation/resources'
      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()
      setResources(data.resources ?? [])
    } catch (e) {
      console.error('Erreur chargement ressources:', e)
    }
  }, [])

  const updateActionStatus = useCallback(
    async (actionId: string, status: ActionStatus) => {
      // Mise à jour optimiste de l'UI.
      setSession((prev) =>
        prev
          ? {
              ...prev,
              actionPlans: prev.actionPlans?.map((a) =>
                a.id === actionId ? { ...a, status } : a
              ),
            }
          : prev
      )
      try {
        await fetch(`/api/orientation/actions/${actionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      } catch (e) {
        console.error('Erreur mise à jour action:', e)
      }
    },
    []
  )

  return (
    <OrientationContext.Provider
      value={{
        profile,
        session,
        resources,
        recommendedResources,
        loading,
        error,
        updateProfile,
        runDiagnostic,
        loadSessions,
        loadResources,
        updateActionStatus,
      }}
    >
      {children}
    </OrientationContext.Provider>
  )
}

export function useOrientation() {
  const context = useContext(OrientationContext)
  if (context === undefined) {
    throw new Error('useOrientation must be used within an OrientationProvider')
  }
  return context
}
