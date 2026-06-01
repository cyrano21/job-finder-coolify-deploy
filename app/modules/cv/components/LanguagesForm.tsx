'use client'

import { useState } from 'react'
import { useCV } from '../utils/cv-context'
import { Language } from '../utils/types'
import { v4 as uuidv4 } from 'uuid'
import { Button, Card, CardContent, Input, Select, Label } from '@/app/components/ui'

export default function LanguagesForm() {
  const { cv, addSectionItem, updateSectionItem, removeSectionItem } = useCV()
  const languagesSection = cv.sections.find((section) => section.id === 'languages')
  const languages = Array.isArray(languagesSection?.content) ? languagesSection.content as Language[] : []

  const [newLanguage, setNewLanguage] = useState<Language>({
    id: '',
    name: '',
    level: 'B2',
  })

  const [editMode, setEditMode] = useState<string | null>(null)

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault()
    
    const languageWithId = {
      ...newLanguage,
      id: uuidv4(),
    }
    
    addSectionItem('languages', languageWithId)
    
    setNewLanguage({
      id: '',
      name: '',
      level: 'B2',
    })
  }

  const handleEditLanguage = (language: Language) => {
    setEditMode(language.id)
    setNewLanguage(language)
  }

  const handleUpdateLanguage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editMode) {
      updateSectionItem('languages', editMode, newLanguage)
      setEditMode(null)
      setNewLanguage({
        id: '',
        name: '',
        level: 'B2',
      })
    }
  }

  const handleDeleteLanguage = (id: string) => {
    removeSectionItem('languages', id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewLanguage((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Langues</h3>

        {languages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(languages as Language[]).map((language) => (
              <div key={language.id} className="p-3 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{language.name}</h4>
                    <p className="text-sm text-gray-600">
                      Niveau: {language.level === 'native' ? 'Langue maternelle' : language.level}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLanguage(language)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteLanguage(language.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={editMode ? handleUpdateLanguage : handleAddLanguage} className="space-y-4">
          <div>
            <Label htmlFor="name">Langue</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={newLanguage.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="level">Niveau</Label>
            <Select
              id="level"
              name="level"
              value={newLanguage.level}
              onChange={handleChange}
              required
            >
              <option value="A1">A1 (Débutant)</option>
              <option value="A2">A2 (Élémentaire)</option>
              <option value="B1">B1 (Intermédiaire)</option>
              <option value="B2">B2 (Intermédiaire avancé)</option>
              <option value="C1">C1 (Avancé)</option>
              <option value="C2">C2 (Maîtrise)</option>
              <option value="native">Langue maternelle</option>
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
                  setNewLanguage({
                    id: '',
                    name: '',
                    level: 'B2',
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
