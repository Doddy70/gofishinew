"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuHouse, LuMapPin, LuAnchor, LuSlidersHorizontal } from "react-icons/lu";
import { useFilterModal } from "@/store/useFilterListingModal";
import { useEffect, useState } from "react";

const routes = [
  { label: "Beranda", path: "/", icon: LuHouse },
  { label: "Lokasi", path: "/lokasi", icon: LuMapPin },
  { label: "Jelajahi", path: "/perahu", icon: LuAnchor }
];

export default function RouteTabs({ isScrolled = false }: { isScrolled?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openFilterModal } = useFilterModal();

  const [boatTypes, setBoatTypes] = useState<string[]>([]);
  const currentBoatType = searchParams?.get("boatType");

  useEffect(() => {
    fetch("/api/listings/filters")
      .then(res => res.json())
      .then(data => {
        if (data.boatTypes) setBoatTypes(data.boatTypes);
      })
      .catch(err => console.error("Error fetching filters:", err));
  }, []);

  const handleFilterClick = (type: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (currentBoatType === type) {
      params.delete("boatType");
    } else {
      params.set("boatType", type);
    }
    
    // Default to /perahu for search results if currently on home
    const basePath = pathname === "/" ? "/perahu" : pathname;
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col bg-canvas pt-2 px-0 relative">
      {/* Text Tabs (Beranda, Lokasi, Jelajahi) moved to Mobile Hamburger Menu */}

      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-4 md:px-0">

        {/* Dynamic Filter Pills */}
        {boatTypes.map((type) => {
          const isActive = currentBoatType === type;
          return (
            <button
              key={type}
              onClick={() => handleFilterClick(type)}
              className={`
                shrink-0 px-4 py-2 rounded-full border text-[13px] font-medium transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-ink text-canvas border-ink shadow-sm' 
                  : 'bg-canvas text-muted border-hairline hover:border-ink hover:text-ink'}
              `}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Filter Button Always Visible (Since we removed Categories) */}
      <div 
        onClick={openFilterModal}
        className="flex items-center gap-2 px-4 py-3 border border-hairline rounded-xl cursor-pointer hover:bg-muted/10 hover:border-ink transition mb-3"
      >
        <LuSlidersHorizontal size={16} className="text-ink" />
        <span className="text-[14px] font-medium text-ink hidden sm:block">Filter</span>
      </div>
    </div>
    </div>
  );
}
