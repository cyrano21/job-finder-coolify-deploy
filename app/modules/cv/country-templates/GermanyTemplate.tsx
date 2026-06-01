'use client'

import { CV, Experience, Education, Skill, Language, Summary } from '../utils/types'
import { Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react'

export default function GermanyTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const personalSection = sections.find(section => section.id === 'personal')
  const educationSection = sections.find(section => section.id === 'education')
  const experienceSection = sections.find(section => section.id === 'experience')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8">
      {/* En-tête allemand avec photo (si disponible) */}
      <header className="border-b border-gray-300 pb-6 mb-6">
        <div className="flex items-start gap-6">
          {personalInfo.photo && (
            <div className="w-32 h-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Photo</span>
            </div>
          )}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-gray-700 mt-1">{personalInfo.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.address}, {personalInfo.postalCode} {personalInfo.city}</span>
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.country}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span>Date de naissance: 01.01.1990</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Nationalité:</span>
                <span>Française</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Données personnelles */}
        {personalSection && (personalSection.content as Summary).content && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase bg-gray-100 p-2">
              {personalSection.title}
            </h3>
            <p className="text-gray-700">
              {(personalSection.content as Summary).content}
            </p>
          </section>
        )}

        {/* Formation (prioritaire en Allemagne) */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase bg-gray-100 p-2">
              {educationSection.title}
            </h3>
            <div className="space-y-4">
              {(educationSection.content as Education[]).map((education) => (
                <div key={education.id} className="border-l-4 border-blue-600 pl-4 py-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{education.degree}</h4>
                    <span className="text-sm text-gray-600">
                      {education.startDate} - {education.current ? 'Heute' : education.endDate}
                    </span>
                  </div>
                  <div className="text-gray-800 font-medium">
                    {education.institution}, {education.location}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{education.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Expérience professionnelle */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase bg-gray-100 p-2">
              {experienceSection.title}
            </h3>
            <div className="space-y-4">
              {(experienceSection.content as Experience[]).map((experience) => (
                <div key={experience.id} className="border-l-4 border-green-600 pl-4 py-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{experience.title}</h4>
                    <span className="text-sm text-gray-600">
                      {experience.startDate} - {experience.current ? 'Heute' : experience.endDate}
                    </span>
                  </div>
                  <div className="text-gray-800 font-medium">
                    {experience.company}, {experience.location}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{experience.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compétences */}
          {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase bg-gray-100 p-2">
                {skillsSection.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skillsSection.content as Skill[]).map((skill) => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languagesSection && (languagesSection.content as Language[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase bg-gray-100 p-2">
                {languagesSection.title}
              </h3>
              <div className="space-y-2">
                {(languagesSection.content as Language[]).map((language) => (
                  <div key={language.id} className="flex justify-between">
                    <span className="text-gray-800">{language.name}</span>
                    <span className="text-sm text-gray-600">
                      {language.level === 'native' ? 'Muttersprache' : 
                       language.level === 'C2' ? 'Verhandlungssicher' :
                       language.level === 'C1' ? 'Fließend' :
                       language.level === 'B2' ? 'Gute Kenntnisse' :
                       language.level === 'B1' ? 'Grundkenntnisse' :
                       language.level === 'A2' ? 'Elementare Kenntnisse' :
                       language.level === 'A1' ? 'Anfänger' : language.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}