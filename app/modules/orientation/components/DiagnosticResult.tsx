'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Target,
} from 'lucide-react'
import { useOrientation } from '../utils/orientation-context'
import type { Horizon } from '../utils/types'
import { Card, CardContent, Badge, ScoreBar } from '@/app/components/ui'
import { cn } from '@/app/lib/utils'

const HORIZON_LABELS: Record<Horizon, string> = {
  '48h': 'Dans les 48h',
  '7j': 'Cette semaine',
  '30j': 'Sous 30 jours',
  '90j': 'Sous 90 jours',
}
const HORIZON_ORDER: Horizon[] = ['48h', '7j', '30j', '90j']

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export default function DiagnosticResult() {
  const { session, recommendedResources, updateActionStatus } = useOrientation()
  if (!session) return null

  const tracks = session.careerTracks ?? []
  const plans = session.actionPlans ?? []
  const risks = session.immediateRisks ?? []
  const doNotDo = session.doNotDo ?? []
  const questions = session.remainingQuestions ?? []
  const hasScores =
    session.urgencyScore != null ||
    session.autonomyScore != null ||
    session.clarityScore != null

  return (
    <div className="space-y-5">
      {/* Synthèse + scores */}
      {(session.summary || hasScores) && (
        <motion.div {...fade} className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-elevated">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5" />
              Ta situation, sans détour
            </h2>
            {session.summary && (
              <p className="mt-2 leading-relaxed text-indigo-50">{session.summary}</p>
            )}
            {hasScores && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ScoreBar tone="light" label="Urgence" value={session.urgencyScore ?? 0} />
                <ScoreBar tone="light" label="Autonomie" value={session.autonomyScore ?? 0} />
                <ScoreBar tone="light" label="Clarté" value={session.clarityScore ?? 0} />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Risques immédiats */}
      {risks.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.05 }}>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <h3 className="flex items-center gap-2 font-semibold text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Risques immédiats
              </h3>
              <ul className="mt-2 space-y-1 pl-1 text-sm text-amber-800">
                {risks.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pistes métiers */}
      {tracks.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.1 }}>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Target className="h-5 w-5 text-indigo-600" />
            Pistes à explorer
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tracks.map((t, i) => (
              <Card key={t.id ?? i} className="transition-shadow hover:shadow-elevated">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900">{t.title}</h4>
                    <span className="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-sm font-bold text-indigo-700">
                      {t.score}
                    </span>
                  </div>
                  <Badge variant="purple" className="mt-1">{t.category}</Badge>
                  {t.reasons?.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-gray-700">
                      {t.reasons.map((r, idx) => (
                        <li key={idx} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                  {t.risks?.length > 0 && (
                    <p className="mt-2 text-xs text-amber-700">⚠ {t.risks.join(' · ')}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plan d'action */}
      {plans.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.15 }}>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Ton plan d&apos;action</h3>
          <div className="space-y-3">
            {HORIZON_ORDER.map((horizon) => {
              const items = plans.filter((p) => p.horizon === horizon)
              if (items.length === 0) return null
              return (
                <Card key={horizon}>
                  <CardContent className="py-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-lg bg-brand-gradient px-2.5 py-1 text-xs font-bold text-white">
                        {horizon}
                      </span>
                      <h4 className="font-medium text-gray-800">{HORIZON_LABELS[horizon]}</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {items.map((a, i) => {
                        const done = a.status === 'done'
                        return (
                          <li key={a.id ?? i} className="flex items-start gap-3">
                            <button
                              onClick={() => a.id && updateActionStatus(a.id, done ? 'todo' : 'done')}
                              className={cn(
                                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                                done
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-gray-300 hover:border-indigo-400'
                              )}
                              aria-label={done ? 'Marquer à faire' : 'Marquer fait'}
                            >
                              {done && <CheckCircle2 className="h-4 w-4" />}
                            </button>
                            <div>
                              <p className={cn('text-sm font-medium', done ? 'text-gray-400 line-through' : 'text-gray-800')}>
                                {a.title}
                              </p>
                              <p className="text-sm text-gray-500">{a.description}</p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Ressources recommandées */}
      {recommendedResources.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.2 }}>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="py-4">
              <h3 className="font-semibold text-emerald-800">Dispositifs à activer en priorité</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendedResources.map((r, i) => (
                  <span key={i} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700">
                    {r}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* À ne pas faire */}
      {doNotDo.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.25 }}>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <h3 className="flex items-center gap-2 font-semibold text-red-800">
                <Ban className="h-4 w-4" />
                À ne pas faire
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-red-800">
                {doNotDo.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Questions restantes */}
      {questions.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="py-4">
              <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                <HelpCircle className="h-4 w-4 text-indigo-500" />
                Pour affiner, réponds à ça
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {questions.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                    {q}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <p className="px-4 text-center text-xs text-gray-400">
        Cet assistant te prépare avant, pendant et après tes démarches. Il ne
        remplace pas la Mission Locale, France Travail, un conseiller
        d&apos;orientation ou un professionnel de santé. En cas de détresse,
        appelle le 3114.
      </p>
    </div>
  )
}
