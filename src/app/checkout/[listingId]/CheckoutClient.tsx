"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuCheck, LuWallet, LuUser } from "react-icons/lu";
import CheckoutPriceBreakdown from "@/components/checkout/CheckoutPriceBreakdown";

interface CheckoutClientProps {
  listingId: string;
  listing: any; // Ideally the Listing type
  searchParams: {
    startDate?: string;
    endDate?: string;
    guests?: string;
  };
}

export default function CheckoutClient({ listingId, listing, searchParams }: CheckoutClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Ambil tanggal dari URL atau gunakan default (demo)
  const startDate = searchParams.startDate ? new Date(searchParams.startDate) : new Date();
  const endDate = searchParams.endDate ? new Date(searchParams.endDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guestEmail: email,
          guestName: name,
          pmi: "fiat-qris-midtrans", // Defaulting to Midtrans QRIS
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan checkout");
      }

      // Success, route to payment/success page
      router.push(`/checkout/success?reservationId=${data.reservationId}&token=${data.accountToken}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 mt-10">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Checkout & Pembayaran</h1>
        <p className="text-gray-500 font-medium mb-8">Selesaikan pembayaran untuk <b>{listing.title}</b>.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleCheckout} className="space-y-6 lg:order-1">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <LuUser className="text-primary" /> Informasi Pemesan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email (Wajib)</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@example.com"
                    className="w-full bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-4 flex items-start gap-2">
                <LuCheck className="text-green-500 shrink-0 mt-0.5" /> 
                <span>Anda dapat checkout sebagai tamu. Rincian pesanan akan dikirim ke email.</span>
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-blue-900">Metode Pembayaran</p>
                <p className="text-xs text-blue-600 font-medium mt-1">QRIS Terintegrasi (Midtrans)</p>
              </div>
              <LuWallet size={24} className="text-blue-500" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </form>

          <div className="lg:order-2">
            <CheckoutPriceBreakdown
              pricePerNight={listing.price}
              weekendPrice={listing.weekendPrice}
              holidayPrice={listing.holidayPrice}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
