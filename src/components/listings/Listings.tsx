"use client";

import ListingCard from "./ListingCard";
import { Listing } from "@/types/listing";
import EmptyListings from "../ui/EmptyListings";

interface ListingsProps {
  listings: Listing[];
  currentUser?: any;
  mapView?: boolean;
}

export default function Listings({ listings, currentUser, mapView }: ListingsProps) {
  if (listings.length === 0) {
    return (
      <EmptyListings
        title="Perahu tidak ditemukan"
        subtitle="Kami tidak menemukan perahu yang sesuai dengan filter Anda. Coba ubah atau hapus filter untuk melihat hasil lainnya."
        filter
      />
    );
  }

  // Adjust grid columns based on mapView state
  const gridClasses = mapView
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6";

  return (
    <div className={gridClasses}>
      {listings.map((listing: Listing) => {
        return (
          <ListingCard
            key={listing.id}
            listing={listing}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
}
