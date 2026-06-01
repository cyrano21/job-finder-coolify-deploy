'use client'

import { useState } from 'react'
import { BarChart3, Users, ScrollText, Activity, Cpu } from 'lucide-react'
import DashboardStats from '../modules/admin/components/DashboardStats'
import UserManagement from '../modules/admin/components/UserManagement'
import ActivityLogs from '../modules/admin/components/ActivityLogs'
import AIPerformanceDashboard from '../modules/admin/components/AIPerformanceDashboard'
import AIModelsManager from '../modules/admin/components/AIModelsManager'
import { cn } from '../lib/utils'

type Tab = 'stats' | 'users' | 'logs' | 'ai' | 'models'

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'logs', label: "Journaux", icon: ScrollText },
  { id: 'ai', label: 'Performance IA', icon: Activity },
  { id: 'models', label: 'Modèles IA', icon: Cpu },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('stats')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard Administrateur
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pilotage de la plateforme, des utilisateurs et de l&apos;IA.
          </p>
        </div>

        {/* Onglets — scroll horizontal sur mobile */}
        <div className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
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

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'stats' && <DashboardStats />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'logs' && <ActivityLogs />}
          {activeTab === 'ai' && <AIPerformanceDashboard />}
          {activeTab === 'models' && <AIModelsManager />}
        </div>
      </div>
    </div>
  )
}
