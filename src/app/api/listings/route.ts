// @ts-nocheck
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import {
  CloudinaryUploadResult,
  uploadToCloudinary,
} from "@/services/cloudinary";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/slug";
import crypto from "crypto";
import type { Listing, CreateListingInput, ApiResponse, Pagination } from "@/types/listing";

// Zod validation schema for listing creation
const createListingSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter").max(100),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"),
  price: z.string().transform(Number).refine(n => n > 0, "Harga harus lebih dari 0"),
  locationValue: z.string().min(1, "Lokasi wajib diisi"),
  boatType: z.string().optional().default("Speedboat"),
  passengerCapacity: z.string().transform(Number).refine(n => n > 0, "Kapasitas minimal 1").optional().default("5"),
  videoUrl: z.string().url("URL video tidak valid").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Convert FormData to object for Zod validation
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      locationValue: formData.get("locationValue") as string,
      image: formData.get("image") as File | null,
      legalDoc: formData.get("legalDoc") as File | null,
      boatType: formData.get("boatType") as string || "Speedboat",
      passengerCapacity: formData.get("passengerCapacity") as string || "5",
      videoUrl: formData.get("videoUrl") as string || "",
    };

    // Validate required fields
    if (!data.title || !data.description || !data.price || !data.locationValue || !data.category || !data.image) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Semua field wajib diisi: title, description, category, price, locationValue, image" },
        { status: 400 },
      );
    }

    // Validate with Zod
    const validationResult = createListingSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json<ApiResponse<null>>(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const validated = validationResult.data;

    // Upload image to Cloudinary
    const imageData: CloudinaryUploadResult = await uploadToCloudinary(data.image);

    let legalDocUrl = "";
    if (data.legalDoc && data.legalDoc.size > 0) {
      const legalData: CloudinaryUploadResult = await uploadToCloudinary(data.legalDoc);
      legalDocUrl = legalData.secure_url;
    }

    // Generate unique slug from title + ID suffix
    const tempId = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const slug = generateUniqueSlug(validated.title, tempId);

    const listing = await prisma.listing.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        price: validated.price,
        locationValue: validated.locationValue,
        locationId: validated.locationValue,
        category: validated.category,
        imageSrc: imageData.secure_url,
        legalDocs: legalDocUrl ? [legalDocUrl] : [],
        userId: currentUser.id,
        boatType: validated.boatType,
        videoUrl: validated.videoUrl || "",
        passengerCapacity: validated.passengerCapacity,
      },
    });

    // Update User to be a PENDING HOST if they aren't already verified
    if (currentUser.hostStatus === "NONE") {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          role: "HOST",
          hostStatus: "PENDING"
        }
      });
    }

    return NextResponse.json<Listing>(listing, { status: 201 });
  } catch (error) {
    console.error("[LISTINGS_POST]", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { listingRepository } from "@/repositories/ListingRepository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // Support filtering by multiple IDs for favorites
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const ids = idsParam.split(",").filter(Boolean);
      if (ids.length > 0) {
        const listings = await prisma.listing.findMany({
          where: { id: { in: ids } },
          include: { user: { select: { name: true } } },
        });
        // Preserve order from ids param
        const orderedListings = ids.map((id) =>
          listings.find((l) => l.id === id)
        ).filter(Boolean);

        return NextResponse.json<ApiResponse<Listing[]>>({
          data: orderedListings as Listing[],
          pagination: {
            page: 1,
            limit: ids.length,
            total: orderedListings.length,
            totalPages: 1,
          }
        });
      }
    }

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (searchParams.get("category")) {
      whereClause.category = searchParams.get("category");
    }
    if (searchParams.get("locationValue")) {
      whereClause.locationValue = searchParams.get("locationValue");
    }
    if (searchParams.get("minPrice")) {
      whereClause.price = { ...whereClause.price as object, gte: Number(searchParams.get("minPrice")) };
    }
    if (searchParams.get("maxPrice")) {
      whereClause.price = { ...whereClause.price as object, lte: Number(searchParams.get("maxPrice")) };
    }
    if (searchParams.get("guests")) {
      whereClause.passengerCapacity = { gte: Number(searchParams.get("guests")) };
    }

    const [listings, totalCount] = await Promise.all([
      listingRepository.getAllListings({
        category: searchParams.get("category") || undefined,
        locationValue: searchParams.get("locationValue") || undefined,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        startDate: searchParams.get("startDate") || undefined,
        endDate: searchParams.get("endDate") || undefined,
        guests: searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined,
        skip,
        take: limit,
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const pagination: Pagination = {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // Create response with cache headers for SEO
    const response = NextResponse.json<ApiResponse<Listing[]>>({
      data: listings as Listing[],
      pagination,
    });

    // Cache for 1 minute (listings change frequently)
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

    return response;
  } catch (error) {
    console.error("[LISTINGS_GET] ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
