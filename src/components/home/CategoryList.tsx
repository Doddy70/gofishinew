"use client";

import { categories } from "@/constants/Categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuChevronLeft, LuChevronRight, LuSlidersHorizontal } from "react-icons/lu";
import { useRef, useState, useEffect } from "react";

export default function CategoryList() {
  const params = useSearchParams();
  const category = params.get("category");
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const isMainPage = pathname === "/";

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const handleClick = (slug: string) => {
    const currentParams = new URLSearchParams(params.toString());
    
    if (category === slug) {
      currentParams.delete("category");
    } else {
      currentParams.set("category", slug);
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const hasSearch = params.get("locationValue") || params.get("startDate") || params.get("guests");

  const quickFilters = [
    "Mesin cuci", "Wifi", "Parkir gratis", "Pemesanan Instan", 
    "AC", "Diizinkan membawa hewan peliharaan", "TV", "1+ kamar mandi", "Dapur", "Setrika"
  ];

  return (
    <div className="w-full flex items-center gap-4 bg-canvas pt-2 px-0 relative">
      <div className="relative flex-1 overflow-hidden">
        {/* Left Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-canvas via-canvas to-transparent z-10 flex items-center justify-start">
            <div className="bg-canvas p-1.5 rounded-full shadow-soft border border-hairline cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}>
              <LuChevronLeft size={16} className="text-ink" />
            </div>
          </div>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3"
        >
          {hasSearch ? (
            /* Quick Filter Pills (Search Mode) */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-3 border border-hairline rounded-xl cursor-pointer hover:bg-muted/10 hover:border-ink transition min-w-fit">
                <LuSlidersHorizontal size={16} className="text-ink" />
                <span className="text-[14px] font-medium text-ink">Filter</span>
              </div>
              {quickFilters.map((filter) => (
                <div key={filter} className="px-4 py-2 border border-hairline rounded-full cursor-pointer hover:border-ink transition min-w-fit">
                  <span className="text-[14px] font-medium text-ink">{filter}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Icon Category Tabs (Default Mode) */
            categories.map((item) => {
              const Icon = item.icon;
              const isActive = category === item.slug;
              
              return (
                <div
                  key={item.slug}
                  onClick={() => handleClick(item.slug)}
                  className={`
                    flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border-b-2 min-w-fit
                    ${isActive ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink hover:border-hairline'}
                  `}
                >
                  <Icon size={24} className={isActive ? 'text-ink' : 'text-muted'} />
                  <span className={`text-[12px] font-medium whitespace-nowrap ${isActive ? 'text-ink' : 'text-muted'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-canvas via-canvas to-transparent z-10 flex items-center justify-end">
            <div className="bg-canvas p-1.5 rounded-full shadow-soft border border-hairline cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}>
              <LuChevronRight size={16} className="text-ink" />
            </div>
          </div>
        )}
      </div>

      {/* Filter Button for Default Mode */}
      {!hasSearch && (
        <div className="hidden md:flex items-center gap-2 px-4 py-3 border border-hairline rounded-xl cursor-pointer hover:bg-muted/10 hover:border-ink transition mb-3">
          <LuSlidersHorizontal size={16} className="text-ink" />
          <span className="text-[14px] font-medium text-ink">Filter</span>
        </div>
      )}
    </div>
  );
}
