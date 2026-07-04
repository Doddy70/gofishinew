"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuCheck, LuWallet, LuUser } from "react-icons/lu";

export default function CheckoutPage({ params }: { params: { listingId: string } }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use current date for demo
    const startDate = new Date();
    const endDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days later

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: params.listingId,
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
        <p className="text-gray-500 font-medium mb-8">Anda dapat melanjutkan sebagai tamu (Guest) tanpa membuat akun.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <LuUser className="text-primary" /> Informasi Pemesan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-xs text-gray-400 font-medium mt-3 flex items-center gap-1">
              <LuCheck className="text-green-500" /> Anda tidak perlu login. Cukup masukkan email aktif.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-blue-900">Metode Pembayaran</p>
              <p className="text-xs text-blue-600 font-medium mt-1">QRIS Terintegrasi (Midtrans/Xendit)</p>
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
      </div>
    </div>
  );
}
