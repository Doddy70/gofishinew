# Gofishi.com — Saltwater Angler Marketplace

<img width="1280" height="480" alt="Gofishi" src="https://github.com/user-attachments/assets/78f8179f-60b4-4b30-9c09-5ef84c6123d0" />

**Gofishi** adalah platform marketplace untuk penyewaan perahu memancing (charter boat) dan perlengkapan Saltwater Angler. Bermitra dengan lebih dari 30 kapten berlisensi di Jakarta, platform ini menghubungkan pemancing dengan anfitrion lokal.

---

## Spesialisasi

- **Jasa Pemandu:** Bermitra dengan lebih dari 30 kapten berlisensi untuk memandu perjalanan memancing (charter).
- **Produk:** Menjual berbagai perlengkapan seperti joran, gulungan (reels), pakaian, topi, tas, dan aksesori dari merek-merek ternama.
- **Lokasi:** Operasi utama di Jakarta dan sekitarnya.

---

## Peran & Fitur

### User (Penyewa)
- Cari dan filter perahu berdasarkan lokasi, tanggal, harga, dan jumlah tamu
- Booking dan bayar online
- Cancel booking
- Beri ulasan dan rating bintang setelah transaksi selesai
- Chat dengan Kapten/Host
- Lihat riwayat booking dan trip

### Host / Kapten
- Upload foto perahu (maksimal 10 foto, maks 1 MB per foto)
- Atur harga sewa (harian, 2 hari, 3 hari)
- Atur tanggal ketersediaan (kalender real-time)
- Set titik lokasi perahu via Google Maps
- Terima atau tolak booking
- Menjawab chat dari user
- Memberikan tanggapan atas review user

### Admin
- Kelola user dan listing (approve / reject / suspend)
- Monitoring transaksi dan escrow
- Moderasi konten dan ulasan
- Naikkan status user menjadi Vendor/Host
- Laporan jadwal, booking, payment (daily, weekly, monthly, custom range)

---

## Alur Sewa

Penyewaan berbasis **harian** dengan alur:
1. User pilih tanggal dan lokasi dermaga
2. Deposit / tanda jadi saat booking
3. Pelunasan H- sebelum keberangkatan
4. Pembatalan: H- tertentu → hangus; cuaca buruk → reschedule

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions & API Routes, Prisma ORM |
| Database | PostgreSQL |
| Auth | Clerk Authentication (Email & Google OAuth) |
| Payment | Midtrans (escrow), Qris, Transfer Bank |
| Storage | Cloudinary (image uploads) |
| Maps | Google Maps API |
| Deployment | Vercel |

---

## User Roles & Credentials (Development)

```
Admin:    admin@gofishi.com   / gofishi123
Captain:  budi@gofishi.com    / gofishi123
User:     guest@gofishi.com   / gofishi123
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Fill in: DATABASE_URL, CLERK keys, MIDTRANS keys, CLOUDINARY keys

# 3. Push Prisma schema
npx prisma db push

# 4. Start dev server
npm run dev
```

---

## API Endpoints

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/auth/[...all]` | * | Clerk authentication |
| `/api/listings` | GET, POST | Listing CRUD |
| `/api/listings/[id]` | GET, PATCH, DELETE | Single listing |
| `/api/reservations` | POST | Buat reservasi |
| `/api/reservations/[id]` | GET, PATCH, DELETE | Manage reservasi |
| `/api/checkout` | POST | Checkout + Midtrans |
| `/api/favorites/[listingId]` | GET, POST | Favorites |
| `/api/settings/profile` | PATCH | Update profile |
| `/api/users/[userId]` | GET | User profile |
| `/api/locations` | GET | Lokasi/dermaga |
| `/api/weather` | GET | Weather API |
| `/api/dashboard/calendar/block` | POST | Block dates |
| `/api/dashboard/fishing-log` | GET, POST | Fishing log |
| `/api/admin/verify` | POST | Admin verification |
| `/api/admin/verification/[id]` | GET, PATCH | Verification detail |
| `/api/admin/taxonomy/[type]` | * | Taxonomy CRUD |
| `/api/admin/finance/commission/[userId]` | GET | Commission calc |

---

## Database Models

```
User · Listing · Reservation · Payment · Review
Favorite · Category · Location · TaxSetting
CommissionRate · FishingLog
```

---

## Development

```bash
# Run type check
npm run typecheck

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

---

## License

MIT
