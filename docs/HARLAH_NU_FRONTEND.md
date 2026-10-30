# Kontrak Frontend Harlah NU ke-101

Portal ini menggunakan tema web Harlah NU ke-101 untuk acara Sepeda Santai dan Jalan Sehat Keluarga.

## Identitas acara

- Nama: Peringatan Harlah ke-101 Nahdlatul Ulama
- Tema: Dari Pesantren untuk Negeri
- Penyelenggara: MWC NU Tarumajaya
- Tanggal: Minggu, 31 Januari 2027
- Lokasi: Summarecon Crown Gading, Tarumajaya, Bekasi
- Rentang usia: 1926–2027 Masehi dan 1344–1447 H
- Domain: `https://harlahnu.com`
- API: `https://api.harlahnu.com`
- Slug event: `harlah-nu-101`

## Visual

Hero beranda menggunakan `app/assets/images/hero_harlah_nu_101.png`, yaitu aset hero Sepeda Santai dan Jalan Sehat Keluarga Harlah NU yang disediakan panitia.

Aset desain kaos peserta:

- Sepeda Santai: `app/assets/images/kaos-sepeda-santai.png`
- Jalan Sehat Keluarga: `app/assets/images/kaos-jalan-sehat.png`

Biaya pendaftaran yang harus dikonfigurasi pada server dan tampil pada pemilihan jenis kegiatan:

- Sepeda Santai: Rp75.000
- Jalan Sehat Keluarga: Rp25.000

Istilah publik yang digunakan pada beranda, formulir, dashboard, dan admin adalah **Jenis Kegiatan** dan **Biaya Pendaftaran**. Field API `price` serta tipe internal `hari_santri_package` dipertahankan demi kompatibilitas.

Seeder backend yang idempotent untuk memperbarui harga dan mengaktifkan paket:
`fastapi-hari-santri/scripts/seed_harlah_nu_101_packages.py`.

Palet utama mengikuti dokumentasi `fastapi-hari-santri/docs/Tema Web Harlah NU ke-101.pdf`:

- Hijau tua utama: `#075b36`
- Hijau muda aksen: `#85be36`
- Emas aksen: `#f8b815`
- Latar terang: `#faf9f5`

## Aturan konten

Bahasa publik portal adalah Bahasa Indonesia. Harga, kuota, jadwal rinci, rute, pengisi acara, hadiah, voucher, dan kontak hanya ditampilkan sebagai informasi resmi setelah dikonfirmasi panitia.

Alur peserta, tenant, voucher, donasi, pembayaran, callback, dan tiket tetap menggunakan API Hari Santri/Harlah NU yang sudah ada. Rebranding tidak mengubah kontrak pembayaran atau status tiket.

## Build statis

```powershell
$env:NUXT_PUBLIC_API_BASE_URL='https://api.harlahnu.com'
$env:NUXT_PUBLIC_SITE_URL='https://harlahnu.com'
$env:NUXT_PUBLIC_EVENT_SLUG='harlah-nu-101'
$env:NUXT_PUBLIC_APP_NAME='Harlah NU ke-101'
npm run generate
```
