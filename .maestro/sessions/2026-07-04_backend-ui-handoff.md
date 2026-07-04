# 📋 CONSOLIDATED IMPLEMENTATION HANDOFF
## GoFishi.com - Backend to UI/UX (Gemini)

**Document Version:** 1.0
**Date:** 2026-07-04
**Prepared by:** Claude Code (Backend Agent)
**For:** Gemini Agent (UI/UX Implementation)

---

## 📌 EXECUTIVE SUMMARY

Dokumen ini mengkonsolidasikan SEMUA perubahan backend yang perlu diketahui oleh agent UI/UX untuk implementasi yang selaras.

### Changes Overview

| Category | Changes | Impact on UI |
|----------|---------|---------------|
| **Authentication** | better-auth → Clerk | Login flow berubah |
| **API Security** | Zod validation + Auth | Error handling pattern baru |
| **Payment Flow** | Checkout API unified | Request/response format |
| **Data Models** | Schema unchanged | Types remain same |
| **Webhooks** | Clerk webhook created | User sync |

---

## 1. AUTHENTICATION - CLERK INTEGRATION

### What Changed
- **Before:** better-auth (custom modal-based login)
- **After:** Clerk (modal-based with Clerk components)

### New Login Flow
```
User clicks "Masuk"
    ↓
Clerk SignInButton (modal popup)
    ↓
Clerk handles auth (email/password, Google OAuth)
    ↓
Session cookie set automatically
    ↓
useAuth() hook returns session
    ↓
UI updates (user avatar, menu)
```

### UI Components to Use

```tsx
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

// Check auth status
const { isSignedIn, userId } = useAuth();

// Sign In Button (triggers modal)
<SignInButton mode="modal">
  <button>Masuk</button>
</SignInButton>

// User Avatar + Menu
<UserButton afterSignOutUrl="/" />
```

### Auth States in UI

| State | UI Action |
|-------|-----------|
| `isSignedIn = true` | Show UserButton, enable booking |
| `isSignedIn = false` | Show SignInButton modal trigger |
| Loading | Show skeleton/placeholder |

### Clerk Components Available
- `SignInButton` - Trigger sign-in modal
- `SignUpButton` - Trigger sign-up modal  
- `UserButton` - User avatar dropdown
- `useAuth()` - Hook for auth state

### Sign-in/Sign-up Pages
- `/sign-in` - Clerk hosted sign-in page
- `/sign-up` - Clerk hosted sign-up page

### Logout
- UserButton includes logout by default
- After sign out → redirects to `afterSignOutUrl="/"`

---

## 2. API ENDPOINTS - CHANGES & PATTERNS

### Authentication Pattern (All Protected APIs)

```typescript
// Every protected API follows this pattern:
const currentUser = await getCurrentUser();
if (!currentUser) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**UI Implication:** All API calls will fail with 401 if not logged in. Show login modal on 401.

### Error Response Format

All APIs now return consistent error format:

```typescript
// Validation Error (400)
{ error: "Validation failed", details: { field: ["error message"] } }

// Auth Error (401)
{ error: "Unauthorized - Silakan login terlebih dahulu" }

// Forbidden Error (403)
{ error: "Forbidden - Anda bukan pemilik listing ini" }

// Not Found (404)
{ error: "Listing not found" }

// Conflict (409)
{ error: "Tanggal sudah dipesan" }

