"use client";

import { useState } from "react";
import Listings from "@/components/listings/Listings";
import CategoryList from "./CategoryList";
import MapToggle from "./MapToggle";
import dynamic from "next/dynamic";
import { LuMapPin, LuCalendar } from "react-icons/lu";

const ListingsMap = dynamic(() => import("@/components/listings/ListingsMap"), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full bg-gray-100 animate-pulse rounded-3xl" />
});

interface HomeClientProps {
  searchParams: {
    category?: string;
    locationValue?: string;
    startDate?: string;
    endDate?: string;
    guests?: string;
  };
  initialListings: any[];
  currentUser: any;
}

export default function HomeClient({ searchParams, initialListings, currentUser }: HomeClientProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("map");

  const hasSearch = searchParams?.locationValue || searchParams?.startDate || searchParams?.guests;

  const getSearchSummary = () => {
    const parts: string[] = [];
    if (searchParams?.locationValue) {
      parts.push(`di ${searchParams.locationValue}`);
    }
    if (searchParams?.startDate && searchParams?.endDate) {
      const start = new Date(searchParams.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const end = new Date(searchParams.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      parts.push(`${start} - ${end}`);
    }
    if (searchParams?.guests) {
      parts.push(`${searchParams.guests} tamu`);
    }
    return parts.join(" • ");
  };

  return (
    <div className="w-full">
      <div className="sticky top-[80px] z-30 bg-canvas border-b border-hairline pb-2 px-4 sm:px-6 md:px-10 xl:px-20">
        <CategoryList />
      </div>

      {/* Main Content */}
      <div className={viewMode === "map" ? "w-full" : "max-w-[95%] md:w-[90%] mx-auto py-8 lg:py-12"}>
        {/* Unified Layout for List and Map views */}
        <div className={`flex flex-col-reverse md:flex-row ${viewMode === 'map' ? '' : 'gap-6'}`}>
          
          {/* Listings Container (Hidden on mobile if map is active) */}
          <div className={`${viewMode === 'map' ? 'hidden md:block w-full md:w-[55%] xl:w-[60%] px-4 sm:px-6 lg:px-8 py-6' : 'w-full block'}`}>
            
            {/* Search Results Info */}
            {hasSearch && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-ink">
                      {initialListings.length} Armada Ditemukan
                    </h2>
                    <p className="text-sm text-muted mt-1 flex items-center gap-2">
                      <LuMapPin size={14} />
                      {getSearchSummary() || "Semua Armada"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    {searchParams?.locationValue && (
                      <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        <LuMapPin size={12} />
                        {searchParams.locationValue}
                      </span>
                    )}
                    {(searchParams?.startDate || searchParams?.guests) && (
                      <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        <LuCalendar size={12} />
                        {searchParams.startDate ? "Tanggal dipilih" : `${searchParams.guests} tamu`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!hasSearch && (
              <div className="flex items-end justify-between mb-8 lg:mb-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    {searchParams?.category ? `Armada ${searchParams.category}` : 'Jelajahi Armada Populer'}
                  </h2>
                  <p className="text-gray-500 font-light mt-2">
                    Pilihan kapal terbaik untuk pengalaman mancing tak terlupakan
                  </p>
                </div>
              </div>
            )}

            {initialListings.length > 0 ? (
              <Listings listings={initialListings} currentUser={currentUser} mapView={viewMode === 'map'} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuMapPin size={32} className="text-muted" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Tidak Ada Armada Ditemukan</h3>
                <p className="text-muted max-w-md mx-auto">
                  Coba ubah kriteria pencarian Anda atau lihat armada populer lainnya.
                </p>
              </div>
            )}
          </div>

          {/* Map Container - Only visible when viewMode is 'map' */}
          {viewMode === 'map' && (
            <div className="w-full md:w-[45%] xl:w-[40%] h-[calc(100vh-160px)] sticky top-[160px] z-10 hidden md:block">
              <ListingsMap listings={initialListings} />
            </div>
          )}
        </div>
      </div>

      <MapToggle
        viewMode={viewMode}
        onToggle={() => setViewMode(prev => prev === "list" ? "map" : "list")}
      />
    </div>
  );
}
