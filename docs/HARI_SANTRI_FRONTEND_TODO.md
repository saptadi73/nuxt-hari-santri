# Nuxt Harlah NU ke-101 — Frontend TODO

Frontend spesifik repo `nuxt-hari-santri`. Backlog gabungan acceptance ada di [TODO backend/frontend](../../fastapi-hari-santri/docs/HARI_SANTRI_TODO.md); kontrak halaman/API/locale ada di [Frontend Contract](HARI_SANTRI_FRONTEND.md).

## Selesai

- [x] Rebrand navigasi, metadata, footer, env, dan halaman utama dari IWBIF ke Harlah NU ke-101.
- [x] Bahasa aktif portal Harlah NU hanya Indonesia (`id`); deteksi bahasa browser dimatikan dan API selalu menerima locale `id`.
- [ ] Terjemahkan seluruh halaman, komponen, navigasi, formulir admin/peserta, notifikasi, dan konten warisan IWBIF ke Bahasa Indonesia; hapus pemilih/aksi terjemahan English/Chinese setelah konten Indonesian siap.
- [x] Beranda memakai naskah CMS dan tidak menampilkan harga/jadwal/rute/hadiah/pengisi acara yang belum disahkan.
- [x] Form peserta mengambil paket dan shirt inventory dari API; mengirim roster keluarga per orang, tanggal lahir/wali, activity, dan shirt size.
- [x] Hilangkan pilihan wilayah dari form order; backend memakai wilayah profil pemesan yang dikumpulkan saat akun pertama dibuat.
- [x] Checkout memakai endpoint backend Harlah NU dan redirect ke `payment_url` Portal Payment; browser tidak memilih DOKU/Midtrans.
- [x] Tambahkan menu dan halaman donasi publik dengan nominal pilihan donatur, idempotency request ID, redirect ke URL Payment Portal dari server, dan tampilan status lokal tanpa menandai lunas dari browser.
- [x] Tampilkan state checkout UNKNOWN dengan arahan resume order yang sama; jangan buat order baru atau mengubah status dari browser.
- [x] Tampilkan `paid_needs_review` tanpa akses tiket, dan berikan aksi rekonsiliasi callback terlambat admin berbasis nomor referensi order.
- [x] Hasil pembayaran memeriksa status order server; dashboard menampilkan status/tiket QR per peserta.
- [x] Dashboard pembayaran, invoice, dan tiket mendukung beberapa order dalam satu akun tanpa hanya mengambil order terbaru.
- [x] Halaman `/dashboard/invoice` memakai `GET /hari-santri/me/invoices`, menampilkan rincian per order, dan menyediakan cetak/simpan PDF.
- [x] Halaman `/dashboard/tiket` menyediakan tampilan QR responsif yang dapat dicetak atau disimpan sebagai PDF.
- [x] Admin mengelola kapasitas size dan metadata paket; halaman bazar mengirim pengajuan terpisah.
- [x] Scanner check-in memakai kamera dengan fallback input manual dan validasi online.

## P0 — Sebelum peserta mendaftar

- [x] Jalankan backend lokal dan seed event draft `harlah-nu-101`; slug public/runtime sudah sama.
- [ ] Admin membuat paket `hari_santri_package` per kegiatan dengan harga final IDR, activity, min/max peserta, kuota, periode jual, inclusions, dan aturan anak yang disahkan.
- [ ] Admin menyiapkan size chart, status aktif, kapasitas per ukuran; cek laporan stok vs pesanan.
- [ ] Uji akun pemesan, cart/order, roster multianggota, ukuran berbeda, wali anak, checkout redirect, callback PAID, pending/expired, dan retry.
- [ ] Uji ticket QR online dan check-in ganda di ponsel; callback test tidak boleh menerbitkan tiket dari redirect.
- [x] Build statis production harus menerima `NUXT_PUBLIC_API_BASE_URL` dan `NUXT_PUBLIC_SITE_URL` eksplisit; validasi menolak localhost/loopback agar URL API development tidak tertanam ke HTML.

## P1 — Konten dan operasional

- [ ] Verifikasi visualisasi peta/GeoJSON, start/finish, petugas medis, aksesibilitas dan versi rute.
- [ ] Sambungkan CRUD agenda, performer confirmed-only, hadiah/sponsor/claim, voucher, tenant/stall, galeri/media consent, FAQ dan announcements ke CMS backend.
- [ ] Buat halaman legal Harlah NU yang disetujui panitia; saat ini route terms/privacy yang diwarisi masih perlu audit isi.
- [x] Sediakan aksi admin rekonsiliasi manual dari halaman operasi menggunakan nomor referensi order; lookup dilakukan backend ke Payment Portal dan status browser tidak mengubah order.
- [x] Pensiunkan rute IWBIF publik dan alias dashboard legacy; bookmark `/register`, `/tickets`, `/register/*`, cart, payment-status, Business Matching, Deal Room, program, dan speakers dialihkan ke alur Harlah NU yang aktif. `/dashboard/invoice` tetap menjadi halaman aktif Harlah NU.
- [ ] Perluas copy/SEO/social metadata dan sitemap per route; verifikasi UI Indonesia, consent wali, keyboard, screen reader, image loading, reduced motion, dan viewport mobile.
- [ ] Audit 44 halaman/komponen legacy IWBIF yang masih memuat salinan English/Chinese; komponen legacy yang tidak lagi dipakai masih ada di source untuk migrasi/cleanup bertahap, tetapi route publiknya sudah dialihkan.
- [ ] Setelah tersedia, UAT frontend dengan client Payment Portal sandbox dan fixture harga/kuota yang disetujui.

## Release checks

- [x] Deploy versi `main` (checkout donasi dan menu dropdown) sebagai situs statis pada rilis `20261019-donasi-01`; smoke test homepage, `/donasi/`, dan `/pembayaran/hasil/` berhasil (HTTP 200).
- [x] Backend/migration production siap dan endpoint provinsi sudah mengembalikan data (34 provinsi).
- [ ] Perbarui master wilayah ke data resmi terbaru yang mencakup 38 provinsi; empat provinsi kode Papua 93–96 masih belum tersedia.

- [ ] `npx vue-tsc --noEmit` dan `npm run build` lulus.
- [ ] Lint file Harlah NU aktif lulus; full lint legacy masih memiliki tiga error di `useMediaUrl.ts`, `useRegistrationDocuments.ts`, dan `useTicket.ts` yang dicatat pada audit.
- [ ] Smoke test URL desktop/mobile, bahasa Indonesia, register, package availability, checkout link, payment result, QR, scanner, bazaar submission, admin pages.
- [ ] Uji donasi dengan nominal valid/invalid, redirect Payment Portal, callback terlambat/duplikat, refresh halaman hasil, dan pastikan status hanya berasal dari API backend.
