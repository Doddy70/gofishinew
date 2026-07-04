import prisma from "@/lib/prisma";

export class DashboardRepository {
  async getTotalUsers(): Promise<number> {
    return prisma.user.count();
  }

  async getTotalListings(): Promise<number> {
    return prisma.listing.count();
  }

  async getTotalReservations(): Promise<number> {
    return prisma.tripBooking.count();
  }

  // --- NEW: Financial & Operational Metrics ---
  
  async getGrossMerchandiseValue(): Promise<number> {
    const result = await prisma.tripBooking.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    return result._sum.totalAmount || 0;
  }

  async getActiveReservationsCount(): Promise<number> {
    const now = new Date();
    return prisma.tripBooking.count({
      where: {
        tripMaster: {
          dateStart: { lte: now },
          dateEnd: { gte: now },
        }
      },
    });
  }

  async getRecentAlerts() {
    // Mocking alerts for now as we might not have a dedicated alerts table yet.
    return [
      { id: "1", type: "urgent", message: "Keluhan pelanggan: Perahu tidak sesuai deskripsi (Booking #1029)", time: "10 menit yang lalu" },
      { id: "2", type: "warning", message: "Pembatalan mendadak karena cuaca buruk di area Bali", time: "1 jam yang lalu" },
      { id: "3", type: "info", message: "2 vendor baru menunggu verifikasi dokumen Grosse Akta", time: "3 jam yang lalu" },
    ];
  }

  async getPendingKaptens() {
    return prisma.user.findMany({
      where: {
        hostStatus: "PENDING",
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            boatType: true,
            legalDocs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
