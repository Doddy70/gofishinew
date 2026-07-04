// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import FinanceClient from "./FinanceClient";

export default async function AdminFinancePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  // Get total volume and commission stats
  const reservations = await prisma.tripBooking.findMany({
    where: { paymentStatus: "PAID" },
    include: { user: true, tripMaster: { include: { listing: { include: { user: true } } } } }
  });

  const users = await prisma.user.findMany({
    where: { role: "HOST" },
    select: { id: true, name: true, email: true, commissionRate: true }
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Keuangan & Komisi</h1>
        <p className="text-gray-500">Atur struktur komisi platform dan pantau performa pendapatan.</p>
      </div>
      
      <FinanceClient initialUsers={users as any} reservations={reservations as any} />
    </div>
  );
}
