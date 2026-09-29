<template>
  <section class="tenant-page">
    <div class="tenant-inner">
      <p class="eyebrow">HARI SANTRI 2026 / BAZAR</p>
      <h1>{{ id ? 'Bawa usahamu ke tengah perayaan.' : 'Bring your business to the celebration.' }}</h1>
      <p class="intro">{{ id ? 'Ajukan usaha kuliner halal, buku Islam, produk pesantren, atau produk keluarga untuk mengikuti seleksi tenant bazar.' : 'Apply to bring halal food, Islamic books, pesantren products, or family goods to the bazaar.' }}</p>

      <div v-if="!auth.isAuthenticated" class="notice">
        <p>{{ id ? 'Masuk ke akun untuk mengirim dan memantau pengajuan tenant.' : 'Sign in to submit and track a tenant application.' }}</p>
        <NuxtLink :to="`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`" class="button button--dark">{{ id ? 'Masuk' : 'Sign in' }}</NuxtLink>
      </div>

      <template v-else>
        <p v-if="loading" class="state">{{ id ? 'Memeriksa pengajuan…' : 'Checking applications…' }}</p>
        <div v-for="application in applications" :key="application.id" class="application-status">
          <div><span>{{ id ? 'STATUS PENGAJUAN' : 'APPLICATION STATUS' }}</span><strong>{{ statusLabel(application.status) }}</strong></div>
          <p>{{ application.business_name }} · {{ application.category }}</p>
          <p v-if="application.organizer_notes">{{ application.organizer_notes }}</p>
        </div>

        <form v-if="!applications.length" class="tenant-form" @submit.prevent="submit">
          <div class="form-grid">
            <label><span>{{ id ? 'Nama usaha' : 'Business name' }}</span><input v-model.trim="form.business_name" required minlength="2" maxlength="180"></label>
            <label><span>{{ id ? 'Nama penanggung jawab' : 'Representative name' }}</span><input v-model.trim="form.representative_name" required minlength="2" maxlength="180"></label>
            <label><span>Email</span><input v-model.trim="form.contact_email" type="email" required maxlength="255"></label>
            <label><span>{{ id ? 'Nomor WhatsApp' : 'WhatsApp number' }}</span><input v-model.trim="form.contact_phone" type="tel" required minlength="5" maxlength="40"></label>
            <label><span>{{ id ? 'Kategori produk' : 'Product category' }}</span><select v-model="form.category" required><option value="food">{{ id ? 'Kuliner halal' : 'Halal food' }}</option><option value="islamic_books">{{ id ? 'Buku Islam' : 'Islamic books' }}</option><option value="halal_products">{{ id ? 'Produk halal/pesantren' : 'Halal/pesantren products' }}</option><option value="other">{{ id ? 'Lainnya' : 'Other' }}</option></select></label>
            <label class="full-width"><span>{{ id ? 'Ringkasan produk' : 'Product summary' }}</span><textarea v-model.trim="form.product_summary" required minlength="10" maxlength="3000" rows="4" /></label>
          </div>
          <fieldset>
            <legend>{{ id ? 'Kebutuhan stan (opsional)' : 'Stall needs (optional)' }}</legend>
            <label v-for="need in stallNeedOptions" :key="need.value" class="check-option"><input v-model="form.stall_needs" type="checkbox" :value="need.value"><span>{{ need.label }}</span></label>
          </fieldset>
          <p class="field-note">{{ id ? 'Pengajuan tidak otomatis menjamin stan. Panitia akan mengirim keputusan, fasilitas, serta biaya jika berlaku melalui dashboard/kontak resmi.' : 'An application does not guarantee a stall. Organizers will share the decision, facilities, and any applicable fee through the dashboard or official contact.' }}</p>
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button type="submit" class="button button--dark" :disabled="submitting">{{ submitting ? (id ? 'Mengirim…' : 'Submitting…') : (id ? 'Kirim pengajuan' : 'Submit application') }}</button>
        </form>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BazaarApplicationInput, BazaarApplicationRecord } from '~/composables/useHariSantri';

