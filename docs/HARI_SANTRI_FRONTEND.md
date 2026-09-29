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
6. Halaman `/pembayaran/hasil` membaca `GET /hari-santri/orders/{order_id}/payment-status`. `PENDING` tetap pending; redirect atau query tidak pernah menandai lunas.
7. Setelah callback Payment Portal terverifikasi server, peserta membuka `/dashboard/tiket`; API hanya mengembalikan tiket order lunas. Satu peserta memiliki satu QR token, tanpa PII dalam QR.

Jika checkout timeout/hasil belum diketahui, periksa status order dan minta backend melanjutkan payment existing dengan idempotency yang sama. Jangan membuat order baru otomatis. Jika callback terlambat, tunggu status backend atau arahkan peserta ke kontak resmi.

## Alur bazar dan staf

- `/daftar-tenant` mengirim pengajuan terpisah ke `POST /bazaar/applications`; pengajuan bukan order tiket dan belum memicu pembayaran biaya stan.
- `/dashboard/tiket` membuat QR lokal dari signed opaque token API. QR dapat dibagikan, sehingga scanner tetap online.
- `/staff/scan` menggunakan ZXing untuk kamera dan fallback input token. `POST /hari-santri/staff/checkins` memvalidasi tiket dan menolak pemakaian ulang.
- Saat ini check-in dibatasi role `admin`/`organizer`; role petugas khusus belum tersedia.

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

Halaman beranda, register akun, daftar keluarga dengan selector wilayah berantai, dashboard, pembayaran, hasil callback, tiket, scanner dan pengajuan tenant sudah dipetakan. UI paket dinamis bergantung pada event dan produk yang dibuat admin. Belum lengkap: editor metadata activity/min/max, edit roster sampai deadline, payment status lookup server-to-server jika callback hilang, tenant media/keputusan lanjutan, privacy/terms Hari Santri yang disahkan, peta GeoJSON dan CMS konten. Detail backlog lintas repo ada di `fastapi-hari-santri/docs/HARI_SANTRI_TODO.md`.
