# Nuxt Hari Santri 2026 — Frontend TODO

Frontend spesifik repo `nuxt-hari-santri`. Backlog gabungan acceptance ada di [TODO backend/frontend](../../fastapi-hari-santri/docs/HARI_SANTRI_TODO.md); kontrak halaman/API/locale ada di [Frontend Contract](HARI_SANTRI_FRONTEND.md).

## Selesai

- [x] Rebrand navigasi, metadata, footer, env, dan halaman utama dari IWBIF ke Hari Santri 2026.
- [x] Bahasa aktif Indonesia (`id`, default) dan English (`en`); API `Accept-Language` mengikuti locale aktif.
- [x] Beranda memakai naskah CMS dan tidak menampilkan harga/jadwal/rute/hadiah/pengisi acara yang belum disahkan.
- [x] Form peserta mengambil paket dan shirt inventory dari API; mengirim roster keluarga per orang, tanggal lahir/wali, activity, dan shirt size.
- [x] Checkout memakai endpoint backend Hari Santri dan redirect ke `payment_url` Portal Payment; browser tidak memilih DOKU/Midtrans.
- [x] Hasil pembayaran memeriksa status order server; dashboard menampilkan status/tiket QR per peserta.
- [x] Admin mengelola kapasitas size dan metadata paket; halaman bazar mengirim pengajuan terpisah.
- [x] Scanner check-in memakai kamera dengan fallback input manual dan validasi online.

## P0 — Sebelum peserta mendaftar

- [x] Jalankan backend lokal dan seed event draft `hari-santri-2026`; slug public/runtime sudah sama.
- [ ] Admin membuat paket `hari_santri_package` per kegiatan dengan harga final IDR, activity, min/max peserta, kuota, periode jual, inclusions, dan aturan anak yang disahkan.
- [ ] Admin menyiapkan size chart, status aktif, kapasitas per ukuran; cek laporan stok vs pesanan.
- [ ] Uji akun pemesan, cart/order, roster multianggota, ukuran berbeda, wali anak, checkout redirect, callback PAID, pending/expired, dan retry.
- [ ] Uji ticket QR online dan check-in ganda di ponsel; callback test tidak boleh menerbitkan tiket dari redirect.
- [ ] Atur `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_EVENT_SLUG`, `NUXT_PUBLIC_SITE_URL`, canonical domain dan callback/return URL produksi.

## P1 — Konten dan operasional

- [ ] Verifikasi visualisasi peta/GeoJSON, start/finish, petugas medis, aksesibilitas dan versi rute.
- [ ] Sambungkan CRUD agenda, performer confirmed-only, hadiah/sponsor/claim, voucher, tenant/stall, galeri/media consent, FAQ dan announcements ke CMS backend.
- [ ] Buat halaman legal Hari Santri yang disetujui panitia; saat ini route terms/privacy yang diwarisi masih perlu audit isi.
- [ ] Tambahkan polling status lookup server-to-server backend untuk kasus callback hilang; browser hanya menampilkan state dari backend.
- [ ] Lengkapi halaman dashboard profil/pesanan/email dengan data peserta Hari Santri; pensiunkan rute IWBIF yang tidak digunakan.
- [ ] Perluas copy/SEO/social metadata dan sitemap per route; verifikasi `id/en`, consent wali, keyboard, screen reader, image loading, reduced motion, dan viewport mobile.
- [ ] Setelah tersedia, UAT frontend dengan client Payment Portal sandbox dan fixture harga/kuota yang disetujui.

## Release checks

- [ ] `npx vue-tsc --noEmit` dan `npm run build` lulus.
- [ ] Lint file Hari Santri aktif lulus; full lint legacy masih memiliki tiga error di `useMediaUrl.ts`, `useRegistrationDocuments.ts`, dan `useTicket.ts` yang dicatat pada audit.
- [ ] Smoke test URL desktop/mobile, `id/en`, register, package availability, checkout link, payment result, QR, scanner, bazaar submission, admin pages.
