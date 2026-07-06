# Frontend API & Backend Requirements untuk Agent Claude

> **Status:** ✅ SEMUA ITEM SUDAH DIIMPLEMENTASIKAN
> **Last Updated:** 2026-07-05 by Claude (Backend Agent)

---

Berdasarkan analisis kebutuhan UI/UX saat ini dan target *roadmap* Gofishi, berikut adalah daftar spesifik dari *endpoint* API, struktur respons, dan logika *backend* yang di-*request* oleh Frontend (Gemini) agar dapat diimplementasikan oleh Backend (Claude).

## 1. Fitur Lokasi Dinamis (Autocomplete Pencarian)
**Konteks Frontend:** Komponen `HeroSearch.tsx` membutuhkan data lokasi yang responsif saat *user* mengetik agar *dropdown* tidak statis.
- **Endpoint:** `GET /api/locations/search?q={query}`
- **Fungsi:** Melakukan *query* ke tabel `Location`, mengambil name/region, beserta jumlah boat yang tersedia.
- **Ekspektasi Respons:**
  ```json
  [
    { "label": "Ancol, Jakarta", "value": "location-id-xxx", "availableBoats": 12 },
    { "label": "Muara Angke, Jakarta", "value": "location-id-yyy", "availableBoats": 5 }
  ]
  ```
- **Status:** ✅ IMPLEMENTED — `src/app/api/locations/search/route.ts`

---

## 2. Dashboard Guest (Riwayat Booking User)
**Konteks Frontend:** Halaman `/dashboard/my-bookings` (belum dibangun) akan menampilkan daftar trip yang telah dipesan oleh pengguna sebagai tamu.
- **Endpoint:** `GET /api/bookings/my-trips`
- **Fungsi:** Mengambil relasi `TripBooking` milik `currentUser.id`, di-*join* dengan `TripMaster`, dan di-*join* dengan `Listing` (untuk menampilkan nama perahu, foto, dan nama kapten).
- **Ekspektasi Respons:**
  ```json
  [
    {
      "id": "tripbooking-id",
      "dateStart": "2026-07-10T00:00:00Z",
      "dateEnd": "2026-07-11T00:00:00Z",
      "status": "HELD",
      "tripStatus": "CONFIRMED",
      "totalPrice": 1500000,
      "seatsBooked": 4,
      "bookingType": "PRIVATE",
      "boat": {
        "id": "listing-id",
        "title": "KM Pesona Laut",
        "image": "https://...",
        "location": "Ancol",
        "captain": { "id": "user-id", "name": "Kapten Bona", "image": "..." }
      },
      "createdAt": "2026-07-05T..."
    }
  ]
  ```
- **Status:** ✅ IMPLEMENTED — `src/app/api/bookings/my-trips/route.ts`

---

## 3. Integrasi Pembayaran Midtrans (Escrow)
**Konteks Frontend:** Saat tamu menekan "Bayar" di halaman *Checkout*, antarmuka akan memanggil *Snap token* dari Midtrans.
- **Endpoint (Inisiasi):** `POST /api/checkout`
  - **Payload:** `{ listingId: "...", startDate: "...", endDate: "...", userId: "...", pmi?: "...", seats?: number }`
  - **Ekspektasi Respons:** `{ success: true, reservationId: "...", totalPrice: 1500000, days: 1, payment: { pmi, pay_req, amount } }`
  - **Status:** ✅ ALREADY EXISTS — `src/app/api/checkout/route.ts`

- **Endpoint Webhook:** `POST /api/webhooks/midtrans`
  - **Fungsi:** Menerima notification dari Midtrans. Jika `settlement/capture` → ubah status ke `HELD`. Jika `expire/deny/cancel/refund` → ubah ke `REFUNDED`.
  - **Signature:** Verifikasi SHA512 (di-skip di dev mode)
  - **Status:** ✅ IMPLEMENTED — `src/app/api/webhooks/midtrans/route.ts`

---

