<template>
  <section class="dashboard-page">
    <div class="dashboard-inner">
      <p class="eyebrow">HARI SANTRI 2026 / {{ id ? 'DASHBOARD' : 'DASHBOARD' }}</p>
      <div class="heading-row">
        <div><h1>{{ id ? `Assalamu’alaikum, ${userName}` : `Welcome, ${userName}` }}</h1><p>{{ id ? 'Pesanan keluarga, tiket, dan informasi acara dalam satu tempat.' : 'Family orders, tickets, and event information in one place.' }}</p></div>
        <div class="countdown"><span>{{ id ? 'MENUJU HARI ACARA' : 'UNTIL EVENT DAY' }}</span><strong>{{ daysUntil }}</strong><small>{{ id ? 'hari' : 'days' }}</small></div>
      </div>

      <div v-if="!isOrganizer" class="status-grid">
        <article><span>{{ id ? 'PESANAN' : 'ORDERS' }}</span><strong>{{ orders.length }}</strong><p>{{ id ? 'Pesanan Hari Santri' : 'Hari Santri orders' }}</p></article>
        <article><span>{{ id ? 'PESERTA' : 'PARTICIPANTS' }}</span><strong>{{ participantCount }}</strong><p>{{ id ? 'Anggota keluarga' : 'Family members' }}</p></article>
        <article><span>{{ id ? 'TIKET' : 'TICKETS' }}</span><strong>{{ tickets.length }}</strong><p>{{ id ? 'Tiket digital tersedia' : 'Digital tickets available' }}</p></article>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <section class="quick-access">
        <h2>{{ id ? 'Akses cepat' : 'Quick access' }}</h2>
        <div class="quick-grid">
          <NuxtLink to="/daftar"><span>01</span><strong>{{ id ? 'Daftar Peserta' : 'Register Participants' }}</strong><p>{{ id ? 'Pilih kegiatan dan isi data keluarga.' : 'Choose an activity and enter your family details.' }}</p></NuxtLink>
          <NuxtLink to="/dashboard/payment"><span>02</span><strong>{{ id ? 'Pesanan & Pembayaran' : 'Orders & Payment' }}</strong><p>{{ id ? 'Lanjutkan pembayaran melalui Portal Payment.' : 'Continue payment through the Payment Portal.' }}</p></NuxtLink>
          <NuxtLink to="/dashboard/tiket"><span>03</span><strong>{{ id ? 'Tiket Digital' : 'Digital Tickets' }}</strong><p>{{ id ? 'Satu QR untuk setiap peserta.' : 'One QR ticket per participant.' }}</p></NuxtLink>
          <NuxtLink to="/#agenda"><span>04</span><strong>{{ id ? 'Agenda & Rute' : 'Agenda & Routes' }}</strong><p>{{ id ? 'Lihat pembaruan resmi panitia.' : 'Read official organizer updates.' }}</p></NuxtLink>
        </div>
      </section>

      <section v-if="isOrganizer" class="admin-panel">
        <p class="eyebrow">{{ id ? 'OPERASIONAL' : 'OPERATIONS' }}</p>
        <h2>{{ id ? 'Kelola acara' : 'Manage the event' }}</h2>
        <div class="admin-links">
          <NuxtLink to="/admin/paket-hari-santri">{{ id ? 'Paket & harga' : 'Packages & prices' }} <span aria-hidden="true">→</span></NuxtLink>
          <NuxtLink to="/admin/kaos">{{ id ? 'Ukuran & inventori kaos' : 'Shirt sizes & inventory' }} <span aria-hidden="true">→</span></NuxtLink>
          <NuxtLink to="/admin/participants-report">{{ id ? 'Peserta & laporan' : 'Participants & reports' }} <span aria-hidden="true">→</span></NuxtLink>
          <NuxtLink to="/staff/scan">{{ id ? 'Check-in tiket' : 'Ticket check-in' }} <span aria-hidden="true">→</span></NuxtLink>
          <NuxtLink to="/admin/program">{{ id ? 'Agenda & konten' : 'Agenda & content' }} <span aria-hidden="true">→</span></NuxtLink>
          <NuxtLink to="/admin/announcements">{{ id ? 'Pengumuman' : 'Announcements' }} <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <p class="small-note">{{ id ? 'Laporan penyelesaian pembayaran dan settlement tetap bersumber dari Portal Payment.' : 'Payment and settlement reconciliation remains sourced from the Payment Portal.' }}</p>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PendingOrderRecord } from '~/composables/usePayment';
