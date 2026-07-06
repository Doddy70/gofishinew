# 🚀 HANDOFF: Navbar Implementation Directive
## For Gemini Agent

**From:** Claude (Backend)
**Date:** 2026-07-06
**Priority:** HIGH
**Context:** Airbnb Navigation System Analysis - Ready for implementation
**Reference:** `.maestro/AIRBNB_NAVIGATION_ANALYSIS.md`

---

## 📸 AIRBNB ANALYSIS COMPLETED

Based on live website analysis of https://www.airbnb.co.id/:

### Screenshots Captured:
- `airbnb-desktop-homepage.png` - Homepage header
- `airbnb-desktop-search.png` - Search results header

---

## ⚠️ THE CORE CONFUSION - SOLVED

**There are TWO navbar variants, but it's ONE component.**

```typescript
// src/components/navbar/Navbar.tsx - line 58
const isMainPage = pathname === "/" || pathname === "/perahu";

// isMainPage = true  → Full navbar (HeroSearch + FilterPills)
// isMainPage = false → Compact navbar (back arrow + title)
```

---

## 🏠 AIRBNB-STYLE NAVIGATION (CLONE TARGET)

### Desktop Homepage Header
```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                         │
│  │  Airbnb │  Beranda  |  Jelajahi  |  Pengalaman  |  Layanan     │
│  └─────────┘                                                         │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  📍 Lokasi      │  📅 Kapan         │  👤 Tamu         🔍   │  │
│  │  "Cari dest..."   "Tambahkan tanggal"   "Tambahkan tamu"        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [Populer] [Seni & budaya] [Pantai] [Pegunungan] [Alam terbuka] [...] │
└────────────────────────────────────────────────────────────────────────┘
```

### Desktop Search Results Header
```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                         │
│  │  Airbnb │  [← Back]  | [Lokasi: Bali] | [📅 Check-in] | [...]  │
│  └─────────┘                                                         │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  📍 Bali  │  Check-in  │  Check-out  │  👤 Tamu  │  [Filter]  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [☑ Kolam renang] [☑ Mesi..] [☑ Wifi] [☑ Dapur] [☑ AC] [☑ Parkir]  │
│                                                                        │
│  │  Populer  │  Termurah  │  Rating  │  Terbaru  │                │
└────────────────────────────────────────────────────────────────────────┘
```

### Mobile Homepage Header
```
┌────────────────────────────────────┐
│  ┌──────┐                    [👤] │
│  │ Airbnb│    ┌──────────────┐    │
│  └──────┘    │ 🔍 Mulai     │    │
│              │    pencarian │    │
│              └──────────────┘    │
│                                    │
│  ──────────────────────────────── │
│  [🏠]    [🔍]    [❤️]    [👤]   │
│ Beranda  Jelajahi Favorit  Profil │
└────────────────────────────────────┘
```

---

## 🎨 KEY UI COMPONENTS TO BUILD

### 1. SEARCH BAR (3-Field Pill) - Desktop

```tsx
// src/components/search/HeroSearch.tsx - ENHANCE TO THIS DESIGN

<div className="flex items-center border rounded-full shadow-md hover:shadow-lg transition-all">
  {/* Location Field */}
  <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50 rounded-l-full">
    <span className="block text-xs font-semibold text-gray-900">Lokasi</span>
    <input 
      placeholder="Cari destinasi..."
      className="w-full text-sm bg-transparent outline-none"
      onFocus={() => setActiveField('location')}
    />
  </button>
  
  {/* Check-in Field */}
  <button className="flex-1 px-4 py-3 text-left border-r hover:bg-gray-50">
    <span className="block text-xs font-semibold text-gray-900">Check-in</span>
    <span className="text-sm text-gray-500">Tambahkan tanggal</span>
  </button>
  
  {/* Guests Field */}
  <button className="flex-1 px-4 py-3 text-left hover:bg-gray-50 rounded-r-full">
    <span className="block text-xs font-semibold text-gray-900">Tamu</span>
    <span className="text-sm text-gray-500">Tambahkan tamu</span>
  </button>
  
  {/* Search Button */}
  <button className="bg-primary hover:bg-primary/90 text-white rounded-full p-3 mx-1 transition-colors">
    <LuSearch size={20} />
  </button>
</div>
```

### 2. FILTER CHIPS

