<template>
  <section class="payment-page">
    <div class="payment-inner">
      <p class="eyebrow">HARI SANTRI 2026 / {{ id ? 'PESANAN' : 'ORDERS' }}</p>
      <h1>{{ id ? 'Pesanan & pembayaran' : 'Orders & payment' }}</h1>
      <p class="intro">{{ id ? 'Periksa pesanan keluarga. Pembayaran dilanjutkan melalui Portal Payment terpisah.' : 'Review your family order. Payment continues in the separate Payment Portal.' }}</p>

      <p v-if="loading" class="state">{{ id ? 'Memuat pesanan…' : 'Loading orders…' }}</p>
      <p v-else-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="!orders.length" class="state">
        {{ id ? 'Belum ada pesanan Hari Santri.' : 'You do not have a Hari Santri order yet.' }}
        <NuxtLink to="/daftar" class="text-link">{{ id ? 'Mulai pendaftaran' : 'Start registration' }} →</NuxtLink>
      </p>
      <div v-else class="order-list">
        <article v-for="entry in orders" :key="entry.order.id" class="order-row">
          <div class="order-row__body">
            <p class="order-kicker">{{ entry.order.order_number }}</p>
            <h2>{{ entry.items[0]?.product_name || (id ? 'Paket Hari Santri' : 'Hari Santri package') }}</h2>
            <p>{{ entry.items.reduce((count, item) => count + item.quantity, 0) }} {{ id ? 'paket' : 'package(s)' }} · {{ money(entry.order.total_amount, entry.order.currency) }}</p>
            <span class="status" :class="`status--${entry.order.status}`">{{ statusLabel(entry.order.status) }}</span>
          </div>
          <div class="order-actions">
            <NuxtLink v-if="entry.order.status === 'paid'" :to="`/dashboard/tiket?order_id=${encodeURIComponent(entry.order.id)}`" class="button button--light">{{ id ? 'Lihat tiket' : 'View tickets' }}</NuxtLink>
            <button v-else type="button" class="button button--dark" :disabled="submittingOrderId === entry.order.id" @click="continuePayment(entry.order.id)">
              {{ submittingOrderId === entry.order.id ? (id ? 'Membuka…' : 'Opening…') : (id ? 'Lanjutkan Pembayaran' : 'Continue to Payment') }}
            </button>
          </div>
        </article>
      </div>
      <p v-if="submitError" class="error" role="alert">{{ submitError }}</p>
      <p class="privacy-note">{{ id ? 'Metode pembayaran dipilih di Portal Payment. Halaman kembali bukan bukti lunas; status tiket mengikuti konfirmasi server.' : 'Payment methods are selected in the Payment Portal. A browser return is not proof of payment; ticket status follows server confirmation.' }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PendingOrderRecord } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const runtime = useRuntimeConfig();
const eventsApi = useEvent();
const paymentApi = usePayment();
const hariSantriApi = useHariSantri();
const route = useRoute();
const orders = ref<PendingOrderRecord[]>([]);
const loading = ref(true);
const error = ref('');
const submitError = ref('');
const submittingOrderId = ref('');
const money = (amount: number, currency: string) => new Intl.NumberFormat(id.value ? 'id-ID' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
const statusLabel = (value: string) => {
  const labels: Record<string, { id: string; en: string }> = {
    draft: { id: 'Draf', en: 'Draft' }, pending: { id: 'Menunggu pembayaran', en: 'Payment pending' },
    partially_paid: { id: 'Pembayaran sebagian', en: 'Partially paid' }, paid: { id: 'Lunas', en: 'Paid' },
    expired: { id: 'Kedaluwarsa', en: 'Expired' }, canceled: { id: 'Dibatalkan', en: 'Cancelled' },
    paid_needs_review: { id: 'Perlu ditinjau panitia', en: 'Organizer review required' }
  };
  return labels[value.toLowerCase()]?.[id.value ? 'id' : 'en'] || value;
};

const loadOrders = async () => {
  loading.value = true;
  error.value = '';
  try {
    const eventResponse = await eventsApi.getEvents(1, 100);
    const event = eventResponse.data.find(item => item.slug === runtime.public.eventSlug);
    if (!event) { orders.value = []; return; }
    const response = await paymentApi.getPendingOrders(event.id, 1, 100);
    orders.value = response.data.filter(entry => entry.order.event_id === event.id);
    const queryOrderId = typeof route.query.order_id === 'string' ? route.query.order_id : '';
    if (queryOrderId && !orders.value.some(entry => entry.order.id === queryOrderId)) {
      const detail = await paymentApi.getOrderDetail(queryOrderId);
      if (detail.data.order.event_id === event.id) orders.value.unshift(detail.data);
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Pesanan belum dapat dimuat.' : 'Orders could not be loaded.');
  } finally {
    loading.value = false;
  }
};

const continuePayment = async (orderId: string) => {
  submittingOrderId.value = orderId;
  submitError.value = '';
  try {
    const checkout = (await hariSantriApi.createCheckout(orderId)).data;
    if (checkout.already_paid) {
      await navigateTo(`/dashboard/tiket?order_id=${encodeURIComponent(orderId)}`);
      return;
    }
    if (!checkout.payment_url) throw new Error(id.value ? 'Tautan Portal Payment tidak tersedia.' : 'Payment Portal did not return a checkout link.');
    const url = new URL(checkout.payment_url);
    if (url.protocol !== 'https:' && !(import.meta.dev && url.hostname === 'localhost')) throw new Error(id.value ? 'Tautan pembayaran tidak valid.' : 'Invalid payment link.');
    sessionStorage.setItem('hari-santri-order-id', orderId);
    window.location.assign(url.toString());
  } catch (cause) {
    submitError.value = cause instanceof Error ? cause.message : (id.value ? 'Pembayaran belum dapat dibuka.' : 'Payment could not be opened.');
    submittingOrderId.value = '';
  }
};

onMounted(() => { void loadOrders(); });
useSeoMeta({ title: () => `${id.value ? 'Pesanan & Pembayaran' : 'Orders & Payment'} | Hari Santri 2026` });
</script>

<style scoped>
.payment-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1000px) / 2)); }
.payment-inner { max-width: 1000px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05; }
.intro { max-width: 42rem; margin-top: .8rem; color: #596d61; line-height: 1.7; }
.state,.error { margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1rem 0; color: #697a70; }
.error { color: #9a3022; }
.order-list { margin-top: 2rem; border-top: 1px solid #d9e0d8; }
.order-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; border-bottom: 1px solid #d9e0d8; padding: 1.25rem 0; }
.order-kicker { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .09em; }
.order-row h2 { margin-top: .4rem; font-size: 1.5rem; }
.order-row__body > p:not(.order-kicker) { margin-top: .45rem; color: #65756b; font-size: .87rem; }
.status { display: inline-block; margin-top: .65rem; border: 1px solid #b9c9be; padding: .25rem .5rem; color: #286449; font-size: .7rem; font-weight: 800; }
.order-actions { flex-shrink: 0; }
.button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 0; padding: .7rem 1rem; font-size: .84rem; font-weight: 800; }
.button--dark { background: #17352c; color: #fff; } .button--light { background: #f4d578; color: #17352c; }
.button:disabled { opacity: .55; }
.privacy-note { margin-top: 2rem; color: #77857c; font-size: .8rem; line-height: 1.6; }
.text-link { display: inline-block; margin-left: .5rem; color: #286449; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
@media (max-width: 620px) { .order-row { align-items: flex-start; flex-direction: column; } .order-actions,.order-actions .button { width: 100%; } }
</style>