const { locale } = useI18n();
const id = computed(() => locale.value === 'id');
const auth = useAuthStore();
const route = useRoute();
const api = useHariSantri();
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const applications = ref<BazaarApplicationRecord[]>([]);
const form = reactive<BazaarApplicationInput>({
  business_name: '', representative_name: '', contact_email: auth.user?.email || '', contact_phone: '',
  category: 'food', product_summary: '', stall_needs: []
});
const stallNeedOptions = computed(() => id.value ? [
  { value: 'electricity', label: 'Listrik' }, { value: 'water', label: 'Akses air' }, { value: 'table', label: 'Meja tambahan' }
] : [
  { value: 'electricity', label: 'Electricity' }, { value: 'water', label: 'Water access' }, { value: 'table', label: 'Additional table' }
]);
const statusLabel = (value: string) => {
  const labels: Record<string, { id: string; en: string }> = {
    submitted: { id: 'Diajukan', en: 'Submitted' }, under_review: { id: 'Sedang ditinjau', en: 'Under review' },
    approved: { id: 'Disetujui', en: 'Approved' }, rejected: { id: 'Belum terpilih', en: 'Not selected' }, needs_revision: { id: 'Perlu revisi', en: 'Revision needed' }
  };
  return labels[value]?.[id.value ? 'id' : 'en'] || value;
};

const loadApplications = async () => {
  if (!auth.isAuthenticated) return;
  loading.value = true;
  try { applications.value = (await api.getMyBazaarApplications()).data; }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to load tenant applications.'; }
  finally { loading.value = false; }
};

const submit = async () => {
  submitting.value = true;
  error.value = '';
  try {
    applications.value = [(await api.submitBazaarApplication(form)).data];
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : (id.value ? 'Pengajuan belum dapat dikirim.' : 'The application could not be submitted.');
  } finally { submitting.value = false; }
};

onMounted(() => { void loadApplications(); });
useSeoMeta({ title: () => `${id.value ? 'Daftar Tenant Bazar' : 'Bazaar Tenant Application'} | Hari Santri 2026`, description: () => id.value ? 'Ajukan usaha untuk bazar Hari Santri 2026.' : 'Apply to join the Hari Santri 2026 bazaar.' });
</script>

<style scoped>
.tenant-page { min-height: 72vh; background: #f5f5ef; color: #17352c; padding: 3rem max(1rem, calc((100vw - 900px) / 2)); }
.tenant-inner { max-width: 900px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1 { max-width: 16ch; margin-top: .7rem; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.04; }
.intro { max-width: 48rem; margin-top: 1rem; color: #596d61; line-height: 1.75; }
.tenant-form { margin-top: 2rem; border-top: 1px solid #d9e0d8; padding-top: 1.4rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-grid label span { display: block; margin-bottom: .35rem; font-size: .82rem; font-weight: 700; }
input:not([type=checkbox]),select,textarea { width: 100%; min-height: 2.7rem; border: 1px solid #cbd6ce; background: #fff; padding: .65rem .7rem; color: #17352c; }
.full-width { grid-column: 1 / -1; }
fieldset { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.3rem; border: 0; border-top: 1px solid #d9e0d8; padding: 1rem 0 0; }
legend { padding-right: .6rem; font-size: .84rem; font-weight: 800; }
.check-option { display: inline-flex; align-items: center; gap: .4rem; font-size: .84rem; }
.check-option input { accent-color: #286449; }
.field-note,.state { margin: 1rem 0; color: #697a70; font-size: .82rem; line-height: 1.65; }
.button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 0; background: #17352c; padding: .7rem 1rem; color: #fff; font-size: .85rem; font-weight: 800; }
.button:disabled { opacity: .5; }
.notice { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1rem 0; }
.application-status { display: grid; gap: .4rem; margin-top: 1.5rem; border-block: 1px solid #d9e0d8; padding: 1rem 0; }
.application-status div { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .8rem; }
.application-status span { color: #2d7258; font-size: .72rem; font-weight: 800; }
.application-status p { color: #697a70; font-size: .86rem; }
.error { margin-top: 1rem; color: #9a3022; }
@media (max-width: 620px) { .form-grid { grid-template-columns: 1fr; } }
</style>
