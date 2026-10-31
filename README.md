# Nuxt Harlah NU ke-101

Frontend Nuxt 4 untuk Portal Event Sepeda Santai dan Jalan Sehat Keluarga Harlah NU ke-101 (Leisure Bike Ride & Family Fun Walk). Sumber copy publik: [Konten Web Portal Harlah NU](../fastapi-hari-santri/docs/Konten_Web_Portal_Hari_Santri_2026.md). Batas backend/payment, endpoint peserta/kaos, alur checkout, locale, dan gap release ada di [Frontend Contract](docs/HARI_SANTRI_FRONTEND.md) dan [TODO lintas repo](../fastapi-hari-santri/docs/HARI_SANTRI_TODO.md).

## Menjalankan lokal

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Buka `http://localhost:3000`. Pastikan API FastAPI berjalan dan event ber-slug `harlah-nu-101` sudah dibuat beserta produk paket dan inventori size yang disahkan panitia.

## Environment publik

Atur `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_API_BASE_PATH`, `NUXT_PUBLIC_EVENT_SLUG`, `NUXT_PUBLIC_SITE_URL`, dan `NUXT_PUBLIC_APP_NAME`. Credential OAuth dan callback Payment Portal **tidak boleh** disimpan di frontend build atau browser; semuanya dikonfigurasi pada backend/server.

Untuk situs statis production Harlah NU, set `NUXT_PUBLIC_API_BASE_URL=https://api.harlahnu.com` dan `NUXT_PUBLIC_SITE_URL=https://harlahnu.com` pada environment proses sebelum `npm run generate`. Build akan ditolak jika kedua nilai masih kosong atau menunjuk ke localhost/loopback; `.env` lokal untuk development tidak boleh dipakai sebagai konfigurasi build production. Selama masa transisi, domain lama tetap aktif sebagai alias dan tidak boleh dipakai sebagai API base URL build baru.

Bahasa aktif portal Harlah NU adalah Bahasa Indonesia (`id`) saja. Pemilihan bahasa browser dinonaktifkan dan permintaan API selalu memakai `id`. Browser dialihkan ke hosted checkout URL yang diberikan backend. Frontend tidak memilih gateway, tidak menghitung nominal final, dan tidak menetapkan order sebagai lunas berdasarkan redirect.

## Verifikasi

```powershell
npx eslint app
npx vue-tsc --noEmit
npm run build
```

Gunakan dokumentasi pada folder `docs` sebagai kontrak Portal Harlah NU. Dokumen lama dan integrasi gateway langsung tidak lagi menjadi bagian dari proyek ini.

Dokumentasi utama integrasi frontend, daftar halaman, kontrak API aktif, alur pembayaran, donasi, tiket, bazar, voucher, laporan admin, dan operasi callback tersedia di [docs/HARLAH_NU_FRONTEND.md](docs/HARLAH_NU_FRONTEND.md). Jika dokumentasi lama bertentangan dengan dokumen tersebut, gunakan `HARLAH_NU_FRONTEND.md` dan OpenAPI backend sebagai acuan.

Dashboard peserta mendukung beberapa pesanan, invoice, dan tiket dalam satu akun:

- `/dashboard/payment`: seluruh pesanan dan riwayat pembayaran akun.
- `/dashboard/invoice`: pilihan invoice per order, rincian kegiatan/peserta/pembayaran, serta cetak atau simpan PDF.
- `/dashboard/tiket`: seluruh tiket QR dari semua order lunas, termasuk tampilan siap cetak/PDF.

## Wallet voucher bazar

Halaman yang tersedia:

- `/dashboard/voucher`: kartu QR voucher, saldo, dan riwayat peserta.
- `/exhibitor/scanner`: scanner QR, nominal belanja, password peserta, saldo, dan riwayat tenant; lapak aktif diambil dari akun exhibitor yang login sehingga tidak perlu UUID.
- `/admin/vouchers`: penerbitan reward manual, adjustment/revoke voucher, serta settlement exhibitor dengan dropdown peserta, voucher, exhibitor, dan settlement; UUID tidak diisi manual.

Endpoint backend wallet menggunakan kontrak pada `fastapi-hari-santri/docs/HARI_SANTRI_VOUCHER_WALLET.md`. Jalankan migration backend sebelum menguji halaman ini. Kamera scanner membutuhkan HTTPS atau localhost; input token manual tetap tersedia sebagai fallback.
