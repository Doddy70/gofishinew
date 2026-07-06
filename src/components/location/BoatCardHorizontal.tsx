"use client";

import Image from "next/image";
import Link from "next/link";
import { LuHeart, LuStar } from "react-icons/lu";
import { formatCurrency } from "@/lib/utils";

// Using a basic interface to avoid strict coupling with Prisma types for the mock data
export interface BoatListing {
  id: string;
  slug?: string;
  title: string;
  imageSrc: string;
  price: number;
  locationValue: string;
  avgRating?: number;
  reviewCount?: number;
  fishingTechs?: string[];
  captainName?: string;
}

interface BoatCardHorizontalProps {
  boat: BoatListing;
  showPrice?: boolean;
}

export default function BoatCardHorizontal({ boat, showPrice = true }: BoatCardHorizontalProps) {
  // Mocking isFavorite for now
  const isFavorite = false;
  
  const toggleFavorite = (id: string) => {
    console.log("Toggle favorite", id);
  };

  return (
    <Link href={`/perahu/${boat.slug || boat.id}`} className="group block w-[300px]">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <Image
          src={boat.imageSrc || '/placeholder-boat.jpg'}
          alt={boat.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition z-10"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(boat.id);
          }}
        >
          <LuHeart 
            size={18} 
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>
        
        {/* Price Badge (if showPrice) */}
        {showPrice && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md z-10 shadow-sm">
            <span className="font-semibold text-sm">
              {formatCurrency(boat.price)}
            </span>
            <span className="text-xs text-gray-500"> / trip</span>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-1">{boat.title}</h3>
            <p className="text-xs text-gray-500">{boat.locationValue}</p>
          </div>
          {boat.avgRating && (
            <div className="flex items-center gap-1 text-xs shrink-0">
              <LuStar size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{boat.avgRating.toFixed(1)}</span>
              <span className="text-gray-400">({boat.reviewCount})</span>
            </div>
          )}
        </div>
        
        {/* Fishing Techniques */}
        {boat.fishingTechs && boat.fishingTechs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {boat.fishingTechs.slice(0, 3).map(tech => (
              <span 
                key={tech}
                className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* Captain */}
        {boat.captainName && (
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Kapten {boat.captainName}
          </p>
        )}
      </div>
    </Link>
  );
}
