import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { TaxonomyService } from "@/services/taxonomy.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  const body = await request.json();

  try {
    let result;
    if (type === "categories") {
      result = await TaxonomyService.createCategory(body.name, body.image);
    } else if (type === "locations") {
      result = await TaxonomyService.createLocation(body.name, body.region, body.image);
    } else if (type === "amenities") {
      result = await TaxonomyService.createAmenity(body.name, body.icon);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