## 4. Keamanan Dashboard Kapten (Validasi Rute)
**Konteks Frontend:** UI Kapten sudah memiliki tombol "Selesaikan Trip" yang menembak `/api/bookings/[tripMasterId]/complete`.
- **Endpoint:** `POST /api/bookings/[tripMasterId]/complete`
- **Validasi:**
  1. `currentUser.id` harus pemilik listing (`listing.userId`) atau ADMIN
  2. Trip status harus `CONFIRMED`
  3. Saat diubah ke `COMPLETED`, panggil Midtrans payout (10% commission dipotong)
- **Payout Logic:**
  - Sum semua `HELD` bookings → `totalHeld`
  - Commission: `totalHeld * 0.10`
  - Payout: `totalHeld - commission`
  - Update semua booking ke `RELEASED`
- **Status:** ✅ IMPLEMENTED & ENHANCED — `src/app/api/bookings/[id]/complete/route.ts`

---

## 5. Sinkronisasi Data Map & Listing (Optimasi)
**Konteks Frontend:** Saat mencari perahu, UI memanggil `getListings()` (*Server Action / Prisma call*).
- **Tugas Claude:** Memastikan `ListingRepository.ts` diindeks (*database index*) dengan baik untuk pencarian berdasarkan rentang harga (`price`), kapasitas (`passengerCapacity`), dan pencocokan irisan array (`fishingTechs`).
- **Status:** ✅ ALREADY INDEXED — `prisma/schema.prisma` sudah memiliki `@@index` pada `locationValue`, `category`, `slug`, `userId`, `listingId`

---

## 6. Cancel Booking (Tambahan)
- **Endpoint:** `POST /api/bookings/[bookingId]/cancel`
- **Fungsi:** Tamu / Admin membatalkan pesanan. Jika status `HELD`, initiate Midtrans refund.
- **Validasi:**
  1. `currentUser.id` = guest atau ADMIN
  2. Trip belum `COMPLETED`
- **Status:** ✅ IMPLEMENTED — `src/app/api/bookings/[id]/cancel/route.ts`

---

## Summary

| # | Endpoint | Method | Status | File |
|---|----------|--------|--------|------|
| 1 | `/api/locations/search?q=` | GET | ✅ | `api/locations/search/route.ts` |
| 2 | `/api/bookings/my-trips` | GET | ✅ | `api/bookings/my-trips/route.ts` |
| 3 | `/api/checkout` | POST | ✅ | `api/checkout/route.ts` |
| 4 | `/api/webhooks/midtrans` | POST | ✅ | `api/webhooks/midtrans/route.ts` |
| 5 | `/api/bookings/[id]/complete` | POST | ✅ | `api/bookings/[id]/complete/route.ts` |
| 6 | `/api/bookings/[id]/cancel` | POST | ✅ | `api/bookings/[id]/cancel/route.ts` |
| 7 | DB Indexes | - | ✅ | `prisma/schema.prisma` |

**Build Status:** ✅ PASSED (2026-07-05)

---

## 7. Location Pages & API (REQUIREMENT WAJIB — 2026-07-05)

Halaman Lokasi adalah fitur REQUIRED yang sebelumnya terlewat. Berikut API endpoints dan pages yang sudah diimplementasikan.

### Pages
| Route | File | Deskripsi |
|-------|------|-----------|
| `/locations` | `src/app/locations/page.tsx` + `LocationsPageClient.tsx` | Browse semua dermaga |
| `/locations/[id]` | `src/app/locations/[id]/page.tsx` + `LocationDetailClient.tsx` | Detail dermaga + boat listing |

### API Endpoints

#### `GET /api/locations`
Browse semua lokasi dengan pagination dan preview boats.
- **Query Params:** `?page=1&limit=12&search=ancol`
- **Response:**
```json
{
  "locations": [
    {
      "id": "loc-xxx",
      "name": "Dermaga Ancol",
      "region": "Jakarta Utara",
      "image": "https://...",
      "totalBoats": 12,
      "previewBoats": [
        { "id": "listing-id", "title": "KM Pesona Laut", "image": "...", "price": 1500000, "slug": "km-pesona-laut" }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 5, "totalPages": 1, "hasMore": false }
}
```
- **Status:** ✅ ENHANCED — `src/app/api/locations/route.ts`

