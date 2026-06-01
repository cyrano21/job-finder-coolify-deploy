# Fonctionnalités IA de Job Finder

## Introduction

Job Finder intègre maintenant des fonctionnalités d'intelligence artificielle grâce à l'intégration de modèles gratuits comme Mistral via OpenRouter. Ces fonctionnalités améliorent l'expérience de recherche d'emploi en fournissant des évaluations de correspondance, des recommandations personnalisées et des résumés de recherche.

## Modèles IA utilisés

### Mistral 7B (Gratuit)
- **Fournisseur**: OpenRouter
- **Modèle**: `mistralai/mistral-7b-instruct:free`
- **Utilisation**: Évaluation de la correspondance entre offres d'emploi et compétences utilisateur
- **Avantages**: 
  - Entièrement gratuit
  - Bonne performance pour les tâches de compréhension de texte
  - Pas de limite stricte de requêtes

## Fonctionnalités IA implémentées

### 1. Évaluation de la correspondance
Cette fonctionnalité évalue à quel point une offre d'emploi correspond aux compétences d'un utilisateur.

**Fonctionnement**:
1. L'utilisateur clique sur "Évaluer avec IA" sur une carte d'offre d'emploi
2. Le système envoie la description de l'offre et les compétences de l'utilisateur au modèle Mistral
3. Le modèle retourne un score de correspondance entre 0 et 100
4. Le score est affiché sur la carte d'offre d'emploi

**Avantages**:
- Aide l'utilisateur à identifier rapidement les offres pertinentes
- Économise du temps en filtrant automatiquement les offres moins pertinentes

### 2. Recommandations personnalisées
Cette fonctionnalité trie et pondère les résultats de recherche en fonction de leur pertinence pour l'utilisateur.

**Fonctionnement**:
1. Lors d'une recherche d'emploi, le système récupère les offres de plusieurs sources
2. Chaque offre est évaluée par l'IA pour déterminer sa pertinence
3. Les résultats sont triés par score de correspondance décroissant
4. Les scores sont affichés sur les cartes d'offres

**Avantages**:
- Présente les offres les plus pertinentes en premier
- Améliore la pertinence des résultats de recherche

### 3. Résumés de recherche
Cette fonctionnalité génère un résumé personnalisé pour chaque recherche d'emploi.

**Fonctionnement**:
1. Après une recherche, le système identifie les meilleures correspondances
2. Un résumé est généré avec les opportunités les plus pertinentes
3. Le résumé est affiché dans la section de recherche rapide

**Avantages**:
- Fournit une vue d'ensemble rapide des meilleures opportunités
- Encourage l'utilisateur avec des informations positives

## Configuration

### Prérequis
Pour utiliser les fonctionnalités IA, vous devez configurer une clé API OpenRouter dans votre fichier `.env.local`:

```env
OPENROUTER_API_KEY=votre_clé_api_openrouter
```

### Obtention d'une clé OpenRouter
1. Rendez-vous sur https://openrouter.ai/
2. Créez un compte gratuit
3. Accédez à la section API Keys
4. Générez une nouvelle clé API
5. Copiez la clé dans votre fichier `.env.local`

## Test des services IA

Un script de test est disponible pour vérifier le bon fonctionnement des services IA:

```bash
npm run test-ai
```

Ce script effectue les tests suivants:
1. Évaluation d'une correspondance d'offre d'emploi
2. Génération de recommandations personnalisées

## Limitations

### Modèle gratuit
Le modèle Mistral 7B gratuit a certaines limitations:
- Temps de réponse légèrement plus long que les modèles payants
- Peut occasionnellement renvoyer des scores incorrects
- Limité à 1000 requêtes par jour (selon les conditions d'OpenRouter)

### Fiabilité
Les scores générés par l'IA sont des estimations et ne remplacent pas une évaluation humaine approfondie.

## Améliorations futures

### Intégration de modèles plus avancés
- Intégration de modèles plus puissants (comme Mistral Small ou Medium) pour les utilisateurs premium
- Utilisation de modèles spécialisés pour des domaines spécifiques

### Personnalisation des compétences
- Permettre aux utilisateurs de définir leurs compétences dans leur profil
- Utiliser ces compétences pour des évaluations plus précises

### Historique des évaluations
- Stocker les évaluations pour améliorer les recommandations futures
- Permettre aux utilisateurs de fournir des retours sur la précision des évaluations

## Support

Pour toute question concernant les fonctionnalités IA, veuillez consulter:
- La documentation technique dans `/app/modules/jobs/utils/ai-service.ts`
- Le fichier de configuration des APIs dans `CONFIGURATION-APIS.md`
- Les issues GitHub du projet