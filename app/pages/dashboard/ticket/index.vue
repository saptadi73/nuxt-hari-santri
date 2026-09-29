<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-emerald-800">{{ copy.ticket }}</p>
    <h1 class="mt-3 text-4xl font-black text-[#17352c]">{{ copy.title }}</h1>
    <p class="mt-3 text-slate-600">{{ copy.description }}</p>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-40 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <div v-else-if="paymentRequired || (!error && !tickets.length)" class="mt-8 rounded-lg border border-emerald-900/15 bg-white p-6" role="status">
      <h2 class="text-xl font-bold text-[#17352c]">{{ emptyCopy.title }}</h2>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{{ emptyDescription }}</p>
      <NuxtLink :to="emptyActionTo" class="mt-5 inline-flex rounded-md bg-[#173f32] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#285442] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
        {{ emptyActionLabel }}
      </NuxtLink>
    </div>

    <div v-else-if="error" class="mt-8 rounded-lg border border-red-300 bg-red-50 p-5 text-red-900" role="alert">
      {{ copy.loadError }}: {{ error.message }}
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-2">
      <article
        v-for="ticket in tickets"
        :key="ticket.id"
        class="rounded-lg border border-slate-200 bg-white p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-600">{{ copy.ticket }}</p>
            <h2 class="mt-2 text-xl font-semibold text-slate-900">{{ ticket.ticket_number }}</h2>
            <p class="mt-1 text-sm text-slate-600">{{ statusLabel(ticket.status) }}</p>
          </div>
          <button
            class="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-emerald-900"
            @click="loadQr(ticket.id)"
          >
            {{ copy.showQr }}
          </button>
        </div>

        <p class="mt-3 text-sm text-slate-600">{{ copy.registrationId }}: {{ ticket.registration_id }}</p>

        <div class="mt-4 space-y-3">
          <button
            class="rounded-md bg-[#173f32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#285442]"
            @click="reissue(ticket.id)"
            :disabled="reissuing === ticket.id"
          >
            {{ reissuing === ticket.id ? copy.processing : copy.reissue }}
          </button>
        </div>
      </article>
    </div>

    <p v-if="qr.imageError && !qr.imageUrl && !paymentRequired" class="mt-6 rounded-lg border border-red-300 bg-red-50 p-5 text-red-900" role="alert">{{ qr.imageError }}</p>

    <div
      v-if="qr.ticket_id && qr.imageUrl && !paymentRequired"
      ref="ticketCardRef"
      class="print-ticket relative mt-10 overflow-hidden rounded-lg border border-emerald-900/15 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-6"
    >
      <div class="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f5f5ef] sm:-left-5 sm:h-10 sm:w-10"></div>
      <div class="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f5f5ef] sm:-right-5 sm:h-10 sm:w-10"></div>
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(23,63,50,0.035),transparent)]"></div>
      <div class="pointer-events-none absolute inset-y-6 right-[18rem] hidden border-r border-dashed border-emerald-900/20 lg:block"></div>
      <div class="pointer-events-none absolute right-4 top-4 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-900 sm:right-6 sm:top-6">
        {{ copy.vipAccess }}
      </div>
      <div class="relative grid gap-8 lg:grid-cols-[1.35fr_280px] lg:items-center">
        <div>
          <div class="flex flex-wrap items-center gap-3 pr-20">
            <p class="text-xs uppercase tracking-[0.45em] text-emerald-800 sm:text-sm">{{ copy.officialPass }}</p>
            <span class="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-900">
              {{ copy.confirmed }}
            </span>
          </div>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2 sm:h-20 sm:w-20">
              <img
                src="/logo_santri_2026.png"
                alt="Logo Hari Santri 2026"
                class="h-full w-full object-contain"
              />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.12em] text-[#17352c] sm:text-base">Hari Santri 2026</p>
            </div>
          </div>
          <h2 class="mt-3 max-w-2xl text-3xl font-black leading-tight text-[#17352c] sm:text-4xl">
            {{ locale === 'id' ? 'Tiket peserta terverifikasi' : 'Your participant ticket is verified' }}
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {{ locale === 'id' ? 'Tunjukkan kode QR ini saat registrasi ulang dan pemeriksaan tiket di lokasi acara.' : 'Present this QR code for registration confirmation and ticket validation at the venue.' }}
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-md border border-slate-200 bg-[#f8faf8] px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-emerald-800">{{ copy.participant }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-slate-900 sm:text-base sm:leading-8">{{ participantName }}</p>
            </div>
            <div class="rounded-md border border-slate-200 bg-[#f8faf8] px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-emerald-800">{{ copy.event }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-slate-900 sm:text-base sm:leading-8">Hari Santri 2026</p>
            </div>
            <div class="rounded-md border border-slate-200 bg-[#f8faf8] px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-emerald-800">{{ copy.ticketNumber }}</p>
              <p class="mt-2 break-words text-sm font-semibold leading-7 text-slate-900 sm:text-[15px] sm:leading-8">{{ qr.ticket_number }}</p>
            </div>
            <div class="rounded-md border border-slate-200 bg-[#f8faf8] px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-emerald-800">{{ copy.dateVenue }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-slate-900 sm:text-[15px]">{{ locale === 'id' ? 'Minggu, 25 Oktober 2026' : 'Sunday, 25 October 2026' }}</p>
              <p class="mt-1 text-xs leading-5 text-slate-600 sm:leading-6">Summarecon Crown Gading, Tarumajaya, Bekasi</p>
            </div>
          </div>

          <div class="ticket-actions mt-6 flex flex-wrap gap-3">
            <button
              v-if="qr.imageUrl"
              type="button"
              :disabled="downloading"
              class="rounded-md bg-[#173f32] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#285442] disabled:cursor-not-allowed disabled:opacity-50"
              @click="downloadTicket"
            >
              {{ downloading ? copy.downloading : copy.download }}
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="mx-auto max-w-[220px] rounded-[1.75rem] border border-white/15 bg-white p-3 shadow-2xl sm:max-w-[250px] sm:p-4">
            <img
              v-if="qr.imageUrl"
              :src="qr.imageUrl"
              alt="QR ticket"
              class="w-full rounded-2xl"
              @error="qr.imageError = copy.qrRenderError"
            />
          </div>
          <p class="mt-4 text-center text-xs uppercase tracking-[0.35em] text-emerald-800">
            {{ copy.scan }}
          </p>
        </div>
      </div>

      <p v-if="qr.imageError" class="relative mt-4 text-sm text-red-700">{{ qr.imageError }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });

const { locale } = useI18n();
const messages = {
  en: { ticket: 'Ticket', title: 'My Ticket', description: 'View your ticket and QR code, or reissue it when needed.', loadError: 'Failed to load tickets', showQr: 'Show QR', registrationId: 'Registration ID', processing: 'Processing…', reissue: 'Reissue', vipAccess: 'Participant Access', officialPass: 'Official Event Ticket', confirmed: 'Confirmed', participant: 'Participant', event: 'Event', ticketNumber: 'Ticket Number', dateVenue: 'Date & Venue', downloading: 'Downloading…', download: 'Download Ticket', qrRenderError: 'QR could not be rendered. Please try reissuing the ticket.', scan: 'Scan for verification', registeredParticipant: 'Registered Participant', tokenUnavailable: 'QR token is not available.', failedQr: 'Failed to load QR', error: 'Error', qrCreateError: 'QR could not be created.', imageError: 'Unable to create ticket image.', downloadError: 'Ticket could not be downloaded. Please try again.', statuses: { active: 'Active', issued: 'Issued', used: 'Used', revoked: 'Revoked' }, seo: 'My Ticket' },
  id: { ticket: 'Tiket', title: 'Tiket Saya', description: 'Lihat tiket dan kode QR Anda, atau terbitkan ulang jika diperlukan.', loadError: 'Tiket gagal dimuat', showQr: 'Tampilkan QR', registrationId: 'Nomor Registrasi', processing: 'Memproses…', reissue: 'Terbitkan ulang', vipAccess: 'Akses Peserta', officialPass: 'Tiket Acara Resmi', confirmed: 'Terkonfirmasi', participant: 'Peserta', event: 'Acara', ticketNumber: 'Nomor Tiket', dateVenue: 'Tanggal & Lokasi', downloading: 'Mengunduh…', download: 'Unduh Tiket', qrRenderError: 'Kode QR tidak dapat ditampilkan. Coba terbitkan ulang tiket.', scan: 'Pindai untuk verifikasi', registeredParticipant: 'Peserta Terdaftar', tokenUnavailable: 'Token QR tidak tersedia.', failedQr: 'Kode QR gagal dimuat', error: 'Kesalahan', qrCreateError: 'Kode QR gagal dibuat.', imageError: 'Gambar tiket gagal dibuat.', downloadError: 'Tiket gagal diunduh. Silakan coba lagi.', statuses: { active: 'Aktif', issued: 'Terbit', used: 'Digunakan', revoked: 'Dibatalkan' }, seo: 'Tiket Saya' }
} as const;
const copy = computed(() => messages[String(locale.value) === 'id' ? 'id' : 'en']);
const statusLabel = (status: string) => (copy.value.statuses as Record<string, string>)[status.toLowerCase()] || status;
useSeoMeta({ title: () => `${copy.value.seo} | Hari Santri 2026` });

const authStore = useAuthStore();
const { getMyTickets, getQrByTicket, reissueTicket } = useTicket();
const registrationFlow = useRegistrationFlow();
const paymentRequired = ref(false);
const isPaymentRequired = (cause: unknown) => {
  const data = (cause as { data?: { errors?: Array<{ code?: string }> } })?.data;
  return data?.errors?.some(item => item.code === 'REGISTRATION_PAYMENT_REQUIRED') === true;
};
const emptyCopy = computed(() => String(locale.value) === 'zh-CN' ? {
  title: '门票二维码暂不可用',
  unpaid: '付款尚未完成。请先付清订单，包括所有分笔付款。付款确认并完成注册后，您才能获取门票二维码。',
  pending: '门票尚未签发。门票需要在付款全额确认并完成注册后才能获取。如果您已付款，请查看付款状态。',
  profile: '付款已收到。请完成注册资料，以便获取门票。',
  paid: '注册已完成，但门票尚未显示。请查看付款确认状态，如需帮助请联系主办方。',
  pay: '前往付款', review: '查看付款状态', complete: '完善注册资料'
} : {
  title: 'Your ticket QR code is not available yet',
  unpaid: 'Your payment is not complete. Please pay the full order balance, including all payment parts. Your ticket QR code requires confirmed payment and completed registration.',
  pending: 'No ticket has been issued yet. Your ticket requires full payment confirmation and completed registration. If you have already paid, review your payment status.',
  profile: 'Your payment has been received. Complete your registration details to proceed with your ticket.',
  paid: 'Your registration is complete, but your ticket is not showing yet. Review your payment confirmation or contact the organizer for help.',
  pay: 'Go to payment', review: 'Review payment status', complete: 'Complete registration'
});
const unpaid = computed(() => paymentRequired.value || ['selected', 'payment_pending'].includes(registrationFlow.primaryStatus.value));
const emptyDescription = computed(() => unpaid.value ? emptyCopy.value.unpaid : registrationFlow.profilePendingType.value ? emptyCopy.value.profile : registrationFlow.primaryStatus.value === 'completed' ? emptyCopy.value.paid : emptyCopy.value.pending);
const emptyActionLabel = computed(() => !unpaid.value && registrationFlow.profilePendingType.value ? emptyCopy.value.complete : registrationFlow.isPaid.value && !unpaid.value ? emptyCopy.value.review : emptyCopy.value.pay);
const emptyActionTo = computed(() => {
  if (!unpaid.value && registrationFlow.profilePendingType.value) return `/register/${registrationFlow.profilePendingType.value}`;
  const orderId = registrationFlow.activeOrderId.value;
  if (!orderId) return registrationFlow.isPaid.value && !unpaid.value ? '/dashboard/invoice' : '/dashboard/cart';
  return `/dashboard/${registrationFlow.isPaid.value && !unpaid.value ? 'payment-status' : 'payment'}?order_id=${encodeURIComponent(orderId)}`;
});

const loading = ref(true);
const reissuing = ref('');
const tickets = ref<Array<{ id: string; registration_id: string; ticket_number: string; status: string }>>([]);
const error = ref<Error | null>(null);
const downloading = ref(false);
const ticketCardRef = ref<HTMLElement | null>(null);
const qr = ref({ ticket_id: '', ticket_number: '', token: '', imageUrl: '', imageError: '' });
const participantName = computed(() => authStore.user?.full_name || authStore.user?.email || copy.value.registeredParticipant);

try {
  const response = await getMyTickets();
  tickets.value = response.data ?? [];
} catch (e) {
  paymentRequired.value = isPaymentRequired(e);
  error.value = e as Error;
} finally {
  if (!tickets.value.length) {
    try { await registrationFlow.loadFlow(); } catch { /* Keep the neutral empty state when progress is unavailable. */ }
  }
  loading.value = false;
}

const loadQr = async (ticketId: string) => {
  try {
    const result = await getQrByTicket(ticketId);
    const ticket = tickets.value.find((item) => item.id === ticketId);
    const token = result.data.qr_token;

    if (!token) throw new Error(copy.value.tokenUnavailable);

    qr.value = {
      ticket_id: ticketId,
      ticket_number: ticket?.ticket_number || '',
      token,
      imageUrl: await QRCode.toDataURL(token, {
        width: 320,
        margin: 2,
        color: { dark: '#020617', light: '#ffffff' }
      }),
      imageError: ''
    };
  } catch (error) {
    paymentRequired.value = isPaymentRequired(error);
    qr.value = {
      ticket_id: ticketId,
      ticket_number: copy.value.failedQr,
      token: copy.value.error,
      imageUrl: '',
      imageError: error instanceof Error ? error.message : copy.value.qrCreateError
    };
  }
};

const downloadTicket = async () => {
  if (!ticketCardRef.value || !qr.value.ticket_number) return;

  try {
    downloading.value = true;
    qr.value.imageError = '';
    ticketCardRef.value.classList.add('ticket-exporting');
    const dataUrl = await toPng(ticketCardRef.value, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#082f49'
    });
    if (!dataUrl) {
      throw new Error(copy.value.imageError);
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${qr.value.ticket_number}-event-pass.png`;
    link.click();
  } catch {
    qr.value.imageError = copy.value.downloadError;
  } finally {
    downloading.value = false;
    ticketCardRef.value.classList.remove('ticket-exporting');
  }
};

const reissue = async (ticketId: string) => {
  reissuing.value = ticketId;
  try {
    await reissueTicket(ticketId);
    const response = await getMyTickets();
    tickets.value = response.data ?? [];
  } finally {
    reissuing.value = '';
  }
};
</script>

<style scoped>
.ticket-exporting {
  box-shadow: none !important;
}

.ticket-exporting .ticket-actions {
  display: none !important;
}

@media print {
  section {
    max-width: none !important;
    padding: 0 !important;
  }

  article,
  button {
    display: none !important;
  }

  .print-ticket {
    margin-top: 0 !important;
    border: 1px solid #cbd5e1 !important;
    background: #ffffff !important;
    box-shadow: none !important;
    color: #0f172a !important;
    break-inside: avoid;
  }

  .print-ticket * {
    color: #0f172a !important;
  }

  .print-ticket img {
    border: 1px solid #e2e8f0;
    background: #ffffff !important;
  }

  .print-ticket a {
    display: none !important;
  }
}
</style>
