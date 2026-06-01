import { Resource } from './types'

// Base de connaissances des dispositifs d'insertion (France).
// Sert à la fois de seed pour la table Resource et de contexte injecté
// dans le prompt de l'agent pour ancrer ses recommandations dans le réel.
export const INSERTION_RESOURCES: Resource[] = [
  {
    title: 'Mission Locale',
    type: 'organisme',
    source: 'Mission Locale',
    category: 'accompagnement',
    url: 'https://www.unml.info/',
    summary:
      "Accompagnement gratuit des 16-25 ans : emploi, formation, logement, santé, mobilité. Point d'entrée prioritaire.",
    tags: ['16-25', 'gratuit', 'accompagnement', 'cej'],
  },
  {
    title: "Contrat d'Engagement Jeune (CEJ)",
    type: 'dispositif',
    source: 'France Travail / Mission Locale',
    category: 'revenu',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F37992',
    summary:
      "Accompagnement intensif (15-20h/semaine) + allocation jusqu'à ~520€/mois pour les 16-25 ans sans emploi ni formation.",
    tags: ['allocation', 'revenu', '16-25', 'neet'],
  },
  {
    title: 'France Travail',
    type: 'organisme',
    source: 'France Travail',
    category: 'accompagnement',
    url: 'https://www.francetravail.fr/',
    summary:
      "Service public de l'emploi : inscription, offres, formations, aides. Ex-Pôle emploi.",
    tags: ['inscription', 'offres', 'aides'],
  },
  {
    title: 'PMSMP (immersion professionnelle)',
    type: 'dispositif',
    source: 'France Travail',
    category: 'accompagnement',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F32193',
    summary:
      "Période de mise en situation en milieu professionnel : tester un métier en entreprise jusqu'à 1 mois, sans engagement.",
    tags: ['immersion', 'tester-metier', 'stage'],
  },
  {
    title: 'POEI (préparation opérationnelle à l\'emploi)',
    type: 'dispositif',
    source: 'France Travail',
    category: 'formation',
    summary:
      "Formation financée avant embauche pour acquérir les compétences d'un poste précis proposé par un employeur.",
    tags: ['formation', 'pre-embauche', 'financement'],
  },
  {
    title: 'CPF (Compte Personnel de Formation)',
    type: 'aide',
    source: 'CPF',
    category: 'formation',
    url: 'https://www.moncompteformation.gouv.fr/',
    summary:
      'Droits à la formation cumulés en euros, utilisables pour financer des formations certifiantes.',
    tags: ['financement', 'formation', 'certifiante'],
  },
  {
    title: 'Alternance (apprentissage / professionnalisation)',
    type: 'dispositif',
    source: 'Alternance',
    category: 'formation',
    url: 'https://www.alternance.emploi.gouv.fr/',
    summary:
      'Se former en étant payé, en alternant entreprise et centre de formation. Diplôme + expérience + salaire.',
    tags: ['salaire', 'diplome', 'experience', 'jeune'],
  },
  {
    title: 'AFPA',
    type: 'organisme',
    source: 'AFPA',
    category: 'formation',
    url: 'https://www.afpa.fr/',
    summary:
      'Organisme de formation professionnelle pour adultes : formations qualifiantes vers des métiers en tension.',
    tags: ['formation', 'qualifiante', 'metiers-en-tension'],
  },
  {
    title: 'GRETA',
    type: 'organisme',
    source: 'GRETA',
    category: 'formation',
    url: 'https://www.education.gouv.fr/les-greta-1016',
    summary:
      "Réseau de l'Éducation nationale pour la formation continue des adultes.",
    tags: ['formation', 'education-nationale', 'adultes'],
  },
  {
    title: 'École de la 2e Chance (E2C)',
    type: 'dispositif',
    source: 'E2C',
    category: 'accompagnement',
    url: 'https://reseau-e2c.fr/',
    summary:
      "Parcours pour les 16-25 ans sans diplôme ni qualification : remise à niveau et accompagnement vers l'emploi.",
    tags: ['sans-diplome', '16-25', 'remise-a-niveau'],
  },
  {
    title: 'EPIDE',
    type: 'dispositif',
    source: 'EPIDE',
    category: 'accompagnement',
    url: 'https://www.epide.fr/',
    summary:
      "Établissement avec internat pour les 17-25 ans : cadre structurant, remise à niveau et projet professionnel.",
    tags: ['internat', '17-25', 'cadre', 'projet-pro'],
  },
  {
    title: 'Service Civique',
    type: 'dispositif',
    source: 'Service Civique',
    category: 'revenu',
    url: 'https://www.service-civique.gouv.fr/',
    summary:
      "Mission d'intérêt général de 6-12 mois, indemnisée (~600€/mois), pour les 16-25 ans. Tester un domaine et gagner de l'expérience.",
    tags: ['indemnise', '16-25', 'experience', 'engagement'],
  },
  {
    title: 'Formations courtes / métiers accessibles sans diplôme long',
    type: 'formation',
    source: 'Divers',
    category: 'formation',
    summary:
      "Pistes rapides vers l'emploi : logistique, vente, restauration, services à la personne, sécurité, BTP, numérique (certifs courtes).",
    tags: ['rapide', 'sans-diplome', 'emploi'],
  },
]

// Version condensée injectée dans le prompt système de l'agent.
export function knowledgeBaseForPrompt(): string {
  return INSERTION_RESOURCES.map(
    (r) => `- ${r.title} (${r.source}) : ${r.summary}`
  ).join('\n')
}
