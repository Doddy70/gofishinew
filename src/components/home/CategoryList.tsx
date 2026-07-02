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

  return (
    <div className="max-w-[2520px] mx-auto flex items-center gap-4 bg-white pt-5 px-4 md:px-10 xl:px-20 relative">
      <div className="relative flex-1 overflow-hidden">
        {/* Left Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white to-transparent z-10 flex items-center justify-start">
            <div className="bg-white p-1.5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow" onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}>
              <LuChevronLeft size={16} />
            </div>
          </div>
        )}

        {/* Categories Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((item) => {
              const Icon = item.icon;
              const isActive = category === item.slug;
              
              return (
                <div
                  key={item.slug}
                  onClick={() => handleClick(item.slug)}
                  className={`
                    flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-b-2 pb-3 min-w-fit
                    ${isActive ? 'border-[#222222] text-[#222222]' : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]'}
                  `}
                >
                  <Icon size={24} className={isActive ? 'text-[#222222]' : 'text-[#717171]'} />
                  <span className={`text-[14px] font-medium whitespace-nowrap ${isActive ? 'text-[#222222]' : 'text-[#717171]'}`}>
                    {item.label}
                  </span>
                </div>
              );
          })}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white to-transparent z-10 flex items-center justify-end">
            <div className="bg-white p-1.5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow" onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}>
              <LuChevronRight size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Filter Button (Airbnb Style) */}
      <div className="hidden md:flex items-center gap-2 px-4 py-3 border border-[#DDDDDD] rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#222222] transition mb-3">
        <LuSlidersHorizontal size={16} className="text-[#222222]" />
        <span className="text-sm font-semibold text-[#222222]">Filter</span>
      </div>
    </div>
  );
}
