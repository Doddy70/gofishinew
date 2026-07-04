import { getListing } from "@/server-actions/getListing";
import CheckoutClient from "./CheckoutClient";
import { redirect } from "next/navigation";

interface CheckoutPageProps {
  params: {
    listingId: string;
  };
  searchParams: {
    startDate?: string;
    endDate?: string;
    guests?: string;
  };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const listing = await getListing(params.listingId);

  if (!listing) {
    redirect("/");
  }

  return <CheckoutClient listingId={params.listingId} listing={listing} searchParams={searchParams} />;
}
