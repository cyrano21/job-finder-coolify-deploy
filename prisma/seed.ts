import { PrismaClient } from '@prisma/client'
import { INSERTION_RESOURCES } from '../app/modules/orientation/utils/knowledge-base'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding des ressources d\'insertion...')

  for (const r of INSERTION_RESOURCES) {
    // Pas de contrainte unique sur title : on évite les doublons manuellement.
    const existing = await prisma.resource.findFirst({
      where: { title: r.title },
    })
    if (existing) {
      await prisma.resource.update({
        where: { id: existing.id },
        data: {
          type: r.type,
          url: r.url ?? null,
          source: r.source ?? null,
          category: r.category,
          summary: r.summary ?? null,
          tags: r.tags ?? [],
        },
      })
    } else {
      await prisma.resource.create({
        data: {
          title: r.title,
          type: r.type,
          url: r.url ?? null,
          source: r.source ?? null,
          category: r.category,
          summary: r.summary ?? null,
          tags: r.tags ?? [],
        },
      })
    }
  }

  const count = await prisma.resource.count()
  console.log(`✅ Seed terminé. ${count} ressources en base.`)

  // ── Modèles IA par défaut (clés référencées par nom d'env, jamais stockées) ──
  console.log('🌱 Seeding des modèles IA...')
  const defaultModels = [
    { label: 'Llama 3.3 70B (Groq)', provider: 'groq', model: 'llama-3.3-70b-versatile', type: 'free', apiKeyEnv: 'GROQ_API_KEY', isDefault: true },
    { label: 'GPT-4o mini (OpenAI)', provider: 'openai', model: 'gpt-4o-mini', type: 'paid', apiKeyEnv: 'OPENAI_API_KEY', isDefault: false },
    { label: 'DeepSeek Chat', provider: 'deepseek', model: 'deepseek-chat', type: 'paid', apiKeyEnv: 'DEEPSEEK_API_KEY', isDefault: false },
    { label: 'Mistral Small', provider: 'mistral', model: 'mistral-small-latest', type: 'paid', apiKeyEnv: 'MISTRAL_API_KEY', isDefault: false },
  ]
  for (const m of defaultModels) {
    const existing = await prisma.aIModelConfig.findFirst({
      where: { provider: m.provider, model: m.model },
    })
    if (!existing) {
      await prisma.aIModelConfig.create({ data: { ...m, enabled: true } })
    }
  }
  const modelCount = await prisma.aIModelConfig.count()
  console.log(`✅ Seed terminé. ${modelCount} modèles IA en base.`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
