"use client";

import useCountries from "@/custom-hooks/useCountries";
import dynamic from "next/dynamic";

interface ListingViewMapProps {
  price: number;
  locationValue: string;
}

const MapComponent = dynamic(() => import("../general/map/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-surface-soft">Loading map...</div>,
});

export default function ListingViewMap({
  price,
  locationValue,
}: ListingViewMapProps) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  
  // Default fallback ke koordinat Semarang / Indonesia tengah
  const centerCoordinate = location?.latlng || [-6.9828, 110.3951]; 


  return (
    <div className="h-full w-full">
      <MapComponent price={price} center={centerCoordinate as [number, number]} />
    </div>
  );
}
