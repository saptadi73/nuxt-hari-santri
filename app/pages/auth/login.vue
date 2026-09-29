<template>
  <main class="login-shell text-[#17352c]">
    <div v-if="message && messageTone === 'error'" class="login-toast" role="alert" aria-live="assertive">
      <p class="font-semibold">{{ copy.failed }}</p>
      <p class="mt-1 text-sm leading-5">{{ message }}</p>
    </div>
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="login-card mx-auto max-w-md rounded-lg border border-emerald-950/10 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div class="mb-4 inline-flex rounded border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-emerald-900">{{ copy.member }}</div>
        <h1 class="mt-3 text-3xl font-black text-[#17352c] sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.email }}</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" placeholder="you@example.com" minlength="6" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="current-password" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.passwordPlaceholder" minlength="8" maxlength="128" required />
          </label>

          <div class="text-right">
            <NuxtLink to="/auth/forgot-password" class="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.forgotPassword }}</NuxtLink>
          </div>

          <button type="submit" class="w-full rounded-md bg-[#173f32] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#285442] active:scale-[0.99]">{{ copy.login }}</button>
        </form>

        <div v-if="message" class="mt-4 rounded-md border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : messageTone === 'error' ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-slate-50 text-slate-700'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-600">
          {{ copy.needAccount }}
          <NuxtLink to="/auth/register" class="font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.create }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages = {
  en: {
    member: 'Participant access', title: 'Log in to Hari Santri 2026', intro: 'Manage your registration, ticket, payment status, and event updates.', email: 'Email', password: 'Password', passwordPlaceholder: 'Enter your password', forgotPassword: 'Forgot password?', resetSuccess: 'Your password has been reset. You can now log in with your new password.', login: 'Log in', needAccount: 'Need an account?', create: 'Create one', input: 'Input', invalid: 'Invalid value', processError: 'Login could not be processed.', required: 'Enter your email address and password.', invalidEmail: 'Enter a valid email address.', passwordLength: 'Password must be at least 8 characters long.', submitting: 'Signing in...', success: 'Login successful.', failed: 'Failed'
  },
  id: {
    member: 'Akses peserta', title: 'Masuk ke Hari Santri 2026', intro: 'Kelola pendaftaran, tiket, status pembayaran, dan informasi acara.', email: 'Email', password: 'Kata sandi', passwordPlaceholder: 'Masukkan kata sandi', forgotPassword: 'Lupa kata sandi?', resetSuccess: 'Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.', login: 'Masuk', needAccount: 'Belum punya akun?', create: 'Daftar sekarang', input: 'Input', invalid: 'Nilai tidak valid', processError: 'Login tidak dapat diproses.', required: 'Masukkan email dan kata sandi.', invalidEmail: 'Masukkan alamat email yang valid.', passwordLength: 'Kata sandi minimal 8 karakter.', submitting: 'Sedang masuk...', success: 'Berhasil masuk.', failed: 'Gagal'
  }
} as const;
const copy = computed(() => messages[String(locale.value) === 'id' ? 'id' : 'en']);
useSeoMeta({ title: () => `${copy.value.login} | Hari Santri 2026`, description: () => copy.value.intro });
const form = reactive({ email: '', password: '' });
const { login } = useAuth();
const flow = useRegistrationFlow();
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');
const route = useRoute();

if (route.query.reset === 'success') {
  message.value = copy.value.resetSuccess;
  messageTone.value = 'success';
}
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};

type ValidationError = { loc?: Array<string | number>; msg?: string };
type ApiErrorPayload = {
  detail?: ValidationError[];
  errors?: Array<{ message?: string }>;
  message?: string;
};
type ApiError = { data?: ApiErrorPayload; response?: { _data?: ApiErrorPayload } };

const getLoginErrorMessage = (error: unknown) => {
  const apiError = error as ApiError;
  const payload = apiError.data ?? apiError.response?._data;
  const details = payload?.detail;

  if (Array.isArray(details) && details.length) {
    return details
      .map((detail) => `${detail.loc?.at(-1) ?? copy.value.input}: ${detail.msg ?? copy.value.invalid}`)
      .join('. ');
  }

  return payload?.errors?.find((item) => item.message)?.message
    || payload?.message
    || (error instanceof Error ? error.message : copy.value.processError);
};

const onSubmit = async () => {
  if (!form.email || !form.password) {
    message.value = copy.value.required;
    messageTone.value = 'error';
    return;
  }

  if (!isValidEmail(form.email)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    messageTone.value = 'error';
    return;
  }

  message.value = copy.value.submitting;
  messageTone.value = 'neutral';

  try {
    const result = await login(form);
    if (result.success) {
      message.value = copy.value.success;
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = `${copy.value.failed}: ${result.message}`;
    messageTone.value = 'error';
  } catch (error) {
    message.value = `${copy.value.failed}: ${getLoginErrorMessage(error)}`;
    messageTone.value = 'error';
  }
};
</script>

<style scoped>
.login-shell {
  min-height: calc(100vh - 140px);
  background: #f5f5ef;
}
.login-toast {
  position: fixed;
  top: 5.5rem;
  right: 1rem;
  z-index: 60;
  width: min(24rem, calc(100vw - 2rem));
  border: 1px solid rgba(252, 165, 165, 0.5);
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.875rem 1rem;
  color: #7f1d1d;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}
.login-card {
  box-shadow: 0 18px 48px rgba(23, 63, 50, 0.08);
}

@media (max-width: 767px) {
  .login-shell {
    padding-inline: 0.75rem;
  }

  .login-card {
    border-radius: 1.5rem;
    padding: 1.1rem 1rem;
  }

  .login-card h1 {
    font-size: clamp(2rem, 9vw, 2.9rem);
    line-height: 1.08;
  }

  .login-card input,
  .login-card button {
    font-size: 1rem;
  }
}
</style>
