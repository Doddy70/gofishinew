"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuPercent, LuDollarSign, LuTrendingUp, LuSettings } from "react-icons/lu";
import Button from "@/components/ui/Button";

interface FinanceClientProps {
  initialUsers: any[];
  reservations: any[];
}

export default function FinanceClient({ initialUsers, reservations }: FinanceClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const totalVolume = reservations.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalCommission = reservations.reduce((acc, curr) => {
      const rate = curr.listing.user.commissionRate || 10;
      return acc + (curr.totalPrice * rate / 100);
  }, 0);

  const onUpdateCommission = async (userId: string) => {
    const newRate = prompt("Masukkan persentase komisi baru (0-100):");
    if (!newRate || isNaN(Number(newRate))) return;

    setLoadingId(userId);
    try {
      await axios.patch(`/api/admin/finance/commission/${userId}`, { rate: Number(newRate) });
      toast.success("Komisi berhasil diperbarui");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui komisi");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <LuTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Volume Transaksi</p>
              <h3 className="text-2xl font-black text-gray-900">IDR {totalVolume.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <LuDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Estimasi Pendapatan Platform</p>
              <h3 className="text-2xl font-black text-gray-900">IDR {totalCommission.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <LuPercent size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Rata-rata Komisi</p>
              <h3 className="text-2xl font-black text-gray-900">10.0%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* User Commission Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Struktur Komisi Kapten</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Kapten (Kapten)</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-center">Rate Komisi</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-center font-black text-primary">
                    {user.commissionRate || 10.0}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={loadingId === user.id}
                      onClick={() => onUpdateCommission(user.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="Ubah Komisi"
                    >
                      <LuSettings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
