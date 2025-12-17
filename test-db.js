// Simple script to test database connection and seed data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing database connection...');

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    // Check existing recipients
    const existingRecipients = await prisma.recipient.findMany();
    console.log(`📊 Found ${existingRecipients.length} recipients in database`);

    if (existingRecipients.length === 0) {
      console.log('🌱 Seeding database...');

      // Clear existing recipients
      await prisma.recipient.deleteMany();

      // Create initial recipients
      const recipients = await Promise.all([
        prisma.recipient.create({
          data: {
            name: 'pak-budi',
            position: 'Kepala Divisi',
            whatsapp: '+6281234567890',
            isActive: true,
          },
        }),
        prisma.recipient.create({
          data: {
            name: 'ibu-siti',
            position: 'HRD',
            whatsapp: '+6281234567891',
            isActive: true,
          },
        }),
        prisma.recipient.create({
          data: {
            name: 'resepsionis',
            position: 'Resepsionis',
            whatsapp: '+6281234567892',
            isActive: true,
          },
        }),
      ]);

      console.log('✅ Database seeded successfully!');
      console.log('📋 Created recipients:');
      recipients.forEach(r => console.log(`   - ${r.name} (${r.position}): ${r.whatsapp}`));
    } else {
      console.log('📋 Existing recipients:');
      existingRecipients.forEach(r => console.log(`   - ${r.name} (${r.position}): ${r.whatsapp} [${r.isActive ? 'Active' : 'Inactive'}]`));
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
