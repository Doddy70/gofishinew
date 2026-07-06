"use client";

import { divIcon, Marker as LeafletMarker, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import useLocations from "@/custom-hooks/useLocations";
import { Listing } from "@/types/listing";
import Image from "next/image";
import { LuUsers, LuAnchor, LuStar } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { LuX } from "react-icons/lu";

interface ListingsMapProps {
  listings: Listing[];
  selectedListingId?: string | null;
  onListingSelect?: (listingId: string | null) => void;
  fullscreen?: boolean;
  className?: string;
}

// Fix Leaflet default icon issue
function DefaultIcon() {
  return divIcon({
    html: `<div class="w-8 h-8 bg-white border-2 border-gray-300 rounded-full shadow-md"></div>`,
    className: "marker-default",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function ListingsMap({
  listings,
  selectedListingId,
  onListingSelect,
  fullscreen = false,
  className = "",
}: ListingsMapProps) {
  const { getByValue } = useLocations();
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null);

  // Center on selected listing
  useEffect(() => {
    if (selectedListingId && mapRef.current) {
      const listing = listings.find((l) => l.id === selectedListingId);
      if (listing?.latitude && listing?.longitude) {
        mapRef.current.setView([listing.latitude, listing.longitude], 14);
      }
    }
  }, [selectedListingId, listings]);

  // Calculate center from listings
  const getMapCenter = (): [number, number] => {
    if (selectedListingId) {
      const selected = listings.find((l) => l.id === selectedListingId);
      if (selected?.latitude && selected?.longitude) {
        return [selected.latitude, selected.longitude];
      }
    }

    const listingsWithCoords = listings.filter((l) => l.latitude && l.longitude);
    if (listingsWithCoords.length > 0) {
      const avgLat = listingsWithCoords.reduce((sum, l) => sum + (l.latitude || 0), 0) / listingsWithCoords.length;
      const avgLng = listingsWithCoords.reduce((sum, l) => sum + (l.longitude || 0), 0) / listingsWithCoords.length;
      return [avgLat, avgLng];
    }

    // Fallback: try to get from location name
    if (listings.length > 0 && listings[0].locationValue) {
      const loc = getByValue(listings[0].locationValue);
      if (loc) return loc.latlng;
    }

    return [-6.1751, 106.8272]; // Jakarta default
  };

  const createPriceIcon = (listing: Listing, isSelected: boolean) => {
    const isActive = isSelected || listing.id === selectedListingId;
    return divIcon({
      html: `<div class="relative">
        <div class="${isActive ? 'bg-[#FF385C] text-white border-[#FF385C] scale-110' : 'bg-white border-gray-300 text-gray-900'}
          border-2 font-bold px-3 py-1.5 rounded-[24px] shadow-lg text-[13px]
          hover:scale-105 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center">
          Rp ${listing.price.toLocaleString('id-ID')}
        </div>
        ${isActive ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#FF385C]"></div>' : ''}
      </div>`,
      className: "bg-transparent border-none",
      iconSize: [110, 40],
      iconAnchor: [55, 20],
    });
  };

  const handleMarkerClick = (listing: Listing) => {
    if (onListingSelect) {
      onListingSelect(listing.id === selectedListingId ? null : listing.id);
    }
  };

  const detailUrl = (listing: Listing) => {
    return listing.slug ? `/perahu/${listing.slug}` : `/listings/${listing.id}`;
  };

  // Ensure all listings have coordinates for map display (fallback to country coordinates)
  const listingsWithCoords = listings.map((l, index) => {
    if (l.latitude && l.longitude) return l;
    
    // Fallback: get country/region coords
    let baseLat = -6.1751;
    let baseLng = 106.8272;
    
    if (l.locationValue) {
      const loc = getByValue(l.locationValue);
      if (loc) {
        baseLat = loc.latlng[0];
        baseLng = loc.latlng[1];
      }
    }
    
    // Generate slight offset based on index to avoid overlapping perfectly
    const offsetLat = (Math.sin(index) * 0.15);
    const offsetLng = (Math.cos(index) * 0.15);
    
    return {
      ...l,
      latitude: baseLat + offsetLat,
      longitude: baseLng + offsetLng
    };
  });

  // Komponen untuk Auto-Zoom agar semua marker terlihat
  function MapBounds({ markers }: { markers: typeof listingsWithCoords }) {
    const map = useMap();
    useEffect(() => {
      if (markers.length > 0) {
        const bounds = latLngBounds(markers.map(m => [m.latitude!, m.longitude!]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }, [markers, map]);
    return null;
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <MapContainer
        center={getMapCenter()}
        zoom={fullscreen ? 12 : 10}
        scrollWheelZoom={true}
        className={`w-full h-full rounded-[16px] ${fullscreen ? 'rounded-none' : ''}`}
        ref={mapRef as any}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Auto Zoom handler */}
        <MapBounds markers={listingsWithCoords} />

        {/* Map Markers */}
        {listingsWithCoords.map((listing) => {
          const isSelected = listing.id === selectedListingId;

          return (
            <Marker
              key={listing.id}
              position={[listing.latitude!, listing.longitude!]}
              icon={createPriceIcon(listing, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(listing),
              }}
            >
              <Popup
                className="airbnb-popup hidden md:block"
                closeButton={true}
                autoPan={true}
              >
                <div
                  className="w-[280px] bg-white cursor-pointer group overflow-hidden"
                  onClick={() => router.push(detailUrl(listing))}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={listing.imageSrc}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Favorite Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-[#FF385C] px-2 py-0.5 rounded-full flex items-center">
                        <span className="text-white text-[11px] font-bold">Selected</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Location */}
                    <p className="text-[11px] text-[#717171] font-medium flex items-center gap-1 mb-0.5">
                      <LuAnchor className="w-3 h-3" />
                      {listing.locationValue}
                    </p>

                    {/* Title */}
                    <h4 className="font-semibold text-[14px] text-[#222222] line-clamp-1 mb-1">
                      {listing.title}
                    </h4>

                    {/* Subtitle */}
                    <p className="text-[12px] text-[#717171] line-clamp-1 mb-2">
                      {listing.boatType} • {listing.passengerCapacity} tamu
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-[14px] text-[#222222]">
                        Rp {listing.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[12px] text-[#717171]">/ hari</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Listings without coords */}
        {listings.filter((l) => !l.latitude || !l.longitude).length > 0 && (
          <></>
        )}
      </MapContainer>

      {/* Map Info Bar - Airbnb style */}
      <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none flex justify-center">
        <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-semibold text-gray-700 pointer-events-auto">
          <div className="w-2 h-2 bg-[#FF385C] rounded-full animate-pulse" />
          <span>Menampilkan {listingsWithCoords.length} perahu</span>
          {listings.length !== listingsWithCoords.length && (
            <span className="text-[#717171] font-normal">
              ({listings.length - listingsWithCoords.length} tanpa lokasi)
            </span>
          )}
        </div>
      </div>

      {/* Mobile Bottom Card (Airbnb Style) telah dipindahkan ke HomeClient.tsx agar bisa berinteraksi dengan Bottom Sheet */}

      {/* No coordinates warning - REMOVED since we now have fallbacks */}
      {listingsWithCoords.length === 0 && listings.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center p-6">
            <LuAnchor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              Memuat lokasi armada...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
