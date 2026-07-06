# 🗺️ GOFISHI MARKET LOCATIONS
## Current Operational Areas

**Date:** 2026-07-06
**Status:** ACTIVE MARKET
**Coverage:** 4 Provinces in Indonesia

---

## 📍 CURRENT LOCATIONS (Active Market)

### Jakarta
```
┌─────────────────────────────────────────────────────────────┐
│  Jakarta                                                    │
│  ├── Muara Baru (Pelabuhan Nusantara)                      │
│  ├── Kamal Muara (Teluk Jakarta)                          │
│  ├── Ancol (Taman Impian Jaya)                            │
│  └── Sunda Kelapa (Pelabuhan Kali Baru)                   │
└─────────────────────────────────────────────────────────────┘
```

### Banten
```
┌─────────────────────────────────────────────────────────────┐
│  Banten                                                    │
│  ├── Merak (Pelabuhan Merak)                             │
│  ├── Cilegon (Industri & Laut)                           │
│  ├── Tanjung Lesung                                       │
│  └── Anyer                                               │
└─────────────────────────────────────────────────────────────┘
```

### Lampung
```
┌─────────────────────────────────────────────────────────────┐
│  Lampung                                                   │
│  ├── Bandarlampung (Pelabuhan)                           │
│  ├── Kalianda                                             │
│  ├── Krui                                                │
│  └── Pulau Pahawang                                      │
└─────────────────────────────────────────────────────────────┘
```

### Jawa Barat (West Java)
```
┌─────────────────────────────────────────────────────────────┐
│  Jawa Barat                                               │
│  ├── Cirebon (Pantai Utara)                              │
│  ├── Karimunjawa                                         │
│  ├── Pangandaran                                         │
│  ├── Ujung Genteng                                       │
│  └── Ciletuh                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 LOCATION HIERARCHY

```
Indonesia
└── Jawa
    ├── DKI Jakarta
    │   └── /lokasi/jakarta
    │       └── /lokasi/ancol
    │       └── /lokasi/muarabaru
    │
    ├── Banten
    │   └── /lokasi/banten
    │       └── /lokasi/merak
    │       └── /lokasi/cilegon
    │
    ├── Lampung
    │   └── /lokasi/lampung
    │       └── /lokasi/bandarlampung
    │       └── /lokasi/krui
    │
    └── Jawa Barat
        └── /lokasi/jawabarat
            └── /lokasi/karimunjawa
            └── /lokasi/pangandaran
```

---

## 🎯 FOCUS LOCATIONS FOR MVP

### Tier 1: Primary Markets (Launch First)
| Location | Priority | Boats Target |
|----------|----------|--------------|
| Ancol, Jakarta | 🔴 HIGH | 10+ boats |
| Muara Baru, Jakarta | 🔴 HIGH | 5+ boats |
| Merak, Cilegon | 🔴 HIGH | 5+ boats |

### Tier 2: Secondary Markets (Phase 2)
| Location | Priority | Boats Target |
|----------|----------|--------------|
| Karimunjawa, Jawa Barat | 🟡 MED | 5+ boats |
| Pangandaran, Jawa Barat | 🟡 MED | 3+ boats |
| Lampung (Bandarlampung) | 🟡 MED | 3+ boats |

### Tier 3: Future Markets (Phase 3)
| Location | Priority |
|----------|----------|
| Anyer, Banten | 🟢 LOW |
| Krui, Lampung | 🟢 LOW |
| Ujung Genteng, Jawa Barat | 🟢 LOW |

---

## 🏷️ LOCATION SLUGS (for URLs)

```
/lokasi/ancol              → Ancol, Jakarta
/lokasi/muarabaru         → Muara Baru, Jakarta
/lokasi/merak             → Merak, Banten
/lokasi/cilegon           → Cilegon, Banten
/lokasi/bandarlampung     → Bandarlampung, Lampung
/lokasi/krui              → Krui, Lampung
/lokasi/karimunjawa       → Karimunjawa, Jawa Barat
/lokasi/pangandaran       → Pangandaran, Jawa Barat
```

---

## 🐟 FISHING SPOTS PER LOCATION

### Ancol, Jakarta
```
Fishing Spots:
- Spot A: Baringin
- Spot B: Pulau Bidadari
- Spot C: Pulau Pramuka
- Spot D: Sundaland

Target Fish: Kakap, Kembung, Toman, Gabus
Best Season: Oktober - April
```

### Muara Baru, Jakarta
```
Fishing Spots:
- Spot A: Muara Sungai Ciliwung
- Spot B: Muara Sungai Angke
- Spot C: Pulau Kapuk

Target Fish: Kakap, Baronang, Kerapu
Best Season: November - Maret
```

### Merak, Banten
```
Fishing Spots:
- Spot A: Selat Sunda
- Spot B: Pulau Manuk
- Spot C: Gunung Anak Krakatau (distant)

Target Fish: Tuna, Cakalang, Kembung
Best Season: April - Oktober
```

### Karimunjawa, Jawa Barat
```
Fishing Spots:
- Spot A: Pulau Karimunjawa
- Spot B: Pulau Menjangan
- Spot C: Pulau Cemara
- Spot D: Spot Dalam

Target Fish: Kerapu, Kakap, Baracuda, GT
Best Season: Maret - November
```

---

## 📱 LOCATION-BASED FEATURES

### 1. Location Selector (Dropdown)
```
Pilih Lokasi Memancing:
────────────────────────
📍 Jakarta
   ├── Ancol
   ├── Muara Baru
   └── Sunda Kelapa

