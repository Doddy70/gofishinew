// @ts-nocheck
/**
 * GET /api/listings/search
 * Advanced Search & Filter API - Airbnb-style
 *
 * Query Parameters:
 * - q / locationValue (String) - Pencarian berbasis wilayah/nama
 * - minPrice & maxPrice (Number) - Filter rentang harga
 * - guests (Number) - Total tamu
 * - checkIn & checkOut (Date) - Filter ketersediaan
 * - amenities (String, comma-separated) - Filter fasilitas
 * - boatType (String, comma-separated) - Filter kategori perahu
 * - instantBook (Boolean) - Filter perahu yang bisa langsung dipesan
 * - page & limit (Number) - Pagination
 */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Listing, ApiResponse, Pagination } from "@/types/listing";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Record<string, unknown> = {
      status: "APPROVED", // Only show approved listings
    };

    // 1. Text search (locationValue or title)
    const q = searchParams.get("q") || searchParams.get("locationValue");
    if (q) {
      whereClause.OR = [
        { locationValue: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // 2. Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) (whereClause.price as Record<string, number>).gte = Number(minPrice);
      if (maxPrice) (whereClause.price as Record<string, number>).lte = Number(maxPrice);
    }

    // 3. Guest capacity filter
    const guests = searchParams.get("guests");
    if (guests) {
      whereClause.passengerCapacity = { gte: Number(guests) };
    }

    // 4. Boat type filter (comma-separated)
    const boatType = searchParams.get("boatType");
    if (boatType) {
      const boatTypes = boatType.split(",").map((t) => t.trim()).filter(Boolean);
      if (boatTypes.length > 0) {
        whereClause.boatType = { in: boatTypes };
      }
    }

    // 5. Instant book filter (REAL_TIME = can instant book)
    const instantBook = searchParams.get("instantBook");
    if (instantBook === "true") {
      whereClause.bookingApprovalType = "REAL_TIME";
    }

    // 6. Amenities filter (comma-separated)
    const amenities = searchParams.get("amenities");
    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim().toLowerCase()).filter(Boolean);
      if (amenityList.length > 0) {
        // Map common amenities to Listing fields
        const amenityConditions: Record<string, string[]> = {
          wifi: [],
          ac: ["AC", "ac"],
          kitchen: ["Dapur", "kitchen"],
          bathroom: ["Kamar Mandi", "bathroom"],
          livewell: [],
          fishfinder: [],
          gps: [],
          cabin: [],
          restroom: [],
        };

        // Build facility-based filter
        const facilityFilters: string[] = [];
        for (const amenity of amenityList) {
          switch (amenity) {
            case "wifi":
              // Could add hasWifi field if needed
              break;
            case "ac":
              facilityFilters.push("AC");
              break;
            case "kitchen":
              facilityFilters.push("Dapur");
              break;
            case "bathroom":
              facilityFilters.push("Kamar Mandi");
              break;
            case "livewell":
              whereClause.hasLivewell = true;
              break;
            case "fishfinder":
              whereClause.hasFishFinder = true;
              break;
            case "gps":
              whereClause.hasGPS = true;
              break;
            case "cabin":
              whereClause.hasCabin = true;
              break;
            case "restroom":
              whereClause.hasRestroom = true;
              break;
          }
        }

        if (facilityFilters.length > 0) {
          whereClause.facilities = { hasSome: facilityFilters };
        }
      }
    }

    // 7. Category filter
    const category = searchParams.get("category");
    if (category) {
      whereClause.category = category;
    }

    // 8. Date availability filter (checkIn & checkOut)
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      // Find listings that have TripMasters available in the date range
      // and have enough seats
      const bookedListingIds = await prisma.tripMaster.findMany({
        where: {
          dateStart: { lte: endDate },
          dateEnd: { gte: startDate },
          status: { in: ["CONFIRMED", "SEARCHING"] },
        },
        select: { listingId: true },
        distinct: ["listingId"],
      });

      const bookedIds = bookedListingIds.map((t) => t.listingId);

      // Get listings with available seats in the date range
      const availableTrips = await prisma.tripMaster.findMany({
        where: {
          dateStart: { gte: startDate },
          dateEnd: { lte: endDate },
          status: "SEARCHING",
          currentSeats: { gt: 0 },
        },
        select: { listingId: true },
        distinct: ["listingId"],
      });

      const availableIds = availableTrips.map((t) => t.listingId);

      // Listings that are either not in booked list OR have available trips
      if (bookedIds.length > 0 && availableIds.length > 0) {
        whereClause.id = {
          in: availableIds.filter((id) => !bookedIds.includes(id)),
        };
      } else if (availableIds.length > 0) {
        whereClause.id = { in: availableIds };
      } else if (bookedIds.length > 0) {
        whereClause.id = { notIn: bookedIds };
      }
    }

    // Execute query with pagination
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          amenities: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: [
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    // Calculate average ratings
    const listingsWithRatings = listings.map((listing) => {
      const reviewCount = listing._count.reviews;
      const avgRating =
        listing.reviews.length > 0
          ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
          : null;

      return {
        ...listing,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        reviewCount,
        reviews: undefined,
        _count: undefined,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    const pagination: Pagination = {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // Response with cache headers
    const response = NextResponse.json<ApiResponse<Listing[]>>({
      data: listingsWithRatings as unknown as Listing[],
      pagination,
    });

    // Cache for 30 seconds (listings change frequently)
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");

    return response;
  } catch (error) {
    console.error("[LISTINGS_SEARCH_GET] ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to search listings" },
      { status: 500 },
    );
  }
}
