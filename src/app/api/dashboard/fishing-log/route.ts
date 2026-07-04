import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { z } from "zod";

const fishingLogSchema = z.object({
  imageSrc: z.string().url("Invalid image URL"),
  description: z.string().optional(),
  listingId: z.string().min(1, "Listing ID is required"),
});

export async function POST(request: Request) {
  try {
    // 1. Authentication Check
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Parse and Validate Request
    const body = await request.json();
    const validationResult = fishingLogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { imageSrc, description, listingId } = validationResult.data;

    // 3. Verify Listing Ownership - User must own the listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user owns the listing OR is admin
    if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Anda bukan pemilik listing ini" },
        { status: 403 }
      );
    }

    // 4. Create Fishing Log (CatchGallery)
    const log = await prisma.catchGallery.create({
      data: {
        imageSrc,
        description,
        userId: currentUser.id,
        listingId,
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[FISHING_LOG_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    // Get fishing logs for user's listings
    const logs = await prisma.catchGallery.findMany({
      where: listingId
        ? {
            listingId,
            listing: {
              userId: currentUser.id
            }
          }
        : {
            listing: {
              userId: currentUser.id
            }
          },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            imageSrc: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[FISHING_LOG_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
