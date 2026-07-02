import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getKaptenReservations() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        listing: {
          userId: currentUser.id,
        },
      },
      include: {
        listing: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservations;
  } catch (error) {
    console.error(error);
    return [];
  }
}
