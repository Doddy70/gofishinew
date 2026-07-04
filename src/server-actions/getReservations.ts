import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getRservations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const reservations = await prisma.tripBooking.findMany({
    where: {
      tripMaster: {
        listing: {
          userId: currentUser.id,
        },
      },
    },
    include: {
      tripMaster: {
        include: {
          listing: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reservations.map((reservation) => ({
    ...reservation,
    startDate: reservation.tripMaster.dateStart.toISOString(),
    endDate: reservation.tripMaster.dateEnd.toISOString(),
    createdAt: reservation.createdAt.toISOString(),
  }));
}
