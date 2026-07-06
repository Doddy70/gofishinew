# 🚀 COMPREHENSIVE IMPLEMENTATION WORKFLOW
## GoFishi Backend Gap Closure - Session 2026-07-06

**Generated:** 2026-07-06
**Priority:** HIGH
**Target:** Close all gaps from GEMINI_HANDOFF_KAPTEN_CHANGES.md audit

---

## 📊 GAP ANALYSIS SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION STATUS                        │
├─────────────────────────────────────────────────────────────────┤
│ Phase 1 (Critical):   ██████░░░░  50% (Schema + Filters done) │
│ Phase 2 (Important):   ████░░░░░░  40% (Notifications done)   │
│ Phase 3 (Enhancement):  ██░░░░░░░░  20%                        │
├─────────────────────────────────────────────────────────────────┤
│ OVERALL COMPLETION:     ████░░░░░░  35%                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1: Critical Path (Must Complete)

#### 1.1 Schema Enhancement - MISSING FIELDS
**Priority:** 🔴 CRITICAL
**Effort:** 30 minutes

```
Schema Fields to Add:
┌────────────────────┬──────────────────────────────┐
│ Field              │ Type                         │
├────────────────────┼──────────────────────────────┤
│ weekendPrice       │ Int?                         │
│ holidayPrice       │ Int?                         │
│ targetFish         │ String[]                     │
│ tackleInventory    │ String?                      │
│ meetingPoint       │ String?                      │
│ slotType           │ Enum (MORNING/HALF/FULL)    │
│ priceOverride      │ Int?                         │
│ priceOverrideType  │ String?                      │
└────────────────────┴──────────────────────────────┘
```

#### 1.2 Dynamic Pricing API
**Priority:** 🔴 CRITICAL
**Effort:** 1 hour

```
API Endpoints:
├── GET  /api/pricing/calculate
│   └── Query: listingId, date
│   └── Response: { basePrice, finalPrice, isWeekend, isHoliday, appliedRate }
│
└── POST /api/pricing/validate
    └── Body: { listingId, date, seats }
    └── Response: { valid, priceBreakdown }
```

#### 1.3 Calendar Backend APIs
**Priority:** 🔴 CRITICAL
**Effort:** 2 hours

```
API Endpoints:
├── GET  /api/listings/[listingId]/calendar
│   └── Query: year, month
│   └── Response: { tripMasters, blockedDates, priceOverrides }
│
├── POST /api/listings/[listingId]/blocked-dates
│   └── Body: { date, reason }
│
├── DELETE /api/listings/[listingId]/blocked-dates/[id]
│
├── POST /api/listings/[listingId]/price-overrides
│   └── Body: { date, price, overrideType, label }
│
└── DELETE /api/listings/[listingId]/price-overrides/[id]
```

---

### Phase 2: Important Features

#### 2.1 Pusher Chat Integration
**Priority:** 🟡 IMPORTANT
**Effort:** 3 hours

```
API Endpoints:
├── POST /api/pusher/auth
├── POST /api/chat/send
├── GET  /api/chat/conversations
├── POST /api/chat/typing
└── POST /api/chat/read

Hooks:
└── src/hooks/useChatPusher.ts
    ├── connect()
    ├── disconnect()
    ├── sendMessage()
    ├── startTyping()
    └── stopTyping()

Components:
└── src/components/chat/ChatWindow.tsx
```

#### 2.2 Real-time Notifications
**Priority:** 🟡 IMPORTANT
**Effort:** 1 hour (Already partial done)

```
✅ Already Implemented:
├── GET  /api/notifications
└── POST /api/notifications
└── src/components/notifications/NotificationBell.tsx

❌ Still Needed:
└── Real-time push via Pusher
```

---

### Phase 3: Enhancement

#### 3.1 Transaction History
**Priority:** 🟢 ENHANCEMENT
**Effort:** 2 hours

```
Schema:
model TransactionHistory {
  id        String @id
  type      String  // PAYOUT, COMMISSION, REFUND
  amount    Int
  status    String  // PENDING, COMPLETED, FAILED
  bookingId String?
  userId    String
  notes     String?
  createdAt DateTime @default(now())
}

API Endpoints:
├── GET  /api/captain/transactions
└── GET  /api/captain/earnings
```

