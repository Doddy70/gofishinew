'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { smartSearch } from "@/server-actions/smartSearch";
import { 
  LuSearch, 
  LuAnchor, 
  LuShip, 
  LuTreePalm, 
  LuWaves, 
  LuMinus, 
  LuPlus, 
  LuSparkles,
} from "react-icons/lu";

import { DateRange, type Range } from "react-date-range";
import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const locations = [
  { city: 'Marina Ancol', state: 'Jakarta Utara', country: 'Indonesia', type: 'marina' },
  { city: 'Pantai Mutiara', state: 'Penjaringan', country: 'Indonesia', type: 'marina' },
  { city: 'Muara Angke', state: 'Jakarta Utara', country: 'Indonesia', type: 'port' },
  { city: 'Kepulauan Seribu', state: 'DKI Jakarta', country: 'Indonesia', type: 'island' },
  { city: 'Tanjung Pasir', state: 'Tangerang', country: 'Indonesia', type: 'beach' },
];

export default function HeroSearch() {
  const [searchMode, setSearchMode] = useState<'classic' | 'ai'>('classic');
  const [activeField, setActiveField] = useState<'location' | 'dates' | 'guests' | null>(null);
  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoCompleteRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onSearch = () => {
    const query = new URLSearchParams({
      locationValue: location,
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
      guests: totalGuests.toString()
    });
    
    router.push(`/perahu?${query.toString()}`);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        autoCompleteRef.current!,
        { types: ['(cities)'], componentRestrictions: { country: 'id' } }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setLocation(place.formatted_address);
          setActiveField('dates');
        }
      });
    }
  }, [activeField]);

  const startDate = range[0]?.startDate;
  const endDate = range[0]?.endDate;
  const dateText = startDate && endDate 
    ? `${format(startDate, "d MMM", { locale: id })} - ${format(endDate, "d MMM", { locale: id })}`
    : 'Tambahkan tanggal';

  const totalGuests = adults + children;
  const guestText = totalGuests === 0 ? 'Tambahkan tamu' : `${totalGuests} tamu`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[850px] mx-auto relative z-30">
      
      {/* Search Mode Toggle - Positioned up into the Navbar center */}
      <div className="absolute -top-[64px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 md:gap-8 z-50 whitespace-nowrap">
        <button 
          onClick={() => setSearchMode('classic')}
          className={`text-sm md:text-base transition-all pb-1 relative group ${
            searchMode === 'classic' ? 'text-[#222222] font-medium' : 'text-[#717171] hover:text-[#222222] font-medium'
          }`}
        >
          Sewa Perahu
        </button>
        <button 
          onClick={() => setSearchMode('ai')}
          className={`text-sm md:text-base transition-all pb-1 relative group flex items-center gap-1.5 md:gap-2 ${
            searchMode === 'ai' ? 'text-[#222222] font-medium' : 'text-[#717171] hover:text-[#222222] font-medium'
          }`}
        >
          <LuSparkles className="w-4 h-4 text-[#FF385C]" /> Smart Search
        </button>
      </div>

      {/* Classic Pill Search Bar */}
      {searchMode === 'classic' && (
        <div 
          className={`bg-white rounded-full border border-[#DDDDDD] transition-all duration-300 relative z-20 ${
            activeField !== null ? 'bg-[#EBEBEB] border-transparent shadow-[0_16px_32px_rgba(0,0,0,0.1)]' : 'shadow-[0_3px_12px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.08)] hover:shadow-[0_3px_12px_0_rgba(0,0,0,0.15)]'
          }`}
        >
          <div className="flex items-center h-[66px] relative">
            
            {/* Part 1: Lokasi */}
            <div 
              className={`flex-[1.5] h-full relative group cursor-pointer transition-colors ${
                activeField === 'location' ? 'bg-white rounded-full shadow-[0_3px_12px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.08)] z-30' : 'hover:bg-[#DDDDDD] rounded-full'
              }`}
              onClick={() => setActiveField('location')}
            >
              <div className="pl-8 pr-4 flex flex-col justify-center h-full">
                <span className="text-[12px] font-bold text-[#222222] tracking-wide mb-0.5">Lokasi</span>
                <input 
                  ref={autoCompleteRef}
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cari destinasi" 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-[14px] text-[#222222] placeholder-[#717171] font-light truncate outline-none"
                />
              </div>
            </div>

            {/* Divider */}
            <div className={`w-[1px] h-8 bg-[#DDDDDD] transition-opacity ${activeField === 'location' || activeField === 'dates' ? 'opacity-0' : 'opacity-100'}`} />

            {/* Part 2: Kapan */}
            <div 
              className={`flex-1 h-full relative group cursor-pointer transition-colors ${
                activeField === 'dates' ? 'bg-white rounded-full shadow-[0_3px_12px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.08)] z-30' : 'hover:bg-[#DDDDDD] rounded-full'
              }`}
              onClick={() => setActiveField('dates')}
            >
              <div className="pl-6 pr-4 flex flex-col justify-center h-full">
                <span className="text-[12px] font-bold text-[#222222] tracking-wide mb-0.5">Kapan</span>
                <span className={`text-[14px] truncate ${startDate ? 'text-[#222222] font-bold' : 'text-[#717171] font-light'}`}>
                  {dateText}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className={`w-[1px] h-8 bg-[#DDDDDD] transition-opacity ${activeField === 'dates' || activeField === 'guests' ? 'opacity-0' : 'opacity-100'}`} />

            {/* Part 3: Peserta */}
            <div 
              className={`flex-[1.2] h-full relative group cursor-pointer transition-colors ${
                activeField === 'guests' ? 'bg-white rounded-full shadow-[0_3px_12px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.08)] z-30' : 'hover:bg-[#DDDDDD] rounded-full'
              }`}
              onClick={() => setActiveField('guests')}
            >
              <div className="pl-6 pr-2 flex items-center justify-between h-full rounded-full">
                <div className="flex flex-col justify-center flex-1 pr-2 truncate">
                  <span className="text-[12px] font-bold text-[#222222] tracking-wide mb-0.5">Peserta</span>
                  <span className={`text-[14px] truncate ${totalGuests > 1 ? 'text-[#222222] font-bold' : 'text-[#717171] font-light'}`}>
                    {guestText}
                  </span>
                </div>

                {/* Search Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSearch();
                  }}
                  className={`bg-[#FF385C] text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm hover:bg-[#E31C5F] ${
                    activeField !== null ? 'h-12 px-6 gap-2' : 'h-12 w-12'
                  }`}
                >
                  <LuSearch size={18} strokeWidth={3} />
                  {activeField !== null && <span className="font-semibold text-[15px] whitespace-nowrap">Cari</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Location Dropdown */}
          {activeField === 'location' && (
            <div className="absolute top-full mt-3 left-0 bg-white rounded-[32px] shadow-[0_6px_24px_rgba(0,0,0,0.15)] border border-[#DDDDDD] py-6 z-50 w-full sm:w-[480px]">
              <div className="px-8 pb-4">
                <h3 className="text-xs font-bold text-[#717171] tracking-wider uppercase">Destinasi yang disarankan</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {locations.map((loc, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setLocation(loc.city);
                      setActiveField('dates');
                    }}
                    className="w-full px-8 py-4 hover:bg-[#F7F7F7] flex items-center gap-4 group transition-colors text-left"
                  >
                    <div className="w-12 h-12 bg-[#EBEBEB] rounded-xl flex items-center justify-center border border-transparent group-hover:bg-white group-hover:border-[#DDDDDD] group-hover:shadow-sm transition-all duration-300">
                      {loc.type === 'marina' && <LuAnchor className="w-5 h-5 text-[#717171] group-hover:text-[#222222]" />}
                      {loc.type === 'port' && <LuShip className="w-5 h-5 text-[#717171] group-hover:text-[#222222]" />}
                      {loc.type === 'island' && <LuTreePalm className="w-5 h-5 text-[#717171] group-hover:text-[#222222]" />}
                      {loc.type === 'beach' && <LuWaves className="w-5 h-5 text-[#717171] group-hover:text-[#222222]" />}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-[#222222]">{loc.city}</p>
                      <p className="text-[13px] text-[#717171] font-light">{loc.state}, {loc.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Picker Dropdown */}
          {activeField === 'dates' && (
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white rounded-[32px] shadow-[0_6px_24px_rgba(0,0,0,0.15)] border border-[#DDDDDD] p-4 z-50">
              <DateRange
                ranges={range}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                minDate={new Date()}
                showDateDisplay={false}
                rangeColors={["#222222"]}
                className="rounded-[24px] overflow-hidden"
              />
            </div>
          )}

          {/* Guests Dropdown */}
          {activeField === 'guests' && (
            <div className="absolute top-full mt-3 right-0 bg-white rounded-[32px] shadow-[0_6px_24px_rgba(0,0,0,0.15)] border border-[#DDDDDD] py-4 px-8 z-50 w-full sm:w-[420px]">
              <div className="flex items-center justify-between py-6 border-b border-[#EBEBEB]">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium text-[#222222]">Dewasa</span>
                  <span className="text-sm text-[#717171] font-light">Usia 13 tahun ke atas</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-20 transition-all"
                  >
                    <LuMinus size={16} />
                  </button>
                  <span className="text-[16px] font-medium w-6 text-center text-[#222222]">{adults}</span>
                  <button 
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition-all"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-6">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium text-[#222222]">Anak-anak</span>
                  <span className="text-sm text-[#717171] font-light">Usia 2-12</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-20 transition-all"
                  >
                    <LuMinus size={16} />
                  </button>
                  <span className="text-[16px] font-medium w-6 text-center text-[#222222]">{children}</span>
                  <button 
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition-all"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Smart Search */}
      {searchMode === 'ai' && (
        <form action={smartSearch} className="bg-white rounded-full border border-[#DDDDDD] shadow-[0_3px_12px_0_rgba(0,0,0,0.1)] hover:shadow-[0_3px_12px_0_rgba(0,0,0,0.15)] transition-all overflow-hidden mx-auto max-w-[720px]">
          <div className="flex items-center h-[66px]">
            <div className="pl-10 flex-grow flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#FF385C] uppercase tracking-[0.2em] mb-0.5">GoFishi Intelligence</span>
              <input 
                name="query"
                type="text" 
                placeholder="Coba: 'Yacht mewah di Kepulauan Seribu untuk 12 orang'" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[15px] text-[#222222] font-medium placeholder-[#717171] outline-none"
              />
            </div>
            <div className="pr-3">
              <button type="submit" className="bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full h-12 px-8 flex items-center gap-2 transition-colors">
                <LuSparkles className="w-4 h-4" />
                <span className="font-semibold text-[15px]">Tanya AI</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
