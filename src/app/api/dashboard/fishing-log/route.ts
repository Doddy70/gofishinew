import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { imageSrc, description, listingId } = body;

  if (!imageSrc || !listingId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const log = await prisma.catchGallery.create({
    data: {
      imageSrc,
      description,
      userId: currentUser.id,
      listingId
    }
  });

  return NextResponse.json(log);
}
