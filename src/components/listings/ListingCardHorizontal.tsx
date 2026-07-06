"use client";

import useCountries from "@/custom-hooks/useCountries";
import Image from "next/image";
import HeartButton from "../favorites/HeartButton";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { LuStar } from "react-icons/lu";

interface ListingCardHorizontalProps {
  listing: Listing;
  currentUser?: {
    id: string;
    favoriteIds: string[];
  } | null;
}

export default function ListingCardHorizontal({
  listing,
  currentUser,
}: ListingCardHorizontalProps) {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(listing.locationValue);

  // Use slug for SEO-friendly URLs, fallback to ID for backwards compatibility
  const detailUrl = listing.slug
    ? `/perahu/${listing.slug}`
    : `/listings/${listing.id}`;

  return (
    <div
      className="group cursor-pointer flex flex-row w-full h-[220px] bg-white rounded-[16px] overflow-hidden transition-all duration-300 relative border-b border-hairline/50 pb-6 mb-6"
      onClick={() => router.push(detailUrl)}
    >
      {/* image container */}
      <div className="relative w-[300px] h-full shrink-0 bg-hairline rounded-[12px] overflow-hidden">
        <Image
          src={
            listing.imageSrc ||
            "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=2070&auto=format&fit=crop"
          }
          alt={listing.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-95"
        />

        {/* Carousel Dots Fake Indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-[6px] h-[6px] rounded-full bg-white opacity-100"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white opacity-60"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white opacity-60"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white opacity-60"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white opacity-60"></div>
        </div>

        {/* Guest Favorite Badge */}
        <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full flex items-center shadow-md">
          <span className="text-[12px] font-semibold text-[#222222]">
            Pilihan Angler
          </span>
        </div>
      </div>

      {/* Details container */}
      <div className="flex flex-col flex-1 pl-5 justify-between py-1">
        <div>
          {/* Header & Heart */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full pr-8">
              <span className="text-[14px] text-muted font-medium mb-1 truncate">
                Sebuah Armada di {listing.locationValue}
              </span>
              <h3 className="text-xl font-semibold text-[#222222] line-clamp-1">
                {listing.title}
              </h3>
            </div>
            
            <div className="absolute top-0 right-0">
              <HeartButton listingId={listing.id} currentUser={currentUser} />
            </div>
          </div>

          <div className="mt-3 text-[15px] text-[#717171]">
            <p>
              {listing.boatType || "Speedboat"} • {listing.passengerCapacity || 5} tamu
            </p>
            <p className="mt-1 line-clamp-1">
               {listing.description || "Fasilitas lengkap untuk memancing."}
            </p>
          </div>
        </div>

        {/* Bottom row: Rating and Price */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <LuStar className="w-3.5 h-3.5 fill-current text-[#222222]" />
            <span className="text-[15px] font-semibold text-[#222222]">4.94</span>
            <span className="text-[14px] text-[#717171] underline">(33)</span>
          </div>

          <div className="flex items-baseline gap-1 text-right">
            <span className="font-semibold text-[#222222] text-[18px]">
              Rp {listing.price.toLocaleString("id-ID")}
            </span>
            <span className="text-[#222222] text-[15px] font-light">
              malam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
