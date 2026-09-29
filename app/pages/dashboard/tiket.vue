<template>
  <section class="tickets-page">
    <div class="tickets-inner">
      <p class="eyebrow">HARI SANTRI 2026 / {{ id ? 'TIKET' : 'TICKETS' }}</p>
      <h1>{{ id ? 'Tiket peserta' : 'Participant tickets' }}</h1>
      <p class="intro">{{ id ? 'Setiap peserta memiliki tiket QR sendiri. Tunjukkan saat check-in dan jangan bagikan QR secara publik.' : 'Each participant has an individual QR ticket. Show it at check-in and do not share it publicly.' }}</p>
      <p v-if="loading" class="state">{{ id ? 'Memuat tiket…' : 'Loading tickets…' }}</p>
      <p v-else-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="!tickets.length" class="state">{{ id ? 'Tiket akan muncul setelah pembayaran terverifikasi.' : 'Tickets appear after payment is verified.' }}</p>
      <div v-else class="ticket-list">
        <article v-for="ticket in tickets" :key="ticket.ticket_id" class="ticket">
          <div class="ticket__details">
            <span>{{ ticket.activity_type === 'CYCLING' ? (id ? 'SEPEDA SEHAT' : 'HEALTHY CYCLING') : (id ? 'JALAN SEHAT KELUARGA' : 'FAMILY WALK') }}</span>
            <h2>{{ ticket.participant_name }}</h2>
            <p>{{ ticket.ticket_number }}</p>
            <small>{{ id ? 'Terbit' : 'Issued' }} · {{ formatDate(ticket.issued_at) }}</small>
          </div>
          <div class="ticket__qr">
            <img v-if="qrByTicket[ticket.ticket_id]" :src="qrByTicket[ticket.ticket_id]" :alt="`${id ? 'QR tiket' : 'Ticket QR'} ${ticket.ticket_number}`" width="192" height="192">
            <span v-else>{{ id ? 'Menyiapkan QR…' : 'Preparing QR…' }}</span>
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
useSeoMeta({ title: () => `${id.value ? 'Tiket Peserta' : 'Participant Tickets'} | Hari Santri 2026` });
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
.ticket-list { display: grid; gap: 1rem; margin-top: 2rem; }
.ticket { display: grid; grid-template-columns: minmax(0, 1fr) 12rem; align-items: center; gap: 1.5rem; border: 1px solid #d9e0d8; background: #fff; padding: 1.25rem; }
.ticket__details span { color: #8a6b20; font-size: .68rem; font-weight: 800; letter-spacing: .12em; }
.ticket__details h2 { margin-top: .5rem; font-size: 1.7rem; }
.ticket__details p { margin-top: .5rem; font-weight: 800; }
.ticket__details small { display: block; margin-top: .45rem; color: #697a70; }
.ticket__qr { display: grid; min-height: 12rem; place-items: center; background: white; }
.ticket__qr img { display: block; width: 12rem; height: 12rem; }
.ticket__qr span { color: #697a70; font-size: .78rem; }
.refresh { margin-top: 1.5rem; border: 1px solid #b9c9be; padding: .7rem 1rem; font-size: .85rem; font-weight: 800; }
.refresh:disabled { opacity: .5; }
@media (max-width: 640px) { .ticket { grid-template-columns: 1fr; } .ticket__qr { justify-self: start; } }
</style>
