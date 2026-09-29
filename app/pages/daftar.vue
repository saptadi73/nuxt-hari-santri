<template>
  <section class="registration-page">
    <div class="registration-inner">
      <p class="eyebrow">{{ text.eyebrow }}</p>
      <h1>{{ text.title }}</h1>
      <p class="intro">{{ text.intro }}</p>

      <div v-if="!auth.isAuthenticated" class="account-note">
        <p>{{ text.accountRequired }}</p>
        <NuxtLink :to="`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`" class="button button--dark">{{ text.signIn }}</NuxtLink>
        <NuxtLink :to="`/auth/register?redirect=${encodeURIComponent(route.fullPath)}`" class="text-link">{{ text.createAccount }}</NuxtLink>
      </div>

      <template v-else>
        <div v-if="loading" class="state-note">{{ text.loading }}</div>
        <div v-else-if="loadError" class="error-note" role="alert">{{ loadError }}</div>
        <form v-else class="registration-form" @submit.prevent="submitRegistration">
          <section class="form-section">
            <div class="form-section__heading"><span>01</span><h2>{{ text.chooseActivity }}</h2></div>
            <div class="activity-picker" role="group" :aria-label="text.chooseActivity">
              <button v-for="item in activityOptions" :key="item.code" type="button" :aria-pressed="activity === item.code" :class="{'is-selected': activity === item.code}" @click="activity = item.code">
                <span>{{ item.title }}</span><small>{{ item.summary }}</small>
              </button>
            </div>
            <label class="field-label" for="package-select">{{ text.package }}</label>
            <select id="package-select" v-model="selectedProductId" required :disabled="!activityProducts.length">
              <option value="" disabled>{{ activityProducts.length ? text.choosePackage : text.packagesNotPublished }}</option>
              <option v-for="product in activityProducts" :key="product.id" :value="product.id">{{ product.name }} · {{ money(Number(product.price ?? product.amount ?? 0), product.currency) }}</option>
            </select>
            <p class="field-note">{{ text.packageNote }}</p>
          </section>

          <section class="form-section">
            <div class="form-section__heading"><span>02</span><h2>{{ text.participants }}</h2></div>
            <div v-for="(person, index) in participants" :key="person.key" class="participant-row">
              <div class="participant-row__top"><h3>{{ text.person }} {{ index + 1 }}</h3><button v-if="participants.length > 1" type="button" class="remove-button" :aria-label="`${text.remove} ${text.person} ${index + 1}`" @click="removeParticipant(index)">×</button></div>
              <div class="fields-grid">
                <label><span>{{ text.fullName }}</span><input v-model.trim="person.full_name" required minlength="2" maxlength="255" autocomplete="name"></label>
                <label><span>{{ text.birthDate }}</span><input v-model="person.birth_date" type="date" :max="today"></label>
                <label><span>{{ text.shirtSize }}</span><select v-model="person.shirt_size_code" required><option value="" disabled>{{ text.selectSize }}</option><option v-for="size in availableSizes" :key="size.id" :value="size.code">{{ size.label }} · {{ size.available }} {{ text.left }}</option></select></label>
                <template v-if="isMinor(person.birth_date)">
                  <label><span>{{ text.guardianName }}</span><input v-model.trim="person.guardian_name" required maxlength="255"></label>
                  <label><span>{{ text.guardianContact }}</span><input v-model.trim="person.guardian_contact" required maxlength="40" type="tel"></label>
                </template>
              </div>
            </div>
            <button type="button" class="add-button" :disabled="participants.length >= packageParticipantLimit.max" @click="addParticipant">＋ {{ text.addParticipant }}</button>
            <p class="field-note">{{ text.familyNote }}</p>
          </section>

          <section class="form-section order-summary">
            <div class="form-section__heading"><span>03</span><h2>{{ text.review }}</h2></div>
            <div class="summary-row"><span>{{ text.selectedPackage }}</span><strong>{{ selectedProduct?.name || text.notSelected }}</strong></div>
            <div class="summary-row"><span>{{ text.participants }}</span><strong>{{ participants.length }}</strong></div>
            <div class="summary-row summary-row--total"><span>{{ text.total }}</span><strong>{{ selectedProduct ? money(Number(selectedProduct.price ?? selectedProduct.amount ?? 0), selectedProduct.currency) : '—' }}</strong></div>
            <p class="field-note">{{ text.paymentNote }}</p>
            <label class="terms-check"><input v-model="termsAccepted" type="checkbox" required><span>{{ text.acceptTerms }}</span></label>
          </section>

          <p v-if="submitError" class="error-note" role="alert">{{ submitError }}</p>
          <button class="button button--dark submit-button" type="submit" :disabled="submitting || !selectedProduct || !availableSizes.length">
            {{ submitting ? text.submitting : text.payButton }}
          </button>
        </form>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StoreProduct } from '~/composables/useStore';
