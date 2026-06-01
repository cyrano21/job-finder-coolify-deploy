'use client'

import { useGeolocation } from '../utils/geolocation-context'
import { Card, CardContent, Label } from '@/app/components/ui'
import { cn } from '@/app/lib/utils'
import { Car, TrainFront, Footprints, Bike, Lightbulb } from 'lucide-react'

export default function TravelTimeSettings() {
  const { 
    searchRadius, 
    travelMode, 
    setSearchRadius, 
    setTravelMode 
  } = useGeolocation()
  
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRadius(parseInt(e.target.value))
  }
  
  const handleModeChange = (mode: 'driving' | 'transit' | 'walking' | 'bicycling') => {
    setTravelMode(mode)
  }

  const modeButtonClass = (active: boolean) =>
    cn(
      'touch-target p-3 border rounded-xl flex flex-col items-center gap-1 transition-all duration-200',
      active
        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    )
  
  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de trajet</h3>
        
        <div className="space-y-6">
          <div>
            <Label>
              Rayon de recherche : {searchRadius} km
            </Label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 km</span>
              <span>25 km</span>
              <span>50 km</span>
              <span>75 km</span>
              <span>100 km</span>
            </div>
          </div>
          
          <div>
            <Label className="mb-2">
              Mode de transport
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={modeButtonClass(travelMode === 'driving')}
                onClick={() => handleModeChange('driving')}
              >
                <Car className="h-6 w-6 mb-1 text-indigo-600" />
                <span className="text-sm font-medium">Voiture</span>
              </button>
              <button
                className={modeButtonClass(travelMode === 'transit')}
                onClick={() => handleModeChange('transit')}
              >
                <TrainFront className="h-6 w-6 mb-1 text-indigo-600" />
                <span className="text-sm font-medium">Transport</span>
              </button>
              <button
                className={modeButtonClass(travelMode === 'walking')}
                onClick={() => handleModeChange('walking')}
              >
                <Footprints className="h-6 w-6 mb-1 text-indigo-600" />
                <span className="text-sm font-medium">À pied</span>
              </button>
              <button
                className={modeButtonClass(travelMode === 'bicycling')}
                onClick={() => handleModeChange('bicycling')}
              >
                <Bike className="h-6 w-6 mb-1 text-indigo-600" />
                <span className="text-sm font-medium">Vélo</span>
              </button>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <p className="text-xs text-indigo-800 flex items-start gap-1.5">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <span className="font-medium">Conseil :</span> Sélectionnez votre mode de transport 
                préféré pour calculer le temps de trajet réel vers les offres d'emploi.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
