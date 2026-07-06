# 🚀 LOCATION PAGE IMPLEMENTATION DIRECTIVE
## For Gemini Agent - GoFishi Location Pages

**From:** Claude (Backend)
**Date:** 2026-07-06
**Priority:** HIGH
**Reference:** 
- `.maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md` (Full concept)
- `.maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md` (Airbnb reference)
- `airbnb-lake-stays.png` (Screenshot)

---

## 🎯 WHAT TO BUILD

GoFishi Location Pages following Airbnb's Lake Gregory pattern:

```
/lokasi/lombok          → Lombok Fishing Spots
/danau/toba             → Lake Toba Fishing Spots
/perairan/bali           → Bali Fishing Waters
```

---

## 📐 PAGE LAYOUT (CLONE FROM AIRBNB)

```
┌────────────────────────────────────────────────────────────────────────┐
│  COMPACT SEARCH BAR (Sticky)                                           │
│  [📍 Lombok] │ [📅 Tanggal] │ [👤 Tamu] │ [🔍 Cari]                   │
├────────────────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Beranda > Indonesia > Lombok > Sekotong                  │
├────────────────────────────────────────────────────────────────────────┤
│  HERO: "Trip Memancing di Lombok" + Search Bar                        │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 1: KAPAL PREMIUM ← [KM] [KM] [KM] [KM] →                   │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 2: TEKNIK MEMANCING ← [Popping] [Jigging] [Trolling] →      │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 3: SPOT POPULER ← [Gili Air] [Sekotong] [Senggigi] →        │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 4: FASILITAS ← [GPS] [Fish Finder] [Live Well] [AC] →     │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 5: SEMUA KAPAL DI LOMBOK (Grid)                              │
├────────────────────────────────────────────────────────────────────────┤
│  SECTION 6: SPOT DI SEKITAR (Tabs: Terdekat | Populer | Destinasi)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 COMPONENTS TO CREATE

### 1. `src/components/location/HorizontalBoatList.tsx`

```tsx
// Horizontal scrolling list with arrow buttons
interface HorizontalBoatListProps {
  title: string;
  boats: Listing[];
}

