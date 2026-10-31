<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <header class="mb-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">{{ t('adminParticipants.panel') }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{{ t('adminParticipants.title') }}</h1>
        <p class="mt-2 text-sm text-slate-600">{{ t('adminParticipants.lastUpdated', { value: lastUpdatedLabel }) }}</p>
      </div>
    </header>

    <div class="report-filters mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <label class="grid w-full gap-2 text-sm sm:max-w-xl">
        <span class="font-semibold text-slate-700">{{ t('adminParticipants.search') }}</span>
        <input v-model="searchTerm" type="search" :placeholder="t('adminParticipants.searchPlaceholder')" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15">
      </label>
      <label class="grid shrink-0 gap-2 text-sm">
        <span class="font-semibold text-slate-700">{{ t('adminParticipants.perPage') }}</span>
        <select v-model.number="pageSize" class="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>
    </div>

    <div v-if="pending" class="grid gap-4">
      <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
      {{ errorMessage }}
    </div>

    <div v-else class="space-y-6">
      <article class="report-card rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-slate-900">{{ t('adminParticipants.participants') }}</h2>
          <button :disabled="csvLoading" class="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60" @click="downloadCsv">{{ t('adminParticipants.downloadCsv') }}</button>
        </div>

        <p v-if="csvError" role="alert" class="mb-3 text-sm text-rose-700">{{ csvError }}</p>
        <div class="mb-3 text-sm text-slate-600">
          {{ t('adminParticipants.resultCount', { total: totalParticipants, page: currentPage, pages: totalPages }) }}
        </div>

        <div class="report-table-shell overflow-x-auto">
          <table class="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr class="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th scope="col" class="py-3 pr-4">{{ t('adminParticipants.email') }}</th>
                <th scope="col" class="py-3 pr-4">{{ t('adminParticipants.joinedAt') }}</th>
                <th scope="col" class="py-3 pr-4">{{ t('adminParticipants.originRegion') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in participants" :key="item.user_id || item.participant_id || item.email" class="border-b border-slate-100 last:border-0">
                <td class="break-all py-4 pr-4 font-medium text-slate-900" :data-label="t('adminParticipants.email')">{{ item.email || t('adminParticipants.notAvailable') }}</td>
                <td class="py-4 pr-4" :data-label="t('adminParticipants.joinedAt')">{{ formatJoinedAt(item) }}</td>
                <td class="py-4 pr-4" :data-label="t('adminParticipants.originRegion')">{{ formatOriginRegion(item) }}</td>
              </tr>
              <tr v-if="!participants.length">
                <td colspan="3" class="py-8 text-center text-slate-500" data-label="">{{ t('adminParticipants.noData') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <nav v-if="totalPages > 1" :aria-label="t('adminParticipants.pagination')" class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
          <button :disabled="currentPage <= 1" class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage = 1">
            {{ t('adminParticipants.first') }}
          </button>
          <div class="flex items-center gap-2">
            <button :disabled="currentPage <= 1" class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage--">
              {{ t('adminParticipants.previous') }}
            </button>
            <span class="text-xs text-slate-600">{{ t('adminParticipants.page', { current: currentPage, total: totalPages }) }}</span>
            <button :disabled="currentPage >= totalPages" class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage++">
              {{ t('adminParticipants.next') }}
            </button>
          </div>
          <button :disabled="currentPage >= totalPages" class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage = totalPages">
            {{ t('adminParticipants.last') }}
          </button>
        </nav>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAdminReport, type ParticipantReportItem } from '~/composables/useAdminReport';

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Participants Report | Harlah NU ke-101' });

const { getParticipantReport, downloadParticipantReport } = useAdminReport();
const csvLoading = ref(false);
const csvError = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const totalParticipants = ref(0);
const totalPages = ref(1);

const loading = ref(false);
const pending = computed(() => loading.value);
const errorMessage = ref('');
const lastUpdated = ref<Date | null>(null);
const participants = ref<ParticipantReportItem[]>([]);
const routeReady = ref(false);
const autoReloadTimer = ref<ReturnType<typeof setTimeout> | null>(null);
let reportRequest = 0;

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return t('adminParticipants.notLoaded');
  return new Intl.DateTimeFormat(String(locale.value) === 'id' ? 'id-ID' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(lastUpdated.value);
});

const buildReportParams = () => {
  const params: Record<string, string | number | undefined> = {
    page: currentPage.value,
    size: pageSize.value
  };

  if (searchTerm.value.trim()) params.search = searchTerm.value.trim();

  return params;
};

const readFiltersFromQuery = () => {
  const q = route.query;
  const getQueryString = (value: unknown): string => {
    if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

  searchTerm.value = getQueryString(q.search);

  const pageValue = Number(getQueryString(q.page));
  if (pageValue > 0) currentPage.value = pageValue;

  const sizeValue = Number(getQueryString(q.size));
  if ([10, 20, 50, 100].includes(sizeValue)) pageSize.value = sizeValue;
};

const buildQueryState = () => ({
  search: searchTerm.value || undefined,
  page: String(currentPage.value),
  size: String(pageSize.value)
});

const syncFiltersToUrl = () => {
  if (!routeReady.value) return;
  const nextQuery = Object.fromEntries(
    Object.entries(buildQueryState())
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => [key, String(value)])
  );
  router.replace({ query: nextQuery });
};

const downloadCsv = async () => {
  if (csvLoading.value) return;
  csvLoading.value = true;
  csvError.value = '';
  try {
    const params = buildReportParams();
    delete params.page;
    delete params.size;
    const blob = await downloadParticipantReport(params);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFileName.value;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    csvError.value = t('adminParticipants.csvError');
  } finally {
    csvLoading.value = false;
  }
};

const csvFileName = computed(() => `participants-report-${new Date().toISOString().slice(0, 10)}.csv`);

const loadReport = async () => {
  const requestId = ++reportRequest;
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await getParticipantReport(buildReportParams());
    if (requestId !== reportRequest) return;
    participants.value = response.data || [];
    totalParticipants.value = response.meta?.total ?? participants.value.length;
    totalPages.value = response.meta?.pages ?? 1;
    lastUpdated.value = new Date();
  } catch (error) {
    if (requestId !== reportRequest) return;
    errorMessage.value = t('adminParticipants.loadError');
    console.error(error);
  } finally {
    if (requestId === reportRequest) loading.value = false;
  }
};

const scheduleAutoReload = () => {
  if (!routeReady.value) return;
  if (autoReloadTimer.value) {
    clearTimeout(autoReloadTimer.value);
    autoReloadTimer.value = null;
  }
  autoReloadTimer.value = setTimeout(() => {
    loadReport();
  }, 350);
};

const formatJoinedAt = (item: ParticipantReportItem) => {
  const value = item.registered_at || item.created_at || item.registration_created_at || item.account_created_at ||
    item.registration?.created_at || item.registrations?.[0]?.created_at || item.account?.created_at;
  if (!value) return t('adminParticipants.notAvailable');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(String(locale.value) === 'id' ? 'id-ID' : 'en-GB', { dateStyle: 'medium' }).format(date);
};

const formatOriginRegion = (item: ParticipantReportItem) => {
  const records = [item, item.registration, ...(item.registrations || []), item.account]
    .filter((record): record is NonNullable<typeof record> => Boolean(record));
  const directRegion = records.find(record => record.origin_region || record.region_name || record.region);
  const directRegionName = directRegion?.origin_region || directRegion?.region_name || directRegion?.region;
  if (directRegionName?.trim()) return directRegionName.trim();

  const namedRegions = records.flatMap(record => [record.village_name || record.village, record.district_name || record.district, record.regency_name || record.regency])
    .filter((region): region is string => Boolean(region?.trim()))
    .map(region => region.trim());
  if (namedRegions.length) return [...new Set(namedRegions)].join(', ');

  const regionCodes = records.flatMap(record => [record.village_code, record.district_code, record.regency_code])
    .filter((code): code is string => Boolean(code));
  if (regionCodes.length) return [...new Set(regionCodes)].join(', ');

  return t('adminParticipants.notAvailable');
};

onBeforeUnmount(() => {
  if (autoReloadTimer.value) clearTimeout(autoReloadTimer.value);
});

readFiltersFromQuery();
await loadReport();
routeReady.value = true;
syncFiltersToUrl();

watch(searchTerm, () => {
  currentPage.value = 1;
  syncFiltersToUrl();
  scheduleAutoReload();
});

watch(pageSize, () => {
  currentPage.value = 1;
  syncFiltersToUrl();
  scheduleAutoReload();
});

watch(currentPage, () => {
  syncFiltersToUrl();
  loadReport();
});
</script>

<style scoped>
:global(html) {
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
}

@media (max-width: 767px) {
  .report-table-shell {
    overflow: visible;
  }

  .report-table-shell table,
  .report-table-shell thead,
  .report-table-shell tbody,
  .report-table-shell tr,
  .report-table-shell th,
  .report-table-shell td {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .report-table-shell thead {
    display: none;
  }

  .report-table-shell tbody {
    display: grid;
    gap: 0.75rem;
  }

  .report-table-shell tr {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    background: #fff;
    padding: 0.9rem;
  }

  .report-table-shell td {
    border: 0;
    padding: 0.3rem 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    color: #334155;
    font-size: 0.82rem;
  }

  .report-table-shell td::before {
    content: attr(data-label);
    color: #64748b;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    flex-shrink: 0;
    width: 34%;
  }

  .report-table-shell td[colspan] {
    display: block;
    text-align: center;
  }

  .report-table-shell td[colspan]::before {
    content: none;
  }

  .report-table-shell td > * {
    flex: 1;
    min-width: 0;
  }
}
</style>
