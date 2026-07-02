"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Location {
  id: string;
  name: string;
  region: string;
}

interface LocationSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
}

export default function LocationSelect({ value, onChange }: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) {
    return <div className="p-3 bg-gray-50 rounded-xl animate-pulse h-12" />;
  }

  return (
    <div className="space-y-4 w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Dermaga / Titik Sandar</label>
      <select 
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700"
      >
        <option value="" disabled>-- Pilih Lokasi Operasional --</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name} ({loc.region})
          </option>
        ))}
      </select>
      <p className="text-[10px] text-gray-400 italic">
        * Lokasi di atas adalah dermaga resmi mitra GoFishi. Jika dermaga Anda tidak terdaftar, silakan hubungi Admin.
      </p>
    </div>
  );
}
