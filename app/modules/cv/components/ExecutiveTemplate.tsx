'use client'

import { CV, Experience, Education, Skill, Language, Summary, Project } from '../utils/types'
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react'

export default function ExecutiveTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  const projectsSection = sections.find(section => section.id === 'projects')
  
  return (
    <div className="bg-white font-serif">
      {/* En-tête élégant */}
      <header className="border-b-4 border-gray-800 pb-6 pt-8 px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wider uppercase mb-1 text-gray-900">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl font-medium text-gray-600 tracking-wide">{personalInfo.title}</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-gray-700">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail size={16} className="mr-2 flex-shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone size={16} className="mr-2 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span>
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <Globe size={16} className="mr-2 flex-shrink-0" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin size={16} className="mr-2 flex-shrink-0" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Résumé */}
        {summarySection && (summarySection.content as Summary).content && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              {summarySection.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {(summarySection.content as Summary).content}
            </p>
          </section>
        )}

        {/* Expérience */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              {experienceSection.title}
            </h3>
            <div className="space-y-6">
              {(experienceSection.content as Experience[]).map((experience) => (
                <div key={experience.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
                    <div className="lg:col-span-1 text-gray-600 font-medium">
                      {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
                    </div>
                    <div className="lg:col-span-4">
                      <h4 className="font-bold text-lg text-gray-900">{experience.title}</h4>
                      <div className="text-gray-800 font-medium mb-2">
                        {experience.company}, {experience.location}
                      </div>
                      <p className="text-gray-700">{experience.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Éducation */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              {educationSection.title}
            </h3>
            <div className="space-y-6">
              {(educationSection.content as Education[]).map((education) => (
                <div key={education.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
                    <div className="lg:col-span-1 text-gray-600 font-medium">
                      {education.startDate} - {education.current ? 'Présent' : education.endDate}
                    </div>
                    <div className="lg:col-span-4">
                      <h4 className="font-bold text-lg text-gray-900">{education.degree}</h4>
                      <div className="text-gray-800 font-medium mb-2">
                        {education.institution}, {education.location}
                      </div>
                      <p className="text-gray-700">{education.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compétences */}
          {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
                {skillsSection.title}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {(skillsSection.content as Skill[]).map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mr-2"></div>
                    <span className="text-gray-800">{skill.name}</span>
                    <span className="text-xs text-gray-600 ml-1">
                      ({skill.level === 'beginner' && 'Débutant'}
                      {skill.level === 'intermediate' && 'Intermédiaire'}
                      {skill.level === 'advanced' && 'Avancé'}
                      {skill.level === 'expert' && 'Expert'})
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languagesSection && (languagesSection.content as Language[]).length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
                {languagesSection.title}
              </h3>
              <div className="space-y-2">
                {(languagesSection.content as Language[]).map((language) => (
                  <div key={language.id} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mr-2"></div>
                    <span className="text-gray-800">{language.name}</span>
                    <span className="text-xs text-gray-600 ml-1">
                      ({language.level === 'native' ? 'Langue maternelle' : language.level})
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projets */}
        {projectsSection && Array.isArray(projectsSection.content) && projectsSection.content.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              {projectsSection.title}
            </h3>
            <div className="space-y-4">
              {(projectsSection.content as Project[]).map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-sm text-gray-600">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-1">{project.description}</p>
                  {project.url && (
                    <a href={project.url} className="text-gray-600 hover:underline text-sm">
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