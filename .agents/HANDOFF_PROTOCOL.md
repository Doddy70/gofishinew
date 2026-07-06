# Agent Handoff Protocol

## Current State
- [x] Phase 2: Boat Search UI & Filters (Gemini)
- [x] Phase 4: Cleanup & Checkout Refactor (Gemini/Claude) - *Dynamic booking hybrid approach approved*
- [x] Phase 4: Captain Dashboard (Gemini) - *Built with /complete trigger*
- [x] Phase 5: Search & Filter API (Claude) - **NEW** Airbnb-style endpoints implemented
- [x] Phase 5: Gap Analysis (Claude) - Audit GEMINI_HANDOFF_KAPTEN_CHANGES.md
- [x] Phase 5: Navbar Directive (Claude) - **NEW** Directive for Gemini consistency
- [x] Phase 5: Navbar Implementation (Gemini) - Following directive
- [x] Phase 5: Location Page Directive (Claude) - **NEW** Jakarta saltwater locations
- [x] Phase 5: Schema Migration (T-01) - **NEW** weekendPrice, holidayPrice, targetFish, etc.
- [x] Phase 5: Calendar & Pricing APIs (T-02 to T-05) - **NEW** All backend APIs complete
- [ ] Phase 5: Location Pages (T-L1 to T-L8) - Gemini
- [ ] Phase 5: Pusher Chat (T-06 to T-10) - Gemini
- [ ] Phase 5: Midtrans Sandbox & E2E (Claude)

## Last Action
- **Claude (Backend):**
  - **[2026-07-06]** Schema Migration (T-01): Added weekendPrice, holidayPrice, targetFish, tackleInventory, meetingPoint, slotType, PriceOverride, TransactionHistory
  - **[2026-07-06]** API: GET /api/pricing/calculate (T-02) - Dynamic pricing with weekend/holiday/override
  - **[2026-07-06]** API: GET /api/listings/[id]/calendar (T-03) - Calendar with tripMasters, blockedDates, priceOverrides
  - **[2026-07-06]** API: POST/DELETE blocked-dates CRUD (T-04)
  - **[2026-07-06]** API: POST/DELETE price-overrides CRUD (T-05)
  - **[2026-07-06]** API: GET /api/locations/[slug] - Location page API for Jakarta saltwater
  - **[2026-07-06]** Research Jakarta saltwater fishing spots - Ancol Marina, Kepulauan Seribu, Sunda Kelapa.

- **Gemini (Frontend):**
  - **[2026-07-06]** Navbar Implementation - Terapkan directive `GEMINI_NAVBAR_DIRECTIVE.md`. Menyempurnakan layout `/perahu` di desktop (Sticky Map flush edges, layout constraints h-auto, penyesuaian padding top).
  - **[2026-07-06]** Memperbarui tampilan Navbar Mobile khusus `/perahu` menjadi format Search Pill + circular Filter Icon ala Airbnb.
  - Ekstraksi `CheckoutPriceBreakdown.tsx` dari `BookingCard.tsx`.
  - Membuat ulang `dashboard/reservations/ReservationClient.tsx`.
  - Mengkloning UI/UX Airbnb untuk Halaman Detail Perahu (`ListingDetailClient.tsx`).
  - Menerapkan Kapsul Pencarian (Pill Search) di Navbar Mobile dan Menu Navigasi Bawah (BottomNav) ala Airbnb.

## Next Steps / Requirement Implementation Chain

### IMMEDIATE (Gemini / Claude):
1. **Filter Modal Implementation (Gemini)** - Buat UI `SearchFilterModal.tsx` yang menggunakan `api/listings/filters` dan terhubung dengan filter button di Navbar mobile & desktop.
2. **Schema Migration (Claude)** - (T-01) weekendPrice, holidayPrice, dll.

### BACKLOG (Parallel Tracks):

**Track A - Claude (Backend):**
1. Schema Migration (T-01) - weekendPrice, holidayPrice, targetFish, tackleInventory, meetingPoint
2. Pricing API (T-02) - GET /api/pricing/calculate
3. Calendar APIs (T-03, T-04, T-05) - blocked-dates, price-overrides

**Track B - Gemini (Frontend):**
1. Pusher Chat (T-06, T-07, T-08) - useChatPusher + ChatWindow
2. Transaction History UI (T-10)

**Shared:**
- Midtrans Sandbox E2E
- Guest Dashboard
