# 🎯 AIRBNB NAVIGATION SYSTEM ANALYSIS
## GoFishi - Complete Reference for Cloning

**Date:** 2026-07-06
**Source:** https://www.airbnb.co.id/
**Scope:** Desktop & Mobile Views, API Endpoints, UI/UX Patterns

---

## 📸 ANALYSIS FROM LIVE WEBSITE

### Screenshots Captured:
1. `airbnb-desktop-homepage.png` - Homepage header
2. `airbnb-desktop-search.png` - Search results header

**Screenshots location:** `/Users/doddykapisha/Downloads/GITDODDY/new-gofishi/`

---

## 🖥️ DESKTOP NAVIGATION SYSTEM

### 1. HOMEPAGE HEADER STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                         │
│  │  Airbnb │  Beranda  |  Jelajahi  |  Pengalaman  |  Layanan     │
│  └─────────┘                                                         │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  [📍 Lokasi        ] │ [📅 Kapan            ] │ [👤 Tamu    ] │
│  │   "Cari destinasi"     "Tambahkan tanggal"       "Tambahkan tamu"│  │
│  │                                                                  │  │
│  │                                                           [🔍]  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [Populer] [Seni & budaya] [Pantai] [Pegunungan] [Alam terbuka] [...] │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Components:
1. **Logo** (left) - Clickable, returns to homepage
2. **Nav Tabs** - Beranda, Jelajahi, Pengalaman, Layanan
3. **Search Bar** (center) - 3-field pill design
4. **User Menu** (right) - Language, Menu, Profile

### 2. SEARCH RESULTS HEADER

```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                         │
│  │  Airbnb │  [← Back]  | [Lokasi: Bali] | [📅 Check-in] | [...]  │
│  └─────────┘                                                         │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  [📍 Bali] │ [Check-in] │ [Check-out] │ [👤 Tamu] │  [Filter] │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [☑ Kolam renang] [☑ Mesi..] [☑ Wifi] [☑ Dapur] [☑ AC] [☑ Parkir]  │
│                                                                        │
│  │  Popupular  │  ▶ Termurah │  ▶ Rating  │  ▶ Terbaru  │            │
│                                                                        │
│  ┌─────────────────────────────────────┐  ┌────────────────────────┐ │
│  │ [IMG] [FAV]                         │  │     MAP               │ │
│  │       Title                         │  │                        │ │
│  │       ★★★★☆ (review count)         │  │   [Price Pills]       │ │
│  │       $XXX / malam                  │  │                        │ │
│  └─────────────────────────────────────┘  └────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Components:
1. **Compact Search Bar** - Shows active filters
2. **Filter Pills** - Quick toggles (pool, wifi, kitchen, etc)
3. **Sort Tabs** - Popular, Termurah, Rating, Terbaru
4. **Split View** - Listings grid + Map
5. **Map Price Pills** - Floating price markers on map

---

## 📱 MOBILE NAVIGATION SYSTEM

### 1. MOBILE HOMEPAGE

```
┌────────────────────────────────────┐
│  ┌──────┐                    [👤] │
│  │ Airbnb│    ┌──────────────┐    │
│  └──────┘    │ 🔍 Mulai     │    │
│              │    pencarian │    │
│              └──────────────┘    │
│                                    │
│  ──────────────────────────────── │
│                                    │
│  [🏠]    [🔍]    [❤️]    [👤]    │
│ Beranda  Jelajahi Favorit  Profil  │
│                                    │
└────────────────────────────────────┘
```

### 2. MOBILE SEARCH RESULTS

```
┌────────────────────────────────────┐
│  [←]  [Bali        ]  [Filter][📍]│
│                                    │
│  ┌──────────────────────────────┐  │
│  │    [📍]  [📅]  [👤]  [🔍]   │  │
│  └──────────────────────────────┘  │
│                                    │
│  [☑ Kolam] [☑ Wifi] [☑ AC] [+]   │
│                                    │
│  ┌────────────────────────────┐   │
│  │ [IMG]                      │   │
│  │ Title          ★★★★☆      │   │
│  │ $XXX/malam                 │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │ [IMG]                      │   │
│  │ ...                        │   │
│  └────────────────────────────┘   │
│                                    │
│  ──────────────────────────────── │
│  [🏠]    [🔍]    [❤️]    [👤]    │
└────────────────────────────────────┘
```

### 3. MOBILE BOTTOM NAV

```
┌────────────────────────────────────┐
│              Content               │
│                                    │
│                                    │
│                                    │
├────────────────────────────────────┤
│  [🏠]    [🔍]    [❤️]    [👤]    │
│ Beranda  Jelajahi Favorit  Profil  │
└────────────────────────────────────┘
```

---

## 🔗 AIRBNB API ENDPOINTS (INFERRED)

Based on website analysis, Airbnb uses these API patterns:

### 1. SEARCH API
```
GET /api/v3/SerpSearchResults
  ?query={location}
  &checkin={date}
  &checkout={date}
  &adults={count}
  &children={count}
  &infants={count}
  &pets={count}
  &refinement_paths[]=/homes
  &currency={currency}
  &locale={locale}
  &_intents[]=p3
