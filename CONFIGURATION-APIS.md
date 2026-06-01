# Configuration des APIs de Recherche d'Emploi

## Problème résolu

Votre application `job-finder-app` ne trouvait pas d'offres d'emploi car les clés API n'étaient pas correctement configurées. Les fonctionnalités de `job-application-app` ont été intégrées avec succès.

## APIs intégrées

### 1. Adzuna API ✅

- **Fichier**: `/app/api/jobs/adzuna/route.ts`
- **Variables requises**:
  ```env
  ADZUNA_APP_ID=votre_app_id
  ADZUNA_APP_KEY=votre_app_key
  ```
- **Inscription**: https://developer.adzuna.com/
- **Gratuit**: 1000 requêtes/mois

### 2. SearchAPI (Google Jobs) ✅

- **Fichier**: `/app/api/jobs/searchapi/route.ts`
- **Variable requise**:
  ```env
  SEARCHAPI_API_KEY=votre_searchapi_key
  ```
- **Inscription**: https://www.searchapi.io/
- **Gratuit**: 100 requêtes/mois

### 3. Jooble API ✅

- **Fichier**: `/app/api/jobs/jooble/route.ts`
- **Variable requise**:
  ```env
  JOOBLE_API_KEY=votre_jooble_key
  ```
- **Inscription**: https://jooble.org/api/about
- **Gratuit**: Limité selon les conditions

### 4. OpenRouter (Mistral AI) ✅

- **Fichier**: `/app/modules/jobs/utils/ai-service.ts`
- **Variable requise**:
  ```env
  OPENROUTER_API_KEY=votre_openrouter_key
  ```
- **Inscription**: https://openrouter.ai/
- **Gratuit**: Modèles gratuits disponibles (mistral-7b-instruct:free)

## Configuration

### Étape 1: Obtenir les clés API

1. **Adzuna**: Créez un compte sur https://developer.adzuna.com/
2. **SearchAPI**: Inscrivez-vous sur https://www.searchapi.io/
3. **Jooble**: Demandez l'accès sur https://jooble.org/api/about
4. **OpenRouter**: Inscrivez-vous sur https://openrouter.ai/ et obtenez une clé API

### Étape 2: Configurer .env.local

Remplacez les valeurs dans votre fichier `.env.local`:

```env
# Adzuna
ADZUNA_APP_ID=votre_vraie_app_id
ADZUNA_APP_KEY=votre_vraie_app_key

# SearchAPI
SEARCHAPI_API_KEY=votre_vraie_searchapi_key

# Jooble
JOOBLE_API_KEY=votre_vraie_jooble_key

# OpenRouter (pour l'IA)
OPENROUTER_API_KEY=votre_vraie_openrouter_key
```

### Étape 3: Tester les APIs

```bash
node test-apis.js
```

## Utilisation

### API unifiée

```
GET /api/jobs?query=développeur&location=Paris&locale=fr
GET /api/jobs?query=software engineer&location=Berlin&locale=de
```

### APIs individuelles

```
GET /api/jobs/adzuna?query=développeur&location=Paris&locale=fr
GET /api/jobs/searchapi?query=développeur&location=Paris
POST /api/jobs/jooble
```

## Fonctionnalités IA

### Évaluation de la correspondance

L'application utilise maintenant Mistral AI via OpenRouter pour évaluer la correspondance entre les offres d'emploi et les compétences de l'utilisateur.

### Recommandations personnalisées

Les résultats de recherche sont triés et pondérés par l'IA pour fournir des recommandations plus pertinentes.

### Résumés de recherche

Des résumés personnalisés sont générés pour chaque recherche d'emploi.

## Recherche d'emplois en Allemagne

L'application prend en charge la recherche d'emplois en Allemagne grâce à un système de scraping qui récupère les offres des principaux job boards allemands :

- StepStone
- Indeed Germany
- Jobs.de
- Berufenet (via l'API de l'Agence fédérale pour l'emploi)

Cette fonctionnalité est activée automatiquement lorsque la langue de recherche est définie sur "Allemand".

## Fonctionnalités

✅ **Recherche multi-sources**: Combine 3 APIs en une seule requête
✅ **Déduplication**: Élimine les doublons par URL et titre+entreprise
✅ **Normalisation**: Format uniforme pour tous les résultats
✅ **Gestion d'erreurs**: Continue même si une API échoue
✅ **Filtres**: Date de publication, localisation, mots-clés
✅ **Pagination**: Support de la pagination
✅ **Évaluation IA**: Correspondance entre offres et compétences
✅ **Recommandations**: Résultats triés par pertinence IA
✅ **Résumés**: Synthèses personnalisées des recherches
✅ **Recherche en Allemand**: Scraping de job boards allemands

## Dépannage

### Aucun résultat trouvé

1. Vérifiez que les clés API sont correctement configurées
2. Testez avec `node test-apis.js`
3. Vérifiez les logs de la console pour les erreurs

### Erreur stylelint

L'erreur stylelint sur les fichiers TypeScript a été corrigée dans `.vscode/settings.json`.

### Variables d'environnement

Les variables utilisent maintenant les bons noms (sans `NEXT_PUBLIC_` pour les clés secrètes).

## Différences avec job-application-app

| Fonctionnalité    | job-application-app | job-finder-app     |
| ----------------- | ------------------- | ------------------ |
| APIs              | Séparées            | Unifiée + séparées |
| Format            | JavaScript          | TypeScript         |
| Gestion d'erreurs | Basique             | Avancée            |
| Déduplication     | Non                 | Oui                |
| Normalisation     | Non                 | Oui                |
| Fonctionnalités IA| Non                 | Oui                |
| Recherche allemande| Non                | Oui                |

Votre application `job-finder-app` est maintenant plus robuste que `job-application-app` ! 🚀
