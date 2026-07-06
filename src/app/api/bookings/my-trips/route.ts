import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // PENDING, HELD, PAID, CANCELLED, etc.

    const tripBookings = await prisma.tripBooking.findMany({
      where: {
        userId: currentUser.id,
        ...(status ? { paymentStatus: status as any } : {}),
      },
      include: {
        tripMaster: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                images: true,
                locationValue: true,
                user: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const trips = tripBookings.map((tb) => ({
      id: tb.id,
      dateStart: tb.tripMaster.dateStart,
      dateEnd: tb.tripMaster.dateEnd,
      status: tb.paymentStatus, // PENDING | HELD | RELEASED | REFUNDED
      tripStatus: tb.tripMaster.status, // SEARCHING | CONFIRMED | FULL | CANCELLED | COMPLETED
      totalPrice: tb.totalAmount,
      seatsBooked: tb.seatsBooked,
      bookingType: tb.tripMaster.bookingType,
      boat: {
        id: tb.tripMaster.listing.id,
        title: tb.tripMaster.listing.title,
        image: tb.tripMaster.listing.images?.[0] || null,
        location: tb.tripMaster.listing.locationValue,
        captain: {
          id: tb.tripMaster.listing.user.id,
          name: tb.tripMaster.listing.user.name,
          image: tb.tripMaster.listing.user.image,
        },
      },
      createdAt: tb.createdAt,
    }));

    return NextResponse.json(trips);
  } catch (error) {
    console.error("[MY_TRIPS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
