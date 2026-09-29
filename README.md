# Nuxt Hari Santri 2026

Frontend Nuxt 4 untuk Portal Event Sepeda Sehat dan Jalan Sehat Keluarga Hari Santri 2026. Sumber copy publik: [Konten Web Portal Hari Santri](../fastapi-hari-santri/docs/Konten_Web_Portal_Hari_Santri_2026.md). Batas backend/payment, endpoint peserta/kaos, alur checkout, locale, dan gap release ada di [Frontend Contract](docs/HARI_SANTRI_FRONTEND.md) dan [TODO lintas repo](../fastapi-hari-santri/docs/HARI_SANTRI_TODO.md).

## Menjalankan lokal

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Buka `http://localhost:3000`. Pastikan API FastAPI berjalan dan event ber-slug `hari-santri-2026` sudah dibuat beserta produk paket dan inventori size yang disahkan panitia.

## Environment publik

Atur `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_API_BASE_PATH`, `NUXT_PUBLIC_EVENT_SLUG`, `NUXT_PUBLIC_SITE_URL`, dan `NUXT_PUBLIC_APP_NAME`. Credential OAuth dan callback Payment Portal **tidak boleh** disimpan di frontend build atau browser; semuanya dikonfigurasi pada backend/server.

Bahasa aktif adalah Indonesia (`id`, default) dan English (`en`). Browser dialihkan ke hosted checkout URL yang diberikan backend. Frontend tidak memilih gateway, tidak menghitung nominal final, dan tidak menetapkan order sebagai lunas berdasarkan redirect.

## Verifikasi

```powershell
npx eslint app
npx vue-tsc --noEmit
npm run build
```

Gunakan dokumentasi pada folder `docs` sebagai kontrak Portal Hari Santri. Dokumen lama dan integrasi gateway langsung tidak lagi menjadi bagian dari proyek ini.