import prisma from "@/lib/prisma";

export async function getKaptenReservations() {
  try {
    const reservations = await prisma.tripBooking.findMany({
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