---

## 🔧 IMPLEMENTATION WORKFLOW

### Step 1: Schema Migration
```bash
# Add new fields to schema.prisma
npx prisma db push
npx prisma generate
```

### Step 2: Create Pricing API
```
src/app/api/pricing/
├── calculate/route.ts    # GET - Calculate price for date
└── validate/route.ts      # POST - Validate booking price
```

### Step 3: Create Calendar APIs
```
src/app/api/listings/[listingId]/
├── calendar/route.ts          # GET calendar data
├── blocked-dates/
│   ├── route.ts               # POST - Add blocked date
│   └── [id]/route.ts          # DELETE - Remove blocked date
└── price-overrides/
    ├── route.ts               # POST - Add price override
    └── [id]/route.ts          # DELETE - Remove override
```

### Step 4: Create Chat APIs
```
src/app/api/
├── pusher/auth/route.ts        # POST - Pusher auth
├── chat/
│   ├── conversations/route.ts # GET - List conversations
│   ├── [id]/messages/route.ts  # GET/POST - Messages
│   ├── typing/route.ts        # POST - Typing indicator
│   └── read/route.ts          # POST - Mark read
```

### Step 5: Create Transaction History
```
src/app/api/captain/
├── transactions/route.ts       # GET - Transaction history
└── earnings/route.ts          # GET - Earnings summary
```

---

## 📋 SESSION WORKFLOW TASKS

### Task ID | Description | Priority | Effort | Status
----------|-------------|----------|--------|-------
T-01 | Schema: Add weekendPrice, holidayPrice, targetFish, tackleInventory, meetingPoint, slotType | 🔴 | 30m | ⬜
T-02 | API: Create GET /api/pricing/calculate | 🔴 | 30m | ⬜
T-03 | API: Create GET /api/listings/[id]/calendar | 🔴 | 45m | ⬜
T-04 | API: Create blocked-dates CRUD | 🔴 | 30m | ⬜
T-05 | API: Create price-overrides CRUD | 🔴 | 30m | ⬜
T-06 | API: Create Pusher auth endpoint | 🟡 | 30m | ⬜
T-07 | Hook: Create useChatPusher.ts | 🟡 | 45m | ⬜
T-08 | Component: Create ChatWindow.tsx | 🟡 | 1h | ⬜
T-09 | Schema: Add TransactionHistory | 🟢 | 30m | ⬜
T-10 | API: Create captain transactions endpoint | 🟢 | 30m | ⬜

**Total Estimated Time:** ~7 hours

---

## 🎯 DELIVERABLES

### Today (Session 2026-07-06)

```
COMPLETED:
✅ Filter Search API (GET /api/listings/search)
✅ Filter Metadata API (GET /api/listings/filters)
✅ Notifications API (partial)
✅ Booking completion flow

IN PROGRESS:
🔄 This implementation plan

TODO:
⬜ Schema migration
⬜ Pricing API
⬜ Calendar APIs
⬜ Pusher Chat
⬜ Transaction History
```

---

## 🔗 DEPENDENCIES

```
Schema Changes (T-01)
       ↓
Pricing API (T-02) ← Depends on T-01
       ↓
Calendar APIs (T-03, T-04, T-05) ← Depends on T-01
       ↓
Pusher Chat (T-06, T-07, T-08) ← Independent
       ↓
Transaction History (T-09, T-10) ← Independent
```

---

## 📞 REFERENCE

**Test Credentials:**
```
Admin:    admin@gofishi.com / gofishi123
Captain:  budi@gofishi.com / gofishi123
User:     guest@gofishi.com / gofishi123
Base URL: http://localhost:3000
```

**Related Documents:**
- `.agents/GEMINI_HANDOFF_KAPTEN_CHANGES.md` - Original spec
- `.agents/CLAUDE_TASK_FILTER_API.md` - Filter API task (DONE)
- `.maestro/task.md` - Master task list
- `.maestro/decisions.jsonl` - Decision history

---

**Document Version:** 1.0
**Status:** READY FOR IMPLEMENTATION
**Last Updated:** 2026-07-06
