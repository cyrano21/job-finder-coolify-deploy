'use client'

import Link from 'next/link'

export default function UITestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test de l'Interface Utilisateur Améliorée</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test des boutons */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Boutons Améliorés</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Bouton Primaire</button>
              <button className="btn btn-secondary">Bouton Secondaire</button>
              <button className="btn btn-accent">Bouton Accent</button>
            </div>
          </div>
          
          {/* Test des cartes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cartes Améliorées</h2>
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="font-medium mb-2">Carte Standard</h3>
                <p className="text-gray-600 text-sm">Ceci est une carte avec le style amélioré.</p>
              </div>
              <div className="card card-hover p-4">
                <h3 className="font-medium mb-2">Carte avec Effet Hover</h3>
                <p className="text-gray-600 text-sm">Cette carte a un effet de survol amélioré.</p>
              </div>
            </div>
          </div>
          
          {/* Test des badges */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Badges Améliorés</h2>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">Badge Primaire</span>
              <span className="badge badge-accent">Badge Accent</span>
              <span className="badge badge-success">Badge Succès</span>
              <span className="badge badge-warning">Badge Avertissement</span>
              <span className="badge badge-info">Badge Info</span>
            </div>
          </div>
          
          {/* Test des dégradés de texte */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Dégradés de Texte</h2>
            <div className="space-y-2">
              <p className="text-gradient-primary text-lg font-medium">Texte avec Dégradé Primaire</p>
              <p className="text-gradient-accent text-lg font-medium">Texte avec Dégradé Accent</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-primary">
            Retour à l'Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}