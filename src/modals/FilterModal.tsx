"use client";

import { useFilterModal } from "@/store/useFilterListingModal";
import Modal from "./Modal";
import { Suspense, useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LuCheck } from "react-icons/lu";

interface FilterMetadata {
  priceRange: { min: number; max: number };
  boatTypes: string[];
  amenities: string[];
  fishingTypes: string[];
  categories: string[];
  facilities: string[];
}

function FilterModalComponent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isOpen, close } = useFilterModal();
  const router = useRouter();

  const [metadata, setMetadata] = useState<FilterMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedBoatTypes, setSelectedBoatTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFishingTechs, setSelectedFishingTechs] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
      // Parse query params
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

      setCategory(searchParams.get("category") || "");
    }
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

  const onApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice !== "") params.set("minPrice", minPrice.toString());
    else params.delete("minPrice");

    if (maxPrice !== "") params.set("maxPrice", maxPrice.toString());
    else params.delete("maxPrice");

    if (selectedBoatTypes.length > 0) params.set("boatType", selectedBoatTypes.join(","));
    else params.delete("boatType");

    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    else params.delete("amenities");

    if (selectedFishingTechs.length > 0) params.set("fishingTech", selectedFishingTechs.join(","));
    else params.delete("fishingTech");

    if (category) params.set("category", category);
    else params.delete("category");

    const targetPath = pathname === "/" ? "/perahu" : pathname;
    router.push(`${targetPath}?${params.toString()}`);
    close();
  };

  const onClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBoatTypes([]);
    setSelectedAmenities([]);
    setSelectedFishingTechs([]);
    setCategory("");
  };

  return (
    <Modal title="Filter" isOpen={isOpen} onClose={close}>
      <div className="h-[80vh] md:h-[70vh] flex flex-col relative">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-28 space-y-8">
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : metadata ? (
            <>
              {/* Price Range */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rentang Harga</h3>
                <p className="text-sm text-gray-500 mb-6">Pilih sesuai budget Anda.</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      label="Minimum (Rp)"
                      name="min-price"
                      type="number"
                      value={minPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setMinPrice(e.target.value ? Number(e.target.value) : "");
                      }}
                    />
                  </div>
                  <div className="text-gray-400 font-bold">-</div>
                  <div className="flex-1">
                    <Input
                      label="Maksimum (Rp)"
                      name="max-price"
                      type="number"
                      value={maxPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setMaxPrice(e.target.value ? Number(e.target.value) : "");
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Boat Types */}
              {metadata.boatTypes.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Tipe Perahu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {metadata.boatTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSelection(setSelectedBoatTypes, type)}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedBoatTypes.includes(type) ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 bg-white group-hover:border-gray-900'}`}>
                          {selectedBoatTypes.includes(type) && <LuCheck size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[15px] text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Fishing Techniques */}
              {metadata.fishingTypes.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Teknik Memancing</h3>
                  <div className="flex flex-wrap gap-3">
                    {metadata.fishingTypes.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleSelection(setSelectedFishingTechs, tech)}
                        className={`px-5 py-2.5 rounded-full border text-sm transition-all ${
                          selectedFishingTechs.includes(tech) 
                            ? "border-gray-900 bg-gray-900 text-white" 
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {metadata.amenities.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Fasilitas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {metadata.amenities.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSelection(setSelectedAmenities, amenity)}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity) ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 bg-white group-hover:border-gray-900'}`}>
                          {selectedAmenities.includes(amenity) && <LuCheck size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[15px] text-gray-900">{amenity}</span>
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

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-6 flex items-center justify-between z-10 rounded-b-2xl">
          <button 
            onClick={onClearFilters}
            className="text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-700 transition"
          >
            Hapus semua
          </button>
          
          <div className="w-1/2 md:w-[200px]">
            <Button onClick={onApplyFilters}>
              Tampilkan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function FilterModal() {
  return (
    <Suspense fallback={<div />}>
      <FilterModalComponent />
    </Suspense>
  );
}
