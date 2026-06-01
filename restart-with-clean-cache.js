#!/usr/bin/env node

// Script pour redémarrer le serveur avec nettoyage du cache
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Nettoyage du cache et redémarrage du serveur...');

// Fonction pour supprimer un dossier s'il existe
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Suppression de ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Supprimer les dossiers de cache
removeDir(path.join(__dirname, '.next'));
removeDir(path.join(__dirname, 'node_modules', '.cache'));

console.log('Redémarrage du serveur de développement...');
console.log('Exécutez la commande suivante dans votre terminal:');
console.log('npm run dev');

console.log('\nSi le problème persiste, vérifiez que:');
console.log('1. Le fichier app/layout.tsx importe EnhancedNavigation');
console.log('2. Le fichier app/components/EnhancedNavigation.tsx existe');
console.log('3. Tous les composants améliorés sont présents');