# Agent Handoff Protocol

## Current State
- [x] Phase 2: Boat Search UI & Filters (Gemini)
- [x] Phase 4: Cleanup & Checkout Refactor (Gemini/Claude) - *Dynamic booking hybrid approach approved*
- [x] Phase 4: Captain Dashboard (Gemini) - *Built with /complete trigger*
- [x] Phase 5: Search & Filter API (Claude) - **NEW** Airbnb-style endpoints implemented
- [x] Phase 5: Gap Analysis (Claude) - Audit GEMINI_HANDOFF_KAPTEN_CHANGES.md
- [x] Phase 5: Navbar Directive (Claude) - **NEW** Directive for Gemini consistency
- [ ] Phase 5: Navbar Implementation (Gemini) - Following directive
- [ ] Phase 5: Schema Migration (T-01) - Missing fields
- [ ] Phase 5: Calendar & Pricing APIs (T-02 to T-05) - Backend
- [ ] Phase 5: Pusher Chat (T-06 to T-08) - Gemini
- [ ] Phase 5: Midtrans Sandbox & E2E (Claude)

## Last Action
- **Claude (Backend):**
  - **[2026-07-06]** Mengimplementasikan `GET /api/listings/search` - Advanced Search API dengan cross-filtering.
  - **[2026-07-06]** Mengimplementasikan `GET /api/listings/filters` - Metadata API untuk filter dinamis.
  - **[2026-07-06]** Audit `GEMINI_HANDOFF_KAPTEN_CHANGES.md` - Found 35% completion, created comprehensive implementation workflow.
  - **[2026-07-06]** Buat `GEMINI_NAVBAR_DIRECTIVE.md` - Direction untuk Gemini konsisten mengkloning navbar Airbnb.

- **Gemini (Frontend):**
  - **[Wait]** Navbar Implementation - Following directive `GEMINI_NAVBAR_DIRECTIVE.md`
  - Standarisasi Navbar UI (shrink scroll logic, search pill).
  - Ekstraksi `CheckoutPriceBreakdown.tsx` dari `BookingCard.tsx`.
  - Membuat ulang `dashboard/reservations/ReservationClient.tsx`.
  - Mengkloning UI/UX Airbnb untuk Halaman Detail Perahu (`ListingDetailClient.tsx`).
  - Menerapkan Kapsul Pencarian (Pill Search) di Navbar Mobile dan Menu Navigasi Bawah (BottomNav) ala Airbnb.

## Next Steps / Requirement Implementation Chain

### IMMEDIATE (Gemini):
1. **Navbar Directive** - Baca `.agents/GEMINI_NAVBAR_DIRECTIVE.md` untuk implementasi konsisten
2. **Filter Integration** - Hubungkan HeroSearch ke `/api/locations/search`, `/perahu` ke `/api/listings/search`

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