```tsx
// src/components/search/FilterPills.tsx - NEW FILE

export default function FilterPills({ onFilterChange }) {
  const [filters, setFilters] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    fetch("/api/listings/filters")
      .then(res => res.json())
      .then(setFilters);
  }, []);

  const toggleFilter = (key, value) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      onFilterChange(next);
      return next;
    });
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Dynamic boat types */}
      {filters?.boatTypes.map(type => (
        <button
          key={type}
          onClick={() => toggleFilter('boatType', type)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-all
            ${activeFilters.boatType === type 
              ? 'bg-gray-900 text-white border-gray-900' 
              : 'bg-white hover:bg-gray-50'
            }`}
        >
          {type}
          {activeFilters.boatType === type && <LuX size={14} />}
        </button>
      ))}
      
      {/* Price Range */}
      <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap hover:bg-gray-50">
        <span>Harga</span>
        <span className="text-gray-400">|</span>
        <span>{formatCurrency(filters?.priceRange.min)} - {formatCurrency(filters?.priceRange.max)}</span>
      </button>
      
      {/* Instant Book */}
      <button 
        onClick={() => toggleFilter('instantBook', true)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-all
          ${activeFilters.instantBook 
            ? 'bg-gray-900 text-white border-gray-900' 
            : 'bg-white hover:bg-gray-50'
          }`}
      >
        <LuZap size={14} />
        Pemesanan Instan
      </button>
      
      {/* More Filters Button */}
      <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap hover:bg-gray-50">
        <span>Filters</span>
        {Object.keys(activeFilters).length > 0 && (
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {Object.keys(activeFilters).length}
          </span>
        )}
      </button>
    </div>
  );
}
```

### 3. MOBILE SEARCH MODAL

```tsx
// src/modals/MobileSearchModal.tsx - NEW FILE

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LuSearch, LuMapPin, LuCalendar, LuUsers, LuX } from "react-icons/lu";

export default function MobileSearchModal({ isOpen, onClose }) {
  const [step, setStep] = useState<'initial' | 'location' | 'dates' | 'guests'>('initial');
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.length >= 2) {
      fetch(`/api/locations/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setLocations(data.data || []));
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          {/* Header */}
          <div className="flex items-center p-4 border-b">
            <button 
              onClick={step === 'initial' ? onClose : () => setStep('initial')}
              className="p-2 -ml-2"
            >
              <LuX size={24} />
            </button>
            
            {step === 'initial' && (
              <div className="flex-1 mx-4">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                  <LuSearch size={20} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari destinasi..."
                    className="flex-1 mx-3 bg-transparent outline-none"
                    autoFocus
                    onFocus={() => setStep('location')}
                  />
                </div>
              </div>
            )}
            
            {step !== 'initial' && (
              <h2 className="flex-1 text-center font-semibold">
                {step === 'location' && 'Pilih Lokasi'}
                {step === 'dates' && 'Pilih Tanggal'}
                {step === 'guests' && 'Tambahkan Tamu'}
              </h2>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'initial' && (
              <div className="space-y-2">
                <button 
                  onClick={() => setStep('location')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50"
                >
                  <LuMapPin size={24} className="text-gray-600" />
                  <span>Cari destinasi</span>
                </button>
                <button 
                  onClick={() => setStep('dates')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50"
                >
                  <LuCalendar size={24} className="text-gray-600" />
                  <span>Pilih tanggal</span>
                </button>
                <button 
                  onClick={() => setStep('guests')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50"
                >
                  <LuUsers size={24} className="text-gray-600" />
                  <span>Tambahkan tamu</span>
                </button>
              </div>
            )}

            {step === 'location' && (
              <div>
                <input
                  type="text"
                  placeholder="Mau ke mana?"
                  className="w-full border-b-2 border-primary pb-2 text-lg outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <div className="mt-4 space-y-2">
                  {locations.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        // Set location and go back
                        setStep('initial');
                      }}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <LuMapPin size={20} className="text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">{loc.name}</div>
                        <div className="text-sm text-gray-500">{loc.region}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'dates' && (
              <div className="text-center py-8">
                <p className="text-gray-500">DatePicker component here</p>
              </div>
            )}

            {step === 'guests' && (
              <div className="text-center py-8">
                <p className="text-gray-500">Guest counter component here</p>
              </div>
            )}
          </div>

          {/* Footer with Search */}
          {step === 'initial' && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <button className="w-full bg-primary text-white py-4 rounded-full font-semibold">
                Cari
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 4. MAP PRICE PILL

```tsx
// src/components/listings/ListingsMap.tsx - ENHANCE

// Add this component for price markers
function PricePill({ price, position, onHover, onLeave }) {
  return (
    <div
      className="absolute bg-white rounded-lg shadow-lg px-3 py-2 cursor-pointer transform -translate-x-1/2 -translate-y-full hover:bg-gray-50 transition-colors"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <span className="font-semibold text-sm">
        {formatCurrency(price)}
      </span>
      {/* Triangle pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
    </div>
  );
}
```

---

## 🎬 ANIMATIONS TO IMPLEMENT

### 1. Navbar Scroll Behavior

```tsx
// src/components/navbar/Navbar.tsx - ENHANCE

const [isScrolled, setIsScrolled] = useState(false);
const [isHidden, setIsHidden] = useState(false);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Show/hide on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsHidden(true); // Scrolling down
    } else {
      setIsHidden(false); // Scrolling up
    }
    
    // Shrink on scroll
    setIsScrolled(currentScrollY > 60);
    setLastScrollY(currentScrollY);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [lastScrollY]);

// Apply to navbar
<div className={`
  transition-all duration-300 ease-in-out
  ${isHidden ? '-translate-y-full' : 'translate-y-0'}
  ${isScrolled ? 'h-[70px] shadow-md' : 'h-[140px]'}
`}>
```

### 2. Filter Pills Animation

```tsx
// Add framer-motion for smooth animations
import { motion, AnimatePresence } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="flex gap-2"
>
  {/* Pills here */}
</motion.div>
```

---

## 📏 DESIGN TOKENS

```css
/* Heights */
--navbar-height: 140px;      /* Homepage expanded */
--navbar-height-scrolled: 70px;
--navbar-height-mobile: 80px;
--bottom-nav-height: 65px;

/* Spacing */
--nav-padding-x: 24px;       /* xl screens */
--nav-padding-x-md: 16px;    /* md screens */

/* Border Radius */
--pill-radius: 9999px;        /* Full rounded */
--card-radius: 12px;         /* Listing cards */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

/* Transitions */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Core (Must Have)
- [ ] **TASK 1:** HeroSearch → `/api/locations/search`
- [ ] **TASK 2:** `/perahu` page → `/api/listings/search`
- [ ] **TASK 3:** FilterPills → `/api/listings/filters`
- [ ] **TASK 4:** MobileSearchModal full implementation

### Phase 2: Enhancement (Should Have)
- [ ] Navbar scroll hide/show animation
- [ ] Filter chips with active state
- [ ] Map price pills on ListingsMap

### Phase 3: Polish (Nice to Have)
- [ ] Search expand/collapse animation
- [ ] Filter slide panel (mobile)
- [ ] Listing card hover lift effect

---

## 🔗 API ENDPOINTS (READY)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/locations/search?q=Lombok` | GET | Location autocomplete |
| `/api/listings/search?locationValue=Bali&guests=4` | GET | Search listings |
| `/api/listings/filters` | GET | Get filter options |

---

## ⚠️ FILES SUMMARY

### Existing (DO NOT BREAK)
- `Navbar.tsx` - ✅ Keep, just enhance
- `BottomNav.tsx` - ✅ Already good
- `Logo.tsx` - ✅ Already good
- `UserButton` from Clerk - ✅ Already good

### Create New
- `src/components/search/FilterPills.tsx`
- `src/modals/MobileSearchModal.tsx`

### Modify
- `src/components/home/HeroSearch.tsx` - Connect to API
- `src/app/perahu/page.tsx` - Use Filter API
- `src/components/navbar/Navbar.tsx` - Add animations

---

## 🎯 EXECUTION ORDER

```
1. TASK 1: HeroSearch → /api/locations/search
   └── File: src/components/home/HeroSearch.tsx
   
2. TASK 2: /perahu → /api/listings/search
   └── File: src/app/perahu/page.tsx or src/components/listings/Listings.tsx
   
3. TASK 3: FilterPills → /api/listings/filters
   └── File: src/components/search/FilterPills.tsx (NEW)
   
4. TASK 4: MobileSearchModal
   └── File: src/modals/MobileSearchModal.tsx (NEW)
   
5. BONUS: Animations
   └── Add scroll behavior, hover effects
```

---

## 📞 REFERENCE DOCUMENTS

| Document | Purpose |
|----------|---------|
| `.maestro/AIRBNB_NAVIGATION_ANALYSIS.md` | Full Airbnb analysis with screenshots |
| `.maestro/PARALLEL_IMPLEMENTATION_PLAN.md` | Multi-agent task allocation |
| `.maestro/IMPLEMENTATION_WORKFLOW_2026-07-06.md` | Gap analysis and tasks |

---

## ⏱️ ESTIMATED TIME

- TASK 1-4 (Core): 2-3 hours
- Animations: 1-2 hours
- Testing: 1 hour

**Total:** 4-6 hours

---

**Questions?** → Ask user or read reference documents

**Document Version:** 2.0 (Updated with Airbnb Analysis)
**Ready for Implementation:** YES 🚀