import type { HariSantriTicket } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const user = useAuthStore().user;
const userName = computed(() => user?.full_name || user?.name || (id.value ? 'Peserta' : 'Participant'));
const isOrganizer = useAuthStore().isAdminOrOrganizer;
const runtime = useRuntimeConfig();
const eventsApi = useEvent();
const paymentApi = usePayment();
const hariSantriApi = useHariSantri();
const orders = ref<PendingOrderRecord[]>([]);
const tickets = ref<HariSantriTicket[]>([]);
const error = ref('');
const eventDate = new Date('2026-10-25T07:00:00+07:00');
const daysUntil = computed(() => Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / 86400000)));
const participantCount = computed(() => orders.value.reduce((count, entry) => count + (entry.items[0]?.quantity || 0), 0));

onMounted(async () => {
  if (isOrganizer) return;
  try {
    const eventList = await eventsApi.getEvents(1, 100);
    const event = eventList.data.find(item => item.slug === runtime.public.eventSlug);
    if (!event) return;
    const [orderList, ticketList] = await Promise.all([
      paymentApi.getPendingOrders(event.id, 1, 100),
      hariSantriApi.getMyTickets()
    ]);
    orders.value = orderList.data.filter(item => item.order.event_id === event.id);
    tickets.value = ticketList.data;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Informasi dashboard belum dapat dimuat.' : 'Dashboard information could not be loaded.');
  }
});
useSeoMeta({ title: () => `${id.value ? 'Dashboard Peserta' : 'Participant Dashboard'} | Hari Santri 2026` });
</script>

<style scoped>
.dashboard-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1120px) / 2)); }
.dashboard-inner { max-width: 1120px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.3rem, 5vw, 3.7rem); line-height: 1.05; }
.heading-row { display: flex; align-items: end; justify-content: space-between; gap: 2rem; }
.heading-row p { margin-top: .7rem; color: #596d61; }
.countdown { display: grid; min-width: 8rem; border-left: 2px solid #d4a938; padding-left: 1rem; }
.countdown span { color: #697a70; font-size: .65rem; font-weight: 800; letter-spacing: .08em; }
.countdown strong { margin-top: .2rem; font-family: Georgia, 'Times New Roman', serif; font-size: 2rem; }
.countdown small { color: #697a70; }
.status-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.status-grid article { border-top: 1px solid #bdcfc2; padding: 1rem 0; }
.status-grid span { color: #2d7258; font-size: .68rem; font-weight: 800; letter-spacing: .1em; }
.status-grid strong { display: block; margin-top: .45rem; font-family: Georgia, 'Times New Roman', serif; font-size: 2rem; }
.status-grid p { margin-top: .25rem; color: #697a70; font-size: .82rem; }
.quick-access { margin-top: 3rem; }
.quick-access h2,.admin-panel h2 { font-size: 2rem; }
.quick-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin-top: 1rem; background: #d9e0d8; border: 1px solid #d9e0d8; }
.quick-grid a { display: grid; min-height: 9.5rem; align-content: start; background: #fff; padding: 1.25rem; }
.quick-grid a > span { color: #2d7258; font-size: .7rem; font-weight: 800; }
.quick-grid strong { margin-top: .65rem; font-size: 1rem; }
.quick-grid p { margin-top: .4rem; color: #697a70; font-size: .82rem; line-height: 1.5; }
.admin-panel { margin-top: 3rem; border-top: 1px solid #bdcfc2; padding-top: 1.5rem; }
.admin-panel h2 { margin-top: .6rem; }
.admin-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 2rem; margin-top: 1rem; border-top: 1px solid #d9e0d8; }
.admin-links a { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #d9e0d8; padding: 1rem 0; font-size: .9rem; font-weight: 700; }
.admin-links a span { color: #2d7258; }
.small-note,.error { margin-top: 1rem; color: #697a70; font-size: .8rem; line-height: 1.6; }
.error { color: #9a3022; }
@media (max-width: 680px) { .heading-row { align-items: flex-start; flex-direction: column; gap: 1rem; } .status-grid { gap: .6rem; } .status-grid article { padding-top: .75rem; } .quick-grid,.admin-links { grid-template-columns: 1fr; } }
</style>
