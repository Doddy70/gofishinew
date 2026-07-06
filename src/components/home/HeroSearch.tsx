'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LuSearch,
  LuAnchor,
  LuMinus,
  LuPlus,
  LuMenu
} from "react-icons/lu";
import MobileSearchModal from "@/components/modals/MobileSearchModal";

import { DateRange, type Range } from "react-date-range";
import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Locations will be fetched dynamically

export default function HeroSearch({ isScrolled, isExpanded, onExpand }: { isScrolled?: boolean; isExpanded?: boolean; onExpand?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoCompleteRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<'location' | 'dates' | 'guests' | null>(null);
  const [location, setLocation] = useState(searchParams.get('locationValue') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('locationValue') || '');
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  
  const initialGuests = parseInt(searchParams.get('guests') || '1');
  const [adults, setAdults] = useState(initialGuests);
  const [children, setChildren] = useState(0);

  const initialStartDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date();
  const initialEndDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : addDays(new Date(), 1);

  const [range, setRange] = useState<Range[]>([
    {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    },
  ]);

  const startDate = range[0]?.startDate;
  const endDate = range[0]?.endDate;
  const dateText = (searchParams.get('startDate') || (startDate && endDate))
    ? `${format(startDate || new Date(), "d MMM", { locale: id })} - ${format(endDate || new Date(), "d MMM", { locale: id })}`
    : 'Tambahkan tanggal';

  const totalGuests = adults + children;
  const guestText = searchParams.get('guests') || totalGuests > 0 ? `${totalGuests} tamu` : 'Tambahkan tamu';

  const onSearch = () => {
    const query = new URLSearchParams(searchParams.toString());
    
    const finalLocation = location || locationQuery;
    if (finalLocation) query.set("locationValue", finalLocation);
    else query.delete("locationValue");
    
    if (startDate) query.set("startDate", startDate.toISOString());
    else query.delete("startDate");
    
    if (endDate) query.set("endDate", endDate.toISOString());
    else query.delete("endDate");
    
    if (totalGuests > 0) query.set("guests", totalGuests.toString());
    else query.delete("guests");

    router.push(`/perahu?${query.toString()}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!locationQuery || locationQuery.trim().length < 2) {
        setLocations([]);
        return;
      }
      setIsLoadingLocations(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(locationQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLocations();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [locationQuery]);

  return (
    <div ref={containerRef} className="w-full max-w-[850px] mx-auto relative z-30">

      {/* Shrinked Pill (Mobile default or Desktop Scrolled) */}
      <div
        className={`md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full px-4 md:px-0 md:w-auto transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isScrolled && !isExpanded ? 'md:opacity-100 md:translate-y-0 md:scale-100 md:pointer-events-auto' : 'md:opacity-0 md:translate-y-[20px] md:scale-110 md:pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Shrunk Search Pill */}
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileModalOpen(true);
              } else if (onExpand) {
                onExpand();
              }
            }}
            className="flex-1 flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] cursor-pointer transition-shadow"
          >
            <div className="flex-1 min-w-0 md:hidden">
              <span className="text-sm font-semibold text-ink px-2 block truncate">{location || 'Cari destinasi'}</span>
              <div className="flex items-center text-xs text-muted px-2 truncate mt-0.5">
                <span>{startDate ? format(startDate, 'd MMM') : 'Kapan'}</span>
                <span className="mx-1">•</span>
                <span>{guestText}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-ink px-2 hidden md:block whitespace-nowrap">{location || 'Cari destinasi'}</span>
            <div className="w-[1px] h-6 bg-hairline hidden md:block"></div>
            <span className="text-sm font-semibold text-ink px-2 hidden md:block whitespace-nowrap">{startDate ? format(startDate, 'd MMM') : 'Kapan'}</span>
            <div className="w-[1px] h-6 bg-hairline hidden md:block"></div>
            <span className="text-sm text-muted px-2 hidden md:block whitespace-nowrap">{guestText}</span>
            <div className="bg-primary text-on-dark p-2.5 rounded-full ml-1 shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <LuSearch size={16} strokeWidth={3} />
            </div>
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex-shrink-0 w-11 h-11 rounded-full border border-hairline flex items-center justify-center bg-canvas shadow-sm cursor-pointer hover:bg-muted/10 transition">
            <LuMenu size={20} className="text-ink" />
          </div>
        </div>
      </div>

      {/* Expanded State (Desktop Only) */}
      <div
        className={`hidden md:block transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] absolute left-1/2 -translate-x-1/2 w-full max-w-[850px] z-50 ${
          isExpanded ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-[-20px] scale-95 pointer-events-none'
        }`}
      >


        {/* Classic Pill Search Bar */}
        <div className={`rounded-full border border-hairline transition-all duration-300 relative z-20 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.02)] ${activeField ? 'bg-surface-soft' : 'bg-canvas hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.04)]'}`}>
            <div className="flex items-center h-[64px] relative">
              {/* Part 1: Lokasi */}
              <div
                className={`flex-[1.5] h-full relative group cursor-pointer transition-colors ${
                  activeField === 'location' ? 'bg-canvas rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.12)] z-30' : 'hover:bg-hairline rounded-full'
                }`}
                onClick={() => setActiveField('location')}
              >
                <div className="pl-8 pr-4 flex flex-col justify-center h-full">
                  <span className="text-[12px] font-extrabold text-ink tracking-wider mb-0.5">LOKASI</span>
                  <input
                    ref={autoCompleteRef}
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Cari destinasi"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-[14px] text-ink placeholder-muted font-medium truncate outline-none"
                  />
                </div>
              </div>

              <div className={`w-[1px] h-8 bg-hairline transition-opacity ${activeField === 'location' || activeField === 'dates' ? 'opacity-0' : 'opacity-100'}`} />

              {/* Part 2: Kapan */}
              <div
                className={`flex-1 h-full relative group cursor-pointer transition-colors ${
                  activeField === 'dates' ? 'bg-canvas rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.12)] z-30' : 'hover:bg-hairline rounded-full'
                }`}
                onClick={() => setActiveField('dates')}
              >
                <div className="pl-8 pr-4 flex flex-col justify-center h-full">
                  <span className="text-[12px] font-extrabold text-ink tracking-wider mb-0.5">KAPAN</span>
                  <div className="text-[14px] font-medium text-muted truncate">
                    {dateText}
                  </div>
                </div>
              </div>

              <div className={`w-[1px] h-8 bg-hairline transition-opacity ${activeField === 'dates' || activeField === 'guests' ? 'opacity-0' : 'opacity-100'}`} />

              {/* Part 3: Siapa */}
              <div
                className={`flex-1 h-full relative group cursor-pointer transition-colors ${
                  activeField === 'guests' ? 'bg-canvas rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.12)] z-30' : 'hover:bg-hairline rounded-full'
                }`}
                onClick={() => setActiveField('guests')}
              >
                <div className="pl-8 pr-2 flex items-center justify-between h-full">
                  <div className="flex flex-col justify-center h-full">
                    <span className="text-[12px] font-extrabold text-ink tracking-wider mb-0.5">SIAPA</span>
                    <div className={`text-[14px] font-medium truncate ${totalGuests > 0 ? 'text-ink' : 'text-muted'}`}>
                      {guestText}
                    </div>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearch();
                    }}
                    className="h-12 px-6 bg-primary text-on-dark rounded-full flex items-center gap-2 font-semibold hover:bg-[#E31C5F] transition-colors shadow-sm ml-2 z-10"
                  >
                    <LuSearch size={18} strokeWidth={2.5} />
                    <span>Cari</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Dropdown */}
            {activeField === 'location' && (
              <div className="absolute top-full mt-3 left-0 bg-canvas rounded-[32px] shadow-[0_8px_28px_rgba(0,0,0,0.28)] py-6 z-50 w-full sm:w-[480px]">
                <div className="px-8 pb-4">
                  <h3 className="text-xs font-bold text-muted tracking-wider uppercase">
                    {locationQuery.length >= 2 ? "Hasil Pencarian" : "Ketik untuk mencari (min. 2 karakter)"}
                  </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {isLoadingLocations ? (
                    <div className="px-8 py-4 text-sm text-muted">Sedang mencari...</div>
                  ) : locations.length > 0 ? (
                    locations.map((loc, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocationQuery(loc.label);
                          setLocation(loc.value);
                          setActiveField('dates');
                        }}
                        className="w-full px-8 py-4 hover:bg-muted/5 flex items-center gap-4 group transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center border border-transparent group-hover:bg-canvas group-hover:border-hairline group-hover:shadow-sm transition-all duration-300">
                          <LuAnchor className="w-5 h-5 text-muted group-hover:text-ink" />
                        </div>
                        <div>
                          <p className="text-[15px] font-medium text-ink">{loc.label}</p>
                          <p className="text-[13px] text-muted font-light">{loc.availableBoats} perahu tersedia</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    locationQuery.length >= 2 && <div className="px-8 py-4 text-sm text-muted">Tidak ditemukan lokasi yang cocok.</div>
                  )}
                </div>
              </div>
            )}

            {/* Date Picker Dropdown */}
            {activeField === 'dates' && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-canvas rounded-[32px] shadow-[0_8px_28px_rgba(0,0,0,0.28)] p-4 z-50 airbnb-date-picker">
                <DateRange
                  ranges={range}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal"
                  minDate={new Date()}
                  showDateDisplay={false}
                  rangeColors={["var(--color-ink)"]}
                  className="rounded-[24px] overflow-hidden"
                />
              </div>
            )}

            {/* Guests Dropdown */}
            {activeField === 'guests' && (
              <div className="absolute top-full mt-3 right-0 bg-canvas rounded-[32px] shadow-[0_8px_28px_rgba(0,0,0,0.28)] py-4 px-8 z-50 w-full sm:w-[420px]">
                <div className="flex items-center justify-between py-6 border-b border-hairline">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-medium text-ink">Dewasa</span>
                    <span className="text-sm text-muted font-light">Usia 13 tahun ke atas</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink disabled:opacity-20 transition-all"
                    >
                      <LuMinus size={16} />
                    </button>
                    <span className="text-[16px] font-medium w-6 text-center text-ink">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink transition-all"
                    >
                      <LuPlus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-6">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-medium text-ink">Anak-anak</span>
                    <span className="text-sm text-muted font-light">Usia 2-12</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink disabled:opacity-20 transition-all"
                    >
                      <LuMinus size={16} />
                    </button>
                    <span className="text-[16px] font-medium w-6 text-center text-ink">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink transition-all"
                    >
                      <LuPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
      
      {/* Mobile Modal */}
      <MobileSearchModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)} 
      />
    </div>
  );
}
