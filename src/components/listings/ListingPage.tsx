import { getListing } from "@/server-actions/getListing";
import BookingCard from "./BookingCard";
import Image from "next/image";
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
  LuVideo
} from "react-icons/lu";

import { 
  GiFishingHook, 
  GiFishingNet, 
  GiCooler, 
  GiLifeBuoy
} from "react-icons/gi";

interface ListingPageProps {
  listingId: string;
}

export default async function ListingPage({ listingId }: ListingPageProps) {
  const listing = await getListing(listingId);

  if (!listing) return null;

  const placeholder = "https://images.unsplash.com/photo-1567899834503-457b92850221?q=80&w=2070&auto=format&fit=crop";
  const galleryImages = [listing.imageSrc || placeholder, ...(listing.images || [])].filter(Boolean).slice(0, 5);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <LuChevronRight size={14} className="shrink-0" />
          <span className="hover:text-gray-900 cursor-pointer">Sewa Perahu</span>
          <LuChevronRight size={14} className="shrink-0" />
          <span className="hover:text-gray-900 cursor-pointer">{listing.locationValue}</span>
          <LuChevronRight size={14} className="shrink-0" />
          <span className="text-gray-900 font-semibold truncate">{listing.title}</span>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 text-sm font-semibold underline hover:bg-gray-100 p-2 rounded-lg transition">
              <LuShare size={16} /> Bagikan
           </button>
           <button className="flex items-center gap-2 text-sm font-semibold underline hover:bg-gray-100 p-2 rounded-lg transition">
              <LuHeart size={16} /> Simpan
           </button>
        </div>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#111827] leading-tight tracking-tight">
          {listing?.title}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-gray-600">
           <LuAnchor size={16} className="text-primary" />
           <p className="font-medium underline cursor-pointer">{listing.locationValue}</p>
        </div>
      </div>

      {/* Gallery Grid (Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[350px] md:h-[500px] rounded-[var(--rounded-lg)] overflow-hidden shadow-[var(--shadow-card)] mb-12 relative group">
        {/* Main Image */}
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden">
           <Image
             src={galleryImages[0]}
             fill
             className="object-cover group-hover:scale-105 transition-transform duration-700"
             alt={`${listing.title} main`}
             priority
           />
        </div>
        {/* Secondary Images */}
        {galleryImages.slice(1).map((img, i) => (
          <div key={i} className="hidden md:block relative overflow-hidden">
             <Image
               src={img}
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-700"
               alt={`${listing.title} gallery ${i+1}`}
             />
          </div>
        ))}
        {/* Show all photos button */}
        <button className="absolute bottom-6 right-6 bg-white border border-gray-900 rounded-xl px-4 py-2 text-sm font-bold shadow-xl hover:bg-gray-50 transition active:scale-95">
           Lihat semua foto
        </button>
      </div>

      {/* main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* leftside             */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Boat Specifications Grid (Gofishi Clone) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-[var(--color-hairline-soft)]">
            <SpecItem icon={<LuShip size={20} />} label="Tipe Perahu" value={listing.boatType} />
            <SpecItem icon={<LuUsers size={20} />} label="Kapasitas" value={`${listing.passengerCapacity} Tamu`} />
            <SpecItem icon={<LuAnchor size={20} />} label="Lokasi" value={listing.locationValue} />
            <SpecItem icon={<LuCpu size={20} />} label="Mesin 1" value={listing.engine1 || "-"} />
            <SpecItem icon={<LuCpu size={20} />} label="Mesin 2" value={listing.engine2 || "-"} />
            <SpecItem icon={<GiFishingHook size={20} />} label="Alat Pancing" value={listing.providesRods ? "Tersedia" : "Bawa Sendiri"} />
          </div>

          {/* Kapten Section */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--color-hairline)]">
                <Image
                  src={listing.user.image || "/images/image.png"}
                  alt="Kapten"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#222222]">
                  Dikelola oleh Kapten {listing.user.name}
                </h2>
                <p className="text-sm text-[var(--color-muted)]">Bergabung sejak {new Date(listing.user.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Fishing Techniques */}
          {listing.fishingTechs && listing.fishingTechs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <GiFishingHook className="text-primary" />
                Teknik Memancing
              </h3>
              <div className="flex flex-wrap gap-2">
                {listing.fishingTechs.map((tech) => (
                  <span key={tech} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tentang Perahu</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Video Profile */}
          {listing.videoUrl && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <LuVideo className="text-red-600" />
                Video Profile Perahu
              </h3>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${listing.videoUrl.split('v=')[1]?.split('&')[0] || listing.videoUrl.split('/').pop()}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Fasilitas Memancing */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Fasilitas Memancing</h3>
              <ul className="space-y-3">
                <FeatureItem label="Livewell / Bak Umpan" active={listing.hasLivewell} />
                <FeatureItem label="Termasuk Joran" active={listing.providesRods} />
                <FeatureItem label="Termasuk Umpan" active={listing.providesBait} />
                <FeatureItem label="Termasuk Tackle" active={listing.providesTackle} />
              </ul>
            </div>

            {/* Fasilitas Kapal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Fasilitas Kapal</h3>
              <ul className="space-y-3">
                <FeatureItem label="Toilet / Kamar Kecil" active={listing.hasRestroom} />
                <FeatureItem label="Kabin Tidur" active={listing.hasCabin} />
                <FeatureItem label="Cool Box / Es" active={listing.hasCoolBox} />
                <FeatureItem label="Bimini Top / Atap" active={listing.hasBiminiTop} />
              </ul>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <LuCpu className="text-primary mt-1" size={20} />
              <div>
                <p className="font-bold text-sm uppercase text-gray-400">Informasi Mesin</p>
                <p className="text-gray-700">
                    {listing.engine1 ? (
                        <>
                            {listing.engine1}
                            {listing.engine2 && ` & ${listing.engine2}`}
                        </>
                    ) : "Informasi mesin tidak tersedia"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LuCompass className="text-primary mt-1" size={20} />
              <div>
                <p className="font-bold text-sm uppercase text-gray-400">Navigasi & Komunikasi</p>
                <p className="text-gray-700">{listing.navigationGear || "Standar navigasi"}</p>
              </div>
            </div>
          </div>

          {/* Catch Gallery - Hasil Tangkapan */}
          {listing.catchGalleries && listing.catchGalleries.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <GiFishingNet className="text-primary" />
                  Hasil Tangkapan Terbaru
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.catchGalleries.map((catchItem: any) => (
                  <div key={catchItem.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={catchItem.imageSrc}
                      fill
                      className="object-cover transition group-hover:scale-110 duration-500"
                      alt={catchItem.description || "Hasil tangkapan"}
                    />
                    {catchItem.description && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-xs font-medium">{catchItem.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Location */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LuAnchor className="text-primary" />
              Lokasi Dermaga
            </h3>
            <ListingViewMap
              price={listing.price}
              locationValue={listing.locationValue}
            />
          </div>
        </div>

        {/* rightside - Booking Card */}
        <div className="relative">
          <div className="sticky top-28">
            <BookingCard
              pricePerNight={listing.price}
              listingId={listing.id}
              hostId={listing.userId}
              reservations={listing.reservations}
            />
            
            <div className="mt-6 p-4 border border-dashed border-primary/30 rounded-2xl bg-primary/5 flex items-start gap-3 text-sm text-gray-600">
              <LuInfo className="text-primary shrink-0" size={18} />
              <p>
                <b>Catatan:</b> Harga dapat berubah tergantung pada musim atau permintaan khusus. Silakan hubungi Kapten setelah memesan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ label, active }: { label: string, active?: boolean }) {
  if (!active) return null;
  return (
    <li className="flex items-center gap-3 py-3 border-b border-[var(--color-hairline-soft)] last:border-0">
       <LuCheck className="text-green-600" size={18} />
       <span className="text-[16px] text-[var(--color-ink)]">{label}</span>
    </li>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[var(--color-ink)] mt-1 opacity-80">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-bold text-[var(--color-muted)] uppercase tracking-wider">{label}</p>
        <p className="text-[15px] font-semibold text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  );
}
