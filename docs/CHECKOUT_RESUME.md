# Pemulihan pesanan Harlah NU

Login memeriksa pesanan server sebelum memilih redirect. Pesanan aktif mengalahkan
redirect ke formulir pendaftaran. Order lunas menuju tiket; pembayaran yang perlu
ditinjau menuju halaman status, bukan pendaftaran ulang.

`/daftar` memeriksa ulang order saat dibuka dan sebelum submit. Jika peserta sudah
tersimpan, arahkan ke pembayaran order yang sama. Jika peserta belum tersimpan,
kunci paket sesuai order dan lengkapi peserta tanpa membuat order baru. Setelah
timeout, baca kembali server sebelum mencoba lagi. Kegagalan memeriksa status
tidak boleh dianggap sebagai tidak adanya pesanan.

Tombol pembayaran tidak menerima klik paralel. Backend memperbarui token checkout
untuk payment ID yang sama. Status lunas tetap hanya berasal dari server.

Uji: `node scripts/test-hari-santri-registration.mjs`,
`node scripts/test-checkout-recovery.mjs`, dan `npx vue-tsc --noEmit`.
