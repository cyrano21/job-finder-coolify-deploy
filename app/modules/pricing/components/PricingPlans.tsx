'use client'

import { useState } from 'react'
import { Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { pricingPlans, PricingPlan } from '../utils/plans'
import { Button, Badge } from '@/app/components/ui'
import { cn } from '@/app/lib/utils'

interface PricingCardProps {
  plan: PricingPlan
  onSelectPlan: (plan: PricingPlan) => void
}

function PricingCard({ plan, onSelectPlan }: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1',
        plan.popular
          ? 'bg-white shadow-glow ring-2 ring-indigo-500'
          : 'bg-white shadow-card hover:shadow-elevated border border-gray-100'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="brand" className="bg-brand-gradient text-white shadow-soft">
            Le plus populaire
          </Badge>
        </div>
      )}

      <h3
        className={cn(
          'text-2xl font-bold',
          plan.popular ? 'text-brand-gradient' : 'text-gray-900'
        )}
      >
        {plan.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{plan.description}</p>

      <div className="mt-5 flex items-baseline gap-1 border-b border-gray-100 pb-5">
        <span
          className={cn(
            'text-4xl font-bold',
            plan.popular ? 'text-brand-gradient' : 'text-gray-900'
          )}
        >
          {plan.price}€
        </span>
        <span className="text-gray-500">/mois</span>
      </div>

      <ul className="mt-6 mb-8 flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0',
                plan.popular ? 'text-indigo-500' : 'text-emerald-500'
              )}
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelectPlan(plan)}
        block
        size="lg"
        variant={plan.price === 0 ? 'secondary' : 'primary'}
      >
        {plan.price === 0 ? 'Commencer gratuitement' : 'S\'abonner'}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function PricingPlans() {
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month')

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      window.location.href = '/login'
      return
    }
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.stripePriceId, planId: plan.id }),
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error)
    }
  }

  return (
    <div className="py-8">
      <div className="mb-12 text-center">
        <h2 className="inline-block text-3xl font-bold text-brand-gradient sm:text-4xl">
          Plans tarifaires
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Choisissez le plan qui correspond à vos besoins. Tous les plans incluent
          un accès à notre plateforme de recherche d&apos;emploi.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex gap-1 rounded-2xl bg-white p-1.5 shadow-card">
            {(['month', 'year'] as const).map((interval) => (
              <button
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                className={cn(
                  'rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                  selectedInterval === interval
                    ? 'bg-brand-gradient text-white shadow-soft'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {interval === 'month' ? 'Mensuel' : 'Annuel'}
                {interval === 'year' && (
                  <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={{
              ...plan,
              price:
                selectedInterval === 'year'
                  ? Math.round(plan.price * 12 * 0.8) / 12
                  : plan.price,
              interval: selectedInterval,
            }}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-soft">
        <div className="mb-3 flex items-center justify-center gap-2 text-indigo-600">
          <ShieldCheck className="h-6 w-6" />
          <h3 className="text-lg font-bold">Garantie et flexibilité</h3>
        </div>
        <p className="text-gray-600">
          Tous les abonnements peuvent être annulés à tout moment.
          <br />
          Nous proposons une garantie satisfait ou remboursé de 14 jours.
        </p>
      </div>
    </div>
  )
}
