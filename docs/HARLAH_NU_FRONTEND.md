# Dokumentasi Frontend Portal Harlah NU ke-101

Dokumen ini adalah acuan integrasi frontend `harlahnu.com` dengan backend Portal Event Harlah NU. Semua endpoint menggunakan path relatif terhadap base API production.

## Identitas dan alamat layanan

- Frontend: `https://harlahnu.com`
- Backend: `https://api.harlahnu.com`
- API prefix: `/api/v1`
- API base lengkap: `https://api.harlahnu.com/api/v1`
- Slug event: `harlah-nu-101`
- Bahasa publik: Bahasa Indonesia (`id`)
- Acara: Peringatan Harlah ke-101 Nahdlatul Ulama
- Tema: Dari Pesantren untuk Negeri
- Penyelenggara: MWC NU Tarumajaya
- Tanggal: Minggu, 31 Januari 2027
- Lokasi: Summarecon Crown Gading, Tarumajaya, Bekasi
- Masehi: Harlah NU ke-101, 1926–2027
- Hijriah: Harlah NU ke-104, 16 Rajab 1344–1448 H

## Konfigurasi frontend

Environment production minimum:

```dotenv
NUXT_PUBLIC_API_BASE_URL=https://api.harlahnu.com
NUXT_PUBLIC_API_BASE_PATH=/api/v1
NUXT_PUBLIC_SITE_URL=https://harlahnu.com
NUXT_PUBLIC_EVENT_SLUG=harlah-nu-101
NUXT_PUBLIC_APP_NAME=Harlah NU ke-101
```

Build statis production:

```powershell
$env:NUXT_PUBLIC_API_BASE_URL='https://api.harlahnu.com'
$env:NUXT_PUBLIC_API_BASE_PATH='/api/v1'
$env:NUXT_PUBLIC_SITE_URL='https://harlahnu.com'
$env:NUXT_PUBLIC_EVENT_SLUG='harlah-nu-101'
$env:NUXT_PUBLIC_APP_NAME='Harlah NU ke-101'
npm run generate
```

Build production ditolak jika API atau site URL masih menunjuk ke localhost. Token akses dikirim sebagai `Authorization: Bearer <token>`. Credential Payment Portal, DOKU, Midtrans, dan SMTP tidak boleh berada dalam bundle frontend.

## Fitur dan halaman utama

| Fitur | Halaman frontend | Keterangan |
| --- | --- | --- |
| Beranda dan artikel | `/`, `/sejarah-nu`, `/nu-dan-dakwah-walisongo`, dan halaman editorial | Konten acara, sejarah NU, agenda, hadiah, dan artikel sejarah. |
| Akun | `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password` | Registrasi, login, pengiriman tautan reset, dan kata sandi baru. |
| Dashboard peserta | `/dashboard` | Ringkasan pesanan, peserta, tiket, voucher, donasi, dan akses cepat. |
| Pendaftaran peserta | `/daftar` | Jenis Kegiatan, peserta keluarga, ukuran kaos, dan wilayah. |
| Pesanan dan pembayaran | `/dashboard/payment`, `/pembayaran/hasil` | Hosted checkout Payment Portal dan pemeriksaan hasil server. |
| Invoice | `/dashboard/invoice` | Seluruh invoice per order, rincian peserta dan pembayaran, serta cetak/simpan PDF. |
| Tiket | `/dashboard/tiket` | Seluruh tiket digital dan QR per peserta dari setiap order lunas, termasuk tampilan cetak/PDF. |
| Donasi | `/donasi`, `/dashboard/donasi` | Membuat donasi dan melihat riwayat serta status konfirmasi. |
| Bazar | `/daftar-tenant` | Pengajuan exhibitor dapat berdiri sendiri atau bersama pendaftaran peserta. |
| Voucher peserta | `/dashboard/voucher` | QR voucher, saldo, dan riwayat transaksi. |
| Scanner exhibitor | `/exhibitor/scanner` | Pemotongan saldo voucher dan riwayat transaksi lapak. |
| Laporan Harlah | `/admin/harlah-reports` | Pembayaran pendaftaran dan donasi, filter, ringkasan, serta CSV. |
| Laporan peserta | `/admin/participants-report` | Profil, kegiatan, order, dan pembayaran peserta. |
| Operasi pembayaran | `/admin/hari-santri-operations` | Audit log, callback outbox, dan retry callback. |
| Voucher dan settlement | `/admin/vouchers` | Penerbitan, adjustment, revoke, transaksi, dan rekonsiliasi settlement. |
| Pengaturan email | `/admin/email-notifications` | Template, preview, test-send, preferensi, dan riwayat pengiriman. |
| Check-in | `/staff/scan`, `/admin/attendance` | Scan tiket QR dan laporan kehadiran. |

