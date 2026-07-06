# 📤 MESSAGE TO GEMINI

Halo Gemini! 👋

Ada **UPDATE BESAR** untuk directive navbar yang sudah saya buat. Saya baru selesai menganalisis langsung website Airbnb.co.id dan hasilnya sangat komprehensif!

---

## 🎁 APA YANG BARU?

### 1. Analisis Langsung dari Airbnb.co.id
Saya sudah buka dan screenshot website Airbnb asli:
- Desktop Homepage Header
- Desktop Search Results Header

### 2. UI Patterns yang lebih detail
Sekarang ada **code snippet** yang bisa kamu copy-paste untuk:
- **Search Bar 3-field pill** (design Airbnb asli)
- **Filter Chips** dengan active state
- **Mobile Search Modal** dengan framer-motion animation
- **Map Price Pills** untuk floating price markers
- **Navbar scroll animation** (hide/show behavior)

### 3. Design Tokens
Sudah ada patokan desain:
- Heights (navbar, bottom nav)
- Spacing & padding
- Shadows
- Border radius
- Transitions

---

## 📁 FILE YANG HARUS KAMU BACA

```
1. .agents/GEMINI_NAVBAR_DIRECTIVE.md (PRIMARY)
   └── Updated dengan semua informasi baru!
   
2. .maestro/AIRBNB_NAVIGATION_ANALYSIS.md (REFERENCE)
   └── Analisis lengkap dari website asli
```

---

## 🎯 FOCUS UTAMA

Saya sudah identifikasi **4 TASK** untukmu:

| TASK | DESCRIPTION | PRIORITY |
|------|-------------|----------|
| 1 | HeroSearch → `/api/locations/search` | 🔴 HIGH |
| 2 | /perahu page → `/api/listings/search` | 🔴 HIGH |
| 3 | FilterPills → `/api/locations/filters` | 🔴 HIGH |
| 4 | MobileSearchModal (full implementation) | 🔴 HIGH |

---

## ⚡ API YANG SUDAH SIAP

```bash
✅ GET /api/locations/search?q=Lombok
✅ GET /api/listings/search?locationValue=Bali&guests=4
✅ GET /api/listings/filters
```

**Kamu tinggal connect frontend ke API ini!**

---

## 📸 VISUAL REFERENCE

Saya sudah screenshot Airbnb.co.id, kamu bisa lihat:
- `airbnb-desktop-homepage.png` - Homepage header asli Airbnb
- `airbnb-desktop-search.png` - Search results header asli Airbnb

---

## ⚠️ YANG SUDAH BAGUS (JANGAN DIUBAH)

- `Navbar.tsx` - Logic sudah benar, tinggal enhance
- `BottomNav.tsx` - Already good
- Clerk UserButton - Already good

---

## 📋 CHECKLIST

```
☐ Baca .agents/GEMINI_NAVBAR_DIRECTIVE.md (UTAMA)
☐ Implement TASK 1: HeroSearch → API
☐ Implement TASK 2: /perahu → API
☐ Implement TASK 3: FilterPills → API
☐ Implement TASK 4: MobileSearchModal
☐ TEST semua halaman
```

---

## ⏱️ ESTIMATED TIME

- Tasks 1-4 (Core): **2-3 hours**
- Animations: **1-2 hours**
- Testing: **1 hour**
- **Total: 4-6 hours**

---

## ❓ JIKA ADA PERTANYAAN

1. Baca ulang `.agents/GEMINI_NAVBAR_DIRECTIVE.md`
2. Check `.maestro/AIRBNB_NAVIGATION_ANALYSIS.md`
3. Tanya user / Claude

---

**SIAP MULAI?** 💪

Kamu sekarang punya:
- ✅ Complete analysis dari Airbnb asli
- ✅ Code snippets yang siap copy-paste
- ✅ API endpoints yang sudah jalan
- ✅ Task list yang jelas

Langsung saja mulai dari TASK 1!

---

*Best regards,*
*Claude (Backend)*
*2026-07-06*
