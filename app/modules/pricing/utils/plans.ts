export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  role: 'FREE' | 'PRO' | 'COACH';
  stripePriceId?: string;
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour commencer votre recherche d\'emploi',
    price: 0,
    interval: 'month',
    features: [
      '1 CV',
      '3 lettres de motivation',
      'Recherche d\'emploi limitée',
      'Profil public de base'
    ],
    role: 'FREE'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les chercheurs d\'emploi sérieux',
    price: 9.99,
    interval: 'month',
    features: [
      'CV illimités',
      'Lettres de motivation illimitées',
      'Recherche d\'emploi avancée avec IA',
      'Géolocalisation et temps de trajet',
      'Export PDF/Docx',
      'Profil public personnalisé'
    ],
    role: 'PRO',
    stripePriceId: 'price_pro_monthly',
    popular: true
  },
  {
    id: 'coach',
    name: 'Coach+',
    description: 'Pour une recherche d\'emploi optimale',
    price: 14.99,
    interval: 'month',
    features: [
      'Tous les avantages Pro',
      'Coaching IA complet',
      'Simulateur d\'entretien',
      'Corrections CV et lettre par IA',
      'Suggestions d\'amélioration de profil',
      'Alertes personnalisées'
    ],
    role: 'COACH',
    stripePriceId: 'price_coach_monthly'
  }
];
