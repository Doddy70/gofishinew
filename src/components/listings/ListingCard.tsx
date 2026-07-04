"use client";

import useCountries from "@/custom-hooks/useCountries";
import Image from "next/image";
import HeartButton from "../favorites/HeartButton";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { format } from "date-fns";
import CancelReservationButton from "../reservations/CancelReservationButton";
import { LuStar, LuTrash2, LuPencil } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { useEditListingModal } from "@/store/useEditListingModalStore";

interface ListingCardProps {
  listing: Listing;
  currentUser?: {
    id: string;
    favoriteIds: string[];
  } | null;

  hideFavoriteButton?: boolean;
  property?: boolean;
  reservation?: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  };

  trip?: boolean;
  actionLabel?: string;
}

export default function ListingCard({
  listing,
  currentUser,
  hideFavoriteButton,
  property,
  reservation,
  actionLabel,
  trip,
}: ListingCardProps) {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(listing.locationValue);
  const { open: openEditModal } = useEditListingModal();

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Apakah Anda yakin ingin menghapus armada ini?")) return;

    try {
      await axios.delete(`/api/listings/${listing.id}`);
      toast.success("Armada berhasil dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus armada");
    }
  };

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(listing);
  };

  // Use slug for SEO-friendly URLs, fallback to ID for backwards compatibility
  const detailUrl = listing.slug
    ? `/perahu/${listing.slug}`
    : `/listings/${listing.id}`;

  return (
    <div
      className="group cursor-pointer flex flex-col gap-0"
      onClick={() => router.push(detailUrl)}
    >
      {/* image container */}
      <div className="relative aspect-[20/19] w-full rounded-[12px] overflow-hidden bg-hairline shadow-soft transition-transform duration-300 active:scale-95 group">
        <Image
          src={listing.imageSrc || "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=2070&auto=format&fit=crop"}
          alt={listing.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
        />

        {/* Carousel Dots Fake Indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
        </div>

        {/* Guest Favorite Badge */}
        <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full flex items-center shadow-md">
          <span className="text-[14px] font-semibold text-[#222222]">Pilihan Angler</span>
        </div>

        {!hideFavoriteButton && (
          <div className="absolute top-3 right-3">
             <HeartButton listingId={listing.id} currentUser={currentUser} />
          </div>
        )}
      </div>

      {/* Details container */}
      <div className="flex flex-col mt-3">
        {/* Rating & Location */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[15px] text-[#222222] truncate">
            {listing.locationValue}
          </h3>
          <div className="flex items-center gap-1">
            <LuStar className="w-3 h-3 fill-current text-[#222222]" />
            <span className="text-[15px] text-[#222222]">4.94 (33)</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-[15px] text-[#717171] truncate mt-[2px]">
          {listing.title}
        </p>

        {/* Boat Specs */}
        <p className="text-[15px] text-[#717171] truncate mt-[2px]">
          {listing.boatType || "Speedboat"} • {listing.passengerCapacity || 5} tamu
        </p>

        {/* Pricing / Reservation Info */}
        <div className="mt-[6px] flex items-baseline gap-1">
          {reservation ? (
            <div className="flex flex-col">
              <p className="text-[#717171] text-[15px] -mt-1">
                {format(new Date(reservation.startDate), "d MMM")} -{" "}
                {format(new Date(reservation.endDate), "d MMM yyyy")}
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-semibold text-[#222222] text-[15px] underline decoration-1 underline-offset-2">
                  Rp {reservation.totalPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[#222222] text-[15px] font-light">total</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-[#222222] text-[15px] underline decoration-1 underline-offset-2">
                Rp {listing.price.toLocaleString('id-ID')}
              </span>
              <span className="text-[#222222] text-[15px] font-light">
                untuk 1 hari
              </span>
            </div>
          )}
        </div>

        {/* Extra Info for Owner/Trip */}
        {property && (
          <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
            <p className="text-[13px] text-muted font-light">
               Daftar: {new Date(listing.createdAt).toLocaleDateString('id-ID')}
            </p>
            <div className="flex gap-2">
               <button 
                onClick={onEdit}
                className="p-2 text-ink hover:bg-muted rounded-full transition"
                title="Edit"
               >
                 <LuPencil size={16} />
               </button>
               <button 
                onClick={onDelete}
                className="p-2 text-ink hover:bg-muted rounded-full transition"
                title="Hapus"
               >
                 <LuTrash2 size={16} />
               </button>
            </div>
          </div>
        )}

        {trip && reservation && actionLabel && (
          <div className="mt-3">
             <CancelReservationButton
                actionLabel={actionLabel}
                reservationId={reservation.id}
              />
          </div>
        )}
      </div>
    </div>
  );
}
