'use client'

import { useState } from 'react'
import PersonalInfoForm from './PersonalInfoForm'
import SummaryForm from './SummaryForm'
import ExperienceForm from './ExperienceForm'
import EducationForm from './EducationForm'
import SkillsForm from './SkillsForm'
import LanguagesForm from './LanguagesForm'
import TemplateSelection from './TemplateSelection'
import CountryTemplateSelection from './CountryTemplateSelection'
import CVPreview from './CVPreview'
import DOCXImport from './DOCXImport'
import CVExport from './CVExport'
import { useCV } from '../utils/cv-context'

export default function CVBuilder() {
  const { cv } = useCV()
  const [activeTab, setActiveTab] = useState<'builder' | 'template' | 'preview'>('builder')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créateur de CV</h1>
        <p className="mt-2 text-gray-600">
          Créez un CV professionnel en quelques minutes
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panneau de gauche - Formulaire */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'builder'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('builder')}
                >
                  Éditeur
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'template'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('template')}
                >
                  Modèles
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'preview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  Aperçu
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'builder' && (
                <div className="space-y-6">
                  <DOCXImport />
                  <PersonalInfoForm />
                  <SummaryForm />
                  <ExperienceForm />
                  <EducationForm />
                  <SkillsForm />
                  <LanguagesForm />
                </div>
              )}

              {activeTab === 'template' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow">
                    <div className="border-b">
                      <nav className="flex">
                        <button
                          className={`px-4 py-3 font-medium text-sm ${
                            cv.countryTemplate 
                              ? 'text-gray-500 hover:text-gray-700'
                              : 'text-blue-600 border-b-2 border-blue-600'
                          }`}
                          onClick={() => {
                            // Logic to switch to style templates
                          }}
                        >
                          Style de CV
                        </button>
                        <button
                          className={`px-4 py-3 font-medium text-sm ${
                            cv.countryTemplate 
                              ? 'text-blue-600 border-b-2 border-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => {
                            // Logic to switch to country templates
                          }}
                        >
                          Format par pays
                        </button>
                      </nav>
                    </div>
                    
                    <div className="p-4">
                      {!cv.countryTemplate ? (
                        <TemplateSelection />
                      ) : (
                        <CountryTemplateSelection />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <CVPreview />
                  <CVExport />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panneau de droite - Aperçu */}
        <div className="lg:w-1/2">
          <div className="sticky top-8">
            <CVPreview />
          </div>
        </div>
      </div>
    </div>
  )
}