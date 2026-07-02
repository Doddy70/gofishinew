import { DashboardRepository } from "@/repositories/DashboardRepository";

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  /**
   * Fetches all critical dashboard metrics concurrently to reduce latency.
   * Design for failure: If one metric fails, the others shouldn't necessarily fail,
   * but for the top-level dashboard we fetch them together.
   */
  async getDashboardMetrics() {
    try {
      const [
        usersCount, 
        listingsCount, 
        reservationsCount, 
        pendingUsers,
        gmv,
        activeReservations,
        alerts
      ] = await Promise.all([
        this.dashboardRepository.getTotalUsers(),
        this.dashboardRepository.getTotalListings(),
        this.dashboardRepository.getTotalReservations(),
        this.dashboardRepository.getPendingKaptens(),
        this.dashboardRepository.getGrossMerchandiseValue(),
        this.dashboardRepository.getActiveReservationsCount(),
        this.dashboardRepository.getRecentAlerts()
      ]);

      const adminCommission = gmv * 0.15; // Assumption: 15% platform commission

      return {
        usersCount,
        listingsCount,
        reservationsCount,
        pendingUsers,
        gmv,
        adminCommission,
        activeReservations,
        alerts
      };
    } catch (error) {
      // Sentry could be integrated here for observability
      console.error("[DashboardService] Error fetching metrics:", error);
      throw new Error("Failed to fetch dashboard metrics");
    }
  }
}

import { dashboardRepository } from "@/repositories/DashboardRepository";
export const dashboardService = new DashboardService(dashboardRepository);