// Server Error (500)
{ error: "Internal server error" }
```

### Key API Changes

#### Checkout API

**Endpoint:** `POST /api/checkout`

**Request Body:**
```typescript
{
  listingId: string,       // Required
  startDate: string,        // ISO date string
  endDate: string,          // ISO date string
  userId: string,           // Clerk user ID (get from useAuth)
  pmi?: string,            // "fiat-qris-midtrans" (default)
  bookingType?: "PRIVATE" | "SHARING",
  seats?: number            // For SHARING trips only
}
```

**Response:**
```typescript
{
  success: true,
  reservationId: string,
  totalPrice: number,
  days: number,
  payment: {
    redirectUrl?: string,  // Midtrans payment URL
    // ... other payment details
  }
}
```

**UI Flow:**
1. User selects dates
2. Click "Pesan Sekarang"
3. `userId` from `useAuth()` → send to API
4. API returns `payment.redirectUrl`
5. Redirect user to Midtrans payment page
6. After payment → webhook updates status → user notified

#### Reservations API

**Endpoints:**
- `GET /api/reservations` - Get user's bookings
- `DELETE /api/reservations/[id]` - Cancel booking
- `PATCH /api/reservations/[id]` - Update booking (captain/admin only)

**GET Response:**
```typescript
[
  {
    id: string,
    seatsBooked: number,
    totalAmount: number,
    paymentStatus: "PENDING" | "HELD" | "RELEASED" | "REFUNDED",
    createdAt: string,
    tripMaster: {
      dateStart: string,
      dateEnd: string,
      bookingType: "PRIVATE" | "SHARING",
      status: "SEARCHING" | "CONFIRMED" | "FULL" | "CANCELLED" | "COMPLETED",
      listing: {
        id: string,
        title: string,
        imageSrc: string,
        locationValue: string,
        user: {
          id: string,
          name: string,
          image: string
        }
      }
    }
  }
]
```

**Payment Status Flow:**
```
PENDING → (payment success webhook) → HELD → (trip complete) → RELEASED
                ↓
            (refund) → REFUNDED
```

#### Calendar Block API

**Endpoint:** `POST /api/dashboard/calendar/block`

**Request:**
```typescript
{
  listingId: string,
  date: string,    // "2026-07-15"
  reason?: string   // "Maintenance", "Private Use", "Bad Weather"
}
```

**UI should show:**
- Blocked dates in red
- User's blocks with delete option
- Reason tooltip on hover

#### Fishing Log API

**Endpoint:** `POST /api/dashboard/fishing-log`

**Request:**
```typescript
{
  imageSrc: string,     // Cloudinary URL
  description?: string,
  listingId: string
}
```

---

## 3. BOOKING CARD COMPONENT

### Current State

The `BookingCard.tsx` has been updated to use Clerk:

```tsx
import { useAuth } from "@clerk/nextjs";

