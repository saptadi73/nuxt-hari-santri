<template>
  <main class="ops-page"><div class="ops-inner">
    <p class="eyebrow">ADMIN / HARI SANTRI 2026</p><h1>Operasional callback pembayaran</h1>
    <p class="intro">Pantau callback terverifikasi yang sedang dicoba ulang atau masuk dead-letter. Retry manual akan mencatat actor dan request ID pada audit trail.</p>
    <section class="reconcile-card"><div><h2>Rekonsiliasi callback terlambat</h2><p>Masukkan nomor referensi order. Backend memeriksa status langsung ke Payment Portal menggunakan kredensial server; status dari browser tidak digunakan.</p></div><form @submit.prevent="reconcile"><label>Nomor referensi order<input v-model.trim="referenceId" required maxlength="100" autocomplete="off" placeholder="Contoh: HS26-REG-000123"></label><button class="button" :disabled="reconciling || !referenceId">{{ reconciling ? 'Memeriksa…' : 'Periksa Payment Portal' }}</button></form></section>
    <div class="toolbar"><label>Status<select v-model="status"><option value="">Semua status</option><option value="pending">Menunggu retry</option><option value="processing">Diproses</option><option value="completed">Selesai</option><option value="dead">Perlu pemeriksaan</option></select></label><button class="button" :disabled="loading" @click="load">{{ loading ? 'Memuat…' : 'Muat ulang' }}</button></div>
    <p v-if="message" class="message" :class="tone" role="status">{{ message }}</p>
    <div class="table-wrap"><table><thead><tr><th>Diterima</th><th>Event</th><th>Request ID</th><th>Status</th><th>Percobaan</th><th>Error</th><th>Aksi</th></tr></thead><tbody>
      <tr v-for="row in rows" :key="row.id"><td>{{ formatDate(row.created_at) }}</td><td><code>{{ row.event_id || '—' }}</code></td><td><code>{{ row.request_id }}</code></td><td><span class="pill" :class="row.status">{{ row.status }}</span></td><td>{{ row.attempts }} / {{ row.max_attempts }}</td><td><strong>{{ row.last_error_code || '—' }}</strong><small>{{ row.last_error_message || '' }}</small></td><td><button class="button retry" :disabled="busyId === row.id || row.status !== 'dead'" @click="retry(row)">{{ busyId === row.id ? 'Menjadwalkan…' : 'Jadwalkan ulang' }}</button></td></tr>
      <tr v-if="!loading && rows.length === 0"><td colspan="7" class="empty">Tidak ada callback untuk filter ini.</td></tr>
    </tbody></table></div>
    <p class="footnote">Callback dead-letter memerlukan pemeriksaan Payment Portal dan order sebelum dijadwalkan ulang. Worker tetap idempotent berdasarkan event ID dan payload hash.</p>
  </div></main>
</template>

<script setup lang="ts">
import type { CallbackOutboxItem } from '~/composables/useVoucherWallet';
import { useVoucherWallet } from '~/composables/useVoucherWallet';
import { useHariSantri } from '~/composables/useHariSantri';

definePageMeta({ middleware: ['auth', 'admin'] });
const api = useVoucherWallet();
const hariSantriApi = useHariSantri();
const rows = ref<CallbackOutboxItem[]>([]);
const referenceId = ref('');
const reconciling = ref(false);
const status = ref('');
const loading = ref(false);
const busyId = ref('');
const message = ref('');
const tone = ref<'success' | 'error'>('success');
const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(value));
const load = async () => {
  loading.value = true;
  try { rows.value = (await api.callbackOutbox({ status: status.value || undefined, limit: 200 })).data; }
  catch (error) { tone.value = 'error'; message.value = error instanceof Error ? error.message : 'Daftar callback belum dapat dimuat.'; }
  finally { loading.value = false; }
};
const retry = async (row: CallbackOutboxItem) => {
  busyId.value = row.id;
  message.value = '';
  try { await api.retryCallbackOutbox(row.id); tone.value = 'success'; message.value = `Callback ${row.event_id || row.request_id} dijadwalkan ulang.`; await load(); }
  catch (error) { tone.value = 'error'; message.value = error instanceof Error ? error.message : 'Callback gagal dijadwalkan ulang.'; }
  finally { busyId.value = ''; }
};
const reconcile = async () => {
  if (!referenceId.value || reconciling.value) return;
  reconciling.value = true;
  message.value = '';
  try {
    const result = await hariSantriApi.reconcilePayment(referenceId.value);
    tone.value = 'success';
    message.value = `Rekonsiliasi ${referenceId.value} selesai. Status Payment Portal: ${String(result.data.payment_status || 'tidak tersedia')}; status order: ${String(result.data.order_status || 'tidak tersedia')}.`;
  } catch (error) {
    tone.value = 'error';
    message.value = error instanceof Error ? error.message : 'Status Payment Portal belum dapat diperiksa.';
  } finally { reconciling.value = false; }
};
watch(status, () => { void load(); });
onMounted(() => { void load(); });
useSeoMeta({ title: 'Operasional Callback | Hari Santri 2026' });
</script>

<style scoped>
.ops-page{min-height:72vh;background:#f5f5ef;color:#17352c;padding:3rem max(1rem,calc((100vw - 1200px)/2))}.ops-inner{max-width:1200px;margin:auto}.eyebrow{color:#2d7258;font-size:.72rem;font-weight:800;letter-spacing:.12em}.intro,.footnote{max-width:60rem;color:#596d61;line-height:1.7}.reconcile-card{display:flex;align-items:end;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;margin:1.5rem 0;padding:1.25rem;background:#fff;border:1px solid #d9e0d8;border-radius:8px}.reconcile-card h2{font-size:1.1rem;font-weight:800}.reconcile-card p{max-width:46rem;margin-top:.35rem;color:#596d61;font-size:.9rem;line-height:1.6}.reconcile-card form{display:flex;align-items:end;gap:.6rem;flex-wrap:wrap}.reconcile-card label{display:grid;gap:.4rem;font-size:.85rem;font-weight:800}.reconcile-card input{min-width:min(20rem,75vw);font:inherit;padding:.7rem;border:1px solid #bdcdbf;border-radius:6px}.toolbar{display:flex;align-items:end;gap:1rem;flex-wrap:wrap;margin:1.5rem 0}.toolbar label{display:grid;gap:.4rem;font-weight:800}.button,select{font:inherit;padding:.7rem;border:1px solid #bdcdbf;border-radius:6px;background:#fff}.button{font-weight:800;cursor:pointer}.button:disabled{opacity:.45;cursor:not-allowed}.table-wrap{overflow:auto;background:#fff;border:1px solid #d9e0d8}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;text-align:left;vertical-align:top;border-bottom:1px solid #edf1ed}th{color:#6c7e72;font-size:.72rem;letter-spacing:.08em}code{font-size:.75rem;overflow-wrap:anywhere}.pill{display:inline-flex;border-radius:999px;padding:.25rem .65rem;font-size:.72rem;font-weight:800}.pill.dead{background:#fee2e2;color:#991b1b}.pill.pending,.pill.processing{background:#fef3c7;color:#92400e}.pill.completed{background:#dcfce7;color:#166534}.retry{white-space:nowrap}.message{margin:1rem 0;padding:1rem;border-block:1px solid #d9e0d8}.message.error{color:#9a3022}.message.success{color:#21623b}td small{display:block;max-width:20rem;margin-top:.3rem;color:#738276}.empty{text-align:center;color:#738276;padding:2rem}.footnote{margin-top:1rem;font-size:.85rem}
</style>
