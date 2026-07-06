# 🔀 PARALLEL IMPLEMENTATION PLAN
## GoFishi - Claude & Gemini Multi-Agent Workflow

**Date:** 2026-07-06
**Last Updated:** 2026-07-06 (Added Location Pages + Jakarta Market Focus)
**Purpose:** Enable parallel implementation by Claude & Gemini agents

---

## 🗺️ MARKET FOCUS

**GoFishi is a Saltwater Fishing Platform operating in:**

| Province | Locations (Saltwater) | Priority |
|----------|----------------------|----------|
| Jakarta 🌊 | Ancol Marina, Kepulauan Seribu, Sunda Kelapa | 🔴 HIGH |
| Banten 🌊 | Merak, Cilegon, Anyer | 🔴 HIGH |
| Lampung 🌊 | Bandarlampung, Krui, Pahawang | 🟡 MED |
| Jawa Barat 🌊 | Karimunjawa, Pangandaran, Cirebon | 🟡 MED |

### Jakarta Research - Saltwater Fishing Spots
```
├── Ancol Marina (Hero: Pulau Bidadari) - GT, Kakap, Kembung
├── Kepulauan Seribu (Pramuka, Kelapa) - Tuna, GT, Kerapu
└── Sunda Kelapa (Muara Angke) - Kakap, Baronang
```

---

## 📊 UPDATED DEPENDENCY ANALYSIS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPENDENCY GRAPH (UPDATED)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ════════════════════════════════════════════════════════════════════    │
│  PHASE 0: NAVBAR (GEMINI - Priority)                                    │
│  ════════════════════════════════════════════════════════════════════    │
│                                                                         │
│  T-N1: HeroSearch → API          ┐                                      │
│  T-N2: /perahu → Filter API     ├─► TRACK A (GEMINI)                  │
│  T-N3: FilterPills → Dynamic     │    (Navbar Implementation)           │
│  T-N4: MobileSearchModal         │                                      │
│                                  │                                      │
│  ════════════════════════════════════════════════════════════════════    │
│  PHASE 1: BACKEND CORE (CLAUDE)                                         │
│  ════════════════════════════════════════════════════════════════════    │
│                                                                         │
│  T-01: Schema Migration                                                │
│         │                                                              │
│         ├──────────────────┐                                           │
│         ▼                  ▼                                           │
│  T-02: Pricing API    T-03: Calendar API                               │
│         │                  │                                           │
│         │             ┌────┴────┐                                      │
│         │             ▼         ▼                                      │
│         │        T-04: Blocked  T-05: Price Overrides               │
│         │         Dates          CRUD                                  │
│                                                                         │
│  ════════════════════════════════════════════════════════════════════    │
│  PHASE 2: LOCATION PAGES (GEMINI)                                      │
│  ════════════════════════════════════════════════════════════════════    │
│                                                                         │
│  T-L1 to T-L12: Location Page Components                             │
│  - HorizontalBoatList, BoatCardHorizontal                            │
│  - FishingTechniqueChips, AmenityFilterChips                         │
│  - NearbyLocations, LocationCard, Breadcrumb                           │
│                                                                         │
│  ════════════════════════════════════════════════════════════════════    │
│  PHASE 3: REAL-TIME (GEMINI - Independent)                             │
│  ════════════════════════════════════════════════════════════════════    │
│                                                                         │
│  T-06: Pusher Auth API ──┐                                             │
│  T-07: useChatPusher ────┼──► T-08: ChatWindow.tsx                   │
│  T-09: TransactionSchema ─┤                                            │
│  T-10: Transactions API ─┘                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 TRACK ALLOCATION (UPDATED)

### Phase 0: Navbar Implementation (GEMINI) ⚡ PRIORITY
**Focus:** Airbnb-style navbar dengan Filter API integration

| Task | Description | Dependencies | Status |
|------|-------------|--------------|--------|
| T-N1 | HeroSearch → `/api/locations/search` | API Ready | ✅ Done |
| T-N2 | /perahu → `/api/listings/search` | API Ready | ✅ Done |
| T-N3 | FilterPills → `/api/listings/filters` | API Ready | ✅ Done |
| T-N4 | MobileSearchModal (full implementation) | T-N1 | ✅ Done |

