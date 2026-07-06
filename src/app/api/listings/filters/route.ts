// @ts-nocheck
/**
 * GET /api/listings/filters
 * Filter Metadata API - Dynamic filter options
 *
 * Returns dynamic metadata for building filter UI:
 * - priceRange: min/max price from all listings
 * - boatTypes: unique boat types
 * - amenities: all available amenities
 * - fishingTypes: all fishing technologies
 *
 * All data extracted from database using Prisma aggregation
 */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface FilterMetadata {
  priceRange: {
    min: number;
    max: number;
  };
  boatTypes: string[];
  amenities: string[];
  fishingTypes: string[];
  categories: string[];
  facilities: string[];
}

export async function GET(req: Request) {
  try {
    // Execute all aggregations in parallel
    const [
      priceAggregation,
      boatTypesAggregation,
      amenitiesAggregation,
      fishingTypesAggregation,
      categoriesAggregation,
    ] = await Promise.all([
      // Price range
      prisma.listing.aggregate({
        where: { status: "APPROVED" },
        _min: { price: true },
        _max: { price: true },
      }),

      // Unique boat types
      prisma.listing.groupBy({
        by: ["boatType"],
        where: { status: "APPROVED" },
        _count: { boatType: true },
      }),

      // Amenities (from related table)
      prisma.amenity.findMany({
        select: { name: true },
        orderBy: { name: "asc" },
      }),

      // Fishing technologies (from listings)
      prisma.listing.findMany({
        where: {
          status: "APPROVED",
          fishingTechs: { isEmpty: false },
        },
        select: { fishingTechs: true },
        distinct: ["fishingTechs"],
      }),

      // Categories
      prisma.listing.groupBy({
        by: ["category"],
        where: { status: "APPROVED" },
        _count: { category: true },
      }),
    ]);

    // Extract fishing types from all listings
    const allFishingTypes = new Set<string>();
    fishingTypesAggregation.forEach((listing) => {
      listing.fishingTechs.forEach((tech) => {
        if (tech) allFishingTypes.add(tech);
      });
    });

    // Common facilities that can be used as filters
    const commonFacilities = [
      "Sarapan",
      "Kopi",
      "Teh",
      "Makan Siang",
      "Snack",
      "Minuman",
      "Handuk",
      "Life Jacket",
      "Tambatan",
      "BBM",
    ];

    // Build response
    const filterMetadata: FilterMetadata = {
      priceRange: {
        min: priceAggregation._min.price || 0,
        max: priceAggregation._max.price || 10000000,
      },
      boatTypes: boatTypesAggregation
        .map((bt) => bt.boatType)
        .filter(Boolean)
        .sort(),
      amenities: amenitiesAggregation
        .map((a) => a.name)
        .filter(Boolean),
      fishingTypes: Array.from(allFishingTypes).sort(),
      categories: categoriesAggregation
        .map((c) => c.category)
        .filter(Boolean)
        .sort(),
      facilities: commonFacilities,
    };

    // Response with cache headers (metadata changes rarely)
    const response = NextResponse.json(filterMetadata);

    // Cache for 5 minutes (metadata changes infrequently)
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return response;
  } catch (error) {
    console.error("[LISTINGS_FILTERS_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter metadata" },
      { status: 500 },
    );
  }
}
