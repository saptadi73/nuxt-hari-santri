<template>
  <main class="audit-page">
    <div class="audit-inner">
      <p class="eyebrow">ADMIN / HARLAH NU KE-101</p>
      <h1>Audit voucher & settlement</h1>
      <p class="intro">Riwayat penerbitan voucher, scan, penyesuaian saldo, dan settlement. Token QR dan password tidak ditampilkan pada audit.</p>
      <div class="filters">
        <label>Jenis aktivitas<select v-model="action"><option value="">Semua aktivitas</option><option value="voucher_issued">Voucher diterbitkan</option><option value="voucher_revoked">Voucher dinonaktifkan</option><option value="voucher_scanned">Voucher digunakan</option><option value="voucher_scan_failed">Scan gagal</option><option value="voucher_balance_adjusted">Saldo disesuaikan</option><option value="settlement_requested">Settlement diajukan</option><option value="settlement_confirmed">Settlement dikonfirmasi</option><option value="checkin_accepted">Check-in diterima</option><option value="checkin_rejected">Check-in ditolak</option><option value="order_reservation_expired">Reservasi kedaluwarsa</option><option value="order_reservation_expiry_inventory_mismatch">Mismatch stok saat expiry</option><option value="payment_callback_processed">Callback diproses</option><option value="payment_callback_failed">Callback gagal</option><option value="payment_callback_retry_scheduled">Callback dijadwalkan ulang</option><option value="payment_callback_dead_letter">Callback dead-letter</option><option value="payment_callback_manually_requeued">Callback diulang manual</option></select></label>
        <label>Jumlah baris<select v-model.number="limit"><option :value="100">100 terakhir</option><option :value="200">200 terakhir</option><option :value="500">500 terakhir</option></select></label>
        <button class="button" :disabled="loading" @click="load">{{ loading ? 'Memuat…' : 'Muat ulang' }}</button>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p class="count" aria-live="polite">{{ logs.length }} catatan ditampilkan, terbaru lebih dahulu.</p>
      <div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Aktivitas</th><th>Pelaku</th><th>Objek</th><th>Detail</th></tr></thead><tbody>
        <tr v-for="log in logs" :key="log.id"><td>{{ formatDate(log.created_at) }}</td><td><code>{{ log.action }}</code></td><td>{{ log.actor_name || 'Akun tidak tersedia' }}</td><td>{{ log.entity_type }}<small v-if="log.entity_id">{{ log.entity_id }}</small></td><td><pre>{{ JSON.stringify(log.payload, null, 2) }}</pre></td></tr>
        <tr v-if="!loading && logs.length === 0"><td colspan="5" class="empty">Tidak ada catatan audit untuk filter ini.</td></tr>
      </tbody></table></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { HariSantriAuditLog } from '~/composables/useVoucherWallet';
import { useVoucherWallet } from '~/composables/useVoucherWallet';

definePageMeta({ middleware: ['auth', 'admin'] });
const api = useVoucherWallet();
const logs = ref<HariSantriAuditLog[]>([]);
const action = ref('');
const limit = ref(200);
const loading = ref(false);
const error = ref('');
const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(value));
const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const result = await api.auditLogs({ action: action.value || undefined, limit: limit.value });
    logs.value = result.data;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Audit voucher belum dapat dimuat.';
  } finally {
    loading.value = false;
  }
};
watch([action, limit], () => { void load(); });
onMounted(() => { void load(); });
useSeoMeta({ title: 'Audit Voucher | Harlah NU ke-101' });
</script>

<style scoped>
.audit-page{min-height:72vh;background:#f5f5ef;color:#17352c;padding:3rem max(1rem,calc((100vw - 1200px)/2))}.audit-inner{max-width:1200px;margin:auto}.eyebrow{color:#2d7258;font-size:.72rem;font-weight:800;letter-spacing:.12em}.intro{max-width:55rem;color:#596d61;line-height:1.7}.filters{display:flex;align-items:end;gap:1rem;flex-wrap:wrap;margin:1.5rem 0}.filters label{display:grid;gap:.4rem;font-weight:800;color:#365444}select,.button{font:inherit;padding:.7rem;border:1px solid #bdcdbf;border-radius:6px;background:#fff}.button{font-weight:800;cursor:pointer}.button:disabled{opacity:.55;cursor:wait}.count{color:#596d61}.error{color:#9a3022;padding:1rem;border-block:1px solid #d9e0d8}.table-wrap{overflow:auto;background:#fff;border:1px solid #d9e0d8}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:.75rem;border-bottom:1px solid #edf1ed}th{font-size:.72rem;letter-spacing:.08em;color:#6c7e72}td small{display:block;max-width:15rem;margin-top:.3rem;color:#738276;overflow-wrap:anywhere}pre{max-width:25rem;max-height:12rem;overflow:auto;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:.76rem/1.5 ui-monospace,monospace}.empty{text-align:center;color:#738276;padding:2rem}@media(max-width:700px){.filters{align-items:stretch}.filters label,.filters select,.filters button{width:100%}}
</style>
