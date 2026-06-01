'use client'

import { useState } from 'react'
import TemplateSelection from './TemplateSelection'
import CountryTemplateSelection from './CountryTemplateSelection'

interface CVTemplateSelectorProps {
  className?: string
}

export default function CVTemplateSelector({ className }: CVTemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'country'>('style')

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b">
        <nav className="flex">
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'style'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('style')}
          >
            Style de CV
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'country'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('country')}
          >
            Format par pays
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {activeTab === 'style' ? (
          <TemplateSelection />
        ) : (
          <CountryTemplateSelection />
        )}
      </div>
    </div>
  )
}