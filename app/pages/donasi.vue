<template>
  <main class="donation-page">
    <section class="donation-card">
      <p class="eyebrow">HARI SANTRI 2026</p>
      <h1>Dukung semangat Hari Santri</h1>
      <p class="intro">Donasi Anda mendukung penyelenggaraan kegiatan Hari Santri 2026. Masukkan nominal donasi yang ingin diberikan.</p>

      <form class="donation-form" @submit.prevent="submitDonation">
        <label>
          Nama donatur
          <input v-model.trim="donorName" autocomplete="name" name="donor_name" required minlength="2" maxlength="180" placeholder="Nama Anda atau Hamba Allah">
        </label>
        <label>
          Email untuk informasi pembayaran
          <input v-model.trim="donorEmail" autocomplete="email" name="donor_email" type="email" required maxlength="255" placeholder="nama@email.com">
        </label>
        <label>
          Nominal donasi (Rp)
          <input v-model.number="amount" name="amount" type="number" inputmode="numeric" min="1" max="9007199254740991" step="1" required placeholder="Contoh: 50000">
        </label>
        <p v-if="amountPreview" class="amount-preview">{{ amountPreview }}</p>
        <p v-if="error" class="notice notice--error" role="alert">{{ error }}</p>
        <button class="submit-button" type="submit" :disabled="loading">
          {{ loading ? 'Menyiapkan pembayaran…' : 'Lanjutkan ke pembayaran' }}
        </button>
        <p class="fine-print">Nama dan email dikirim ke Portal Payment untuk memproses transaksi. Donasi dinyatakan diterima setelah dikonfirmasi oleh sistem.</p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
const api = useHariSantri();
const donorName = ref('');
const donorEmail = ref('');
const amount = ref<number | undefined>();
const loading = ref(false);
const error = ref('');
const requestId = ref('');

const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(value);
const amountPreview = computed(() => amount.value && amount.value > 0 ? formatRupiah(amount.value) : '');

const submitDonation = async () => {
  if (loading.value) return;
  error.value = '';
  const donationAmount = Number(amount.value);
  if (!Number.isSafeInteger(donationAmount) || donationAmount <= 0) {
    error.value = 'Nominal harus berupa bilangan rupiah bulat yang lebih besar dari nol.';
    return;
  }

  loading.value = true;
  try {
    const response = await api.createDonation({
      request_id: requestId.value || (requestId.value = crypto.randomUUID()),
      donor_name: donorName.value,
      donor_email: donorEmail.value,
      amount: donationAmount
    });
    sessionStorage.removeItem('hari-santri-order-id');
    sessionStorage.setItem('hari-santri-donation-reference', response.data.reference_id);
    window.location.assign(response.data.payment_url);
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Pembayaran donasi belum dapat disiapkan. Silakan coba kembali.';
  } finally {
    loading.value = false;
  }
};

useSeoMeta({
  title: 'Donasi | Hari Santri 2026',
  description: 'Dukung kegiatan Hari Santri 2026 melalui donasi dengan nominal pilihan Anda.'
});
</script>

<style scoped>
.donation-page { min-height: 72vh; display: grid; place-items: center; padding: 3rem 1rem; background: #f5f5ef; color: #17352c; }
.donation-card { width: min(100%, 42rem); border: 1px solid #dce5dc; background: #fff; padding: clamp(1.5rem, 5vw, 3rem); box-shadow: 0 24px 70px rgb(15 65 50 / 9%); }
.eyebrow { color: #2d7258; font-size: .72rem; font-weight: 800; letter-spacing: .15em; }
h1 { max-width: 15ch; margin-top: .75rem; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.3rem, 6vw, 4rem); line-height: 1.02; }
.intro { margin-top: 1rem; color: #596d61; line-height: 1.7; }
.donation-form { display: grid; gap: 1.1rem; margin-top: 2rem; }
label { display: grid; gap: .45rem; color: #264b3a; font-size: .88rem; font-weight: 750; }
input { min-height: 3.2rem; border: 1px solid #ccd8cd; border-radius: .4rem; background: white; padding: .75rem .9rem; color: #17352c; font: inherit; font-weight: 500; }
input:focus { outline: 2px solid #3d8060; outline-offset: 2px; }
.amount-preview { margin-top: -.65rem; color: #286449; font-weight: 800; }
.submit-button { min-height: 3.2rem; border: 0; border-radius: .4rem; background: #f17721; padding: .8rem 1rem; color: #fff; font-size: .9rem; font-weight: 800; cursor: pointer; }
.submit-button:hover { background: #d96012; }
.submit-button:disabled { cursor: wait; opacity: .6; }
.fine-print { color: #748077; font-size: .76rem; line-height: 1.6; }
.notice { border-radius: .4rem; padding: .8rem; font-size: .85rem; }
.notice--error { background: #fff0ee; color: #9a3022; }
</style>
