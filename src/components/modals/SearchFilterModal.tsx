"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useFilterModal } from "@/store/useFilterListingModal";
import { LuX, LuCheck } from "react-icons/lu";

interface FilterMetadata {
  priceRange: { min: number; max: number };
  boatTypes: string[];
  amenities: string[];
  fishingTypes: string[];
  categories: string[];
  facilities: string[];
}

export default function SearchFilterModal() {
  const { isOpen, close } = useFilterModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [metadata, setMetadata] = useState<FilterMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedBoatTypes, setSelectedBoatTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFishingTechs, setSelectedFishingTechs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchMetadata();
      // Initialize state from URL params
      const currentMin = searchParams.get("minPrice");
      const currentMax = searchParams.get("maxPrice");
      setMinPrice(currentMin ? Number(currentMin) : "");
      setMaxPrice(currentMax ? Number(currentMax) : "");

      const currentBoatTypes = searchParams.get("boatType");
      setSelectedBoatTypes(currentBoatTypes ? currentBoatTypes.split(",") : []);

      const currentAmenities = searchParams.get("amenities");
      setSelectedAmenities(currentAmenities ? currentAmenities.split(",") : []);

      const currentFishingTech = searchParams.get("fishingTech");
      setSelectedFishingTechs(currentFishingTech ? currentFishingTech.split(",") : []);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, searchParams]);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/listings/filters");
      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      }
    } catch (error) {
      console.error("Failed to fetch filter metadata", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => 
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (minPrice !== "") currentParams.set("minPrice", minPrice.toString());
    else currentParams.delete("minPrice");

    if (maxPrice !== "") currentParams.set("maxPrice", maxPrice.toString());
    else currentParams.delete("maxPrice");

    if (selectedBoatTypes.length > 0) currentParams.set("boatType", selectedBoatTypes.join(","));
    else currentParams.delete("boatType");

    if (selectedAmenities.length > 0) currentParams.set("amenities", selectedAmenities.join(","));
    else currentParams.delete("amenities");

    if (selectedFishingTechs.length > 0) currentParams.set("fishingTech", selectedFishingTechs.join(","));
    else currentParams.delete("fishingTech");

    // Default target path is the current one, unless on root, then we could go to /perahu for better results, but staying on current is fine.
    const targetPath = pathname === "/" ? "/perahu" : pathname;
    
    router.push(`${targetPath}?${currentParams.toString()}`);
    close();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBoatTypes([]);
    setSelectedAmenities([]);
    setSelectedFishingTechs([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={close}
      />
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[60] w-full md:w-[780px] bg-canvas rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-full md:fade-in md:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline shrink-0">
          <button onClick={close} className="p-2 -ml-2 rounded-full hover:bg-surface-soft transition">
            <LuX size={20} className="text-ink" />
          </button>
          <h2 className="text-lg font-bold text-ink">Filter</h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : metadata ? (
            <>
              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-ink">Rentang Harga</h3>
                <p className="text-sm text-muted">Harga rata-rata per malam bervariasi.</p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex-1 flex flex-col border border-hairline rounded-xl px-4 py-2 focus-within:border-ink focus-within:ring-1 focus-within:ring-ink transition">
                    <label className="text-xs font-bold text-muted uppercase">Minimum</label>
                    <div className="flex items-center gap-1">
                      <span className="text-ink">Rp</span>
                      <input 
                        type="number" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")} 
                        placeholder={metadata.priceRange.min.toString()}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-ink outline-none"
                      />
                    </div>
                  </div>
                  <span className="text-muted">-</span>
                  <div className="flex-1 flex flex-col border border-hairline rounded-xl px-4 py-2 focus-within:border-ink focus-within:ring-1 focus-within:ring-ink transition">
                    <label className="text-xs font-bold text-muted uppercase">Maksimum</label>
                    <div className="flex items-center gap-1">
                      <span className="text-ink">Rp</span>
                      <input 
                        type="number" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")} 
                        placeholder={metadata.priceRange.max.toString()}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-ink outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-hairline" />

              {/* Boat Type */}
              {metadata.boatTypes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Tipe Perahu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {metadata.boatTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSelection(setSelectedBoatTypes, type)}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedBoatTypes.includes(type) ? 'bg-primary border-primary text-white' : 'border-hairline bg-white group-hover:border-ink'}`}>
                          {selectedBoatTypes.includes(type) && <LuCheck size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[15px] text-ink">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {metadata.boatTypes.length > 0 && <hr className="border-hairline" />}

              {/* Fishing Techniques */}
              {metadata.fishingTypes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Teknik Memancing</h3>
                  <div className="flex flex-wrap gap-2">
                    {metadata.fishingTypes.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleSelection(setSelectedFishingTechs, tech)}
                        className={`px-5 py-2.5 rounded-full border text-[14px] font-medium transition-all ${
                          selectedFishingTechs.includes(tech) 
                            ? 'border-ink bg-surface-soft text-ink ring-1 ring-ink' 
                            : 'border-hairline hover:border-ink text-ink'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {metadata.fishingTypes.length > 0 && <hr className="border-hairline" />}

              {/* Amenities */}
              {metadata.amenities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Fasilitas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {metadata.amenities.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSelection(setSelectedAmenities, amenity)}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity) ? 'bg-primary border-primary text-white' : 'border-hairline bg-white group-hover:border-ink'}`}>
                          {selectedAmenities.includes(amenity) && <LuCheck size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[15px] text-ink">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </>
          ) : (
            <div className="text-center text-muted py-10">Gagal memuat filter.</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline shrink-0 bg-canvas rounded-b-3xl md:rounded-b-2xl">
          <button 
            onClick={handleClear}
            className="text-[15px] font-semibold underline text-ink hover:text-muted transition"
          >
            Hapus semua
          </button>
          <button 
            onClick={handleApply}
            className="bg-primary hover:bg-[#E31C5F] text-white px-8 py-3.5 rounded-lg font-semibold text-[15px] transition-colors shadow-sm"
          >
            Tampilkan
          </button>
        </div>

      </div>
    </>
  );
}