## Aturan bisnis pendaftaran

- Istilah publik adalah **Jenis Kegiatan** dan **Biaya Pendaftaran**, bukan paket dan harga.
- Sepeda Santai: Rp75.000 per peserta.
- Jalan Sehat Keluarga: Rp25.000 per peserta.
- Satu akun hanya boleh memilih satu jenis kegiatan peserta. Peserta tambahan harus memakai jenis kegiatan yang sama.
- Akun boleh mendaftar sebagai peserta, exhibitor, keduanya, atau hanya memberikan donasi.
- Nominal final, fee, status lunas, dan penerbitan tiket selalu mengikuti backend. Frontend tidak menetapkan status sukses dari redirect browser.

## Konvensi respons API

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {
    "page": 1,
    "size": 20,
    "total": 0,
    "pages": 0
  }
}
```

`meta` tersedia pada endpoint berpaginasi. Status, provider, channel, dan kode error tetap berupa machine value kanonis dari backend.

## API akun dan profil

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `POST` | `/auth/register` | Membuat akun peserta. |
| `POST` | `/auth/login` | Login dan memuat snapshot alur pendaftaran. |
| `POST` | `/auth/refresh` | Memperbarui access token. |
| `POST` | `/auth/logout` | Mengakhiri sesi. |
| `GET` / `PUT` | `/auth/me` | Membaca dan memperbarui akun aktif. |
| `GET` | `/auth/users/{user_id}` | Detail status pendaftaran setelah login. |
| `POST` | `/auth/forgot-password` | Mengirim tautan reset ke email. |
| `POST` | `/auth/reset-password` | Kata sandi baru dari token email. |
| `PUT` | `/auth/password` | Mengganti kata sandi dari dashboard. |
| `GET` / `PUT` / `PATCH` | `/participants/me` | Profil peserta aktif. |
| `POST` | `/participants/me/photo` | Foto profil peserta. |
| `GET` | `/regions` | Provinsi, kabupaten/kota, kecamatan, dan desa. |

## API event, produk, dan pendaftaran

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `GET` | `/events` | Mencari event berdasarkan slug production. |
| `GET` | `/events/{event_id}` | Detail event. |
| `GET` | `/events/{event_id}/shirt-sizes` | Ukuran dan inventori kaos. |
| `GET` | `/store/events/{event_id}/products` | Jenis kegiatan dan produk aktif. |
| `GET` | `/store/events/{event_id}/cart` | Keranjang akun. |
| `POST` | `/store/events/{event_id}/cart/items` | Menambah jenis kegiatan atau produk. |
| `DELETE` | `/store/events/{event_id}/cart/items/{product_id}` | Menghapus item keranjang. |
| `POST` | `/store/events/{event_id}/checkout` | Membentuk order sebelum peserta dan pembayaran. |
| `GET` / `PUT` | `/orders/{order_id}/participants` | Membaca atau menyimpan peserta keluarga. |
| `GET` | `/registrations/me` | Daftar registrasi milik akun. |

## API Payment Portal dan rekonsiliasi

Alur berlaku: frontend → backend event → Payment Portal → DOKU/Midtrans. Frontend hanya membuka `payment_url` dari backend.

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `POST` | `/hari-santri/orders/{order_id}/checkout` | Membuat atau melanjutkan hosted checkout. |
| `GET` | `/hari-santri/orders/{order_id}/payment-status` | Status order dan payment terbaru. |
| `POST` | `/hari-santri/orders/{order_id}/payment-reconcile` | Inquiry manual saat callback belum diterima. |
| `POST` | `/integrations/payment-portal/callback` | Callback server-to-server Payment Portal. |
| `GET` | `/orders` | Riwayat order dan attempt pembayaran akun. |
| `GET` | `/orders/{order_id}` | Ringkasan order. |
| `GET` | `/orders/{order_id}/detail` | Detail item dan attempt pembayaran. |
| `GET` | `/payments/{payment_id}` | Status payment tertentu. |
| `GET` | `/hari-santri/me/invoices` | Daftar invoice Harlah NU milik akun, dikelompokkan per order beserta item, peserta, dan pembayaran. |
| `GET` | `/payments/me/invoices` | Invoice pembayaran generik/legacy akun. |
| `GET` | `/payments/registrations/{registration_ref}/invoice` | Invoice registrasi generik/legacy. |

Catatan:

- `POST /orders/{order_id}/continue-payment` adalah guard legacy dan tidak boleh dipakai untuk checkout Harlah NU.
- Checkout gateway langsung dan webhook gateway tidak diekspos oleh router portal event; semuanya dikelola Payment Portal.
- Redirect sukses bukan bukti lunas. Halaman hasil memanggil status server dan dapat menjalankan reconcile.
- Callback wajib idempoten agar tidak menerbitkan tiket ganda.
- Satu akun boleh memiliki beberapa order untuk keluarga dan/atau exhibitor. Dashboard tidak boleh hanya mengambil order terbaru.
- Invoice Harlah NU mengikuti satu order. Tombol **Cetak / Simpan PDF** memakai dialog cetak browser sehingga peserta dapat memilih printer atau `Save as PDF` tanpa mengubah status transaksi.

## API donasi

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `POST` | `/donations` | Membuat donasi dan hosted checkout; `request_id` untuk idempotensi. |
| `GET` | `/donations/{reference_id}/status` | Memeriksa status donasi. |
| `GET` | `/hari-santri/me/donations` | Riwayat donasi akun beserta ringkasan dan paginasi. |
| `GET` | `/admin/hari-santri/reports/donations` | Laporan donasi admin dengan filter. |
| `GET` | `/admin/hari-santri/reports/donations.csv` | Ekspor laporan donasi. |
| `POST` | `/admin/hari-santri/donations/{reference_id}/reconcile` | Rekonsiliasi manual donasi. |

Dashboard donasi menampilkan jumlah record, jumlah terkonfirmasi, total nominal terkonfirmasi, detail payment, dan status tiap donasi.

## API tiket dan kehadiran

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `GET` | `/hari-santri/me/tickets` | Tiket Harlah NU per peserta termasuk QR token. |
| `GET` | `/tickets/me` | Daftar tiket generik akun. |
| `GET` | `/tickets/{ticket_id}/qr` | Gambar dan token QR tiket. |
| `POST` | `/tickets/{ticket_id}/reissue` | Menerbitkan ulang tiket bila diizinkan. |
| `POST` | `/hari-santri/staff/checkins` | Check-in tiket Harlah NU. |
| `POST` | `/attendance/scan` | Scan kehadiran event. |
| `GET` | `/attendance/events/{event_id}/report` | Laporan peserta terdaftar dan hadir. |

Tiket dirender setelah backend menerima konfirmasi lunas. Satu peserta memperoleh satu tiket dan satu QR unik. Halaman tiket menggabungkan tiket dari seluruh order lunas milik akun dan menyediakan layout responsif yang dapat dicetak atau disimpan sebagai PDF.

## API bazar, voucher, dan settlement

| Metode | Endpoint | Penggunaan frontend |
| --- | --- | --- |
| `POST` | `/bazaar/applications` | Mengajukan tenant/exhibitor. |
| `GET` | `/bazaar/me/applications` | Riwayat pengajuan akun. |
| `GET` | `/hari-santri/me/wallets` | Voucher peserta dan saldo aktif. |
| `GET` | `/hari-santri/me/wallet/transfers` | Riwayat belanja voucher. |
| `GET` | `/hari-santri/me/exhibitors` | Lapak milik akun exhibitor. |
| `GET` | `/hari-santri/me/exhibitors/{exhibitor_id}/wallet` | Saldo lapak. |
| `GET` | `/hari-santri/me/exhibitors/{exhibitor_id}/wallet/transfers` | Riwayat transaksi lapak. |
| `POST` | `/hari-santri/me/exhibitors/{exhibitor_id}/wallet/charge` | Memotong voucher peserta secara idempoten. |
| `POST` | `/hari-santri/me/exhibitors/{exhibitor_id}/settlements` | Mengajukan settlement. |
| `POST` | `/hari-santri/me/exhibitor/settlements/{settlement_id}/confirm` | Konfirmasi settlement exhibitor. |

Admin mengelola voucher melalui `/admin/hari-santri/vouchers`, peserta eligible melalui `/admin/hari-santri/voucher-participants`, exhibitor melalui `/admin/hari-santri/exhibitors/approved`, dan rekonsiliasi melalui `/admin/hari-santri/settlements/reconciliation`.

## API laporan admin

| Metode | Endpoint | Isi laporan |
| --- | --- | --- |
| `GET` | `/admin/hari-santri/reports/payments` | Pembayaran pendaftaran Harlah NU. |
| `GET` | `/admin/hari-santri/reports/payments.csv` | CSV pembayaran pendaftaran. |
| `GET` | `/admin/hari-santri/reports/donations` | Donasi peserta dan publik. |
| `GET` | `/admin/hari-santri/reports/donations.csv` | CSV donasi. |
| `GET` | `/admin/reports/participants` | Profil, tanggal masuk, daerah asal, registrasi, jenis kegiatan, order, dan payment. |
| `GET` | `/admin/reports/participants.csv` | CSV peserta dengan kontrak tanggal dan wilayah yang sama. |
| `GET` | `/admin/transactions` | Transaksi lintas provider, read-only di portal event. |
| `GET` | `/admin/hari-santri/audit-logs` | Audit voucher, settlement, dan operasi. |
| `GET` | `/admin/hari-santri/operations/callback-outbox` | Callback tertunda atau gagal. |
| `POST` | `/admin/hari-santri/operations/callback-outbox/{outbox_id}/retry` | Mengulang callback secara aman. |

Filter laporan Harlah: `search`, `status`, `date_from`, `date_to`, `page`, dan `size`. Ringkasan memuat total record, paid, pending, dan total nominal terkonfirmasi.

Laporan peserta menampilkan **Tanggal masuk** dari `registered_at` (tanggal order/pendaftaran pertama), dengan `account_created_at` sebagai fallback. **Daerah asal** memakai `origin_region` dengan hierarki nama `desa/kelurahan, kecamatan, kabupaten/kota` dari master wilayah backend. Field rinci yang tersedia adalah pasangan kode/nama `village`, `district`, `regency`, dan `province`. Nilai negara seperti `Indonesia` tidak dipakai sebagai pengganti alamat wilayah yang belum lengkap. Bila wilayah kosong, UI menampilkan **Belum tersedia**. Kontrak yang sama digunakan pada ekspor CSV dan dijelaskan lengkap di `fastapi-hari-santri/docs/PARTICIPANT_REPORTING.md`.

## API konten dan operasional admin

- Pengguna: `GET/POST /admin/users` dan `PUT /admin/users/{user_id}`.
- Jenis kegiatan/produk: `/store/admin/events/{event_id}/products` dan `/store/admin/products/{product_id}`.
- Ukuran kaos: `/admin/events/{event_id}/shirt-sizes` dan `/admin/shirt-sizes/{size_id}`.
- Pengumuman: `/admin/events/{event_id}/announcements` dan `/admin/announcements/{id}`.
- Sertifikat: `/admin/events/{event_id}/certificates` dan `/admin/certificates/{id}`.
- Agenda: `/sessions` dan `/sessions/{session_id}`.
- Pembicara: `/speakers` dan `/speakers/{speaker_id}`.
- Panitia: `/admin/committee` termasuk foto dan hapus.
- Terjemahan konten: `/admin/content-translations`.
- Template email: `/admin/events/{event_id}/email-notifications`.
- Preview/test email: `/admin/events/{event_id}/email-notifications/{trigger}/preview` dan `/test-send`.
- Riwayat email: `/admin/events/{event_id}/email-notifications/logs/history`.

## Komponen dan composable reusable

- `useApi.ts`: base URL, token, locale, error normalization, dan refresh session.
- `useAuth.ts`: login, registrasi, forgot/reset password, dan perubahan password.
- `useHariSantri.ts`: peserta, checkout, status, reconcile, invoice, donasi, tiket, dan bazar.
- `useAdminReport.ts`: pembayaran, donasi, peserta, transaksi, dan CSV.
- `useVoucherWallet.ts`: voucher, transfer, exhibitor wallet, settlement, audit, dan callback outbox.
- `HarlahFinanceTable.vue`: tabel reusable pembayaran/donasi peserta dan admin.
- `OrderPaymentProgress.vue` dan `OutstandingPayments.vue`: status order yang belum selesai.
- `LocalCurrencyAmounts.vue` dan `ParticipantProfileDialog.vue`: nominal dan profil yang konsisten.

## Visual dan istilah

- Hijau tua: `#075b36`
- Hijau muda: `#85be36`
- Emas: `#f8b815`
- Latar terang: `#faf9f5`
- Hero: `app/assets/images/hero_harlah_nu_101.png`
- Kaos Sepeda Santai: `app/assets/images/kaos-sepeda-santai.png`
- Kaos Jalan Sehat Keluarga: `app/assets/images/kaos-jalan-sehat.png`

