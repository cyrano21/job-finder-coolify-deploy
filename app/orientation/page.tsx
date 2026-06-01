'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, BookOpen } from 'lucide-react'
import {
  OrientationProvider,
  useOrientation,
} from '../modules/orientation/utils/orientation-context'
import DiagnosticForm from '../modules/orientation/components/DiagnosticForm'
import DiagnosticResult from '../modules/orientation/components/DiagnosticResult'
import ResourcesList from '../modules/orientation/components/ResourcesList'
import { cn } from '../lib/utils'

type TabId = 'diagnostic' | 'resources'

function OrientationContent() {
  const { session } = useOrientation()
  const [tab, setTab] = useState<TabId>('diagnostic')

  const tabs: { id: TabId; label: string; icon: typeof Compass }[] = [
    { id: 'diagnostic', label: 'Diagnostic & plan', icon: Compass },
    { id: 'resources', label: 'Ressources', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-brand-gradient-soft">
      {/* En-tête premium */}
      <div className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-16 -left-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur"
          >
            <Compass className="h-3.5 w-3.5" />
            Copilote d&apos;insertion 16-25 ans
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
          >
            Transforme ta situation en plan concret
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm text-indigo-50 sm:text-base"
          >
            Pas de blabla. On sécurise un revenu, on teste des pistes réalistes
            et on agit, semaine par semaine.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 -mt-6 sm:-mt-8">
        {/* Onglets (sticky sur mobile pour rester accessibles) */}
        <div className="sticky top-2 z-10 mx-auto mb-6 flex w-fit gap-1 rounded-2xl bg-white/80 p-1 shadow-card backdrop-blur">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-gradient text-white shadow-soft'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'diagnostic' ? (
          <div className="space-y-6">
            <DiagnosticForm />
            {session && <DiagnosticResult />}
          </div>
        ) : (
          <ResourcesList />
        )}
      </div>
    </div>
  )
}

export default function OrientationPage() {
  return (
    <OrientationProvider>
      <OrientationContent />
    </OrientationProvider>
  )
}
