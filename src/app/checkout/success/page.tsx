"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuCheck, LuGift, LuArrowRight } from "react-icons/lu";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const reservationId = searchParams.get("reservationId");

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 mt-10">
      <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100">
          <LuCheck size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Pemesanan Berhasil!</h1>
        <p className="text-gray-500 font-medium mb-8">
          Terima kasih! Pesanan Anda (ID: <span className="font-bold text-gray-700">{reservationId || "XXX"}</span>) telah dikonfirmasi dan QRIS pembayaran telah dikirim ke email Anda.
        </p>

        {token && (
          <div className="w-full bg-gradient-to-br from-primary/10 to-orange-50 border border-primary/20 p-8 rounded-3xl text-left relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-white p-3 rounded-2xl text-primary shadow-md">
                <LuGift size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1">Simpan Detail Anda untuk Berikutnya!</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">
                  Lacak pesanan ini dan selesaikan pembayaran lebih cepat di masa mendatang. Cukup buat kata sandi untuk akun gratis Anda.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    placeholder="Buat Kata Sandi Baru"
                    className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button className="bg-primary text-white p-3 rounded-xl hover:bg-orange-600 transition shadow-md flex items-center justify-center">
                    <LuArrowRight size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-3">Link ini akan kedaluwarsa dalam 72 jam.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors underline underline-offset-4">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 mt-10 flex justify-center">
      <p className="text-gray-500">Memuat...</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
