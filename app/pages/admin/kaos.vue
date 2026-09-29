<template>
  <section class="inventory-page">
    <div class="inventory-inner">
      <p class="eyebrow">ADMIN REGISTRASI / HARI SANTRI 2026</p>
      <h1>{{ id ? 'Ukuran & inventori kaos' : 'Shirt sizes & inventory' }}</h1>
      <p class="intro">{{ id ? 'Atur ukuran dan jumlah stok. Stok yang sudah dipesan atau dialokasikan tidak dapat dikurangi.' : 'Manage shirt sizes and stock. Reserved or allocated units cannot be removed.' }}</p>

      <p v-if="loading" class="state">{{ id ? 'Memuat inventori…' : 'Loading inventory…' }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <form class="create-form" @submit.prevent="createSize">
        <h2>{{ id ? 'Tambah ukuran' : 'Add a size' }}</h2>
        <div class="form-grid">
          <label><span>{{ id ? 'Kode' : 'Code' }}</span><input v-model.trim="form.code" required maxlength="24" placeholder="M"></label>
          <label><span>{{ id ? 'Label' : 'Label' }}</span><input v-model.trim="form.label" required maxlength="80" :placeholder="id ? 'Dewasa M' : 'Adult M'"></label>
          <label><span>{{ id ? 'Kapasitas' : 'Capacity' }}</span><input v-model.number="form.capacity" required type="number" min="0"></label>
        </div>
        <button type="submit" class="button button--dark" :disabled="saving">{{ saving ? (id ? 'Menyimpan…' : 'Saving…') : (id ? 'Tambah ukuran' : 'Add size') }}</button>
      </form>

      <div class="inventory-table" role="table" :aria-label="id ? 'Inventori kaos' : 'Shirt inventory'">
        <div class="table-head" role="row"><span>{{ id ? 'Ukuran' : 'Size' }}</span><span>{{ id ? 'Stok' : 'Stock' }}</span><span>{{ id ? 'Dipesan' : 'Reserved' }}</span><span>{{ id ? 'Dialokasikan' : 'Allocated' }}</span><span>{{ id ? 'Tersedia' : 'Available' }}</span><span>{{ id ? 'Aksi' : 'Action' }}</span></div>
        <div v-for="size in sizes" :key="size.id" class="table-row" role="row">
          <div><strong>{{ size.code }}</strong><small>{{ size.label }}</small><label class="active-toggle"><input v-model="drafts[size.id]!.active" type="checkbox">{{ id ? 'Aktif' : 'Active' }}</label></div>
          <span>{{ size.capacity }}</span><span>{{ size.reserved }}</span><span>{{ size.allocated }}</span><strong>{{ size.available }}</strong>
          <div class="row-action"><input v-model.number="drafts[size.id]!.capacity" aria-label="Capacity" type="number" :min="size.reserved + size.allocated"><button type="button" class="save-button" :disabled="saving" @click="saveSize(size.id)">{{ id ? 'Simpan' : 'Save' }}</button></div>
        </div>
        <p v-if="!loading && !sizes.length" class="state">{{ id ? 'Belum ada ukuran kaos.' : 'No shirt sizes have been configured.' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShirtSizeOption } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const auth = useAuthStore();
const runtime = useRuntimeConfig();
const eventApi = useEvent();
const hariSantriApi = useHariSantri();
const eventId = ref('');
const sizes = ref<ShirtSizeOption[]>([]);
const drafts = reactive<Record<string, { active: boolean; capacity: number }>>({});
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const form = reactive({ code: '', label: '', capacity: 0 });

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (!auth.isAdminOrOrganizer) throw new Error(id.value ? 'Halaman ini khusus admin registrasi.' : 'This page is restricted to registration administrators.');
    const events = await eventApi.getEvents(1, 100);
    const event = events.data.find(item => item.slug === runtime.public.eventSlug);
    if (!event) throw new Error(id.value ? 'Event Hari Santri belum dibuat.' : 'The Hari Santri event has not been created.');
    eventId.value = event.id;
    sizes.value = (await hariSantriApi.getAdminShirtSizes(event.id)).data;
    for (const size of sizes.value) drafts[size.id] = { active: size.active, capacity: size.capacity };
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load inventory.';
  } finally {
    loading.value = false;
  }
};

const createSize = async () => {
  saving.value = true;
  error.value = '';
  try {
    await hariSantriApi.createShirtSize(eventId.value, { code: form.code, label: form.label, capacity: form.capacity, active: true, sort_order: sizes.value.length });
    form.code = '';
    form.label = '';
    form.capacity = 0;
    await load();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to add shirt size.';
  } finally {
    saving.value = false;
  }
};

const saveSize = async (sizeId: string) => {
  const current = sizes.value.find(size => size.id === sizeId);
  const draft = drafts[sizeId];
  if (!current || !draft) return;
  saving.value = true;
  error.value = '';
  try {
    await hariSantriApi.updateShirtSize(sizeId, { code: current.code, label: current.label, active: draft.active, sort_order: current.sort_order, size_chart: current.size_chart, capacity: draft.capacity });
    await load();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to update shirt inventory.';
  } finally {
    saving.value = false;
  }
};

onMounted(() => { void load(); });
useSeoMeta({ title: () => `${id.value ? 'Inventori Kaos' : 'Shirt Inventory'} | Hari Santri 2026` });
</script>

<style scoped>
.inventory-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1100px) / 2)); }
.inventory-inner { max-width: 1100px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.3rem, 5vw, 4rem); line-height: 1.05; }
.intro { max-width: 44rem; margin-top: .8rem; color: #596d61; line-height: 1.7; }
.create-form { margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1.25rem 0; }
.create-form h2 { font-size: 1.5rem; }
.form-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 1rem 0; }
.form-grid label span { display: block; margin-bottom: .35rem; font-size: .82rem; font-weight: 700; }
.form-grid input,.row-action input { min-height: 2.6rem; width: 100%; border: 1px solid #cbd6ce; background: #fff; padding: .55rem .7rem; }
.button { min-height: 2.6rem; background: #17352c; padding: .65rem 1rem; color: #fff; font-size: .85rem; font-weight: 800; }
.button:disabled,.save-button:disabled { opacity: .5; }
.inventory-table { margin-top: 1.5rem; border-top: 1px solid #bdcfc2; }
.table-head,.table-row { display: grid; grid-template-columns: minmax(9rem, 1.4fr) repeat(4, minmax(4.4rem, .6fr)) minmax(11rem, 1fr); align-items: center; gap: .8rem; border-bottom: 1px solid #d9e0d8; padding: .8rem 0; }
.table-head { color: #697a70; font-size: .72rem; font-weight: 800; }
.table-row > div:first-child { display: grid; gap: .2rem; }
.table-row small { color: #697a70; }
.active-toggle { display: flex; align-items: center; gap: .35rem; margin-top: .25rem; font-size: .75rem; }
.active-toggle input { accent-color: #286449; }
.row-action { display: flex; gap: .4rem; }
.row-action input { width: 5rem; min-height: 2.25rem; }
.save-button { border: 1px solid #bdcfc2; padding: .45rem .65rem; font-size: .78rem; font-weight: 800; }
.state,.error { margin-top: 1rem; color: #697a70; }
.error { color: #9a3022; }
@media (max-width: 760px) { .form-grid { grid-template-columns: 1fr; } .table-head { display: none; } .table-row { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; } .table-row > div:first-child { grid-column: 1 / -1; } .row-action { grid-column: 1 / -1; } }
</style>
