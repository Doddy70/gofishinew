// @ts-nocheck
/**
 * GET /api/locations/[slug]
 * Get location details with nearby listings and spots
 *
 * This API serves the Location Pages (e.g., /lokasi/ancol)
 * following Airbnb's Lake Gregory pattern
 */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    // Find location by slug or name
    let location = await prisma.location.findFirst({
      where: {
        OR: [
          { id: slug },
          { name: { equals: slug, mode: "insensitive" } },
          { name: { contains: slug, mode: "insensitive" } },
        ],
      },
    });

    // If location doesn't exist in DB, create dynamic response based on slug
    // This allows for locations not yet in database
    const locationName = formatLocationName(slug);

    // Fetch listings for this location
    const listings = await prisma.listing.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { locationValue: { contains: locationName, mode: "insensitive" } },
          { locationRef: location ? { id: location.id } : undefined },
        ].filter(Boolean) as any[],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
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
      take: 50,
    });

    // Calculate average ratings
    const listingsWithRatings = listings.map((listing) => {
      const reviewCount = listing._count.reviews;
      const avgRating =
        listing.reviews.length > 0
          ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
          : null;

      return {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        imageSrc: listing.imageSrc,
        price: listing.price,
        locationValue: listing.locationValue,
        boatType: listing.boatType,
        captainName: listing.captainName,
        fishingTechs: listing.fishingTechs,
        passengerCapacity: listing.passengerCapacity,
        rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        reviewCount,
      };
    });

    // Split listings into categories
    const premiumBoats = listingsWithRatings
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);

    const popularBoats = listingsWithRatings
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 6);

    // Extract unique fishing techniques and amenities
    const allFishingTechs = [...new Set(listings.flatMap((l) => l.fishingTechs))];
    const allAmenities = [...new Set(listings.flatMap((l) => l.facilities))];

    // Get nearby locations (other locations in same region)
    let nearbyLocations: any[] = [];

    if (location) {
      nearbyLocations = await prisma.location.findMany({
        where: {
          region: location.region,
          id: { not: location.id },
        },
        take: 5,
      });
    }

    // Build response
    const response = {
      location: {
        id: location?.id || slug,
        name: locationName,
        slug: slug,
        region: location?.region || "Indonesia",
        description: getLocationDescription(locationName),
        boatCount: listings.length,
        avgPrice:
          listings.length > 0
            ? Math.round(
                listings.reduce((sum, l) => sum + l.price, 0) / listings.length
              )
            : 0,
      },
      premiumBoats,
      popularBoats,
      fishingTechniques: allFishingTechs.slice(0, 8),
      amenities: allAmenities.slice(0, 10),
      nearbyLocations,
      spots: getLocationSpots(locationName),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[LOCATION_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

// Helper functions
function formatLocationName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getLocationDescription(name: string): string {
  const descriptions: Record<string, string> = {
    ancol:
      "Surga memancing laut di pintu gerbang Jakarta dengan spot ke Pulau Bidadari dan Sundaland.",
    "kepulauan seribu":
      "110 pulau di utara Jakarta dengan spot GT, Tuna, dan Kerapu premium.",
    "sunda kelapa":
      "Pelabuhan bersejarah Jakarta dengan akses ke Muara Angke dan Muara Ciliwung.",
    merak: "Spot memancing di Selat Sunda menuju Banten dengan target Tuna dan Cakalang.",
    karimunjawa:
      "Surga memancing island hopping dengan spot Kerapu, Kakap, dan GT.",
    pangandaran:
      "Spot memancing di pantai selatan Jawa dengan berbagai teknik.",
  };

  return (
    descriptions[name.toLowerCase()] ||
    `Lokasi memancing populer di ${name}, Indonesia.`
  );
}

function getLocationSpots(name: string): string[] {
  const spots: Record<string, string[]> = {
    ancol: ["Pulau Bidadari", "Sundaland", "Pulau Pramuka", "Spot Dalam"],
    "kepulauan seribu": [
      "Pulau Pramuka",
      "Pulau Kelapa",
      "Pulau Harapan",
      "Pulau Pari",
      "Pulau Untung Jawa",
    ],
    "sunda kelapa": ["Muara Angke", "Muara Ciliwung", "Dermaga BPL", "Pulau Kotok"],
    merak: ["Selat Sunda", "Pulau Manuk", "Anyer", "Cilegon"],
    karimunjawa: [
      "Pulau Karimunjawa",
      "Pulau Menjangan",
      "Pulau Cemara",
      "Spot Dalam",
    ],
    pangandaran: ["Pangandaran", "Ciliuangung", "Sawarna", "Ciparay"],
    bandarlampung: ["Pahawang", "Krui", "Teluk Kiluan", "Pulau Pasumpahan"],
  };

  return spots[name.toLowerCase()] || [name];
}
