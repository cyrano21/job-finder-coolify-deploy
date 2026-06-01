/* eslint-disable @typescript-eslint/no-require-imports */
// Gestion d'un PostgreSQL local "embarqué" (binaires zonky via Maven Central),
// pour le développement sans installer Postgres sur la machine.
//
// Usage :
//   node scripts/pg-dev.js start   -> initialise (si besoin) et démarre le serveur
//   node scripts/pg-dev.js stop    -> arrête le serveur
//
// Données persistées dans .pgdata/ (gitignoré). Port 5432, user/pass: postgres.

const path = require('path')
const fs = require('fs')
const EmbeddedPostgres = require('embedded-postgres').default

const DATA_DIR = path.join(__dirname, '..', '.pgdata')
const PORT = 5432
const USER = 'postgres'
const PASSWORD = 'postgres'
const DB_NAME = 'jobfinder'

async function getInstance() {
  return new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
  })
}

async function start() {
  const pg = await getInstance()
  const alreadyInitialized = fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'))

  if (!alreadyInitialized) {
    console.log('🛠  Initialisation du cluster PostgreSQL local...')
    await pg.initialise()
  }

  console.log('🚀 Démarrage de PostgreSQL sur le port ' + PORT + '...')
  await pg.start()

  // Crée la base applicative si elle n'existe pas encore.
  try {
    await pg.createDatabase(DB_NAME)
    console.log(`📦 Base "${DB_NAME}" créée.`)
  } catch (e) {
    if (String(e.message || e).includes('already exists')) {
      console.log(`📦 Base "${DB_NAME}" déjà présente.`)
    } else {
      console.warn('⚠️  createDatabase:', e.message || e)
    }
  }

  console.log('\n✅ PostgreSQL est prêt.')
  console.log(
    `   DATABASE_URL="postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}?schema=public"`
  )
  console.log('\n   Laisse ce terminal ouvert. Ctrl+C pour arrêter.\n')

  // Garde le process vivant et arrête proprement sur Ctrl+C.
  const shutdown = async () => {
    console.log('\n🛑 Arrêt de PostgreSQL...')
    try {
      await pg.stop()
    } finally {
      process.exit(0)
    }
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  // Empêche le script de se terminer.
  setInterval(() => {}, 1 << 30)
}

async function stop() {
  const pg = await getInstance()
  console.log('🛑 Arrêt de PostgreSQL...')
  await pg.stop()
  console.log('✅ Arrêté.')
}

const cmd = process.argv[2]
if (cmd === 'start') {
  start().catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
} else if (cmd === 'stop') {
  stop().catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
} else {
  console.log('Usage: node scripts/pg-dev.js <start|stop>')
  process.exit(1)
}
