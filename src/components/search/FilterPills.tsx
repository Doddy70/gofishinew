'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuX, LuZap, LuSlidersHorizontal, LuChevronRight } from "react-icons/lu";
import { useFilterModal } from "@/store/useFilterListingModal";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};
interface FilterMetadata {
  priceRange: { min: number; max: number };
  boatTypes: string[];
  amenities: string[];
  fishingTypes: string[];
  categories: string[];
  facilities: string[];
}

export default function FilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openFilterModal } = useFilterModal();
  
  const [filters, setFilters] = useState<FilterMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parse active filters from URL
  const activeBoatType = searchParams.get('boatType');
  const instantBook = searchParams.get('instantBook') === 'true';
  const hasOtherFilters = !!(
    searchParams.get('minPrice') || 
    searchParams.get('maxPrice') || 
    searchParams.get('amenities')
  );

  useEffect(() => {
    fetch("/api/listings/filters")
      .then(res => res.json())
      .then((data) => {
        setFilters(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load filters:", err);
        setIsLoading(false);
      });
  }, []);

  const toggleFilter = (key: string, value: string | boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (current.get(key) === String(value)) {
      current.delete(key);
    } else {
      current.set(key, String(value));
    }
    
    // Always reset to page 1 when filtering
    current.set("page", "1");
    
    router.push(`/perahu?${current.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2 px-4 md:px-0">
        <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-full flex-shrink-0" />
        <div className="w-32 h-9 bg-gray-100 animate-pulse rounded-full flex-shrink-0" />
        <div className="w-28 h-9 bg-gray-100 animate-pulse rounded-full flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide items-center w-full px-4 md:px-0 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Price Range Button */}
      <button className="flex items-center gap-2 px-4 py-2 border border-hairline rounded-full text-sm font-medium whitespace-nowrap hover:bg-surface-soft transition-colors shadow-sm bg-canvas flex-shrink-0">
        <span>Harga</span>
        <span className="text-muted">|</span>
        <span className="text-muted font-normal">
          {filters?.priceRange?.min != null ? formatCurrency(filters.priceRange.min) : "Rp 0"} - {filters?.priceRange?.max != null ? formatCurrency(filters.priceRange.max) : "~"}
        </span>
      </button>

      {/* Boat Types */}
      {filters?.boatTypes?.map(type => (
        <button
          key={type}
          onClick={() => toggleFilter('boatType', type)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm flex-shrink-0
            ${activeBoatType === type 
              ? 'bg-ink text-canvas border-ink' 
              : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'
            }`}
        >
          {type}
          {activeBoatType === type && <LuX size={14} />}
        </button>
      ))}
      
      {/* Instant Book */}
      <button 
        onClick={() => toggleFilter('instantBook', true)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm flex-shrink-0
          ${instantBook 
            ? 'bg-ink text-canvas border-ink' 
            : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'
          }`}
      >
        <LuZap size={14} className={instantBook ? "text-yellow-400 fill-yellow-400" : ""} />
        Pemesanan Instan
        {instantBook && <LuX size={14} />}
      </button>
      
      {/* More Filters Button */}
      <button 
        onClick={() => openFilterModal()}
        className="flex items-center gap-2 px-4 py-2 border border-hairline rounded-full text-sm font-medium whitespace-nowrap hover:bg-surface-soft transition-colors shadow-sm bg-canvas flex-shrink-0 ml-auto"
      >
        <LuSlidersHorizontal size={16} />
        <span>Filter Lainnya</span>
        {hasOtherFilters && (
          <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] rounded-full">
            !
          </span>
        )}
      </button>
    </div>
  );
}
