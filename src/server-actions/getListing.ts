// @ts-nocheck
import prisma from "@/lib/prisma";
import type { Listing } from "@/types/listing";

export async function getListing(listingId: string) {
  let listing = null;
  let retries = 2;

  while (retries > 0) {
    try {
      listing = await prisma.listing.findUnique({
        where: {
          id: listingId,
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
          catchGalleries: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          tripMasters: {
            where: {
              dateEnd: { gte: new Date() }
            },
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
            orderBy: {
              dateStart: 'asc'
            },
            take: 10,
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 5,
          },
          amenities: true,
          categoryRef: true,
          locationRef: true,
        },
      });
      break; // Success, exit retry loop
    } catch (e: unknown) {
      const error = e as { code?: string; message?: string };
      if (error.code === 'P2028' || error.message?.includes('expired transaction')) {
        retries -= 1;
        if (retries === 0) throw e;
        console.log(`[Neon Cold Start] Retrying getListing... (${retries} attempts left)`);
      } else {
        throw e;
      }
    }
  }

  if (!listing) return null;

  return {
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  } as Listing;
}
