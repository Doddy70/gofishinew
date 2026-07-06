"use client";

import Link from "next/link";
import { 
  LuFish, 
  LuAnchor, 
  LuWaves,
  LuCrosshair 
} from "react-icons/lu";

interface FishingTechniqueChipsProps {
  techniques: string[];
  selected?: string[];
  onSelect?: (technique: string) => void;
}

// A simple icon mapper for fishing techniques
const getTechniqueIcon = (tech: string) => {
  const lower = tech.toLowerCase();
  if (lower.includes('popping')) return LuCrosshair;
  if (lower.includes('jigging')) return LuAnchor;
  if (lower.includes('trolling')) return LuWaves;
  return LuFish;
};

export default function FishingTechniqueChips({ 
  techniques, 
  selected = [], 
  onSelect 
}: FishingTechniqueChipsProps) {
  const isSelected = (tech: string) => selected.includes(tech);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
      {techniques.map(tech => {
        const Icon = getTechniqueIcon(tech);
        const active = isSelected(tech);

        return (
          <Link
            key={tech}
            href={`/perahu?fishingTech=${encodeURIComponent(tech)}`}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(tech);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 border rounded-full whitespace-nowrap transition-all shadow-sm hover:shadow
              ${active 
                ? 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-1' 
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300'
              }`}
          >
            <Icon size={16} className={active ? "text-white" : "text-gray-500"} />
            <span className="text-[14px] font-medium">{tech}</span>
          </Link>
        );
      })}
    </div>
  );
}
