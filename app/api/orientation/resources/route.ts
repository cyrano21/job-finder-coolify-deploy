import { NextResponse, type NextRequest } from 'next/server'
import prisma from '@/app/lib/prisma'
import { INSERTION_RESOURCES } from '@/app/modules/orientation/utils/knowledge-base'

// GET /api/orientation/resources?category=revenu
// Renvoie les ressources d'insertion. Si la table est vide, retombe sur la
// base de connaissances statique (utile tant qu'aucun seed n'a été lancé).
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')

    const dbResources = await prisma.resource.findMany({
      where: category ? { category } : undefined,
      orderBy: { title: 'asc' },
    })

    if (dbResources.length > 0) {
      return NextResponse.json({ resources: dbResources, source: 'db' })
    }

    // Fallback statique filtré par catégorie le cas échéant.
    const fallback = category
      ? INSERTION_RESOURCES.filter((r) => r.category === category)
      : INSERTION_RESOURCES
    return NextResponse.json({ resources: fallback, source: 'static' })
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
