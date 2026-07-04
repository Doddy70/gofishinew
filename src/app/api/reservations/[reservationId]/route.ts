import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateReservationSchema = z.object({
  status: z.enum(["PENDING", "HELD", "RELEASED", "REFUNDED"]).optional(),
  dateStart: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ).optional(),
  dateEnd: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ).optional(),
});

interface RouteParams {
  params: Promise<{ reservationId: string }>;
}

export async function DELETE(
  _req: Request,
  { params }: RouteParams
) {
  try {
    // 1. Authentication Check
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { reservationId } = await params;

    if (!reservationId) {
      return NextResponse.json(
        { error: "Missing reservationId" },
        { status: 400 }
      );
    }

    // 2. Fetch Reservation with Relations
    const reservation = await prisma.tripBooking.findUnique({
      where: { id: reservationId },
      include: {
        tripMaster: {
          include: {
            listing: {
              select: { userId: true }
            }
          }
        }
      }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // 3. Authorization Check
    // Guest who made the booking OR Host who owns the listing OR Admin can delete
    const isGuest = reservation.userId === currentUser.id;
    const isHost = reservation.tripMaster.listing.userId === currentUser.id;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isGuest && !isHost && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    // 4. Business Logic - Cannot delete confirmed/completed trips
    if (reservation.tripMaster.status === "CONFIRMED" || reservation.tripMaster.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Tidak dapat membatalkan trip yang sudah dikonfirmasi" },
        { status: 400 }
      );
    }

    // 5. Delete Reservation (cascade will handle related records)
    await prisma.$transaction(async (tx) => {
      // Delete trip booking first (child)
      await tx.tripBooking.delete({
        where: { id: reservationId }
      });

      // Delete trip master (parent) if no more bookings exist
      const remainingBookings = await tx.tripBooking.count({
        where: { tripMasterId: reservation.tripMaster.id }
      });

      if (remainingBookings === 0) {
        await tx.tripMaster.delete({
          where: { id: reservation.tripMaster.id }
        });
      }
    });

    return NextResponse.json({ success: true, message: "Reservation cancelled" });
  } catch (error) {
    console.error("[RESERVATION_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    // 1. Authentication Check
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { reservationId } = await params;
    const body = await request.json();

    // 2. Validate Request
    const validationResult = updateReservationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 3. Fetch Reservation
    const reservation = await prisma.tripBooking.findUnique({
      where: { id: reservationId },
      include: {
        tripMaster: {
          include: {
            listing: {
              select: { userId: true }
            }
          }
        }
      }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // 4. Authorization Check
    // Only Host OR Admin can update status
    const isHost = reservation.tripMaster.listing.userId === currentUser.id;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isHost && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Hanya kapten atau admin yang dapat update" },
        { status: 403 }
      );
    }

    const { status, dateStart, dateEnd } = validationResult.data;

    // 5. Update Reservation
    const updatedReservation = await prisma.$transaction(async (tx) => {
      // Update payment status
      if (status) {
        await tx.tripBooking.update({
          where: { id: reservationId },
          data: { paymentStatus: status }
        });
      }

      // Update trip dates if provided
      if (dateStart || dateEnd) {
        await tx.tripMaster.update({
          where: { id: reservation.tripMaster.id },
          data: {
            ...(dateStart && { dateStart: new Date(dateStart) }),
            ...(dateEnd && { dateEnd: new Date(dateEnd) })
          }
        });
      }

      return tx.tripBooking.findUnique({
        where: { id: reservationId },
        include: {
          tripMaster: {
            include: {
              listing: true
            }
          }
        }
      });
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error("[RESERVATION_PATCH]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
