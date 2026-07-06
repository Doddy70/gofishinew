import HomeClient from "@/components/home/HomeClient";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getListings } from "@/services/listing";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PerahuArchive(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Build query from searchParams
  const query: any = {};

  if (searchParams.category) query.category = searchParams.category as string;
  if (searchParams.locationValue) query.locationValue = searchParams.locationValue as string;
  if (searchParams.minPrice) query.minPrice = parseInt(searchParams.minPrice as string);
  if (searchParams.maxPrice) query.maxPrice = parseInt(searchParams.maxPrice as string);
  if (searchParams.startDate) query.checkIn = searchParams.startDate as string;
  if (searchParams.endDate) query.checkOut = searchParams.endDate as string;
  if (searchParams.guests) query.guests = parseInt(searchParams.guests as string);
  if (searchParams.fishingTech) query.amenities = searchParams.fishingTech as string;
  if (searchParams.boatType) query.boatType = searchParams.boatType as string;
  if (searchParams.amenities) query.amenities = searchParams.amenities as string;
  if (searchParams.instantBook) query.instantBook = searchParams.instantBook === "true";

  query.page = parseInt((searchParams.page as string) || "1");
  query.limit = parseInt((searchParams.limit as string) || "12");

  // Get data using service directly (better for SSR than HTTP fetch)
  const [currentUser, listingsData] = await Promise.all([
    getCurrentUser(),
    getListings(query)
  ]);

  const listings = listingsData?.data || listingsData || [];

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
