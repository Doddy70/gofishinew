"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuShieldCheck, LuChevronLeft } from "react-icons/lu";
import Link from "next/link";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice: true, 
      });

      if (error) {
        toast.error(error.message || "Kode verifikasi salah");
        return;
      }

      toast.success("Verifikasi berhasil");
      // Clean redirect to dashboard after verification
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white rounded-[32px] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition mb-8 font-bold text-sm">
             <LuChevronLeft size={20} /> Kembali
          </Link>

          <div className="mb-10 text-left">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
               <LuShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Verifikasi identitas Anda</h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Kami telah mengirimkan kode keamanan. Masukkan 6 digit kode dari aplikasi autentikator untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="space-y-2">
               <div className="p-4 border-2 border-gray-100 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all bg-gray-50/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kode Verifikasi</p>
                  <input 
                    type="text"
                    placeholder="000 000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className="w-full bg-transparent outline-none text-2xl font-black tracking-[0.5em] text-gray-900 placeholder:text-gray-200"
                  />
               </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-primary transition shadow-xl shadow-gray-900/20 disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              {loading ? "Memverifikasi..." : "Lanjutkan"}
            </button>

            <div className="pt-4 text-center">
               <p className="text-xs text-gray-400 font-medium">
                 Butuh bantuan? <span className="text-gray-900 underline font-bold cursor-pointer">Gunakan kode cadangan</span>
               </p>
            </div>
          </form>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
        © 2026 GoFishi Inc. All rights reserved.
      </p>
    </div>
  );
}
