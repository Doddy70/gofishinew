# 🎯 AIRBNB LAKE GREGORY STAYS ANALYSIS
## GoFishi - Destination/Category Page Reference

**Date:** 2026-07-06
**Source:** https://www.airbnb.co.id/lake-gregory-ca/stays
**Page Type:** Destination/Category Page (NOT Search Results)
**Screenshots:** `airbnb-lake-stays.png`, `airbnb-lake-stays-scrolled.png`

---

## 📸 PAGE OVERVIEW

This is a **destination/category page** for Lake Gregory, California. Unlike search results, this page showcases:
- Curated collections (High-value stays, Interesting stays)
- Nearby destinations
- Amenity filters
- Horizontal scroll cards

---

## 🏠 PAGE STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│  COMPACT SEARCH BAR (Sticky)                                           │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [📍 Lake Gregory, CA ▼] │ [📅 Check-in] │ [📅 Check-out] │ [Cari]│ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  BREADCRUMB NAVIGATION                                                │
│  Airbnb > Amerika Serikat > California > San Bernardino County >       │
│  Crestline > Danau Gregory                                            │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  DESTINATION HERO                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    HEADER (Level 1)                              │ │
│  │           "Sewa tempat di Danau Gregory"                          │ │
│  │                                                                   │ │
│  │  Location dropdown + Calendar + Search Button                     │ │
│  │  ┌──────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐     │ │
│  │  │ Lake Gregory │ │  Check-in  │ │  Check-out │ │  Cari  │     │ │
│  │  │      CA      │ │            │ │            │ │        │     │ │
│  │  └──────────────┘ └────────────┘ └────────────┘ └────────┘     │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 1: "TEMPAT BERLIBUR BERHARGA TINGGI"                        │
│  (High Value Stays)                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  ← [Card] [Card] [Card] [Card] [Card] [Card] [Card] [Card] →   │ │
│  │     Kabin di    Kabin di    Kabin di    Kabin di              │ │
│  │     Twin Peaks  Crestline   Crestline   Crestline             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 2: "FASILITAS POPULER"                                      │
│  (Popular Amenities)                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  │ Dapur  │ │  Wifi  │ │ Kolam  │ │ Parkir │ │   AC   │       │ │
│  │  │        │ │        │ │ Renang │ │ Gratis  │ │        │       │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │ │
│  │                                                                   │ │
│  │  Clickable → Filters search results by amenity                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 3: "TEMPAT BERLIBUR MENARIK LAINNYA"                         │
│  (Other Interesting Stays)                                            │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  ← [Card] [Card] [Card] [Card] [Card] [Card] [Card] [Card] →   │ │
│  │     Kabin di    Rumah di    Kabin di    Kabin di    Vila di    │ │
│  │     Crestline   Crestline   Crestline   Lake       Crestline   │ │
│  │                                           Arrowhead            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  SECTION 4: "DESTINASI UNTUK DIJELAJAHI"                             │
│  (Destinations to Explore)                                             │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  [Destinasi di sekitar] [Tipe Penginapan] [Pemandangan Populer]│ │
│  │  ─────────────────────────────────────────────────────────────  │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  │ San    │ │ Los    │ │ Las    │ │ Palm    │ │ Big    │       │ │
│  │  │ Diego  │ │ Angeles│ │ Vegas  │ │ Springs │ │ Bear   │       │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  │Tijuana │ │Joshua  │ │Mammoth │ │ Long   │ │ Santa  │       │ │
│  │  │        │ │ Tree   │ │ Lakes  │ │ Beach  │ │Barbara │       │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 KEY ELEMENTS ANALYSIS

### 1. COMPACT SEARCH BAR

```
Design:
┌──────────────┬────────────┬────────────┬────────┐
│ Lake Gregory │ │  Check-in │ │ Check-out │ │ Cari  │
│     CA       │ │           │ │           │ │       │
└──────────────┴────────────┴────────────┴────────┘
```

**Features:**
- Location dropdown (Lake Gregory, CA) - editable
- Check-in date picker
- Check-out date picker  
- Search CTA button
- Sticky on scroll (appears after scrolling past hero)

