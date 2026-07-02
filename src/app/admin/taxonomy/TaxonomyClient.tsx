"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuPlus, LuMapPin, LuAnchor, LuCheck, LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";

interface TaxonomyClientProps {
  initialCategories: any[];
  initialLocations: any[];
  initialAmenities: any[];
}

export default function TaxonomyClient({
  initialCategories,
  initialLocations,
  initialAmenities,
}: TaxonomyClientProps) {
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (type: string, data: any) => {
    setLoading(true);
    try {
      await axios.post(`/api/admin/taxonomy/${type}`, data);
      toast.success(`${type} berhasil ditambahkan`);
      router.refresh();
    } catch (error) {
      toast.error(`Gagal menambahkan ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {[
          { id: "categories", label: "Kategori Perahu", icon: LuAnchor },
          { id: "locations", label: "Lokasi Dermaga", icon: LuMapPin },
          { id: "amenities", label: "Fasilitas (Amenities)", icon: LuCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
        {activeTab === "categories" && (
          <TaxonomyList 
            title="Daftar Kategori" 
            items={initialCategories} 
            onAdd={() => {
                const name = prompt("Nama Kategori Baru:");
                if (name) handleCreate("categories", { name });
            }}
          />
        )}
        {activeTab === "locations" && (
          <TaxonomyList 
            title="Daftar Lokasi" 
            items={initialLocations} 
            onAdd={() => {
                const name = prompt("Nama Lokasi/Dermaga:");
                const region = prompt("Wilayah (Region):");
                if (name && region) handleCreate("locations", { name, region });
            }}
          />
        )}
        {activeTab === "amenities" && (
          <TaxonomyList 
            title="Daftar Fasilitas" 
            items={initialAmenities} 
            onAdd={() => {
                const name = prompt("Nama Fasilitas (e.g. AC, GPS):");
                if (name) handleCreate("amenities", { name });
            }}
          />
        )}
      </div>
    </div>
  );
}

function TaxonomyList({ title, items, onAdd }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <Button onClick={onAdd} className="w-fit px-4 flex gap-2">
          <LuPlus size={18} /> Tambah Baru
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">{item.name}</p>
              {item.region && <p className="text-xs text-gray-500">{item.region}</p>}
            </div>
            <button className="text-red-500 hover:text-red-700 text-xs font-bold">Hapus</button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center py-12 text-gray-400 italic">Belum ada data.</p>
        )}
      </div>
    </div>
  );
}
