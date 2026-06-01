'use client'

import { useState } from 'react'
import { useCV } from '../utils/cv-context'
import { Skill } from '../utils/types'
import { v4 as uuidv4 } from 'uuid'
import { Button, Card, CardContent, Input, Select, Label } from '@/app/components/ui'

export default function SkillsForm() {
  const { cv, addSectionItem, updateSectionItem, removeSectionItem } = useCV()
  const skillsSection = cv.sections.find((section) => section.id === 'skills')
  const skills = Array.isArray(skillsSection?.content) ? skillsSection.content as Skill[] : []

  const [newSkill, setNewSkill] = useState<Skill>({
    id: '',
    name: '',
    level: 'intermediate',
  })

  const [editMode, setEditMode] = useState<string | null>(null)

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    
    const skillWithId = {
      ...newSkill,
      id: uuidv4(),
    }
    
    addSectionItem('skills', skillWithId)
    
    setNewSkill({
      id: '',
      name: '',
      level: 'intermediate',
    })
  }

  const handleEditSkill = (skill: Skill) => {
    setEditMode(skill.id)
    setNewSkill(skill)
  }

  const handleUpdateSkill = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editMode) {
      updateSectionItem('skills', editMode, newSkill)
      setEditMode(null)
      setNewSkill({
        id: '',
        name: '',
        level: 'intermediate',
      })
    }
  }

  const handleDeleteSkill = (id: string) => {
    removeSectionItem('skills', id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewSkill((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Compétences</h3>

        {skills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(skills as Skill[]).map((skill) => (
              <div key={skill.id} className="p-3 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <p className="text-sm text-gray-600">
                      Niveau: {skill.level === 'beginner' ? 'Débutant' : 
                              skill.level === 'intermediate' ? 'Intermédiaire' : 
                              skill.level === 'advanced' ? 'Avancé' : 'Expert'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSkill(skill)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={editMode ? handleUpdateSkill : handleAddSkill} className="space-y-4">
          <div>
            <Label htmlFor="name">Compétence</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={newSkill.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="level">Niveau</Label>
            <Select
              id="level"
              name="level"
              value={newSkill.level}
              onChange={handleChange}
              required
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="expert">Expert</option>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              {editMode ? 'Mettre à jour' : 'Ajouter'}
            </Button>

            {editMode && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(null)
                  setNewSkill({
                    id: '',
                    name: '',
                    level: 'intermediate',
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
