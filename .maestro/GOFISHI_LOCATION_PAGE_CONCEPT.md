# 🎯 GOFISHI LOCATION PAGE - COMPLETE CONCEPT
## Based on Airbnb Lake Gregory Reference

**Date:** 2026-07-06
**Reference:** https://www.airbnb.co.id/lake-gregory-ca/stays
**Purpose:** Comprehensive location page design for GoFishi fishing boat platform
**Market Focus:** Jakarta, Banten, Lampung, Jawa Barat (Indonesia)

---

## 🗺️ CURRENT MARKET LOCATIONS

GoFishi's operational market is focused on **Saltwater Fishing** in 4 provinces:

| Province | Locations | Water Type |
|----------|-----------|-----------|
| Jakarta | Ancol Marina, Kepulauan Seribu, Sunda Kelapa | 🌊 Saltwater |
| Banten | Merak, Cilegon, Anyer | 🌊 Saltwater |
| Lampung | Bandarlampung, Krui, Pahawang | 🌊 Saltwater |
| Jawa Barat | Karimunjawa, Pangandaran, Cirebon | 🌊 Saltwater |

### Jakarta Research: Saltwater Fishing Spots

```
JAKARTA UTARA
│
├── Ancol Marina (Taman Impian Jaya)
│   ├── Hero Spot: Pulau Bidadari
│   ├── Access: Via Toll Road (25 km from CBD)
│   ├── Target Fish: Kakap, Kembung, Baronang, Toman
│   └── Best For: Popping, Jigging
│
├── Kepulauan Seribu (Thousand Islands)
│   ├── Best Spots: Pramuka, Kelapa, Harapan, Pari
│   ├── Access: Speedboat from Marina Ancol (1-2 hours)
│   ├── Target Fish: GT, Tuna, Cakalang, Kerapu
│   └── Best For: Deep Jigging, Trolling
│
└── Sunda Kelapa
    ├── Best Spots: Muara Angke, Muara Ciliwung
    ├── Target Fish: Kakap, Kembung, Baronang
    └── Best For: Light Jigging, Casting
```

**Primary Focus (MVP):**
- `/lokasi/ancol` - Ancol Marina (highest traffic)
- `/lokasi/kepulauan-seribu` - Thousand Islands (premium)
- `/lokasi/sunda-kelapa` - Sunda Kelapa (urban)

---

## 🏠 CONCEPT OVERVIEW

### GoFishi Location Pages

Following Airbnb's destination page pattern, GoFishi will have:

```
JAWA BARAT (Closest to Jakarta):
/lokasi/ancol              → Ancol Marina, Jakarta Utara - Fishing Spots
/lokasi/kepulauan-seribu   → Thousand Islands, Jakarta - Premium Fishing
/lokasi/sunda-kelapa       → Sunda Kelapa, Jakarta Utara - Urban Fishing

BANTEN:
/lokasi/merak             → Merak, Banten - Selat Sunda Fishing

JAWA BARAT:
/lokasi/karimunjawa       → Karimunjawa, Jawa Tengah - Island Fishing
/lokasi/pangandaran       → Pangandaran, Jawa Barat - Selatan Fishing
```

### Page Types Mapping

| Airbnb | GoFishi | Example |
|--------|---------|---------|
| `lake-gregory-ca/stays` | `lokasi/[slug]` | `/lokasi/ancol` |
| Cabin listings | Speedboat listings | KM Sonic Strike |
| Amenity filters | Fishing gear filters | GPS, Fish Finder, Live Well |
| Nearby cities | Nearby fishing spots | Ancol → Muara Baru |
| Fishing Techniques | Teknik Memancing | Popping, Jigging, Trolling |

---

## 📐 PAGE LAYOUT

### GoFishi Location Page Structure (Example: Ancol)

