// @ts-nocheck
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: tripMasterId } = await params;

    // Pastikan tripMaster ini milik kapal dari Kapten yang sedang login
    const tripMaster = await prisma.tripMaster.findUnique({
      where: { id: tripMasterId },
      include: { listing: true }
    });

    if (!tripMaster) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (tripMaster.listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update status menjadi COMPLETED
    const updated = await prisma.tripMaster.update({
      where: { id: tripMasterId },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[COMPLETE_TRIP_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
