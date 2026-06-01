// Script simple pour tester pourquoi il n'y a que 20 offres d'emploi
const testJobs = async () => {
  console.log('🔍 Test des APIs d\'emploi...');
  
  try {
    const response = await fetch('http://localhost:3005/api/jobs?query=developpeur&location=paris');
    const data = await response.json();
    
    console.log('📊 Résultats:', {
      status: response.status,
      totalJobs: data.jobs?.length || 0,
      hasMore: data.hasMore,
      pagination: data.pagination,
      sources: data.sources || {}
    });
    
    if (data.jobs) {
      const sourceCounts = {};
      data.jobs.forEach(job => {
        sourceCounts[job.source] = (sourceCounts[job.source] || 0) + 1;
      });
      
      console.log('📈 Répartition par source:', sourceCounts);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

// Lancer le test
if (typeof window !== 'undefined') {
  window.testJobs = testJobs;
  console.log('💡 Utilisez window.testJobs() dans la console du navigateur');
} else {
  testJobs();
}
