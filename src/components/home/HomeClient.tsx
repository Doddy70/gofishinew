"use client";

import { useState } from "react";
import Listings from "@/components/listings/Listings";
import CategoryList from "./CategoryList";
import MapToggle from "./MapToggle";
import dynamic from "next/dynamic";
import { Listing } from "@/types/listing";

const ListingsMap = dynamic(() => import("../listings/ListingsMap"), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full bg-gray-100 animate-pulse rounded-3xl" />
});

interface HomeClientProps {
  searchParams: any;
  initialListings: any[];
  currentUser: any;
}

export default function HomeClient({ searchParams, initialListings, currentUser }: HomeClientProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="w-full">
      {/* Category Filter Bar */}
      <div className="sticky top-18 lg:top-24 z-30 bg-white/95 backdrop-blur-md pt-4 pb-2 border-b border-gray-100">
        <div className="max-w-[95%] md:w-[90%] mx-auto">
           <CategoryList />
        </div>
      </div>

      <div className="max-w-[95%] md:w-[90%] mx-auto py-8 lg:py-12">
        {viewMode === 'list' ? (
          <>
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {searchParams.category ? `Armada ${searchParams.category}` : 'Jelajahi Armada Populer'}
                </h2>
                <p className="text-gray-500 font-light mt-2">
                  Pilihan kapal terbaik untuk pengalaman mancing tak terlupakan
                </p>
              </div>
            </div>
            
            <Listings listings={initialListings} currentUser={currentUser} />
          </>
        ) : (
          <div className="h-[75vh] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
            <ListingsMap listings={initialListings} />
          </div>
        )}
      </div>

      <MapToggle 
        viewMode={viewMode} 
        onToggle={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')} 
      />
    </div>
  );
}
