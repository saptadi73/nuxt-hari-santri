# Checklist Bahasa Indonesia / English

## Selesai

- [x] Nuxt i18n menggunakan `id` sebagai default dan `en` sebagai bahasa kedua.
- [x] Cookie `hari_santri_locale` menyimpan pilihan bahasa.
- [x] Header, navigasi, footer, beranda, autentikasi, pendaftaran keluarga, dashboard, pembayaran, tiket, scanner, dan pengajuan bazar memiliki copy `id` dan `en`.
- [x] API menerima `Accept-Language` dan locale query untuk konten publik.
- [x] Pergantian bahasa memperbarui cookie, atribut `html lang`, title, dan copy halaman.
- [x] Typecheck, build produksi, serta uji responsive desktop/mobile sudah dijalankan.

## Berikutnya

- [ ] Review copy Indonesia dan English oleh penutur yang ditunjuk panitia.
- [ ] Lengkapi terjemahan untuk konten CMS dinamis setelah agenda, rute, paket, hadiah, dan sponsor disahkan.
- [ ] Audit aksesibilitas keyboard, screen reader, alt text, dan pesan validasi pada setiap halaman baru.
- [ ] Uji locale pada sandbox dan domain produksi.

## Aturan

- Semua string baru yang terlihat pengguna wajib tersedia dalam `id` dan `en`.
- Indonesia adalah default untuk pengguna baru dan halaman publik.
- Jangan menambahkan bahasa atau istilah produk pembayaran ke frontend tanpa perubahan kontrak backend.
- Status dan error code API tetap canonical untuk logika aplikasi; hanya pesan tampilannya yang diterjemahkan.