### Track A: Backend Core (CLAUDE)
**Focus:** Database schema, pricing, calendar APIs

| Task | Description | Dependencies | Status |
|------|-------------|--------------|--------|
| T-01 | Schema: Add weekendPrice, holidayPrice, targetFish, tackleInventory, meetingPoint | None | ⬜ Pending |
| T-02 | API: GET /api/pricing/calculate | T-01 | ⬜ Pending |
| T-03 | API: GET /api/listings/[id]/calendar | T-01 | ⬜ Pending |
| T-04 | API: blocked-dates CRUD | T-01 | ⬜ Pending |
| T-05 | API: price-overrides CRUD | T-01 | ⬜ Pending |

### Phase 2: Location Pages (GEMINI) 🆕 NEW
**Focus:** Airbnb-style location pages for GoFishi market (Jakarta saltwater)

| Task | Description | Dependencies | Status |
|------|-------------|--------------|--------|
| T-L1 | Create `HorizontalBoatList.tsx` | None | ⬜ Pending |
| T-L2 | Create `BoatCardHorizontal.tsx` | T-L1 | ⬜ Pending |
| T-L3 | Create `FishingTechniqueChips.tsx` | None | ⬜ Pending |
| T-L4 | Create `AmenityFilterChips.tsx` | None | ⬜ Pending |
| T-L5 | Create `LocationCard.tsx` | None | ⬜ Pending |
| T-L6 | Create `NearbyLocations.tsx` | T-L5 | ⬜ Pending |
| T-L7 | Create `Breadcrumb.tsx` | None | ⬜ Pending |
| T-L8 | Create `app/lokasi/[slug]/page.tsx` | T-L1 to T-L7 | ⬜ Pending |

### Track B: Real-time & Transactions (GEMINI)
**Focus:** Chat, notifications, earnings (Independent track)

| Task | Description | Dependencies | Status |
|------|-------------|--------------|--------|
| T-06 | API: POST /api/pusher/auth | None | ⬜ Pending |
| T-07 | Hook: src/hooks/useChatPusher.ts | T-06 | ⬜ Pending |
| T-08 | Component: src/components/chat/ChatWindow.tsx | T-06, T-07 | ⬜ Pending |
| T-09 | Schema: Add TransactionHistory model | None | ⬜ Pending |
| T-10 | API: GET /api/captain/transactions | T-09 | ⬜ Pending |

---

## 🏠 NAVBAR IMPLEMENTATION (T-N1 to T-N4)

### Reference Documents
| Document | Purpose |
|----------|---------|
| `.agents/GEMINI_NAVBAR_DIRECTIVE.md` | Primary implementation guide |
| `.maestro/AIRBNB_NAVIGATION_ANALYSIS.md` | Airbnb UI analysis |
| `airbnb-desktop-homepage.png` | Screenshot reference |
| `airbnb-desktop-search.png` | Screenshot reference |

### Design Reference: Airbnb Patterns

#### Desktop Homepage Header
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
│  [Populer] [Seni & budaya] [Pantai] [Pegulauan] [Alam terbuka] [...] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Header
```
┌────────────────────────────────────┐
│  ┌──────┐                    [👤] │
│  │ Airbnb│    ┌──────────────┐    │
│  └──────┘    │ 🔍 Mulai     │    │
│              │    pencarian │    │
│              └──────────────┘    │
│  ──────────────────────────────── │
│  [🏠]    [🔍]    [❤️]    [👤]   │
└────────────────────────────────────┘
```

### Component Checklist

#### Desktop Components
- [x] **Search Bar (3-field pill)** - Location + Dates + Guests
- [x] **Filter Chips** - Dynamic from `/api/listings/filters`
- [x] **Category Tabs** - Populer, Beach, Mountain, etc
- [x] **Map Price Pills** - Floating price markers
- [x] **Scroll Animation** - Hide/show navbar on scroll

#### Mobile Components
- [x] **Top Search Pill** - Tappable, opens modal
- [x] **MobileSearchModal** - Full-screen with framer-motion
- [x] **Bottom Nav** - 4 tabs (Home, Search, Favorites, Profile)
- [x] **Quick Filter Chips** - Horizontal scroll

---

