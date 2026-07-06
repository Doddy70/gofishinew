# 📤 MESSAGE TO GEMINI - BACKEND READY, START LOCATION PAGES!

Halo Gemini! 👋

**GOOD NEWS!** Saya sudah selesai implementasi BACKEND untuk Location Pages!

---

## ✅ YANG SUDAH SELESAI (Backend - Claude)

### Schema Migration (T-01) ✅
```prisma
// Listing - NEW fields
weekendPrice, holidayPrice, targetFish[], tackleInventory, meetingPoint

// TripMaster - NEW fields
slotType (MORNING_STRIKE, HALF_DAY, FULL_DAY, OVERNIGHT)
meetingTime, returnTime, area
priceOverride, priceOverrideType, priceOverrideLabel

// NEW Models
PriceOverride - Date-specific pricing
TransactionHistory - Captain payouts
```

### APIs Ready (T-02 to T-05) ✅

| API | Endpoint | Status |
|-----|----------|--------|
| Pricing | `GET /api/pricing/calculate` | ✅ Ready |
| Calendar | `GET /api/listings/[id]/calendar` | ✅ Ready |
| Blocked Dates | `POST/DELETE /api/listings/[id]/blocked-dates` | ✅ Ready |
| Price Overrides | `POST/DELETE /api/listings/[id]/price-overrides` | ✅ Ready |
| Locations | `GET /api/locations/[slug]` | ✅ **READY!** |

---

## 🎯 SEKARANG GIMANA CARA MULAI

### 1. Baca Directive
```
BACA: .agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md
```

### 2. Pahami API yang Sudah Siap
```bash
# Test Location API
GET /api/locations/ancol
GET /api/locations/kepulauan-seribu
GET /api/locations/sunda-kelapa

# Response includes:
{
  location: { name, region, boatCount, avgPrice },
  premiumBoats: [...],
  popularBoats: [...],
  fishingTechniques: [...],
  amenities: [...],
  nearbyLocations: [...]
}
```

### 3. Mulai Component

**T-L1: HorizontalBoatList.tsx**
```tsx
// File: src/components/location/HorizontalBoatList.tsx
// Pattern: Airbnb-style horizontal scroll dengan arrows
```

### 4. Market Focus (Ingat!)
```
Jakarta Saltwater Fishing:
- /lokasi/ancol - Ancol Marina (PRIMARY)
- /lokasi/kepulauan-seribu - Thousand Islands
- /lokasi/sunda-kelapa - Sunda Kelapa
```

---

## 📋 TASK LIST (T-L1 to T-L8)

```
Week 1 (T-L1 to T-L4):
☐ T-L1: HorizontalBoatList.tsx
☐ T-L2: BoatCardHorizontal.tsx
☐ T-L3: FishingTechniqueChips.tsx
☐ T-L4: AmenityFilterChips.tsx

Week 2 (T-L5 to T-L8):
☐ T-L5: LocationCard.tsx
☐ T-L6: NearbyLocations.tsx
☐ T-L7: Breadcrumb.tsx
☐ T-L8: app/lokasi/[slug]/page.tsx
```

---

## 🎨 DESIGN PATTERN

```
┌─────────────────────────────────────────────────────────────┐
│  COMPACT SEARCH BAR (Sticky)                               │
│  [📍 Ancol] │ [📅 Tanggal] │ [👤 Tamu] │ [🔍 Cari]  │
├─────────────────────────────────────────────────────────────┤
│  HERO: "Trip Memancing di Ancol Marina" + Stats          │
├─────────────────────────────────────────────────────────────┤
│  KAPAL PREMIUM ← [KM Sonic] [KM Bahari] [KM Dewa] →   │
├─────────────────────────────────────────────────────────────┤
│  TEKNIK ← [Popping] [Jigging] [Casting] →             │
├─────────────────────────────────────────────────────────────┤
│  SPOT ← [Pulau Bidadari] [Sundaland] [Pramuka] →      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 FILES UNTUK DIBACA

```
✅ .agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md (PRIMARY)
✅ .maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md (CONCEPT)
✅ .maestro/GOFISHI_MARKET_LOCATIONS.md (MARKET)
✅ .maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md (REFERENCE)
✅ airbnb-lake-stays.png (SCREENSHOT)
```

---

## 🔗 API CONNECTION

```tsx
// Example: Fetch location data
const res = await fetch('/api/locations/ancol');
const { location, premiumBoats, fishingTechniques } = await res.json();

// premiumBoats sudah include: id, slug, title, imageSrc, price, rating, etc.
```

---

## ⏱️ ESTIMATED TIME

| Week | Tasks | Time |
|------|-------|------|
| Week 1 | T-L1 to T-L4 | 2-3 days |
| Week 2 | T-L5 to T-L8 | 2-3 days |

**Total: ~1 week**

---

## 💪 SEKETIKA MULAI!

Kamu sekarang punya:
- ✅ Directive lengkap dengan code snippets
- ✅ API yang siap di-consume
- ✅ Screenshots Airbnb untuk visual reference
- ✅ Market focus (Jakarta saltwater)
- ✅ Component specs yang jelas

**Mulai dari T-L1: HorizontalBoatList.tsx**

---

*Claude (Backend)*
*2026-07-06*
*Ready for Gemini! 🚀*
