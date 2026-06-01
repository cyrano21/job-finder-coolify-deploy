'use client'

import { CV, Experience, Education, Skill, Language, Summary, Project } from '../utils/types'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export default function MinimalTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  const projectsSection = sections.find(section => section.id === 'projects')
  const projectItems = Array.isArray(projectsSection?.content) ? (projectsSection.content as Project[]) : []
  
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto p-6">
      {/* En-tête minimaliste */}
      <header className="mb-8">
        <h1 className="text-3xl font-light mb-1 text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-lg text-gray-600 mb-4">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail size={14} className="mr-1 flex-shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone size={14} className="mr-1 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span>
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <Globe size={14} className="mr-1 flex-shrink-0" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Ligne de séparation */}
      <div className="w-16 h-0.5 bg-gray-300 mb-8"></div>

      {/* Contenu */}
      <div className="space-y-8">
        {/* Résumé */}
        {summarySection && (summarySection.content as Summary).content && (
          <section>
            <h3 className="text-lg font-normal mb-3 text-gray-900">
              {summarySection.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {(summarySection.content as Summary).content}
            </p>
          </section>
        )}

        {/* Expérience */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section>
            <h3 className="text-lg font-normal mb-3 text-gray-900">
              {experienceSection.title}
            </h3>
            <div className="space-y-5">
              {(experienceSection.content as Experience[]).map((experience) => (
                <div key={experience.id} className="pl-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-medium text-gray-900">{experience.title}</h4>
                    <span className="text-sm text-gray-500">
                      {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {experience.company}, {experience.location}
                  </div>
                  <p className="text-sm text-gray-700">{experience.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Éducation */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section>
            <h3 className="text-lg font-normal mb-3 text-gray-900">
              {educationSection.title}
            </h3>
            <div className="space-y-5">
              {(educationSection.content as Education[]).map((education) => (
                <div key={education.id} className="pl-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-medium text-gray-900">{education.degree}</h4>
                    <span className="text-sm text-gray-500">
                      {education.startDate} - {education.current ? 'Présent' : education.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {education.institution}, {education.location}
                  </div>
                  <p className="text-sm text-gray-700">{education.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deux colonnes pour compétences et langues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compétences */}
          {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
            <section>
              <h3 className="text-lg font-normal mb-3 text-gray-900">
                {skillsSection.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skillsSection.content as Skill[]).map((skill) => (
                  <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languagesSection && (languagesSection.content as Language[]).length > 0 && (
            <section>
              <h3 className="text-lg font-normal mb-3 text-gray-900">
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

        {/* Projets */}
        {projectsSection && projectItems.length > 0 && (
          <section>
            <h3 className="text-lg font-normal mb-3 text-gray-900">
              {projectsSection.title}
            </h3>
            <div className="space-y-4">
              {projectItems.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-sm text-gray-500">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                  {project.url && (
                    <a href={project.url} className="text-sm text-gray-500 hover:text-gray-800">
                      Voir le projet
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}