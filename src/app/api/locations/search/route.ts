import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (query.length < 1) {
      return NextResponse.json([]);
    }

    // Search distinct locations from listings
    // Returns locations with available boats (trips not full)
    const locations = await prisma.location.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { region: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        listings: {
          where: {
            // Only count listings with open trips
            tripMasters: {
              some: {
                status: { in: ["SEARCHING", "CONFIRMED"] },
                currentSeats: { gt: 0 },
                dateStart: { gte: new Date() },
              },
            },
          },
          select: { id: true },
        },
      },
      orderBy: { name: "asc" },
      take: 10,
    });

    const results = locations.map((loc) => ({
      label: `${loc.name}, ${loc.region}`,
      value: loc.id,
      availableBoats: loc.listings.length,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[LOCATIONS_SEARCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
