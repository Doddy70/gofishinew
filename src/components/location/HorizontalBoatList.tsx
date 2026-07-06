"use client";

import { useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import BoatCardHorizontal, { BoatListing } from "./BoatCardHorizontal";

interface HorizontalBoatListProps {
  title: string;
  subtitle?: string;
  boats: BoatListing[];
  showArrows?: boolean;
}

export default function HorizontalBoatList({ 
  title, 
  subtitle, 
  boats, 
  showArrows = true 
}: HorizontalBoatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Small margin of error (10px) to prevent precision issues
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!boats || boats.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {showArrows && (
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className={`p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <LuChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className={`p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory"
      >
        {boats.map(boat => (
          <div key={boat.id} className="flex-none snap-start">
            <BoatCardHorizontal boat={boat} />
          </div>
        ))}
      </div>
    </section>
  );
}
