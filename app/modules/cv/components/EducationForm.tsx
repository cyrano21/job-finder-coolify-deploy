'use client'

import { useState } from 'react'
import { useCV } from '../utils/cv-context'
import { Education } from '../utils/types'
import { v4 as uuidv4 } from 'uuid'
import { Card, CardContent, Input, Textarea, Label, Button } from '@/app/components/ui'

const EMPTY: Education = {
  id: '',
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
}

export default function EducationForm() {
  const { cv, addSectionItem, updateSectionItem, removeSectionItem } = useCV()
  const educationSection = cv.sections.find((section) => section.id === 'education')
  const educations = Array.isArray(educationSection?.content) ? educationSection.content as Education[] : []

  const [newEducation, setNewEducation] = useState<Education>(EMPTY)
  const [editMode, setEditMode] = useState<string | null>(null)

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault()
    addSectionItem('education', { ...newEducation, id: uuidv4() })
    setNewEducation(EMPTY)
  }

  const handleEditEducation = (education: Education) => {
    setEditMode(education.id)
    setNewEducation(education)
  }

  const handleUpdateEducation = (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) {
      updateSectionItem('education', editMode, newEducation)
      setEditMode(null)
      setNewEducation(EMPTY)
    }
  }

  const handleDeleteEducation = (id: string) => removeSectionItem('education', id)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: checked, endDate: checked ? null : prev.endDate }))
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Formation</h3>

        {educations.length > 0 && (
          <div className="space-y-3">
            {educations.map((education) => (
              <div key={education.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{education.degree}</h4>
                    <p className="text-sm text-gray-600">
                      {education.institution}, {education.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {education.startDate} - {education.current ? 'En cours' : education.endDate}
                    </p>
                    {education.description && (
                      <p className="mt-2 text-sm text-gray-700">{education.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-3 text-sm">
                    <button onClick={() => handleEditEducation(education)} className="text-indigo-600 hover:text-indigo-800">
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteEducation(education.id)} className="text-red-600 hover:text-red-800">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={editMode ? handleUpdateEducation : handleAddEducation}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="degree">Diplôme / Formation</Label>
              <Input id="degree" name="degree" value={newEducation.degree} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="institution">Établissement</Label>
              <Input id="institution" name="institution" value={newEducation.institution} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" name="location" value={newEducation.location} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" name="startDate" type="date" value={newEducation.startDate} onChange={handleChange} required />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={newEducation.current}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
              />
              <Label htmlFor="current" className="mb-0">Formation en cours</Label>
            </div>
            {!newEducation.current && (
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input id="endDate" name="endDate" type="date" value={newEducation.endDate || ''} onChange={handleChange} required={!newEducation.current} />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={newEducation.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="mt-4 flex gap-2">
            <Button type="submit">{editMode ? 'Mettre à jour' : 'Ajouter'}</Button>
            {editMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditMode(null)
                  setNewEducation(EMPTY)
                }}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