```
┌────────────────────────────────────────────────────────────────────────┐
│  COMPACT SEARCH BAR (Sticky on scroll)                               │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [📍 Ancol] │ [📅 Tanggal] │ [👤 Tamu] │ [🔍 Cari]        │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  BREADCRUMB                                                      │
│  Beranda > Indonesia > DKI Jakarta > Ancol                        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  HERO HEADER                                                       │
│                                                                        │
│  "Trip Memancing di Lombok"                                         │
│  [Location dropdown] [Check-in] [Check-out] [Tamu] [Cari]          │
│                                                                        │
│  📊 12 kapal tersedia                                               │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 1: KAPAL PREMIUM                                          │
│  (Premium/Top-Rated Boats)                                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ← [KM Sonic] [KM Bahari] [KM Dewa] [KM Raja] [KM Tuna] →  │ │
│  │     Lombok       Lombok      Bali       Bali        Riau        │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 2: TEKNIK MEMANCING                                       │
│  (Popular Fishing Techniques)                                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│  │  │Popping │ │Jigging │ │Trolling│ │Casting │ │Jigging │   │ │
│  │  │        │ │        │ │        │ │        │ │ Light  │   │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 3: SPOT POPULER                                             │
│  (Popular Fishing Spots in Lombok)                                   │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ← [Gili Air] [Gili Trawangan] [Sekotong] [Senggigi] →     │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 4: FASILITAS KAPAL                                        │
│  (Popular Boat Amenities)                                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│  │  │ GPS    │ │ Live   │ │ AC     │ │ Kabin  │ │Pancing │   │ │
│  │  │ Fish   │ │ Well   │ │        │ │        │ │ Rods   │   │ │
│  │  │Finder  │ │        │ │        │ │        │ │        │   │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 5: SEMUA KAPAL DI LOMBOK                                   │
│  (All Boats in Location)                                             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  [KM Sonic Strike]  ★★★★☆ (12)                                 │ │
│  │  Speedboat • Lombok • Kapten Toni                               │ │
│  │  Rp 3.200.000 / trip                                          │ │
│  │  Popping, Jigging, Trolling                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  [KM Dewa Laut]           ★★★★☆ (8)                          │ │
│  │  Bay Boat • Bali • Kapten Iwan                                 │ │
│  │  Rp 2.000.000 / trip                                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 6: SPOT MEMANCING DI SEKITAR                               │
│  (Nearby Fishing Spots)                                             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  [Tipe Spots]        [Lokasi Terdekat]    [Destinasi Populer]│ │
│  │  ────────────────────────────────────────────────────────────   │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│  │  │Lombok  │ │ Sumbawa│ │ Bali   │ │ Flores │ │Komodo  │   │ │
│  │  │        │ │        │ │        │ │        │ │        │   │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI COMPONENTS SPECIFICATION

### 1. SEARCH BAR COMPACT

```tsx
// src/components/search/SearchBarCompact.tsx

interface SearchBarCompactProps {
  location?: string;
  defaultLocation?: string;
  onSearch?: (params: SearchParams) => void;
}

export default function SearchBarCompact({ location, defaultLocation, onSearch }: SearchBarCompactProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('locationValue', location);
    if (checkIn) params.set('checkIn', checkIn.toISOString());
    if (checkOut) params.set('checkOut', checkOut.toISOString());
    if (guests) params.set('guests', guests.toString());
    onSearch?.(params);
  };

  return (
    <div className="flex items-center border rounded-full p-1 bg-white shadow-lg">
      {/* Location */}
      <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50 rounded-l-full">
        <span className="block text-xs font-semibold text-gray-900">Lokasi</span>
        <span className="text-sm">{location || defaultLocation || 'Pilih lokasi'}</span>
      </button>
      
      {/* Check-in */}
      <DatePickerButton 
        label="Check-in"
        date={checkIn}
        onChange={setCheckIn}
      />
      
      {/* Check-out */}
      <DatePickerButton 
        label="Check-out"
        date={checkOut}
        onChange={setCheckOut}
      />
      
      {/* Guests */}
      <GuestPicker guests={guests} onChange={setGuests} />
      
      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-3 mx-1 transition-colors"
      >
        <LuSearch size={20} />
      </button>
    </div>
  );
}
```

### 2. HORIZONTAL SCROLLING LIST

```tsx
// src/components/location/HorizontalBoatList.tsx

interface HorizontalBoatListProps {
  title: string;
  subtitle?: string;
  boats: BoatListing[];
  showArrows?: boolean;
}

