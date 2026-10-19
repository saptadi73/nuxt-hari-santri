# Alur donasi ke Portal Payment

Donatur mengisi nama, email, dan nominal rupiah bulat positif di `/donasi`.
Frontend memanggil API donasi, menyimpan referensi donasi terpisah dari pesanan
tiket, lalu membuka `payment_url` dari backend. Portal menampilkan pilihan
MIDTRANS dan DOKU dengan logo masing-masing; kode integrasi tidak berubah.

Halaman `/pembayaran/hasil` membaca status donasi dari backend. Parameter browser
bukan bukti pembayaran. Donasi tidak menerbitkan tiket peserta.

## Verifikasi 19 Oktober 2026

- [x] Uji script Vue aktual: nominal invalid, payload donatur, klik bersamaan,
  retry dengan request ID sama, pengalihan URL, pemisahan sesi donasi/pesanan.
- [x] Empat pengujian backend terkait donasi lulus.
- [ ] Uji pembayaran donasi sampai lunas dan callback di sandbox.

Jalankan `node scripts/test-donation-payment.mjs`. Pengujian ini memakai API
mock, tidak membuat tagihan live. Request ID dipertahankan selama halaman hidup;
reload halaman bukan jaminan retry dengan ID yang sama.
