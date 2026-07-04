const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRaw`SELECT 1`.then(() => console.log('DB works')).catch(console.error).finally(() => prisma.$disconnect());