## 🗺️ LOCATION PAGE IMPLEMENTATION (T-L1 to T-L8)

### Reference Documents
| Document | Purpose |
|----------|---------|
| `.agents/GEMINI_LOCATION_PAGE_DIRECTIVE.md` | Primary implementation guide |
| `.maestro/GOFISHI_LOCATION_PAGE_CONCEPT.md` | Full concept |
| `.maestro/GOFISHI_MARKET_LOCATIONS.md` | Market locations (Jakarta saltwater) |
| `airbnb-lake-stays.png` | Airbnb reference screenshot |

### MVP Location Pages (Build First)
```
1. /lokasi/ancol - Ancol Marina (Primary)
2. /lokasi/kepulauan-seribu - Thousand Islands (Premium)
3. /lokasi/sunda-kelapa - Sunda Kelapa (Urban)
4. /lokasi/merak - Merak, Banten
```

### Component Order
```
Week 1:
- T-L1: HorizontalBoatList.tsx
- T-L2: BoatCardHorizontal.tsx
- T-L3: FishingTechniqueChips.tsx
- T-L4: AmenityFilterChips.tsx

Week 2:
- T-L5: LocationCard.tsx
- T-L6: NearbyLocations.tsx
- T-L7: Breadcrumb.tsx
- T-L8: app/lokasi/[slug]/page.tsx
```

---

## 📋 IMPLEMENTATION ORDER

### PHASE 0: Gemini starts NOW (Navbar Priority)

```
1. T-N1: HeroSearch → /api/locations/search
   └── File: src/components/home/HeroSearch.tsx
   └── Connect location autocomplete to API
   
2. T-N2: /perahu → /api/listings/search
   └── File: src/app/perahu/page.tsx or src/components/listings/Listings.tsx
   └── Replace old endpoint with Filter API
   
3. T-N3: FilterPills → /api/listings/filters
   └── File: src/components/search/FilterPills.tsx (CREATE)
   └── Fetch metadata from API, render dynamic chips
   
4. T-N4: MobileSearchModal
   └── File: src/modals/MobileSearchModal.tsx (CREATE)
   └── Full-screen search modal with animations
```

### PHASE 1: Claude (After Gemini confirms Navbar done)

```
1. T-01: Schema Migration
   └── Add fields to prisma/schema.prisma
   └── npx prisma db push
   └── npx prisma generate
   └── Commit: "feat: Add dynamic pricing fields to schema"
   
2. T-02: Pricing API
   └── src/app/api/pricing/calculate/route.ts
   └── Commit: "feat: Add pricing calculation API"
   
3. T-03, T-04, T-05: Calendar APIs
   └── src/app/api/listings/[id]/calendar/route.ts
   └── src/app/api/listings/[id]/blocked-dates/route.ts
   └── src/app/api/listings/[id]/price-overrides/route.ts
   └── Commit: "feat: Add calendar management APIs"
```

### PHASE 2: Gemini (Location Pages - After Navbar)

```
1. T-L1: HorizontalBoatList.tsx
   └── src/components/location/HorizontalBoatList.tsx
   
2. T-L2 to T-L4: BoatCard + Chips
   └── T-L3: FishingTechniqueChips.tsx
   └── T-L4: AmenityFilterChips.tsx
   
3. T-L5 to T-L8: Location Page Structure
   └── T-L7: Breadcrumb.tsx
   └── T-L8: app/lokasi/[slug]/page.tsx
```

### PHASE 3: Gemini (Parallel with Phase 1)

```
1. T-06: Pusher Auth API
   └── src/app/api/pusher/auth/route.ts
   └── Commit: "feat: Add Pusher authentication"
   
2. T-07: Chat Hook
   └── src/hooks/useChatPusher.ts
   
3. T-09: TransactionHistory Schema (after Claude confirms T-01)
   └── Add to prisma/schema.prisma
   └── npx prisma db push
   
4. T-08, T-10: ChatWindow + Transactions API
   └── Commit: "feat: Add chat and transaction APIs"
```

---

## 🔗 HANDOFF PROTOCOL

### After T-N1 to T-N4 (Navbar) Complete

```
GEMINI → CLAUDE:
"Navbar implementation complete. Filter API integrated.
Ready for Calendar API integration (Track A)."
```

