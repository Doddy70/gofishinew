import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import midtransClient from "midtrans-client";

// Verify Midtrans signature
function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const hash = crypto
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");
  return hash === signatureKey;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      payment_type,
      transaction_id,
    } = body;

    // Skip signature verification in development
    const isProduction = process.env.NODE_ENV === "production";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    if (isProduction && serverKey && body.signature_key) {
      const isValid = verifySignature(
        order_id,
        status_code,
        gross_amount,
        serverKey,
        body.signature_key
      );
      if (!isValid) {
        console.warn("[MIDTRANS_WEBHOOK] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    // order_id = TripBooking.id
    const tripBookingId = order_id;

    const tripBooking = await prisma.tripBooking.findUnique({
      where: { id: tripBookingId },
      include: { tripMaster: { include: { listing: true } } },
    });

    if (!tripBooking) {
      console.warn("[MIDTRANS_WEBHOOK] Booking not found:", tripBookingId);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Map Midtrans status → GoFishi status
    switch (transaction_status) {
      case "settlement":
      case "capture": {
        // Payment success — hold funds (escrow)
        await prisma.$transaction([
          prisma.tripBooking.update({
            where: { id: tripBookingId },
            data: {
              paymentStatus: "HELD",
              paymentLink: transaction_id || null,
            },
          }),
          prisma.tripMaster.update({
            where: { id: tripBooking.tripMasterId },
            data: { status: "CONFIRMED" },
          }),
        ]);
        console.log(`[MIDTRANS_WEBHOOK] Payment HELD for ${tripBookingId}`);
        break;
      }

      case "pending": {
        // Still waiting — no action needed
        console.log(`[MIDTRANS_WEBHOOK] Payment PENDING for ${tripBookingId}`);
        break;
      }

      case "expire": {
        // Payment expired — cancel the booking
        await prisma.$transaction([
          prisma.tripBooking.update({
            where: { id: tripBookingId },
            data: { paymentStatus: "REFUNDED" },
          }),
          prisma.tripMaster.update({
            where: { id: tripBooking.tripMasterId },
            data: { status: "CANCELLED" },
          }),
        ]);
        console.log(`[MIDTRANS_WEBHOOK] Payment EXPIRED — cancelled ${tripBookingId}`);
        break;
      }

      case "deny":
      case "cancel":
      case "refund": {
        // Refund/cancelled — release hold
        await prisma.$transaction([
          prisma.tripBooking.update({
            where: { id: tripBookingId },
            data: { paymentStatus: "REFUNDED" },
          }),
          prisma.tripMaster.update({
            where: { id: tripBooking.tripMasterId },
            data: { status: "CANCELLED" },
          }),
        ]);
        console.log(`[MIDTRANS_WEBHOOK] Refund processed for ${tripBookingId}`);
        break;
      }

      default:
        console.log(`[MIDTRANS_WEBHOOK] Unhandled status: ${transaction_status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MIDTRANS_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
