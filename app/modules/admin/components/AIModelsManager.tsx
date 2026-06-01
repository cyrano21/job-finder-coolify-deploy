'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, Button, Input, Select, Label, Badge } from '@/app/components/ui'
import type { BadgeProps } from '@/app/components/ui/Badge'

interface AIModel {
  id: string
  label: string
  provider: string
  model: string
  type: 'free' | 'paid' | 'local'
  baseUrl: string | null
  apiKeyEnv: string | null
  enabled: boolean
  isDefault: boolean
  keyConfigured: boolean
}

interface CatalogEntry {
  provider: string
  label: string
  defaultModel: string
  apiKeyEnv: string
  requiresKey: boolean
  keyConfigured: boolean
}

const TYPE_BADGE: Record<string, BadgeProps['variant']> = {
  free: 'success',
  paid: 'info',
  local: 'purple',
}

export default function AIModelsManager() {
  const [models, setModels] = useState<AIModel[]>([])
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Champs du formulaire d'ajout
  const [provider, setProvider] = useState('groq')
  const [label, setLabel] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState<'free' | 'paid' | 'local'>('paid')
  const [baseUrl, setBaseUrl] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ai-models')
      if (res.status === 403) {
        setError('Accès réservé aux administrateurs.')
        return
      }
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json()
      setModels(data.models ?? [])
      setCatalog(data.catalog ?? [])
      setError(null)
    } catch (e) {
      console.error(e)
      setError('Impossible de charger les modèles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const selectedCatalog = catalog.find((c) => c.provider === provider)
  const isLocal = provider === 'local'

  const handleProviderChange = (p: string) => {
    setProvider(p)
    const c = catalog.find((x) => x.provider === p)
    if (c && !model) setModel(c.defaultModel)
    if (p === 'local') setType('local')
  }

  const handleCreate = async () => {
    if (!label.trim() || !model.trim()) {
      setError('Label et modèle sont requis.')
      return
    }
    try {
      const res = await fetch('/api/admin/ai-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label,
          provider,
          model,
          type,
          baseUrl: isLocal ? baseUrl : undefined,
        }),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setLabel('')
      setModel('')
      setBaseUrl('')
      setShowForm(false)
      await load()
    } catch (e) {
      console.error(e)
      setError("Impossible de créer le modèle.")
    }
  }

  const patch = async (id: string, body: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/ai-models/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      await load()
    } catch (e) {
      console.error(e)
      setError('Action impossible.')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce modèle ?')) return
    try {
      const res = await fetch(`/api/admin/ai-models/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      await load()
    } catch (e) {
      console.error(e)
      setError('Suppression impossible.')
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Chargement des modèles…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Modèles IA</h2>
          <p className="text-sm text-gray-500">
            Choisis le modèle par défaut, active/désactive, ajoute des modèles
            payants, gratuits ou locaux.
          </p>
        </div>
        <Button
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Fermer' : 'Ajouter un modèle'}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {/* Formulaire d'ajout */}
      {showForm && (
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Fournisseur</Label>
              <Select value={provider} onChange={(e) => handleProviderChange(e.target.value)}>
                {catalog.map((c) => (
                  <option key={c.provider} value={c.provider}>
                    {c.label}
                    {c.requiresKey ? (c.keyConfigured ? ' ✓ clé' : ' ⚠ pas de clé') : ''}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as 'free' | 'paid' | 'local')}
              >
                <option value="paid">Payant</option>
                <option value="free">Gratuit</option>
                <option value="local">Local</option>
              </Select>
            </div>
            <div>
              <Label>Nom affiché</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: GPT-4o mini"
              />
            </div>
            <div>
              <Label>Identifiant du modèle</Label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={selectedCatalog?.defaultModel || 'ex: gpt-4o-mini'}
              />
            </div>
            {isLocal && (
              <div className="sm:col-span-2">
                <Label>URL locale (Ollama / LM Studio)</Label>
                <Input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434/v1"
                />
              </div>
            )}
            {!isLocal && selectedCatalog && !selectedCatalog.keyConfigured && (
              <p className="sm:col-span-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                ⚠ La clé <code>{selectedCatalog.apiKeyEnv}</code> n&apos;est pas
                définie dans l&apos;environnement. Ajoute-la dans <code>.env</code>
                pour que ce fournisseur fonctionne.
              </p>
            )}
            <div className="sm:col-span-2">
              <Button onClick={handleCreate}>Créer le modèle</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des modèles */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Modèle</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Fournisseur</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Clé</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {models.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Aucun modèle. Ajoute-en un, ou l&apos;agent utilisera la config
                    par défaut de l&apos;environnement.
                  </td>
                </tr>
              )}
              {models.map((m) => (
                <tr key={m.id} className={m.isDefault ? 'bg-indigo-50/50' : ''}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{m.label}</div>
                    <div className="text-xs text-gray-500">{m.model}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.provider}</td>
                  <td className="px-4 py-3">
                    <Badge variant={TYPE_BADGE[m.type]}>{m.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {m.type === 'local' ? (
                      <span className="text-gray-400">—</span>
                    ) : m.keyConfigured ? (
                      <span className="text-emerald-600">✓</span>
                    ) : (
                      <span className="text-red-600" title={m.apiKeyEnv || ''}>✗ manquante</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {m.isDefault ? (
                      <Badge variant="brand">Par défaut</Badge>
                    ) : m.enabled ? (
                      <span className="text-sm text-emerald-600">Actif</span>
                    ) : (
                      <span className="text-sm text-gray-400">Désactivé</span>
                    )}
                  </td>
                  <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right text-sm">
                    {!m.isDefault && (
                      <button
                        onClick={() => patch(m.id, { isDefault: true })}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Définir par défaut
                      </button>
                    )}
                    <button
                      onClick={() => patch(m.id, { enabled: !m.enabled })}
                      className="text-gray-600 hover:text-gray-800 disabled:opacity-40"
                      disabled={m.isDefault}
                    >
                      {m.enabled ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-40"
                      disabled={m.isDefault}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
