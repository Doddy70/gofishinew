import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateUniqueSlug } from "@/lib/slug";
import type { Listing, ApiResponse, UpdateListingInput } from "@/types/listing";

interface IParams {
  listingId?: string;
}

/**
 * GET /api/listings/[listingId]
 * Supports both ID and slug for lookup
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const { listingId } = resolvedParams;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    // Query by ID OR slug (hybrid approach)
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [
          { id: listingId },
          { slug: listingId }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            phoneNumber: true,
          },
        },
        tripMasters: {
          where: { dateEnd: { gte: new Date() } },
          select: {
            id: true,
            dateStart: true,
            dateEnd: true,
            priceTotal: true,
            pricePerSeat: true,
            maxSeats: true,
            currentSeats: true,
            status: true,
            bookingType: true,
          },
          orderBy: { dateStart: "asc" },
          take: 20,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewerId: true,
            reviewer: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },

        amenities: true,
        categoryRef: true,
        locationRef: true,
      },
    });

    if (!listing) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

    return NextResponse.json<Listing>({
      ...listing,
      avgRating: avgRating ? Number(avgRating.toFixed(1)) : null,
    } as Listing);
  } catch (error) {
    console.error("[LISTINGS_GET_BY_ID] Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings/[listingId]
 * Only owner or admin can delete
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = resolvedParams;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    // Find existing listing
    const existingListing = await prisma.listing.findFirst({
      where: {
        OR: [
          { id: listingId },
          { slug: listingId }
        ]
      }
    });

    if (!existingListing) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check authorization: Admin or owner
    const isAdmin = currentUser.role === "ADMIN";
    const isOwner = existingListing.userId === currentUser.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Forbidden: You don't have permission to delete this listing" },
        { status: 403 }
      );
    }

    // Check for active reservations (cascade protection)
    const activeReservations = await prisma.tripBooking.count({
      where: {
        tripMaster: {
          listingId: existingListing.id,
        },
        paymentStatus: {
          in: ["PENDING", "HELD", "CONFIRMED"]
        }
      }
    });

    if (activeReservations > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: `Cannot delete listing with ${activeReservations} active reservation(s). Please cancel or complete them first.`
        },
        { status: 400 }
      );
    }

    // Perform soft delete by setting status to DELETED
    await prisma.listing.update({
      where: { id: existingListing.id },
      data: { status: "DELETED" }
    });

    return NextResponse.json<ApiResponse<{ id: string }>>({
      data: { id: existingListing.id },
      message: "Listing deleted successfully"
    });
  } catch (error) {
    console.error("[LISTINGS_DELETE] Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/listings/[listingId]
 * Partial update - only update provided fields
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = resolvedParams;
    const body = await request.formData();

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    // Find listing by ID or slug
    const existingListing = await prisma.listing.findFirst({
      where: {
        OR: [
          { id: listingId },
          { slug: listingId }
        ]
      }
    });

    if (!existingListing) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check authorization: Admin or owner
    const isAdmin = currentUser.role === "ADMIN";
    const isOwner = existingListing.userId === currentUser.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Forbidden: You don't have permission to update this listing" },
        { status: 403 }
      );
    }

    // Build partial update data - only update fields that are provided
    const updateData: Record<string, unknown> = {};

    // Text fields
    if (body.has("title")) {
      updateData.title = body.get("title") as string;
      // Update slug if title changed
      const newTitle = body.get("title") as string;
      if (newTitle !== existingListing.title) {
        updateData.slug = generateUniqueSlug(newTitle, existingListing.id.slice(-8));
      }
    }
    if (body.has("description")) updateData.description = body.get("description") as string;
    if (body.has("category")) updateData.category = body.get("category") as string;
    if (body.has("boatType")) updateData.boatType = body.get("boatType") as string;
    if (body.has("locationValue")) updateData.locationValue = body.get("locationValue") as string;
    if (body.has("videoUrl")) updateData.videoUrl = body.get("videoUrl") as string;
    if (body.has("captainName")) updateData.captainName = body.get("captainName") as string;

    // Numeric fields
    if (body.has("price")) updateData.price = parseInt(body.get("price") as string, 10);
    if (body.has("passengerCapacity")) {
      updateData.passengerCapacity = parseInt(body.get("passengerCapacity") as string, 10);
    }
    if (body.has("rodHoldersCount")) {
      updateData.rodHoldersCount = parseInt(body.get("rodHoldersCount") as string, 10);
    }

    // Boolean fields
    if (body.has("hasLivewell")) {
      updateData.hasLivewell = body.get("hasLivewell") === "true";
    }
    if (body.has("providesRods")) updateData.providesRods = body.get("providesRods") === "true";
    if (body.has("providesBait")) updateData.providesBait = body.get("providesBait") === "true";
    if (body.has("providesTackle")) updateData.providesTackle = body.get("providesTackle") === "true";
    if (body.has("hasRestroom")) updateData.hasRestroom = body.get("hasRestroom") === "true";
    if (body.has("hasCabin")) updateData.hasCabin = body.get("hasCabin") === "true";
    if (body.has("hasCoolBox")) updateData.hasCoolBox = body.get("hasCoolBox") === "true";
    if (body.has("hasBiminiTop")) updateData.hasBiminiTop = body.get("hasBiminiTop") === "true";

    // Pricing
    if (body.has("weekendPrice")) {
      const wp = parseInt(body.get("weekendPrice") as string, 10);
      updateData.weekendPrice = isNaN(wp) ? null : wp;
    }
    if (body.has("holidayPrice")) {
      const hp = parseInt(body.get("holidayPrice") as string, 10);
      updateData.holidayPrice = isNaN(hp) ? null : hp;
    }

    // Image upload
    const image = body.get("image") as File | null;
    if (image && image.size > 0) {
      const uploadResponse = await uploadToCloudinary(image, "listings");
      updateData.imageSrc = uploadResponse.secure_url;
    }

    // Legal doc upload
    const legalDoc = body.get("legalDoc") as File | null;
    if (legalDoc && legalDoc.size > 0) {
      const uploadResponse = await uploadToCloudinary(legalDoc, "legal_docs");
      updateData.legalDocs = [uploadResponse.secure_url];
    }

    // Perform partial update
    const listing = await prisma.listing.update({
      where: {
        id: existingListing.id,
      },
      data: updateData,
    });

    return NextResponse.json<Listing>(listing as Listing);
  } catch (error) {
    console.error("[LISTINGS_PATCH] Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
