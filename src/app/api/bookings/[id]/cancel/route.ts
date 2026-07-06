import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import midtransClient from "midtrans-client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Fetch booking
    const tripBooking = await prisma.tripBooking.findUnique({
      where: { id: bookingId },
      include: { tripMaster: { include: { listing: true } } },
    });

    if (!tripBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only the guest or admin can cancel
    if (tripBooking.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot cancel already completed trips
    if (tripBooking.tripMaster.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Tidak dapat membatalkan trip yang sudah selesai" },
        { status: 400 }
      );
    }

    // Refund if payment was already HELD
    if (tripBooking.paymentStatus === "HELD") {
      try {
        const isProduction = process.env.NODE_ENV === "production";
        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

        if (isProduction && serverKey) {
          const midtrans = new midtransClient.CoreApi({
            isProduction: true,
            serverKey,
            clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
          });

          await midtrans.transaction.refund(bookingId, {
            refund_amount: tripBooking.totalAmount,
            reason: "Guest cancellation",
          });

          console.log(`[CANCEL_BOOKING] Refund initiated for ${bookingId}`);
        } else {
          // Dev mode — skip actual refund
          console.log(`[CANCEL_BOOKING] Dev mode: refund skipped for ${bookingId}`);
        }
      } catch (refundError) {
        console.error("[CANCEL_BOOKING] Refund failed", refundError);
        return NextResponse.json(
          { error: "Gagal memproses refund. Hubungi admin." },
          { status: 500 }
        );
      }
    }

    // Update statuses
    await prisma.$transaction([
      prisma.tripBooking.update({
        where: { id: bookingId },
        data: { paymentStatus: "REFUNDED" },
      }),
      prisma.tripMaster.update({
        where: { id: tripBooking.tripMasterId },
        data: { status: "CANCELLED" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Booking berhasil dibatalkan",
      refundStatus:
        tripBooking.paymentStatus === "HELD" ? "REFUNDED" : "NO_REFUND_NEEDED",
    });
  } catch (error) {
    console.error("[CANCEL_BOOKING_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
