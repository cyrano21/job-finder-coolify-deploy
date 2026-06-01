/* stylelint-disable */
"use client";
/* stylelint-enable */

import { useState, useEffect } from "react";
import { GeolocationProvider } from "../modules/geolocation/utils/geolocation-context";
import MapComponent from "../modules/geolocation/components/MapComponent";
import TravelTimeSettings from "../modules/geolocation/components/TravelTimeSettings";

export default function GeolocationPage() {
  const [animateIn, setAnimateIn] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <GeolocationProvider>
      <div className="min-h-screen bg-brand-gradient-soft relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 right-40 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
        </div>
        
        <div className="container mx-auto py-12 px-4 relative z-10">
          <div className={`transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-brand-gradient inline-block">
              Géolocalisation et temps de trajet
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-1">
                <TravelTimeSettings />
              </div>
              <div className="md:col-span-2 glass p-4 rounded-2xl shadow-card border border-gray-100 transition-all duration-300 hover:shadow-elevated overflow-hidden">
                <div className="h-[500px] md:h-[600px] w-full">
                  <MapComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeolocationProvider>
  );
}
