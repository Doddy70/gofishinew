// @ts-nocheck
/**
 * POST /api/listings/[listingId]/blocked-dates
 * Add a blocked date for a listing
 *
 * Body:
 * - date (required): Date string (YYYY-MM-DD)
 * - reason (optional): Reason for blocking
 */

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const BlockDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  reason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = params;

    // Validate listing ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Only owner or admin can block dates
    if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - You don't own this listing" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = BlockDateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { date, reason } = validation.data;

    // Check if already blocked
    const existing = await prisma.blockedDate.findFirst({
      where: {
        listingId,
        date: new Date(date),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Date is already blocked" },
        { status: 400 }
      );
    }

    // Create blocked date
    const blockedDate = await prisma.blockedDate.create({
      data: {
        listingId,
        date: new Date(date),
        reason,
      },
    });

    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error) {
    console.error("[BLOCKED_DATES_POST] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to block date" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings/[listingId]/blocked-dates?id=xxx
 * Remove a blocked date
 */
export async function DELETE(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = params;
    const { searchParams } = new URL(req.url);
    const blockedDateId = searchParams.get("id");

    if (!blockedDateId) {
      return NextResponse.json(
        { error: "blockedDateId is required" },
        { status: 400 }
      );
    }

    // Validate listing ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.blockedDate.delete({
      where: { id: blockedDateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BLOCKED_DATES_DELETE] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to unblock date" },
      { status: 500 }
    );
  }
}
