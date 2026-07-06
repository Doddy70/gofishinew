"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuSearch, LuX, LuAnchor } from "react-icons/lu";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setLocations([]);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!query || query.trim().length < 2) {
        setLocations([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          // API returns locations directly or wrapped in data
          const results = Array.isArray(data) ? data : (data.data || []);
          setLocations(results);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLocations();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectLocation = (locationValue: string) => {
    const params = new URLSearchParams();
    params.set("locationValue", locationValue);
    router.push(`/perahu?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-canvas md:hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-hairline bg-canvas pt-safe">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-muted/10 transition"
        >
          <LuX size={20} className="text-ink" />
        </button>
        <div className="flex-1 flex items-center bg-muted/10 rounded-full px-4 py-2 border border-transparent focus-within:border-ink focus-within:bg-canvas transition-colors">
          <LuSearch size={18} className="text-muted mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari destinasi..."
            className="w-full bg-transparent border-none outline-none text-[15px] text-ink font-medium placeholder-muted focus:ring-0 p-0"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xs font-bold text-muted tracking-wider uppercase mb-4">
            {query.length >= 2 ? "Hasil Pencarian" : "Ketik destinasi tujuan Anda"}
          </h3>
          
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="text-sm text-muted">Mencari lokasi...</div>
            ) : locations.length > 0 ? (
              locations.map((loc, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(loc.value || loc.label)}
                  className="w-full py-3 flex items-center gap-4 group transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center group-active:bg-canvas group-active:border group-active:border-hairline transition-all">
                    <LuAnchor className="w-5 h-5 text-muted group-active:text-ink" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-ink">{loc.label}</p>
                    <p className="text-[13px] text-muted font-light">{loc.availableBoats} perahu tersedia</p>
                  </div>
                </button>
              ))
            ) : query.length >= 2 ? (
              <div className="text-sm text-muted">Tidak ditemukan lokasi yang cocok.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
