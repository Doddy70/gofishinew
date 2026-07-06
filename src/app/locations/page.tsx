import prisma from "@/lib/prisma";
import LocationsPageClient from "./LocationsPageClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Lokasi Dermaga - GoFishi",
    description: "Jelajahi dermaga dan pelabuhan mitra GoFishi untuk sewa perahu memancing di Jakarta dan sekitarnya.",
  };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface Props {
  searchParams: SearchParams;
}

export default async function LocationsPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;
  const limit = 12;
  const search = resolved.search as string | undefined;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { region: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;

  const [locations, total] = await Promise.all([
    prisma.location.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { listings: true } },
        listings: {
          where: {
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
            slug: true,
          },
          take: 4,
          orderBy: { price: "asc" },
        },
      },
    }),
    prisma.location.count({ where }),
  ]);

  const formattedLocations = locations.map((loc) => ({
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
      slug: l.slug,
    })),
  }));

  return (
    <LocationsPageClient
      initialLocations={formattedLocations}
      initialPagination={{
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      }}
      initialSearch={search}
    />
  );
}
