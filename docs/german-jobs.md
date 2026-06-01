# Recherche d'Emplois en Allemagne

## Introduction

Job Finder prend en charge la recherche d'emplois en Allemagne grâce à un système de scraping qui récupère les offres des principaux job boards allemands. Cette fonctionnalité est activée automatiquement lorsque la langue de recherche est définie sur "Allemand".

## Sources de Données Allemandes

### 1. StepStone
- **URL**: https://www.stepstone.de
- **Description**: L'un des plus grands portails d'emploi en Allemagne
- **Couverture**: Emplois dans toute l'Allemagne
- **Types d'emplois**: CDI, CDD, Freelance, Stage, Alternance

### 2. Indeed Germany
- **URL**: https://de.indeed.com
- **Description**: Version allemande du célèbre site d'emploi Indeed
- **Couverture**: Emplois dans toute l'Allemagne
- **Types d'emplois**: CDI, CDD, Freelance, Stage, Temps partiel

### 3. Jobs.de
- **URL**: https://www.jobs.de
- **Description**: Portail d'emploi allemand avec une forte présence dans les secteurs techniques
- **Couverture**: Emplois dans toute l'Allemagne
- **Types d'emplois**: CDI, CDD, Freelance, Stage

### 4. Berufenet
- **URL**: https://www.berufenet.arbeitsagentur.de
- **Description**: Base de données de l'Agence fédérale pour l'emploi allemande
- **Couverture**: Informations sur les professions et formations en Allemagne
- **Types d'infos**: Descriptions de postes, exigences, formations

## Fonctionnement du Scraping

### Architecture
Le système de scraping allemand est implémenté dans le fichier `app/modules/jobs/utils/german-job-scraper.ts`. Il utilise les bibliothèques suivantes :

- **Cheerio**: Pour le parsing HTML
- **Axios**: Pour les requêtes HTTP

### Processus de Scraping
1. L'utilisateur sélectionne "Allemand" comme langue de recherche
2. L'API reçoit la requête avec `locale=de`
3. Le système déclenche le scraping des job boards allemands
4. Les résultats sont normalisés selon le format standard de l'application
5. Les résultats sont dédupliqués et fusionnés avec les autres sources

### Normalisation des Données
Les données scrapées sont normalisées selon le format `JobListing` utilisé dans l'application :

```typescript
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contractType: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'apprenticeship';
  experienceLevel: 'entry' | 'intermediate' | 'senior' | 'executive';
  remote: 'no' | 'hybrid' | 'full';
  url: string;
  source: string;
  postedDate: string;
}
```

## Configuration

### Activation
La fonctionnalité de scraping allemand est activée automatiquement lorsque :
- Le paramètre `locale` est égal à `de`
- L'utilisateur sélectionne "Allemand" dans l'interface

### Personnalisation
Pour ajouter de nouvelles sources de scraping :
1. Ajouter l'URL du job board dans l'objet `GERMAN_JOB_BOARDS`
2. Créer une fonction de scraping spécifique pour ce job board
3. Ajouter la fonction à la liste des tâches dans `scrapeGermanJobs`

## Limitations

### Respect des Conditions d'Utilisation
- Le scraping est effectué avec des en-têtes User-Agent appropriés
- Des délais sont respectés entre les requêtes pour éviter le blocage
- Le scraping est effectué uniquement pour les recherches utilisateurs actives

### Fiabilité des Données
- Les données scrapées peuvent être moins structurées que les APIs
- Certaines informations (salaire, type de contrat) peuvent manquer
- Les dates de publication peuvent être approximatives

### Performance
- Le scraping peut ralentir légèrement les temps de réponse
- Les résultats peuvent varier selon la disponibilité des sites sources

## Améliorations Futures

### Ajout de Sources
- Integration avec d'autres job boards allemands (Xing, StepStone API, etc.)
- Ajout de sources sectorielles spécifiques (IT, ingénierie, santé, etc.)

### Amélioration du Parsing
- Utilisation de techniques plus avancées de scraping (Puppeteer pour JavaScript-heavy sites)
- Meilleure extraction des métadonnées (salaire, type de contrat, niveau d'expérience)

### Internationalisation
- Extension à d'autres pays européens (Autriche, Suisse, Pays-Bas, etc.)
- Support multilingue pour les descriptions de postes

## Dépannage

### Problèmes de Scraping
- Si les résultats allemands sont absents, vérifier la disponibilité des sites sources
- Les sites peuvent changer leur structure HTML, nécessitant des mises à jour des sélecteurs

### Performance
- En cas de ralentissements, ajuster les délais entre les requêtes
- Considérer l'implémentation d'un cache pour les résultats fréquents

## Support

Pour toute question concernant la recherche d'emplois en Allemagne, veuillez consulter :
- La documentation technique dans `/app/modules/jobs/utils/german-job-scraper.ts`
- Le fichier de configuration des APIs dans `CONFIGURATION-APIS.md`
- Les issues GitHub du projet