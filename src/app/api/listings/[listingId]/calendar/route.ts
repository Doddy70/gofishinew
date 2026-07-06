// @ts-nocheck
/**
 * GET /api/listings/[listingId]/calendar
 * Get calendar data for a listing (blocked dates, price overrides, trip masters)
 *
 * Query Parameters:
 * - year (required): Year (e.g., 2026)
 * - month (optional): Month (1-12), if not provided returns all months
 */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = searchParams.get("month");

    const { listingId } = params;

    // Validate listingId
    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    // Build date range for the year (or specific month)
    const startDate = month
      ? new Date(year, parseInt(month) - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, parseInt(month), 0)
      : new Date(year, 11, 31);

    // Fetch listing basic info
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
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

    // Fetch trip masters for this listing in the date range
    const tripMasters = await prisma.tripMaster.findMany({
      where: {
        listingId,
        dateStart: { gte: startDate },
        dateEnd: { lte: endDate },
      },
      select: {
        id: true,
        dateStart: true,
        dateEnd: true,
        slotType: true,
        meetingTime: true,
        returnTime: true,
        area: true,
        priceTotal: true,
        currentSeats: true,
        maxSeats: true,
        status: true,
      },
      orderBy: { dateStart: "asc" },
    });

    // Fetch blocked dates
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        listingId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        reason: true,
      },
    });

    // Fetch price overrides
    const priceOverrides = await prisma.priceOverride.findMany({
      where: {
        listingId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        price: true,
        type: true,
        label: true,
      },
    });

    // Build calendar response
    const calendarData = {
      year,
      month: month ? parseInt(month) : null,
      listing: {
        id: listing.id,
        title: listing.title,
        basePrice: listing.price,
        weekendPrice: listing.weekendPrice,
        holidayPrice: listing.holidayPrice,
      },
      tripMasters: tripMasters.map((tm) => ({
        id: tm.id,
        dateStart: tm.dateStart.toISOString(),
        dateEnd: tm.dateEnd.toISOString(),
        slotType: tm.slotType,
        meetingTime: tm.meetingTime,
        returnTime: tm.returnTime,
        area: tm.area,
        priceTotal: tm.priceTotal,
        availableSeats: tm.currentSeats,
        maxSeats: tm.maxSeats,
        status: tm.status,
      })),
      blockedDates: blockedDates.map((bd) => ({
        id: bd.id,
        date: bd.date.toISOString(),
        reason: bd.reason,
      })),
      priceOverrides: priceOverrides.map((po) => ({
        id: po.id,
        date: po.date.toISOString(),
        price: po.price,
        type: po.type,
        label: po.label,
      })),
    };

    return NextResponse.json(calendarData);
  } catch (error) {
    console.error("[LISTING_CALENDAR_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
}
