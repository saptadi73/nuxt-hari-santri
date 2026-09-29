<template>
  <main class="auth-shell text-[#17352c]">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-lg border border-emerald-950/10 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div class="mb-4 inline-flex rounded border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-emerald-900">{{ copy.create }}</div>
        <h1 class="mt-3 text-3xl font-black text-[#17352c] sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.fullName }}</span>
            <input v-model="form.full_name" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.fullNamePlaceholder" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.email }}</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" class="w-full rounded-md border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2" :class="emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-700/15'" :aria-invalid="emailError ? 'true' : undefined" placeholder="you@example.com" required />
          </label>

          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block"><span class="mb-2 block text-sm text-slate-700">{{ copy.province }}</span><select v-model="form.province_code" class="registration-field w-full" required @change="changeRegion('province')"><option value="" disabled>{{ copy.selectProvince }}</option><option v-for="region in regions.province" :key="region.code" :value="region.code">{{ region.name }}</option></select></label>
              <label class="block"><span class="mb-2 block text-sm text-slate-700">{{ copy.regency }}</span><select v-model="form.regency_code" class="registration-field w-full" :disabled="!form.province_code" required @change="changeRegion('regency')"><option value="" disabled>{{ copy.selectRegency }}</option><option v-for="region in regions.regency" :key="region.code" :value="region.code">{{ region.name }}</option></select></label>
              <label class="block"><span class="mb-2 block text-sm text-slate-700">{{ copy.district }}</span><select v-model="form.district_code" class="registration-field w-full" :disabled="!form.regency_code" required @change="changeRegion('district')"><option value="" disabled>{{ copy.selectDistrict }}</option><option v-for="region in regions.district" :key="region.code" :value="region.code">{{ region.name }}</option></select></label>
              <label class="block"><span class="mb-2 block text-sm text-slate-700">{{ copy.village }}</span><select v-model="form.village_code" class="registration-field w-full" :disabled="!form.district_code" required><option value="" disabled>{{ copy.selectVillage }}</option><option v-for="region in regions.village" :key="region.code" :value="region.code">{{ region.name }}</option></select></label>
            </div>
            <p class="text-xs text-slate-600">{{ copy.regionHelp }}</p>
            <label class="block">
              <span class="mb-2 block text-sm text-slate-700">{{ copy.phone }}</span>
              <div class="phone-field flex overflow-hidden rounded-md border border-slate-300 bg-white transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/15">
                <select v-model="form.phoneCountryIso" :aria-label="copy.phoneCode" class="phone-country min-w-32 border-r border-slate-200 bg-white px-3 py-3 text-slate-900 focus:outline-none">
                  <optgroup :label="copy.mostSelected">
                    <option v-for="country in priorityCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                  <optgroup label="──────────">
                    <option v-for="country in otherCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                </select>
                <span class="flex items-center pl-3 text-sm font-semibold text-slate-600">{{ selectedPhoneCountry.dialCode }}</span>
                <input v-model.trim="form.phoneLocal" type="tel" inputmode="numeric" autocomplete="tel-national" minlength="5" class="min-w-0 flex-1 bg-transparent px-3 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none" placeholder="812 3456 7890" required />
              </div>
              <span class="mt-1.5 block text-xs text-slate-600">{{ copy.phoneHelp }}</span>
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.passwordPlaceholder" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.confirmPassword }}</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15" :placeholder="copy.confirmPlaceholder" required />
          </label>

          <button type="submit" class="w-full rounded-md bg-[#173f32] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#285442] active:scale-[0.99]" :disabled="submitting">
            {{ submitting ? copy.creating : copy.create }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-md border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : messageTone === 'error' ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-slate-50 text-slate-700'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-600">
          {{ copy.haveAccount }}
          <NuxtLink to="/auth/login" class="font-semibold text-emerald-800 underline-offset-4 hover:underline">{{ copy.login }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { countryFlag, countryOptions, otherCountries, priorityCountries } from '~/config/countries';
import type { AdministrativeRegion, RegionLevel } from '~/composables/useHariSantri';

const {locale}=useI18n();
const messages={
  id:{create:'Buat akun',title:'Daftar akun Hari Santri',intro:'Buat akun pemesan, pilih wilayah tempat tinggal, lalu pilih kegiatan dan lengkapi data peserta.',fullName:'Nama lengkap',fullNamePlaceholder:'Nama sesuai identitas',email:'Email',province:'Provinsi',regency:'Kabupaten/Kota',district:'Kecamatan',village:'Desa/Kelurahan',selectProvince:'Pilih provinsi',selectRegency:'Pilih kabupaten/kota',selectDistrict:'Pilih kecamatan',selectVillage:'Pilih desa/kelurahan',regionHelp:'Pilih wilayah secara berurutan dari provinsi sampai desa/kelurahan.',mostSelected:'Pilihan utama',phone:'Nomor WhatsApp',phoneCode:'Kode negara telepon',phoneHelp:'Masukkan nomor tanpa kode negara.',password:'Kata sandi',passwordPlaceholder:'Minimal 8 karakter',confirmPassword:'Ulangi kata sandi',confirmPlaceholder:'Masukkan ulang kata sandi',creating:'Membuat akun…',haveAccount:'Sudah punya akun?',login:'Masuk',required:'Lengkapi semua kolom wajib.',invalidEmail:'Masukkan alamat email yang valid.',phoneLength:'Masukkan nomor telepon yang valid.',passwordLength:'Kata sandi minimal 8 karakter.',passwordMismatch:'Kata sandi tidak sama.',success:'Akun berhasil dibuat. Membuka pendaftaran…',failed:'Akun belum dapat dibuat.'},
  en:{create:'Create account',title:'Create your Hari Santri account',intro:'Create the order owner account, choose your residential area, then choose an activity and enter each participant.',fullName:'Full name',fullNamePlaceholder:'Name as shown on ID',email:'Email',province:'Province',regency:'Regency/City',district:'District',village:'Village',selectProvince:'Select province',selectRegency:'Select regency/city',selectDistrict:'Select district',selectVillage:'Select village',regionHelp:'Select the area in order from province to village.',mostSelected:'Popular choices',phone:'WhatsApp number',phoneCode:'Phone country code',phoneHelp:'Enter the number without its country code.',password:'Password',passwordPlaceholder:'At least 8 characters',confirmPassword:'Confirm password',confirmPlaceholder:'Enter your password again',creating:'Creating account…',haveAccount:'Already have an account?',login:'Sign in',required:'Complete all required fields.',invalidEmail:'Enter a valid email address.',phoneLength:'Enter a valid phone number.',passwordLength:'Password must be at least 8 characters.',passwordMismatch:'Passwords do not match.',success:'Account created. Opening registration…',failed:'The account could not be created.'}
} as const;
const copy=computed(()=>messages[locale.value==='id'?'id':'en']);
useSeoMeta({title:()=>`${copy.value.create} | Hari Santri 2026`,description:()=>copy.value.intro});

const form = reactive({
  full_name: '',
  email: '',
  province_code: '',
  regency_code: '',
  district_code: '',
  village_code: '',
  phoneCountryIso: 'ID',
  phoneLocal: '',
  password: '',
  confirmPassword: ''
});
const { register } = useAuth();
const flow = useRegistrationFlow();
const submitting = ref(false);
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');
const emailError = ref(false);
const hariSantriApi = useHariSantri();
const regions = reactive<Record<RegionLevel, AdministrativeRegion[]>>({ province: [], regency: [], district: [], village: [] });
const changeRegion = async (level: RegionLevel) => {
  if (level === 'province') { form.regency_code = ''; form.district_code = ''; form.village_code = ''; regions.regency = []; regions.district = []; regions.village = []; regions.regency = (await hariSantriApi.getRegions('regency', form.province_code)).data; }
  if (level === 'regency') { form.district_code = ''; form.village_code = ''; regions.district = []; regions.village = []; regions.district = (await hariSantriApi.getRegions('district', form.regency_code)).data; }
  if (level === 'district') { form.village_code = ''; regions.village = (await hariSantriApi.getRegions('village', form.district_code)).data; }
};
onMounted(async () => { regions.province = (await hariSantriApi.getRegions('province')).data; });

type ApiErrorDetail = { field?: string; code?: string; message?: string };
type ApiErrorPayload = {
  message?: string;
  errors?: ApiErrorDetail[];
  request_id?: string;
};
type ApiError = {
  data?: ApiErrorPayload;
  response?: { _data?: ApiErrorPayload };
};

const registrationError = (error: unknown) => {
  const apiError = error as ApiError;
  const payload = apiError.data ?? apiError.response?._data;
  const detail = payload?.errors?.find(item => item.message);

  emailError.value = payload?.errors?.some(item => item.field === 'email' || item.code === 'USER_EXISTS') ?? false;

  return {
    message: payload?.message || detail?.message || (error instanceof Error ? error.message : copy.value.failed),
    requestId: payload?.request_id
  };
};
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};
const selectedPhoneCountry = computed(() => countryOptions.find(country => country.iso === form.phoneCountryIso) || countryOptions[0]!);
const internationalPhone = computed(() => {
  const dialDigits = selectedPhoneCountry.value.dialCode.replace(/\D/g, '');
  let localNumber = form.phoneLocal.replace(/\D/g, '').replace(/^0+/, '');
  if (localNumber.startsWith(dialDigits)) localNumber = localNumber.slice(dialDigits.length);
  return `${selectedPhoneCountry.value.dialCode}${localNumber}`;
});

const onSubmit = async () => {
  emailError.value = false;

  if (!form.full_name.trim() || !form.email || !form.province_code || !form.regency_code || !form.district_code || !form.village_code || !form.phoneLocal || !form.password || !form.confirmPassword) {
    message.value = copy.value.required;
    messageTone.value = 'error';
    return;
  }

  if (!isValidEmail(form.email)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  if (form.phoneLocal.replace(/\D/g, '').length < 5) {
    message.value = copy.value.phoneLength;
    messageTone.value = 'error';
    return;
  }

  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    messageTone.value = 'error';
    return;
  }

  if (form.password !== form.confirmPassword) {
    message.value = copy.value.passwordMismatch;
    messageTone.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = copy.value.creating;
  messageTone.value = 'neutral';

  try {
    const result = await register({
      email: form.email,
      full_name: form.full_name,
      province_code: form.province_code,
      regency_code: form.regency_code,
      district_code: form.district_code,
      village_code: form.village_code,
      phone: internationalPhone.value,
      password: form.password,
      preferred_locale: locale.value === 'id' ? 'id' : 'en'
    });

    if (result.success) {
      await flow.loadFlow(true);
      message.value = copy.value.success;
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = result.message || copy.value.failed;
    messageTone.value = 'error';
  } catch (error) {
    const apiError = registrationError(error);
    message.value = apiError.message;
    messageTone.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auth-shell {
  min-height: calc(100vh - 140px);
  background: #f5f5ef;
}
.auth-card {
  box-shadow: 0 18px 48px rgba(23, 63, 50, 0.08);
}
.registration-field {
  border: 1px solid #cbd5e1;
  border-radius: .375rem;
  background: #fff;
  padding: .75rem 1rem;
  color: #0f172a;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.registration-field:focus {
  border-color: #047857;
  outline: none;
  box-shadow: 0 0 0 2px rgb(4 120 87 / 15%);
}
.registration-field option,
.registration-field optgroup,
.phone-country option,
.phone-country optgroup {
  background: #fff;
  color: #0f172a;
}

@media (max-width: 767px) {
  .auth-shell {
    padding-inline: 0.75rem;
  }

  .auth-card {
    border-radius: 1.5rem;
    padding: 1.1rem 1rem;
  }

  .auth-card h1 {
    font-size: clamp(2rem, 9vw, 2.9rem);
    line-height: 1.08;
  }

  .auth-card input,
  .auth-card button {
    font-size: 1rem;
  }

  .auth-card .grid {
    grid-template-columns: 1fr;
  }
}
</style>
