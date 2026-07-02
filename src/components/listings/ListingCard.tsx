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

  return (
    <div
      className="group cursor-pointer flex flex-col gap-0"
      onClick={() => router.push(`/listings/${listing.id}`)}
    >
      {/* image container */}
      <div className="relative aspect-[20/19] w-full rounded-[20px] overflow-hidden bg-gray-200 shadow-[var(--shadow-card)] transition-transform duration-300 active:scale-95">
        <Image
          src={listing.imageSrc || "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=2070&auto=format&fit=crop"}
          alt={listing.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
        />

        {/* Guest Favorite Badge */}
        <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full flex items-center shadow-[var(--shadow-hover)]">
          <span className="text-[12px] font-bold text-[var(--palette-near-black)]">Pilihan Angler</span>
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
          <h3 className="font-bold text-[15px] text-[var(--palette-near-black)] truncate">
            {listing.locationValue}
          </h3>
          <div className="flex items-center gap-1">
            <LuStar className="w-3 h-3 fill-[var(--palette-near-black)] text-[var(--palette-near-black)]" />
            <span className="text-[15px] font-light text-[var(--palette-near-black)]">4.9</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-[15px] text-[var(--palette-secondary-gray)] font-light truncate -mt-0.5">
          {listing.title}
        </p>

        {/* Boat Specs */}
        <p className="text-[15px] text-[var(--palette-secondary-gray)] font-light truncate -mt-0.5">
          {listing.boatType || "Speedboat"} • {listing.passengerCapacity || 5} tamu
        </p>

        {/* Pricing / Reservation Info */}
        <div className="mt-1 flex items-baseline gap-1">
          {reservation ? (
            <div className="flex flex-col">
              <p className="text-[var(--palette-secondary-gray)] text-[15px] font-light -mt-1">
                {format(new Date(reservation.startDate), "d MMM")} -{" "}
                {format(new Date(reservation.endDate), "d MMM yyyy")}
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-bold text-[15px] text-[var(--palette-near-black)]">
                  Rp {reservation.totalPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[var(--palette-near-black)] font-light text-[15px]">total</span>
              </div>
            </div>
          ) : (
            <>
              <span className="font-bold text-[15px] text-[var(--palette-near-black)]">
                Rp {listing.price.toLocaleString('id-ID')}
              </span>
              <span className="text-[var(--palette-near-black)] text-[15px] font-light">malam</span>
            </>
          )}
        </div>

        {/* Extra Info for Owner/Trip */}
        {property && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-[13px] text-gray-500 font-light">
               Daftar: {new Date(listing.createdAt).toLocaleDateString('id-ID')}
            </p>
            <div className="flex gap-2">
               <button 
                onClick={onEdit}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                title="Edit"
               >
                 <LuPencil size={16} />
               </button>
               <button 
                onClick={onDelete}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
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
