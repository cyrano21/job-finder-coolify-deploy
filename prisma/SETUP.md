# Base de données (PostgreSQL)

La stack est unifiée sur **PostgreSQL**. Plus de SQLite, plus de Mongo pour les
données métier.

## En développement : Postgres local embarqué (par défaut)

Aucune installation système n'est requise. Un PostgreSQL local est fourni via le
paquet `embedded-postgres` (binaires téléchargés depuis Maven Central), avec ses
données dans `.pgdata/` (gitignoré).

```bash
npm run db:start     # démarre Postgres (port 5432, base "jobfinder") — garder ouvert
# dans un autre terminal :
npm run db:migrate   # applique les migrations (crée les tables)
npm run db:seed      # insère les ~13 dispositifs d'insertion
npm run db:studio    # explorateur visuel (optionnel)
npm run db:stop      # arrête Postgres
```

`.env` pointe déjà sur cette base :
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobfinder?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/jobfinder?schema=public"
```

## Plus tard : passer à Supabase (ou tout Postgres hébergé)

1. Crée le projet sur supabase.com, récupère **Project Settings → Database → Connection string**.
2. Dans `.env`, remplace les deux URLs :
   - `DATABASE_URL` = Transaction pooler (port `6543`) + `?pgbouncer=true`
   - `DIRECT_URL`   = Session / Direct (port `5432`)
3. `npm run db:deploy` puis `npm run db:seed`.

Aucun changement de code n'est nécessaire : seul `.env` change.

## Scripts disponibles

| Script              | Rôle                                            |
|---------------------|-------------------------------------------------|
| `npm run db:start`  | Démarre le Postgres local embarqué              |
| `npm run db:stop`   | Arrête le Postgres local                         |
| `npm run db:migrate`| Crée/applique une migration en dev              |
| `npm run db:deploy` | Applique les migrations en prod (CI/CD)         |
| `npm run db:seed`   | Insère les ressources d'insertion               |
| `npm run db:studio` | Ouvre Prisma Studio                              |