```

### 2. AUTOCOMPLETE/LOCATION API
```
GET /api/v3/FlightsSearchPods
  ?query={partial_query}
  &locale={locale}
  &currency={currency}
  &key={api_key}

OR

GET /api/v2/search/town_stories
  ?term={query}
  &locale={locale}
```

### 3. FILTERS METADATA API
```
GET /api/v3/InlineFilters
  ?query={location}
  &checkin={date}
  &checkout={date}
  &adults={count}
  &currency={currency}
```

### 4. CATEGORIES API
```
GET /api/v3/ExploreSections
  ?location={location}
  &checkin={date}
  &checkout={date}
  &adults={count}
  &currency={currency}
  &section=PLATFORM_PICK就在这时
```

---

## 🎨 UI/UX PATTERNS TO CLONE

### 1. SEARCH BAR DESIGN

#### Desktop (3-field pill)
```
┌────────────────┬──────────────────┬────────────────┐
│ 📍 Lokasi      │ 📅 Kapan         │ 👤 Tamu        │
│ "Cari dest..."  │ "Tambahkan tgl"  │ "Tambahkan..." │
└────────────────┴──────────────────┴────────────────┘
                                                    ┌────┐
                                                    │ 🔍 │ ← Search button
                                                    └────┘
```

**Implementation:**
```tsx
<div className="flex items-center border rounded-full shadow-md hover:shadow-lg transition">
  {/* Location */}
  <button className="flex-1 px-4 py-3 text-left border-r">
    <span className="block text-xs font-semibold">Lokasi</span>
    <input 
      placeholder="Cari destinasi..."
      className="w-full text-sm bg-transparent outline-none"
    />
  </button>
  
  {/* Check-in */}
  <button className="flex-1 px-4 py-3 text-left border-r">
    <span className="block text-xs font-semibold">Check-in</span>
    <span className="text-sm text-gray-500">Tambahkan tanggal</span>
  </button>
  
  {/* Guests */}
  <button className="flex-1 px-4 py-3 text-left">
    <span className="block text-xs font-semibold">Tamu</span>
    <span className="text-sm text-gray-500">Tambahkan tamu</span>
  </button>
  
  {/* Search Button */}
  <button className="bg-primary text-white rounded-full p-3 mx-1">
    <LuSearch />
  </button>
</div>
```

### 2. FILTER CHIPS

```
[☑ Kolam renang] [☑ Mesin..] [☑ Wifi] [☑ Dapur] [☑ AC] [ Filter  ◀▶]
```

**Implementation:**
```tsx
<div className="flex gap-2 overflow-x-auto pb-2">
  {/* Quick filters */}
  {quickFilters.map(filter => (
    <button 
      key={filter.id}
      className={`flex items-center gap-2 px-3 py-2 border rounded-full text-sm
        ${filter.active ? 'bg-gray-900 text-white' : 'bg-white'}
      `}
    >
      {filter.icon}
      {filter.label}
      {filter.active && <span>✕</span>}
    </button>
  ))}
  
  {/* Price filter button */}
  <button className="flex items-center gap-2 px-3 py-2 border rounded-full">
    <span>Harga</span>
    <ChevronRightIcon />
  </button>
  
  {/* More filters */}
  <button className="flex items-center gap-2 px-3 py-2 border rounded-full">
    <span>Filters</span>
    <span>{activeFilterCount > 0 && `(${activeFilterCount})`}</span>
  </button>
