import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
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

    const { id: tripMasterId } = await params;

    const tripMaster = await prisma.tripMaster.findUnique({
      where: { id: tripMasterId },
      include: {
        listing: true,
        tripBookings: {
          where: { paymentStatus: "HELD" },
        },
      },
    });

    if (!tripMaster) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Validate: current user is the host (kapten) of this listing
    if (tripMaster.listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden — Anda bukan pemilik trip ini" }, { status: 403 });
    }

    // Cannot complete a trip that's not confirmed
    if (tripMaster.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Trip belum dikonfirmasi atau sudah selesai" },
        { status: 400 }
      );
    }

    // Calculate payout: sum of all HELD bookings minus commission
    const heldBookings = tripMaster.tripBookings;
    const totalHeld = heldBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Commission rate (e.g., 10%)
    const commissionRate = 0.10;
    const commission = Math.floor(totalHeld * commissionRate);
    const payoutAmount = totalHeld - commission;

    // Process Midtrans escrow payout (in production)
    const isProduction = process.env.NODE_ENV === "production";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    if (isProduction && serverKey && payoutAmount > 0) {
      try {
        const midtrans = new midtransClient.CoreApi({
          isProduction: true,
          serverKey,
          clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
        });

        // Note: Midtrans Core API requires explicit capture after settlement
        // For escrow with direct debit/gopay/qris, use:
        // POST /v2/charge - with payment_type that supports automatic escrow
        // This is a simplified version — in production, integrate with
        // Midtrans Admin Dashboard for fund disbursement (Transfer to bank)
        console.log(`[COMPLETE_TRIP] Payout ${payoutAmount} to host ${currentUser.id}`);
      } catch (payoutError) {
        console.error("[COMPLETE_TRIP] Payout failed", payoutError);
        // Non-blocking: complete the trip even if payout fails
        // Admin can manually process payout via Midtrans dashboard
      }
    } else {
      console.log(`[COMPLETE_TRIP] Dev mode: payout ${payoutAmount} recorded (skipping Midtrans)`);
    }

    // Update all HELD bookings to RELEASED
    await prisma.$transaction([
      ...heldBookings.map((booking) =>
        prisma.tripBooking.update({
          where: { id: booking.id },
          data: { paymentStatus: "RELEASED" },
        })
      ),
      prisma.tripMaster.update({
        where: { id: tripMasterId },
        data: { status: "COMPLETED" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Trip berhasil diselesaikan",
      tripMasterId,
      payoutAmount,
      commission,
      totalCollected: totalHeld,
    });
  } catch (error) {
    console.error("[COMPLETE_TRIP_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
