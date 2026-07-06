# 🎯 DIRECTIVE: Airbnb Navbar System Implementation
## GoFishi - For Gemini Agent

**Date:** 2026-07-06
**Author:** Claude (Backend)
**Purpose:** Guide Gemini to implement consistent Airbnb-style navbar

---

## ⚠️ PROBLEM STATEMENT

Gemini is experiencing confusion about navbar implementation across different pages. This document clarifies the **single source of truth** for all navbar implementations.

---

## 🏠 AIRBNB NAVBAR ARCHITECTURE

### Reference: https://www.airbnb.co.id/

### Two Navbar Variants (Same Component, Different States)

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOMEPAGE / SEARCH PAGE                       │
│                    (isMainPage = true)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Logo]    [Beranda] [Jelajahi] [Dashboard*] [Trip*]  │   │
│  │                          [WEATHER + SEARCH BAR]          │   │
│  │                          [Filter Pills: Semua, etc]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Desktop: Full navbar with HeroSearch + Categories              │
│  Mobile:  Collapsed to search pill only                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ALL OTHER PAGES                              │
│                    (isMainPage = false)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [← Back]    [Page Title]              [User Menu]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Desktop: Compact navbar (80px), back arrow if applicable     │
│  Mobile:  Simple top bar with back navigation                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CURRENT IMPLEMENTATION ANALYSIS

### Current File: `src/components/navbar/Navbar.tsx`

```typescript
// Key logic that determines navbar variant:
const pathname = usePathname();
const isMainPage = pathname === "/" || pathname === "/perahu";

const navHeight = isMainPage 
  ? (isExpandedState ? "h-[140px] md:h-[180px]" : "h-[140px] md:h-[150px]") 
  : "h-[80px]";
```

### ✅ What's Already Done:
1. `Navbar.tsx` - Main navbar with scroll behavior
2. `BottomNav.tsx` - Mobile bottom navigation
3. `HeroSearch.tsx` - Search component (needs connection to API)
4. `Logo.tsx` - Logo component

### ❌ What's Missing / Needs Fixing:

| Issue | Current State | Required State |
|-------|---------------|----------------|
| HeroSearch location | Uses `smartSearch` server action | Should use `GET /api/locations/search?q=` |
| Search results | Not connected to `GET /api/listings/search` | Must use new Filter API |
| Filter Pills | Static UI | Should fetch from `GET /api/listings/filters` |
| Mobile search pill | Static text | Should open HeroSearch modal |

---

## 🎯 GEMINI'S TASK: IMPLEMENTATION DIRECTIVE

### TASK 1: Fix HeroSearch Location Autocomplete

**Problem:** HeroSearch uses `smartSearch` server action (may not exist or inefficient)

**Solution:** Connect to `GET /api/locations/search`

```typescript
// src/components/home/HeroSearch.tsx

// OLD (remove):
import { smartSearch } from "@/server-actions/smartSearch";

// NEW (add):
const fetchLocations = async (query: string) => {
  if (!query || query.length < 2) {
    setLocations([]);
    return;
  }
  
  try {
    const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setLocations(data.data || []);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    setLocations([]);
  }
};
```

---

### TASK 2: Connect Search to Filter API

**Problem:** Search results page not using new API

**Solution:** Connect `/perahu` page to `GET /api/listings/search`

```typescript
// src/app/perahu/page.tsx or src/components/listings/Listings.tsx

// Build query from URL params:
const buildSearchQuery = () => {
  const params = new URLSearchParams();
  
  // From HeroSearch:
  if (location) params.set("locationValue", location);
  if (minPrice) params.set("minPrice", minPrice.toString());
  if (maxPrice) params.set("maxPrice", maxPrice.toString());
  if (guests) params.set("guests", guests.toString());
  if (boatType) params.set("boatType", boatType);
  if (instantBook) params.set("instantBook", "true");
  
  // Pagination:
  params.set("page", page.toString());
  params.set("limit", "12");
  
  return params.toString();
};

// Fetch:
const res = await fetch(`/api/listings/search?${buildSearchQuery()}`);
const { data: listings, pagination } = await res.json();
```

---

### TASK 3: Dynamic Filter Pills

**Problem:** Filter pills are hardcoded

**Solution:** Fetch from `GET /api/listings/filters`

```typescript
// src/components/home/RouteTabs.tsx or create FilterPills.tsx

const FilterPills = () => {
  const [filters, setFilters] = useState<FilterMetadata | null>(null);
  
  useEffect(() => {
    fetch("/api/listings/filters")
      .then(res => res.json())
      .then(data => setFilters(data));
  }, []);
  
  return (
    <div className="flex gap-2 overflow-x-auto">
      {/* Default pill */}
      <button>Semua</button>
      
      {/* Dynamic boat types */}
      {filters?.boatTypes.map(type => (
        <button key={type}>{type}</button>
      ))}
      
      {/* Price range */}
      <button>{formatCurrency(filters?.priceRange.min)} - {formatCurrency(filters?.priceRange.max)}</button>
    </div>
  );
};
```

---

### TASK 4: Mobile Search Modal

**Problem:** Mobile search pill doesn't open properly

**Solution:** Create full-screen search modal like Airbnb

