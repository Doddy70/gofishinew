import prisma from "@/lib/prisma";

export type ListingFilterParams = {
  category?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  guests?: number;
};

export class ListingRepository {
  async getAllListings(params: ListingFilterParams = {}) {
    const {
      category,
      locationValue,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      guests,
    } = params;

    return await prisma.listing.findMany({
      where: {
        user: {
          hostStatus: "APPROVED",
        },
        ...(category && { category }),
        ...(locationValue && { locationValue }),
        ...(guests && { passengerCapacity: { gte: Number(guests) } }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice ? { gte: Number(minPrice) } : {}),
                ...(maxPrice ? { lte: Number(maxPrice) } : {}),
              },
            }
          : {}),
        ...(startDate && endDate
          ? {
              NOT: {
                OR: [
                  {
                    reservations: {
                      some: {
                        startDate: { lte: new Date(endDate) },
                        endDate: { gte: new Date(startDate) }
                      }
                    }
                  },
                  {
                    blockedDates: {
                      some: {
                        date: {
                          gte: new Date(startDate),
                          lte: new Date(endDate)
                        }
                      }
                    }
                  }
                ]
              }
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true, // Including user to make it easier to debug host status if needed
      }
    });
  }

  async getListingById(id: string) {
    return await prisma.listing.findUnique({
      where: { id },
      include: {
        user: true,
      }
    });
  }
}

export const listingRepository = new ListingRepository();
