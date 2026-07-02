import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { name: 'Kapten Budi' } });
  console.log("USERS:", users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
