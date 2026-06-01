# Modèles de CV spécifiques aux pays

Ce dossier contient des modèles de CV adaptés aux normes et conventions de différents pays. Chaque modèle est conçu pour respecter les attentes spécifiques du marché du travail dans son pays respectif.

## Modèles disponibles

### France (`FranceTemplate.tsx`)
- Format chronologique classique
- Résumé professionnel en tête
- Sections standard : expérience, formation, compétences, langues
- Design sobre et professionnel

### Allemagne (`GermanyTemplate.tsx`)
- Format fonctionnel mettant l'accent sur l'éducation
- Informations personnelles détaillées (y compris la date de naissance)
- Sections ordonnées par priorité : formation, expérience, compétences
- Terminologie allemande pour les niveaux de langue

### États-Unis (`USATemplate.tsx`)
- Format chronologique avec résumé détaillé
- Sections complètes : expérience, projets, certifications
- Design moderne avec mise en page optimisée
- Intégration des réseaux sociaux professionnels

### Chine (`ChinaTemplate.tsx`)
- Photo obligatoire en tête de CV
- Informations personnelles étendues (état civil, date de naissance)
- Structure formelle avec signature
- Terminologie chinoise appropriée

### Royaume-Uni (`UKTemplate.tsx`)
- Format similaire au modèle américain
- Informations de contact en haut à droite
- Sections standard : profil, historique professionnel, formations
- Design sobre et professionnel

### Canada (`CanadaTemplate.tsx`)
- Support bilingue (anglais/français)
- Informations de contact avec mentions dans les deux langues
- Sections avec titres bilingues
- Mentions "References available upon request / Références disponibles sur demande"

### Japon (`JapanTemplate.tsx`)
- Format tabulaire pour l'éducation et l'expérience
- Numérotation des sections
- Photo de profil (証明写真)
- Structure formelle japonaise avec date et signature

## Utilisation

Les modèles sont automatiquement sélectionnés en fonction du `countryTemplate` défini dans l'objet CV. Le composant `CVPreview` utilise le modèle approprié lors du rendu.

## Ajout de nouveaux modèles

Pour ajouter un nouveau modèle pays :
1. Créer un nouveau composant dans ce dossier
2. Suivre la structure des modèles existants
3. Mettre à jour le fichier `index.ts` pour exporter le nouveau modèle
4. Mettre à jour le composant `CVPreview` pour inclure le nouveau modèle