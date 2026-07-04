import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getKaptenReservations() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return [];
    }

    const reservations = await prisma.tripBooking.findMany({
      where: {
        tripMaster: {
          listing: {
            userId: currentUser.id
          }
        }
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
    return reservations;
  } catch (error) {
    console.error(error);
    return [];
  }
}
