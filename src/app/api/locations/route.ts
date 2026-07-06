import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  search: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query params", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, search } = parsed.data;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { region: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [locations, total] = await Promise.all([
      prisma.location.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { listings: true },
          },
          listings: {
            where: {
              // Only count active listings (have open trips)
              tripMasters: {
                some: {
                  status: { in: ["SEARCHING", "CONFIRMED"] },
                  currentSeats: { gt: 0 },
                  dateStart: { gte: new Date() },
                },
              },
            },
            select: {
              id: true,
              imageSrc: true,
              price: true,
              title: true,
            },
            take: 4, // Preview images
            orderBy: { price: "asc" },
          },
        },
      }),
      prisma.location.count({ where }),
    ]);

    const results = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      region: loc.region,
      image: loc.image || loc.listings[0]?.imageSrc || null,
      totalBoats: loc._count.listings,
      previewBoats: loc.listings.map((l) => ({
        id: l.id,
        title: l.title,
        image: l.imageSrc,
        price: l.price,
      })),
    }));

    return NextResponse.json({
      locations: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + results.length < total,
      },
    });
  } catch (error) {
    console.error("[LOCATIONS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
