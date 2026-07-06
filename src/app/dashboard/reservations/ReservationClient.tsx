"use client";

import EmptyListings from "@/components/ui/EmptyListings";
import { format } from "date-fns";
import { useState } from "react";
import Button from "@/components/ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Matching the updated TripBooking structure
interface Reservation {
  id: string;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "HELD";
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
      imageSrc?: string; 
      images?: string[];
    };
  };
}

export default function ReservationClient({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");

  if (!reservations || reservations.length === 0) {
    return (
      <EmptyListings
        title="Tidak ada reservasi"
        subtitle="Belum ada reservasi untuk armada Anda"
      />
    );
  }

  const onComplete = async (tripMasterId: string) => {
    if (!confirm("Konfirmasi: Apakah trip ini benar-benar telah selesai? Dana akan segera dicairkan ke saldo Anda.")) return;
    
    try {
      setIsLoading(tripMasterId);
      await axios.post(`/api/bookings/${tripMasterId}/complete`);
      toast.success("Trip ditandai selesai! Payout sedang diproses.");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menandai trip selesai.");
    } finally {
      setIsLoading(null);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const isCompleted = res.tripMaster.status === "COMPLETED" || res.tripMaster.status === "CANCELLED";
    if (activeTab === "ACTIVE") return !isCompleted;
    return isCompleted;
  });

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-hairline mb-8">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`pb-4 text-[15px] font-semibold transition-colors relative ${
            activeTab === "ACTIVE" ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          Pesanan Aktif
          {activeTab === "ACTIVE" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`pb-4 text-[15px] font-semibold transition-colors relative ${
            activeTab === "HISTORY" ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          Riwayat
          {activeTab === "HISTORY" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink rounded-t-full"></div>
          )}
        </button>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-hairline rounded-2xl bg-white">
          <h3 className="text-xl font-semibold mb-2 text-ink">Tidak ada pesanan</h3>
          <p className="text-muted text-center max-w-sm">
            {activeTab === "ACTIVE" 
              ? "Anda tidak memiliki pesanan aktif yang perlu diproses saat ini." 
              : "Anda belum memiliki riwayat pesanan yang telah selesai."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReservations.map((res) => {
            const listing = res.tripMaster.listing;
            const image = listing.imageSrc || (listing.images && listing.images[0]) || "/images/placeholder.jpg";
            
            return (
              <div key={res.id} className="border border-hairline rounded-2xl shadow-sm overflow-hidden flex flex-col bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
                {/* Card Header (Image) */}
                <div className="relative aspect-video w-full bg-surface-soft">
                  <Image src={image} alt={listing.title} fill className="object-cover" />
                  
                  {/* Trip Status Pill */}
                  <div className={`absolute top-3 left-3 px-3 py-1 bg-white/95 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider ${
                    res.tripMaster.status === "COMPLETED" ? "text-green-600" : "text-ink"
                  }`}>
                    {res.tripMaster.status}
                  </div>
                  
                  {/* Payment Status Pill */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider ${
                    res.paymentStatus === "PAID" || res.paymentStatus === "HELD" ? "bg-green-100 text-green-700" 
                    : res.paymentStatus === "REFUNDED" ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                  }`}>
                    {res.paymentStatus}
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-ink truncate mb-1">{listing.title}</h3>
                  <p className="text-sm text-muted mb-4">Pemesan: {res.user.name || "Tamu"}</p>
                  
                  <div className="flex justify-between items-center text-[15px] border-t border-hairline pt-4 mt-auto">
                    <span className="text-muted">Tanggal:</span>
                    <span className="font-semibold text-ink">
                      {format(new Date(res.tripMaster.dateStart), "dd MMM")} - {format(new Date(res.tripMaster.dateEnd), "dd MMM yyyy")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[15px] mt-2 mb-4">
                    <span className="text-muted">Pendapatan:</span>
                    <span className="font-bold text-lg text-ink">Rp {res.totalAmount.toLocaleString("id-ID")}</span>
                  </div>

                  {/* Actions */}
                  {res.tripMaster.status !== "COMPLETED" && res.tripMaster.status !== "CANCELLED" ? (
                    <Button 
                      disabled={isLoading === res.tripMaster.id || (res.paymentStatus !== "PAID" && res.paymentStatus !== "HELD")}
                      onClick={() => onComplete(res.tripMaster.id)}
                      loading={isLoading === res.tripMaster.id}
                      className="w-full bg-primary hover:bg-primary-active text-white font-semibold py-3 rounded-lg transition-colors mt-2"
                    >
                      {(res.paymentStatus !== "PAID" && res.paymentStatus !== "HELD") ? "Menunggu Pembayaran" : "Tandai Selesai"}
                    </Button>
                  ) : (
                    <div className="w-full text-center py-2.5 mt-2 bg-green-50 text-green-700 font-semibold rounded-lg border border-green-200">
                      Penyewaan Selesai
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
