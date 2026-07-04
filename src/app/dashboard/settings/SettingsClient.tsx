// @ts-nocheck
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuUser, LuShieldCheck, LuBell, LuSmartphone } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SettingsClientProps {
  currentUser: any;
}

export default function SettingsClient({ currentUser }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentUser.name || "");

  const onUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch("/api/settings/profile", { name });
      toast.success("Profil berhasil diperbarui");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-gray-900">
          <LuUser className="text-primary" size={24} />
          <h2 className="text-xl font-bold">Informasi Profil</h2>
        </div>
        
        <form onSubmit={onUpdateProfile} className="space-y-4">
          <Input 
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="opacity-50 cursor-not-allowed">
            <Input 
              label="Email (Tidak dapat diubah)"
              value={currentUser.email || "admin@gofishi.com"}
              disabled
            />
          </div>
          <div className="flex justify-end">
            <Button disabled={loading} loading={loading} className="w-fit px-8">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>

      {/* Keamanan Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-gray-900">
          <LuShieldCheck className="text-green-600" size={24} />
          <h2 className="text-xl font-bold">Keamanan Akun</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm h-fit">
                <LuSmartphone size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 italic">Segera Hadir</span>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition shadow-sm" />
                </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm h-fit">
                <LuBell size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-500">Terima update status pesanan melalui email.</p>
              </div>
            </div>
             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Role Info */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <LuShieldCheck size={20} className="text-blue-600 mt-1" />
        <div>
          <p className="text-sm font-bold text-blue-900">Status Akun: {currentUser.role}</p>
          <p className="text-xs text-blue-700">Akun Anda memiliki akses {currentUser.role === 'ADMIN' ? 'penuh ke seluruh sistem' : 'ke fitur manajemen kapal dan pesanan'}.</p>
        </div>
      </div>
    </div>
  );
}
