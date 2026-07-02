import prisma from "@/lib/prisma";
import VerificationList from "./VerificationList";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminVerificationsPage() {
  const pendingKaptens = await prisma.user.findMany({
    where: {
      role: "HOST",
      hostStatus: "PENDING"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  console.log("=== DIAGNOSTIC: PENDING VENDORS FETCHED BY NEXT.JS ===", pendingKaptens.length);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Verifikasi Kapten</h1>
        <p className="text-gray-500 font-medium mt-2">
          Tinjau dan setujui pendaftaran kapten baru beserta dokumen operasional mereka untuk menjaga keamanan platform.
        </p>
      </div>

      <VerificationList initialKaptens={pendingKaptens} />
    </div>
  );
}