```typescript
// src/modals/MobileSearchModal.tsx

export default function MobileSearchModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onClose}>✕</button>
        <input 
          type="text" 
          placeholder="Caridestination..."
          className="flex-1 mx-4"
          autoFocus
        />
      </div>
      
      {/* Location suggestions */}
      <div className="p-4">
        {/* Recent searches */}
        {/* Popular destinations */}
        {/* Dynamic suggestions from API */}
      </div>
    </div>
  );
}
```

---

## 📱 AIRBNB MOBILE NAVBAR CLONE GUIDE

### Mobile Bottom Navigation (Already Done: `BottomNav.tsx`)

```typescript
// src/components/navbar/BottomNav.tsx

// Current structure (verify this):
const bottomNavItems = [
  { icon: LuSearch, label: "Jelajahi", href: "/perahu" },
  { icon: LuHeart, label: "Favorit", href: "/favorites" },
  { icon: LuCalendar, label: "Trip Saya", href: "/reservations" },
  { icon: LuUser, label: "Profil", href: "/profile" },
];
```

### Mobile Top Bar Variants

```
┌────────────────────────────────────┐
│ BACK  │   TITLE    │  ACTIONS     │  ← Listing Detail
├────────────────────────────────────┤
│  🔍   │  Search... │  Filter  Sort │  ← Search Results
├────────────────────────────────────┤
│  ←    │  Dashboard │  🔔  👤      │  ← Dashboard
└────────────────────────────────────┘
```

---

## 🔗 API ENDPOINTS REFERENCE

### For Gemini to Use:

| Endpoint | Method | Purpose | Use In |
|----------|--------|---------|--------|
| `/api/locations/search?q=` | GET | Location autocomplete | HeroSearch |
| `/api/listings/search` | GET | Search with filters | /perahu page |
| `/api/listings/filters` | GET | Filter metadata | FilterPills, FilterModal |

### Query Parameters for `/api/listings/search`:

```
GET /api/listings/search?
  q=Lombok                      # Text search
  &locationValue=Jakarta       # Location filter
  &minPrice=1000000            # Min price
  &maxPrice=5000000            # Max price
  &guests=4                     # Guest count
  &boatType=Speedboat          # Boat type
  &instantBook=true             # Instant booking only
  &checkIn=2026-07-10         # Date filter
  &checkOut=2026-07-15         # Date filter
  &page=1                       # Pagination
  &limit=12                     # Items per page
```

---

## 🎨 DESIGN TOKENS

### Navbar Heights (Tailwind Classes)

```css
/* Mobile */
-h-[140px]        /* Homepage with categories */
-h-[80px]         /* Other pages / scrolled */

/* Desktop */
-h-[180px]        /* Homepage expanded */
-h-[150px]        /* Homepage collapsed */
-h-[80px]         /* Other pages */

/* Bottom Nav (Mobile only) */
-h-[65px]         /* BottomNav height */
-bottom-[65px]    /* BottomSheet offset */
```

---

## ✅ CHECKLIST FOR GEMINI

### Must Complete:

- [ ] HeroSearch: Connect to `GET /api/locations/search`
- [ ] Search Results: Connect to `GET /api/listings/search`
- [ ] Filter Pills: Fetch from `GET /api/listings/filters`
- [ ] Mobile Search: Full-screen modal on pill click
- [ ] BottomNav: Ensure consistent across all pages
- [ ] Test on: `/`, `/perahu`, `/perahu/[slug]`, `/dashboard`, `/checkout`

### Do NOT Change:

- [ ] Navbar.tsx structure (it's working)
- [ ] BottomNav.tsx basic layout (it's working)
- [ ] Clerk authentication (UserButton is correct)

### Focus Areas:

1. **Homepage (`/`)**: Full navbar with HeroSearch + FilterPills
2. **Search (`/perahu`)**: Compact navbar with active filters shown
3. **Detail (`/perahu/[slug]`)**: Simple navbar, show listing title
4. **Dashboard (`/dashboard`)**: Compact navbar, no search
5. **Checkout**: Minimal navbar, back button only

---

## 🔄 NAVBAR STATE FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVBAR STATE MACHINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ON HOMEPAGE                                           │
│  │                                                          │
│  ├─► Scroll Down ──► Navbar shrinks, search expands        │
│  │                        │                                  │
│  │                        ▼                                  │
│  │                   HeroSearch active                       │
│  │                                                          │
│  └─► Tap Search ──► Modal opens (mobile)                    │
│                        │                                     │
│                        ▼                                     │
│                   Location/Dates/Guests                     │
│                                                             │
│  USER ON OTHER PAGE                                         │
│  │                                                          │
│  └─► Simple navbar, back arrow if needed                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📞 CLARIFICATION

If Gemini is confused about any navbar behavior:

1. **"What's the navbar on X page?"**
   → Check `Navbar.tsx` line 58: `const isMainPage = pathname === "/" || pathname === "/perahu";`
   → `isMainPage = true` → Full navbar
   → `isMainPage = false` → Compact navbar

2. **"How to add new nav item?"**
   → Add to `NavLink` component
   → Add to `mobileNavConfig` for mobile back navigation

3. **"How to connect search?"**
   → See TASK 1, 2, 3 above

4. **"Mobile vs Desktop behavior?"**
   → Use Tailwind `md:` and `lg:` breakpoints
   → `md:hidden` = Mobile only
   → `hidden md:block` = Desktop only

---

**Document Version:** 1.0
**Status:** READY FOR GEMINI
**Next:** Gemini can implement following this directive
