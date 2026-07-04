# Handoff: Clerk Authentication Migration

**Date:** 2026-07-04
**Status:** Clerk Auth Integrated, Better-Auth Removed
**Prepared by:** Claude Code (claude-sonnet-5)

---

## Summary

Project GoFishi berhasil migrasi dari **better-auth** ke **Clerk Authentication**. Setup lengkap dengan Next.js App Router integration.

---

## What Was Done

### 1. Clerk Setup ✅

| Task | Status |
|------|--------|
| Install Clerk CLI v1.5.0 | ✅ Done |
| Login dengan nurruslan13@gmail.com | ✅ Done |
| Initialize Clerk di project | ✅ Done |
| App ID: `app_3G2FHJhST6oS9PyIk40aVMxrcZ6` | ✅ Linked |

### 2. Files Created

```
src/proxy.ts                          # Clerk middleware
src/app/sign-in/[[...sign-in]]/page.tsx  # Sign-in page
src/app/sign-up/[[...sign-up]]/page.tsx  # Sign-up page
```

### 3. Files Modified

| File | Changes |
|------|---------|
| `middleware.ts` | Replaced better-auth with Clerk middleware |
| `src/app/layout.tsx` | Already has ClerkProvider |
| `src/components/navbar/Navbar.tsx` | Uses Clerk `useAuth()`, `SignInButton`, `UserButton` |
| `src/server-actions/getCurrentUser.ts` | Migrated to Clerk auth |
| `src/components/listings/BookingCard.tsx` | Migrated to Clerk auth |
| `.env` | Added Clerk env vars, fixed port to 3010 |

### 4. Environment Variables (Development)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dWx0aW1hdGUtdHVuYS02NC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_HxoHR7jxk8rCWe0oTHrqPbN1w8xBvAMJiDnnECT5vb
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Fixed Port (Server runs on 3010)
NEXT_PUBLIC_BASE_URL="http://localhost:3010"
BETTER_AUTH_URL="http://localhost:3010"
```

---

## Current Auth Architecture

### Authentication Flow

```
User clicks "Masuk" (Navbar)
    ↓
Clerk SignInButton (modal)
    ↓
Clerk handles auth (email/password, Google OAuth)
    ↓
Session cookie set by Clerk
    ↓
useAuth() / auth() returns user session
    ↓
Protected routes via middleware.ts
```

### Key Hooks & Components

| Component | Usage |
|-----------|-------|
| `useAuth()` | Hook untuk cek status login di client |
| `SignInButton` | Tombol untuk trigger sign-in modal |
| `SignUpButton` | Tombol untuk trigger sign-up modal |
| `UserButton` | Avatar user dropdown dengan menu |
| `auth()` | Server-side auth check |
| `clerkClient()` | Clerk backend API client |

### Middleware Protection (middleware.ts)

```typescript
// Public routes: /sign-in, /sign-up
// Protected routes: /dashboard/*, /admin/*, /reservations/*, /favorites/*

// Role-based protection done in server actions (not middleware)
```

---

## Clerk Instance Configuration

**Instance ID (Development):** `ins_3G2FHFjlN5sbyKCw3cBO2WktSRR`

### Features Enabled

| Feature | Status |
|---------|--------|
| Password Auth | ✅ Enabled |
| Google OAuth | ✅ Enabled (client ID/secret configured) |
| Email Sign-up | ✅ Required |
| Bot Protection | ✅ Smart CAPTCHA |
| 2FA (TOTP) | ❌ Disabled |

### Social Providers

| Provider | Status | Notes |
|----------|--------|-------|
| Google | ✅ Enabled | `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` set |
| Apple | ❌ Disabled | |
| GitHub | ❌ Disabled | |

---

## For Gemini Agent - What to Know

### 1. Auth Status Check (Client Component)

```typescript
import { useAuth } from "@clerk/nextjs";

