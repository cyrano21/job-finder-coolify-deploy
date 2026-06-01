# Déploiement sur Coolify

L'app est prête pour Coolify : `Dockerfile` multi-stage + Next.js en mode
`standalone`. Coolify déploie depuis un dépôt Git — pousse d'abord le code,
puis suis les étapes ci-dessous dans l'UI Coolify.

> ⚠️ Sécurité : le mot de passe serveur partagé en clair doit être changé.
> Ne mets jamais de secrets dans le dépôt : ils vont dans les variables
> d'environnement Coolify.

## Pré-requis

1. Le code est poussé sur un dépôt Git (GitHub/GitLab) accessible par Coolify.
2. Une base **PostgreSQL** accessible (le Postgres local embarqué de dev ne
   fonctionne PAS en prod). Deux options :
   - Créer une ressource **PostgreSQL** dans Coolify (recommandé), ou
   - Utiliser un Postgres managé (Supabase, Neon, etc.).

## Étapes dans Coolify

### 1. Créer la base PostgreSQL (si via Coolify)
- Project → **+ New** → **Database** → **PostgreSQL**
- Note l'URL de connexion interne (ex: `postgres://user:pass@<service>:5432/postgres`).

### 2. Créer l'application
- Project → **+ New** → **Application** → **Public/Private Repository**
- Renseigne l'URL du dépôt et la branche (`main`).
- Build Pack : **Dockerfile** (Coolify détecte le `Dockerfile` à la racine).
- Port exposé : **3000**.

### 3. Variables d'environnement
Dans l'onglet **Environment Variables** de l'app, ajoute (cf. `.env.example`) :

```
# Base de données (URL interne de la ressource Postgres Coolify)
DATABASE_URL=postgres://user:pass@<service>:5432/postgres
DIRECT_URL=postgres://user:pass@<service>:5432/postgres

# IA (au moins une clé selon AI_PROVIDER)
AI_PROVIDER=groq
GROQ_API_KEY=...
OPENAI_API_KEY=...
# autres clés optionnelles : DEEPSEEK_API_KEY, MISTRAL_API_KEY, ...

# Supabase (auth)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email + cron
SMTP_HOST=...
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
CRON_SECRET=<chaîne aléatoire longue>

# App
NEXT_PUBLIC_APP_URL=https://<ton-domaine>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### 4. Migrer la base (première fois et à chaque changement de schéma)
Les migrations ne sont pas lancées automatiquement. Deux possibilités :

- **Le plus simple** : dans Coolify, onglet **Commands / Terminal** de l'app
  une fois déployée, exécute :
  ```
  npx prisma migrate deploy
  npx prisma db seed   # optionnel : ressources + modèles IA par défaut
  ```
- **Ou** ajoute un "Post-deployment command" dans Coolify :
  ```
  npx prisma migrate deploy
  ```

### 5. Déployer
- Clique **Deploy**. Coolify build le `Dockerfile` et lance le conteneur.
- Configure le **domaine** + HTTPS (Let's Encrypt automatique via Coolify).

## Healthcheck (optionnel)
Coolify peut surveiller `/` (HTTP 200). Aucun endpoint dédié n'est requis.

## Notes
- Le webhook Stripe doit pointer vers `https://<domaine>/api/stripe/webhook`.
- Les alertes emploi (`/api/jobs/notify`) se déclenchent via un cron externe
  appelant l'endpoint avec l'en-tête `Authorization: Bearer <CRON_SECRET>`.
  Coolify a un **Scheduled Tasks** intégré pour ça.
- Le port interne du conteneur est **3000** (défini dans le Dockerfile).
