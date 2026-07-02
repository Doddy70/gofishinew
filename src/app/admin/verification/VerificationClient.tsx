"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuFileText, LuCheck, LuX, LuEye } from "react-icons/lu";
import Image from "next/image";

interface VerificationClientProps {
  initialUsers: any[];
}

export default function VerificationClient({ initialUsers }: VerificationClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const onUpdateStatus = async (userId: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(userId);
    try {
      await axios.patch(`/api/admin/verification/${userId}`, { status });
      toast.success(`User berhasil di-${status.toLowerCase()}`);
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui status verifikasi");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Calon Kapten</th>
              <th className="px-6 py-4 font-semibold">Dokumen Legalitas</th>
              <th className="px-6 py-4 font-semibold">Tanggal Daftar</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                      <Image 
                        src={user.image || "/images/image.png"} 
                        alt="avatar" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.captainLicense && (
                      <a href={user.captainLicense} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                        <LuFileText size={14} /> Lisensi
                      </a>
                    )}
                    {user.boatSafetyCert && (
                      <a href={user.boatSafetyCert} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                        <LuFileText size={14} /> Sertifikat
                      </a>
                    )}
                    {!user.captainLicense && !user.boatSafetyCert && (
                        <span className="text-gray-400 italic">Belum upload</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={loadingId === user.id}
                      onClick={() => onUpdateStatus(user.id, "APPROVED")}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Setujui"
                    >
                      <LuCheck size={18} />
                    </button>
                    <button
                      disabled={loadingId === user.id}
                      onClick={() => onUpdateStatus(user.id, "REJECTED")}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Tolak"
                    >
                      <LuX size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition">
                      <LuEye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialUsers.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                        Tidak ada pengajuan verifikasi tertunda.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
