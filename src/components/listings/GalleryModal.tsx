"use client";

import { useEffect } from "react";
import Image from "next/image";
import { LuX } from "react-icons/lu";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
}

export default function GalleryModal({ isOpen, onClose, images, title }: GalleryModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft bg-white z-10 sticky top-0">
        <div className="w-8">
            <button 
            onClick={onClose}
            className="p-2 hover:bg-muted/10 rounded-full transition-colors flex items-center justify-center text-ink"
            >
            <LuX size={20} />
            </button>
        </div>
        <h2 className="font-bold text-ink truncate max-w-sm hidden md:block">Foto {title}</h2>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-20 py-8 bg-canvas">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative w-full overflow-hidden ${idx % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square md:aspect-[4/3]'} rounded-xl shadow-sm`}
            >
              <Image
                src={img}
                alt={`Foto ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={idx < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
