import { getListing } from "@/server-actions/getListing";
import ListingDetailClient from "./ListingDetailClient";

interface ListingPageProps {
  listingId: string;
}

export default async function ListingPage({ listingId }: ListingPageProps) {
  const listing = await getListing(listingId);

  if (!listing) return null;

  return <ListingDetailClient listing={listing} />;
}
