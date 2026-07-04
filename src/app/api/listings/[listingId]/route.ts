import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateUniqueSlug } from "@/lib/slug";

interface IParams {
  listingId?: string;
}

/**
 * GET /api/listings/[listingId]
 * Supports both ID and slug for lookup
 * - ID: "cmr5o9al60006hvvdzze1pjwp" (backwards compatible)
 * - Slug: "km-pesona-laut-ancol-cmr5o9al" (SEO friendly)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const { listingId } = resolvedParams;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Query by ID OR slug (hybrid approach)
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [
          { id: listingId },           // Support old ID URLs
          { slug: listingId }         // Support new slug URLs
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
        reservations: {
          where: {
            status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
            endDate: { gte: new Date() }
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
        amenities: true,
        categoryRef: true,
        locationRef: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

    return NextResponse.json({
      ...listing,
      avgRating: avgRating ? Number(avgRating.toFixed(1)) : null,
    });
  } catch (error) {
    console.error("[LISTINGS_GET_BY_ID] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = resolvedParams;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deleteCondition: any = {
      OR: [
        { id: listingId },
        { slug: listingId }
      ]
    };

    if (currentUser.role !== "ADMIN") {
      deleteCondition.userId = currentUser.id;
    }

    const listing = await prisma.listing.deleteMany({
      where: deleteCondition,
    });

    return NextResponse.json(listing);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = resolvedParams;
    const body = await request.formData();

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
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
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (currentUser.role !== "ADMIN" && existingListing.userId !== currentUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = body.get("title") as string;
    const description = body.get("description") as string;
    const price = body.get("price") as string;
    const locationValue = body.get("locationValue") as string;
    const category = body.get("category") as string;
    const boatType = body.get("boatType") as string;
    const passengerCapacity = body.get("passengerCapacity") as string;
    const rodHoldersCount = body.get("rodHoldersCount") as string;
    const image = body.get("image") as File | null;
    const legalDoc = body.get("legalDoc") as File | null;

    let imageSrc = existingListing.imageSrc;
    if (image && image.size > 0) {
      const uploadResponse = await uploadToCloudinary(image, "listings");
      imageSrc = uploadResponse.secure_url;
    }

    let legalDocs = existingListing.legalDocs;
    if (legalDoc && legalDoc.size > 0) {
      const uploadResponse = await uploadToCloudinary(legalDoc, "legal_docs");
      legalDocs = [uploadResponse.secure_url];
    }

    // Update slug if title changed
    let slug = existingListing.slug;
    if (title && title !== existingListing.title) {
      slug = generateUniqueSlug(title, existingListing.id.slice(-8));
    }

    const listing = await prisma.listing.update({
      where: {
        id: existingListing.id,
      },
      data: {
        title,
        slug,
        description,
        imageSrc,
        category,
        boatType,
        passengerCapacity: parseInt(passengerCapacity, 10),
        rodHoldersCount: parseInt(rodHoldersCount, 10),
        price: parseInt(price, 10),
        locationValue,
        legalDocs
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[LISTINGS_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
