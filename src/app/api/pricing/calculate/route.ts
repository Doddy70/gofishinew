// @ts-nocheck
/**
 * GET /api/pricing/calculate
 * Calculate dynamic price for a listing on a specific date
 *
 * Query Parameters:
 * - listingId (required): The listing ID
 * - date (optional): The date to calculate price for (defaults to today)
 * - guests (optional): Number of guests (default: 1)
 */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Indonesian holidays 2026 (can be extended)
const HOLIDAYS_2026 = [
  "2026-01-01", // Tahun Baru
  "2026-01-29", // Imlek
  "2026-03-03", // Nyepi
  "2026-03-17", // Hindu New Year
  "2026-03-29", // Easter Sunday
  "2026-04-03", // Wafat Isa Al-Masih
  "2026-04-06", //端午节
  "2026-05-01", // HariBuruh
  "2026-05-14", // Waisak
  "2026-05-26", // Ascension of Jesus
  "2026-06-01", // Pancasila Day
  "2026-06-06", // Eid al-Fitr (estimated)
  "2026-06-07", // Eid al-Fitr (estimated)
  "2026-07-17", // Eid al-Adha (estimated)
  "2026-08-17", // Independence Day
  "2026-09-06", // Islamic New Year
  "2026-09-24", // Prophet's Birthday
  "2026-10-08", // Mahatma Gandhi Birthday
  "2026-10-20", // Indonesian Veterans Day
  "2026-11-01", // All Saints Day
  "2026-12-25", // Christmas
];

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function isHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split("T")[0];
  return HOLIDAYS_2026.includes(dateStr);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const guests = parseInt(searchParams.get("guests") || "1");

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);

    // Fetch listing with base price
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        price: true,
        weekendPrice: true,
        holidayPrice: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check for price override on this date
    const priceOverride = await prisma.priceOverride.findFirst({
      where: {
        listingId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });

    // Calculate prices
    const basePrice = listing.price;
    const weekendPrice = listing.weekendPrice || Math.round(basePrice * 1.25); // 25% weekend surcharge
    const holidayPrice = listing.holidayPrice || Math.round(basePrice * 1.50); // 50% holiday surcharge

    // Determine which price to use
    let finalPrice = basePrice;
    let appliedRate = "BASE";
    let holidayName: string | undefined;

    if (priceOverride) {
      finalPrice = priceOverride.price;
      appliedRate = "OVERRIDE";
      holidayName = priceOverride.label || priceOverride.type;
    } else if (isHoliday(date)) {
      finalPrice = holidayPrice;
      appliedRate = "HOLIDAY";
      holidayName = "Hari Libur";
    } else if (isWeekend(date)) {
      finalPrice = weekendPrice;
      appliedRate = "WEEKEND";
    }

    // Build breakdown
    const breakdown = [];

    breakdown.push({
      type: "BASE",
      label: "Harga Dasar",
      amount: basePrice,
    });

    if (appliedRate === "WEEKEND") {
      breakdown.push({
        type: "WEEKEND",
        label: "Biaya Weekend",
        amount: weekendPrice - basePrice,
        surcharge: "25%",
      });
    } else if (appliedRate === "HOLIDAY") {
      breakdown.push({
        type: "HOLIDAY",
        label: holidayName || "Biaya Hari Libur",
        amount: holidayPrice - basePrice,
        surcharge: "50%",
      });
    } else if (appliedRate === "OVERRIDE") {
      breakdown.push({
        type: "OVERRIDE",
        label: holidayName,
        amount: finalPrice,
        note: "Harga khusus untuk tanggal ini",
      });
    }

    // Calculate total for guests (if per-seat pricing)
    const totalPrice = finalPrice; // Can multiply by guests if needed

    return NextResponse.json({
      listingId,
      date: dateStr,
      guests,
      isWeekend: isWeekend(date),
      isHoliday: isHoliday(date),
      hasOverride: !!priceOverride,
      appliedRate,
      holidayName,
      breakdown: {
        basePrice,
        weekendPrice,
        holidayPrice,
        finalPrice,
        totalPrice: finalPrice,
        currency: "IDR",
      },
      priceHistory: breakdown,
    });
  } catch (error) {
    console.error("[PRICING_CALCULATE_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
