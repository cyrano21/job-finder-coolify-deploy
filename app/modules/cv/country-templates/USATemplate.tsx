'use client'

import { CV, Experience, Education, Skill, Language, Summary, Project, Certification } from '../utils/types'
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'

export default function USATemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  const projectsSection = sections.find(section => section.id === 'projects')
  const certificationsSection = sections.find(section => section.id === 'certifications')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8">
      {/* En-tête américain moderne */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-2xl text-gray-700 mt-2">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
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
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-600" />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
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

      <div className="space-y-8">
        {/* Résumé professionnel */}
        {summarySection && (summarySection.content as Summary).content && (
          <section>
            <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
              {summarySection.title}
            </h3>
            <p className="text-gray-700">
              {(summarySection.content as Summary).content}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Expérience professionnelle */}
            {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                  {experienceSection.title}
                </h3>
                <div className="space-y-6">
                  {(experienceSection.content as Experience[]).map((experience) => (
                    <div key={experience.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-blue-600 before:rounded-full">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-xl font-semibold">{experience.title}</h4>
                        <span className="text-gray-600">
                          {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                        </span>
                      </div>
                      <div className="text-lg text-gray-800 font-medium">
                        {experience.company}, {experience.location}
                      </div>
                      <ul className="mt-2 space-y-1">
                        {experience.description.split('\n').map((line, index) => (
                          line.trim() && <li key={index} className="flex">
                            <span className="mr-2">•</span>
                            <span className="text-gray-700">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projets */}
            {projectsSection && Array.isArray(projectsSection.content) && (projectsSection.content as Project[]).length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                  {projectsSection.title}
                </h3>
                <div className="space-y-4">
                  {(projectsSection.content as Project[]).map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between">
                        <h4 className="text-xl font-semibold">{project.title}</h4>
                        {(project.startDate || project.endDate) && (
                          <span className="text-gray-600">
                            {project.startDate} {project.endDate && `- ${project.endDate}`}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-2">{project.description}</p>
                      {project.url && (
                        <a href={project.url} className="text-blue-600 hover:underline mt-1 inline-block">
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Formation */}
            {educationSection && (educationSection.content as Education[]).length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                  {educationSection.title}
                </h3>
                <div className="space-y-4">
                  {(educationSection.content as Education[]).map((education) => (
                    <div key={education.id}>
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold">{education.degree}</h4>
                        <span className="text-gray-600">
                          {education.startDate} - {education.current ? 'Present' : education.endDate}
                        </span>
                      </div>
                      <div className="text-gray-800">
                        {education.institution}, {education.location}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{education.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certificationsSection && Array.isArray(certificationsSection.content) && (certificationsSection.content as Certification[]).length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                  {certificationsSection.title}
                </h3>
                <div className="space-y-3">
                  {(certificationsSection.content as Certification[]).map((cert) => (
                    <div key={cert.id}>
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-sm text-gray-600">{cert.issuer}, {cert.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Compétences */}
            {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
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
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                  {languagesSection.title}
                </h3>
                <div className="space-y-2">
                  {(languagesSection.content as Language[]).map((language) => (
                    <div key={language.id} className="flex justify-between">
                      <span className="text-gray-800">{language.name}</span>
                      <span className="text-sm text-gray-600">
                        {language.level === 'native' ? 'Native' : language.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}