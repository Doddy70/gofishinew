# Airbnb Design Reference — GoFishi Location Pages

Generated: 2026-07-05
Source: Scraped from Airbnb.co.id + airbnb.com

---

## Screenshots Captured

| File | Description |
|------|-------------|
| `airbnb-locations-full.png` | Full page hero + category sections |
| `airbnb-listings-grid.png` | Listing cards in grid layout |
| `airbnb-ancol-listings.png` | Ancol location search results |
| `airbnb-ancol-scroll.png` | Scroll behavior on listings |

---

## Design Patterns Observed

### 1. Sticky Search Bar (Always Visible)
- **Position:** Fixed/sticky at top of page
- **Contents:** Location input + date pickers + guest selector + search button
- **Background:** White with subtle shadow/border
- **Purpose:** Quick access to search without scrolling

### 2. Category Chips (Horizontal Scroll)
- **Style:** Rounded pill buttons, horizontally scrollable
- **Examples:** "Apartemen di Pademangan", "Rumah di Borinquen"
- **Scroll:** Hidden scrollbar, swipe/scroll on mobile
- **Active state:** Dark background (gray-900) when selected

### 3. Filter Button
- **Style:** Rounded with icon + label + notification badge
- **Position:** Top right of search bar area
- **Badge:** Red indicator (!) when filters active

### 4. Listing Cards Grid
- **Grid:** 4 columns (xl), 3 columns (lg), 2 columns (md), 1 column (sm)
- **Card aspect ratio:** 3:2 for images
- **Spacing:** gap-5 (20px)
- **Hover:** Scale 105% + shadow lift

### 5. Listing Card Anatomy
```
┌──────────────────────────┐
│  [Image 3:2]              │
│                    ♥      │ ← Favorite button (top-right)
│  ┌─────────────────┐    │
│  │ ⭐ 4.9 (128)    │    │ ← Rating badge (bottom-left)
│  └─────────────────┘    │
├──────────────────────────┤
│ Boat Type • Capacity      │ ← Subtitle (smaller text)
│ Title of listing          │ ← Primary title
│ Captain name              │ ← Host/captain info
│ Rp 1.500.000 / hari      │ ← Price per day
│ [📅 10 Jul] [📅 12 Jul] │ ← Available dates (optional)
└──────────────────────────┘
```

### 6. Pagination
- **Style:** Centered, page numbers in rounded buttons
- **Active page:** Filled dark background
- **Navigation:** Chevron left/right buttons
- **Max shown:** 5 page numbers

### 7. Filter Panel
- **Style:** Expandable panel below search bar
- **Layout:** Horizontal row with select dropdowns
- **Filters:** Type, Capacity, Price Range
- **Actions:** Reset + Apply buttons

### 8. Hero Section (Location Page)
- **Location image:** Left side (circular/rounded)
- **Name + Region:** Title with location icon
- **Stats:** Boat count, average rating

### 9. Color Palette
| Element | Color |
|---------|-------|
| Primary CTA | `#FF385C` (Airbnb pink-red) |
| Background | `#FFFFFF` |
| Section BG | `#F7F7F7` |
| Text Primary | `#222222` |
| Text Secondary | `#717171` |
| Border | `#E0E0E0` |
| Rating Star | `#FFB400` |
| Success | `#2E7D32` (green) |

### 10. Typography
| Element | Size | Weight |
|---------|------|--------|
| Page Title | 24px | Bold |
| Card Title | 15px | Semibold |
| Subtitle | 13px | Regular |
| Caption | 12px | Regular |
| Price | 15px | Semibold |
| Badge | 10px | Semibold |

---

## Applied to GoFishi

### LocationsPageClient
- ✅ Airbnb-style sticky search bar
- ✅ Category chips (horizontal scroll)
- ✅ Filter button with badge
- ✅ 4-column responsive grid (Airbnb spacing: gap-5)
- ✅ Airbnb-style LocationCard (3:2 image, rating badge, price)
- ✅ Pagination (centered, chevron buttons)

### LocationDetailClient
- ✅ Sticky header with breadcrumb navigation
- ✅ Filter panel (expandable)
- ✅ Location hero section
- ✅ Boat listing grid (Airbnb card style)
- ✅ BoatListingCard (rating badge, captain, dates)

---

## Implementation Notes

1. **Image Aspect Ratio:** All cards use `aspect-[3/2]` (matches Airbnb)
2. **Grid Gap:** `gap-5` (20px) matches Airbnb spacing
3. **Rounded Corners:** `rounded-xl` for cards, `rounded-full` for pills/chips
4. **Price Format:** Indonesian locale (`id-ID`) with thousand separators
5. **Date Format:** `d MMM` (e.g., "10 Jul")
