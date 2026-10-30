<template>
  <section class="payment-page">
    <div class="payment-inner">
      <div class="payment-hero">
        <div class="payment-hero__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 7h22a3 3 0 0 1 3 3v29l-4-2-4 2-4-2-4 2-4-2-4 2V10a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M17 16h14M17 22h14M17 28h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </div>
        <div>
          <p class="eyebrow">HARLAH NU KE-101 / {{ id ? 'PESANAN' : 'ORDERS' }}</p>
          <h1>{{ id ? 'Pesanan & pembayaran' : 'Orders & payment' }}</h1>
          <p class="intro">{{ id ? 'Periksa pesanan keluarga. Pembayaran dilanjutkan melalui Portal Payment terpisah.' : 'Review your family order. Payment continues in the separate Payment Portal.' }}</p>
        </div>
      </div>

      <p v-if="loading" class="state">{{ id ? 'Memuat pesanan…' : 'Loading orders…' }}</p>
      <p v-else-if="error" class="error" role="alert">{{ error }}</p>
      <div v-else-if="!orders.length" class="state state--empty">
        <div class="empty-icon" aria-hidden="true">✦</div>
        <div>
          <strong>{{ id ? 'Belum ada pesanan Harlah NU.' : 'You do not have a Harlah NU order yet.' }}</strong>
          <p>{{ id ? 'Pilih jenis kegiatan dan daftarkan keluarga untuk memulai.' : 'Choose an activity type and register your family to get started.' }}</p>
        <NuxtLink to="/daftar" class="text-link">{{ id ? 'Mulai pendaftaran' : 'Start registration' }} →</NuxtLink>
        </div>
      </div>
      <div v-else class="order-list">
        <article v-for="entry in orders" :key="entry.order.id" class="order-row">
          <div class="order-row__body">
            <p class="order-kicker">{{ entry.order.order_number }}</p>
            <h2>{{ entry.items[0]?.product_name || (id ? 'Jenis Kegiatan Harlah NU' : 'Harlah NU activity') }}</h2>
            <p>{{ entry.items.reduce((count, item) => count + item.quantity, 0) }} {{ id ? 'peserta' : 'participant(s)' }} · {{ money(entry.order.total_amount, entry.order.currency) }}</p>
            <span class="status" :class="`status--${entry.order.status}`">{{ statusLabel(entry.order.status) }}</span>
          </div>
          <div class="order-actions">
            <NuxtLink v-if="entry.order.status === 'paid'" :to="`/dashboard/tiket?order_id=${encodeURIComponent(entry.order.id)}`" class="button button--light">{{ id ? 'Lihat tiket' : 'View tickets' }}</NuxtLink>
            <span v-else-if="entry.order.status === 'paid_needs_review'" class="action-note">{{ id ? 'Pembayaran diterima; menunggu pemeriksaan panitia. Tiket belum diterbitkan.' : 'Payment received; awaiting organizer review. Tickets are not issued yet.' }}</span>
            <span v-else-if="['expired', 'canceled'].includes(entry.order.status.toLowerCase())" class="action-note">{{ id ? 'Pesanan sudah ditutup. Hubungi panitia bila pembayaran telah dilakukan.' : 'This order is closed. Contact the organizer if you already paid.' }}</span>
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
  if (submittingOrderId.value) return;
  submittingOrderId.value = orderId;
  submitError.value = '';
  try {
    const roster = await hariSantriApi.getParticipants(orderId);
    if (!roster.data.length) {
      await navigateTo('/daftar');
      return;
    }
    const checkout = (await hariSantriApi.createCheckout(orderId)).data;
    if (checkout.already_paid) {
      await navigateTo(`/dashboard/tiket?order_id=${encodeURIComponent(orderId)}`);
      return;
    }
    if (!checkout.payment_url) throw new Error(id.value ? 'Tautan Portal Payment tidak tersedia.' : 'Payment Portal did not return a checkout link.');
    const url = new URL(checkout.payment_url);
    if (url.protocol !== 'https:' && !(import.meta.dev && url.hostname === 'localhost')) throw new Error(id.value ? 'Tautan pembayaran tidak valid.' : 'Invalid payment link.');
    sessionStorage.removeItem('hari-santri-donation-reference');
    sessionStorage.setItem('hari-santri-order-id', orderId);
    window.location.assign(url.toString());
  } catch (cause) {
    submitError.value = cause instanceof Error ? cause.message : (id.value ? 'Pembayaran belum dapat dibuka.' : 'Payment could not be opened.');
    submittingOrderId.value = '';
  }
};