📍 Banten
   ├── Merak
   ├── Cilegon
   └── Anyer

📍 Lampung
   ├── Bandarlampung
   └── Krui

📍 Jawa Barat
   ├── Karimunjawa
   ├── Pangandaran
   └── Ujung Genteng
```

### 2. Home Page Location Cards
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│             │ │             │ │             │ │             │
│  🏙️ Jakarta│ │  🏖️ Banten │ │  🌴Lampung │ │ 🏝️ JawaBarat│
│             │ │             │ │             │ │             │
│  12 kapal   │ │  5 kapal    │ │  3 kapal    │ │  8 kapal    │


│             │ │             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 3. Nearby Locations (per current location)
```
┌─────────────────────────────────────────────────────────────┐
│  Spot Terdekat dari Ancol                                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Muara   │ │ Sunda   │ │Merak   │ │Karimu- │         │
│  │ Baru    │ │ Kelapa  │ │ Banten │ │ njawa   │         │
│  │ 15 km   │ │ 20 km   │ │ 80 km   │ │ 200 km  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 DATABASE STRUCTURE (Suggested)

```typescript
// Location Model
interface Location {
  id: string;           // "loc-ancol"
  name: string;         // "Ancol"
  slug: string;         // "ancol"
  region: string;       // "Jakarta"
  province: string;     // "DKI Jakarta"
  
  // Coordinates
  latitude: number;
  longitude: number;
  
  // Display
  image: string;        // Hero image URL
  description: string; // "Sono spot memancing..."
  
  // Stats
  boatCount: number;
  avgPrice: number;
  rating: number;
  
  // Fishing Info
  targetFish: string[];
  bestSeason: string;
  
  // Metadata
  isActive: boolean;
  sortOrder: number;
}
```

---

## 📁 API REQUIREMENTS

### GET /api/locations
```typescript
// Response
{
  data: Location[];
  byProvince: {
    "DKI Jakarta": Location[];
    "Banten": Location[];
    "Lampung": Location[];
    "Jawa Barat": Location[];
  };
}
```

### GET /api/locations/[slug]
```typescript
// Response
{
  location: Location;
  nearbyLocations: Location[];  // Sorted by distance
  popularSpots: string[];
  featuredBoats: Listing[];
  allBoats: Listing[];
}
```

---

## 🎯 MVP SCOPE FOR LOCATION PAGES

### Phase 1 (Launch): 4 Main Locations
1. `/lokasi/ancol` - Primary (highest traffic)
2. `/lokasi/muarabaru` - Jakarta secondary
3. `/lokasi/merak` - Banten primary
4. `/lokasi/karimunjawa` - Jawa Barat primary

### Phase 2: Expand
5. `/lokasi/bandarlampung` - Lampung
6. `/lokasi/pangandaran` - Jawa Barat secondary

### Phase 3: Complete
- All remaining locations
- Nearby fishing spots sub-pages

---

## 📊 STATISTICS (Target)

| Location | Target Boats | Target Bookings/Month |
|----------|-------------|----------------------|
| Ancol | 10 | 50 |
| Muara Baru | 5 | 20 |
| Merak | 5 | 15 |
| Karimunjawa | 8 | 40 |
| Others | 3-5 each | 10 each |

---

## 🎨 LOCATION PAGE DESIGN

### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🏙️ ANCOL, JAKARTA                             │
│                                                             │
│     Surga Memancing di Pintu Gerbang Ibukota               │
│                                                             │
│     📍 12 kapal    ⭐ 4.8    💰 Rp 2.5jt - 5jt           │
│                                                             │
│  [📅 Check-in] [📅 Check-out] [👤 Tamu] [🔍 Cari]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Location Card (Home Page)
```
┌─────────────────────────────────────────────────────────────┐
│  🏙️ Jakarta                                                │
│  12 kapal tersedia                                         │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│  │ Ancol   │ │ Muara   │ │ Sunda   │                        │
│  │         │ │ Baru    │ │ Kelapa  │                        │
│  │ 8 kapal │ │ 3 kapal │ │ 1 kapal │                        │
│  └─────────┘ └─────────┘ └─────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Location Data
- [ ] Create location seed data (4 provinces, 8+ locations)
- [ ] Add `region` and `province` to Listing schema
- [ ] Update listings with location data

### Components
- [ ] LocationCard.tsx
- [ ] LocationGrid.tsx
- [ ] LocationSelector.tsx
- [ ] NearbyLocations.tsx

### Pages
- [ ] `/lokasi/ancol` - Landing page
- [ ] `/lokasi/muarabaru` - Landing page
- [ ] `/lokasi/merak` - Landing page
- [ ] `/lokasi/karimunjawa` - Landing page
- [ ] `/lokasi/[slug]` - Dynamic template

### Features
- [ ] Location-based filtering on homepage
- [ ] Nearby locations per current location
- [ ] Distance calculation (optional)

---

## 📝 NOTES

1. **Jakarta** is the primary market - focus on Ancol and Muara Baru first
2. **Merak** benefits from Jakarta proximity (80km)
3. **Karimunjawa** is a premium destination - target weekend anglers
4. **Lampung** is underserved - opportunity for first-mover

---

**Document Version:** 1.0
**Status:** READY FOR IMPLEMENTATION
**Market Focus:** Jakarta, Banten, Lampung, Jawa Barat
