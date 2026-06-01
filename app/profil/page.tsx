'use client'

import { useState, useEffect } from 'react'
import { ProfileProvider } from '../modules/profil/utils/profile-context'
import ProfileInfoForm from '../modules/profil/components/ProfileInfoForm'
import SocialLinksForm from '../modules/profil/components/SocialLinksForm'
import ProjectsForm from '../modules/profil/components/ProjectsForm'
import CVLetterIntegrationForm from '../modules/profil/components/CVLetterIntegrationForm'
import ProfilePreview from '../modules/profil/components/ProfilePreview'

import { CVsProvider } from '../modules/cv/utils/cvs-context'
import { CoverLettersProvider } from '../modules/lettre/utils/cover-letters-context'
import { Button, Card, CardContent } from '@/app/components/ui'
import { Check, Save, CheckCircle2 } from 'lucide-react'

export default function ProfileGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [activeSection, setActiveSection] = useState<string>('info')
  const [animateIn, setAnimateIn] = useState(false)
  
  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true)
  }, [])
  
  return (
    <CVsProvider>
      <CoverLettersProvider>
        <ProfileProvider>
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
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-brand-gradient inline-block">Générateur de profil professionnel</h1>
                
                <div className="glass rounded-2xl shadow-card p-1.5 inline-block mb-8">
                  <div className="flex">
                    <button
                      className={`touch-target px-6 py-3 rounded-xl transition-all duration-200 font-semibold ${
                        activeTab === 'edit' 
                          ? 'bg-brand-gradient text-white shadow-elevated' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('edit')}
                    >
                      Éditer
                    </button>
                    <button
                      className={`touch-target px-6 py-3 rounded-xl transition-all duration-200 font-semibold ${
                        activeTab === 'preview' 
                          ? 'bg-brand-gradient text-white shadow-elevated' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('preview')}
                    >
                      Aperçu
                    </button>
                  </div>
                </div>
        
                {activeTab === 'edit' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      <Card className="transition-all duration-300 hover:shadow-elevated">
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-4 text-gray-900">Sections</h3>
                          <nav className="space-y-2">
                            <button
                              className={`touch-target w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === 'info' 
                                  ? 'bg-brand-gradient-soft text-indigo-700 font-medium border border-indigo-100' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => setActiveSection('info')}
                            >
                              Informations du profil
                            </button>
                            <button
                              className={`touch-target w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === 'social' 
                                  ? 'bg-brand-gradient-soft text-indigo-700 font-medium border border-indigo-100' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => setActiveSection('social')}
                            >
                              Liens sociaux
                            </button>
                            <button
                              className={`touch-target w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === 'projects' 
                                  ? 'bg-brand-gradient-soft text-indigo-700 font-medium border border-indigo-100' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => setActiveSection('projects')}
                            >
                              Projets
                            </button>
                            <button
                              className={`touch-target w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === 'integration' 
                                  ? 'bg-brand-gradient-soft text-indigo-700 font-medium border border-indigo-100' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => setActiveSection('integration')}
                            >
                              Intégration CV/Lettres
                            </button>
                          </nav>
                        </CardContent>
                      </Card>
                      
                      <Card className="transition-all duration-300 hover:shadow-elevated">
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-4 text-gray-900">Conseils</h3>
                          <ul className="text-gray-600 space-y-3">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                              <span>Utilisez une URL personnalisée mémorable</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                              <span>Ajoutez tous vos liens professionnels</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                              <span>Mettez en avant vos meilleurs projets</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                              <span>Intégrez votre CV le plus pertinent</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                              <span>Rédigez une bio concise et percutante</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="lg:col-span-3 transition-all duration-300 hover:shadow-elevated">
                      <CardContent>
                        {activeSection === 'info' && <ProfileInfoForm />}
                        {activeSection === 'social' && <SocialLinksForm />}
                        {activeSection === 'projects' && <ProjectsForm />}
                        {activeSection === 'integration' && <CVLetterIntegrationForm />}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 lg:gap-8">
                    <Card className="transition-all duration-300 hover:shadow-elevated">
                      <CardContent>
                        <ProfilePreview />
                      </CardContent>
                    </Card>
                    
                    <Card className="transition-all duration-300 hover:shadow-elevated">
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <h3 className="text-lg font-semibold text-gray-900">Publier votre profil</h3>
                          
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button
                              variant="primary"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => alert('Profil publié avec succès !')}
                            >
                              <Check className="h-5 w-5 mr-2" />
                              Publier le profil
                            </Button>
                            
                            <Button
                              variant="primary"
                              onClick={() => alert('Profil sauvegardé avec succès !')}
                            >
                              <Save className="h-5 w-5 mr-2" />
                              Sauvegarder comme brouillon
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ProfileProvider>
      </CoverLettersProvider>
    </CVsProvider>
  )
}
