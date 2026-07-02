import HomeClient from "@/components/home/HomeClient";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getListings } from "@/services/listing";
import Navbar from "@/components/navbar/Navbar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PerahuArchive(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const [currentUser, listings] = await Promise.all([
    getCurrentUser(),
    getListings({
      category: searchParams.category as string,
      locationValue: searchParams.locationValue as string,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      startDate: searchParams.startDate as string,
      endDate: searchParams.endDate as string,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
    })
  ]);

  return (
    <div className="flex flex-col min-h-screen pt-4">
      <HomeClient 
        searchParams={searchParams} 
        initialListings={listings} 
        currentUser={currentUser} 
      />
    </div>
  );
}
