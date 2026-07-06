"use client";

import { 
  LuCompass, 
  LuRadio, 
  LuDroplet, 
  LuThermometer,
  LuHouse,
  LuAnchor,
  LuBug,
  LuUtensils,
  LuCheck
} from "react-icons/lu";

interface AmenityFilterChipsProps {
  amenities: string[];
  selected?: string[];
  onToggle?: (amenity: string) => void;
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  'GPS': LuCompass,
  'Fish Finder': LuRadio,
  'Live Well': LuDroplet,
  'AC': LuThermometer,
  'Kabin': LuHouse,
  'Pancing Rods': LuAnchor,
  'Umpan': LuBug,
  'Makan Siang': LuUtensils,
};

export default function AmenityFilterChips({ 
  amenities, 
  selected = [], 
  onToggle 
}: AmenityFilterChipsProps) {
  const isSelected = (amenity: string) => selected.includes(amenity);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
      {amenities.map(amenity => {
        const Icon = AMENITY_ICONS[amenity] || LuCheck;
        const isActive = isSelected(amenity);
        
        return (
          <button
            key={amenity}
            onClick={() => onToggle?.(amenity)}
            className={`flex items-center gap-2 px-5 py-2.5 border rounded-full whitespace-nowrap transition-all shadow-sm hover:shadow
              ${isActive 
                ? 'bg-gray-900 text-white border-gray-900 ring-2 ring-gray-900 ring-offset-1' 
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300'
              }`}
          >
            <Icon size={16} className={isActive ? "text-white" : "text-gray-500"} />
            <span className="text-[14px] font-medium">{amenity}</span>
          </button>
        );
      })}
    </div>
  );
}
