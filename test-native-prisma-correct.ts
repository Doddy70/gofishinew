import { config } from "dotenv";
config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    }
  }
});
prisma.listing.findFirst().then(l => console.log("Success", l?.id)).catch(console.error).finally(() => prisma.$disconnect());
