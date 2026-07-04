"use client";

import EmptyListings from "@/components/ui/EmptyListings";
import { format } from "date-fns";
import { useState } from "react";
import Button from "@/components/ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Matching the updated TripBooking structure
interface Reservation {
  id: string;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  user: {
    name: string | null;
  };
  tripMaster: {
    id: string;
    dateStart: string | Date;
    dateEnd: string | Date;
    status: string;
    listing: {
      title: string;
      imageSrc?: string; // might be missing if listing has `images` array instead
      images?: string[];
    };
  };
}

export default function ReservationClient({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!reservations || reservations.length === 0) {
    return (
      <EmptyListings
        title="Tidak ada reservasi"
        subtitle="Belum ada reservasi untuk armada Anda"
      />
    );
  }

  const onComplete = async (tripMasterId: string) => {
    try {
      setIsLoading(tripMasterId);
      await axios.post(`/api/bookings/${tripMasterId}/complete`);
      toast.success("Trip ditandai selesai! Payout diproses.");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menandai trip selesai.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((res) => {
        const listing = res.tripMaster.listing;
        const image = listing.imageSrc || (listing.images && listing.images[0]) || "/images/placeholder.jpg";
        
        return (
          <div key={res.id} className="border rounded-xl shadow-sm overflow-hidden flex flex-col bg-white">
            <div className="relative h-40 w-full">
              <img src={image} alt={listing.title} className="object-cover w-full h-full" />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-ink shadow">
                {res.paymentStatus}
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-ink truncate">{listing.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Pemesan: {res.user.name || "Tamu"}</p>
              
              <div className="mt-3 text-sm text-ink/80 flex items-center gap-2">
                <span>📅</span>
                <span>
                  {format(new Date(res.tripMaster.dateStart), "dd MMM yyyy")} - {format(new Date(res.tripMaster.dateEnd), "dd MMM yyyy")}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-hairline flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Pendapatan</p>
                  <p className="font-bold text-primary">Rp {res.totalAmount.toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div className="mt-4">
                {res.tripMaster.status !== "COMPLETED" ? (
                  <Button 
                    disabled={isLoading === res.tripMaster.id || res.paymentStatus !== "PAID"}
                    onClick={() => onComplete(res.tripMaster.id)}
                    variant={res.paymentStatus !== "PAID" ? "outline" : "primary"}
                  >
                    {res.paymentStatus !== "PAID" ? "Menunggu Pembayaran" : "Tandai Selesai"}
                  </Button>
                ) : (
                  <div className="w-full text-center py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">
                    Selesai & Payout Sukses
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
