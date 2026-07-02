"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AdminClientProps {
  userId: string;
}

export default function AdminClient({ userId }: AdminClientProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerification = async (status: "APPROVED" | "REJECTED") => {
    try {
      setLoading(true);
      await axios.patch("/api/admin/verify", {
        userId,
        status,
      });

      toast.success(`Berhasil! Status kapten diubah menjadi ${status}`);
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.response?.data || "Koneksi ke server gagal, periksa jaringan Anda";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Terjadi kesalahan saat memverifikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        disabled={loading}
        onClick={() => handleVerification("REJECTED")}
        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition disabled:opacity-50"
      >
        Tolak
      </button>
      <button
        disabled={loading}
        onClick={() => handleVerification("APPROVED")}
        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition disabled:opacity-50"
      >
        Setujui
      </button>
    </div>
  );
}
