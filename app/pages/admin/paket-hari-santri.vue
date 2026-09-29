<template>
  <section class="packages-page">
    <div class="packages-inner">
      <p class="eyebrow">ADMIN REGISTRASI / HARI SANTRI 2026</p>
      <h1>{{ id ? 'Paket & pendaftaran' : 'Packages & registration' }}</h1>
      <p class="intro">{{ id ? 'Harga, kegiatan, batas peserta, kuota pembelian, dan status publikasi ditetapkan panitia.' : 'Organizers control prices, activity type, participant limits, purchase capacity, and publication.' }}</p>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="loading" class="state">{{ id ? 'Memuat paket…' : 'Loading packages…' }}</p>
      <div v-else class="product-list">
        <article v-for="product in products" :key="product.id" class="product-row">
          <div class="product-heading"><div><span>{{ product.metadata_json?.activity_type }}</span><h2>{{ product.name }}</h2><p>{{ product.code }} · {{ money(Number(product.price ?? product.amount ?? 0), product.currency) }}</p></div><label class="active-toggle"><input v-model="drafts[product.id]!.is_active" type="checkbox"><span>{{ id ? 'Terbit' : 'Published' }}</span></label></div>
          <div class="product-fields">
            <label><span>{{ id ? 'Nama paket' : 'Package name' }}</span><input v-model.trim="drafts[product.id]!.name"></label>
            <label><span>{{ id ? 'Harga (IDR)' : 'Price (IDR)' }}</span><input v-model.number="drafts[product.id]!.price" type="number" min="0" step="1"></label>
            <label><span>{{ id ? 'Jumlah minimum peserta' : 'Minimum participants' }}</span><input v-model.number="drafts[product.id]!.min_participants" type="number" min="1" max="99"></label>
            <label><span>{{ id ? 'Jumlah maksimum peserta' : 'Maximum participants' }}</span><input v-model.number="drafts[product.id]!.max_participants" type="number" min="1" max="99"></label>
            <label><span>{{ id ? 'Kuota paket' : 'Package capacity' }}</span><input v-model.number="drafts[product.id]!.max_quantity" type="number" min="1"></label>
            <label><span>{{ id ? 'Kuota orang untuk kegiatan' : 'Activity people capacity' }}</span><input v-model.number="drafts[product.id]!.capacity_people" type="number" min="0"></label>
            <label class="description"><span>{{ id ? 'Deskripsi paket' : 'Package description' }}</span><textarea v-model.trim="drafts[product.id]!.description" rows="2" /></label>
          </div>
          <button type="button" class="button" :disabled="savingId === product.id" @click="save(product)">{{ savingId === product.id ? (id ? 'Menyimpan…' : 'Saving…') : (id ? 'Simpan perubahan' : 'Save changes') }}</button>
        </article>
        <p v-if="!products.length" class="state">{{ id ? 'Belum ada paket untuk event ini.' : 'No packages are configured for this event yet.' }}</p>
      </div>

      <form class="new-product" @submit.prevent="create">
        <h2>{{ id ? 'Buat paket baru' : 'Create a package' }}</h2>
        <div class="product-fields">
          <label><span>{{ id ? 'Kode paket' : 'Package code' }}</span><input v-model.trim="form.code" required maxlength="60" placeholder="WALK-FAMILY"></label>
          <label><span>{{ id ? 'Nama paket' : 'Package name' }}</span><input v-model.trim="form.name" required maxlength="180"></label>
          <label><span>{{ id ? 'Kegiatan' : 'Activity' }}</span><select v-model="form.activity_type"><option value="CYCLING">CYCLING</option><option value="FAMILY_WALK">FAMILY_WALK</option></select></label>
          <label><span>{{ id ? 'Harga resmi (IDR)' : 'Official price (IDR)' }}</span><input v-model.number="form.price" type="number" min="0" step="1" required></label>
          <label><span>{{ id ? 'Minimum peserta' : 'Minimum participants' }}</span><input v-model.number="form.min_participants" type="number" min="1" max="99" required></label>
          <label><span>{{ id ? 'Maksimum peserta' : 'Maximum participants' }}</span><input v-model.number="form.max_participants" type="number" min="1" max="99" required></label>
          <label><span>{{ id ? 'Kuota paket' : 'Package capacity' }}</span><input v-model.number="form.max_quantity" type="number" min="1" required></label>
          <label><span>{{ id ? 'Kuota orang untuk kegiatan' : 'Activity people capacity' }}</span><input v-model.number="form.capacity_people" type="number" min="0" required></label>
          <label class="description"><span>{{ id ? 'Deskripsi & manfaat' : 'Description & inclusions' }}</span><textarea v-model.trim="form.description" rows="2" /></label>
        </div>
        <label class="active-toggle"><input v-model="form.is_active" type="checkbox"><span>{{ id ? 'Terbitkan paket' : 'Publish package' }}</span></label>
        <p class="field-note">{{ id ? 'Paket dapat diterbitkan setelah harga, kuota, manfaat, dan aturan peserta disahkan panitia.' : 'Publish only after organizers approve price, capacity, inclusions, and participant rules.' }}</p>
        <button type="submit" class="button" :disabled="savingId === 'new'">{{ savingId === 'new' ? (id ? 'Menyimpan…' : 'Saving…') : (id ? 'Buat paket' : 'Create package') }}</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HariSantriProductWrite, StoreProduct } from '~/composables/useStore';

