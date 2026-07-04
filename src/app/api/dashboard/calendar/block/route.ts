import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { z } from "zod";

const blockDateSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  reason: z.string().optional().default("Maintenance"),
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
    const validationResult = blockDateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { listingId, date, reason } = validationResult.data;

    // 3. Verify Listing Ownership
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

    // Check ownership OR admin
    if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Anda bukan pemilik listing ini" },
        { status: 403 }
      );
    }

    // 4. Check for existing block on same date
    const existingBlock = await prisma.blockedDate.findFirst({
      where: {
        listingId,
        date: new Date(date)
      }
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: "Tanggal sudah diblokir sebelumnya" },
        { status: 409 }
      );
    }

    // 5. Create Blocked Date
    const blockedDate = await prisma.blockedDate.create({
      data: {
        date: new Date(date),
        reason,
        listingId
      }
    });

    return NextResponse.json(blockedDate);
  } catch (error) {
    console.error("[BLOCK_DATE_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Authentication Check
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get blocked date ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing blocked date ID" },
        { status: 400 }
      );
    }

    // 3. Verify ownership via listing
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { id },
      include: {
        listing: {
          select: { userId: true }
        }
      }
    });

    if (!blockedDate) {
      return NextResponse.json(
        { error: "Blocked date not found" },
        { status: 404 }
      );
    }

    // 4. Authorization Check
    if (blockedDate.listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 5. Delete Blocked Date
    await prisma.blockedDate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BLOCK_DATE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