### After T-01 (Schema) Complete

```
CLAUDE → GEMINI:
"Schema updated. New fields available:
- weekendPrice: Int?
- holidayPrice: Int?
- targetFish: String[]
- tackleInventory: String?
- meetingPoint: String?

Prisma migrated. Gemini can now add TransactionHistory model."
```

### After Track A Complete

```
CLAUDE → GEMINI:
"Track A complete. APIs ready:
- GET /api/pricing/calculate
- GET /api/listings/[id]/calendar
- POST /api/listings/[id]/blocked-dates
- POST /api/listings/[id]/price-overrides

Frontend integration can now proceed."
```

---

## 📁 FILE PATHS (CLEAR BOUNDARIES)

### PHASE 0 - GEMINI (Navbar):
```
src/
├── components/
│   ├── home/
│   │   └── HeroSearch.tsx              ← T-N1 (Modify)
│   ├── search/
│   │   └── FilterPills.tsx            ← T-N3 (CREATE)
│   ├── navbar/
│   │   ├── Navbar.tsx                 ← T-N1 to T-N4 (Modify)
│   │   └── BottomNav.tsx               ← Already done
│   └── listings/
│       ├── Listings.tsx                ← T-N2 (Modify)
│       └── ListingsMap.tsx              ← T-N3 (Add price pills)
├── app/
│   └── perahu/
│       └── page.tsx                    ← T-N2 (Modify)
└── modals/
    └── MobileSearchModal.tsx           ← T-N4 (CREATE)
```

### TRACK A - CLAUDE (Backend):
```
src/app/api/
├── pricing/
│   └── calculate/route.ts              ← T-02
├── listings/[listingId]/
│   ├── calendar/route.ts                ← T-03
│   ├── blocked-dates/                   ← T-04
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── price-overrides/                 ← T-05
│       ├── route.ts
│       └── [id]/route.ts
prisma/schema.prisma                     ← T-01
```

### TRACK B - GEMINI (Chat):
```
src/
├── app/api/
│   ├── pusher/
│   │   └── auth/route.ts               ← T-06
│   ├── chat/
│   │   ├── conversations/route.ts
│   │   ├── [id]/messages/route.ts
│   │   ├── typing/route.ts
│   │   └── read/route.ts
│   └── captain/
│       └── transactions/route.ts        ← T-10
├── hooks/
│   └── useChatPusher.ts                ← T-07
└── components/chat/
    └── ChatWindow.tsx                  ← T-08
```

---

## ✅ VERIFICATION CHECKLIST

### PHASE 0 - GEMINI (Navbar):
- [x] T-N1: HeroSearch fetches from `/api/locations/search`
- [x] T-N2: /perahu page uses `/api/listings/search`
- [x] T-N3: FilterPills renders from `/api/listings/filters`
- [x] T-N4: MobileSearchModal opens with animations
- [x] Desktop: Search bar, filter chips, scroll behavior work
- [x] Mobile: Bottom nav, search modal, quick filters work
- [x] HANDOFF_PROTOCOL.md updated

### TRACK A - CLAUDE:
- [ ] T-01: Schema has all new fields
- [ ] T-01: `npx prisma db push` successful
- [ ] T-01: `npx prisma generate` successful
- [ ] T-02: GET /api/pricing/calculate works
- [ ] T-03: GET /api/listings/[id]/calendar works
- [ ] T-04: POST/DELETE blocked-dates works
- [ ] T-05: POST/DELETE price-overrides works
- [ ] HANDOFF_PROTOCOL.md updated

### TRACK B - GEMINI:
- [ ] T-06: Pusher auth works
- [ ] T-07: useChatPusher connects
- [ ] T-08: ChatWindow renders
- [ ] T-09: TransactionHistory model exists
- [ ] T-10: GET /api/captain/transactions works
- [ ] HANDOFF_PROTOCOL.md updated

---

## 📊 PARALLEL EXECUTION TIMELINE (UPDATED)