**Implementation:**
```tsx
<div className="flex border rounded-full p-1 bg-white shadow-lg">
  {/* Location */}
  <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50">
    <span className="block text-xs font-semibold">Lokasi</span>
    <span className="text-sm">Lake Gregory, CA</span>
  </button>
  
  {/* Check-in */}
  <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50">
    <span className="block text-xs font-semibold">Check-in</span>
    <span className="text-sm text-gray-500">Tambahkan tanggal</span>
  </button>
  
  {/* Check-out */}
  <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50">
    <span className="block text-xs font-semibold">Check-out</span>
    <span className="text-sm text-gray-500">Tambahkan tanggal</span>
  </button>
  
  {/* Search */}
  <button className="bg-primary text-white rounded-full px-6 py-3">
    Cari
  </button>
</div>
```

---

### 2. HORIZONTAL SCROLL CARDS

```
Pattern: ← [Card] [Card] [Card] [Card] ... →
```

**Card Design:**
- Image (16:9 or 4:3 ratio)
- Neighborhood + Property type (e.g., "Kabin di Crestline")
- Price per night (sometimes hidden on scroll)
- Favorite button (heart icon)

**Horizontal Scroll Behavior:**
- Drag to scroll
- Navigation arrows (prev/next buttons)
- Scroll snap to card boundaries
- Touch-friendly on mobile

**Implementation:**
```tsx
<div className="relative">
  {/* Previous Button */}
  <button className="absolute left-0 z-10 bg-white rounded-full shadow-lg p-2 -translate-x-1/2">
    <LuChevronLeft />
  </button>
  
  {/* Cards Container */}
  <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
    {cards.map(card => (
      <div 
        key={card.id}
        className="flex-none w-[280px] snap-start"
      >
        <ListingCard {...card} />
      </div>
    ))}
  </div>
  
  {/* Next Button */}
  <button className="absolute right-0 z-10 bg-white rounded-full shadow-lg p-2 translate-x-1/2">
    <LuChevronRight />
  </button>
</div>
```

---

### 3. AMENITY FILTER CHIPS

```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Dapur  │ │ Wifi  │ │ Kolam  │ │ Parkir │ │   AC   │
│        │ │       │ │ Renang │ │ Gratis │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

**Behavior:**
- Clickable → triggers filtered search
- Updates URL with amenity parameter
- Redirects to search results with filter active

**Implementation:**
```tsx
<div className="flex gap-3 overflow-x-auto">
  {amenities.map(amenity => (
    <Link 
      key={amenity}
      href={`/perahu?amenities=${amenity}&locationValue=Lake+Gregory`}
      className="flex items-center gap-2 px-4 py-2 border rounded-full whitespace-nowrap hover:bg-gray-50"
    >
      <span>{amenity}</span>
    </Link>
  ))}
</div>
```

---

### 4. DESTINATION TABS

```
┌─────────────────────────────────────────────────────────────┐
│  [Destinasi di sekitar] [Tipe Penginapan] [Pemandangan Populer] │
└─────────────────────────────────────────────────────────────┘
```

**Tab Content:**

| Tab | Content |
|-----|---------|
| Destinasi di sekitar | Nearby cities/regions (San Diego, Los Angeles, Las Vegas, etc.) |
| Tipe Penginapan | Property types (Kabin, Rumah, Vila, dll) |
| Pemandangan Populer | Popular views/scenarios |

**Implementation:**
```tsx
<Tabs defaultValue="destinations">
  <TabsList>
    <TabsTrigger value="destinations">Destinasi di sekitar</TabsTrigger>
    <TabsTrigger value="types">Tipe Penginapan</TabsTrigger>
    <TabsTrigger value="views">Pemandangan Populer</TabsTrigger>
  </TabsList>
  
  <TabsContent value="destinations">
    <Grid>{destinations.map(d => <DestinationCard {...d} />)}</Grid>
  </TabsContent>
  
  <TabsContent value="types">
    <Grid>{propertyTypes.map(t => <TypeCard {...t} />)}</Grid>
  </TabsContent>
  
  <TabsContent value="views">
    <Grid>{popularViews.map(v => <ViewCard {...v} />)}</Grid>
  </TabsContent>
