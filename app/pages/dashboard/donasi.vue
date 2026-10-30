<template>
  <main class="donation-page">
    <section class="page-inner">
      <div class="heading-row">
        <div><p class="eyebrow">HARLAH NU KE-101 / DONASI</p><h1>Riwayat donasi Anda</h1><p>Donasi yang menggunakan email akun ini ditampilkan otomatis beserta status konfirmasinya.</p></div>
        <NuxtLink to="/donasi" class="primary-link">Berikan donasi</NuxtLink>
      </div>
      <div v-if="report" class="summary-grid">
        <article><span>Total donasi</span><strong>{{ report.summary.total_records }}</strong></article>
        <article><span>Sudah dikonfirmasi</span><strong>{{ report.summary.paid_records }}</strong></article>
        <article><span>Donasi terkonfirmasi</span><strong>{{ money(report.summary.total_paid) }}</strong></article>
      </div>
      <div v-if="loading" class="notice" role="status">Memuat riwayat donasi…</div>
      <div v-else-if="error" class="notice error" role="alert">{{ error }} <button type="button" @click="load">Coba lagi</button></div>
      <HarlahFinanceTable v-else :items="report?.items || []" kind="donations" empty-label="Belum ada donasi menggunakan email akun ini." />
      <div v-if="pages > 1" class="pagination">
        <button :disabled="page <= 1" @click="page--">Sebelumnya</button><span>Halaman {{ page }} dari {{ pages }}</span><button :disabled="page >= pages" @click="page++">Berikutnya</button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { HarlahFinanceReport } from '~/types/harlahReports';
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Riwayat Donasi | Harlah NU ke-101' });
const api = useHariSantri();
const report = ref<HarlahFinanceReport | null>(null);
const loading = ref(true);
const error = ref('');
const page = ref(1);
const pages = ref(0);
const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const load = async () => {
  loading.value = true; error.value = '';
  try { const response = await api.getMyDonations(page.value, 20); report.value = response.data; pages.value = response.meta?.pages || 0; }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Riwayat donasi belum dapat dimuat.'; }
  finally { loading.value = false; }
};
watch(page, load);
onMounted(load);
</script>

<style scoped>
.donation-page{min-height:72vh;background:#f5f5ef;color:#17352c;padding:3rem max(1rem,calc((100vw - 1120px)/2))}.page-inner{max-width:1120px;margin-inline:auto}.heading-row{display:flex;justify-content:space-between;align-items:end;gap:2rem}.eyebrow{color:#2d7258;font-size:.72rem;font-weight:800;letter-spacing:.12em}h1{margin-top:.65rem;font-family:Georgia,serif;font-size:clamp(2.3rem,5vw,3.8rem)}.heading-row p:not(.eyebrow){margin-top:.7rem;color:#596d61}.primary-link{border-radius:999px;background:#f8b817;padding:.85rem 1.25rem;font-weight:800;white-space:nowrap}.summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin:2rem 0}.summary-grid article{border-top:1px solid #bdcfc2;padding:1rem 0}.summary-grid span{display:block;color:#2d7258;font-size:.68rem;font-weight:800;text-transform:uppercase}.summary-grid strong{display:block;margin-top:.45rem;font-family:Georgia,serif;font-size:1.7rem}.notice{margin:2rem 0;border:1px solid #d9e0d8;background:#fff;padding:1.25rem}.error{color:#991b1b}.error button{margin-left:.5rem;text-decoration:underline}.pagination{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1.5rem;font-size:.85rem}.pagination button{border:1px solid #bdcfc2;border-radius:999px;padding:.6rem 1rem;font-weight:700}.pagination button:disabled{opacity:.4}
@media(max-width:680px){.heading-row{align-items:flex-start;flex-direction:column}.summary-grid{grid-template-columns:1fr}.primary-link{width:100%;text-align:center}}
</style>
