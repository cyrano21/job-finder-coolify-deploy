'use client'

import { CV, Experience, Education, Skill, Language, Summary } from '../utils/types'
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'

export default function UKTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const profileSection = sections.find(section => section.id === 'profile')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8">
      {/* UK Header with contact info at top */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-gray-700 mt-1">{personalInfo.title}</h2>
          </div>
          <div className="text-right text-sm">
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {(personalInfo.city || personalInfo.postalCode) && (
              <div>{personalInfo.city}, {personalInfo.postalCode}</div>
            )}
            <div>{personalInfo.country}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm justify-end">
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
        </div>
      </header>

      <div className="space-y-6">
        {/* Profile */}
        {profileSection && (profileSection.content as Summary).content && (
          <section>
            <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
              {profileSection.title}
            </h3>
            <p className="text-gray-700">
              {(profileSection.content as Summary).content}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Employment History */}
            {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                  {experienceSection.title}
                </h3>
                <div className="space-y-4">
                  {(experienceSection.content as Experience[]).map((experience) => (
                    <div key={experience.id} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-800 before:rounded-full">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold">{experience.title}</h4>
                        <span className="text-sm text-gray-600">
                          {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                        </span>
                      </div>
                      <div className="text-gray-800 font-medium">
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

            {/* Education and Qualifications */}
            {educationSection && (educationSection.content as Education[]).length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                  {educationSection.title}
                </h3>
                <div className="space-y-4">
                  {(educationSection.content as Education[]).map((education) => (
                    <div key={education.id} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-800 before:rounded-full">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold">{education.degree}</h4>
                        <span className="text-sm text-gray-600">
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
          </div>

          <div className="space-y-6">
            {/* Key Skills */}
            {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                  {skillsSection.title}
                </h3>
                <div className="space-y-2">
                  {(skillsSection.content as Skill[]).map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languagesSection && (languagesSection.content as Language[]).length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                  {languagesSection.title}
                </h3>
                <div className="space-y-2">
                  {(languagesSection.content as Language[]).map((language) => (
                    <div key={language.id}>
                      <div className="flex justify-between">
                        <span className="text-gray-800">{language.name}</span>
                        <span className="text-sm text-gray-600">
                          {language.level === 'native' ? 'Native' : language.level}
                        </span>
                      </div>
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