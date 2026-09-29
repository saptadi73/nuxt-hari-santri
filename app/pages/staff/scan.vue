<template>
  <section class="scan-page">
    <div class="scan-inner">
      <p class="eyebrow">HARI SANTRI 2026 / CHECK-IN</p>
      <h1>{{ id ? 'Pindai tiket peserta' : 'Scan participant ticket' }}</h1>
      <p class="intro">{{ id ? 'Tiket diperiksa langsung ke server. Setiap tiket hanya dapat digunakan satu kali.' : 'Tickets are checked online. Each ticket can only be used once.' }}</p>

      <p v-if="!isOrganizer" class="error" role="alert">{{ id ? 'Halaman ini khusus petugas acara.' : 'This page is for event staff only.' }}</p>
      <template v-else>
        <div class="scanner-frame">
          <video ref="video" autoplay muted playsinline />
          <p v-if="!cameraStarted" class="camera-placeholder">{{ id ? 'Kamera akan aktif setelah Anda memulai pemindaian.' : 'Camera starts when you begin scanning.' }}</p>
        </div>
        <div class="actions">
          <button type="button" class="button button--dark" :disabled="cameraStarted || submitting" @click="startCamera">{{ cameraStarted ? (id ? 'Kamera aktif' : 'Camera active') : (id ? 'Mulai kamera' : 'Start camera') }}</button>
          <button v-if="cameraStarted" type="button" class="button button--outline" @click="stopCamera">{{ id ? 'Hentikan kamera' : 'Stop camera' }}</button>
        </div>
        <form class="manual-form" @submit.prevent="submitManual">
          <label for="qr-token">{{ id ? 'Atau masukkan token tiket' : 'Or enter ticket token' }}</label>
          <div class="manual-row"><input id="qr-token" v-model.trim="manualToken" autocomplete="off" required><button type="submit" class="button button--dark" :disabled="submitting || !manualToken">{{ submitting ? (id ? 'Memeriksa…' : 'Checking…') : (id ? 'Check-in' : 'Check in') }}</button></div>
        </form>
        <div v-if="result" class="result" :class="resultTone" role="status" aria-live="polite">
          <strong>{{ result.ticket_number }}</strong><span>{{ result.participant_name }}</span><small>{{ result.checked_in_at }}</small>
        </div>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import type { HariSantriCheckinResult } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const auth = useAuthStore();
const isOrganizer = auth.isAdminOrOrganizer;
const api = useHariSantri();
const video = ref<HTMLVideoElement | null>(null);
const manualToken = ref('');
const cameraStarted = ref(false);
const submitting = ref(false);
const error = ref('');
const result = ref<HariSantriCheckinResult | null>(null);
const resultTone = ref('');
let scannerControls: IScannerControls | undefined;
const reader = new BrowserQRCodeReader();

const submitToken = async (token: string) => {
  if (submitting.value || !token) return;
  submitting.value = true;
  error.value = '';
  result.value = null;
  try {
    result.value = (await api.checkinTicket(token)).data;
    resultTone.value = 'success';
    manualToken.value = '';
  } catch (cause) {
    resultTone.value = 'error';
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Tiket tidak dapat diproses.' : 'Ticket could not be checked in.');
  } finally {
    submitting.value = false;
  }
};

const startCamera = async () => {
  if (!video.value || cameraStarted.value) return;
  error.value = '';
  try {
    scannerControls = await reader.decodeFromVideoDevice(undefined, video.value, (scan, _error, controls) => {
      scannerControls = controls;
      if (scan) {
        stopCamera();
        void submitToken(scan.getText());
      }
    });
    cameraStarted.value = true;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Kamera tidak dapat dibuka.' : 'Camera could not be opened.');
  }
};

const stopCamera = () => {
  scannerControls?.stop();
  scannerControls = undefined;
  cameraStarted.value = false;
};
const submitManual = () => submitToken(manualToken.value);
onBeforeUnmount(stopCamera);
useSeoMeta({ title: () => `${id.value ? 'Check-in Peserta' : 'Participant Check-in'} | Hari Santri 2026` });
</script>

<style scoped>
.scan-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 780px) / 2)); }
.scan-inner { max-width: 780px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1 { max-width: 14ch; margin-top: .7rem; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.05; }
.intro { margin-top: .8rem; color: #596d61; line-height: 1.7; }
.scanner-frame { position: relative; display: grid; min-height: 20rem; place-items: center; overflow: hidden; margin-top: 1.5rem; background: #183a30; }
.scanner-frame video { display: block; width: 100%; max-height: 30rem; object-fit: cover; }
.camera-placeholder { position: absolute; padding: 1rem; color: #fff; text-align: center; }
.actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1rem; }
.button { display: inline-flex; min-height: 2.75rem; align-items: center; justify-content: center; border: 0; padding: .7rem 1rem; font-size: .84rem; font-weight: 800; }
.button--dark { background: #17352c; color: #fff; } .button--outline { border: 1px solid #bdcfc2; }
.manual-form { margin-top: 2rem; border-top: 1px solid #d9e0d8; padding-top: 1.3rem; }
.manual-form label { display: block; margin-bottom: .5rem; font-size: .85rem; font-weight: 800; }
.manual-row { display: flex; gap: .6rem; }
.manual-row input { min-width: 0; min-height: 2.75rem; flex: 1; border: 1px solid #cbd6ce; background: #fff; padding: .65rem; }
.result { display: grid; gap: .35rem; margin-top: 1rem; border-left: 4px solid #2d7258; background: #e5f1e8; padding: 1rem; }
.result.error { border-color: #aa382b; background: #fff0ec; }
.result small { color: #697a70; }
.error { margin-top: 1rem; color: #9a3022; }
@media (max-width: 560px) { .manual-row { flex-direction: column; } .manual-row .button { width: 100%; } }
</style>
