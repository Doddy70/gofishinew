"use client";

import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LuExternalLink, LuFileText, LuUser, LuMail } from "react-icons/lu";

interface Props {
  initialKaptens: User[];
}

export default function VerificationList({ initialKaptens }: Props) {
  const [vendors, setKaptens] = useState(initialKaptens);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync props to state if Next.js soft-navigates and sends fresh server data
  useEffect(() => {
    setKaptens(initialKaptens);
  }, [initialKaptens]);

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    try {
      await axios.patch(`/api/admin/verification/${id}`, { status: action });
      toast.success(action === "APPROVED" ? "Kapten berhasil disetujui" : "Pendaftaran vendor ditolak");
      
      // Hapus dari daftar lokal setelah diproses
      setKaptens((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses verifikasi");
    } finally {
      setLoadingId(null);
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Semua Beres!</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Tidak ada kapten atau vendor yang menunggu verifikasi saat ini. Semua antrean telah ditinjau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col xl:flex-row gap-8 justify-between transition-all hover:border-primary/30">
          
          {/* Info Utama */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                <LuUser size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{vendor.name}</h3>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full uppercase tracking-wider">
                    {vendor.hostStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <LuMail size={16} />
                  {vendor.email}
                </div>
              </div>
            </div>

            {/* Dokumen Legal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100">
                    <LuFileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lisensi Nahkoda</p>
                    {vendor.captainLicense ? (
                      <p className="font-bold text-gray-900 text-sm">Terlampir</p>
                    ) : (
                      <p className="font-medium text-red-500 text-sm">Tidak Ada</p>
                    )}
                  </div>
                </div>
                {vendor.captainLicense && (
                  <a href={vendor.captainLicense} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary shadow-lg">
                    <LuExternalLink size={18} />
                  </a>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100">
                    <LuFileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sertifikat Keselamatan</p>
                    {vendor.boatSafetyCert ? (
                      <p className="font-bold text-gray-900 text-sm">Terlampir</p>
                    ) : (
                      <p className="font-medium text-red-500 text-sm">Tidak Ada</p>
                    )}
                  </div>
                </div>
                {vendor.boatSafetyCert && (
                  <a href={vendor.boatSafetyCert} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary shadow-lg">
                    <LuExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Aksi Persetujuan */}
          <div className="xl:w-64 flex flex-row xl:flex-col gap-3 justify-center border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8">
            <button
              onClick={() => handleAction(vendor.id, "APPROVED")}
              disabled={loadingId === vendor.id}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition shadow-lg shadow-green-500/30 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Setujui
            </button>
            <button
              onClick={() => handleAction(vendor.id, "REJECTED")}
              disabled={loadingId === vendor.id}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 py-4 px-6 bg-white hover:bg-red-50 border-2 border-gray-100 hover:border-red-100 text-gray-600 hover:text-red-600 rounded-2xl font-bold transition disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              Tolak
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
