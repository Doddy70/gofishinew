// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getListings } from "@/services/listing";
import Listings from "@/components/listings/Listings";
import CategoryList from "@/components/home/CategoryList";
import BlogSection from "@/components/home/BlogSection";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const currentUser = await getCurrentUser();
  
  const listings = await getListings({
    category: searchParams.category as string,
    locationValue: searchParams.locationValue as string,
    startDate: searchParams.startDate as string,
    endDate: searchParams.endDate as string,
    guests: searchParams.guests ? Number(searchParams.guests) : undefined,
  });

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <div className="pt-[80px] md:pt-[100px] w-full">
        <div className="sticky top-[80px] z-30 bg-canvas border-b border-hairline pb-2 px-4 sm:px-6 md:px-10 xl:px-20">
          <CategoryList />
        </div>
      </div>
      <main className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-6 md:py-8 w-full flex-1 space-y-8">
        <Listings listings={listings} currentUser={currentUser} />
        <BlogSection />
      </main>
    </div>
  );
}
