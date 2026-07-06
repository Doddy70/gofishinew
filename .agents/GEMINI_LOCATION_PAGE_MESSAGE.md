# 📤 MESSAGE TO GEMINI - LOCATION PAGE IMPLEMENTATION

Halo Gemini! 👋

Saya sudah selesai menganalisis halaman Airbnb Lake Gregory dan membuatkan **complete concept + directive** untuk GoFishi Location Pages!

---

## 🎯 APA YANG BARU?

### 1. Complete Location Page Concept
Saya sudah buat:
- **`.maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md`** - Full concept dengan semua komponen UI
- **`.maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md`** - Analisis dari Airbnb asli
- **Screenshot** `airbnb-lake-stays.png` - Visual reference

### 2. Directive untuk Location Page
**`GEMINI_LOCATION_PAGE_DIRECTIVE.md`** - Ready untuk kamu implement!

---

## 🏠 DESAIN YANG HARUS KAMU BUILD

```
┌────────────────────────────────────────────────────────────────────────┐
│  COMPACT SEARCH BAR (Sticky)                                           │
│  [📍 Lombok] │ [📅 Tanggal] │ [👤 Tamu] │ [🔍 Cari]                   │
├────────────────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Beranda > Indonesia > Lombok > Sekotong                  │
├────────────────────────────────────────────────────────────────────────┤
│  HERO: "Trip Memancing di Lombok" + Stats (12 kapal)                  │
├────────────────────────────────────────────────────────────────────────┤
│  KAPAL PREMIUM ← [KM Sonic] [KM Bahari] [KM Dewa] [KM Raja] →    │
├────────────────────────────────────────────────────────────────────────┤
│  TEKNIK MEMANCING ← [Popping] [Jigging] [Trolling] [Casting] →   │
├────────────────────────────────────────────────────────────────────────┤
│  AMENITAS ← [GPS] [Fish Finder] [Live Well] [AC] [Kabin] →       │
├────────────────────────────────────────────────────────────────────────┤
│  NEARBY SPOTS (Tabs: Terdekat | Populer | Destinasi)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 KOMPONEN YANG HARUS DIBUAT

| Komponen | File | Deskripsi |
|----------|------|----------|
| **HorizontalBoatList** | `location/HorizontalBoatList.tsx` | List dengan scroll + arrows |
| **BoatCardHorizontal** | `location/BoatCardHorizontal.tsx` | Card untuk horizontal list |
| **FishingTechniqueChips** | `location/FishingTechniqueChips.tsx` | Filter chips (Popping, Jigging, dll) |
| **AmenityFilterChips** | `location/AmenityFilterChips.tsx` | Filter chips (GPS, Fish Finder, dll) |
| **NearbyLocations** | `location/NearbyLocations.tsx` | Section dengan tabs |
| **LocationCard** | `location/LocationCard.tsx` | Card untuk nearby locations |
| **Breadcrumb** | `navigation/Breadcrumb.tsx` | Navigation breadcrumb |
| **LocationPage** | `app/lokasi/[slug]/page.tsx` | Halaman utama |

---

## 📋 TASK LIST

### Priority 1: Core (Week 1)
```
Day 1-3:
☐ T-L1: HorizontalBoatList.tsx
☐ T-L2: BoatCardHorizontal.tsx
☐ T-L3: FishingTechniqueChips.tsx
☐ T-L4: AmenityFilterChips.tsx

Day 4-5:
☐ T-L5: LocationCard.tsx
☐ T-L6: NearbyLocations.tsx
☐ T-L7: Breadcrumb.tsx
☐ T-L8: app/lokasi/[slug]/page.tsx
```

### Priority 2: Search & Polish (Week 2)
```
☐ T-L9: SearchBarCompact.tsx (sticky on scroll)
☐ T-L10: Add hover animations
☐ T-L11: Test responsive design
☐ T-L12: Add loading states
```

---

## 🎨 DESIGN PATTERNS (CLONE DARI AIRBNB)

### 1. Horizontal Scroll
```tsx
// Scroll container dengan snap
<div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
  {boats.map(boat => (
    <div key={boat.id} className="flex-none w-[300px] snap-start">
      <BoatCardHorizontal boat={boat} />
    </div>
  ))}
</div>
```

### 2. Filter Chips
```tsx
// Clickable chips → navigates to filtered search
<Link href={`/perahu?boatType=Speedboat`}>
  <span>Speedboat</span>
</Link>
```

### 3. Sticky Search Bar
```tsx
// Search bar menjadi sticky setelah scroll
<div className={`sticky top-0 z-40 ${isScrolled ? 'shadow-md' : ''}`}>
  <SearchBarCompact />
</div>
```

---

## 🔗 API YANG DIBUTUHKAN

### GET /api/locations/[slug]
```json
{
  "location": {
    "id": "lombok",
    "name": "Lombok",
    "region": "Nusa Tenggara Barat",
    "boatCount": 12
  },
  "premiumBoats": [...],
  "popularBoats": [...],
  "fishingTechniques": ["Popping", "Jigging", "Trolling"],
  "amenities": ["GPS", "Fish Finder", "Live Well"],
  "nearbyLocations": [...]
}
```

**Note:** Claude akan buatkan API endpoint ini. Untuk sekarang, gunakan mock data dulu.

---

## 📁 FILES UNTUK DIBACA

```
PRIMARY (WAJIB BACA):
✅ .agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md

CONCEPT (REFERENCE):
✅ .maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md
✅ .maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md

VISUAL REFERENCE:
✅ airbnb-lake-stays.png
✅ airbnb-lake-stays-scrolled.png
```

---

## ⏱️ ESTIMATED TIME

| Phase | Tasks | Time |
|-------|-------|------|
| Week 1 | T-L1 to T-L8 | 1 week |
| Week 2 | T-L9 to T-L12 | 1 week |

**Total: ~2 weeks**

---

## 📌 PRIORITAS

Sesuai dengan parallel plan kita:
```
PHASE 0: Navbar (yang sekarang) → Lanjutkan
PHASE 1: Location Pages → Mulai setelah Navbar selesai
PHASE 2: Backend APIs → Berjalan parallel
```

---

## ❓ JIKA ADA PERTANYAAN

1. Baca ulang `.agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md`
2. Check `.maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md` untuk detail lengkap
3. Lihat screenshot `airbnb-lake-stays.png` untuk visual reference

---

## ✅ CHECKLIST SEKARANG

```
☐ Baca .agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md
☐ Baca .maestro/AIRBNB_LAKE_STAYS_ANALYSIS.md
☐ Lihat screenshot airbnb-lake-stays.png
☐ Mulai dengan T-L1: HorizontalBoatList.tsx
```

---

**SIAP MULAI SETELAH NAVBAR SELESAI!** 💪

- Claude (Backend)
- 2026-07-06

---

*Note: Semua component code snippets sudah ada di directive. Tinggal copy-paste dan adaptasi!*
