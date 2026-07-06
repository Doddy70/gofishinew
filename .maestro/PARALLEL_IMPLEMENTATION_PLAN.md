# 🔀 PARALLEL IMPLEMENTATION PLAN
## GoFishi - Claude & Gemini Multi-Agent Workflow

**Date:** 2026-07-06
**Purpose:** Enable parallel implementation by Claude & Gemini agents

---

## 📊 DEPENDENCY ANALYSIS

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEPENDENCY GRAPH                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   T-01: Schema Migration                                           │
│         │                                                           │
│         ├──────────────────┐                                        │
│         ▼                  ▼                                        │
│   T-02: Pricing API    T-03: Calendar API                          │
│         │                  │                                        │
│         │             ┌────┴────┐                                   │
│         │             ▼         ▼                                   │
│         │        T-04: Blocked  T-05: Price Overrides               │
│         │         Dates          CRUD                               │
│         │             └────┬────┘                                   │
│         │                  │                                        │
│         │                  ▼                                        │
│         │            Frontend UI Integration                        │
│         │            (Gemini handles)                               │
│         │                                                           │
│   ════════════════════════════════════════════════════════════     │
│                                                                     │
│   TRACK B (GEMINI - Independent from T-01)                         │
│                                                                     │
│   T-06: Pusher Auth API ──┐                                         │
│   T-07: useChatPusher ────┼──► T-08: ChatWindow.tsx                │
│   T-09: TransactionSchema ─┤                                        │
│   T-10: Transactions API ─┘                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 TRACK ALLOCATION

### Track A: Backend Core (CLAUDE)
**Focus:** Database schema, pricing, calendar APIs

| Task | Description | Dependencies |
|------|-------------|--------------|
| T-01 | Schema: Add weekendPrice, holidayPrice, targetFish, tackleInventory, meetingPoint | None |
| T-02 | API: GET /api/pricing/calculate | T-01 |
| T-03 | API: GET /api/listings/[id]/calendar | T-01 |
| T-04 | API: blocked-dates CRUD | T-01 |
| T-05 | API: price-overrides CRUD | T-01 |

### Track B: Real-time & Transactions (GEMINI)
**Focus:** Chat, notifications, earnings (Independent track)

| Task | Description | Dependencies |
|------|-------------|--------------|
| T-06 | API: POST /api/pusher/auth | None |
| T-07 | Hook: src/hooks/useChatPusher.ts | T-06 |
| T-08 | Component: src/components/chat/ChatWindow.tsx | T-06, T-07 |
| T-09 | Schema: Add TransactionHistory model | None |
| T-10 | API: GET /api/captain/transactions | T-09 |

---

## 🔄 SHARED CONTEXT

### For Both Agents

```
SHARED FILES:
├── prisma/schema.prisma              ← T-01 modifies
├── .agents/HANDOFF_PROTOCOL.md       ← Both update
├── .maestro/decisions.jsonl          ← Both append
└── .maestro/sessions/2026-07-06_*    ← Both update
```

### Claude Reads Before Starting
```
GEMINI FILES (Reference Only):
├── .agents/GEMINI_HANDOFF_KAPTEN_CHANGES.md  ← Read for spec
├── .agents/GEMINI_TASK_*.md                   ← Any Gemini tasks
└── src/components/chat/*.tsx                  ← Chat components (if exist)
```

### Gemini Reads Before Starting
```
CLAUDE FILES (Reference Only):
├── src/app/api/listings/search/route.ts        ← API pattern reference
├── src/app/api/listings/filters/route.ts       ← API pattern reference
├── src/app/api/notifications/route.ts          ← Similar to what T-10 needs
└── prisma/schema.prisma                        ← Current schema
```

---

## 📋 IMPLEMENTATION ORDER

### CLAUDE starts with:
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

### GEMINI starts with:
```
1. T-06: Pusher Auth API
   └── src/app/api/pusher/auth/route.ts
   └── Commit: "feat: Add Pusher authentication"
   
2. T-07: Chat Hook
   └── src/hooks/useChatPusher.ts
   
3. T-09: TransactionHistory Schema (after CLAUDE confirms T-01)
   └── Add to prisma/schema.prisma
   └── npx prisma db push
   
4. T-08, T-10: ChatWindow + Transactions API
   └── Commit: "feat: Add chat and transaction APIs"
```

---

## 🔗 HANDOFF PROTOCOL

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

