import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  if (users.length === 0) {
    console.log("Belum ada user di database. Silakan buka browser, klik Login, masukkan email sembarang, dan gunakan kode 424242.");
    return;
  }
  
  const targetUser = users[0];
  await prisma.user.update({
    where: { id: targetUser.id },
    data: { role: 'ADMIN', hostStatus: 'APPROVED' }
  });
  console.log(`Sukses! Akun ${targetUser.email || targetUser.name} telah dipromosikan menjadi ADMIN dan KAPTEN (HOST).`);
  console.log("Silakan refresh browser Anda.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
