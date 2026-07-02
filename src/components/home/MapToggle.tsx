"use client";

import { LuMap, LuList } from "react-icons/lu";

interface MapToggleProps {
  viewMode: 'list' | 'map';
  onToggle: () => void;
}

export default function MapToggle({ viewMode, onToggle }: MapToggleProps) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 transition-transform active:scale-95">
      <button 
        onClick={onToggle}
        className="bg-[#222222] hover:bg-black text-white px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl transition group"
      >
        <span className="text-sm font-bold tracking-wide">
          {viewMode === 'list' ? 'Tampilkan Peta' : 'Tampilkan Daftar'}
        </span>
        {viewMode === 'list' ? (
          <LuMap size={18} className="group-hover:rotate-12 transition-transform" />
        ) : (
          <LuList size={18} className="group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
}
