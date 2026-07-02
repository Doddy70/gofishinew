"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuPlus, LuTrash2, LuCamera, LuFish } from "react-icons/lu";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface FishingLogClientProps {
  initialLogs: any[];
  listings: any[];
}

export default function FishingLogClient({ initialLogs, listings }: FishingLogClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onUpload = async () => {
    const imageSrc = prompt("Masukkan URL Foto Hasil Tangkapan:");
    const description = prompt("Deskripsi (misal: Tenggiri 10kg di Spot A):");
    const listingId = listings[0]?.id;

    if (!imageSrc || !listingId) return;

    setLoading(true);
    try {
      await axios.post("/api/dashboard/fishing-log", { 
        imageSrc, 
        description, 
        listingId 
      });
      toast.success("Log tangkapan berhasil ditambahkan");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan log");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    try {
      await axios.delete(`/api/dashboard/fishing-log/${id}`);
      toast.success("Foto dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LuFish className="text-orange-500" /> Galeri Tangkapan
        </h2>
        <Button onClick={onUpload} className="w-fit px-6 flex gap-2">
          <LuCamera size={18} /> Unggah Hasil Tangkapan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialLogs.map((log) => (
          <div key={log.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="relative aspect-square">
              <Image 
                src={log.imageSrc} 
                alt="Catch" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <button 
                onClick={() => onDelete(log.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{log.description || "Tangkapan Mantap!"}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">{log.listing.title}</p>
            </div>
          </div>
        ))}
        {initialLogs.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <LuCamera size={48} className="mb-4 opacity-20" />
            <p className="italic">Belum ada foto tangkapan. Mulai unggah untuk menarik minat penyewa!</p>
          </div>
        )}
      </div>
    </div>
  );
}
