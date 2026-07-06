"use client";

import { useState, useRef } from "react";
import Listings from "@/components/listings/Listings";

import dynamic from "next/dynamic";
import { LuMapPin, LuCalendar, LuX, LuAnchor, LuStar, LuChevronUp } from "react-icons/lu";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    fishingTech?: string;
  };
  initialListings: any[];
  currentUser: any;
}

export default function HomeClient({ searchParams, initialListings, currentUser }: HomeClientProps) {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const selectedListing = initialListings.find((l) => l.id === selectedListingId);

  const collapseBottomSheet = () => {
    setIsExpanded(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* Container utama dengan overflow hidden pada mobile map agar tidak ada scroll window */}
      <div className="w-full relative h-[calc(100dvh-150px)] md:h-auto md:min-h-[calc(100vh-150px)] overflow-hidden md:overflow-visible">
        
        {/* Unified Layout for List and Map views */}
        <div className="flex flex-col-reverse md:flex-row md:items-start w-full h-full md:h-auto relative">
          
          {/* Listings Container (Desktop View & Mobile Fixed Bottom Sheet) */}
          <div 
            style={{ height: isExpanded ? '100dvh' : '15vh' }}
            className={`
                   /* Mobile styles (Fixed Bottom Sheet) */
                   fixed bottom-[65px] md:bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out flex flex-col
                   ${selectedListingId ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}
                   
                   /* Desktop styles overrides */
                   md:static md:w-[55%] xl:w-[60%] md:!h-auto md:px-6 md:py-6 md:translate-y-0 md:opacity-100 md:shadow-none md:bg-transparent md:rounded-none md:flex-none md:pointer-events-auto
            `}
          >
            {/* Mobile Drag Handle Indicator (Tap to Expand/Collapse) */}
            <div 
              className="w-full flex flex-col items-center justify-center shrink-0 md:hidden pt-4 pb-4 cursor-pointer active:bg-gray-50 rounded-t-3xl border-b border-gray-100"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-3"></div>
              {!isExpanded && (
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  Jelajahi {initialListings.length} perahu <LuChevronUp className="text-gray-400" />
                </span>
              )}
            </div>

            {/* Scrollable Content Inside Bottom Sheet */}
            <div 
              ref={scrollContainerRef}
              className={`flex-1 w-full md:px-0 px-4 overflow-y-auto md:overflow-visible pb-24 md:pb-0 ${!isExpanded ? 'hidden md:block' : 'block'}`}
            >
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
                <Listings listings={initialListings} currentUser={currentUser} mapView={true} />
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
          </div>

          {/* Floating Action Button (Peta) on Expanded List */}
          {isExpanded && !selectedListingId && (
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button 
                onClick={collapseBottomSheet}
                className="bg-gray-900 text-white px-5 py-3 rounded-full font-semibold shadow-lg pointer-events-auto flex items-center gap-2 active:scale-95 transition-transform"
              >
                Peta <LuMapPin size={16} />
              </button>
            </div>
          )}

          {/* Map Container - Absolute on mobile to fill screen, sticky on desktop */}
          <div className="absolute inset-0 z-10 w-full h-full md:w-[45%] xl:w-[40%] md:h-[calc(100vh-150px)] md:sticky md:top-[150px]">
              <ListingsMap 
                listings={initialListings} 
                fullscreen 
                selectedListingId={selectedListingId}
                onListingSelect={setSelectedListingId}
              />
            </div>

          {/* Floating Selected Card over the map (Airbnb style) */}
          {selectedListing && (
            <div className="md:hidden absolute bottom-6 left-4 right-4 z-40 pointer-events-auto animate-in slide-in-from-bottom-8 duration-300">
              <div 
                className="bg-white rounded-2xl p-3 flex flex-col gap-3 shadow-2xl relative"
              >
                <button 
                  onClick={() => setSelectedListingId(null)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-1.5 rounded-full shadow-sm"
                >
                  <LuX size={16} />
                </button>

                {/* Thumbnail */}
                <div 
                  className="relative w-full h-[180px] shrink-0 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/listings/${selectedListing.id}`)}
                >
                  <Image 
                    src={selectedListing.imageSrc}
                    alt={selectedListing.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs font-bold text-gray-900">Pilihan Angler</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between py-1 px-1 cursor-pointer" onClick={() => router.push(`/listings/${selectedListing.id}`)}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {selectedListing.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <LuStar className="w-3.5 h-3.5 fill-current text-gray-900" />
                        <span className="text-sm font-bold">4.94</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                       {selectedListing.boatType} • {selectedListing.passengerCapacity} tamu
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-[15px] font-semibold text-gray-900">
                      Rp {selectedListing.price.toLocaleString("id-ID")} <span className="font-normal text-gray-500 text-sm">malam</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
