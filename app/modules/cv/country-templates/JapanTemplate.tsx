'use client'

import { CV, Experience, Education, Skill, Language, Summary } from '../utils/types'
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react'

export default function JapanTemplate({ cv }: { cv: CV }) {
  const { personalInfo, sections } = cv
  
  const profileSection = sections.find(section => section.id === 'profile')
  const educationSection = sections.find(section => section.id === 'education')
  const experienceSection = sections.find(section => section.id === 'experience')
  const skillsSection = sections.find(section => section.id === 'skills')
  
  return (
    <div className="bg-white font-sans w-full min-h-full p-8" style={{ fontFamily: 'Meiryo, MS Gothic, sans-serif' }}>
      {/* Japanese CV Header */}
      <header className="border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          履歴書
        </h1>
        
        <div className="flex justify-between items-start">
          <div className="w-32 h-40 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center">証明写真<br/>(縦4cm×横3cm)</span>
          </div>
          
          <div className="flex-grow ml-6">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex">
                <span className="font-medium mr-4 w-24">氏名:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">
                  {personalInfo.lastName} {personalInfo.firstName}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium mr-4 w-24">生年月日:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">
                  1990年1月1日 (満XX歳)
                </span>
              </div>
              <div className="flex">
                <span className="font-medium mr-4 w-24">性別:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">男</span>
              </div>
              <div className="flex">
                <span className="font-medium mr-4 w-24">住所:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">
                  {personalInfo.address}, {personalInfo.city}, {personalInfo.postalCode}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium mr-4 w-24">電話:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">
                  {personalInfo.phone}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium mr-4 w-24">メール:</span>
                <span className="border-b border-gray-400 flex-grow pb-1">
                  {personalInfo.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {/* プロフィール */}
        {profileSection && (profileSection.content as Summary).content && (
          <section>
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center mr-2 text-sm">
                1
              </div>
              <h3 className="text-xl font-semibold pb-1 border-b-2 border-gray-800 flex-grow">
                {profileSection.title}
              </h3>
            </div>
            <div className="ml-8 bg-gray-50 p-4 rounded">
              <p className="text-gray-700">
                {(profileSection.content as Summary).content}
              </p>
            </div>
          </section>
        )}

        {/* 学歴 */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <section>
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center mr-2 text-sm">
                2
              </div>
              <h3 className="text-xl font-semibold pb-1 border-b-2 border-gray-800 flex-grow">
                {educationSection.title}
              </h3>
            </div>
            <div className="ml-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">年月</th>
                    <th className="border border-gray-300 p-2 text-left">学歴</th>
                    <th className="border border-gray-300 p-2 text-left">学位</th>
                  </tr>
                </thead>
                <tbody>
                  {(educationSection.content as Education[]).map((education, index) => (
                    <tr key={education.id}>
                      <td className="border border-gray-300 p-2">
                        {education.startDate} - {education.current ? '現在' : education.endDate}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {education.institution}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {education.degree}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 職歴 */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <section>
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center mr-2 text-sm">
                3
              </div>
              <h3 className="text-xl font-semibold pb-1 border-b-2 border-gray-800 flex-grow">
                {experienceSection.title}
              </h3>
            </div>
            <div className="ml-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">年月</th>
                    <th className="border border-gray-300 p-2 text-left">会社名</th>
                    <th className="border border-gray-300 p-2 text-left">職位</th>
                    <th className="border border-gray-300 p-2 text-left">業務内容</th>
                  </tr>
                </thead>
                <tbody>
                  {(experienceSection.content as Experience[]).map((experience, index) => (
                    <tr key={experience.id}>
                      <td className="border border-gray-300 p-2">
                        {experience.startDate} - {experience.current ? '現在' : experience.endDate}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {experience.company}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {experience.title}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {experience.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* スキル */}
        {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
          <section>
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center mr-2 text-sm">
                4
              </div>
              <h3 className="text-xl font-semibold pb-1 border-b-2 border-gray-800 flex-grow">
                {skillsSection.title}
              </h3>
            </div>
            <div className="ml-8">
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

        {/* 日付と署名欄 */}
        <div className="mt-12 text-right">
          <p className="mb-2">{new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日</p>
          <div className="flex justify-end items-center gap-8 mt-8">
            <div className="text-center">
              <p className="mb-12">以上</p>
              <p>署名:</p>
              <div className="w-32 h-12 border-b border-gray-400 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}