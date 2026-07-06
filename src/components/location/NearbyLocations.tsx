"use client";

import { useState } from "react";
import LocationCard, { LocationData } from "./LocationCard";

interface NearbyLocationsProps {
  currentLocation: string;
  locations: {
    nearby: LocationData[];
    popular: LocationData[];
    destinations: LocationData[];
  };
}

export default function NearbyLocations({ currentLocation, locations }: NearbyLocationsProps) {
  const [activeTab, setActiveTab] = useState<'nearby' | 'popular' | 'destinations'>('nearby');

  const getActiveData = () => {
    switch (activeTab) {
      case 'nearby': return locations.nearby;
      case 'popular': return locations.popular;
      case 'destinations': return locations.destinations;
      default: return [];
    }
  };

  const currentData = getActiveData();

  return (
    <section className="py-10 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-6 px-4 md:px-0">
        Jelajahi Spot di Sekitar {currentLocation}
      </h2>
      
      {/* Tabs */}
      <div className="flex gap-6 px-4 md:px-0 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
            ${activeTab === 'nearby' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Lokasi Terdekat
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
            ${activeTab === 'popular' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Spot Populer
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
            ${activeTab === 'destinations' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Destinasi Favorit
        </button>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 md:px-0 pb-6">
        {currentData.map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
        {currentData.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            Belum ada data lokasi.
          </div>
        )}
      </div>
    </section>
  );
}