</div>
```

### 3. MAP PRICE PILL

```
┌─────────────┐
│   $50,000   │ ← Floating on map
└─────────────┘
     │
     └── Hover: Show mini card
```

**Implementation:**
```tsx
// Price Pill on Map
<div className="absolute bg-white rounded-lg shadow-lg p-2 cursor-pointer hover:bg-gray-50">
  <span className="font-semibold">
    {formatCurrency(price)}
  </span>
</div>

// Hover shows mini card
<Popup>
  <MiniListingCard listing={listing} />
</Popup>
```

### 4. MOBILE BOTTOM NAV

```
┌────────────────────────────────────────┐
│                                        │
│              Content Area               │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  [🏠]      [🔍]      [❤️]      [👤]   │
│  Beranda   Jelajahi   Favorit   Profil │
└────────────────────────────────────────┘

Height: 56px (h-14)
Position: fixed bottom-0
```

**Implementation:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex items-center justify-around z-50">
  {navItems.map(item => (
    <Link href={item.href} className="flex flex-col items-center gap-1">
          <item.icon size={24} />
          <span className="text-xs">{item.label}</span>
    </Link>
  ))}
</nav>
```

### 5. ANIMATIONS

#### Scroll Behavior (Navbar)
```tsx
// On scroll down: shrink navbar, hide on scroll past threshold
// On scroll up: show navbar

const [isVisible, setIsVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down - hide
      setIsVisible(false);
    } else {
      // Scrolling up - show
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [lastScrollY]);
```

#### Search Bar Expand (Mobile)
```tsx
// Full screen modal on mobile
<AnimatePresence>
  {isSearchOpen && (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed inset-0 z-[100] bg-white"
    >
      <SearchModal onClose={() => setIsSearchOpen(false)} />
    </motion.div>
  )}
</AnimatePresence>
```

#### Filter Slide Panel (Mobile)
```tsx
// Slide from right
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  className="fixed right-0 top-0 bottom-0 w-[85%] bg-white shadow-xl z-[100]"
>
  <FilterPanel />
</motion.div>
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
/* sm: 640px */
@media (min-width: 640px) { ... }

/* md: 768px - Tablet */
@media (min-width: 768px) { ... }

/* lg: 1024px - Desktop */
@media (min-width: 1024px) { ... }

/* xl: 1280px */
@media (min-width: 1280px) { ... }
```

---

## 🎯 AIRBNB vs GOFISHI MAPPING

| Airbnb Component | GoFishi Component | Status |
|-----------------|-------------------|--------|
| Homepage Header | `Navbar.tsx` | ✅ Exists, needs enhancement |
| Search Bar | `HeroSearch.tsx` | ✅ Exists, needs API connection |
| Filter Pills | `RouteTabs.tsx` | ⚠️ Exists, needs dynamic data |
| Search Results | `/perahu` page | ✅ Exists, needs Filter API |
| Map View | `ListingsMap.tsx` | ⚠️ Exists, needs price pills |
| Mobile Bottom Nav | `BottomNav.tsx` | ✅ Exists |
| User Menu | Clerk UserButton | ✅ Exists |

---

## 🔧 RECOMMENDED IMPLEMENTATION PRIORITY

### Phase 1: Navbar Foundation
1. ✅ Desktop: Logo + Nav tabs + User menu (DONE)
2. ✅ Mobile: Bottom nav + Top search pill (DONE)
3. 🔄 Desktop: Search bar enhancement (IN PROGRESS)
4. 🔄 Mobile: Full search modal (TODO)

### Phase 2: Search & Filters
1. 🔄 HeroSearch → `/api/locations/search` (TODO)
2. 🔄 `/perahu` → `/api/listings/search` (TODO)
3. 🔄 Filter Pills → `/api/listings/filters` (TODO)
4. 🔄 Price pills on map (TODO)

