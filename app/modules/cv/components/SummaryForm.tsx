'use client'

import { useCV } from '../utils/cv-context'
import { Summary } from '../utils/types'
import { Card, CardContent, Textarea, Label } from '@/app/components/ui'

export default function SummaryForm() {
  const { cv, updateSection } = useCV()
  const summarySection = cv.sections.find((section) => section.id === 'summary')
  const summary = summarySection?.content as Summary || { content: '' }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    updateSection('summary', { content: value })
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Résumé professionnel</h3>

        <div>
          <Label htmlFor="summary">Présentez-vous en quelques lignes</Label>
          <Textarea
            id="summary"
            value={summary.content}
            onChange={handleChange}
            rows={6}
            placeholder="Résumez votre parcours, vos compétences clés et vos objectifs professionnels..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