### CLAUDE Owns:
```
src/app/api/
├── pricing/
│   └── calculate/route.ts          ← T-02
├── listings/[listingId]/
│   ├── calendar/route.ts            ← T-03
│   ├── blocked-dates/               ← T-04
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── price-overrides/             ← T-05
│       ├── route.ts
│       └── [id]/route.ts

prisma/schema.prisma                   ← T-01
```

### GEMINI Owns:
```
src/app/api/
├── pusher/
│   └── auth/route.ts                ← T-06
├── chat/
│   ├── conversations/route.ts
│   ├── [id]/messages/route.ts
│   ├── typing/route.ts
│   └── read/route.ts
└── captain/
    └── transactions/route.ts        ← T-10

src/
├── hooks/
│   └── useChatPusher.ts             ← T-07
├── components/
│   └── chat/
│       └── ChatWindow.tsx           ← T-08

prisma/schema.prisma                   ← T-09 (TransactionHistory only)
```

### DO NOT TOUCH (Other Agent's Territory):
```
CLAUDE must NOT modify:
├── src/components/chat/
├── src/hooks/useChatPusher.ts
└── src/app/api/pusher/

GEMINI must NOT modify:
├── src/app/api/pricing/
├── src/app/api/listings/[id]/calendar/
├── src/app/api/listings/[id]/blocked-dates/
└── src/app/api/listings/[id]/price-overrides/
```

---

## ✅ VERIFICATION CHECKLIST

### CLAUDE checks before marking T-01 done:
- [ ] Schema has all new fields
- [ ] `npx prisma db push` successful
- [ ] `npx prisma generate` successful
- [ ] Handed off to Gemini

### CLAUDE checks before marking Track A done:
- [ ] T-02: GET /api/pricing/calculate works
- [ ] T-03: GET /api/listings/[id]/calendar works
- [ ] T-04: POST/DELETE blocked-dates works
- [ ] T-05: POST/DELETE price-overrides works
- [ ] HANDOFF_PROTOCOL.md updated

### GEMINI checks before marking Track B done:
- [ ] T-06: Pusher auth works
- [ ] T-07: useChatPusher connects
- [ ] T-08: ChatWindow renders
- [ ] T-09: TransactionHistory model exists
- [ ] T-10: GET /api/captain/transactions works
- [ ] HANDOFF_PROTOCOL.md updated

---

## 📊 PARALLEL EXECUTION TIMELINE

```
HOUR 0          HOUR 1          HOUR 2          HOUR 3+
─────────        ─────────       ─────────       ─────────
┌─────────┐
│ T-01    │
│ Schema  │───────────────────────────────────────────────
└────┬────┘                                             
     │                                                   
     ├──────────────────────────────────────────────────►
     │ T-02: Pricing API                                 
     │                                                    
     ├──────────────────────────────────────────────────►
     │ T-03: Calendar API                                
     │                                                    
     ├──────────────────────────────────────────────────►
     │ T-04, T-05: Blocked/Price APIs                    
     │                                                    
══════════════════════════════════════════════════════════
GEMINI                                                          
─────────       ─────────       ─────────       ─────────
┌─────────┐     ┌─────────┐
│ T-06    │     │ T-07    │
│ Pusher  │────►│ Chat    │
│ Auth    │     │ Hook    │
└────┬────┘     └────┬────┘     ┌─────────┐
     │               │         │ T-09    │
     │               │         │ Trans.  │──────────────►
     │               │         │ Schema  │
     │               │         └────┬────┘
     │               │              │
     │               └──────────────┼─────────────────────
     │                              │ T-08, T-10         
     │                              │ Chat + Trans.       
     │                              │ APIs               
     └──────────────────────────────┴─────────────────────
```

**Estimated Total Time (Parallel):** ~4 hours
**Estimated Total Time (Sequential):** ~7 hours
**Speed Improvement:** 43% faster

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
  "from": "claude",
  "to": "gemini",
  "type": "handoff",
  "task": "T-01",
  "status": "complete",
  "message": "Schema migrated. TransactionHistory can be added.",
  "files": ["prisma/schema.prisma"],
  "timestamp": "2026-07-06T12:30:00Z"
}
```

---

**Document Version:** 1.0
**Status:** READY FOR PARALLEL EXECUTION
**Agents:** CLAUDE (Track A) + GEMINI (Track B)
