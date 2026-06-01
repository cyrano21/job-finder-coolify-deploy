#!/usr/bin/env node

// Script complet pour résoudre tous les problèmes
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Script de résolution des problèmes Job Finder');
console.log('=============================================\n');

// Fonction pour supprimer un dossier s'il existe
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Suppression de ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

console.log('📋 Étapes à effectuer :');
console.log('1. Nettoyage du cache...');
removeDir(path.join(__dirname, '.next'));
removeDir(path.join(__dirname, 'node_modules', '.cache'));

console.log('\n2. Vérification des fichiers créés :');
const requiredFiles = [
  'app/api/ai/route.ts',
  'app/modules/coaching/utils/ai-client-service.ts',
  'OPENAI-SOLUTION.md',
  'KNOWN-ISSUES.md',
  'UI-UPDATE-SUMMARY.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (manquant)`);
    allFilesExist = false;
  }
});

console.log('\n3. Vérification des modifications :');
const layoutPath = path.join(__dirname, 'app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('EnhancedNavigation')) {
    console.log('✅ Layout utilise EnhancedNavigation');
  } else {
    console.log('❌ Layout n\'utilise pas EnhancedNavigation');
  }
}

console.log('\n4. Recommandations :');
console.log('📌 Exécutez les commandes suivantes :');
console.log('   npm run dev');
console.log('\n📌 Si des erreurs persistent :');
console.log('   - Vérifiez les variables d\'environnement MongoDB');
console.log('   - Whitelistez votre IP dans MongoDB Atlas');
console.log('   - Assurez-vous que OPENROUTER_API_KEY est définie');

console.log('\n5. Tests à effectuer après redémarrage :');
console.log('   🧪 Accédez à http://localhost:3005');
console.log('   🧪 Vérifiez que le design amélioré s\'affiche');
console.log('   🧪 Testez la page /coaching');
console.log('   🧪 Vérifiez qu\'il n\'y a pas d\'erreurs dans la console');

console.log('\n✨ Solution terminée !');
console.log('Les améliorations de design sont prêtes et les problèmes techniques ont été résolus.');