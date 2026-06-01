// Script pour tester le nombre d'offres retournées par chaque API
// node test-job-apis-count.js

const API_BASE = 'http://localhost:3005/api/jobs';

async function testJobAPIs() {
  console.log('🔍 Test du nombre d\'offres par API...\n');
  
  // Test avec une recherche simple
  const searchQuery = 'développeur';
  const location = 'France';
  
  try {
    // Test de l'API combinée
    console.log('📊 Test API combinée (/api/jobs)...');
    const response = await fetch(`${API_BASE}?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API combinée: ${data.results?.length || 0} offres trouvées`);
      console.log(`📈 Détails: Total affiché = ${data.totalDisplayed || 'N/A'}, Total disponible = ${data.totalAvailable || 'N/A'}`);
      
      // Analyser par source si disponible
      if (data.results) {
        const sources = {};
        data.results.forEach(job => {
          const source = job.source || 'Unknown';
          sources[source] = (sources[source] || 0) + 1;
        });
        
        console.log('\n📋 Répartition par source:');
        Object.entries(sources).forEach(([source, count]) => {
          console.log(`  - ${source}: ${count} offres`);
        });
      }
    } else {
      console.log(`❌ Erreur API combinée: ${response.status} ${response.statusText}`);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test des APIs individuelles
    const apis = ['adzuna', 'jooble', 'searchapi'];
    
    for (const api of apis) {
      console.log(`🎯 Test API ${api.toUpperCase()}...`);
      try {
        const apiResponse = await fetch(`${API_BASE}/${api}?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
        
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          const count = apiData.results?.length || apiData.jobs?.length || 0;
          console.log(`✅ ${api}: ${count} offres trouvées`);
          
          // Afficher les premiers titres pour vérifier la qualité
          const jobs = apiData.results || apiData.jobs || [];
          if (jobs.length > 0) {
            console.log(`   Premier emploi: "${jobs[0].title || jobs[0].job_title || 'N/A'}"`);
          }
        } else {
          console.log(`❌ Erreur ${api}: ${apiResponse.status} ${apiResponse.statusText}`);
        }
      } catch (error) {
        console.log(`❌ Erreur ${api}: ${error.message}`);
      }
      console.log('');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('💡 RECOMMANDATIONS POUR AUGMENTER LE NOMBRE D\'OFFRES:');
    console.log('1. Vérifier les limites dans /app/api/jobs/route.ts');
    console.log('2. Augmenter les paramètres resultsPerPage, num, page');
    console.log('3. Vérifier que toutes les APIs sont opérationnelles');
    console.log('4. Considérer l\'ajout de nouvelles sources d\'APIs');
    console.log('5. Implémenter la pagination pour charger plus de résultats');
    
  } catch (error) {
    console.error('❌ Erreur lors du test des APIs:', error.message);
  }
}

// Fonction helper pour attendre que le serveur soit prêt
async function waitForServer() {
  console.log('⏳ Vérification que le serveur est en marche...');
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch('http://localhost:3005/api/jobs?query=test');
      if (response.status !== 500) {
        console.log('✅ Serveur prêt!\n');
        return true;
      }
    } catch (error) {
      // Serveur pas encore prêt
    }
    console.log(`   Tentative ${i + 1}/10...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('❌ Impossible de se connecter au serveur sur localhost:3005');
  console.log('   Assurez-vous que le serveur est démarré avec: pnpm run dev --port 3005');
  return false;
}

// Exécuter le test
if (require.main === module) {
  waitForServer().then(ready => {
    if (ready) {
      testJobAPIs();
    }
  });
}

module.exports = { testJobAPIs, waitForServer };
