import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { paymentOrchestrator } from "@/services/payments/PaymentOrchestrator";
import { z } from "zod";
import crypto from "crypto";

const checkoutSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  pmi: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    const currentUser = await getCurrentUser();

    // 1. Validation (Guest vs Authenticated)
    if (!currentUser && !validatedData.guestEmail) {
      return NextResponse.json(
        { error: "Email is required for guest checkout" },
        { status: 400 }
      );
    }

    // 2. Fetch Listing Price
    const listing = await prisma.listing.findUnique({
      where: { id: validatedData.listingId },
      select: { title: true, price: true }
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Rough calculation (days * price). Simplified for demo.
    const start = new Date(validatedData.startDate);
    const end = new Date(validatedData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;
    const totalPrice = days * listing.price;

    // 3. Create Reservation (with or without userId)
    const reservation = await prisma.reservation.create({
      data: {
        listingId: validatedData.listingId,
        userId: currentUser ? currentUser.id : undefined,
        guestEmail: !currentUser ? validatedData.guestEmail : undefined,
        guestName: !currentUser ? validatedData.guestName : undefined,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "PENDING_PAYMENT"
      }
    });

    // 4. Generate Account Creation Token if Guest
    let accountToken = null;
    if (!currentUser && validatedData.guestEmail) {
      // In a real app, generate token and send via email
      accountToken = crypto.randomBytes(32).toString('hex');
      await prisma.accountCreationToken.create({
        data: {
          email: validatedData.guestEmail,
          token: accountToken,
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours (Skill pattern)
        }
      });
    }

    // 5. Generate Payment QRIS via Orchestrator
    const paymentResult = await paymentOrchestrator.createPayment({
      amount: totalPrice,
      description: `Sewa Perahu: ${listing.title} (${days} hari)`,
      requestEventId: reservation.id,
      pmi: validatedData.pmi || "fiat-qris-midtrans",
    });

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      payment: paymentResult,
      accountToken // Return for demo purposes (usually sent via email)
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
