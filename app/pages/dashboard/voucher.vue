<template>
  <section class="wallet-page">
    <div class="wallet-inner">
      <p class="eyebrow">HARLAH NU KE-101 / VOUCHER</p>
      <h1>Kartu voucher belanja</h1>
      <p class="intro">Tiket peserta untuk check-in dan voucher belanja adalah dua QR berbeda. Tunjukkan QR voucher kepada tenant saat berbelanja.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="success" class="success" role="status">{{ success }}</p>
      <p v-if="loading" class="state">Memuat voucher…</p>
      <div v-else-if="!vouchers.length" class="empty">Belum ada voucher reward yang diterbitkan admin untuk peserta Anda.</div>
      <div v-else class="voucher-list">
        <article v-for="voucher in vouchers" :key="voucher.voucher_id" class="voucher-card">
          <div class="voucher-pattern"></div>
          <div class="voucher-copy">
            <div class="voucher-brand"><span class="brand-mark">NU</span><span>Harlah NU ke-101<br><small>Dari pesantren untuk negeri</small></span></div>
            <span class="eyebrow">VOUCHER BELANJA UMKM</span>
            <h2>{{ money(voucher.balance) }}</h2>
            <p class="voucher-status">Status: <strong>{{ voucher.status }}</strong></p>
            <p class="voucher-meta">Pemilik: <strong>{{ voucher.participant_name }}</strong></p>
            <p class="voucher-meta">Berlaku sampai {{ formatDate(voucher.expires_at) }}</p>
            <p class="voucher-note">Tunjukkan QR ini kepada tenant saat melakukan pembayaran. Voucher ini bersifat pribadi dan tidak dapat dipindahtangankan.</p>
          </div>
          <div class="voucher-qr">
            <div class="qr-frame"><img v-if="qrById[voucher.voucher_id]" :src="qrById[voucher.voucher_id]" :alt="`QR voucher ${voucher.participant_name}`"></div>
            <span>PINDAI DI TENANT</span>
          </div>
        </article>
      </div>
      <div class="panel print-hide"><div class="panel-heading"><h2>Riwayat pemakaian</h2><div class="panel-actions"><button type="button" class="button secondary" :disabled="loading" @click="load">Muat ulang</button><button type="button" class="button primary" @click="printVouchers">Cetak voucher</button></div></div><p v-if="!transfers.length" class="state">Belum ada transaksi voucher.</p><div v-else class="table-wrap"><table><thead><tr><th>Waktu</th><th>Nominal</th><th>Keterangan</th></tr></thead><tbody><tr v-for="row in transfers" :key="row.transfer_id"><td>{{ formatDate(row.created_at) }}</td><td>{{ money(row.amount) }}</td><td>Terpakai di tenant</td></tr></tbody></table></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';
import type { ParticipantVoucher, WalletTransfer } from '~/composables/useVoucherWallet';
import { useVoucherWallet } from '~/composables/useVoucherWallet';

