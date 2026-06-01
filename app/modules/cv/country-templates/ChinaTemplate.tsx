'use client'

import { CV, Experience, Education, Skill, Summary } from '../utils/types'
import { Mail, Phone, MapPin, Calendar, User, FileText } from 'lucide-react'

export default function ChinaTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const basicSection = sections.find(section => section.id === 'basic')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8" style={{ fontFamily: 'SimSun, Songti SC, serif' }}>
      {/* En-tête chinois avec photo */}
      <header className="border-b border-gray-300 pb-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Photo placeholder (important in Chinese CVs) */}
          <div className="w-24 h-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center">照片<br/>(2寸免冠)</span>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-center mb-4">
              个人简历
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">姓名:</span>
                <span>{personalInfo.firstName} {personalInfo.lastName}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">邮箱:</span>
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">电话:</span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">地址:</span>
                <span>{personalInfo.address}, {personalInfo.city}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">出生日期:</span>
                <span>1990年1月1日</span>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="mr-2 text-gray-600 flex-shrink-0" />
                <span className="font-medium mr-2">政治面貌:</span>
                <span>群众</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* 基本信息 */}
        {basicSection && (basicSection.content as Summary).content && (
          <section>
            <h3 className="text-xl font-semibold mb-3 pb-1 border-b-2 border-gray-800">
              {basicSection.title}
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-700">
                {(basicSection.content as Summary).content}
              </p>
            </div>
          </section>
        )}

        {/* 工作经历 */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 pb-1 border-b-2 border-gray-800">
              {experienceSection.title}
            </h3>
            <div className="space-y-4 ml-4">
              {(experienceSection.content as Experience[]).map((experience) => (
                <div key={experience.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-800 before:rounded-full">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{experience.company} - {experience.title}</h4>
                    <span className="text-gray-600">
                      {experience.startDate} 至 {experience.current ? '至今' : experience.endDate}
                    </span>
                  </div>
                  <div className="text-gray-800 mb-2">
                    {experience.location}
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-1">工作内容：</div>
                    <p>{experience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 教育背景 */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 pb-1 border-b-2 border-gray-800">
              {educationSection.title}
            </h3>
            <div className="space-y-4 ml-4">
              {(educationSection.content as Education[]).map((education) => (
                <div key={education.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-800 before:rounded-full">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{education.institution} - {education.degree}</h4>
                    <span className="text-gray-600">
                      {education.startDate} 至 {education.current ? '至今' : education.endDate}
                    </span>
                  </div>
                  <div className="text-gray-800 mb-2">
                    {education.location}
                  </div>
                  <div className="text-sm text-gray-700">
                    {education.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 技能 */}
        {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 pb-1 border-b-2 border-gray-800">
              {skillsSection.title}
            </h3>
            <div className="ml-4">
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
            </div>
          </section>
        )}

        {/* Footer with signature area */}
        <div className="mt-12 text-right">
          <p className="mb-12">本人确认以上信息真实有效。</p>
          <div className="flex justify-end items-center gap-8">
            <div>
              <p>签名：</p>
              <div className="w-32 h-12 border-b border-gray-400"></div>
            </div>
            <div>
              <p>日期：</p>
              <div className="w-32 h-12 border-b border-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}