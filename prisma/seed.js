const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
    const id = loc.name.toLowerCase().replace(/\s+/g, "-");
    await prisma.location.upsert({
      where: { id },
      update: loc,
      create: {
        id,
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
    await pool.end();
  });
