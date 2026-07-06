import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import LocationDetailClient from "./LocationDetailClient";
import { Metadata } from "next";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { id } });

  if (!location) return { title: "Lokasi Tidak Ditemukan" };

  return {
    title: `Sewa Perahu di ${location.name} - GoFishi`,
    description: `Jelajahi ${location.totalBoats} perahu memancing yang tersedia di ${location.name}, ${location.region}.`,
  };
}

export default async function LocationDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolved = await searchParams;

  const page = Number(resolved.page) || 1;
  const limit = 12;
  const minPrice = resolved.minPrice ? Number(resolved.minPrice) : undefined;
  const maxPrice = resolved.maxPrice ? Number(resolved.maxPrice) : undefined;
  const boatType = resolved.boatType as string | undefined;
  const passengerCapacity = resolved.guests ? Number(resolved.guests) : undefined;

  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) notFound();

  const listingWhere: any = {
    locationId: id,
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { price: { gte: minPrice, ...(maxPrice ? { lte: maxPrice } : {}) } }
      : {}),
    ...(boatType ? { boatType } : {}),
    ...(passengerCapacity ? { passengerCapacity: { gte: passengerCapacity } } : {}),
  };

  const [listings, totalListings] = await Promise.all([
    prisma.listing.findMany({
      where: listingWhere,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
        tripMasters: {
          where: {
            status: { in: ["SEARCHING", "CONFIRMED"] },
            currentSeats: { gt: 0 },
            dateStart: { gte: new Date() },
          },
          select: {
            id: true,
            dateStart: true,
            dateEnd: true,
            priceTotal: true,
            currentSeats: true,
            maxSeats: true,
          },
          take: 5,
          orderBy: { dateStart: "asc" },
        },
        _count: { select: { reviews: true, favorites: true } },
      },
    }),
    prisma.listing.count({ where: listingWhere }),
  ]);

  // Fetch ratings
  const listingsWithRating = await Promise.all(
    listings.map(async (listing) => {
      const reviews = await prisma.review.findMany({
        where: { listingId: listing.id },
        select: { rating: true },
      });
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        id: listing.id,
        title: listing.title,
        slug: listing.slug,
        imageSrc: listing.imageSrc,
        images: listing.images,
        boatType: listing.boatType,
        passengerCapacity: listing.passengerCapacity,
        price: listing.price,
        engine1: listing.engine1,
        engine2: listing.engine2,
        facilities: listing.facilities,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        favoriteCount: listing._count.favorites,
        captain: {
          id: listing.user.id,
          name: listing.user.name,
          image: listing.user.image,
        },
        availableTrips: listing.tripMasters.map((tm) => ({
          id: tm.id,
          dateStart: tm.dateStart,
          dateEnd: tm.dateEnd,
          priceTotal: tm.priceTotal,
          seatsAvailable: tm.currentSeats,
          maxSeats: tm.maxSeats,
        })),
      };
    })
  );

  return (
    <LocationDetailClient
      location={{
        id: location.id,
        name: location.name,
        region: location.region,
        image: location.image,
      }}
      initialListings={listingsWithRating}
      initialPagination={{
        page,
        limit,
        total: totalListings,
        totalPages: Math.ceil(totalListings / limit),
        hasMore: page * limit < totalListings,
      }}
      filters={{
        minPrice,
        maxPrice,
        boatType,
        passengerCapacity,
      }}
    />
  );
}
