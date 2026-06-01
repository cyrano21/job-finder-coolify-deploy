'use client'

import { CV, Experience, Education, Skill, Language, Summary, Project } from '../utils/types'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export default function ModernTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  const projectsSection = sections.find(section => section.id === 'projects')
  
  return (
    <div className="bg-white font-sans w-full min-h-full">
      {/* En-tête moderne avec dégradé */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl font-light mb-4">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap gap-4 mt-4">
          {personalInfo.email && (
            <div className="flex items-center overflow-hidden">
              <Mail size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm overflow-visible break-all">{personalInfo.email}</span>
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
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <div className="md:col-span-2 space-y-6">
          {/* Résumé */}
          {summarySection && (summarySection.content as Summary).content && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {summarySection.title}
              </h3>
              <p className="text-gray-700">
                {(summarySection.content as Summary).content}
              </p>
            </section>
          )}

          {/* Expérience */}
          {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {experienceSection.title}
              </h3>
              <div className="space-y-4">
                {(experienceSection.content as Experience[]).map((experience) => (
                  <div key={experience.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-semibold">{experience.title}</h4>
                      <span className="text-sm text-gray-600">
                        {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
                      </span>
                    </div>
                    <div className="text-gray-800 mb-1">
                      {experience.company}, {experience.location}
                    </div>
                    <p className="text-sm text-gray-600">{experience.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Éducation */}
          {educationSection && (educationSection.content as Education[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {educationSection.title}
              </h3>
              <div className="space-y-4">
                {(educationSection.content as Education[]).map((education) => (
                  <div key={education.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-semibold">{education.degree}</h4>
                      <span className="text-sm text-gray-600">
                        {education.startDate} - {education.current ? 'Présent' : education.endDate}
                      </span>
                    </div>
                    <div className="text-gray-800 mb-1">
                      {education.institution}, {education.location}
                    </div>
                    <p className="text-sm text-gray-600">{education.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projets */}
          {projectsSection && Array.isArray(projectsSection.content) && (projectsSection.content as Project[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {projectsSection.title}
              </h3>
              <div className="space-y-4">
                {(Array.isArray(projectsSection.content) ? (projectsSection.content as Project[]) : []).map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-semibold">{project.title}</h4>
                      {(project.startDate || project.endDate) && (
                        <span className="text-sm text-gray-600">
                          {project.startDate} {project.endDate && `- ${project.endDate}`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    {project.url && (
                      <a href={project.url} className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        Voir le projet
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="md:col-span-1 space-y-6 bg-blue-50 p-6 rounded-lg">
          {/* Compétences */}
          {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {skillsSection.title}
              </h3>
              <div className="space-y-3">
                {(skillsSection.content as Skill[]).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800">{skill.name}</span>
                      <span className="text-sm text-gray-600">
                        {skill.level === 'beginner' && 'Débutant'}
                        {skill.level === 'intermediate' && 'Intermédiaire'}
                        {skill.level === 'advanced' && 'Avancé'}
                        {skill.level === 'expert' && 'Expert'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${skill.level === 'beginner' ? 25 :
                                  skill.level === 'intermediate' ? 50 :
                                  skill.level === 'advanced' ? 75 :
                                  skill.level === 'expert' ? 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languagesSection && (languagesSection.content as Language[]).length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
                {languagesSection.title}
              </h3>
              <div className="space-y-3">
                {(languagesSection.content as Language[]).map((language) => (
                  <div key={language.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800">{language.name}</span>
                      <span className="text-sm text-gray-600">
                        {language.level === 'native' ? 'Langue maternelle' : language.level}
                      </span>
                    </div>
                    {language.level !== 'native' && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${language.level === 'A1' ? 16 :
                                    language.level === 'A2' ? 32 :
                                    language.level === 'B1' ? 50 :
                                    language.level === 'B2' ? 67 :
                                    language.level === 'C1' ? 84 :
                                    language.level === 'C2' ? 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    )}
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
