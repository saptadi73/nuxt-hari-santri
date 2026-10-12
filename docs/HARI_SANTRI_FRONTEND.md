# Nuxt Hari Santri 2026 — Frontend Contract

## Sumber konten dan bahasa

Copy publik mengikuti `fastapi-hari-santri/docs/Konten_Web_Portal_Hari_Santri_2026.md`. Bahasa aktif adalah Indonesia (`id`, default) dan English (`en`); locale disimpan pada cookie `hari_santri_locale` dan dikirim sebagai query/header API.

Jangan menerbitkan harga, isi paket, kuota, rute, jam, pengisi acara, hadiah, voucher, biaya tenant, atau titik kumpul dari contoh. Bagian yang belum disahkan memakai copy “diumumkan panitia”/“to be announced”. Nama/foto tokoh hanya tampil jika hak dan persetujuan publikasi sudah ada.

## Alur peserta

1. Buat akun pemesan atau masuk. Tidak ada langkah pendaftaran `ParticipantProfile` terpisah untuk Hari Santri; satu pemesan dapat mengelola beberapa peserta keluarga.
2. Pilih tepat satu `CYCLING` atau `FAMILY_WALK`; frontend memuat satu produk aktif untuk event `hari-santri-2026` dari API. Jenis kegiatan dan harga final harus ditentukan backend.
3. Isi satu peserta per anggota keluarga: nama, tanggal lahir bila diperlukan, wali anak, provinsi, kabupaten/kota, kecamatan, desa/kelurahan, dan kode ukuran kaos. Wilayah dimuat berantai dari `/regions?level=...&parent_code=...`; jangan mengarang kode atau label wilayah di client.
4. Keranjang/order harus berisi tepat satu paket Hari Santri untuk satu activity. Kirim roster ke `PUT /orders/{order_id}/participants`; backend memvalidasi batas peserta, activity, dan reservasi stok.
5. Lanjutkan melalui `POST /hari-santri/orders/{order_id}/checkout`; simpan URL order seperlunya dan arahkan browser ke `payment_url` yang diterima. Browser tidak memiliki Portal Payment client secret, OAuth token, callback secret, nominal query, atau gateway API.
6. Halaman `/pembayaran/hasil` membaca `GET /hari-santri/orders/{order_id}/payment-status`. Browser hanya menampilkan status backend. Untuk status payment `UNKNOWN`, halaman memberi arahan melanjutkan checkout yang sama; backend mengulang dengan idempotency key order yang sama, bukan membuat order baru. `paid_needs_review` menjelaskan bahwa pembayaran sedang ditinjau dan tiket belum tersedia.
7. Setelah callback Payment Portal terverifikasi server, peserta membuka `/dashboard/tiket`; API hanya mengembalikan tiket order lunas. Satu peserta memiliki satu QR token, tanpa PII dalam QR.

Jika checkout timeout/hasil belum diketahui, peserta dapat membuka kembali checkout dari halaman hasil atau dashboard. Backend melanjutkan attempt existing dengan idempotency key yang sama; UI tidak membuat payment ID atau status sendiri. Jangan membuat order baru otomatis. Jika callback terlambat, status peserta tetap tidak berubah dari browser; admin dapat memasukkan nomor referensi order pada `/admin/hari-santri-operations` untuk meminta rekonsiliasi server-to-server. Hasil PAID yang datang setelah stok/reservasi dilepas ditampilkan sebagai `paid_needs_review`, tanpa link tiket.

### Pelacakan status akun dan tombol tindakan

Header, menu mobile, dan tombol mengambang menggunakan `useHariSantriRegistration`, bukan status tetap atau pelacakan paket delegate/exhibitor legacy. Status dibaca ulang saat login, navigasi, fokus tab, dan setelah penyimpanan peserta/pengajuan tenant.

- Tanpa akun: **Daftar Peserta / Register Participants** menuju pembuatan akun.
- Akun tanpa order aktif: **Lanjutkan Pendaftaran / Continue Registration** menuju `/daftar`.
- Order draft/pending/partially_paid atau memiliki tindakan `continue_payment`: **Lanjutkan Pembayaran / Continue Payment** menuju pembayaran dengan `order_id` yang sama.
- Order lunas tanpa order tertunda lain: **Lihat Tiket / View Tickets**; tombol mengambang pendaftaran disembunyikan.
- Kegagalan API ditampilkan sebagai peringatan dengan tombol coba lagi; tidak dianggap sebagai belum mendaftar.

