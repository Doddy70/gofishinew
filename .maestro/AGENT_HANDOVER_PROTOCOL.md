# Agent Handover Protocol - GoFishi Project

**Version:** 1.0
**Last Updated:** 2026-07-04

---

## Purpose

Standardized handoff document untuk memastikan kontinuitas kerja antar agent (Claude, Gemini, dll) tanpa kehilangan context.

---

## Current Project State

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 16.1.4 |
| Auth | Clerk | 1.5.0 |
| Database | PostgreSQL (Neon) | - |
| ORM | Prisma | 7.3.0 |
| UI | React + Tailwind | 19.2.3 / 4.x |
| Payments | Midtrans | - |
| Maps | Google Maps | - |

### Important Paths

| Path | Description |
|------|-------------|
| `./codebase/` | Main application |
| `./codebase/src/app/` | Next.js App Router pages |
| `./codebase/src/components/` | React components |
| `./codebase/src/lib/` | Utilities & configs |
| `./codebase/src/server-actions/` | Server actions |
| `./codebase/src/repositories/` | Data access layer |
| `./codebase/prisma/` | Database schema |
| `./.maestro/` | Agent workflow docs |

---

## Quick Start for New Agent

### 1. Read Context First
```bash
# Required files to read before starting
cat .maestro.md                                    # Workflow context
cat .maestro/sessions/*.md | tail -20             # Recent sessions
cat .maestro/memory/*.md                          # Architecture docs
```

### 2. Auth System
```typescript
// User ID = Clerk userId = Prisma User.id
// All three are the same ID

import { useAuth } from "@clerk/nextjs";  // Client
import { auth } from "@clerk/nextjs/server";  // Server
```

### 3. Key Commands
```bash
npm run dev -- --port 3010    # Start dev server
npm run build                  # Production build
clerk doctor                   # Check auth status
```

---

## Session Capture Checklist

When ending a session, document:

- [ ] Commands run
- [ ] Decisions made (with rationale)
- [ ] Files changed
- [ ] Open issues
- [ ] Next steps (specific, actionable)

### Session File Format
```markdown
# Session: {topic}
Date: {YYYY-MM-DD}

## Commands Run
- /diagnose → Score: 18/25
- /fortify → Added retry logic

## Decisions
- Chose retry-with-backoff (reason)

## Files Changed
- `src/api/handler.ts` — added retry wrapper

## Open Issues
- Rate limiting not yet implemented

## Next Steps
1. Run `/guard` to add rate limiting
```

---

## Common Patterns

### Getting Current User (Server)
```typescript
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function getUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
```

### Protected Route Check (Server)
```typescript
import { auth } from "@clerk/nextjs/server";

async function protectedAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // ... proceed
}
```

### Creating User on Sign-up
```typescript
// Automatic via getCurrentUser() if not exists
// Or via Clerk webhook at /api/webhooks/clerk
```

---

## Environment Variables

Key variables needed:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Dev
NEXT_PUBLIC_BASE_URL=http://localhost:3010
```

---

## Anti-Patterns to Avoid

1. ❌ Don't use `window.location.href` - use `router.push()`
2. ❌ Don't import `auth.ts` or `auth-client.ts` - deleted
3. ❌ Don't use better-auth patterns
4. ❌ Don't hardcode user IDs

---

## Contacts

| Role | Contact |
|------|---------|
| Owner | nurruslan13@gmail.com |
| Repo | github.com/doddy70/gofishinew |
| Clerk App | app_3G2FHJhST6oS9PyIk40aVMxrcZ6 |

---

## Document Changelog

| Date | Version | Changes | Agent |
|------|---------|--------|-------|
| 2026-07-04 | 1.0 | Initial protocol | Claude |