function MyComponent() {
  const { isSignedIn, userId } = useAuth();

  if (isSignedIn) {
    return <p>User ID: {userId}</p>;
  }
  return <p>Not logged in</p>;
}
```

### 2. Auth Status Check (Server Component)

```typescript
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

async function MyServerComponent() {
  const { userId } = await auth();

  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    return <p>Hello, {user.firstName}!</p>;
  }
  return <p>Not logged in</p>;
}
```

### 3. Get User ID for Database Operations

```typescript
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function createListing() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Create listing with userId
  const listing = await prisma.listing.create({
    data: {
      userId, // This is Clerk user ID
      // ... other fields
    }
  });

  return listing;
}
```

### 4. Clerk User ID vs Database User ID

**Important:** Clerk user ID IS used as the database user ID in this project.

```typescript
// prisma.schema - User model uses Clerk's user ID as primary key
model User {
  id    String @id  // This is Clerk's userId
  // ...
}
```

When a new user signs up via Clerk, the `getCurrentUser()` function auto-creates the user in database:

```typescript
// src/server-actions/getCurrentUser.ts
if (!user) {
  user = await prisma.user.create({
    data: {
      id: userId,        // Clerk's userId
      email,             // From Clerk
      name,              // From Clerk
      image,             // From Clerk
      // Default values
      role: "GUEST",
      hostStatus: "NONE",
      emailVerified: true,
    }
  });
}
```

---

## Files Still Using Better-Auth (Need Cleanup)

The following files still have better-auth imports that should be removed:

```bash
src/lib/auth.ts                      # Remove - better-auth server config
src/lib/auth-client.ts              # Remove - better-auth client
src/app/api/auth/[...all]/route.ts  # Remove - better-auth API route
```

### Deprecated Files to Delete

1. `src/lib/auth.ts` - Better-auth server config
2. `src/lib/auth-client.ts` - Better-auth client
3. `src/app/api/auth/[...all]/route.ts` - Better-auth API routes

### Deprecated Environment Variables

```env
# These can be removed after cleanup:
BETTER_AUTH_SECRET="super-secret-better-auth-key-change-me-later"
BETTER_AUTH_URL="http://localhost:3010"
BETTER_AUTH_LOG_LEVEL=debug
```

---

## Testing Auth Flow

1. Start dev server: `npm run dev -- --port 3010`
2. Open `http://localhost:3010`
3. Click "Masuk" in navbar
4. Should show Clerk sign-in modal
5. Test sign-up flow
6. Check `/dashboard` protection
7. Check `/admin` protection

---

## Clerk Dashboard

**URL:** https://dashboard.clerk.com

For managing:
- Users
- Sessions
- API Keys
- Social Providers
- Appearance/Branding

---

## Next Steps for Gemini Agent

### High Priority

1. **Delete better-auth files** - Remove `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/auth/[...all]/route.ts`

2. **Update remaining components** - Check if any component still uses `authClient` from better-auth

3. **Test full auth flow** - Sign up, sign in, sign out, protected routes

### Medium Priority

4. **Setup Clerk Webhooks** - Sync user data to database on create/update/delete

5. **Custom Clerk Appearance** - Style the sign-in modal to match GoFishi branding

6. **Enable 2FA** - If needed for admin accounts

### Low Priority

7. **Production Setup** - Configure production instance, setup domain

8. **Remove deprecated env vars** - Clean up better-auth variables

---

## Commands Reference

```bash
# Check Clerk status
clerk doctor

# List Clerk users
clerk users list

# Open Clerk dashboard
clerk open

# Update Clerk CLI
clerk update
```

---

## Contact / Questions

- Clerk Docs: https://clerk.com/docs
- Project repo: https://github.com/doddy70/gofishinew
- Clerk App: `app_3G2FHJhST6oS9PyIk40aVMxrcZ6`
- Dev Instance: `ins_3G2FHFjlN5sbyKCw3cBO2WktSRR`