```
PHASE 0 (Navbar - Gemini)         PHASE 1 (Backend - Claude)
──────────────                    ────────────────
HOUR 0-2                          HOUR 0+
┌─────────────────────┐           ┌─────────────────────┐
│ T-N1: HeroSearch    │           │ T-01: Schema       │
│ T-N2: /perahu API   │──────────►│ (Wait for Gemini)   │
│ T-N3: FilterPills   │           └─────────────────────┘
│ T-N4: MobileModal   │                        │
└─────────────────────┘                        │
                                               ├────────────────►
PHASE 2 (Chat - Gemini)                        │ T-02 to T-05
───────────────                                 │ Calendar APIs
HOUR 0+                                        │
┌─────────────────────┐                        │
│ T-06: Pusher Auth   │                        │
│ T-07: useChatPusher │──────┐                  │
│ T-09: Trans Schema   │      │                  │
│ T-08, T-10: APIs    │◄─────┘                  │
└─────────────────────┘                        │
                                               
───────────────────────────────────────────────────────────────────
Estimated Total Time (All Phases, Parallel): ~6 hours
Estimated Total Time (Sequential): ~12 hours
Speed Improvement: 50% faster
```

---

## 🚨 CONFLICT RESOLUTION

If both agents touch the same file:
```
1. First commit wins
2. Second agent must rebase
3. If conflict, CLAUDE (Backend) has priority on schema
4. Consult user for resolution
```

---

## 📞 COMMUNICATION

### Agent-to-Agent Messages Format
```json
{
  "from": "gemini",
  "to": "claude",
  "type": "handoff",
  "phase": "0",
  "tasks": ["T-N1", "T-N2", "T-N3", "T-N4"],
  "status": "complete",
  "message": "Navbar implementation complete. Filter API integrated.",
  "timestamp": "2026-07-06T14:00:00Z"
}
```

---

## 📊 TASK SUMMARY

| Phase | Task | Owner | Status | Priority |
|-------|------|-------|--------|----------|
| 0 | T-N1: HeroSearch API | Gemini | ✅ | 🔴 HIGH |
| 0 | T-N2: /perahu API | Gemini | ✅ | 🔴 HIGH |
| 0 | T-N3: FilterPills | Gemini | ✅ | 🔴 HIGH |
| 0 | T-N4: MobileSearchModal | Gemini | ✅ | 🔴 HIGH |
| 1 | T-01: Schema Migration | Claude | ⬜ | 🔴 HIGH |
| 1 | T-02: Pricing API | Claude | ⬜ | 🔴 HIGH |
| 1 | T-03: Calendar API | Claude | ⬜ | 🔴 HIGH |
| 1 | T-04: Blocked Dates | Claude | ⬜ | 🔴 HIGH |
| 1 | T-05: Price Overrides | Claude | ⬜ | 🔴 HIGH |
| 2 | T-L1: HorizontalBoatList | Gemini | ⬜ | 🔴 HIGH |
| 2 | T-L2: BoatCardHorizontal | Gemini | ⬜ | 🔴 HIGH |
| 2 | T-L3: FishingTechniqueChips | Gemini | ⬜ | 🔴 HIGH |
| 2 | T-L4: AmenityFilterChips | Gemini | ⬜ | 🔴 HIGH |
| 2 | T-L5: LocationCard | Gemini | ⬜ | 🟡 MED |
| 2 | T-L6: NearbyLocations | Gemini | ⬜ | 🟡 MED |
| 2 | T-L7: Breadcrumb | Gemini | ⬜ | 🟡 MED |
| 2 | T-L8: Location Page | Gemini | ⬜ | 🟡 MED |
| 3 | T-06: Pusher Auth | Gemini | ⬜ | 🟡 MED |
| 3 | T-07: useChatPusher | Gemini | ⬜ | 🟡 MED |
| 3 | T-08: ChatWindow | Gemini | ⬜ | 🟡 MED |
| 3 | T-09: Trans. Schema | Gemini | ⬜ | 🟢 LOW |
| 3 | T-10: Transactions API | Gemini | ⬜ | 🟢 LOW |

---

**Document Version:** 3.0 (Updated with Location Pages + Jakarta Market)
**Status:** READY FOR PARALLEL EXECUTION
**Agents:** CLAUDE (Track A) + GEMINI (Phase 0, 2, 3)
**Priority:** PHASE 0 (Navbar) → PHASE 1 (Backend) → PHASE 2 (Location) → PHASE 3 (Chat)