Field internal seperti `price`, `package_id`, dan `hari_santri_package` dipertahankan untuk kompatibilitas API. Teks publik menggunakan **Biaya Pendaftaran** dan **Jenis Kegiatan**.

## Verifikasi perubahan

```powershell
npx vue-tsc --noEmit
npm run generate
```

Pemeriksaan minimum:

1. Login, forgot password, dan reset password berhasil.
2. Pendaftaran menyimpan peserta dan jenis kegiatan yang benar.
3. Checkout membuka Payment Portal, bukan gateway langsung.
4. Halaman hasil memeriksa status server dan reconcile dapat dijalankan.
5. Tiket QR muncul setelah order terkonfirmasi lunas.
6. Beberapa order dalam satu akun tetap tampil seluruhnya pada pembayaran, invoice, dan tiket.
7. `/dashboard/invoice` dapat berpindah antar-invoice dan menghasilkan cetakan/PDF dengan rincian yang sesuai order.
8. Riwayat donasi dan laporan pembayaran/donasi admin dapat dimuat.
9. Ekspor CSV mengikuti filter.
10. Callback outbox dapat di-retry tanpa transaksi atau tiket ganda.
11. Halaman desktop dan mobile tidak overflow pada tabel, QR, invoice, atau tombol.

OpenAPI backend adalah sumber kebenaran terakhir untuk schema request/response. Dokumen ini menjelaskan kontrak yang dipakai frontend dan harus diperbarui bersama perubahan backend berikutnya.
