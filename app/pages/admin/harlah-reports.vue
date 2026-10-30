<template>
  <main class="report-page">
    <section class="page-inner">
      <div class="heading-row">
        <div><p class="eyebrow">ADMIN / LAPORAN HARLAH NU</p><h1>Pembayaran & donasi</h1><p>Laporan operasional dari alur Payment Portal Harlah NU. Laporan pendaftaran tetap tersedia pada menu peserta.</p></div>
        <NuxtLink to="/admin/participants-report" class="secondary-link">Laporan pendaftaran</NuxtLink>
      </div>
      <div class="tabs" role="tablist">
        <button :class="{ active: active === 'payments' }" @click="setActive('payments')">Pembayaran peserta</button>
        <button :class="{ active: active === 'donations' }" @click="setActive('donations')">Donasi peserta</button>
      </div>
      <form class="filters" @submit.prevent="applyFilters">
        <label><span>Cari</span><input v-model.trim="search" placeholder="Nama, email, referensi, atau nomor pembayaran"></label>
        <label><span>Status</span><select v-model="status"><option value="">Semua status</option><option v-for="value in statuses" :key="value" :value="value">{{ value }}</option></select></label>
        <label><span>Dari tanggal</span><input v-model="dateFrom" type="date"></label>
        <label><span>Sampai tanggal</span><input v-model="dateTo" type="date"></label>
        <div class="filter-actions"><button class="apply" :disabled="loading">Terapkan</button><button type="button" @click="resetFilters">Reset</button></div>
      </form>
      <div v-if="report" class="summary-grid">
        <article><span>Total data</span><strong>{{ report.summary.total_records }}</strong></article>
        <article><span>Lunas</span><strong>{{ report.summary.paid_records }}</strong></article>
        <article><span>Menunggu</span><strong>{{ report.summary.pending_records }}</strong></article>
        <article><span>Total terkonfirmasi</span><strong>{{ money(report.summary.total_paid) }}</strong></article>
      </div>
      <div class="table-heading"><h2>{{ active === 'payments' ? 'Pembayaran pendaftaran' : 'Donasi' }}</h2><button :disabled="exporting || loading" @click="downloadCsv">{{ exporting ? 'Menyiapkan…' : 'Unduh CSV' }}</button></div>
      <div v-if="loading" class="notice" role="status">Memuat laporan…</div>
      <div v-else-if="error" class="notice error" role="alert">{{ error }} <button type="button" @click="load">Coba lagi</button></div>
      <HarlahFinanceTable v-else :items="report?.items || []" :kind="active" show-identity :empty-label="active === 'payments' ? 'Belum ada pembayaran.' : 'Belum ada donasi.'" />
      <div v-if="pages > 1" class="pagination"><button :disabled="page <= 1" @click="page--">Sebelumnya</button><span>Halaman {{ page }} dari {{ pages }} · {{ total }} data</span><button :disabled="page >= pages" @click="page++">Berikutnya</button></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { HarlahFinanceReport } from '~/types/harlahReports';
definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Laporan Harlah NU | Admin' });
const api = useAdminReport();
const active = ref<'payments' | 'donations'>('payments');
const report = ref<HarlahFinanceReport | null>(null);
const loading = ref(true); const exporting = ref(false); const error = ref('');
const search = ref(''); const status = ref(''); const dateFrom = ref(''); const dateTo = ref('');
const page = ref(1); const pages = ref(0); const total = ref(0);
const statuses = ['PAID', 'PENDING', 'UNKNOWN', 'CREATING', 'FAILED', 'EXPIRED', 'CANCELED'];
const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const params = (withPage = true) => ({ search: search.value || undefined, status: status.value || undefined, date_from: dateFrom.value || undefined, date_to: dateTo.value || undefined, page: withPage ? page.value : undefined, size: withPage ? 20 : undefined });
const load = async () => {
  loading.value = true; error.value = '';
  try { const response = active.value === 'payments' ? await api.getHarlahPaymentReport(params()) : await api.getHarlahDonationReport(params()); report.value = response.data; pages.value = response.meta?.pages || 0; total.value = response.meta?.total || 0; }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Laporan belum dapat dimuat.'; }
  finally { loading.value = false; }
};
const setActive = (value: 'payments' | 'donations') => { active.value = value; page.value = 1; load(); };
const applyFilters = () => { page.value = 1; load(); };
const resetFilters = () => { search.value = ''; status.value = ''; dateFrom.value = ''; dateTo.value = ''; page.value = 1; load(); };
const downloadCsv = async () => {
  exporting.value = true; error.value = '';
  try {
    const blob = active.value === 'payments' ? await api.downloadHarlahPaymentReport(params(false)) : await api.downloadHarlahDonationReport(params(false));
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = active.value === 'payments' ? 'laporan-pembayaran-harlah-nu.csv' : 'laporan-donasi-harlah-nu.csv'; link.click(); URL.revokeObjectURL(url);
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'CSV belum dapat diunduh.'; }
  finally { exporting.value = false; }
};
watch(page, load);
onMounted(load);
</script>

