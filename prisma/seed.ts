import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing recipients
  await prisma.recipient.deleteMany()

  // Create initial recipients
  const recipients = await Promise.all([
    prisma.recipient.create({
      data: {
        name: 'pak-budi',
        position: 'Kepala Divisi',
        whatsapp: '6281234567890',
        isActive: true,
      },
    }),
    prisma.recipient.create({
      data: {
        name: 'ibu-siti',
        position: 'HRD',
        whatsapp: '6281234567891',
        isActive: true,
      },
    }),
    prisma.recipient.create({
      data: {
        name: 'resepsionis',
        position: 'Resepsionis',
        whatsapp: '6281234567892',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created recipients:', recipients.map(r => `${r.name} (${r.position})`))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
