'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useOrientation } from '../utils/orientation-context'
import type { ResourceCategory } from '../utils/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui'
import { cn } from '@/app/lib/utils'

const CATEGORIES: { value: ResourceCategory | ''; label: string }[] = [
  { value: '', label: 'Tout' },
  { value: 'revenu', label: 'Revenu' },
  { value: 'formation', label: 'Formation' },
  { value: 'accompagnement', label: 'Accompagnement' },
  { value: 'mobilite', label: 'Mobilité' },
]

export default function ResourcesList() {
  const { resources, loadResources } = useOrientation()
  const [active, setActive] = useState<ResourceCategory | ''>('')

  useEffect(() => {
    loadResources(active || undefined)
  }, [active, loadResources])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositifs &amp; ressources</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtres — scroll horizontal sur mobile */}
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActive(c.value)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all touch-target',
                active === c.value
                  ? 'bg-brand-gradient text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {resources.map((r, i) => (
            <div
              key={r.id ?? i}
              className="rounded-xl border border-gray-100 p-4 transition-shadow hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                {r.source && (
                  <span className="shrink-0 text-xs text-gray-400">{r.source}</span>
                )}
              </div>
              {r.summary && (
                <p className="mt-1 text-sm text-gray-600">{r.summary}</p>
              )}
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  En savoir plus
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
          {resources.length === 0 && (
            <p className="text-sm text-gray-500">Aucune ressource pour ce filtre.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
