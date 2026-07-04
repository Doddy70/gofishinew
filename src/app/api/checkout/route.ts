import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { paymentOrchestrator } from "@/services/payments/PaymentOrchestrator";
import { z } from "zod";
import { differenceInDays } from "date-fns";

const checkoutSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid start date format" }
  ),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid end date format" }
  ),
  userId: z.string().min(1), // Clerk user ID
  pmi: z.string().optional(),
  bookingType: z.enum(["PRIVATE", "SHARING"]).optional().default("PRIVATE"),
  seats: z.number().positive().optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Request
    const body = await req.json();
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      listingId,
      startDate,
      endDate,
      userId,
      pmi,
      bookingType,
      seats
    } = validationResult.data;

    // 2. Authentication Check (userId from Clerk must match)
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - User mismatch" },
        { status: 401 }
      );
    }

    // 3. Fetch Listing with Price
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        price: true,
        passengerCapacity: true,
        userId: true
      }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // 4. Business Logic Validation
    // Cannot book own listing
    if (listing.userId === userId) {
      return NextResponse.json(
        { error: "Anda tidak dapat memesan listing sendiri" },
        { status: 403 }
      );
    }

    // 5. Calculate Price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(differenceInDays(end, start), 1);
    const totalPrice = days * listing.price;
    const passengerCapacity = listing.passengerCapacity || 5;
    const seatsBooked = seats || passengerCapacity;

    // 6. Check for overlapping reservations
    const existingReservation = await prisma.tripMaster.findFirst({
      where: {
        listingId,
        AND: [
          { dateStart: { lte: end } },
          { dateEnd: { gte: start } },
        ],
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "Tanggal sudah dipesan" },
        { status: 409 }
      );
    }

    // 7. Create Reservation via Transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Create TripMaster (schedule block)
      const tripMaster = await tx.tripMaster.create({
        data: {
          listingId,
          dateStart: start,
          dateEnd: end,
          bookingType,
          priceTotal: totalPrice,
          pricePerSeat: bookingType === "SHARING"
            ? Math.floor(totalPrice / passengerCapacity)
            : 0,
          minSeats: 1,
          maxSeats: passengerCapacity,
          currentSeats: passengerCapacity - seatsBooked,
          status: "SEARCHING",
        }
      });

      // Create TripBooking (guest booking)
      const tripBooking = await tx.tripBooking.create({
        data: {
          tripMasterId: tripMaster.id,
          userId,
          seatsBooked,
          totalAmount: totalPrice,
          paymentStatus: "PENDING"
        }
      });

      return { tripMaster, tripBooking };
    });

    const reservation = transaction.tripBooking;

    // 8. Generate Payment via Payment Orchestrator
    const paymentResult = await paymentOrchestrator.createPayment({
      amount: totalPrice,
      description: `Sewa Perahu: ${listing.title} (${days} hari)`,
      requestEventId: reservation.id,
      pmi: pmi || "fiat-qris-midtrans",
    });

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      totalPrice,
      days,
      payment: paymentResult
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
