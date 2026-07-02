"use client";

import ListingCard from "./ListingCard";
import { Listing } from "@/types/listing";
import EmptyListings from "../ui/EmptyListings";

interface ListingsProps {
  listings: Listing[];
  currentUser?: any;
}

export default function Listings({ listings, currentUser }: ListingsProps) {
  if (listings.length === 0) {
    return (
      <EmptyListings
        title="Perahu tidak ditemukan"
        subtitle="Kami tidak menemukan perahu yang sesuai dengan filter Anda. Coba ubah atau hapus filter untuk melihat hasil lainnya."
        filter
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