export default function HorizontalBoatList({ title, boats }: HorizontalBoatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth'
    });
  };
  
  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-4 px-4">{title}</h2>
      
      {/* Arrow Buttons */}
      <div className="flex justify-end gap-2 px-4 mb-2">
        <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow">
          <LuChevronLeft />
        </button>
        <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow">
          <LuChevronRight />
        </button>
      </div>
      
      {/* Scrollable Container */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x">
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

### 2. `src/components/location/BoatCardHorizontal.tsx`

```tsx
// Horizontal boat card for scroll lists
export default function BoatCardHorizontal({ boat }: { boat: Listing }) {
  return (
    <Link href={`/perahu/${boat.slug || boat.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <Image src={boat.imageSrc} alt={boat.title} fill className="object-cover" />
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full">
          <LuHeart size={18} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md">
          <span className="font-semibold text-sm">{formatCurrency(boat.price)}</span>
          <span className="text-xs text-gray-500"> / trip</span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-sm">{boat.title}</h3>
        <p className="text-xs text-gray-500">{boat.locationValue}</p>
        {/* Fishing Techniques */}
        <div className="flex gap-1 mt-2">
          {boat.fishingTechs?.slice(0, 2).map(tech => (
            <span key={tech} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
```

### 3. `src/components/location/FishingTechniqueChips.tsx`

```tsx
// Clickable fishing technique filter chips
export default function FishingTechniqueChips({ 
  techniques, 
  selected = [],
  onSelect 
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {techniques.map(tech => (
        <Link
          key={tech}
          href={`/perahu?fishingTech=${encodeURIComponent(tech)}`}
          className="flex items-center gap-2 px-4 py-2 border rounded-full whitespace-nowrap"
        >
          <span className="text-sm font-medium">{tech}</span>
        </Link>
      ))}
    </div>
  );
}
```

### 4. `src/components/location/AmenityFilterChips.tsx`

```tsx
// Amenity filter chips with icons
const AMENITY_ICONS = {
  'GPS': LuCompass,
  'Fish Finder': LuRadio,
  'Live Well': LuDroplet,
  'AC': LuThermometer,
};

export default function AmenityFilterChips({ amenities, onToggle }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {amenities.map(amenity => {
        const Icon = AMENITY_ICONS[amenity] || LuCheck;
        return (
          <button
            key={amenity}
            onClick={() => onToggle?.(amenity)}
            className="flex items-center gap-2 px-4 py-2 border rounded-full"
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

### 5. `src/components/location/NearbyLocations.tsx`

```tsx
// Nearby destinations with tabs
export default function NearbyLocations({ locations }: Props) {
  const [activeTab, setActiveTab] = useState<'nearby' | 'popular'>('nearby');
  
  return (
    <section className="py-8 border-t">
      <h2 className="text-xl font-semibold mb-4 px-4">
        Spot Memancing di Sekitar
      </h2>
      
      {/* Tabs */}
      <div className="flex gap-4 px-4 border-b">
        <button onClick={() => setActiveTab('nearby')} className="pb-2 border-b-2">
          Lokasi Terdekat
        </button>
        <button onClick={() => setActiveTab('popular')} className="pb-2 border-b-2">
          Destinasi Populer
        </button>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-4">
        {locations[activeTab].map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </section>
  );
}
```

### 6. `src/components/location/LocationCard.tsx`

```tsx
// Location card for nearby section
export default function LocationCard({ location }: { location: Location }) {
  return (
    <Link href={`/lokasi/${location.slug}`} className="group block">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <Image src={location.image} alt={location.name} fill className="object-cover" />
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

### 7. `src/components/navigation/Breadcrumb.tsx`

```tsx
// Breadcrumb navigation
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="px-4 py-2">
      <ol className="flex items-center gap-2 text-sm">
        <li><Link href="/" className="text-gray-500">Beranda</Link></li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {item.href ? (
              <Link href={item.href} className="text-gray-500">{item.label}</Link>
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

### 8. `src/app/lokasi/[slug]/page.tsx`

```tsx
// Main location page
export default async function LocationPage({ params }: { params: { slug: string } }) {
  const { location, premiumBoats, popularBoats, amenities, nearbyLocations } = 
    await fetch(`/api/locations/${params.slug}`).then(r => r.json());
  
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Search Bar */}
      <StickySearchBar location={location.name} />
      
      {/* Main Content */}
      <main className="max-w-[2520px] mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Indonesia', href: '/indonesia' },
          { label: location.region, href: `/${location.region.toLowerCase()}` },
          { label: location.name }
        ]} />
        
        {/* Hero Header */}
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold">Trip Memancing di {location.name}</h1>
          <p className="text-gray-500">{location.boatCount} kapal tersedia</p>
        </div>
        
        {/* Premium Boats */}
        <HorizontalBoatList title="Kapal Premium" boats={premiumBoats} />
        
        {/* Fishing Techniques */}
        <section className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-3">Teknik Memancing</h2>
          <FishingTechniqueChips 
            techniques={amenities.fishingTechniques}
          />
        </section>
        
        {/* Popular Spots */}
        <HorizontalBoatList title="Spot Populer" boats={popularBoats} />
        
        {/* Amenities */}
        <section className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-3">Fasilitas Kapal</h2>
          <AmenityFilterChips amenities={amenities.list} />
        </section>
        
        {/* Nearby Locations */}
        <NearbyLocations locations={nearbyLocations} />
      </main>
    </div>
  );
}
```

---

## 📋 TASK LIST FOR GEMINI

### Priority 1: Core (Week 1 - Day 1-3)
- [ ] T-L1: Create `HorizontalBoatList.tsx`
- [ ] T-L2: Create `BoatCardHorizontal.tsx`
- [ ] T-L3: Create `FishingTechniqueChips.tsx`
- [ ] T-L4: Create `AmenityFilterChips.tsx`

### Priority 2: Structure (Week 1 - Day 4-5)
- [ ] T-L5: Create `LocationCard.tsx`
- [ ] T-L6: Create `NearbyLocations.tsx`
- [ ] T-L7: Create `Breadcrumb.tsx`
- [ ] T-L8: Create `src/app/lokasi/[slug]/page.tsx`

### Priority 3: Search (Week 2)
- [ ] T-L9: Create `SearchBarCompact.tsx`
- [ ] T-L10: Make search bar sticky on scroll

### Priority 4: Polish (Week 2)
- [ ] T-L11: Add hover animations
- [ ] T-L12: Test responsive design
- [ ] T-L13: Add loading states

---

## 🔗 API ENDPOINTS NEEDED

### GET /api/locations/[slug]
```typescript
// Response shape:
{
  location: { id, name, slug, region, boatCount, image },
  premiumBoats: Listing[],
  popularBoats: Listing[],
  allBoats: Listing[],
  amenities: {
    fishingTechniques: string[],
    list: string[]
  },
  nearbyLocations: Location[]
}
```

**Note:** Claude will build this API endpoint. Gemini creates the UI first with mock data.

---

## 📁 DIRECTORY STRUCTURE

```
src/
├── app/
│   └── lokasi/
│       └── [slug]/
│           └── page.tsx              ← NEW
├── components/
│   ├── location/
│   │   ├── HorizontalBoatList.tsx   ← NEW
│   │   ├── BoatCardHorizontal.tsx    ← NEW
│   │   ├── FishingTechniqueChips.tsx  ← NEW
│   │   ├── AmenityFilterChips.tsx    ← NEW
│   │   ├── NearbyLocations.tsx        ← NEW
│   │   └── LocationCard.tsx          ← NEW
│   └── navigation/
│       └── Breadcrumb.tsx             ← NEW
```

---

## ⚠️ IMPORTANT NOTES

1. **Consistency with Airbnb**: Follow the exact structure from `airbnb-lake-stays.png`
2. **Horizontal Scroll**: Use scroll-snap for smooth experience
3. **Sticky Search**: Search bar should become sticky on scroll (like Airbnb)
4. **Mobile First**: Design for mobile, then enhance for desktop
5. **Loading States**: Show skeletons while data loads

---

## 🎨 DESIGN TOKENS

```css
/* Use these values */
--location-section-padding: 32px;
--card-width: 300px;
--card-gap: 16px;
--chip-padding: 16px 12px;
--rounded-card: 12px;
```

---

## 📞 REFERENCE DOCUMENTS

| Document | Content |
|----------|---------|
| `.maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md` | Full concept with all components |
| `.maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md` | Airbnb reference analysis |
| `.maestro/GEMINI_NAVBAR_DIRECTIVE.md` | Navbar implementation |

---

**Document Version:** 1.0
**Status:** READY FOR IMPLEMENTATION
**Estimated Time:** 1-2 weeks
