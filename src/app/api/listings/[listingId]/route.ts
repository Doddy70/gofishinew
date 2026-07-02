import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = resolvedParams;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deleteCondition: any = {
      id: listingId,
    };

    if (currentUser.role !== "ADMIN") {
      deleteCondition.userId = currentUser.id;
    }

    const listing = await prisma.listing.deleteMany({
      where: deleteCondition,
    });

    return NextResponse.json(listing);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = resolvedParams;
    const body = await request.formData();
    
    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (currentUser.role !== "ADMIN" && existingListing.userId !== currentUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = body.get("title") as string;
    const description = body.get("description") as string;
    const price = body.get("price") as string;
    const locationValue = body.get("locationValue") as string;
    const category = body.get("category") as string;
    const boatType = body.get("boatType") as string;
    const passengerCapacity = body.get("passengerCapacity") as string;
    const rodHoldersCount = body.get("rodHoldersCount") as string;
    const image = body.get("image") as File | null;
    const legalDoc = body.get("legalDoc") as File | null;

    let imageSrc = existingListing.imageSrc;
    if (image && image.size > 0) {
      const uploadResponse = await uploadToCloudinary(image, "listings");
      imageSrc = uploadResponse.secure_url;
    }

    let legalDocs = existingListing.legalDocs;
    if (legalDoc && legalDoc.size > 0) {
      const uploadResponse = await uploadToCloudinary(legalDoc, "legal_docs");
      legalDocs = [uploadResponse.secure_url];
    }

    const listing = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        title,
        description,
        imageSrc,
        category,
        boatType,
        passengerCapacity: parseInt(passengerCapacity, 10),
        rodHoldersCount: parseInt(rodHoldersCount, 10),
        price: parseInt(price, 10),
        locationValue,
        legalDocs
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
