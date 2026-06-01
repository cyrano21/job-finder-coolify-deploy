/* eslint-disable @typescript-eslint/no-require-imports */
// Test script pour vérifier les APIs de recherche d'emploi
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

const envLocal = path.resolve('.env.local')
const envDefault = path.resolve('.env')
const envPath = fs.existsSync(envLocal) ? envLocal : envDefault

dotenv.config({ path: envPath })
if (process.env.NODE_ENV !== 'production') {
  console.log(`ℹ️ Chargement des variables depuis ${envPath}`)
}

async function testAdzunaAPI () {
  console.log("🔍 Test de l'API Adzuna...")

  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey || appId === 'VOTRE_APP_ID') {
    console.log('❌ Adzuna: Clés API manquantes ou non configurées')
    return
  }

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/fr/search/1?app_id=${appId}&app_key=${appKey}&what=développeur&where=Paris&results_per_page=5`
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok && data.results) {
      console.log(`✅ Adzuna: ${data.results.length} offres trouvées`)
      console.log(
        `   Exemple: ${data.results[0]?.title} chez ${data.results[0]?.company?.display_name}`
      )
    } else {
      console.log('❌ Adzuna: Erreur dans la réponse', data)
    }
  } catch (error) {
    console.log('❌ Adzuna: Erreur de connexion', error.message)
  }
}

async function testSearchAPI () {
  console.log('🔍 Test de SearchAPI...')

  const apiKey = process.env.SEARCHAPI_API_KEY

  if (!apiKey || apiKey === 'VOTRE_SEARCHAPI_KEY') {
    console.log('❌ SearchAPI: Clé API manquante ou non configurée')
    return
  }

  try {
    const url = `https://www.searchapi.io/api/v1/search?engine=google_jobs&q=développeur&location=Paris&api_key=${apiKey}&hl=fr&gl=fr&num=5`
    const response = await fetch(url, {
      headers: { 'User-Agent': 'JobFinder/1.0' }
    })
    const data = await response.json()

    if (response.ok && data.jobs_results) {
      console.log(`✅ SearchAPI: ${data.jobs_results.length} offres trouvées`)
      console.log(
        `   Exemple: ${data.jobs_results[0]?.title} chez ${data.jobs_results[0]?.company_name}`
      )
    } else {
      console.log('❌ SearchAPI: Erreur dans la réponse', data)
    }
  } catch (error) {
    console.log('❌ SearchAPI: Erreur de connexion', error.message)
  }
}

async function testJoobleAPI () {
  console.log("🔍 Test de l'API Jooble...")

  const apiKey = process.env.JOOBLE_API_KEY

  if (!apiKey || apiKey === 'VOTRE_JOOBLE_KEY') {
    console.log('❌ Jooble: Clé API manquante ou non configurée')
    return
  }

  try {
    const url = `https://jooble.org/api/${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: 'développeur', location: 'Paris' })
    })
    const data = await response.json()

    if (response.ok && data.jobs) {
      console.log(`✅ Jooble: ${data.jobs.length} offres trouvées`)
      console.log(
        `   Exemple: ${data.jobs[0]?.title} chez ${data.jobs[0]?.company}`
      )
    } else {
      console.log('❌ Jooble: Erreur dans la réponse', data)
    }
  } catch (error) {
    console.log('❌ Jooble: Erreur de connexion', error.message)
  }
}

async function runTests () {
  console.log("🚀 Test des APIs de recherche d'emploi\n")

  await testAdzunaAPI()
  console.log('')
  await testSearchAPI()
  console.log('')
  await testJoobleAPI()

  console.log('\n📝 Instructions:')
  console.log(
    '1. Remplacez les valeurs "VOTRE_*" dans .env.local par vos vraies clés API'
  )
  console.log('2. Adzuna: https://developer.adzuna.com/')
  console.log('3. SearchAPI: https://www.searchapi.io/')
  console.log('4. Jooble: https://jooble.org/api/about')
}

runTests().catch(console.error)
