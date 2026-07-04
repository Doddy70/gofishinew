import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getTrips() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const trips = await prisma.tripBooking.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tripMaster: {
        include: {
          listing: true,
        },
      },
    },
  });

  return trips.map((trip) => ({
    ...trip,
    startDate: trip.tripMaster.dateStart.toISOString(),
    endDate: trip.tripMaster.dateEnd.toISOString(),
    createdAt: trip.createdAt.toISOString(),
    listing: {
      ...trip.tripMaster.listing,
      createdAt: trip.tripMaster.listing.createdAt.toISOString(),
    },
  }));
}
