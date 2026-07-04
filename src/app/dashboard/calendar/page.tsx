// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import CalendarClient from "./CalendarClient";

export default async function KaptenCalendarPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  // Get listings owned by the current host
  const listings = await prisma.listing.findMany({
    where: { userId: currentUser.id },
    include: {
      reservations: {
        where: { status: "APPROVED" },
        include: { user: true }
      },
      blockedDates: true
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kalender & Jadwal Pancing</h1>
        <p className="text-gray-500">Kelola ketersediaan armada dan pantau jadwal trip mendatang.</p>
      </div>
      
      <CalendarClient listings={listings as any} />
    </div>
  );
}
