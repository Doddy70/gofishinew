import HomeClient from "@/components/home/HomeClient";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getListings } from "@/services/listing";
import Navbar from "@/components/navbar/Navbar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PerahuArchive(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  
  // Build query from searchParams
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category as string);
  if (searchParams.locationValue) params.set("locationValue", searchParams.locationValue as string);
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice as string);
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice as string);
  if (searchParams.startDate) params.set("checkIn", searchParams.startDate as string); // API uses checkIn/checkOut
  if (searchParams.endDate) params.set("checkOut", searchParams.endDate as string);
  if (searchParams.guests) params.set("guests", searchParams.guests as string);
  if (searchParams.fishingTech) params.set("amenities", searchParams.fishingTech as string); // mapping to amenities
  if (searchParams.boatType) params.set("boatType", searchParams.boatType as string);
  if (searchParams.amenities) params.set("amenities", searchParams.amenities as string);
  if (searchParams.instantBook) params.set("instantBook", searchParams.instantBook as string);
  
  // Also pass pagination if any
  params.set("page", (searchParams.page as string) || "1");
  params.set("limit", (searchParams.limit as string) || "12");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const [currentUser, listingsRes] = await Promise.all([
    getCurrentUser(),
    fetch(`${appUrl}/api/listings/search?${params.toString()}`, { cache: "no-store" })
  ]);

  let listings = [];
  if (listingsRes.ok) {
    const data = await listingsRes.json();
    listings = data.data || [];
  }

  return (
    <div className="flex flex-col min-h-screen pt-[60px] md:pt-[100px]">
      <HomeClient 
        searchParams={searchParams} 
        initialListings={listings} 
        currentUser={currentUser} 
      />
    </div>
  );
}