<style scoped>
.report-page{min-height:72vh;background:#f5f5ef;color:#17352c;padding:3rem max(1rem,calc((100vw - 1180px)/2))}.page-inner{max-width:1180px;margin-inline:auto}.heading-row{display:flex;justify-content:space-between;align-items:end;gap:2rem}.eyebrow{color:#2d7258;font-size:.72rem;font-weight:800;letter-spacing:.12em}h1,h2{font-family:Georgia,serif}h1{margin-top:.65rem;font-size:clamp(2.3rem,5vw,3.8rem)}.heading-row p:not(.eyebrow){max-width:48rem;margin-top:.7rem;color:#596d61}.secondary-link{border:1px solid #2d7258;border-radius:999px;padding:.75rem 1rem;font-weight:800;white-space:nowrap}.tabs{display:flex;gap:.5rem;margin-top:2rem;border-bottom:1px solid #bdcfc2}.tabs button{padding:.85rem 1rem;color:#687a70;font-weight:800}.tabs button.active{border-bottom:3px solid #f0b323;color:#17352c}.filters{display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:.75rem;margin-top:1.25rem;border:1px solid #d9e0d8;background:#fff;padding:1rem}.filters label{display:grid;gap:.35rem}.filters span{color:#2d7258;font-size:.65rem;font-weight:800;text-transform:uppercase}.filters input,.filters select{min-width:0;border:1px solid #c8d4cb;border-radius:.5rem;background:#fff;padding:.7rem}.filter-actions{display:flex;align-items:end;gap:.4rem}.filter-actions button,.table-heading button,.pagination button{border:1px solid #bdcfc2;border-radius:999px;padding:.65rem .9rem;font-weight:800}.filter-actions .apply,.table-heading button{border-color:#173f32;background:#173f32;color:#fff}.summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;margin:1.5rem 0}.summary-grid article{border-top:1px solid #bdcfc2;padding:1rem 0}.summary-grid span{display:block;color:#2d7258;font-size:.65rem;font-weight:800;text-transform:uppercase}.summary-grid strong{display:block;margin-top:.45rem;font-family:Georgia,serif;font-size:1.55rem}.table-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1.5rem 0 .8rem}.table-heading h2{font-size:1.65rem}.notice{border:1px solid #d9e0d8;background:#fff;padding:1.25rem}.error{color:#991b1b}.pagination{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1.5rem;font-size:.82rem}.pagination button:disabled{opacity:.4}
@media(max-width:900px){.filters{grid-template-columns:1fr 1fr}.filter-actions{grid-column:1/-1}.summary-grid{grid-template-columns:1fr 1fr}}@media(max-width:640px){.heading-row{align-items:flex-start;flex-direction:column}.secondary-link{width:100%;text-align:center}.tabs{overflow-x:auto}.tabs button{white-space:nowrap}.filters,.summary-grid{grid-template-columns:1fr}.filter-actions{grid-column:auto}.table-heading{align-items:flex-start;flex-direction:column}.table-heading button{width:100%}.pagination{justify-content:space-between}.pagination span{text-align:center}}
</style>
