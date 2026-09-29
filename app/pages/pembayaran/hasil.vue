<template>
  <section class="result-page">
    <div class="result-content">
      <p class="eyebrow">{{ id ? 'HARI SANTRI 2026' : 'HARI SANTRI 2026' }}</p>
      <h1>{{ title }}</h1>
      <p class="result-message" aria-live="polite">{{ message }}</p>
      <dl v-if="status" class="status-list">
        <div><dt>{{ id ? 'Nomor pesanan' : 'Order' }}</dt><dd>{{ status.order_id }}</dd></div>
        <div><dt>{{ id ? 'Status pesanan' : 'Order status' }}</dt><dd>{{ statusLabel(status.order_status) }}</dd></div>
        <div><dt>{{ id ? 'Status pembayaran' : 'Payment status' }}</dt><dd>{{ statusLabel(status.payment_status) }}</dd></div>
        <div v-if="status.payment_no"><dt>{{ id ? 'Nomor pembayaran' : 'Payment number' }}</dt><dd>{{ status.payment_no }}</dd></div>
      </dl>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="actions">
        <button type="button" class="button button--dark" :disabled="loading" @click="refresh">{{ loading ? (id ? 'Memeriksa…' : 'Checking…') : (id ? 'Periksa status' : 'Refresh status') }}</button>
        <NuxtLink v-if="status?.order_status === 'paid'" to="/dashboard/tiket" class="button button--gold">{{ id ? 'Lihat tiket' : 'View tickets' }}</NuxtLink>
        <NuxtLink to="/dashboard" class="text-link">{{ id ? 'Kembali ke dashboard' : 'Back to dashboard' }}</NuxtLink>
      </div>
      <p class="caution">{{ id ? 'Halaman kembali dari pembayaran bukan bukti lunas. Status resmi berasal dari konfirmasi server.' : 'Returning from checkout is not proof of payment. The server-confirmed status is authoritative.' }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HariSantriPaymentStatus } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const route = useRoute();
const { locale } = useI18n();
const api = useHariSantri();
const id = computed(() => locale.value === 'id');
const orderId = ref('');
const status = ref<HariSantriPaymentStatus | null>(null);
const loading = ref(false);
const error = ref('');
let poller: ReturnType<typeof setInterval> | undefined;
const title = computed(() => status.value?.order_status === 'paid'
  ? (id.value ? 'Pembayaran terkonfirmasi' : 'Payment confirmed')
  : (id.value ? 'Kami sedang memeriksa pembayaran' : 'We are checking your payment'));
const message = computed(() => {
  if (status.value?.order_status === 'paid') return id.value
    ? 'Pembayaranmu terverifikasi. Tiket digital tersedia untuk setiap peserta.'
    : 'Your payment is verified. A digital ticket is available for each participant.';
  if (status.value?.order_status === 'paid_needs_review') return id.value
    ? 'Pembayaran diterima dan sedang ditinjau panitia. Tiket belum diterbitkan.'
    : 'Payment received and under organizer review. Tickets have not been issued yet.';
  return id.value
    ? 'Konfirmasi mungkin memerlukan waktu. Status akan diperbarui setelah sistem menerima notifikasi pembayaran.'
    : 'Confirmation can take a little time. This page updates after the system receives the payment notification.';
});
const statusLabel = (value: string) => value.replaceAll('_', ' ').toUpperCase();

const refresh = async () => {
  if (!orderId.value || loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    status.value = (await api.getPaymentStatus(orderId.value)).data;
    if (['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value.order_status.toLowerCase()) && poller) {
      clearInterval(poller);
      poller = undefined;
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Status belum dapat diperiksa.' : 'Payment status is not available yet.');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const queryOrderId = route.query.order_id;
  orderId.value = typeof queryOrderId === 'string' ? queryOrderId : sessionStorage.getItem('hari-santri-order-id') || '';
  await refresh();
  if (orderId.value && !['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value?.order_status.toLowerCase() || '')) {
    poller = setInterval(() => { void refresh(); }, 5000);
  }
});
onBeforeUnmount(() => { if (poller) clearInterval(poller); });
useSeoMeta({ title: () => `${title.value} | Hari Santri 2026` });
</script>

<style scoped>
.result-page { min-height: 72vh; display: grid; place-items: center; background: #f5f5ef; color: #17352c; padding: 2rem 1rem; }
.result-content { width: min(100%, 48rem); }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1 { max-width: 14ch; margin-top: .8rem; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1; }
.result-message { margin-top: 1rem; color: #596d61; line-height: 1.7; }
.status-list { margin-top: 2rem; border-top: 1px solid #d9e0d8; }
.status-list div { display: grid; grid-template-columns: 10rem minmax(0, 1fr); gap: 1rem; border-bottom: 1px solid #d9e0d8; padding: .85rem 0; }
dt { color: #697a70; font-size: .82rem; } dd { overflow-wrap: anywhere; font-size: .88rem; font-weight: 700; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 1.5rem; }
.button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 0; padding: .7rem 1rem; font-size: .85rem; font-weight: 800; }
.button--dark { background: #17352c; color: #fff; } .button--gold { background: #f4d578; color: #17352c; }
.button:disabled { opacity: .55; }
.text-link { color: #286449; font-size: .88rem; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
.caution { margin-top: 2rem; color: #77857c; font-size: .78rem; line-height: 1.6; }
.error { margin-top: 1rem; color: #9a3022; }
</style>
