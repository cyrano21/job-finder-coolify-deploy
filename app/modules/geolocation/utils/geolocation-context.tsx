'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { GeoLocation, TravelTimeInfo, JobWithLocation } from './types'
import type { JobListing } from '../../jobs/utils/types'

interface GeolocationContextType {
  homeLocation: GeoLocation | null
  jobsWithLocation: JobWithLocation[]
  selectedJobId: string | null
  searchRadius: number
  travelMode: 'driving' | 'transit' | 'walking' | 'bicycling'
  setHomeLocation: (location: GeoLocation) => void
  setSearchRadius: (radius: number) => void
  setTravelMode: (mode: 'driving' | 'transit' | 'walking' | 'bicycling') => void
  selectJob: (jobId: string | null) => void
  calculateTravelTime: (jobId: string) => Promise<TravelTimeInfo | null>
  getJobsInRadius: () => JobWithLocation[]
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined)

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const [homeLocation, setHomeLocation] = useState<GeoLocation | null>(null)
  const [jobsWithLocation, setJobsWithLocation] = useState<JobWithLocation[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [searchRadius, setSearchRadius] = useState<number>(50)
  const [travelMode, setTravelModeState] = useState<'driving' | 'transit' | 'walking' | 'bicycling'>('driving')
  
  const setTravelMode = (mode: 'driving' | 'transit' | 'walking' | 'bicycling') => {
    setTravelModeState(mode)
  }
  
  const selectJob = (jobId: string | null) => {
    setSelectedJobId(jobId)
  }
  
  const calculateTravelTime = async (jobId: string): Promise<TravelTimeInfo | null> => {
    if (!homeLocation) return null
    
    const job = jobsWithLocation.find(j => j.id === jobId)
    if (!job) return null
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error('Google Maps API key is missing')
        return null
      }
      
      const origin = `${homeLocation.lat},${homeLocation.lng}`
      const dest = `${job.geoLocation.lat},${job.geoLocation.lng}`
      const url =
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}` +
        `&destinations=${dest}&mode=${travelMode}&key=${apiKey}&language=fr`
      
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      const element = data.rows?.[0]?.elements?.[0]
      
      if (data.status !== 'OK' || !element || element.status !== 'OK') {
        console.error('Distance Matrix error', data)
        return null
      }
      
      const travelTimeInfo: TravelTimeInfo = {
        duration: { text: element.duration.text, value: element.duration.value },
        distance: { text: element.distance.text, value: element.distance.value },
        mode: travelMode,
      }
      
      setJobsWithLocation(prev =>
        prev.map(j => (j.id === jobId ? { ...j, travelTime: travelTimeInfo } : j))
      )
      
      return travelTimeInfo
    } catch (error) {
      console.error('Error fetching travel time', error)
      return null
    }
  }
  
  const getJobsInRadius = (): JobWithLocation[] => {
    if (!homeLocation) return jobsWithLocation
    
    return jobsWithLocation.filter(job => {
      const distance = calculateDistance(
        homeLocation.lat, 
        homeLocation.lng, 
        job.geoLocation.lat, 
        job.geoLocation.lng
      )
      return distance <= searchRadius
    })
  }
  
  // Fonction utilitaire pour calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c // Distance en km
    return distance
  }
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180)
  }
  
  // Charger offres réelles depuis Adzuna et géocodage
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs')
        if (!res.ok) throw new Error('Échec fetch jobs')
        const data = await res.json()
        const jobs: JobListing[] = data.results || [] // Utiliser data.results au lieu de data directement
        const jobsWithLoc = await Promise.all(
          jobs.map(async job => {
            try {
              const geoRes = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(job.location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
              )
              const geoData = await geoRes.json()
              if (geoData.status === 'OK' && geoData.results.length > 0) {
                const r = geoData.results[0]
                return {
                  id: job.id!,
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  geoLocation: { lat: r.geometry.location.lat, lng: r.geometry.location.lng, address: r.formatted_address }
                } as JobWithLocation
              }
            } catch (e) {
              console.error('Géocoding job', job.title, e)
            }
            return null
          })
        )
        setJobsWithLocation(jobsWithLoc.filter(j => j !== null) as JobWithLocation[])
      } catch (error) {
        console.error('Erreur chargement jobs', error)
      }
    }
    loadJobs()
  }, [])
  
  // Recalculer les temps de trajet lorsque le mode de transport change
  useEffect(() => {
    const recalculateTravelTimes = async () => {
      if (!homeLocation || jobsWithLocation.length === 0) return
      
      // Recalculer pour les jobs qui ont déjà un temps de trajet calculé
      const jobsToUpdate = jobsWithLocation.filter(job => job.travelTime)
      
      for (const job of jobsToUpdate) {
        try {
          await calculateTravelTime(job.id)
        } catch (error) {
          console.error('Error recalculating travel time for job', job.id, error)
        }
      }
    }
    
    recalculateTravelTimes()
  }, [travelMode, homeLocation, jobsWithLocation, calculateTravelTime])
  
  return (
    <GeolocationContext.Provider
      value={{
        homeLocation,
        jobsWithLocation,
        selectedJobId,
        searchRadius,
        travelMode,
        setHomeLocation,
        setSearchRadius,
        setTravelMode,
        selectJob,
        calculateTravelTime,
        getJobsInRadius
      }}
    >
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation() {
  const context = useContext(GeolocationContext)
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider')
  }
  return context
}