</Tabs>
```

---

### 5. BREADCRUMB NAVIGATION

```
Airbnb > Amerika Serikat > California > San Bernardino County > Crestline > Danau Gregory
```

**Implementation:**
```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm text-gray-600">
    <li><Link href="/">Airbnb</Link></li>
    <li>/</li>
    <li><Link href="/usa">Amerika Serikat</Link></li>
    <li>/</li>
    <li><Link href="/usa/california">California</Link></li>
    <li>/</li>
    <li><Link href="/usa/california/san-bernardino">San Bernardino County</Link></li>
    <li>/</li>
    <li><Link href="/crestline">Crestline</Link></li>
    <li>/</li>
    <li><span className="text-gray-900 font-medium">Danau Gregory</span></li>
  </ol>
</nav>
```

---

## 📱 GOFISHI MAPPING

### For GoFishi - Lake/Destination Pages

| Airbnb Element | GoFishi Implementation |
|---------------|----------------------|
| Destination Page | `/lokasi/[slug]` or `/danau/[slug]` |
| Horizontal Cards | Listing cards in horizontal scroll |
| Amenity Filters | Clickable amenity chips → Filter API |
| Nearby Destinations | Related locations section |
| Breadcrumb | Location hierarchy |

### Recommended GoFishi Pages

```
/perahu                     → Search Results (existing)
/perahu/lombok              → Location page (new)
/danau/lake-toba             → Destination page (new)
/lokasi/bali                → Location page (new)
```

---

## 🎯 IMPLEMENTATION FOR GOFISHI

### 1. Location Page Template

```tsx
// src/app/lokasi/[slug]/page.tsx

export default function LocationPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      {/* Search Bar */}
      <SearchBarCompact location={params.slug} />
      
      {/* Hero Section */}
      <h1>Sewa Perahu di {locationName}</h1>
      
      {/* High Value Stays */}
      <HorizontalScrollingList 
        title="Trip Premium"
        listings={premiumListings}
      />
      
      {/* Popular Amenities */}
      <AmenityFilters location={params.slug} />
      
      {/* More Stays */}
      <HorizontalScrollingList 
        title="Trip Populer Lainnya"
        listings={popularListings}
      />
      
      {/* Nearby Destinations */}
      <NearbyLocations currentLocation={params.slug} />
    </div>
  );
}
```

### 2. API Requirements for Location Pages

```typescript
// GET /api/locations/[slug]
Response: {
  location: {
    id: string;
    name: string;
    region: string;
    image: string;
    listingCount: number;
  };
  featuredListings: Listing[];    // Premium/premium
  popularListings: Listing[];       // Most booked
  nearbyLocations: Location[];       // Related destinations
  amenities: string[];             // Popular amenities
}

// GET /api/locations/[slug]/listings
Response: {
  data: Listing[];
  pagination: Pagination;
  featuredCount: number;
}
```

---

## 📊 PAGE TYPE SUMMARY

| Aspect | Homepage | Search Results | Location Page |
|--------|----------|----------------|---------------|
| Search Bar | Full (3-field) | Compact | Compact |
| Filter Pills | Category tabs | Amenity chips | Amenity chips |
| Listings | None | Grid + Map | Horizontal scroll |
| Curated Sections | Inspiration | No | Yes |
| Map | No | Yes | No |

---

## ✅ ACTION ITEMS FOR GEMINI

Based on this analysis, add to navbar directive:

### New Task: Location Page Template
- [ ] Create `/lokasi/[slug]` route
- [ ] Implement horizontal scrolling cards
- [ ] Add amenity filter chips
- [ ] Add nearby destinations section
- [ ] Add breadcrumb navigation

### API Needed:
```typescript
GET /api/locations/[slug]        // Location details
GET /api/locations/[slug]/listings  // Listings for location
```

---

## 📸 SCREENSHOTS

| File | Description |
|------|-------------|
| `airbnb-lake-stays.png` | Initial load |
| `airbnb-lake-stays-scrolled.png` | After scroll |

---

**Document Version:** 1.0
**Analysis Date:** 2026-07-06
**Ready for Implementation:** YES