function BookingCard() {
  const { userId } = useAuth();
  const isDisabledForKapten = userId === hostId;
  
  const onReserve = async () => {
    if (!userId) {
      toast("Masuk untuk memesan!");
      return;
    }
    
    const response = await axios.post("/api/checkout", {
      listingId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userId: userId,  // From Clerk
      pmi: "fiat-qris-midtrans",
      bookingType,
      seats: bookingType === "SHARING" ? seats : undefined
    });
    
    if (response.data.payment?.redirectUrl) {
      window.location.href = response.data.payment.redirectUrl;
    }
  };
}
```

### Props Expected

```typescript
interface BookingCardProps {
  pricePerNight: number;
  listingId: string;
  hostId: string;           // Captain's Clerk user ID
  reservations: {           // Booked dates to disable
    startDate: string;
    endDate: string;
  }[];
  weekendPrice?: number | null;
  holidayPrice?: number | null;
  captainPhone?: string | null;
}
```

---

## 4. PAYMENT STATUS DISPLAY

### Status Badge Colors (Recommended)

| Status | Badge Color | Label |
|--------|-------------|-------|
| `PENDING` | Yellow/Orange | Menunggu Pembayaran |
| `HELD` | Blue | Pembayaran Diterima |
| `RELEASED` | Green | Selesai |
| `REFUNDED` | Gray | Dana Dikembalikan |

### Trip Status Display

| Status | Badge Color | Label |
|--------|-------------|-------|
| `SEARCHING` | Yellow | Mencari Trip |
| `CONFIRMED` | Green | Trip Dikonfirmasi |
| `FULL` | Blue | Kapasitas Penuh |
| `CANCELLED` | Red | Dibatalkan |
| `COMPLETED` | Green | Trip Selesai |

---

## 5. NAVIGATION STRUCTURE

### Protected Routes (Require Login)

```
/dashboard/*       → Captain Dashboard
/admin/*          → Admin Panel
/reservations      → User Reservations
/favorites         → User Favorites
```

### Public Routes

```
/                   → Homepage (listing browse)
/perahu             → Listing archive
/listings/[id]     → Listing detail
/sign-in            → Sign in page
/sign-up            → Sign up page
/checkout/[id]      → Checkout page
```

### Navigation Flow

```tsx
// Mobile Menu Structure
- Beranda
- Jelajahi
- Dashboard (logged in only)
- Trip Saya (logged in only)
- -----
- Daftarkan Perahu (logged in only)
- Favorit (logged in only)
- Pengaturan (logged in only)
- -----
- Masuk / Daftar (logged out)
- Keluar (logged in)
```

---

## 6. DATA TYPES REFERENCE

### User Role Types

```typescript
type UserRole = "GUEST" | "HOST" | "ADMIN";

type HostStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
```

### Booking Types

```typescript
type BookingType = "PRIVATE" | "SHARING";

type PaymentStatus = "PENDING" | "HELD" | "RELEASED" | "REFUNDED";

type TripStatus = "SEARCHING" | "CONFIRMED" | "FULL" | "CANCELLED" | "COMPLETED";
```

### Listing Status

```typescript
type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
```

---

## 7. IMPORTANT UI NOTES

### 1. User ID = Clerk User ID

The `user.id` in database IS the Clerk user ID. When comparing ownership:

```tsx
const { userId } = useAuth();
const isOwner = listing.userId === userId;
```

### 2. Captain Phone for WhatsApp

Display captain's WhatsApp contact for inquiries:

```tsx
// From listing data
listing.captainPhone
// Format for WhatsApp link
`https://wa.me/${captainPhone?.replace(/\D/g, '')}`
```

### 3. Date Formatting

Use Indonesian locale:

```tsx
import { format } from "date-fns";
import { id } from "date-fns/locale";

format(new Date(date), "dd MMMM yyyy", { locale: id })
// Output: "15 Juli 2026"
```

### 4. Price Formatting (IDR)

```tsx
price.toLocaleString('id-ID')
// Output: "1.500.000"
```

### 5. Loading States

Always show loading states for:
- Booking submission
- Reservation cancellation
- Calendar block/unblock

### 6. Error Handling

```tsx
try {
  await axios.post("/api/checkout", data);
  toast.success("Pemesanan berhasil!");
} catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.error || "Gagal memesan");
  }
}
```

---

## 8. FILES REFERENCE

### Components Changed (Backend → UI)

| File | Changes | UI Impact |
|------|---------|-----------|
| `Navbar.tsx` | Clerk auth integration | Login/logout flow |
| `BookingCard.tsx` | Clerk useAuth() | Checkout flow |
| `LoginModal.tsx` | Deprecated | Can be removed |
| `RegisterModal.tsx` | Deprecated | Can be removed |

### API Routes (For Reference)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/checkout` | POST | ✅ | Create booking + payment |
| `/api/reservations` | GET, POST | ✅ | List/create reservations |
| `/api/reservations/[id]` | PATCH, DELETE | ✅ | Update/cancel |
| `/api/dashboard/calendar/block` | POST, DELETE | ✅ | Block dates |
| `/api/dashboard/fishing-log` | POST | ✅ | Add catch photo |
| `/api/favorites/[listingId]` | POST, DELETE | ✅ | Toggle favorite |

---

## 9. KNOWN ISSUES / WORKAROUNDS

### 1. Payment Webhook Not Connected

**Issue:** Midtrans webhook endpoint exists but not verified with Midtrans.

**Workaround:** For testing, manually update payment status via Admin panel.

### 2. Notifications In-Memory Only

**Issue:** Notifications stored in memory, lost on server restart.

**Workaround:** Use Admin panel to see booking notifications.

### 3. No Email/WhatsApp Notifications Yet

**Issue:** Notifications not sent automatically.

**Workaround:** Manual communication via WhatsApp links.

---

## 10. TESTING CHECKLIST

### Auth Flow
- [ ] Sign up via Clerk
- [ ] Sign in via email/password
- [ ] Sign in via Google
- [ ] Sign out
- [ ] Protected routes redirect to login

### Booking Flow
- [ ] Select dates on calendar
- [ ] Click "Pesan Sekarang"
- [ ] Redirect to payment
- [ ] View reservation in "Trip Saya"
- [ ] Cancel reservation

### Captain Flow
- [ ] View calendar
- [ ] Block/unblock dates
- [ ] Add fishing log photo
- [ ] View reservations

### Admin Flow
- [ ] View dashboard
- [ ] Approve/reject captain
- [ ] View all users
- [ ] Commission settings

---

## 11. CONTACT & SUPPORT

- **Backend Issues:** Check server logs in `/logs` or `server.log`
- **Auth Issues:** Run `clerk doctor` for diagnostics
- **Payment Issues:** Check Midtrans dashboard
- **Database:** Neon PostgreSQL dashboard

---

**Document Status:** COMPLETE
**Ready for:** UI/UX Implementation
**Last Updated:** 2026-07-04

---

*End of Handoff Document*

---

## 12. SLUG-BASED URLS (NEW)

### URL Structure

| Route | URL Format | Example |
|-------|-----------|---------|
| Listing Archive | `/perahu` | `/perahu` |
| Listing Detail (NEW) | `/perahu/[slug]` | `/perahu/km-pesona-laut-ancol-cmr5o9al` |
| Listing Detail (OLD) | `/listings/[id]` | `/listings/cmr5o9al60006hvvdzze1pjwp` |

### Hybrid Support

Both URL formats work for backwards compatibility:
- `/perahu/[slug]` - New SEO-friendly URL
- `/listings/[id]` - Old ID-based URL (still works)

### Slug Format

```
[title-slugified]-[id-suffix]
Example: km-pesona-laut-ancol-cmr5o9al
```

### Slug Generation Function

```typescript
// src/lib/slug.ts
function generateUniqueSlug(text: string, idSuffix: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base.slice(0, 92)}-${idSuffix.slice(-8)}`;
}
```

### Frontend Components to Update

When linking to listing detail, use:

```tsx
// Use slug for listing links
const detailUrl = listing.slug
  ? `/perahu/${listing.slug}`
  : `/listings/${listing.id}`;

// Example in ListingCard.tsx
<Link href={`/perahu/${listing.slug}`}>
  View Detail
</Link>

// Or with router.push
router.push(listing.slug ? `/perahu/${listing.slug}` : `/listings/${listing.id}`);
```

### Listing Type Update

```typescript
// src/types/listing.ts
interface Listing {
  id: string;
  slug: string;  // NEW - URL-friendly identifier
  title: string;
  // ... other fields
}
```

### API Changes

| Endpoint | Change |
|----------|--------|
| `GET /api/listings/[id]` | Now accepts slug in params |
| `POST /api/listings` | Auto-generates slug on create |
| `PATCH /api/listings/[id]` | Auto-updates slug if title changes |

### Migration Endpoint

For existing listings without slug, call:
```bash
POST /api/admin/migrate-slugs
```

---


---

## 13. TEST CREDENTIALS (Clerk Users)

### Test Accounts Created

| Role | Email | Password | Clerk ID |
|------|-------|----------|----------|
| Admin | admin@gofishi.com | Gofishi123 | user_3G2S5nNNsi4c6Vmdogcrz1DZDNT |
| Captain | budi@gofishi.com | Gofishi123 | user_3G2S7DPvQiUowuzDxyIfE23KnDU |
| Guest | guest@gofishi.com | Gofishi123 | user_3G2S9Wkcb7ubwJln7YWvpQoJGeu |

### Sync to Database

Call this endpoint to sync Clerk users to database:

```bash
POST /api/admin/sync-clerk-users
```

### User Roles in Database

| Email | Database Role | Host Status |
|-------|--------------|-------------|
| admin@gofishi.com | ADMIN | - |
| budi@gofishi.com | HOST | APPROVED |
| guest@gofishi.com | GUEST | NONE |

### Login URL

```bash
http://localhost:3010/sign-in
```

### Sync Status Check

```bash
GET /api/admin/sync-clerk-users
```

*Document Version: 1.0*
