import { config } from "dotenv";
config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.listing.findFirst().then(l => console.log("Success", l?.id)).catch(console.error).finally(() => prisma.$disconnect());
