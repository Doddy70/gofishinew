# API Handoff: Authentication & Role Management

## Business Context
Sistem ini menangani pendaftaran pengguna, masuk (login), dan manajemen peran (Role) untuk platform GoFishi. Sistem membedakan antara Tamu (Guest), Kapten (Host), dan Admin. Admin memiliki wewenang penuh untuk mengubah peran pengguna lain dan memverifikasi pendaftaran Kapten baru.

## Endpoints

### POST /api/auth/sign-up/email
- **Purpose**: Mendaftarkan akun baru.
- **Auth**: public
- **Request**:
  ```json
  {
    "name": "string — Minimal 2 karakter",
    "email": "string — Format email valid",
    "password": "string — Minimal 6 karakter"
  }
  ```
- **Response** (success):
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "GUEST"
    },
    "session": { ... }
  }
  ```
- **Response** (error): 400 Bad Request (Validation failure), 409 Conflict (Email already exists).

### POST /api/auth/sign-in/email
- **Purpose**: Masuk ke akun yang sudah ada.
- **Auth**: public
- **Request**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response** (success): Redirect ke `/dashboard` atau `/two-factor` jika 2FA aktif.
- **Response** (error): 401 Unauthorized (Invalid credentials).

### PATCH /api/users/[userId]
- **Purpose**: Mengubah role pengguna (misal: GUEST ke HOST).
- **Auth**: ADMIN only
- **Request**:
  ```json
  {
    "role": "ADMIN | HOST | GUEST"
  }
  ```
- **Response** (success): User object yang telah diperbarui.
- **Response** (error): 401 Unauthorized, 403 Forbidden.

### PATCH /api/reservations/[reservationId]
- **Purpose**: Menyetujui atau menolak pesanan perahu.
- **Auth**: Host (pemilik perahu) atau Admin
- **Request**:
  ```json
  {
    "status": "APPROVED | REJECTED"
  }
  ```
- **Response** (success): Reservation object yang telah diperbarui.

## Data Models / DTOs

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'HOST' | 'GUEST';
  emailVerified: boolean;
  image?: string;
}

interface Reservation {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalPrice: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}
```

## Enums & Constants

| Value | Meaning | Role Access |
|-------|---------|-------------|
| `GUEST` | Pengguna biasa (Penyewa) | Browse, Book |
| `HOST` | Kapten/Pemilik Perahu | Manage Boats, Manage Bookings |
| `ADMIN` | Pengelola Platform | Manage All Users & Boats |

## Validation Rules
- **Login/Register**: Menggunakan **Zod schema** (`src/lib/validations/auth.ts`).
- **Middleware**: Memproteksi rute `/dashboard` dan `/admin`. User tanpa session akan dialihkan ke `/`.

## Business Logic & Edge Cases
- **Auto-Upgrade**: Admin bisa mengubah role siapapun di panel `/admin/users`.
- **Redirect**: Setelah login/register berhasil, sistem secara otomatis mengarahkan user ke `/dashboard`.
- **2FA Support**: Jika 2FA aktif, user diarahkan ke `/two-factor` sebelum bisa mengakses dashboard.

## Integration Notes
- **Recommended flow**: Gunakan `authClient` dari `@/lib/auth-client` untuk interaksi sisi klien.
- **Middleware**: Terletak di `src/middleware.ts`, mengelola pengecekan session di sisi server sebelum halaman dirender.

## Test Scenarios
1. **Happy path**: Login dengan admin@gofishi.com -> Direct ke /dashboard.
2. **Validation error**: Input email tanpa '@' -> Muncul pesan "Format email tidak valid".
3. **Permission denied**: User GUEST mencoba akses /admin -> Otomatis dialihkan ke /dashboard.
