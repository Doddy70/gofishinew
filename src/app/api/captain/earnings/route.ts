// @ts-nocheck
/**
 * GET /api/captain/earnings
 * Get detailed earnings summary for the captain
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify user is a captain
    if (currentUser.role !== "HOST" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied - Captain account required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "all"; // all, month, year
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(2024, 0, 1); // Start from beginning of 2024
    }

    // Get captain's listings
    const listings = await prisma.listing.findMany({
      where: { userId: currentUser.id },
      select: { id: true, title: true },
    });

    const listingIds = listings.map((l) => l.id);

    // Get transactions in period
    const transactions = await prisma.transactionHistory.findMany({
      where: {
        userId: currentUser.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate earnings
    const earnings = {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      byType: {} as Record<string, number>,
      byMonth: {} as Record<string, number>,
    };

    for (const tx of transactions) {
      earnings.byType[tx.type] = (earnings.byType[tx.type] || 0) + tx.amount;

      if (tx.status === "COMPLETED") {
        if (tx.type === "PAYOUT") {
          earnings.completed += tx.amount;
          earnings.total += tx.amount;
        }
      } else if (tx.status === "PENDING" && tx.type === "PAYOUT") {
        earnings.pending += tx.amount;
      } else if (tx.status === "FAILED") {
        earnings.failed += tx.amount;
      }

      // Group by month
      const monthKey = `${tx.createdAt.getFullYear()}-${String(tx.createdAt.getMonth() + 1).padStart(2, "0")}`;
      earnings.byMonth[monthKey] = (earnings.byMonth[monthKey] || 0) + (tx.status === "COMPLETED" && tx.type === "PAYOUT" ? tx.amount : 0);
    }

    // Get booking stats
    const tripMasters = await prisma.tripMaster.findMany({
      where: {
        listingId: { in: listingIds },
        dateStart: { gte: startDate },
      },
      select: {
        id: true,
        priceTotal: true,
        currentSeats: true,
        maxSeats: true,
        status: true,
        dateStart: true,
      },
    });

    const bookingStats = {
      totalTrips: tripMasters.length,
      completedTrips: tripMasters.filter((t) => t.status === "COMPLETED").length,
      upcomingTrips: tripMasters.filter((t) => t.status === "CONFIRMED").length,
      totalRevenue: tripMasters.reduce((sum, t) => sum + (t.status === "COMPLETED" ? t.priceTotal : 0), 0),
      occupancyRate:
        tripMasters.length > 0
          ? Math.round(
              (tripMasters.reduce((sum, t) => sum + t.currentSeats) /
                tripMasters.reduce((sum, t) => sum + t.maxSeats)) *
                100
            )
          : 0,
    };

    return NextResponse.json({
      period,
      startDate,
      endDate: now,
      earnings,
      bookingStats,
      listings: listings.length,
      commissionRate: currentUser.commissionRate,
    });
  } catch (error) {
    console.error("[CAPTAIN_EARNINGS_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
