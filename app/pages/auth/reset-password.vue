<template>
  <main class="auth-shell text-[#17352c]">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-lg border border-emerald-950/10 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div class="mb-4 inline-flex rounded border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-emerald-900">{{ copy.eyebrow }}</div>
        <h1 class="mt-3 text-3xl font-black text-[#17352c] sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ copy.intro }}</p>

        <div v-if="!tokenResolved" class="mt-6 h-28 animate-pulse rounded-md bg-slate-100" aria-label="Checking password reset link" role="status" />

        <div v-else-if="!token" class="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900" role="alert">
          <p>{{ copy.missingToken }}</p>
          <NuxtLink to="/auth/forgot-password" class="mt-3 inline-flex font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.requestNew }}</NuxtLink>
        </div>

        <form v-else class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.passwordPlaceholder" required>
          </label>
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.confirmPassword }}</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.confirmPlaceholder" required>
          </label>
          <button type="submit" class="w-full rounded-md bg-[#173f32] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#285442] disabled:cursor-wait disabled:opacity-70" :disabled="submitting">
            {{ submitting ? copy.resetting : copy.submit }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900" role="alert" aria-live="assertive">
          <p>{{ message }}</p>
          <NuxtLink v-if="tokenRejected" to="/auth/forgot-password" class="mt-2 inline-flex font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.requestNew }}</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Password reset', title: 'Create a new password', intro: 'Choose a strong new password for your Hari Santri account.', password: 'New password', passwordPlaceholder: 'Minimum 8 characters', confirmPassword: 'Confirm new password', confirmPlaceholder: 'Re-enter your new password', submit: 'Reset password', resetting: 'Resetting…', required: 'Enter and confirm your new password.', passwordLength: 'Password must be at least 8 characters long.', mismatch: 'Passwords do not match.', missingToken: 'This password reset link is incomplete or invalid.', rejected: 'This reset link is invalid, expired, or has already been used.', failed: 'The password could not be reset. Please try again.', requestNew: 'Request a new reset link' },
  id: { eyebrow: 'Atur ulang kata sandi', title: 'Buat kata sandi baru', intro: 'Pilih kata sandi baru yang kuat untuk akun Hari Santri Anda.', password: 'Kata sandi baru', passwordPlaceholder: 'Minimal 8 karakter', confirmPassword: 'Ulangi kata sandi baru', confirmPlaceholder: 'Masukkan kembali kata sandi baru', submit: 'Atur ulang kata sandi', resetting: 'Memproses…', required: 'Masukkan dan konfirmasi kata sandi baru.', passwordLength: 'Kata sandi minimal 8 karakter.', mismatch: 'Kata sandi tidak sama.', missingToken: 'Tautan reset kata sandi tidak lengkap atau tidak valid.', rejected: 'Tautan reset tidak valid, kedaluwarsa, atau sudah digunakan.', failed: 'Kata sandi belum dapat diubah. Silakan coba lagi.', requestNew: 'Minta tautan reset baru' }
} as const;
const copy = computed(() => messages[String(locale.value) === 'id' ? 'id' : 'en']);
useSeoMeta({ title: () => `${copy.value.title} | Hari Santri 2026`, description: () => copy.value.intro });

const route = useRoute();
const token = ref('');
const tokenResolved = ref(false);

onMounted(() => {
  token.value = new URLSearchParams(window.location.search).get('token')?.trim() || '';
  tokenResolved.value = true;
});
const form = reactive({ password: '', confirmPassword: '' });
const submitting = ref(false);
const message = ref('');
const tokenRejected = ref(false);
const { resetPassword } = useAuth();

const onSubmit = async () => {
  tokenRejected.value = false;
  if (!form.password || !form.confirmPassword) {
    message.value = copy.value.required;
    return;
  }
  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    return;
  }
  if (form.password !== form.confirmPassword) {
    message.value = copy.value.mismatch;
    return;
  }

  submitting.value = true;
  message.value = '';
  try {
    const result = await resetPassword({ token: token.value, password: form.password, confirm_password: form.confirmPassword });
    if (!result.success) throw new Error(result.message || copy.value.failed);
    token.value = '';
    if (import.meta.client) window.history.replaceState(window.history.state, '', route.path);
    await navigateTo({ path: '/auth/login', query: { reset: 'success' } }, { replace: true });
  } catch {
    tokenRejected.value = true;
    message.value = copy.value.rejected;
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auth-shell { min-height: calc(100vh - 140px); background: #f5f5ef; }
.auth-card { box-shadow: 0 18px 48px rgba(23, 63, 50, 0.08); }
</style>
