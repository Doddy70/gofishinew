"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MyBookingsClient() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings/my-trips");
      setBookings(res.data);
    } catch (error) {
      toast.error("Gagal memuat histori perjalanan");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async (id: string) => {
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
    
    try {
      await axios.post(`/api/bookings/${id}/cancel`);
      toast.success("Pesanan berhasil dibatalkan");
      fetchBookings();
    } catch (error) {
      toast.error("Gagal membatalkan pesanan");
    }
  };

  if (loading) {
    return <div className="text-muted">Memuat perjalanan...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-hairline rounded-2xl">
        <h3 className="text-xl font-semibold mb-2 text-ink">Belum ada perjalanan</h3>
        <p className="text-muted mb-6">Mulai rencanakan petualangan memancing Anda.</p>
        <button 
          onClick={() => router.push("/")} 
          className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-[#e00b41] transition"
        >
          Cari Perahu
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-hairline rounded-2xl overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow bg-white flex flex-col">
          <div className="relative aspect-video w-full bg-surface-soft">
            {booking.boat?.image ? (
              <Image 
                src={booking.boat.image} 
                alt={booking.boat.title || "Perahu"} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">Tanpa Gambar</div>
            )}
            
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-[11px] font-bold shadow-sm text-ink uppercase tracking-wider">
              {booking.tripStatus}
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-lg text-ink truncate mb-1">{booking.boat?.title || "Perahu tidak diketahui"}</h3>
            <p className="text-sm text-muted mb-4">{booking.boat?.location || "Lokasi tidak diketahui"}</p>
            
            <div className="flex justify-between items-center text-[15px] border-t border-hairline pt-4 mt-auto">
              <span className="text-muted">Tanggal:</span>
              <span className="font-semibold text-ink">
                {format(new Date(booking.dateStart), "d MMM yyyy")}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[15px] mt-2">
              <span className="text-muted">Status Bayar:</span>
              <span className={`font-semibold ${booking.status === 'PAID' || booking.status === 'HELD' ? 'text-green-600' : 'text-orange-500'}`}>
                {booking.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[15px] mt-2 mb-4">
              <span className="text-muted">Total:</span>
              <span className="font-bold text-lg text-ink">Rp {booking.totalPrice?.toLocaleString('id-ID')}</span>
            </div>

            {booking.tripStatus !== 'COMPLETED' && booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED' && (
              <button 
                onClick={() => onCancel(booking.id)}
                className="w-full py-2.5 mt-2 border border-ink text-ink font-semibold rounded-lg hover:bg-surface-soft transition-colors"
              >
                Batalkan Perjalanan
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
