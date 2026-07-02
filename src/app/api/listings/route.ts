import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import {
  CloudinaryUploadResult,
  uploadToCloudinary,
} from "@/services/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const locationValue = formData.get("locationValue") as string;
    const image = formData.get("image") as File;
    const legalDoc = formData.get("legalDoc") as File | null;
    
    // New GoFishi fields
    const boatType = formData.get("boatType") as string || "Speedboat";
    const passengerCapacity = formData.get("passengerCapacity") as string || "5";
    const videoUrl = formData.get("videoUrl") as string || "";

    if (
      !title ||
      !description ||
      !price ||
      !locationValue ||
      !category ||
      !image
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    //upload the image to cloudinary
    const imageData: CloudinaryUploadResult = await uploadToCloudinary(image);
    
    let legalDocUrl = "";
    if (legalDoc) {
      const legalData: CloudinaryUploadResult = await uploadToCloudinary(legalDoc);
      legalDocUrl = legalData.secure_url;
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        locationValue,
        locationId: locationValue, // locationValue now stores the ID of the Location model
        category,
        imageSrc: imageData.secure_url,
        legalDocs: legalDocUrl ? [legalDocUrl] : [],
        userId: currentUser.id,
        boatType,
        videoUrl,
        passengerCapacity: Number(passengerCapacity),
      },
    });

    // Update User to be a PENDING HOST if they aren't already verified
    if (currentUser.hostStatus === "NONE") {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          role: "HOST",
          hostStatus: "PENDING"
        }
      });
    }

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("[LISTINGS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { listingRepository } from "@/repositories/ListingRepository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const listings = await listingRepository.getAllListings({
      category: searchParams.get("category") || undefined,
      locationValue: searchParams.get("locationValue") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      guests: searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined,
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[LISTINGS_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
