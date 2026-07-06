import prisma from "@/lib/prisma";

export type ListingFilterParams = {
  category?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  guests?: number;
  fishingTech?: string;
  boatType?: string;
  amenities?: string;
  skip?: number;
  take?: number;
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
      fishingTech,
      boatType,
      amenities,
      skip,
      take,
    } = params;

    return await prisma.listing.findMany({
      where: {
        user: {
          hostStatus: "APPROVED",
        },
        ...(category && { category }),
        ...(locationValue && { locationValue }),
        ...(guests && { passengerCapacity: { gte: Number(guests) } }),
        ...(fishingTech && { fishingTechs: { hasSome: fishingTech.split(',') } }),
        ...(boatType && { boatType: { in: boatType.split(',') } }),
        ...(amenities && {
          amenities: {
            some: {
              name: { in: amenities.split(',') }
            }
          }
        }),
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
                    tripMasters: {
                      some: {
                        dateStart: { lte: new Date(endDate) },
                        dateEnd: { gte: new Date(startDate) }
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
      },
      skip,
      take,
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
