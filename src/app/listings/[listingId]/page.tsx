import ListingPage from "@/components/listings/ListingPage";
import ListingViewSkeleton from "@/components/skeletons/ListingViewSkeleton";
import { Suspense } from "react";
import { Metadata } from "next";
import { getListing } from "@/server-actions/getListing";

type Props = {
  params: Promise<{ listingId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await getListing(listingId);

  if (!listing) return { title: "Perahu Tidak Ditemukan" };

  return {
    title: `${listing.title} - Sewa Perahu di ${listing.locationValue}`,
    description: listing.description.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.substring(0, 160),
      images: [{ url: listing.imageSrc }],
    },
  };
}

export default async function Page({ params }: Props) {
  const listingId = (await params).listingId;
  return (
    <Suspense fallback={<ListingViewSkeleton />}>
      <ListingPage listingId={listingId} />
    </Suspense>
  );
}
