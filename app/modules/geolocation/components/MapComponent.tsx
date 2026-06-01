'use client'

import { useEffect, useState } from 'react'
import { useGeolocation } from '../utils/geolocation-context'
import { GeoLocation, JobWithLocation } from '../utils/types'
import { useJsApiLoader, GoogleMap, MarkerF, CircleF } from '@react-google-maps/api'
import { useUser } from '@clerk/nextjs'
import { Button, Card, CardContent, Input } from '@/app/components/ui'
import { cn } from '@/app/lib/utils'
import { MapPin } from 'lucide-react'

export default function MapComponent() {
  const { 
    homeLocation, 
    selectedJobId,
    searchRadius,
    travelMode,
    setHomeLocation,
    selectJob,
    calculateTravelTime,
    getJobsInRadius
  } = useGeolocation()
  const { isSignedIn } = useUser()
  
  const [address, setAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [jobsInRadius, setJobsInRadius] = useState<JobWithLocation[]>([])
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })
  
  // Mettre à jour les emplois dans le rayon lorsque la position, le rayon ou le mode de transport change
  useEffect(() => {
    setJobsInRadius(getJobsInRadius())
  }, [homeLocation, searchRadius, getJobsInRadius])
  
  // Recalculer les temps de trajet pour les emplois sélectionnés lorsque le mode de transport change
  useEffect(() => {
    const recalculateSelectedJobTravelTime = async () => {
      if (selectedJobId && homeLocation) {
        try {
          await calculateTravelTime(selectedJobId)
        } catch (error) {
          console.error('Error recalculating travel time for selected job', error)
        }
      }
    }
    
    recalculateSelectedJobTravelTime()
  }, [travelMode, selectedJobId, homeLocation, calculateTravelTime])
  
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.trim()) return
    setIsSearching(true)
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const newLocation: GeoLocation = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address
        }
        setHomeLocation(newLocation)
      } else {
        console.error('Geocoding error', data)
        alert('Adresse non trouvée. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error geocoding address', error)
      alert('Erreur lors de la recherche de l\'adresse. Veuillez réessayer.')
    } finally {
      setIsSearching(false)
    }
  }
  
  const handleJobClick = async (jobId: string) => {
    selectJob(jobId)
    if (!isSignedIn) {
      alert('Connectez-vous pour voir le temps de trajet.')
      return
    }
    if (homeLocation) {
      try {
        const travelTime = await calculateTravelTime(jobId)
        if (!travelTime) {
          alert('Impossible de calculer le temps de trajet. Veuillez réessayer.')
        }
      } catch (error) {
        console.error('Error calculating travel time', error)
        alert('Erreur lors du calcul du temps de trajet.')
      }
    } else {
      alert('Veuillez définir votre position avant de calculer le temps de trajet.')
    }
  }
  
  // Fonction pour centrer la carte sur la position de l'utilisateur
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Récupérer l'adresse à partir des coordonnées
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            const res = await fetch(url)
            const data = await res.json()
            
            if (data.status === 'OK' && data.results.length > 0) {
              const result = data.results[0]
              const newLocation: GeoLocation = {
                lat: latitude,
                lng: longitude,
                address: result.formatted_address
              }
              setHomeLocation(newLocation)
            } else {
              // Si nous ne pouvons pas obtenir l'adresse, utiliser les coordonnées
              const newLocation: GeoLocation = {
                lat: latitude,
                lng: longitude,
                address: `Position actuelle (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
              }
              setHomeLocation(newLocation)
            }
          } catch (error) {
            console.error('Error getting address from coordinates', error)
            alert('Erreur lors de la récupération de votre position.')
          }
        },
        (error) => {
          console.error('Error getting current position', error)
          alert('Impossible d\'obtenir votre position. Veuillez vérifier les paramètres de localisation.')
        }
      )
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.')
    }
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation et temps de trajet</h3>
        
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Entrez votre adresse"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={getCurrentLocation}
                title="Utiliser ma position actuelle"
              >
                <MapPin className="h-5 w-5 text-indigo-600" />
              </Button>
            </div>
          
            <Button
              type="button"
              block
              onClick={handleAddressSearch}
              loading={isSearching}
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>
        
          {homeLocation && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-sm font-medium">Votre position :</p>
              <p className="text-sm">{homeLocation.address || `${homeLocation.lat}, ${homeLocation.lng}`}</p>
            </div>
          )}
        
          <div className="w-full h-full min-h-[400px] rounded-md mb-4 overflow-hidden">
            {!isLoaded ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>Chargement de la carte...</p>
              </div>
            ) : (
              <GoogleMap
                center={homeLocation ? { lat: homeLocation.lat, lng: homeLocation.lng } : { lat: 48.856614, lng: 2.3522219 }}
                zoom={homeLocation ? 12 : 6}
                mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px' }}
              >
                {homeLocation && <MarkerF position={{ lat: homeLocation.lat, lng: homeLocation.lng }} />}
                {jobsInRadius.map((job) => (
                  <MarkerF 
                    key={job.id} 
                    position={job.geoLocation} 
                    onClick={() => handleJobClick(job.id)}
                    icon={{
                      url: selectedJobId === job.id 
                        ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' 
                        : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                  />
                ))}
                {homeLocation && (
                  <CircleF
                    center={homeLocation}
                    radius={searchRadius * 1000}
                    options={{ 
                      fillColor: '#4285F4', 
                      fillOpacity: 0.1, 
                      strokeColor: '#4285F4',
                      strokeOpacity: 0.3,
                      strokeWeight: 2
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des emplois avec temps de trajet */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emplois à proximité ({jobsInRadius.length})</h3>
        
          {jobsInRadius.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobsInRadius.map((job) => (
                <div 
                  key={job.id} 
                  className={cn(
                    'p-3 border rounded-xl cursor-pointer transition-all duration-200',
                    selectedJobId === job.id 
                      ? 'border-indigo-500 bg-indigo-50 shadow-soft' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  )}
                  onClick={() => handleJobClick(job.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    
                    {job.travelTime ? (
                      <div className="text-right ml-2">
                        <p className="text-sm font-medium text-indigo-600">{job.travelTime.duration.text}</p>
                        <p className="text-xs text-gray-500">{job.travelTime.distance.text}</p>
                      </div>
                    ) : (
                      <div className="text-right ml-2">
                        <p className="text-xs text-gray-400">Cliquez pour calculer</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedJobId === job.id && job.travelTime && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Mode: {job.travelTime.mode === 'driving' ? 'Voiture' : 
                               job.travelTime.mode === 'transit' ? 'Transport' : 
                               job.travelTime.mode === 'walking' ? 'À pied' : 
                               job.travelTime.mode === 'bicycling' ? 'Vélo' : 'Voiture'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center text-gray-400 mb-2">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-gray-600">
                {homeLocation 
                  ? 'Aucun emploi trouvé dans le rayon de recherche.' 
                  : 'Définissez votre position pour voir les emplois à proximité.'}
              </p>
              {!homeLocation && (
                <Button 
                  type="button"
                  variant="subtle"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="mt-3"
                >
                  Utiliser ma position actuelle
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
