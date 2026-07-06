"use client";

import Image from "next/image";
import Link from "next/link";

export interface LocationData {
  id: string;
  slug: string;
  name: string;
  region: string;
  image?: string;
  boatCount?: number;
}

interface LocationCardProps {
  location: LocationData;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <Link 
      href={`/lokasi/${location.slug}`}
      className="group block w-full"
    >
      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
        <Image
          src={location.image || '/placeholder-location.jpg'}
          alt={location.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white right-3">
          <h3 className="font-semibold text-sm leading-tight drop-shadow-md">{location.name}</h3>
          {location.boatCount !== undefined && (
            <p className="text-xs opacity-90 drop-shadow-md mt-0.5">{location.boatCount} kapal</p>
          )}
        </div>
      </div>
    </Link>
  );
}