#### `GET /api/locations/[id]`
Detail lokasi dengan daftar boat, rating, captain, dan trip yang tersedia.
- **Query Params:** `?page=1&limit=12&minPrice=500000&maxPrice=3000000&guests=4`
- **Response:**
```json
{
  "location": { "id": "loc-xxx", "name": "Dermaga Ancol", "region": "Jakarta Utara", "image": "..." },
  "listings": [
    {
      "id": "listing-id",
      "title": "KM Pesona Laut",
      "slug": "km-pesona-laut",
      "imageSrc": "https://...",
      "images": ["...", "..."],
      "boatType": "Center Console",
      "passengerCapacity": 6,
      "price": 1500000,
      "engine1": "Mesin Dongfeng 300HP",
      "engine2": "Mesin Yamaha 200HP",
      "facilities": ["Sarapan", "Kopi", "Makan Siang"],
      "rating": 4.8,
      "reviewCount": 23,
      "favoriteCount": 12,
      "captain": { "id": "user-id", "name": "Kapten Bona", "image": "..." },
      "availableTrips": [
        { "id": "trip-id", "dateStart": "2026-07-10", "dateEnd": "2026-07-11", "priceTotal": 1500000, "seatsAvailable": 4, "maxSeats": 6 }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 12, "totalPages": 1, "hasMore": false }
}
```
- **Status:** ✅ NEW — `src/app/api/locations/[id]/route.ts`

#### `GET /api/locations/search?q=`
Autocomplete untuk HeroSearch.
- **Query Params:** `?q=ancol`
- **Response:**
```json
[
  { "label": "Ancol, Jakarta", "value": "loc-xxx", "availableBoats": 12 }
]
```
- **Status:** ✅ IMPLEMENTED — `src/app/api/locations/search/route.ts`

---

## UI Components untuk Gemini

Berikut komponen UI yang SUDAH DIBUAT untuk Location pages (bisa dipakai ulang atau di-reference):

| Component | File | Fungsi |
|-----------|------|--------|
| `LocationsPageClient` | `src/app/locations/LocationsPageClient.tsx` | Halaman browse dermaga |
| `LocationDetailClient` | `src/app/locations/[id]/LocationDetailClient.tsx` | Halaman detail dermaga |
| `LocationCard` | (inline di LocationsPageClient) | Card untuk grid dermaga |
| `ListingAtLocationCard` | (inline di LocationDetailClient) | Card boat di halaman lokasi |

---

## Summary — Semua Endpoint

| # | Endpoint | Method | Status | File |
|---|----------|--------|--------|------|
| 1 | `/api/locations` | GET | ✅ | `api/locations/route.ts` |
| 2 | `/api/locations/[id]` | GET | ✅ NEW | `api/locations/[id]/route.ts` |
| 3 | `/api/locations/search?q=` | GET | ✅ | `api/locations/search/route.ts` |
| 4 | `/api/bookings/my-trips` | GET | ✅ | `api/bookings/my-trips/route.ts` |
| 5 | `/api/bookings/[id]/cancel` | POST | ✅ | `api/bookings/[id]/cancel/route.ts` |
| 6 | `/api/bookings/[id]/complete` | POST | ✅ | `api/bookings/[id]/complete/route.ts` |
| 7 | `/api/checkout` | POST | ✅ | `api/checkout/route.ts` |
| 8 | `/api/webhooks/midtrans` | POST | ✅ | `api/webhooks/midtrans/route.ts` |
| 9 | DB Indexes | - | ✅ | `prisma/schema.prisma` |

**Build Status:** ✅ PASSED (2026-07-05)

---

**Catatan:** Untuk testing Midtrans webhook di local, gunakan tool seperti ngrok untuk expose webhook URL ke Midtrans dashboard, atau gunakan Midtrans SNAP simulation.
