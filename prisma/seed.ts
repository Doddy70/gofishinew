import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const locations = [
    { name: "Marina Ancol", region: "Jakarta Utara" },
    { name: "Pantai Mutiara", region: "Jakarta Utara" },
    { name: "Kepulauan Seribu", region: "DKI Jakarta" },
    { name: "Muara Angke", region: "Jakarta Utara" },
    { name: "Sunda Kelapa", region: "Jakarta Utara" },
  ];

  console.log("Seeding locations...");

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.name.toLowerCase().replace(/\s+/g, "-") },
      update: loc,
      create: {
        id: loc.name.toLowerCase().replace(/\s+/g, "-"),
        ...loc,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
