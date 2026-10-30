<template>
  <section class="tickets-page">
    <div class="tickets-inner">
      <p class="eyebrow">HARLAH NU KE-101 / {{ id ? 'TIKET' : 'TICKETS' }}</p>
      <h1>{{ id ? 'Tiket peserta' : 'Participant tickets' }}</h1>
      <p class="intro">{{ id ? 'Setiap peserta memiliki tiket QR sendiri. Tunjukkan saat check-in dan jangan bagikan QR secara publik.' : 'Each participant has an individual QR ticket. Show it at check-in and do not share it publicly.' }}</p>
      <p v-if="loading" class="state">{{ id ? 'Memuat tiket…' : 'Loading tickets…' }}</p>
      <p v-else-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="!tickets.length" class="state">{{ id ? 'Tiket akan muncul setelah pembayaran terverifikasi.' : 'Tickets appear after payment is verified.' }}</p>
      <div v-else class="ticket-list">
        <article v-for="ticket in tickets" :key="ticket.ticket_id" class="ticket">
          <div class="ticket__details">
            <div class="ticket__brand">
              <img src="/logo_santri_2026.png" alt="Logo Harlah NU ke-101">
              <div><strong>HARLAH NU KE-101</strong><small>31 JANUARI 2027 · SUMMARECON CROWN GADING</small></div>
            </div>
            <div class="ticket__activity">{{ ticket.activity_type === 'CYCLING' ? (id ? 'SEPEDA SANTAI' : 'LEISURE CYCLING') : (id ? 'JALAN SEHAT KELUARGA' : 'FAMILY WALK') }}</div>
            <h2>{{ ticket.participant_name }}</h2>
            <div class="ticket__number">{{ ticket.ticket_number }}</div>
            <div class="ticket__rule"></div>
            <small>{{ id ? 'Tiket diterbitkan' : 'Ticket issued' }} · {{ formatDate(ticket.issued_at) }}</small>
            <p class="ticket__hint">{{ id ? 'Tunjukkan QR ini saat registrasi ulang. Tiket berlaku untuk pemiliknya.' : 'Show this QR at registration. This ticket is personal.' }}</p>
          </div>
          <div class="ticket__qr">
            <span class="ticket__qr-label">SCAN UNTUK CHECK-IN</span>
            <img v-if="qrByTicket[ticket.ticket_id]" :src="qrByTicket[ticket.ticket_id]" :alt="`${id ? 'QR tiket' : 'Ticket QR'} ${ticket.ticket_number}`" width="192" height="192">
            <span v-else>{{ id ? 'Menyiapkan QR…' : 'Preparing QR…' }}</span>
            <span class="ticket__qr-caption">{{ id ? 'Tiket resmi peserta' : 'Official participant ticket' }}</span>
          </div>
        </article>
      </div>
      <button type="button" class="refresh" :disabled="loading" @click="loadTickets">{{ id ? 'Muat ulang tiket' : 'Refresh tickets' }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';
import type { HariSantriTicket } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const api = useHariSantri();
const tickets = ref<HariSantriTicket[]>([]);
const qrByTicket = reactive<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const formatDate = (value: string) => new Intl.DateTimeFormat(id.value ? 'id-ID' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const loadTickets = async () => {
  loading.value = true;
  error.value = '';
  try {
    tickets.value = (await api.getMyTickets()).data;
    for (const ticket of tickets.value) qrByTicket[ticket.ticket_id] = await QRCode.toDataURL(ticket.qr_token, { width: 192, margin: 1, errorCorrectionLevel: 'M' });
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Tiket belum dapat dimuat.' : 'Tickets could not be loaded.');
  } finally {
    loading.value = false;
  }
};
onMounted(() => { void loadTickets(); });
useSeoMeta({ title: () => `${id.value ? 'Tiket Peserta' : 'Participant Tickets'} | Harlah NU ke-101` });
</script>

<style scoped>
.tickets-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1000px) / 2)); }
.tickets-inner { max-width: 1000px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05; }
.intro { max-width: 42rem; margin-top: .8rem; color: #596d61; line-height: 1.7; }
.state,.error { margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1rem 0; color: #697a70; }
.error { color: #9a3022; }
.ticket-list { display: grid; gap: 1.25rem; margin-top: 2rem; }
.ticket { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1fr) 14.5rem; align-items: stretch; gap: 1.5rem; min-height: 18rem; border: 1px solid #d4af37; border-radius: 1.25rem; background: linear-gradient(125deg,#063d28 0%,#075b36 52%,#13834d 100%); color: #fffdf5; padding: 1.5rem; box-shadow: 0 18px 40px rgba(6,61,40,.2); }
.ticket::before { content:""; position:absolute; inset:auto -6rem -9rem auto; width:22rem; height:22rem; border:2px solid rgba(245,190,52,.28); border-radius:50%; box-shadow:0 0 0 1.4rem rgba(245,190,52,.08),0 0 0 3rem rgba(245,190,52,.05); z-index:-1; }
.ticket::after { content:""; position:absolute; inset:0; opacity:.12; z-index:-1; background-image:linear-gradient(135deg,transparent 0 46%,#f5c34d 47% 48%,transparent 49% 100%); background-size:5rem 5rem; }
.ticket__details { display:flex; flex-direction:column; justify-content:center; min-width:0; }
.ticket__brand { display:flex; align-items:center; gap:.7rem; margin-bottom:1.5rem; }
.ticket__brand img { width:3rem; height:3rem; border-radius:.75rem; background:#fff; padding:.2rem; object-fit:contain; }
.ticket__brand strong { display:block; color:#f8ca55; font-size:.75rem; letter-spacing:.16em; }
.ticket__brand small { display:block; margin-top:.25rem; color:#d6eadc; font-size:.58rem; letter-spacing:.08em; }
.ticket__activity { color:#f8ca55; font-size:.68rem; font-weight:900; letter-spacing:.18em; }
.ticket__details h2 { margin-top:.45rem; color:#fff; font-size:clamp(1.7rem,4vw,2.6rem); line-height:1.08; }
.ticket__number { margin-top:.7rem; color:#e3f1e5; font-size:1rem; font-weight:900; letter-spacing:.08em; }
.ticket__rule { width:5rem; height:2px; margin:1rem 0 .4rem; background:#f5c34d; }
.ticket__details small { display:block; color:#d0e5d5; font-size:.75rem; }
.ticket__hint { max-width:34rem; margin-top:.8rem; color:#c5dfcb; font-size:.75rem; line-height:1.5; }
.ticket__qr { display:grid; align-content:center; justify-items:center; gap:.55rem; border-radius:1rem; background:#fffdf7; padding:1rem; color:#075b36; box-shadow:0 8px 22px rgba(0,0,0,.18); }
.ticket__qr-label { color:#075b36!important; font-size:.62rem!important; font-weight:900; letter-spacing:.14em; }
.ticket__qr img { display:block; width:12rem; height:12rem; }
.ticket__qr > span:not(.ticket__qr-label):not(.ticket__qr-caption) { color:#697a70; font-size:.78rem; }
.ticket__qr-caption { color:#6b7a6f; font-size:.62rem; letter-spacing:.08em; }
.refresh { margin-top: 1.5rem; border: 1px solid #b9c9be; padding: .7rem 1rem; font-size: .85rem; font-weight: 800; }
.refresh:disabled { opacity: .5; }
@media (max-width: 640px) { .tickets-page { padding-top:2rem; padding-bottom:2rem; } .ticket { grid-template-columns:1fr; gap:1rem; padding:1.1rem; } .ticket__brand { margin-bottom:1.15rem; } .ticket__brand img { width:2.6rem; height:2.6rem; } .ticket__brand small { font-size:.5rem; } .ticket__qr { width:min(100%,15rem); justify-self:center; } .ticket__qr img { width:11rem; height:11rem; } }
@media print { .tickets-page { background:#fff; padding:0; } .tickets-inner > :not(.ticket-list) { display:none!important; } .ticket-list { margin:0; } .ticket { break-inside:avoid; box-shadow:none; print-color-adjust:exact; -webkit-print-color-adjust:exact; } }
</style>