export default function HorizontalBoatList({ 
  title, 
  subtitle, 
  boats, 
  showArrows = true 
}: HorizontalBoatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {showArrows && (
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition ${!canScrollLeft && 'opacity-50 cursor-not-allowed'}`}
              disabled={!canScrollLeft}
            >
              <LuChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition ${!canScrollRight && 'opacity-50 cursor-not-allowed'}`}
              disabled={!canScrollRight}
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {boats.map(boat => (
          <div key={boat.id} className="flex-none w-[300px] snap-start">
            <BoatCardHorizontal boat={boat} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 3. BOAT CARD HORIZONTAL

```tsx
// src/components/listings/BoatCardHorizontal.tsx

interface BoatCardHorizontalProps {
  boat: Listing;
  showPrice?: boolean;
}

export default function BoatCardHorizontal({ boat, showPrice = true }: BoatCardHorizontalProps) {
  return (
    <Link href={`/perahu/${boat.slug || boat.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <Image
          src={boat.imageSrc}
          alt={boat.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition"
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
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
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
            <div className="flex items-center gap-1 text-xs">
              <LuStar size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{boat.avgRating.toFixed(1)}</span>
              <span className="text-gray-400">({boat.reviewCount})</span>
            </div>
          )}
        </div>
        
        {/* Fishing Techniques */}
        {boat.fishingTechs?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {boat.fishingTechs.slice(0, 3).map(tech => (
              <span 
                key={tech}
                className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* Captain */}
        {boat.captainName && (
          <p className="text-xs text-gray-500 mt-1">
            Kapten {boat.captainName}
          </p>
        )}
      </div>
    </Link>
  );
}
```

### 4. FISHING TECHNIQUE CHIPS

```tsx
// src/components/location/FishingTechniqueChips.tsx

interface FishingTechniqueChipsProps {
  techniques: string[];
  selected?: string[];
  onSelect?: (technique: string) => void;
}

export default function FishingTechniqueChips({ 
  techniques, 
  selected = [], 
  onSelect 
}: FishingTechniqueChipsProps) {
  const isSelected = (tech: string) => selected.includes(tech);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {techniques.map(tech => (
        <Link
          key={tech}
          href={`/perahu?fishingTech=${encodeURIComponent(tech)}`}
          onClick={(e) => {
            if (onSelect) {
              e.preventDefault();
              onSelect(tech);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full whitespace-nowrap transition-all
            ${isSelected(tech) 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white hover:bg-gray-50'
            }`}
        >
          <FishingTechniqueIcon type={tech} size={16} />
          <span className="text-sm font-medium">{tech}</span>
        </Link>
      ))}
    </div>
  );
}
```

### 5. AMENITY FILTER CHIPS

```tsx
// src/components/location/AmenityFilterChips.tsx

interface AmenityFilterChipsProps {
  amenities: string[];
  selected?: string[];
  onToggle?: (amenity: string) => void;
}

const AMENITY_ICONS: Record<string, IconType> = {
  'GPS': LuCompass,
  'Fish Finder': LuRadio,
  'Live Well': LuDroplet,
  'AC': LuThermometer,
  'Kabin': LuHome,
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
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {amenities.map(amenity => {
        const Icon = AMENITY_ICONS[amenity] || LuCheck;
        const isActive = isSelected(amenity);
        
        return (
          <button
            key={amenity}
            onClick={() => onToggle?.(amenity)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full whitespace-nowrap transition-all
              ${isActive 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white hover:bg-gray-50'
              }`}
          >
            <Icon size={16} />
            <span className="text-sm">{amenity}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### 6. NEARBY LOCATIONS SECTION

```tsx
// src/components/location/NearbyLocations.tsx

interface NearbyLocationsProps {
  currentLocation: string;
  locations: {
    nearby: Location[];
    byType: Record<string, Location[]>;
    popular: Location[];
  };
}

export default function NearbyLocations({ currentLocation, locations }: NearbyLocationsProps) {
  const [activeTab, setActiveTab] = useState<'nearby' | 'types' | 'popular'>('nearby');

  return (
    <section className="py-8 border-t">
      <h2 className="text-xl font-semibold mb-4 px-4">
        Spot Memancing di Sekitar {currentLocation}
      </h2>
      
      {/* Tabs */}
      <div className="flex gap-4 px-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors
            ${activeTab === 'nearby' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
        >
          Lokasi Terdekat
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors
            ${activeTab === 'types' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
        >
          Spot Populer
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors
            ${activeTab === 'popular' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
        >
          Destinasi Populer
        </button>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        {activeTab === 'nearby' && locations.nearby.map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
        {activeTab === 'types' && locations.byType.map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
        {activeTab === 'popular' && locations.popular.map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </section>
  );
}
```

### 7. LOCATION CARD

```tsx
// src/components/location/LocationCard.tsx

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    region: string;
    image?: string;
    boatCount?: number;
  };
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <Link 
      href={`/lokasi/${location.id}`}
      className="group block"
    >
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <Image
          src={location.image || '/images/placeholder-location.jpg'}
          alt={location.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 text-white">
          <h3 className="font-semibold">{location.name}</h3>
          {location.boatCount && (
            <p className="text-xs opacity-80">{location.boatCount} kapal</p>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### 8. BREADCRUMB

```tsx
// src/components/navigation/Breadcrumb.tsx

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            Beranda
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## 📡 API REQUIREMENTS

### 1. GET /api/locations/[slug]

```typescript
// Response
interface LocationResponse {
  location: {
    id: string;
    name: string;
    slug: string;
    region: string;
    description?: string;
    image?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    boatCount: number;
    avgPrice: number;
  };
  
  premiumBoats: Listing[];
  popularBoats: Listing[];
  allBoats: Listing[];
  
  fishingTechniques: string[];
  amenities: string[];
  spots: string[];
  
  nearbyLocations: Location[];
  popularDestinations: Location[];
}

// Example: GET /api/locations/lombok
{
  "location": {
    "id": "loc-lombok",
    "name": "Lombok",
    "slug": "lombok",
    "region": "Nusa Tenggara Barat",
    "description": "Surga memancing dengan GT dan Tuna",
    "boatCount": 12,
    "avgPrice": 3200000
  },
  "premiumBoats": [...],
  "popularBoats": [...],
  "fishingTechniques": ["Popping", "Jigging", "Trolling", "Casting"],
  "amenities": ["GPS", "Fish Finder", "Live Well", "AC", "Pancing Rods"],
  "spots": ["Gili Air", "Gili Trawangan", "Sekotong", "Senggigi"],
  "nearbyLocations": [...],
  "popularDestinations": [...]
}
```

### 2. GET /api/locations

```typescript
// Response
interface LocationsListResponse {
  data: {
    id: string;
    name: string;
    slug: string;
    region: string;
    image?: string;
    boatCount: number;
  }[];
  regions: string[];  // For grouping
}
```

---

## 📁 FILE STRUCTURE

```
src/
├── app/
│   ├── lokasi/
│   │   └── [slug]/
│   │       └── page.tsx              ← Location page
│   └── perahu/
│       └── page.tsx                  ← Search results (existing)
│
├── components/
│   ├── location/
│   │   ├── HorizontalBoatList.tsx    ← Reusable horizontal scroll
│   │   ├── BoatCardHorizontal.tsx    ← Boat card for horizontal list
│   │   ├── FishingTechniqueChips.tsx  ← Technique filter chips
│   │   ├── AmenityFilterChips.tsx    ← Amenity filter chips
│   │   ├── NearbyLocations.tsx        ← Nearby locations section
│   │   ├── LocationCard.tsx          ← Location grid card
│   │   └── LocationHeader.tsx         ← Hero section
│   │
│   ├── search/
│   │   ├── SearchBarCompact.tsx      ← Location page search bar
│   │   ├── SearchBarFull.tsx          ← Homepage search bar (existing)
│   │   └── FilterPills.tsx           ← (from navbar directive)
│   │
│   └── navigation/
│       ├── Breadcrumb.tsx             ← Breadcrumb navigation
│       ├── Navbar.tsx                 ← (existing)
│       └── BottomNav.tsx              ← (existing)
│
├── hooks/
│   └── useLocation.ts                ← Fetch location data
│
└── lib/
    └── api/
        └── locations.ts               ← Location API client
```

---

## 🎯 IMPLEMENTATION CHECKLIST FOR GEMINI

### Phase 1: Core Components
- [ ] **T-L1:** Create `src/app/lokasi/[slug]/page.tsx`
- [ ] **T-L2:** Create `HorizontalBoatList` component
- [ ] **T-L3:** Create `BoatCardHorizontal` component
- [ ] **T-L4:** Create `SearchBarCompact` component

### Phase 2: Filters & Chips
- [ ] **T-L5:** Create `FishingTechniqueChips` component
- [ ] **T-L6:** Create `AmenityFilterChips` component
- [ ] **T-L7:** Integrate filter chips with `/api/listings/search`

### Phase 3: Nearby & Navigation
- [ ] **T-L8:** Create `NearbyLocations` component
- [ ] **T-L9:** Create `LocationCard` component
- [ ] **T-L10:** Create `Breadcrumb` component

### Phase 4: Integration
- [ ] **T-L11:** Connect page to `GET /api/locations/[slug]`
- [ ] **T-L12:** Add sticky search bar on scroll
- [ ] **T-L13:** Add loading states
- [ ] **T-L14:** Add empty states

### Phase 5: Polish
- [ ] **T-L15:** Add hover animations
- [ ] **T-L16:** Add scroll indicators
- [ ] **T-L17:** Test responsive design
- [ ] **T-L18:** Add SEO metadata

---

## 🎬 ANIMATION SPECIFICATIONS

### Horizontal Scroll
```css
/* Smooth scroll with snap */
.overflow-x-auto {
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.snap-start {
  scroll-snap-align: start;
}
```

### Card Hover
```tsx
// Image zoom on hover
<Image className="group-hover:scale-105 transition-transform duration-300" />

// Shadow lift
<div className="hover:shadow-xl transition-shadow" />
```

### Section Reveal
```tsx
// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

---

## 📐 DESIGN TOKENS

```css
/* Location Page Specific */
--location-hero-height: 400px;
--location-section-padding: 32px;
--location-card-width: 300px;
--location-card-gap: 16px;

/* Horizontal Scroll */
--scroll-item-width: 300px;
--scroll-item-gap: 16px;
--scroll-arrow-size: 40px;

/* Chips */
--chip-padding-x: 16px;
--chip-padding-y: 8px;
--chip-gap: 12px;
```

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | 1 column, no arrows |
| Tablet (640-1024px) | 2-3 columns, arrows visible |
| Desktop (>1024px) | 4-5 columns, arrows visible |

---

## 🔗 DEPENDENCIES

### Existing (Use these)
- `Navbar.tsx` - Already has scroll behavior
- `BottomNav.tsx` - Mobile navigation
- `ListingCard.tsx` - Base card design
- `DatePickerButton` - Date picker component

### New (Create these)
- `HorizontalBoatList.tsx` - Custom component
- `BoatCardHorizontal.tsx` - Based on ListingCard
- `SearchBarCompact.tsx` - Based on HeroSearch
- `FishingTechniqueChips.tsx` - New
- `AmenityFilterChips.tsx` - New
- `NearbyLocations.tsx` - New
- `LocationCard.tsx` - New
- `Breadcrumb.tsx` - New

### APIs Needed
- `GET /api/locations/[slug]` - **NEED TO BUILD**
- `GET /api/locations` - **NEED TO BUILD**

---

## 📊 IMPLEMENTATION ORDER

```
WEEK 1 (Navbar Focus - Gemini):
├── Day 1-2: TASK 1-4 (Navbar implementation)
└── Day 3-5: TASK 5-8 (Search & Filters)

WEEK 2 (Location Pages - Gemini):
├── Day 1: T-L1 to T-L4 (Core components)
├── Day 2: T-L5 to T-L7 (Filters)
├── Day 3: T-L8 to T-L10 (Nearby & Breadcrumb)
├── Day 4: T-L11 to T-L14 (Integration)
└── Day 5: T-L15 to T-L18 (Polish)

CONCURRENT (Claude - Backend):
├── Day 1-2: Schema migration (T-01)
├── Day 3-4: Pricing & Calendar APIs (T-02 to T-05)
└── Day 5: Location API endpoints
```

---

**Document Version:** 1.0
**Status:** READY FOR GEMINI IMPLEMENTATION
**Estimated Time:** 1 week for full location page system