definePageMeta({ middleware: ['auth', 'admin'] });
const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const auth = useAuthStore();
const runtime = useRuntimeConfig();
const eventApi = useEvent();
const storeApi = useStore();
const eventId = ref('');
const products = ref<StoreProduct[]>([]);
const drafts = reactive<Record<string, { name: string; description: string; price: number; max_quantity: number; min_participants: number; max_participants: number; capacity_people: number; is_active: boolean }>>({});
const loading = ref(true);
const savingId = ref('');
const error = ref('');
const form = reactive({ code: '', name: '', description: '', activity_type: 'FAMILY_WALK' as 'CYCLING' | 'FAMILY_WALK', price: 0, min_participants: 1, max_participants: 1, max_quantity: 1, capacity_people: 0, is_active: false });
const money = (amount: number, currency: string) => new Intl.NumberFormat(id.value ? 'id-ID' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (!auth.isAdminOrOrganizer) throw new Error(id.value ? 'Halaman ini khusus admin registrasi.' : 'This page is restricted to registration administrators.');
    const events = await eventApi.getEvents(1, 100);
    const event = events.data.find(item => item.slug === runtime.public.eventSlug);
    if (!event) throw new Error(id.value ? 'Event Hari Santri belum dibuat.' : 'The Hari Santri event has not been created.');
    eventId.value = event.id;
    products.value = (await storeApi.getAdminProducts(event.id)).data.filter(item => item.product_type === 'hari_santri_package');
    for (const product of products.value) {
      const metadata = product.metadata_json || {};
      drafts[product.id] = {
        name: product.name,
        description: product.description || '',
        price: Number(product.price ?? 0),
        max_quantity: product.max_quantity || 1,
        min_participants: Number(metadata.min_participants || 1),
        max_participants: Number(metadata.max_participants || 20),
        capacity_people: Number(metadata.capacity_people || 0),
        is_active: product.is_active
      };
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load packages.';
  } finally { loading.value = false; }
};

const payloadFor = (code: string, activityType: 'CYCLING' | 'FAMILY_WALK', draft: typeof form | (typeof drafts)[string]): HariSantriProductWrite => ({
  code,
  name: draft.name,
  description: draft.description,
  product_type: 'hari_santri_package',
  price: Number(draft.price),
  currency: 'IDR',
  max_quantity: Number('max_quantity' in draft ? draft.max_quantity : 1),
  metadata_json: {
    activity_type: activityType,
    min_participants: Number('min_participants' in draft ? draft.min_participants : form.min_participants),
    max_participants: Number('max_participants' in draft ? draft.max_participants : form.max_participants),
    capacity_people: Number('capacity_people' in draft ? draft.capacity_people : form.capacity_people)
  },
  is_active: draft.is_active
});
const save = async (product: StoreProduct) => {
  savingId.value = product.id;
  error.value = '';
  try {
    const activityType = product.metadata_json?.activity_type === 'CYCLING' ? 'CYCLING' : 'FAMILY_WALK';
    await storeApi.updateProduct(product.id, payloadFor(product.code || '', activityType, drafts[product.id]!));
    await load();
  }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to save package.'; }
  finally { savingId.value = ''; }
};
const create = async () => {
  if (form.min_participants > form.max_participants) {
    error.value = id.value ? 'Maksimum peserta harus sama dengan atau lebih besar dari minimum.' : 'Maximum participants must be at least the minimum.';
    return;
  }
  savingId.value = 'new';
  error.value = '';
  try { await storeApi.createProduct(eventId.value, payloadFor(form.code, form.activity_type, form)); form.code = ''; form.name = ''; form.description = ''; await load(); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to create package.'; }
  finally { savingId.value = ''; }
};

onMounted(() => { void load(); });
useSeoMeta({ title: () => `${id.value ? 'Paket Hari Santri' : 'Hari Santri Packages'} | 2026` });
</script>

<style scoped>
.packages-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 1080px) / 2)); }
.packages-inner { max-width: 1080px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2 { font-family: Georgia, 'Times New Roman', serif; }
h1 { margin-top: .7rem; font-size: clamp(2.3rem, 5vw, 4rem); line-height: 1.05; }
.intro { max-width: 44rem; margin-top: .8rem; color: #596d61; line-height: 1.7; }
.product-list { margin-top: 2rem; border-top: 1px solid #bdcfc2; }
.product-row,.new-product { border-bottom: 1px solid #d9e0d8; padding: 1.5rem 0; }
.product-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.product-heading span { color: #8a6b20; font-size: .68rem; font-weight: 800; }
.product-heading h2,.new-product h2 { margin-top: .4rem; font-size: 1.65rem; }
.product-heading p { margin-top: .35rem; color: #697a70; font-size: .85rem; }
.product-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; margin: 1rem 0; }
.product-fields label span { display: block; margin-bottom: .3rem; font-size: .78rem; font-weight: 700; }
.product-fields input,.product-fields select,.product-fields textarea { width: 100%; min-height: 2.5rem; border: 1px solid #cbd6ce; background: #fff; padding: .55rem .65rem; color: #17352c; }
.description { grid-column: 1 / -1; }
.active-toggle { display: inline-flex; align-items: center; gap: .45rem; font-size: .8rem; font-weight: 700; }
.active-toggle input { accent-color: #286449; }
.button { display: inline-flex; min-height: 2.65rem; align-items: center; justify-content: center; margin-top: .8rem; background: #17352c; padding: .65rem .9rem; color: #fff; font-size: .83rem; font-weight: 800; }
.button:disabled { opacity: .5; }
.field-note,.state { margin-top: .7rem; color: #697a70; font-size: .8rem; line-height: 1.6; }
.error { margin-top: 1rem; color: #9a3022; }
@media (max-width: 720px) { .product-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) { .product-fields { grid-template-columns: 1fr; } .product-heading { flex-direction: column; } }
</style>
