const prisma = require('../src/config/prisma');

async function verifyConnection() {
  try {
    console.log('Testing connection to PostgreSQL via Prisma...');
    // Non-destructive raw ping query
    await prisma.$queryRaw`SELECT 1;`;
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyConnection();

