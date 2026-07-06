"use client";

import { LuSearch, LuCalendar, LuUsers } from "react-icons/lu";

interface SearchBarCompactProps {
  location?: string;
}

export default function SearchBarCompact({ location }: SearchBarCompactProps) {
  return (
    <div className="sticky top-[80px] z-40 bg-white border-b border-gray-200 py-3 shadow-sm transition-all">
      <div className="max-w-[2520px] mx-auto px-4 md:px-10 xl:px-20">
        <div className="flex items-center w-full md:w-auto md:inline-flex border border-gray-300 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
          
          {/* Location */}
          <button className="flex-1 md:flex-none px-5 py-2.5 text-left border-r border-gray-200 hover:bg-gray-50 rounded-l-full transition-colors">
            <span className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider">Lokasi</span>
            <span className="text-sm text-gray-600 font-medium truncate w-full md:w-[120px] block">
              {location || 'Semua Lokasi'}
            </span>
          </button>
          
          {/* Dates (Hidden on small mobile) */}
          <button className="hidden sm:block px-5 py-2.5 text-left border-r border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider">Tanggal</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Pilih tanggal</span>
            </div>
          </button>
          
          {/* Guests */}
          <button className="hidden sm:block px-5 py-2.5 text-left hover:bg-gray-50 transition-colors">
            <span className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider">Tamu</span>
            <span className="text-sm text-gray-500">Tambahkan tamu</span>
          </button>
          
          {/* Search Button */}
          <div className="pr-2 pl-2 sm:pl-1 flex items-center">
            <button 
              className="bg-primary hover:bg-[#E31C5F] text-white rounded-full p-2.5 transition-colors"
              aria-label="Cari"
            >
              <LuSearch size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
