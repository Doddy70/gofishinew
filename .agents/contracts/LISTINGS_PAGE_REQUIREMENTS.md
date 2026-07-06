# Listings Page API & Design Requirements for Gemini

Generated: 2026-07-05
Status: Implementation Ready

---

## Overview

The `/perahu` listings page requires:
1. **Split View Layout** — Listings grid on left, interactive map on right
2. **Real-time Map Markers** — Price badges on map with popup cards
3. **Filter Bar** — Category chips, price filter, capacity filter
4. **Airbnb-style Card Design** — 3:2 image ratio, rating, captain info

---

## API Endpoints Required

### 1. GET /api/listings (Enhanced for Map)

Enhanced version that includes all data needed for map markers and card display.

**Query Parameters:**
```
?page=1
&limit=12
&category=Fishing
&locationValue=ancol
&minPrice=500000
&maxPrice=5000000
&guests=4
&startDate=2026-07-10
&endDate=2026-07-15
```

**Response:**
```json
{
  "data": [
    {
      "id": "listing-uuid",
      "title": "KM Pesona Laut",
      "slug": "km-pesona-laut-ancol",
      "imageSrc": "https://...",
      "images": ["...", "..."],
      "boatType": "Center Console",
      "passengerCapacity": 6,
      "price": 1500000,
      "locationValue": "Ancol",
      "latitude": -6.1167,
      "longitude": 106.8333,
      "facilities": ["Sarapan", "Kopi", "Makan Siang"],
      "avgRating": 4.8,
      "reviewCount": 23,
      "captain": {
        "id": "user-uuid",
        "name": "Kapten Bona",
        "image": "https://..."
      },
      "availableTrips": [
        {
          "id": "trip-uuid",
          "dateStart": "2026-07-10",
          "dateEnd": "2026-07-11",
          "priceTotal": 1500000,
          "seatsAvailable": 4
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Status:** ✅ ENHANCED — existing `/api/listings/route.ts` + `/api/locations/[id]/route.ts`

---

### 2. GET /api/listings/search (Autocomplete)

For HeroSearch location input.

**Query:** `?q=ancol`

**Response:**
```json
[
  { "label": "Dermaga Ancol, Jakarta Utara", "value": "ancol", "availableBoats": 12 }
]
```

**Status:** ✅ IMPLEMENTED — `/api/locations/search/route.ts`

---

### 3. GET /api/locations (For Category Chips)

**Response:**
```json
{
  "locations": [
    {
      "id": "loc-xxx",
      "name": "Dermaga Ancol",
      "region": "Jakarta Utara",
      "image": "https://...",
      "totalBoats": 12
    }
  ]
}
```

**Status:** ✅ IMPLEMENTED — `/api/locations/route.ts`

---

## Design Specifications

### Split View Layout (Airbnb Style)

```
┌─────────────────────────────────────────────────────────────┐
│ [Sticky Header: Search Bar + Category Chips + Filters]    │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│  LISTINGS GRID               │   INTERACTIVE MAP             │
│  (Scrollable)               │   (Fixed/Sticky)             │
│                              │                              │
│  ┌──────┐ ┌──────┐         │   [Marker: Rp 1.5Juta]     │
│  │Card 1│ │Card 2│         │         [Marker: Rp 2Juta]  │
│  └──────┘ └──────┘         │   [Marker: Rp 1.2Juta]      │
│  ┌──────┐ ┌──────┐         │                              │
│  │Card 3│ │Card 4│         │                              │
│  └──────┘ └──────┘         │                              │
│                              │                              │
├──────────────────────────────┴──────────────────────────────┤
│ [Floating Toggle Button: "Tampilkan Peta" / "Tampilkan Daftar"] │
└─────────────────────────────────────────────────────────────┘
```

**Breakpoints:**
- **Desktop (md+):** 55% listings / 45% map (split view)
- **Mobile:** Full-width list OR map (toggle between views)

---

### Card Design (Airbnb Style)

```
┌────────────────────────────┐
│ [Image 3:2 ratio]          │
│                    ♥       │ ← Favorite button
│  ┌────────────────┐        │
│  │ ⭐ 4.9 (128) │        │ ← Rating badge (if has reviews)
│  └────────────────┘        │
├────────────────────────────┤
│ Boat Type • 6 guests      │ ← Subtitle
│ Title of listing           │ ← Primary title
│ Kapten name                │ ← Captain info
│ Rp 1.500.000 / hari       │ ← Price
│ [📅 10 Jul] [📅 12 Jul]  │ ← Available dates (optional)
└────────────────────────────┘
```

**Specifications:**
- Image aspect ratio: `3:2`
- Grid gap: `20px` (gap-5)
- Grid columns:
  - List view: 1/2/3/4/5 cols (responsive)
  - Map view: 1/2/2 cols (responsive)
- Rounded corners: `rounded-xl` (12px)
- Hover effect: `scale-105` + shadow lift

---

### Map Markers (Airbnb Style)

```
┌─────────────────────────┐
│ [Marker with price]     │
│                         │
│ ┌─────────────────────┐ │
│ │ [Image]             │ │
│ │ Title              │ │
│ │ Rp 1.500.000       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Marker Design:**
- Price badge: white bg, rounded-full, shadow
- Font: bold, 13px
- Hover: dark bg, white text
- Selected: pink/red (#FF385C) bg, scale 110%
- Popup: Airbnb-style card with image, title, price

---

### Filter Bar (Airbnb Style)

```
┌────────────────────────────────────────────────────────┐
│ [🔍 Search Input] [Filter ▾] [Harga ▾] [Tipe ▾]     │
├────────────────────────────────────────────────────────┤
│ [Semua] [Ancol] [Muara Angke] [Marina] [Kepulauan...] │ ← Chips
└────────────────────────────────────────────────────────┘
```

**Filter Components:**
1. **Search Input** — Location autocomplete
2. **Filter Button** — Opens filter panel
3. **Price Filter** — Min/max price range
4. **Type Filter** — Boat type dropdown
5. **Category Chips** — Horizontal scrollable pills

---

## Components Required for Gemini

| Component | File | Purpose |
|-----------|------|---------|
| `HomeClient` | `components/home/HomeClient.tsx` | Main container with split view |
| `Listings` | `components/listings/Listings.tsx` | Grid layout for cards |
| `ListingCard` | `components/listings/ListingCard.tsx` | Airbnb-style card |
| `ListingsMap` | `components/listings/ListingsMap.tsx` | Interactive map with markers |
| `MapToggle` | `components/home/MapToggle.tsx` | Floating toggle button |
| `HeroSearch` | `components/home/HeroSearch.tsx` | Location search with autocomplete |

---

## Location Data Hook

Use `useLocations` hook for Indonesian fishing locations:

```typescript
import useLocations from "@/custom-hooks/useLocations";

// In component:
const { getAllLocations, getByValue, searchLocations } = useLocations();

// Get all Indonesian locations
const locations = getAllLocations();
// Returns: [{ value: "ancol", label: "Dermaga Ancol", latlng: [-6.1167, 106.8333], ... }]

// Search locations
const results = searchLocations("ancol");
// Returns: [{ value: "ancol", label: "Dermaga Ancol", ... }]

// Get by value
const loc = getByValue("ancol");
// Returns: { value: "ancol", label: "Dermaga Ancol", latlng: [-6.1167, 106.8333], ... }
```

**File:** `src/custom-hooks/useLocations.ts`

---

## Status

| Item | Status | File |
|------|--------|------|
| Listings API | ✅ | `/api/listings/route.ts` |
| Location Search API | ✅ | `/api/locations/search/route.ts` |
| Locations Browse API | ✅ | `/api/locations/route.ts` |
| useLocations Hook | ✅ | `src/custom-hooks/useLocations.ts` |
| ListingsMap Component | ✅ FIXED | `src/components/listings/ListingsMap.tsx` |
| LocationsPageClient | ✅ | `src/app/locations/LocationsPageClient.tsx` |
| LocationDetailClient | ✅ | `src/app/locations/[id]/LocationDetailClient.tsx` |
| HomeClient (Split View) | ⚠️ NEEDS UPDATE | `src/components/home/HomeClient.tsx` |
| ListingCard | ⚠️ NEEDS UPDATE | `src/components/listings/ListingCard.tsx` |

---

## Next Steps for Gemini

1. **Update `HomeClient`** — Implement Airbnb-style filter bar with category chips
2. **Update `ListingCard`** — Match Airbnb card design (3:2 image, rating badge)
3. **Update `Listings`** — Responsive grid that adapts to map view
4. **Enhance `HeroSearch`** — Use `useLocations` for autocomplete

Reference: `airbnb-design-reference.md` for complete design specs
