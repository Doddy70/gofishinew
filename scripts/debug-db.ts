import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      role: "HOST",
      hostStatus: "PENDING"
    }
  });
  console.log("PENDING HOSTS IN DB:");
  console.dir(users, { depth: null });
}
main().catch(console.error).finally(() => prisma.$disconnect());
