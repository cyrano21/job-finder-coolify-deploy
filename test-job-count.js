// Script pour tester le nombre d'offres retournées par chaque API
const testJobApis = async () => {
  try {
    console.log('🔍 Test des APIs d\'emploi...\n');
    
    const query = 'développeur';
    const location = 'Paris';
    
    // Test de l'API agrégée
    const response = await fetch(`http://localhost:3005/api/jobs?query=${query}&location=${location}&results_per_page=100`);
    const data = await response.json();
    
    console.log('📊 RÉSULTATS TOTAUX:');
    console.log(`- Nombre total d'offres trouvées: ${data.count}`);
    console.log(`- Offres dans cette page: ${data.results.length}`);
    console.log(`- Total de pages: ${data.totalPages}`);
    console.log(`- Page actuelle: ${data.currentPage}\n`);
    
    // Compter par source
    const sources = {};
    data.results.forEach(job => {
      sources[job.source] = (sources[job.source] || 0) + 1;
    });
    
    console.log('📈 RÉPARTITION PAR SOURCE:');
    Object.entries(sources).forEach(([source, count]) => {
      console.log(`- ${source}: ${count} offres`);
    });
    
    console.log('\n🎯 RECOMMANDATIONS:');
    if (data.count < 50) {
      console.log('⚠️  Peu d\'offres trouvées. Vérifiez:');
      console.log('   - Les clés API sont valides');
      console.log('   - Les paramètres de recherche');
      console.log('   - Les limites des APIs');
    } else {
      console.log('✅ Bon nombre d\'offres trouvées!');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('💡 Assurez-vous que le serveur est démarré sur le port 3005');
  }
};

// Exécuter le test
testJobApis();