### Phase 3: Animations
1. 🔄 Scroll behavior (hide/show navbar)
2. 🔄 Search expand animation
3. 🔄 Filter slide panel
4. 🔄 Listing card hover effects

---

## 📁 FILES TO CREATE/MODIFY

```
src/components/
├── navbar/
│   ├── Navbar.tsx              # Modify - enhance search
│   ├── BottomNav.tsx           # Already good
│   ├── Logo.tsx               # Already good
│   └── UserMenu.tsx            # Create - if needed
│
├── search/
│   ├── HeroSearch.tsx         # Modify - connect to API
│   ├── MobileSearchModal.tsx   # Create - full screen search
│   ├── FilterPills.tsx         # Create - dynamic filter chips
│   └── FilterPanel.tsx         # Create - slide panel
│
├── listings/
│   ├── Listings.tsx            # Modify - use Filter API
│   ├── ListingCard.tsx         # Modify - hover effects
│   ├── ListingsMap.tsx         # Modify - add price pills
│   └── ListingDetailClient.tsx # Already good
│
└── modals/
    └── FilterModal.tsx         # Modify - enhance
```

---

## 📊 API REQUIREMENTS FOR GOFISHI

Based on Airbnb analysis, GoFishi needs:

### 1. Location Autocomplete
```typescript
GET /api/locations/search?q={query}
Response: {
  data: [{ id, name, region, image? }]
}
```

### 2. Search Listings
```typescript
GET /api/listings/search?
  q={query}&
  locationValue={location}&
  minPrice={}&
  maxPrice={}&
  guests={}&
  boatType={}&
  amenities={}&
  instantBook={}&
  checkIn={}&
  checkOut={}&
  page={}&
  limit={}
Response: {
  data: Listing[],
  pagination: { page, limit, total, totalPages }
}
```

### 3. Filter Metadata
```typescript
GET /api/listings/filters
Response: {
  priceRange: { min, max },
  boatTypes: string[],
  amenities: string[],
  fishingTypes: string[],
  categories: string[],
  facilities: string[]
}
```

### 4. Categories/Sections
```typescript
GET /api/listings/categories
Response: {
  data: [{ id, name, icon, count }]
}
```

---

## 🎬 ANIMATION BEHAVIORS TO CLONE

### 1. Navbar Hide/Show on Scroll
```
Desktop:
- Scroll down > 60px → Navbar shrinks, shows compact search
- Scroll down > 100px → Navbar hides (translateY: -100%)
- Scroll up → Navbar shows (translateY: 0)

Mobile:
- Always show BottomNav
- Hide TopBar on scroll down > 60px
```

### 2. Search Bar States
```
Desktop:
- Default: 3-field horizontal pill
- Hover: Subtle shadow increase
- Focus: Border highlight

Mobile:
- Default: Compact search pill
- Tap: Full screen modal slides up
- Close: Slides down
```

### 3. Filter Panel
```
Desktop:
- Hover filter button: Show count badge
- Click: Dropdown or slide panel

Mobile:
- Tap Filter: Slide panel from right
- Apply filters: Panel closes, results update
```

### 4. Map Interactions
```
- Hover price pill: Show mini listing card
- Click pill: Center map on listing
- Scroll map: Lazy load listings
```

---

## ✅ COMPLETION CHECKLIST

### Desktop
- [x] Logo (left)
- [x] Nav tabs (Beranda, Jelajahi, etc)
- [x] Search bar (3-field pill)
- [x] User menu (right)
- [ ] Language selector
- [x] Filter pills
- [x] Sort tabs
- [x] Listings grid
- [x] Map view
- [ ] Price pills on map
- [ ] Scroll hide/show behavior

### Mobile
- [x] Top search pill
- [ ] Full search modal
- [x] Bottom nav (4 tabs)
- [x] Filter quick chips
- [x] Listing cards
- [ ] Map view
- [ ] Price pills

### Animations
- [ ] Navbar shrink on scroll
- [ ] Search expand modal
- [ ] Filter slide panel
- [ ] Listing card hover lift
- [ ] Map price pill hover

---

**Document Version:** 1.0
**Analysis Date:** 2026-07-06
**Status:** READY FOR GEMINI
