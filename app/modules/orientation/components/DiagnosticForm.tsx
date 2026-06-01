'use client'

import { useState } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'
import { useOrientation } from '../utils/orientation-context'
import type { Urgency, Appetence, Motivation } from '../utils/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Select,
  Label,
  Button,
  Badge,
} from '@/app/components/ui'
import { cn } from '@/app/lib/utils'

const APPETENCES: { value: Appetence; label: string }[] = [
  { value: 'manuel', label: 'Manuel' },
  { value: 'numerique', label: 'Numérique' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'technique', label: 'Technique' },
  { value: 'social', label: 'Social' },
]

const MOTIVATIONS: { value: Motivation; label: string }[] = [
  { value: 'alternance', label: 'Alternance' },
  { value: 'formation-courte', label: 'Formation courte' },
  { value: 'interim', label: 'Intérim' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'emploi-direct', label: 'Emploi direct' },
]

export default function DiagnosticForm() {
  const { profile, updateProfile, runDiagnostic, loading, error } =
    useOrientation()
  const [interestInput, setInterestInput] = useState('')
  const [constraintInput, setConstraintInput] = useState('')

  const toggleAppetence = (v: Appetence) => {
    const current = profile.appetences ?? []
    updateProfile({
      appetences: current.includes(v)
        ? current.filter((a) => a !== v)
        : [...current, v],
    })
  }

  const toggleMotivation = (v: Motivation) => {
    const current = profile.motivations ?? []
    updateProfile({
      motivations: current.includes(v)
        ? current.filter((m) => m !== v)
        : [...current, v],
    })
  }

  const addInterest = () => {
    const v = interestInput.trim()
    if (!v) return
    updateProfile({ interests: [...profile.interests, v] })
    setInterestInput('')
  }

  const addConstraint = () => {
    const v = constraintInput.trim()
    if (!v) return
    updateProfile({ constraints: [...profile.constraints, v] })
    setConstraintInput('')
  }

  const removeInterest = (i: number) =>
    updateProfile({ interests: profile.interests.filter((_, idx) => idx !== i) })
  const removeConstraint = (i: number) =>
    updateProfile({
      constraints: profile.constraints.filter((_, idx) => idx !== i),
    })

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all touch-target',
        active
          ? 'border-transparent bg-brand-gradient text-white shadow-soft'
          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
      )}
    >
      {children}
    </button>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ta situation</CardTitle>
        <CardDescription>
          Quelques infos suffisent. Plus c&apos;est précis, plus le plan est utile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              inputMode="numeric"
              value={profile.age ?? ''}
              onChange={(e) =>
                updateProfile({ age: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="19"
            />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={profile.city ?? ''}
              onChange={(e) => updateProfile({ city: e.target.value })}
              placeholder="Lyon"
            />
          </div>
          <div>
            <Label htmlFor="education">Niveau d&apos;études</Label>
            <Input
              id="education"
              value={profile.education ?? ''}
              onChange={(e) => updateProfile({ education: e.target.value })}
              placeholder="Bac non obtenu, CAP, ..."
            />
          </div>
          <div>
            <Label htmlFor="lastJob">Dernier emploi</Label>
            <Input
              id="lastJob"
              value={profile.lastJob ?? ''}
              onChange={(e) => updateProfile({ lastJob: e.target.value })}
              placeholder="Aucun, intérim, ..."
            />
          </div>
          <div>
            <Label htmlFor="savings">Épargne</Label>
            <Select
              id="savings"
              value={profile.savingsBand ?? ''}
              onChange={(e) => updateProfile({ savingsBand: e.target.value })}
            >
              <option value="">Non précisé</option>
              <option value="0-500">Moins de 500 €</option>
              <option value="500-2000">500 à 2000 €</option>
              <option value="2000+">Plus de 2000 €</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="urgency">Urgence de revenu</Label>
            <Select
              id="urgency"
              value={profile.urgency ?? ''}
              onChange={(e) =>
                updateProfile({ urgency: (e.target.value || undefined) as Urgency })
              }
            >
              <option value="">Non précisé</option>
              <option value="high">Élevée (besoin d&apos;un revenu vite)</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="charges">Charges / dettes mensuelles</Label>
            <Input
              id="charges"
              value={profile.charges ?? ''}
              onChange={(e) => updateProfile({ charges: e.target.value })}
              placeholder="Loyer, crédit, ..."
            />
          </div>
          <div>
            <Label htmlFor="license">Permis de conduire</Label>
            <Select
              id="license"
              value={
                profile.hasLicense === undefined
                  ? ''
                  : profile.hasLicense
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                updateProfile({
                  hasLicense:
                    e.target.value === '' ? undefined : e.target.value === 'yes',
                })
              }
            >
              <option value="">Non précisé</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="mobility">Mobilité</Label>
            <Input
              id="mobility"
              value={profile.mobility ?? ''}
              onChange={(e) => updateProfile({ mobility: e.target.value })}
              placeholder="Transports en commun, 20 km, ..."
            />
          </div>
        </div>

        {/* Appétences */}
        <div>
          <Label>Vers quoi tu te sens attiré ?</Label>
          <div className="flex flex-wrap gap-2">
            {APPETENCES.map((a) => (
              <Chip
                key={a.value}
                active={(profile.appetences ?? []).includes(a.value)}
                onClick={() => toggleAppetence(a.value)}
              >
                {a.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Motivations */}
        <div>
          <Label>Ce que tu es prêt à envisager</Label>
          <div className="flex flex-wrap gap-2">
            {MOTIVATIONS.map((m) => (
              <Chip
                key={m.value}
                active={(profile.motivations ?? []).includes(m.value)}
                onClick={() => toggleMotivation(m.value)}
              >
                {m.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Centres d'intérêt */}
        <div>
          <Label htmlFor="interest">Centres d&apos;intérêt / pistes envisagées</Label>
          <div className="flex gap-2">
            <Input
              id="interest"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Cuisine, informatique, ..."
            />
            <Button type="button" variant="secondary" size="icon" onClick={addInterest} aria-label="Ajouter un intérêt">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {profile.interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.interests.map((it, i) => (
                <Badge key={i} variant="brand" className="pr-1">
                  {it}
                  <button onClick={() => removeInterest(i)} className="rounded-full p-0.5 hover:bg-indigo-200" aria-label="Retirer">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Contraintes */}
        <div>
          <Label htmlFor="constraint">Contraintes</Label>
          <div className="flex gap-2">
            <Input
              id="constraint"
              value={constraintInput}
              onChange={(e) => setConstraintInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addConstraint())
              }
              placeholder="Pas de permis, garde d'enfant, ..."
            />
            <Button type="button" variant="secondary" size="icon" onClick={addConstraint} aria-label="Ajouter une contrainte">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {profile.constraints.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.constraints.map((c, i) => (
                <Badge key={i} variant="warning" className="pr-1">
                  {c}
                  <button onClick={() => removeConstraint(i)} className="rounded-full p-0.5 hover:bg-amber-200" aria-label="Retirer">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <Button onClick={runDiagnostic} loading={loading} block size="lg">
          {!loading && <Sparkles className="h-4 w-4" />}
          {loading ? 'Analyse en cours…' : 'Lancer mon diagnostic'}
        </Button>
      </CardContent>
    </Card>
  )
}
