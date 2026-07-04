import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const reservationSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid start date format" }
  ),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid end date format" }
  ),
  totalPrice: z.number().positive("Total price must be positive"),
  bookingType: z.enum(["PRIVATE", "SHARING"]).optional().default("PRIVATE"),
  seats: z.number().positive().optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Authentication Check
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Parse and Validate Request
    const body = await req.json();
    const validationResult = reservationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { listingId, startDate, endDate, totalPrice, bookingType, seats } = validationResult.data;

    // 3. Fetch Listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // 4. Business Logic Validation
    // Cannot book own listing
    if (listing.userId === currentUser.id) {
      return NextResponse.json(
        { error: "Anda tidak dapat memesan listing sendiri" },
        { status: 403 }
      );
    }

    // Check for overlapping reservations
    const existingReservation = await prisma.tripMaster.findFirst({
      where: {
        listingId,
        AND: [
          { dateStart: { lte: new Date(endDate) } },
          { dateEnd: { gte: new Date(startDate) } },
        ],
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "Tanggal sudah dipesan" },
        { status: 409 }
      );
    }

    // 5. Create Reservation via Transaction
    const passengerCapacity = listing.passengerCapacity || 5;
    const seatsBooked = seats || passengerCapacity;

    const transaction = await prisma.$transaction(async (tx) => {
      // Create TripMaster (schedule block)
      const tripMaster = await tx.tripMaster.create({
        data: {
          listingId,
          dateStart: new Date(startDate),
          dateEnd: new Date(endDate),
          bookingType,
          priceTotal: totalPrice,
          pricePerSeat: bookingType === "SHARING" ? Math.floor(totalPrice / passengerCapacity) : 0,
          minSeats: 1,
          maxSeats: passengerCapacity,
          currentSeats: passengerCapacity - seatsBooked,
          status: "SEARCHING",
        },
      });

      // Create TripBooking (guest booking)
      const tripBooking = await tx.tripBooking.create({
        data: {
          tripMasterId: tripMaster.id,
          userId: currentUser.id,
          seatsBooked,
          totalAmount: totalPrice,
          paymentStatus: "PENDING",
        },
      });

      return { tripMaster, tripBooking };
    });

    return NextResponse.json(transaction.tripBooking, { status: 201 });
  } catch (error) {
    console.error("[RESERVATIONS_POST]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "guest" or "host"
    const status = searchParams.get("status");

    // Default to user's own reservations
    const isHost = type === "host" && currentUser.role === "HOST";

    // Build query based on user role
    const userListings = isHost || currentUser.role === "ADMIN"
      ? await prisma.listing.findMany({
          where: isHost ? { userId: currentUser.id } : {},
          select: { id: true }
        })
      : [];

    const listingIds = userListings.map(l => l.id);

    const reservations = await prisma.tripBooking.findMany({
      where: {
        ...(isHost
          ? { tripMaster: { listingId: { in: listingIds } } }
          : { userId: currentUser.id }),
        ...(status && { paymentStatus: status as any }),
      },
      include: {
        tripMaster: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                imageSrc: true,
                locationValue: true,
                user: {
                  select: { id: true, name: true, image: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("[RESERVATIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
