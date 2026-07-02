"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { LuCheck, LuX, LuEye } from "react-icons/lu";
import Image from "next/image";

interface ReservationClientProps {
  reservations: any[];
}

export default function ReservationClient({ reservations }: ReservationClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const onUpdateStatus = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      await axios.patch(`/api/reservations/${id}`, { status });
      toast.success(`Pesanan berhasil di-${status.toLowerCase()}`);
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui status pesanan");
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
              <th className="px-6 py-4 font-semibold">Tamu & Perahu</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Total Harga</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                      <Image 
                        src={res.listing.imageSrc} 
                        alt="boat" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{res.user.name}</p>
                      <p className="text-xs text-gray-500">{res.listing.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {format(new Date(res.startDate), "dd MMM")} - {format(new Date(res.endDate), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  IDR {res.totalPrice.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    res.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    res.status === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {res.status === "PENDING" && (
                      <>
                        <button
                          disabled={loadingId === res.id}
                          onClick={() => onUpdateStatus(res.id, "APPROVED")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Terima"
                        >
                          <LuCheck size={18} />
                        </button>
                        <button
                          disabled={loadingId === res.id}
                          onClick={() => onUpdateStatus(res.id, "REJECTED")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Tolak"
                        >
                          <LuX size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition">
                      <LuEye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
