"use client";

import Image from "next/image";
import BookingCard from "./BookingCard";
import ListingViewMap from "./ListingViewMap";
import { 
  LuAnchor, 
  LuShip, 
  LuUsers, 
  LuInfo,
  LuCompass,
  LuCpu,
  LuShare,
  LuHeart,
  LuChevronRight,
  LuVideo,
  LuCheck
} from "react-icons/lu";
import { 
  GiFishingHook, 
  GiFishingNet, 
  GiCooler, 
  GiLifeBuoy
} from "react-icons/gi";
import { useState } from "react";
import GalleryModal from "./GalleryModal";

interface ListingDetailClientProps {
  listing: any;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1457131760772-7017c6180f05?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2070&auto=format&fit=crop"
];

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const [showGallery, setShowGallery] = useState(false);
  
  // Handle 404 images from dummy data by substituting with reliable Unsplash fallbacks
  const getValidImage = (img: string, index: number) => {
    if (!img || img.includes("boat_") || img.includes("photo-1544551763-47a0159f9234")) {
      return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    }
    return img;
  };

  const rawImages = [listing.imageSrc, ...(listing.images || [])].filter(Boolean);
  const validImages = rawImages.length > 0 
    ? rawImages.map((img, i) => getValidImage(img, i))
    : FALLBACK_IMAGES;
    
  const galleryImages = validImages;
  
  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-10 py-6">
      
      {/* Title & Actions Row (Airbnb Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-semibold text-ink leading-tight tracking-tight">
            {listing?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-ink font-medium">
             <LuAnchor size={16} className="text-primary" />
             <span className="underline cursor-pointer">{listing.locationValue}</span>
             <span className="text-muted mx-1">•</span>
             <span className="text-muted">{listing.boatType}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 text-[14px] font-semibold underline hover:bg-surface-soft px-3 py-2 rounded-lg transition active:scale-95">
              <LuShare size={16} /> Bagikan
           </button>
           <button className="flex items-center gap-2 text-[14px] font-semibold underline hover:bg-surface-soft px-3 py-2 rounded-lg transition active:scale-95">
              <LuHeart size={16} /> Simpan
           </button>
        </div>
      </div>

      {/* Gallery Grid (Modal Style) */}
      <div className="relative mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 rounded-2xl overflow-hidden h-[300px] md:h-[460px]">
          {galleryImages.slice(0, 5).map((img, idx) => (
            <div 
              key={idx} 
              className={`relative w-full h-full overflow-hidden cursor-pointer ${idx % 3 === 0 ? 'md:col-span-2' : ''} group`}
              onClick={() => setShowGallery(true)}
            >
              <Image
                src={img}
                alt={`${listing.title} Foto ${idx + 1}`}
                fill
                className="object-cover group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Show all photos button */}
        {galleryImages.length > 0 && (
          <button 
            onClick={() => setShowGallery(true)}
            className="absolute bottom-6 right-6 bg-white border border-hairline rounded-lg px-4 py-[6px] text-sm font-semibold shadow-md hover:bg-surface-soft transition active:scale-95 z-10 flex items-center gap-2"
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4a2 2 0 110-4 2 2 0 010 4zm-8 8a2 2 0 110-4 2 2 0 010 4zm16 0a2 2 0 110-4 2 2 0 010 4zm-8 8a2 2 0 110-4 2 2 0 010 4zm-8 0a2 2 0 110-4 2 2 0 010 4zm16 0a2 2 0 110-4 2 2 0 010 4zm-16-16a2 2 0 110-4 2 2 0 010 4zm16 0a2 2 0 110-4 2 2 0 010 4z" fillRule="evenodd"></path></svg>
             Tampilkan semua foto
          </button>
        )}
      </div>

      <GalleryModal 
        isOpen={showGallery} 
        onClose={() => setShowGallery(false)} 
        images={galleryImages}
        title={listing.title}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] xl:grid-cols-[65%_1fr] gap-12 xl:gap-20">
        
        {/* Left Column */}
        <div className="space-y-10 pb-10">
          
          {/* Kapten Section */}
          <div className="flex items-center justify-between pb-6 border-b border-hairline">
            <div>
              <h2 className="text-[22px] font-semibold text-ink">
                Dikelola oleh Kapten {listing.captainName || listing.user?.name}
              </h2>
              <ul className="flex items-center gap-2 mt-1 text-[15px] text-ink">
                <li>{listing.passengerCapacity} Tamu</li>
                <li className="text-muted">•</li>
                <li>{listing.boatType}</li>
                {listing.hasCabin && (
                  <>
                    <li className="text-muted">•</li>
                    <li>Kabin Tidur</li>
                  </>
                )}
                {listing.hasRestroom && (
                  <>
                    <li className="text-muted">•</li>
                    <li>Toilet</li>
                  </>
                )}
              </ul>
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ml-4">
              <Image
                src={listing.user?.image || "/images/image.png"}
                alt="Kapten"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-8 border-b border-hairline">
            <SpecItem icon={<LuShip size={24} />} label="Tipe" value={listing.boatType} />
            <SpecItem icon={<LuAnchor size={24} />} label="Lokasi" value={listing.locationValue} />
            <SpecItem icon={<GiFishingHook size={24} />} label="Alat Pancing" value={listing.providesRods ? "Tersedia" : "Bawa Sendiri"} />
            <SpecItem icon={<LuCpu size={24} />} label="Mesin Utama" value={listing.engine1 || "-"} />
            {listing.engine2 && <SpecItem icon={<LuCpu size={24} />} label="Mesin Cadangan" value={listing.engine2} />}
          </div>

          {/* Meeting Point */}
          {listing.meetingPoint && (
             <div className="pb-8 border-b border-hairline">
               <div className="flex items-start gap-4">
                 <LuAnchor className="text-ink shrink-0" size={24} />
                 <div>
                   <h3 className="font-semibold text-[16px] text-ink">Titik Kumpul (Meeting Point)</h3>
                   <p className="text-[15px] text-muted mt-1">{listing.meetingPoint}</p>
                 </div>
               </div>
             </div>
          )}

          {/* Description */}
          <div className="pb-8 border-b border-hairline space-y-4">
            <h2 className="text-[22px] font-semibold">Tentang Perahu</h2>
            <div className="text-[16px] text-ink leading-relaxed whitespace-pre-line max-w-[85%]">
              {listing.description}
            </div>
          </div>

          {/* Fishing Specialties */}
          {((listing.fishingTechs && listing.fishingTechs.length > 0) || (listing.targetFish && listing.targetFish.length > 0)) && (
            <div className="pb-8 border-b border-hairline space-y-8">
              {listing.fishingTechs && listing.fishingTechs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[18px] font-semibold">Teknik Memancing</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.fishingTechs.map((tech: string) => (
                      <span key={tech} className="bg-surface-soft border border-hairline-soft text-ink px-4 py-2 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {listing.targetFish && listing.targetFish.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[18px] font-semibold">Target Ikan</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.targetFish.map((fish: string) => (
                      <span key={fish} className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                        {fish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features / Amenities */}
          <div className="pb-8 border-b border-hairline space-y-6">
            <h2 className="text-[22px] font-semibold">Fasilitas yang ditawarkan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 max-w-[85%]">
              <FeatureItem label="Livewell / Bak Umpan" active={listing.hasLivewell} icon={<GiFishingNet size={24} />} />
              <FeatureItem label="Termasuk Joran" active={listing.providesRods} icon={<GiFishingHook size={24} />} />
              <FeatureItem label="Termasuk Umpan" active={listing.providesBait} icon={<LuCheck size={24} />} />
              <FeatureItem label="Termasuk Tackle" active={listing.providesTackle} icon={<GiLifeBuoy size={24} />} />
              <FeatureItem label="Toilet / Kamar Kecil" active={listing.hasRestroom} icon={<LuCheck size={24} />} />
              <FeatureItem label="Kabin Tidur" active={listing.hasCabin} icon={<LuCheck size={24} />} />
              <FeatureItem label="Cool Box / Es" active={listing.hasCoolBox} icon={<GiCooler size={24} />} />
              <FeatureItem label="Bimini Top / Atap" active={listing.hasBiminiTop} icon={<LuCheck size={24} />} />
            </div>
          </div>

          {/* Map Location */}
          <div className="pb-8 space-y-4">
            <h2 className="text-[22px] font-semibold">Lokasi Dermaga</h2>
            <p className="text-[16px] text-ink mb-4">{listing.locationValue}</p>
            <div className="w-full h-[480px] bg-surface-soft rounded-2xl overflow-hidden relative border border-hairline">
              <ListingViewMap
                price={listing.price}
                locationValue={listing.locationValue}
              />
            </div>
          </div>

        </div>

        {/* Right Column - Booking Card */}
        <div className="relative pb-10">
          <div className="sticky top-28">
            <BookingCard
              pricePerNight={listing.price}
              listingId={listing.id}
              hostId={listing.userId}
              reservations={listing.reservations || []}
              weekendPrice={listing.weekendPrice}
              holidayPrice={listing.holidayPrice}
              captainPhone={listing.user?.phoneNumber}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-hairline p-4 md:hidden z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-[18px] font-bold text-ink">
            Rp {listing.price.toLocaleString('id-ID')} <span className="text-[14px] font-normal">/hari</span>
          </p>
          <p className="text-[12px] text-ink underline font-medium">Total sebelum pajak</p>
        </div>
        <button 
          onClick={() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth"
            });
          }}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg active:scale-95 transition-transform"
        >
          Pesan
        </button>
      </div>

    </div>
  );
}

function FeatureItem({ label, active, icon }: { label: string, active?: boolean, icon: React.ReactNode }) {
  if (!active) return null;
  return (
    <div className="flex items-center gap-4 py-1 text-ink">
       <span className="text-ink/80">{icon}</span>
       <span className="text-[16px]">{label}</span>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-ink mt-0.5 opacity-80 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[16px] font-semibold text-ink leading-tight">{label}</p>
        <p className="text-[14px] text-muted mt-1">{value}</p>
      </div>
    </div>
  );
}

