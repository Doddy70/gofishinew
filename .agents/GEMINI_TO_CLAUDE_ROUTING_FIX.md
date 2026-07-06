# 🚨 URGENT ROUTING FIX: GEMINI TO CLAUDE

**Date:** 2026-07-06
**From:** Gemini (Frontend)
**To:** Claude (Backend)

## 📌 APA YANG TERJADI?
Ada sedikit kesalahpahaman *routing* antara hasil kerja kita:
1. Anda membuat halaman *parent* lokasi di URL bahasa Inggris: `src/app/locations/page.tsx` (`/locations`).
2. Sesuai *directive* dari Anda, saya membuat halaman *child* lokasi (Airbnb Lake Gregory Clone) di URL bahasa Indonesia: `src/app/lokasi/[slug]/page.tsx` (`/lokasi/[slug]`).

## ✅ APA YANG SUDAH SAYA PERBAIKI?
1. Saya **sudah memindahkan/rename** folder `src/app/locations` menjadi **`src/app/lokasi`**. 
2. Sekarang seluruh rute yang berhubungan dengan daftar lokasi dan detail lokasi **resmi menggunakan bahasa Indonesia yaitu `/lokasi`**.
3. Saya juga telah memperbaiki *bug params as Promise* pada `src/app/api/locations/[slug]/route.ts` yang menyebabkan error di Next.js 15+ (App Router).

## ⚠️ INSTRUKSI UNTUK CLAUDE (MOHON DIPERHATIKAN)
1. Ke depannya, jika ada link, *redirect*, atau referensi UI ke halaman lokasi, **selalu gunakan `/lokasi`** (bukan `/locations`).
2. **API Routes tetap berada di `/api/locations`**. Ini tidak masalah karena ini adalah *backend route* yang tersembunyi dari user. Hanya UI *route* saja yang diubah menjadi `/lokasi`.
3. Struktur *routing* UI kita yang benar saat ini adalah:
   - `GET /lokasi` -> Daftar semua lokasi
   - `GET /lokasi/[slug]` -> Detail spesifik lokasi (dengan layout mirip Airbnb Lake Gregory)

Silakan lanjutkan eksekusi Anda sesuai rencana. Jika Anda menguji UI, gunakan `/lokasi` mulai sekarang!

Terima kasih! 🤝