import type { ActivityType, OrderParticipantInput, ShirtSizeOption } from '~/composables/useHariSantri';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const route = useRoute();
const runtime = useRuntimeConfig();
const auth = useAuthStore();
const eventApi = useEvent();
const storeApi = useStore();
const hariSantriApi = useHariSantri();
const loading = ref(true);
const submitting = ref(false);
const loadError = ref('');
const submitError = ref('');
const eventId = ref('');
const products = ref<StoreProduct[]>([]);
const shirtSizes = ref<ShirtSizeOption[]>([]);
const selectedProductId = ref(typeof route.query.product_id === 'string' ? route.query.product_id : '');
const activity = ref<ActivityType>(route.query.activity === 'CYCLING' ? 'CYCLING' : 'FAMILY_WALK');
const termsAccepted = ref(false);
let participantKey = 0;
const newParticipant = () => ({ key: ++participantKey, full_name: '', birth_date: '', guardian_name: '', guardian_contact: '', shirt_size_code: '' });
const participants = ref([newParticipant()]);
const isIndonesian = computed(() => locale.value === 'id');
const today = new Date().toISOString().slice(0, 10);
const availableSizes = computed(() => shirtSizes.value.filter(size => size.active && size.available > 0));
const activityProducts = computed(() => products.value.filter(product => product.product_type === 'hari_santri_package' && product.metadata_json?.activity_type === activity.value));
const selectedProduct = computed(() => activityProducts.value.find(product => product.id === selectedProductId.value));
const packageParticipantLimit = computed(() => {
  const metadata = selectedProduct.value?.metadata_json || {};
  return { min: Number(metadata.min_participants || 1), max: Number(metadata.max_participants || 20) };
});
const activityOptions = computed(() => isIndonesian.value ? [
  { code: 'CYCLING' as const, title: 'Sepeda Sehat', summary: 'Kayuh bersama mengikuti rute resmi panitia.' },
  { code: 'FAMILY_WALK' as const, title: 'Jalan Sehat Keluarga', summary: 'Berjalan bersama keluarga sesuai ketentuan paket.' }
] : [
  { code: 'CYCLING' as const, title: 'Healthy Cycling', summary: 'Ride together on the official route.' },
  { code: 'FAMILY_WALK' as const, title: 'Family Walk', summary: 'Walk together according to package rules.' }
]);
const copy = {
  id: { eyebrow: 'PENDAFTARAN PESERTA', title: 'Ajak keluarga, pilih kegiatan.', intro: 'Pilih paket yang tersedia, isi data setiap peserta, lalu periksa ukuran kaos sebelum melanjutkan pembayaran.', accountRequired: 'Masuk ke akun pemesan untuk mengelola pesanan dan tiket keluarga.', signIn: 'Masuk', createAccount: 'Buat akun', loading: 'Memuat paket dan ukuran kaos…', chooseActivity: 'Pilih kegiatan', package: 'Paket', choosePackage: 'Pilih paket', packagesNotPublished: 'Paket resmi belum diterbitkan', packageNote: 'Harga, manfaat, dan kuota yang berlaku ditetapkan panitia dan berasal dari server.', participants: 'Data peserta', person: 'Peserta', remove: 'Hapus', fullName: 'Nama lengkap', birthDate: 'Tanggal lahir (opsional)', shirtSize: 'Ukuran kaos', selectSize: 'Pilih ukuran', left: 'tersedia', guardianName: 'Nama orang tua/wali', guardianContact: 'Kontak orang tua/wali', addParticipant: 'Tambah peserta', familyNote: 'Setiap peserta memiliki pilihan ukuran kaos sendiri. Peserta di bawah 18 tahun perlu data wali.', review: 'Periksa pesanan', selectedPackage: 'Paket', notSelected: 'Belum dipilih', total: 'Total pesanan', paymentNote: 'Pembayaran diproses oleh Portal Payment terpisah. Tiket terbit setelah status lunas diverifikasi oleh sistem.', acceptTerms: 'Saya menyetujui syarat pendaftaran dan kebijakan privasi.', submitting: 'Menyiapkan pesanan…', payButton: 'Lanjutkan ke Pembayaran', sizeUnavailable: 'Ukuran kaos belum tersedia. Silakan hubungi panitia.', noEvent: 'Pendaftaran belum dibuka. Event belum diterbitkan panitia.', paymentUrlInvalid: 'Tautan pembayaran tidak valid. Hubungi panitia.' },
  en: { eyebrow: 'PARTICIPANT REGISTRATION', title: 'Bring your family. Choose your activity.', intro: 'Choose an available package, enter each participant, then review shirt sizes before continuing to payment.', accountRequired: 'Sign in to the order owner account to manage family orders and tickets.', signIn: 'Sign in', createAccount: 'Create account', loading: 'Loading packages and shirt sizes…', chooseActivity: 'Choose an activity', package: 'Package', choosePackage: 'Choose a package', packagesNotPublished: 'Official packages are not published yet', packageNote: 'Prices, inclusions, and capacity are set by organizers and loaded from the server.', participants: 'Participant details', person: 'Participant', remove: 'Remove', fullName: 'Full name', birthDate: 'Date of birth (optional)', shirtSize: 'Shirt size', selectSize: 'Select size', left: 'available', guardianName: 'Parent/guardian name', guardianContact: 'Parent/guardian contact', addParticipant: 'Add participant', familyNote: 'Each participant has an individual shirt size. Participants under 18 need guardian details.', review: 'Review your order', selectedPackage: 'Package', notSelected: 'Not selected', total: 'Order total', paymentNote: 'Payment is handled by a separate Payment Portal. Tickets are issued after the system verifies payment.', acceptTerms: 'I agree to the registration terms and privacy policy.', submitting: 'Preparing order…', payButton: 'Continue to Payment', sizeUnavailable: 'Shirt sizes are not available yet. Contact the organizers.', noEvent: 'Registration is not open. The organizers have not published the event.', paymentUrlInvalid: 'The payment link is invalid. Contact the organizers.' }
} as const;
const text = computed(() => isIndonesian.value ? copy.id : copy.en);
const money = (value: number, currency: string) => new Intl.NumberFormat(isIndonesian.value ? 'id-ID' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
const isMinor = (birthDate: string) => {
  if (!birthDate) return false;
  const date = new Date(`${birthDate}T00:00:00`);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return date > cutoff;
};
const addParticipant = () => { if (participants.value.length < 20) participants.value.push(newParticipant()); };
const removeParticipant = (index: number) => { if (participants.value.length > 1) participants.value.splice(index, 1); };
watch(activity, () => { selectedProductId.value = activityProducts.value[0]?.id || ''; });
watch([() => participants.value.length, packageParticipantLimit], ([count, limit]) => {
  if (count > limit.max) participants.value.splice(limit.max);
});

onMounted(async () => {
  try {
    const events = await eventApi.getEvents(1, 100);
    const event = events.data.find(item => item.slug === runtime.public.eventSlug);
    if (!event) { loadError.value = text.value.noEvent; return; }
    eventId.value = event.id;
    const [productsResponse, sizesResponse] = await Promise.all([
      storeApi.getProducts(event.id),
      hariSantriApi.getShirtSizes(event.id)
    ]);
    products.value = productsResponse.data;
    shirtSizes.value = sizesResponse.data;
    if (!selectedProductId.value || !activityProducts.value.some(item => item.id === selectedProductId.value)) {
      selectedProductId.value = activityProducts.value[0]?.id || '';
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : text.value.noEvent;
  } finally {
    loading.value = false;
  }
});

const submitRegistration = async () => {
  submitError.value = '';
  if (!termsAccepted.value || !selectedProduct.value || !availableSizes.value.length) {
    submitError.value = availableSizes.value.length ? text.value.packageNote : text.value.sizeUnavailable;
    return;
  }
  if (participants.value.some(person => !person.shirt_size_code || !availableSizes.value.some(size => size.code === person.shirt_size_code))) {
    submitError.value = text.value.sizeUnavailable;
    return;
  }
  submitting.value = true;
  try {
    const cart = await storeApi.getCart(eventId.value);
    for (const item of cart.data.items) {
      if (item.product_id !== selectedProductId.value) await storeApi.removeCartItem(eventId.value, item.product_id);
    }
    const selectedInCart = cart.data.items.some(item => item.product_id === selectedProductId.value);
    if (!selectedInCart) await storeApi.addCartItem(eventId.value, selectedProductId.value, 1);
    const orderResponse = await storeApi.checkout(eventId.value, termsAccepted.value);
    const orderId = orderResponse.data.order_id || orderResponse.data.id;
    if (!orderId) throw new Error('Order ID is missing from the checkout response.');
    const roster: OrderParticipantInput[] = participants.value.map(person => ({
      full_name: person.full_name,
      birth_date: person.birth_date || null,
      guardian_name: person.guardian_name || null,
      guardian_contact: person.guardian_contact || null,
      activity_type: activity.value,
      shirt_size_code: person.shirt_size_code
    }));
    await hariSantriApi.saveParticipants(orderId, roster);
    const checkout = (await hariSantriApi.createCheckout(orderId)).data;
    if (checkout.already_paid) {
      await navigateTo(`/dashboard/tiket?order_id=${encodeURIComponent(orderId)}`);
      return;
    }
    if (!checkout.payment_url) throw new Error(text.value.paymentUrlInvalid);
    const paymentUrl = new URL(checkout.payment_url);
    if (paymentUrl.protocol !== 'https:' && !(import.meta.dev && paymentUrl.hostname === 'localhost')) throw new Error(text.value.paymentUrlInvalid);
    sessionStorage.setItem('hari-santri-order-id', orderId);
    window.location.assign(paymentUrl.toString());
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : text.value.paymentUrlInvalid;
    submitting.value = false;
  }
};

useSeoMeta({ title: () => `${text.value.eyebrow} | Hari Santri 2026`, description: () => text.value.intro });
</script>

<style scoped>
.registration-page { min-height: 70vh; background: #f5f5ef; color: #17352c; padding: 3.5rem max(1rem, calc((100vw - 980px) / 2)); }
.registration-inner { max-width: 980px; margin-inline: auto; }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
h1,h2,h3 { font-family: Georgia, 'Times New Roman', serif; }
h1 { max-width: 15ch; margin-top: .75rem; font-size: clamp(2.4rem, 5vw, 4.4rem); line-height: 1; }
.intro { max-width: 45rem; margin-top: 1rem; color: #596d61; line-height: 1.75; }
.registration-form { margin-top: 2rem; }
.form-section { border-top: 1px solid #d9e0d8; padding: 1.6rem 0 2rem; }
.form-section__heading { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.2rem; }
.form-section__heading > span { color: #2d7258; font-size: .75rem; font-weight: 800; }
.form-section__heading h2 { font-size: 1.8rem; }
.activity-picker { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
.activity-picker button { min-height: 6rem; border: 1px solid #d9e0d8; background: #fff; padding: 1rem; text-align: left; }
.activity-picker button.is-selected { border-color: #2d7258; box-shadow: inset 0 0 0 1px #2d7258; }
.activity-picker span,.activity-picker small { display: block; }
.activity-picker span { font-weight: 800; }
.activity-picker small { margin-top: .45rem; color: #65756b; line-height: 1.5; }
.field-label,.fields-grid label span { display: block; margin: 1rem 0 .4rem; font-size: .82rem; font-weight: 700; }
select,input:not([type=checkbox]) { width: 100%; min-height: 2.8rem; border: 1px solid #cbd6ce; background: #fff; padding: .65rem .75rem; color: #17352c; }
.field-note { margin-top: .6rem; color: #697a70; font-size: .8rem; line-height: 1.6; }
.participant-row { margin-top: 1rem; border: 1px solid #d9e0d8; background: #fff; padding: 1rem; }
.participant-row__top { display: flex; align-items: center; justify-content: space-between; }
.participant-row__top h3 { font-size: 1.25rem; }
.remove-button { display: grid; width: 2.2rem; height: 2.2rem; place-items: center; border: 1px solid #d9e0d8; font-size: 1.2rem; }
.fields-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 1rem; }
.add-button { margin-top: 1rem; color: #286449; font-size: .88rem; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
.add-button:disabled { opacity: .45; }
.order-summary { background: #fff; padding-inline: 1rem; }
.summary-row { display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid #e4e9e4; padding: .8rem 0; font-size: .9rem; }
.summary-row--total { font-size: 1.05rem; }
.terms-check { display: flex; align-items: flex-start; gap: .65rem; margin-top: 1.2rem; font-size: .84rem; line-height: 1.5; }
.terms-check input { margin-top: .2rem; accent-color: #286449; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.1rem; font-size: .88rem; font-weight: 800; }
.button--dark { background: #17352c; color: white; }
.submit-button { width: 100%; }
.submit-button:disabled { opacity: .55; }
.account-note,.state-note,.error-note { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1.2rem 0; }
.error-note { color: #9a3022; }
.text-link { color: #286449; font-weight: 800; text-decoration: underline; text-underline-offset: .2rem; }
@media (max-width: 620px) { .activity-picker,.fields-grid { grid-template-columns: 1fr; } .summary-row { align-items: flex-start; } }
</style>