Data berasal dari `GET /events`, `GET /orders?event_id=...` (seluruh halaman, hanya order milik akun), dan `GET /bazaar/me/applications`. Order dibatasi event yang dikonfigurasi; kelunasan mengikuti status/progres server, bukan redirect checkout. Pengajuan tenant dilacak terpisah dan mengubah menu menjadi **Status Pengajuan Tenant / Tenant Application Status**, tanpa menganggapnya sebagai order pembayaran peserta.

## Alur bazar dan staf

- `/daftar-tenant` mengirim pengajuan terpisah ke `POST /bazaar/applications`; pengajuan bukan order tiket dan belum memicu pembayaran biaya stan.
- `/dashboard/tiket` membuat QR lokal dari signed opaque token API. QR dapat dibagikan, sehingga scanner tetap online.
- `/staff/scan` menggunakan ZXing untuk kamera dan fallback input token. `POST /hari-santri/staff/checkins` memvalidasi tiket dan menolak pemakaian ulang.
- Halaman check-in dapat digunakan role `checkin_staff`, `organizer`, dan `admin`. Admin menetapkan role terbatas itu dari **User & role management**; akun petugas tidak mendapat akses admin.
- `/dashboard/voucher` menampilkan seluruh voucher reward peserta, QR voucher, saldo, expiry 15 November 2026, dan riwayat pemakaian.
- `/exhibitor/scanner` menggunakan ZXing untuk scan kamera/fallback input, memilih salah satu lapak akun, mengirim nominal serta password peserta ke endpoint self-service, dan menampilkan saldo/riwayat lapak tanpa input UUID. Tenant dapat mengajukan settlement seluruh saldo dan mengonfirmasi pembayaran yang diterima dari panel yang sama. Jika API mengembalikan HTTP 429, UI menampilkan pesan server dan mengunci tombol transaksi selama nilai `Retry-After`.
- Rate limit scan dihitung bersama oleh backend melalui PostgreSQL, jadi batas akun tetap berlaku ketika request dilayani worker API yang berbeda. Frontend mengikuti `Retry-After` dari response 429 sebelum mengaktifkan kembali tombol transaksi.
- `/admin/vouchers` mendukung penerbitan reward manual, adjustment saldo, revoke voucher bersaldo nol, pembuatan settlement, dan konfirmasi pembayaran settlement. Peserta, voucher, exhibitor, dan settlement dipilih dari dropdown hasil API; admin tidak perlu menyalin UUID.
- `/admin/audit-vouchers` menampilkan jejak penerbitan voucher, scan berhasil/gagal, adjustment saldo, dan settlement. Admin dapat memfilter jenis aktivitas, memilih jumlah baris, serta melihat nama actor dan payload tanpa token QR atau password.
- `/admin/hari-santri-operations` menampilkan callback terverifikasi yang pending, diproses, completed, atau dead-letter; admin dapat menjadwalkan ulang callback dead-letter setelah memeriksa event pada Payment Portal. Form rekonsiliasi menerima nomor referensi order (bukan UUID), menampilkan status Payment Portal dan status order lokal, serta tidak membuka atau menyimpan credential Portal di browser. Expiry reservasi berjalan dari worker terjadwal backend.
- Di halaman operasional yang sama, admin dapat memasukkan nomor referensi order untuk memicu lookup server-to-server Payment Portal saat callback terlambat; browser tidak menetapkan status pembayaran.
- Payment status pada halaman peserta tetap hanya membaca status backend dan tidak pernah menandai order lunas berdasarkan return URL/query browser.

## Environment dan menjalankan

Frontend hanya membutuhkan konfigurasi public:

```env
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NUXT_PUBLIC_API_BASE_PATH=/api/v1
NUXT_PUBLIC_EVENT_SLUG=hari-santri-2026
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_APP_NAME=Hari Santri 2026
```

Jalankan `npm install`, `npm run dev`, lalu buka `http://localhost:3000`. Production wajib mengisi domain API/site yang benar; secret Portal Payment hanya berada pada backend Event/Payment Portal.

## Implementasi sekarang dan gap

Halaman beranda, register akun, daftar keluarga dengan selector wilayah berantai, dashboard, pembayaran, hasil callback, tiket, scanner check-in, voucher peserta, scanner voucher tenant, admin voucher/settlement/audit, dan pengajuan tenant sudah dipetakan. UI paket dinamis bergantung pada event dan produk yang dibuat admin. Admin juga melihat rekonsiliasi kredit/settlement per tenant serta callback outbox dan manual lookup payment berdasarkan referensi order. Tenant media/keputusan lanjutan, privacy/terms Hari Santri yang disahkan, peta GeoJSON dan CMS konten masih menjadi backlog. Detail backlog lintas repo ada di `fastapi-hari-santri/docs/HARI_SANTRI_TODO.md`.
