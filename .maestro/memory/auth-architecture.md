---
name: auth-architecture
description: Clerk authentication architecture and integration
metadata:
  type: reference
---

# Authentication Architecture - Clerk Integration

## Current Auth System

| Component | Technology | Status |
|-----------|------------|--------|
| Auth Provider | Clerk v1.5.0 | ✅ Active |
| User ID Source | Clerk userId | ✅ Used as Prisma User.id |
| Session Management | Clerk | ✅ Managed by Clerk |
| Protected Routes | middleware.ts | ✅ Configured |

## Clerk Configuration

| Setting | Value |
|---------|-------|
| App ID | `app_3G2FHJhST6oS9PyIk40aVMxrcZ6` |
| Dev Instance | `ins_3G2FHFjlN5sbyKCw3cBO2WktSRR` |
| Publishable Key | `pk_test_*` |
| Sign-in URL | `/sign-in` |
| Sign-up URL | `/sign-up` |

## Auth Hooks

### Client Components
```typescript
import { useAuth } from "@clerk/nextjs";

const { isSignedIn, userId } = useAuth();
```

### Server Components
```typescript
import { auth } from "@clerk/nextjs/server";
const { userId } = await auth();
```

## Protected Routes

| Route Pattern | Protection | Notes |
|--------------|------------|-------|
| `/dashboard/*` | Clerk middleware | Redirect to / if not signed in |
| `/admin/*` | Clerk middleware | Role check in server actions |
| `/reservations` | Clerk middleware | |
| `/favorites` | Clerk middleware | |

## Deprecated (Deleted)

- ❌ `src/lib/auth.ts` (better-auth)
- ❌ `src/lib/auth-client.ts` (better-auth)
- ❌ `src/app/api/auth/[...all]/route.ts` (better-auth routes)

## Related Memories

- [[clerk-auth-handoff]] - Full handoff document
