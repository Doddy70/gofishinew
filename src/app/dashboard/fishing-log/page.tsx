import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import FishingLogClient from "./FishingLogClient";

export default async function FishingLogPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const logs = await prisma.catchGallery.findMany({
    where: { userId: currentUser.id },
    include: { listing: true },
    orderBy: { createdAt: "desc" }
  });

  const listings = await prisma.listing.findMany({
    where: { userId: currentUser.id },
    select: { id: true, title: true }
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fishing Log (Spot Gacor)</h1>
        <p className="text-gray-500">Pamerkan hasil tangkapan terbaik dari trip Anda sebagai testimoni visual bagi penyewa.</p>
      </div>
      
      <FishingLogClient initialLogs={logs as any} listings={listings as any} />
    </div>
  );
}
