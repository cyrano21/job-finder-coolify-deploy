'use client'

import { CV, Experience, Education, Skill, Language, Summary } from '../utils/types'
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'

export default function FranceTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8">
      {/* En-tête avec informations personnelles */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold uppercase">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-gray-700 mt-1">{personalInfo.title}</h2>
          </div>
          <div className="text-right text-sm">
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {(personalInfo.postalCode || personalInfo.city) && (
              <div>{personalInfo.postalCode} {personalInfo.city}</div>
            )}
            {personalInfo.country && <div>{personalInfo.country}</div>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-gray-600" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-600" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <Globe size={16} className="mr-2 text-gray-600" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin size={16} className="mr-2 text-gray-600" />
              <span>LinkedIn</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center">
              <Github size={16} className="mr-2 text-gray-600" />
              <span>GitHub</span>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Profil */}
        {summarySection && (summarySection.content as Summary).content && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
              {summarySection.title}
            </h3>
            <p className="text-gray-700">
              {(summarySection.content as Summary).content}
            </p>
          </section>
        )}

        {/* Expérience professionnelle */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
              {experienceSection.title}
            </h3>
            <div className="space-y-4">
              {(experienceSection.content as Experience[]).map((experience) => (
                <div key={experience.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{experience.title}</h4>
                    <span className="text-sm text-gray-600">
                      {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
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

        {/* Formation */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
              {educationSection.title}
            </h3>
            <div className="space-y-4">
              {(educationSection.content as Education[]).map((education) => (
                <div key={education.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{education.degree}</h4>
                    <span className="text-sm text-gray-600">
                      {education.startDate} - {education.current ? 'Présent' : education.endDate}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compétences */}
          {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                {skillsSection.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skillsSection.content as Skill[]).map((skill) => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
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
              <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                {languagesSection.title}
              </h3>
              <div className="space-y-2">
                {(languagesSection.content as Language[]).map((language) => (
                  <div key={language.id} className="flex justify-between">
                    <span className="text-gray-800">{language.name}</span>
                    <span className="text-sm text-gray-600">
                      {language.level === 'native' ? 'Langue maternelle' : language.level}
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