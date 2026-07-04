const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const listing = await prisma.listing.findUnique({
    where: { id: "cmr5o9aeb0005hvvdgg8b5epl" }
  });
  console.log("imageSrc:", listing.imageSrc);
  console.log("images:", listing.images);
}
main().finally(() => prisma.$disconnect());
