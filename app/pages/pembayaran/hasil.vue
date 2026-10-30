<template>
  <section class="result-page">
    <div class="result-content">
      <div v-if="donationMode" class="thankyou-hero">
        <div class="thankyou-glow thankyou-glow--one" aria-hidden="true"></div>
        <div class="thankyou-glow thankyou-glow--two" aria-hidden="true"></div>
        <div class="brand-lockup">
          <img src="/logo_santri_2026.png" alt="Logo Harlah NU ke-101" class="event-logo">
          <div>
            <p class="brand-kicker">MWC NU TARUMAJAYA</p>
            <p class="brand-title">Harlah NU ke-101</p>
          </div>
        </div>
        <p class="eyebrow">TERIMA KASIH, KELUARGA NU</p>
        <div class="thankyou-mark" aria-hidden="true">✦</div>
        <h1>{{ title }}</h1>
        <p class="result-message" aria-live="polite">{{ message }}</p>
        <div class="thankyou-event">Sehat bersama · Eratkan persaudaraan · Rayakan 101 tahun khidmah</div>
      </div>
      <template v-else>
        <p class="eyebrow">{{ id ? 'HARLAH NU KE-101' : 'HARLAH NU KE-101' }}</p>
        <h1>{{ title }}</h1>
        <p class="result-message" aria-live="polite">{{ message }}</p>
      </template>
      <dl v-if="donationMode && donationStatus" class="status-list">
        <div><dt>Referensi donasi</dt><dd>{{ donationStatus.reference_id }}</dd></div>
        <div><dt>Nominal donasi</dt><dd>{{ formatRupiah(donationStatus.amount) }}</dd></div>
        <div><dt>Status donasi</dt><dd>{{ statusLabel(donationStatus.status) }}</dd></div>
        <div v-if="donationStatus.payment_no"><dt>Nomor pembayaran</dt><dd>{{ donationStatus.payment_no }}</dd></div>
      </dl>
      <dl v-else-if="status" class="status-list">
        <div><dt>{{ id ? 'Nomor pesanan' : 'Order' }}</dt><dd>{{ status.order_id }}</dd></div>
        <div><dt>{{ id ? 'Status pesanan' : 'Order status' }}</dt><dd>{{ statusLabel(status.order_status) }}</dd></div>
        <div><dt>{{ id ? 'Status pembayaran' : 'Payment status' }}</dt><dd>{{ statusLabel(status.payment_status) }}</dd></div>
        <div v-if="status.payment_no"><dt>{{ id ? 'Nomor pembayaran' : 'Payment number' }}</dt><dd>{{ status.payment_no }}</dd></div>
      </dl>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="actions">
        <button type="button" class="button button--dark" :disabled="loading" @click="refresh(true)">{{ loading ? (id ? 'Memeriksa…' : 'Checking…') : (id ? 'Periksa status' : 'Refresh status') }}</button>
        <button v-if="!donationMode && orderId && canReconcile" type="button" class="button button--gold" :disabled="reconciling" @click="reconcileNow">{{ reconciling ? 'Memeriksa Payment Portal…' : 'Periksa ke Payment Portal' }}</button>
        <NuxtLink v-if="!donationMode && canResumeCheckout" :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="button button--dark">{{ id ? 'Lanjutkan checkout yang sama' : 'Resume the same checkout' }}</NuxtLink>
        <NuxtLink v-if="!donationMode && status?.order_status === 'paid'" to="/dashboard/tiket" class="button button--gold">{{ id ? 'Lihat tiket' : 'View tickets' }}</NuxtLink>
        <NuxtLink v-if="donationMode" to="/donasi" class="text-link">Kembali ke halaman donasi</NuxtLink>
        <NuxtLink v-else to="/dashboard" class="text-link">{{ id ? 'Kembali ke dashboard' : 'Back to dashboard' }}</NuxtLink>
      </div>
      <p class="caution">{{ donationMode ? 'Kembali dari halaman pembayaran bukan bukti donasi lunas. Status ini berasal dari konfirmasi server.' : (id ? 'Halaman kembali dari pembayaran bukan bukti lunas. Status resmi berasal dari konfirmasi server.' : 'Returning from checkout is not proof of payment. The server-confirmed status is authoritative.') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DonationStatus, HariSantriPaymentStatus } from '~/composables/useHariSantri';

const route = useRoute();
const { locale } = useI18n();
const api = useHariSantri();
const authStore = useAuthStore();
const id = computed(() => locale.value === 'id');
const orderId = ref('');
const donationReference = ref('');
const donationMode = computed(() => Boolean(donationReference.value));
const status = ref<HariSantriPaymentStatus | null>(null);
const donationStatus = ref<DonationStatus | null>(null);
const loading = ref(false);
const reconciling = ref(false);
const error = ref('');
let poller: ReturnType<typeof setInterval> | undefined;
const title = computed(() => {
  if (donationMode.value) return donationStatus.value?.status === 'PAID' ? 'Terima kasih atas donasi Anda' : 'Kami sedang memeriksa donasi';
  return status.value?.order_status === 'paid'
    ? (id.value ? 'Pembayaran terkonfirmasi' : 'Payment confirmed')
    : (id.value ? 'Kami sedang memeriksa pembayaran' : 'We are checking your payment');
});
const message = computed(() => {
  if (donationMode.value) {
    if (donationStatus.value?.status === 'PAID') return 'Donasi Anda telah dikonfirmasi. Terima kasih telah mendukung kegiatan Harlah NU ke-101.';
    if (['FAILED', 'EXPIRED', 'CANCELED', 'CANCELLED'].includes(donationStatus.value?.status || '')) return 'Pembayaran donasi belum berhasil. Anda dapat kembali ke halaman donasi untuk mencoba lagi.';
    return 'Status donasi akan diperbarui setelah sistem menerima konfirmasi dari Portal Payment.';
  }
  if (status.value?.order_status === 'paid') return id.value
    ? 'Pembayaranmu terverifikasi. Tiket digital tersedia untuk setiap peserta.'
    : 'Your payment is verified. A digital ticket is available for each participant.';
  if (status.value?.order_status === 'paid_needs_review') return id.value
    ? 'Pembayaran diterima dan sedang ditinjau panitia. Tiket belum diterbitkan.'
    : 'Payment received and under organizer review. Tickets have not been issued yet.';
  if (status.value?.payment_status.toLowerCase() === 'unknown') return id.value
    ? 'Hasil checkout belum diketahui. Lanjutkan checkout yang sama agar backend memakai idempotency key order yang sama; jangan buat pesanan baru.'
    : 'Checkout outcome is unknown. Resume this checkout so the backend reuses the order idempotency key; do not create a new order.';
  return id.value
    ? 'Konfirmasi mungkin memerlukan waktu. Status akan diperbarui setelah sistem menerima notifikasi pembayaran.'
    : 'Confirmation can take a little time. This page updates after the system receives the payment notification.';
});
const statusLabel = (value: string) => value.replaceAll('_', ' ').toUpperCase();
const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const canResumeCheckout = computed(() => Boolean(orderId.value) && ['unknown', 'pending', 'created', 'initiated'].includes(status.value?.payment_status.toLowerCase() || '') && !['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value?.order_status.toLowerCase() || ''));
const canReconcile = computed(() => !['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value?.order_status.toLowerCase() || ''));

const reconcileNow = async () => {
  if (!orderId.value || reconciling.value) return;
  reconciling.value = true;
  error.value = '';
  try {
    await api.reconcileOrderPayment(orderId.value);
    await refresh();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Pemeriksaan Payment Portal belum berhasil.';
  } finally {
    reconciling.value = false;
  }
};

const refresh = async (lookupPaymentPortal = false) => {
  if ((!orderId.value && !donationReference.value) || loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    if (donationReference.value) {
      donationStatus.value = (await api.getDonationStatus(donationReference.value)).data;
    } else {
      if (!authStore.isAuthenticated) throw new Error('Masuk ke akun untuk melihat status pesanan.');
      if (lookupPaymentPortal) await api.reconcileOrderPayment(orderId.value);
      status.value = (await api.getPaymentStatus(orderId.value)).data;
    }
    const terminal = donationMode.value
      ? ['PAID', 'FAILED', 'EXPIRED', 'CANCELED', 'CANCELLED'].includes(donationStatus.value?.status || '')
      : ['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value?.order_status.toLowerCase() || '');
    if (terminal && poller) {
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
  const queryDonationReference = route.query.donation_reference || route.query.reference_id;
  donationReference.value = sessionStorage.getItem('hari-santri-donation-reference')
    || (typeof queryDonationReference === 'string' ? queryDonationReference : '');
  orderId.value = typeof queryOrderId === 'string' ? queryOrderId : sessionStorage.getItem('hari-santri-order-id') || '';
  // Inquiry server-to-server sekali saat kembali dari Payment Portal.
  await refresh(true);
  const isTerminal = donationMode.value
    ? ['PAID', 'FAILED', 'EXPIRED', 'CANCELED', 'CANCELLED'].includes(donationStatus.value?.status || '')
    : ['paid', 'paid_needs_review', 'expired', 'canceled'].includes(status.value?.order_status.toLowerCase() || '');
  if ((orderId.value || donationReference.value) && !isTerminal) {
    poller = setInterval(() => { void refresh(); }, 5000);
  }
});
onBeforeUnmount(() => { if (poller) clearInterval(poller); });
useSeoMeta({ title: () => `${title.value} | Harlah NU ke-101` });
</script>

<style scoped>
.result-page { min-height: 72vh; display: grid; place-items: center; background: #f3f7f0; color: #17352c; padding: 2.5rem 1rem 3.5rem; }
.result-content { width: min(100%, 54rem); }
.thankyou-hero { position: relative; overflow: hidden; border-radius: 1.5rem; padding: clamp(1.5rem, 5vw, 3.5rem); color: #f8fff5; background: linear-gradient(135deg, #063f2b 0%, #087044 48%, #164c36 100%); box-shadow: 0 24px 60px rgb(15 75 50 / 18%); }
.thankyou-hero::after { position: absolute; inset: auto 0 0; height: 7rem; background: linear-gradient(180deg, transparent, rgb(2 37 25 / 28%)); content: ''; pointer-events: none; }
.thankyou-glow { position: absolute; border: 1px solid rgb(244 213 120 / 35%); border-radius: 50%; pointer-events: none; }
.thankyou-glow--one { width: 24rem; height: 24rem; right: -10rem; top: -12rem; box-shadow: 0 0 0 2rem rgb(244 213 120 / 5%), 0 0 0 4rem rgb(244 213 120 / 4%); }
.thankyou-glow--two { width: 14rem; height: 14rem; left: -8rem; bottom: -8rem; border-color: rgb(255 255 255 / 14%); }
.brand-lockup, .thankyou-hero > *:not(.thankyou-glow) { position: relative; z-index: 1; }
.brand-lockup { display: flex; align-items: center; gap: .8rem; margin-bottom: clamp(2.5rem, 6vw, 4rem); }
.event-logo { width: 3.6rem; height: 3.6rem; border-radius: 1rem; background: #fff; padding: .35rem; object-fit: contain; }
.brand-kicker { color: #f4d578; font-size: .68rem; font-weight: 850; letter-spacing: .15em; }
.brand-title { margin-top: .2rem; font-size: 1.05rem; font-weight: 800; }
.eyebrow { color: #f4d578; font-size: .72rem; font-weight: 850; letter-spacing: .14em; }
.thankyou-mark { margin-top: .7rem; color: #f4d578; font-size: 2rem; line-height: 1; }
h1 { max-width: 14ch; margin-top: .45rem; color: #fff; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.6rem, 7vw, 5.2rem); line-height: .98; }
.result-message { max-width: 48rem; margin-top: 1.2rem; color: rgb(239 250 239 / 86%); line-height: 1.7; }
.thankyou-event { display: inline-block; margin-top: 1.5rem; border: 1px solid rgb(244 213 120 / 55%); border-radius: 999px; padding: .55rem .85rem; color: #fff4c7; font-size: .75rem; font-weight: 700; }
.status-list { margin-top: 1.5rem; border: 1px solid #d9e4d8; border-radius: 1rem; background: rgb(255 255 255 / 88%); box-shadow: 0 16px 35px rgb(15 75 50 / 7%); overflow: hidden; }
.status-list div { display: grid; grid-template-columns: 10rem minmax(0, 1fr); gap: 1rem; border-bottom: 1px solid #d9e0d8; padding: 1rem 1.2rem; }
.status-list div:last-child { border-bottom: 0; }
dt { color: #697a70; font-size: .82rem; } dd { overflow-wrap: anywhere; font-size: .88rem; font-weight: 700; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 1.5rem; }
.button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 0; padding: .7rem 1rem; font-size: .85rem; font-weight: 800; }
.button--dark { background: #17352c; color: #fff; } .button--gold { background: #f4d578; color: #17352c; }
.button:disabled { opacity: .55; }
.text-link { color: #286449; font-size: .88rem; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
.caution { margin-top: 1.5rem; color: #77857c; font-size: .78rem; line-height: 1.6; }
.error { margin-top: 1rem; color: #9a3022; }
@media (max-width: 640px) {
  .result-page { padding: 1rem .75rem 2.5rem; }
  .thankyou-hero { border-radius: 1.1rem; padding: 1.35rem 1.1rem 1.5rem; }
  .brand-lockup { margin-bottom: 2.5rem; }
  .event-logo { width: 3rem; height: 3rem; border-radius: .8rem; }
  .brand-title { font-size: .95rem; }
  .thankyou-event { border-radius: .7rem; line-height: 1.45; }
  .status-list { margin-top: 1rem; }
  .status-list div { grid-template-columns: 1fr; gap: .25rem; padding: .85rem 1rem; }
  .actions { align-items: stretch; gap: .7rem; }
  .button { width: 100%; }
  .text-link { display: block; width: 100%; text-align: center; }
}
</style>
