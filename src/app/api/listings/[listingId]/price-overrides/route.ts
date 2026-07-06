// @ts-nocheck
/**
 * POST /api/listings/[listingId]/price-overrides
 * Set a price override for a specific date
 *
 * Body:
 * - date (required): Date string (YYYY-MM-DD)
 * - price (required): Override price
 * - type (required): WEEKEND | HOLIDAY | CUSTOM
 * - label (optional): Display label
 */

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const PriceOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  price: z.number().positive("Price must be positive"),
  type: z.enum(["WEEKEND", "HOLIDAY", "CUSTOM"]),
  label: z.string().optional(),
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

    if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = PriceOverrideSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { date, price, type, label } = validation.data;

    // Check if override already exists
    const existing = await prisma.priceOverride.findFirst({
      where: {
        listingId,
        date: new Date(date),
      },
    });

    if (existing) {
      // Update existing
      const updated = await prisma.priceOverride.update({
        where: { id: existing.id },
        data: { price, type, label },
      });
      return NextResponse.json(updated);
    }

    // Create new
    const priceOverride = await prisma.priceOverride.create({
      data: {
        listingId,
        date: new Date(date),
        price,
        type,
        label,
      },
    });

    return NextResponse.json(priceOverride, { status: 201 });
  } catch (error) {
    console.error("[PRICE_OVERRIDES_POST] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to set price override" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings/[listingId]/price-overrides?id=xxx
 * Remove a price override
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
    const overrideId = searchParams.get("id");

    if (!overrideId) {
      return NextResponse.json(
        { error: "overrideId is required" },
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

    await prisma.priceOverride.delete({
      where: { id: overrideId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRICE_OVERRIDES_DELETE] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove price override" },
      { status: 500 }
    );
  }
}
