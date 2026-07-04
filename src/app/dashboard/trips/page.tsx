// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TripsDashboard from "./TripsDashboard";

export default async function TripsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  const bookings = await prisma.tripBooking.findMany({
    where: { userId: currentUser.id },
    include: {
      tripMaster: {
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              location: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get captain info
  const bookingsWithCaptain = await Promise.all(
    bookings.map(async (booking) => {
      const captain = await prisma.user.findFirst({
        where: {
          listings: {
            some: {
              tripMasters: {
                // @ts-ignore
                some: { id: booking.tripMasterId },
              },
            },
          },
        },
        select: { name: true, phone: true },
      });

      return {
        ...booking,
        tripMaster: {
          // @ts-ignore
          ...booking.tripMaster,
          // @ts-ignore
          listing: booking.tripMaster.listing,
          tripMaster: { user: captain },
        },
      };
    })
  );

  return <TripsDashboard bookings={bookingsWithCaptain} />;
}
