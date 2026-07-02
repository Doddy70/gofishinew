"use client";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useCountries from "@/custom-hooks/useCountries";
import { Listing } from "@/types/listing";
import Image from "next/image";
import { LuUsers, LuShip } from "react-icons/lu";

interface ListingsMapProps {
  listings: Listing[];
}

export default function ListingsMap({ listings }: ListingsMapProps) {
  const { getByValue } = useCountries();
  
  const customIcon = new Icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });

  // Default center if no listings
  const center: [number, number] = [-6.1751, 106.8272]; // Jakarta

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {listings.map((listing) => {
          const location = getByValue(listing.locationValue);
          if (!location) return null;

          return (
            <Marker key={listing.id} position={location.latlng} icon={customIcon}>
              <Popup className="listing-popup">
                <div className="w-48 overflow-hidden rounded-xl">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={listing.imageSrc}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{listing.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <LuShip size={10} />
                        <span>{listing.boatType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LuUsers size={10} />
                        <span>{listing.passengerCapacity}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-black text-[#FF385C]">
                      IDR {listing.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