onMounted(() => { void loadOrders(); });
useSeoMeta({ title: () => `${id.value ? 'Pesanan & Pembayaran' : 'Orders & Payment'} | Harlah NU ke-101` });
</script>

<style scoped>
.payment-page { position: relative; isolation: isolate; min-height: 72vh; overflow: hidden; background: radial-gradient(circle at 92% 8%, rgba(132,190,54,.16), transparent 20rem), radial-gradient(circle at 4% 42%, rgba(248,184,21,.09), transparent 18rem), #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1000px) / 2)); }
.payment-page::before { position: absolute; z-index: -1; top: 8rem; right: -7rem; width: 18rem; height: 18rem; border: 1px solid rgba(7,91,54,.12); border-radius: 50%; box-shadow: 0 0 0 2rem rgba(7,91,54,.035), 0 0 0 4rem rgba(7,91,54,.025); content: ''; }
.payment-inner { position: relative; max-width: 1000px; margin-inline: auto; }
.payment-hero { display: grid; grid-template-columns: 4.5rem minmax(0, 1fr); align-items: start; gap: 1.35rem; }
.payment-hero__icon { display: grid; width: 4.5rem; height: 4.5rem; place-items: center; border: 1px solid rgba(248,184,21,.65); border-radius: 1.35rem; background: linear-gradient(145deg, #075b36, #0b7448); color: #f8c841; box-shadow: 0 12px 24px rgba(7,91,54,.16); }
.payment-hero__icon svg { width: 2.25rem; height: 2.25rem; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05; }
.intro { max-width: 42rem; margin-top: .8rem; color: #596d61; line-height: 1.7; }
.state,.error { margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1rem 0; color: #697a70; }
.state--empty { display: flex; align-items: center; gap: 1rem; border: 1px solid #d9e0d8; border-radius: 1rem; background: rgba(255,255,255,.58); padding: 1.25rem 1.4rem; box-shadow: 0 10px 28px rgba(7,91,54,.05); }
.state--empty strong { display: block; color: #17352c; font-size: 1.05rem; }
.state--empty p { margin-top: .25rem; color: #697a70; font-size: .88rem; }
.empty-icon { display: grid; width: 2.75rem; height: 2.75rem; flex: none; place-items: center; border-radius: 50%; background: #e8f2df; color: #75a92f; font-size: 1.25rem; }
.error { color: #9a3022; }
.order-list { margin-top: 2rem; border-top: 1px solid #d9e0d8; }
.order-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; border-bottom: 1px solid #d9e0d8; padding: 1.25rem 0; }
.order-kicker { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .09em; }
.order-row h2 { margin-top: .4rem; font-size: 1.5rem; }
.order-row__body > p:not(.order-kicker) { margin-top: .45rem; color: #65756b; font-size: .87rem; }
.status { display: inline-block; margin-top: .65rem; border: 1px solid #b9c9be; padding: .25rem .5rem; color: #286449; font-size: .7rem; font-weight: 800; }
.order-actions { flex-shrink: 0; }
.button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 0; padding: .7rem 1rem; font-size: .84rem; font-weight: 800; }
.action-note { max-width: 22rem; color: #795d17; font-size: .82rem; line-height: 1.55; }
.button--dark { background: #17352c; color: #fff; } .button--light { background: #f4d578; color: #17352c; }
.button:disabled { opacity: .55; }
.privacy-note { margin-top: 2rem; color: #77857c; font-size: .8rem; line-height: 1.6; }
.text-link { display: inline-block; margin-left: .5rem; color: #286449; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
@media (max-width: 620px) { .payment-hero { grid-template-columns: 1fr; gap: 1rem; } .payment-hero__icon { width: 3.7rem; height: 3.7rem; border-radius: 1.1rem; } .payment-hero__icon svg { width: 1.9rem; height: 1.9rem; } .state--empty { align-items: flex-start; padding: 1rem; } .order-row { align-items: flex-start; flex-direction: column; } .order-actions,.order-actions .button { width: 100%; } }
</style>
