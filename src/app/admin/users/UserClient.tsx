"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuShieldAlert, LuUserCheck, LuUser } from "react-icons/lu";
import Image from "next/image";

interface UserClientProps {
  users: any[];
}

export default function UserClient({ users }: UserClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const onUpdateRole = async (id: string, role: string) => {
    setLoadingId(id);
    try {
      await axios.patch(`/api/users/${id}`, { role });
      toast.success(`Role user berhasil diubah menjadi ${role}`);
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengubah role user");
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
              <th className="px-6 py-4 font-semibold">Pengguna</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Statistik</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                      <Image 
                        src={user.image || "/images/image.png"} 
                        alt="avatar" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    user.role === "HOST" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {user._count.listings} Kapal • {user._count.reservations} Pesanan
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {user.role === "GUEST" && (
                      <button
                        disabled={loadingId === user.id}
                        onClick={() => onUpdateRole(user.id, "HOST")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Jadikan Kapten"
                      >
                        <LuUserCheck size={18} />
                      </button>
                    )}
                    {user.role === "HOST" && (
                      <button
                        disabled={loadingId === user.id}
                        onClick={() => onUpdateRole(user.id, "GUEST")}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        title="Jadikan Guest"
                      >
                        <LuUser size={18} />
                      </button>
                    )}
                    {user.role !== "ADMIN" && (
                       <button
                        disabled={loadingId === user.id}
                        onClick={() => onUpdateRole(user.id, "ADMIN")}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Jadikan Admin"
                      >
                        <LuShieldAlert size={18} />
                      </button>
                    )}
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
