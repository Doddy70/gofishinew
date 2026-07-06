const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const listing = await prisma.listing.findFirst({ select: { slug: true } });
  console.log(listing?.slug);
}
main().catch(console.error).finally(() => prisma.$disconnect());
