import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { listingId, date, reason } = body;

  if (!listingId || !date) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Verify ownership
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blockedDate = await prisma.blockedDate.create({
    data: {
      date: new Date(date),
      reason,
      listingId
    }
  });

  return NextResponse.json(blockedDate);
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // Verify ownership via listing
  const blockedDate = await prisma.blockedDate.findUnique({
    where: { id },
    include: { listing: true }
  });

  if (!blockedDate || blockedDate.listing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.blockedDate.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}
