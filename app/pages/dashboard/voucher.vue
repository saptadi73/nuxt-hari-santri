<template>
  <section class="wallet-page">
    <div class="wallet-inner">
      <p class="eyebrow">HARI SANTRI 2026 / VOUCHER</p>
      <h1>Kartu voucher belanja</h1>
      <p class="intro">Tiket peserta untuk check-in dan voucher belanja adalah dua QR berbeda. Tunjukkan QR voucher kepada tenant saat berbelanja.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="success" class="success" role="status">{{ success }}</p>
      <p v-if="loading" class="state">Memuat voucher…</p>
      <div v-else-if="!vouchers.length" class="empty">Belum ada voucher reward yang diterbitkan admin untuk peserta Anda.</div>
      <div v-else class="voucher-list">
        <article v-for="voucher in vouchers" :key="voucher.voucher_id" class="voucher-card">
          <div class="voucher-copy"><span class="eyebrow">{{ voucher.participant_name }}</span><h2>{{ money(voucher.balance) }}</h2><p>Status: <strong>{{ voucher.status }}</strong></p><p>Berlaku sampai {{ formatDate(voucher.expires_at) }}</p></div>
          <div class="voucher-qr"><img v-if="qrById[voucher.voucher_id]" :src="qrById[voucher.voucher_id]" :alt="`QR voucher ${voucher.participant_name}`"></div>
        </article>
      </div>
      <div class="panel"><div class="panel-heading"><h2>Riwayat pemakaian</h2><button type="button" class="button secondary" :disabled="loading" @click="load">Muat ulang</button></div><p v-if="!transfers.length" class="state">Belum ada transaksi voucher.</p><div v-else class="table-wrap"><table><thead><tr><th>Waktu</th><th>Nominal</th><th>Keterangan</th></tr></thead><tbody><tr v-for="row in transfers" :key="row.transfer_id"><td>{{ formatDate(row.created_at) }}</td><td>{{ money(row.amount) }}</td><td>Terpakai di tenant</td></tr></tbody></table></div></div>
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
const load = async () => {
  loading.value = true; error.value = '';
  try {
    const [voucherResult, transferResult] = await Promise.all([walletApi.listMyVouchers(), walletApi.myTransfers()]);
    vouchers.value = voucherResult.data; transfers.value = transferResult.data;
    for (const voucher of vouchers.value) if (voucher.qr_token) qrById[voucher.voucher_id] = await QRCode.toDataURL(voucher.qr_token, { width: 220, margin: 1, errorCorrectionLevel: 'M' });
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Voucher belum dapat dimuat.'; } finally { loading.value = false; }
};
onMounted(() => { void load(); });
useSeoMeta({ title: 'Voucher Belanja | Hari Santri 2026' });
</script>

<style scoped>
.wallet-page{min-height:72vh;background:#f5f5ef;color:#17352c;padding:3rem max(1rem,calc((100vw - 1000px)/2))}.wallet-inner{max-width:1000px;margin:auto}.eyebrow{color:#2d7258;font-size:.72rem;font-weight:800;letter-spacing:.12em}.intro{max-width:48rem;color:#596d61;line-height:1.7}.voucher-list{display:grid;gap:1rem;margin:2rem 0}.voucher-card,.panel{background:#fff;border:1px solid #d9e0d8;padding:1.25rem}.voucher-card{display:grid;grid-template-columns:1fr 15rem;gap:1rem;align-items:center;background:linear-gradient(135deg,#fff,#edf6eb)}.voucher-copy h2{font:2.3rem Georgia,serif;margin:.6rem 0}.voucher-copy p{color:#65776b}.voucher-qr{display:grid;place-items:center}.voucher-qr img{width:13rem;height:13rem}.panel-heading{display:flex;justify-content:space-between;gap:1rem;align-items:center}.panel h2{font:1.35rem Georgia,serif}.button{border:1px solid #b8c9bd;padding:.65rem .9rem;font-weight:800;background:#fff}.secondary{color:#275d46}.state,.empty,.error,.success{margin-top:1.2rem;padding:1rem;border-block:1px solid #d9e0d8}.error{color:#9a3022}.success{color:#21623b}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.75rem;border-bottom:1px solid #edf1ed}th{font-size:.7rem;letter-spacing:.1em;color:#6c7e72}@media(max-width:640px){.voucher-card{grid-template-columns:1fr}.voucher-qr{justify-content:start}.voucher-qr img{width:11rem;height:11rem}}
</style>