definePageMeta({ middleware: 'auth' });
const walletApi = useVoucherWallet();
const vouchers = ref<ParticipantVoucher[]>([]);
const transfers = ref<WalletTransfer[]>([]);
const qrById = reactive<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const success = ref('');
const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const printVouchers = () => window.print();
const load = async () => {
  loading.value = true; error.value = '';
  try {
    const [voucherResult, transferResult] = await Promise.all([walletApi.listMyVouchers(), walletApi.myTransfers()]);
    vouchers.value = voucherResult.data; transfers.value = transferResult.data;
    for (const voucher of vouchers.value) if (voucher.qr_token) qrById[voucher.voucher_id] = await QRCode.toDataURL(voucher.qr_token, { width: 220, margin: 1, errorCorrectionLevel: 'M' });
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Voucher belum dapat dimuat.'; } finally { loading.value = false; }
};
onMounted(() => { void load(); });
useSeoMeta({ title: 'Voucher Belanja | Harlah NU ke-101' });
</script>

<style scoped>
.wallet-page { min-height:72vh; background: #f5f5ef; color:#17352c; padding:3rem max(1rem,calc((100vw - 1000px)/2)); }
.wallet-inner { max-width:1000px; margin:auto; }
.eyebrow { color:#2d7258; font-size:.72rem; font-weight:800; letter-spacing:.12em; }
.intro { max-width:48rem; color:#596d61; line-height:1.7; }
.voucher-list { display:grid; gap:1.25rem; margin:2rem 0; }
.voucher-card { position:relative; isolation:isolate; overflow:hidden; display:grid; grid-template-columns:1fr 15rem; gap:1rem; align-items:center; background:linear-gradient(135deg,#fffdf7 0%,#f4fbf0 55%,#e9ddf3 100%); border:1px solid #d4af37; border-radius:1.5rem; padding:1.5rem; box-shadow:0 18px 35px rgba(45,19,77,.12); }
.voucher-card::before,.voucher-card::after { content:""; position:absolute; border:1px solid rgba(212,175,55,.34); border-radius:999px; z-index:-1; }
.voucher-card::before { width:14rem; height:14rem; right:-6rem; top:-7rem; }
.voucher-card::after { width:9rem; height:9rem; left:-5rem; bottom:-5rem; }
.voucher-pattern { position:absolute; inset:0; z-index:-1; opacity:.65; background-image:radial-gradient(circle at 15% 25%,rgba(244,10,8,.07) 0 2px,transparent 2.5px),linear-gradient(135deg,transparent 45%,rgba(45,19,77,.06) 46% 47%,transparent 48%); background-size:25px 25px,50px 50px; }
.voucher-brand { display:flex; align-items:center; gap:.65rem; color:#075b36; font-weight:900; font-size:.9rem; line-height:1.25; text-transform:uppercase; letter-spacing:.08em; margin-bottom:1.4rem; }
.voucher-brand small { color:#496255; font-size:.58rem; letter-spacing:.1em; }
.brand-mark { display:grid; place-items:center; width:2.35rem; height:2.35rem; border-radius:50%; background:#075b36; color:#d4af37; font-size:.7rem; letter-spacing:0; }
.voucher-copy h2 { color:#075b36; font:900 2.5rem Georgia,serif; margin:.6rem 0; }
.voucher-copy p { color:#65776b; }
.voucher-status { display:inline-block; border-radius:999px; background:#fff0d7; color:#865318 !important; padding:.3rem .65rem; font-size:.8rem; }
.voucher-meta { font-size:.9rem; margin-top:.35rem; }
.voucher-note { max-width:34rem; border-top:1px solid rgba(45,19,77,.15); margin-top:1rem; padding-top:.8rem; font-size:.78rem; line-height:1.6; }
.voucher-qr { display:grid; place-items:center; gap:.7rem; color:#075b36; font-size:.65rem; font-weight:900; letter-spacing:.22em; }
.qr-frame { border:6px solid #075b36; border-radius:1.25rem; background:#fff; padding:.65rem; box-shadow:0 8px 0 #d4af37; }
.voucher-qr img { display:block; width:12.5rem; height:12.5rem; }
.panel { background:#fff; border:1px solid #d9e0d8; padding:1.25rem; }
.panel-heading { display:flex; justify-content:space-between; gap:1rem; align-items:center; }
.panel-actions { display:flex; flex-wrap:wrap; gap:.5rem; }
.panel h2 { font:1.35rem Georgia,serif; }
.button { border:1px solid #b8c9bd; border-radius:.5rem; padding:.65rem .9rem; font-weight:800; background:#fff; cursor:pointer; }
.secondary { color:#275d46; }.primary { border-color:#075b36; background:#075b36; color:#fff; }
.state,.empty,.error,.success { margin-top:1.2rem; padding:1rem; border-block:1px solid #d9e0d8; }
.error { color:#9a3022; }.success { color:#21623b; }
.table-wrap { overflow:auto; } table { width:100%; border-collapse:collapse; } th,td { text-align:left; padding:.75rem; border-bottom:1px solid #edf1ed; } th { font-size:.7rem; letter-spacing:.1em; color:#6c7e72; }
@media(max-width:640px){.wallet-page{padding:2rem 1rem}.voucher-card{grid-template-columns:1fr;padding:1.15rem}.voucher-qr{justify-content:start;place-items:start}.voucher-qr img{width:11rem;height:11rem}.panel-heading{align-items:flex-start;flex-direction:column}.panel-actions{width:100%}.button{flex:1}.voucher-copy h2{font-size:2.2rem}}
@media print { .wallet-page{padding:0;background:#fff}.wallet-inner> :not(.voucher-list){display:none!important}.voucher-list{margin:0;gap:1rem}.voucher-card{break-inside:avoid;box-shadow:none;print-color-adjust:exact;-webkit-print-color-adjust:exact}.print-hide{display:none!important} }
</style>
