<template>
  <main class="auth-shell text-[#17352c]">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-lg border border-emerald-950/10 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div class="mb-4 inline-flex rounded border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-emerald-900">{{ copy.eyebrow }}</div>
        <h1 class="mt-3 text-3xl font-black text-[#17352c] sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.email }}</span>
            <input v-model.trim="email" type="email" autocomplete="email" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" placeholder="you@example.com" required>
          </label>
          <button type="submit" class="w-full rounded-md bg-[#173f32] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#285442] disabled:cursor-wait disabled:opacity-70" :disabled="submitting">
            {{ submitting ? copy.sending : copy.submit }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-md border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'" role="status" aria-live="polite">{{ message }}</div>
        <p class="mt-5 text-center text-sm text-slate-600">
          <NuxtLink to="/auth/login" class="font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.back }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Password recovery', title: 'Forgot your password?', intro: 'Enter your account email. If it is registered, we will send instructions to reset your password.', email: 'Email', submit: 'Send reset instructions', sending: 'Sending…', invalidEmail: 'Enter a valid email address.', neutral: 'If this email is registered, password reset instructions will be sent shortly.', back: 'Back to log in' },
  id: { eyebrow: 'Pemulihan kata sandi', title: 'Lupa kata sandi?', intro: 'Masukkan email akun. Jika email terdaftar, instruksi untuk mengatur ulang kata sandi akan dikirimkan.', email: 'Email', submit: 'Kirim instruksi reset', sending: 'Mengirim…', invalidEmail: 'Masukkan alamat email yang valid.', neutral: 'Jika email terdaftar, instruksi reset kata sandi akan segera dikirim.', back: 'Kembali ke halaman masuk' }
} as const;
const copy = computed(() => messages[String(locale.value) === 'id' ? 'id' : 'en']);
useSeoMeta({ title: () => `${copy.value.title} | Hari Santri 2026`, description: () => copy.value.intro });

const email = ref('');
const submitting = ref(false);
const message = ref('');
const messageTone = ref<'success' | 'error'>('success');
const { forgotPassword } = useAuth();
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};

const onSubmit = async () => {
  if (!isValidEmail(email.value)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = '';
  try {
    await forgotPassword(email.value);
  } catch {
    // Keep the same neutral result so this screen never reveals account existence.
  } finally {
    submitting.value = false;
    message.value = copy.value.neutral;
    messageTone.value = 'success';
  }
};
</script>

<style scoped>
.auth-shell { min-height: calc(100vh - 140px); background: #f5f5ef; }
.auth-card { box-shadow: 0 18px 48px rgba(23, 63, 50, 0.08); }
</style>
