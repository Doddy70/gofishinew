// @ts-nocheck
/**
 * GET /api/captain/transactions
 * Get transaction history for the captain
 *
 * Query Parameters:
 * - type (optional): Filter by type (PAYOUT, COMMISSION, REFUND, BOOKING)
 * - status (optional): Filter by status (PENDING, COMPLETED, FAILED)
 * - page (optional): Page number (default: 1)
 * - limit (optional): Items per page (default: 20)
 *
 * GET /api/captain/transactions/summary
 * Get earnings summary
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

    // Verify user is a captain (HOST role)
    if (currentUser.role !== "HOST" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied - Captain account required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: currentUser.id,
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Fetch transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transactionHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transactionHistory.count({ where }),
    ]);

    // Calculate summary
    const summary = await prisma.transactionHistory.groupBy({
      by: ["type", "status"],
      where: { userId: currentUser.id },
      _sum: { amount: true },
      _count: true,
    });

    // Format summary
    const formattedSummary = {
      totalEarnings: 0,
      pendingPayouts: 0,
      completedPayouts: 0,
      totalCommissions: 0,
      totalRefunds: 0,
      byType: {} as Record<string, { count: number; total: number }>,
    };

    for (const item of summary) {
      const key = `${item.type}_${item.status}`;
      const amount = item._sum.amount || 0;
      const count = item._count;

      formattedSummary.byType[key] = { count, total: amount };

      if (item.type === "PAYOUT") {
        if (item.status === "COMPLETED") {
          formattedSummary.completedPayouts += amount;
          formattedSummary.totalEarnings += amount;
        } else if (item.status === "PENDING") {
          formattedSummary.pendingPayouts += amount;
        }
      } else if (item.type === "COMMISSION") {
        formattedSummary.totalCommissions += amount;
      } else if (item.type === "REFUND") {
        formattedSummary.totalRefunds += amount;
      }
    }

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      summary: formattedSummary,
    });
  } catch (error) {
    console.error("[CAPTAIN_TRANSACTIONS_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
