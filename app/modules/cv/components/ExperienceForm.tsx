'use client'

import { useState } from 'react'
import { useCV } from '../utils/cv-context'
import { Experience } from '../utils/types'
import { v4 as uuidv4 } from 'uuid'
import { Button, Card, CardContent, Input, Textarea, Label } from '@/app/components/ui'

export default function ExperienceForm() {
  const { cv, addSectionItem, updateSectionItem, removeSectionItem } = useCV()
  const experienceSection = cv.sections.find((section) => section.id === 'experience')
  const experiences = Array.isArray(experienceSection?.content) ? experienceSection.content as Experience[] : []

  const [newExperience, setNewExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const [editMode, setEditMode] = useState<string | null>(null)

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault()
    
    const experienceWithId = {
      ...newExperience,
      id: uuidv4(),
    }
    
    addSectionItem('experience', experienceWithId)
    
    setNewExperience({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const handleEditExperience = (experience: Experience) => {
    setEditMode(experience.id)
    setNewExperience(experience)
  }

  const handleUpdateExperience = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editMode) {
      updateSectionItem('experience', editMode, newExperience)
      setEditMode(null)
      setNewExperience({
        id: '',
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      })
    }
  }

  const handleDeleteExperience = (id: string) => {
    removeSectionItem('experience', id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNewExperience((prev) => ({
      ...prev,
      [name]: checked,
      endDate: checked ? null : prev.endDate,
    }))
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Expérience professionnelle</h3>

        {experiences.length > 0 && (
          <div className="space-y-4">
            {(experiences as Experience[]).map((experience) => (
              <div key={experience.id} className="p-3 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{experience.title}</h4>
                    <p className="text-sm text-gray-600">
                      {experience.company}, {experience.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
                    </p>
                    <p className="mt-2 text-sm">{experience.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditExperience(experience)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteExperience(experience.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={editMode ? handleUpdateExperience : handleAddExperience}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Poste</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={newExperience.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={newExperience.company}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={newExperience.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={newExperience.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={newExperience.current}
                onChange={handleCheckboxChange}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
              />
              <Label htmlFor="current" className="mb-0">
                Poste actuel
              </Label>
            </div>

            {!newExperience.current && (
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newExperience.endDate || ''}
                  onChange={handleChange}
                  required={!newExperience.current}
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newExperience.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit">
              {editMode ? 'Mettre à jour' : 'Ajouter'}
            </Button>

            {editMode && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(null)
                  setNewExperience({
                    id: '',
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  })
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
