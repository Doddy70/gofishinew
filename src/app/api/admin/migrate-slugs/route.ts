/**
 * API endpoint to generate slugs for existing listings
 * Run once: POST /api/admin/migrate-slugs
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

export async function POST() {
  try {
    // Get all listings without slug
    const listings = await prisma.listing.findMany({
      where: { slug: null },
      select: { id: true, title: true }
    });

    if (listings.length === 0) {
      return NextResponse.json({ message: "No listings without slug found" });
    }

    // Generate slugs for each listing
    const results = [];
    for (const listing of listings) {
      const slug = generateUniqueSlug(listing.title, listing.id);
      await prisma.listing.update({
        where: { id: listing.id },
        data: { slug }
      });
      results.push({ id: listing.id, slug });
    }

    return NextResponse.json({
      message: `Generated slugs for ${results.length} listings`,
      slugs: results
    });
  } catch (error) {
    console.error("[MIGRATE_SLUGS]", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { slug: null },
      select: { id: true, title: true }
    });

    return NextResponse.json({ count: listings.length, listings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check slugs" }, { status: 500 });
  }
}
