'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useCoverLetter } from '../utils/cover-letter-context'
import { coverLetterTemplates } from '../utils/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
  Label,
  Button,
} from '@/app/components/ui'

export default function CoverLetterForm() {
  const { coverLetter, updateField, changeTone, changeLanguage, generateWithAI } = useCoverLetter()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value
    setSelectedTemplate(templateId)
    if (templateId) {
      const template = coverLetterTemplates.find((t) => t.id === templateId)
      if (template) {
        let content = template.template
        content = content.replace(/{{position}}/g, coverLetter.position || '[poste]')
        content = content.replace(/{{company}}/g, coverLetter.company || '[entreprise]')
        updateField('content', content)
      }
    }
  }

  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    try {
      await generateWithAI(aiPrompt)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Titre de la lettre</Label>
              <Input id="title" value={coverLetter.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={coverLetter.date} onChange={(e) => updateField('date', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input id="company" value={coverLetter.company} onChange={(e) => updateField('company', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="position">Poste</Label>
              <Input id="position" value={coverLetter.position} onChange={(e) => updateField('position', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="recipientName">Destinataire (nom)</Label>
              <Input id="recipientName" value={coverLetter.recipientName || ''} onChange={(e) => updateField('recipientName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="recipientPosition">Fonction du destinataire</Label>
              <Input id="recipientPosition" value={coverLetter.recipientPosition || ''} onChange={(e) => updateField('recipientPosition', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="companyAddress">Adresse de l&apos;entreprise</Label>
              <Input id="companyAddress" value={coverLetter.companyAddress || ''} onChange={(e) => updateField('companyAddress', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={coverLetter.city || ''} onChange={(e) => updateField('city', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Style et langue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="tone">Ton</Label>
              <Select
                id="tone"
                value={coverLetter.tone}
                onChange={(e) => changeTone(e.target.value as 'formal' | 'professional' | 'casual' | 'enthusiastic')}
              >
                <option value="formal">Formel</option>
                <option value="professional">Professionnel</option>
                <option value="casual">Décontracté</option>
                <option value="enthusiastic">Enthousiaste</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Langue</Label>
              <Select
                id="language"
                value={coverLetter.language}
                onChange={(e) => changeLanguage(e.target.value as 'french' | 'english' | 'spanish' | 'german')}
              >
                <option value="french">Français</option>
                <option value="english">Anglais</option>
                <option value="spanish">Espagnol</option>
                <option value="german">Allemand</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modèles et IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template">Choisir un modèle</Label>
            <Select id="template" value={selectedTemplate} onChange={handleTemplateChange}>
              <option value="">Sélectionner un modèle</option>
              {coverLetterTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </Select>
          </div>

          <form onSubmit={handleGenerateWithAI} className="space-y-2">
            <Label htmlFor="aiPrompt">Décrivez votre expérience et vos compétences</Label>
            <Textarea
              id="aiPrompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
              placeholder="Ex: J'ai 5 ans d'expérience en développement web, spécialisé en React et Node.js..."
            />
            <Button type="submit" loading={isGenerating} disabled={!aiPrompt.trim()}>
              {!isGenerating && <Sparkles className="h-4 w-4" />}
              {isGenerating ? 'Génération en cours...' : 'Générer avec IA'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenu de la lettre</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="content">Corps de la lettre</Label>
          <Textarea
            id="content"
            value={coverLetter.content}
            onChange={(e) => updateField('content', e.target.value)}
            rows={12}
            className="font-serif"
          />
        </CardContent>
      </Card>
    </div>
  )
}
