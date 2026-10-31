<template>
  <main class="auth-shell text-[#17352c]">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div class="mb-4 inline-flex rounded-lg border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-emerald-900">{{ copy.create }}</div>
        <h1 class="mt-3 text-3xl font-black text-[#17352c] sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.fullName }}</span>
            <input v-model="form.full_name" class="registration-input" :placeholder="copy.fullNamePlaceholder" autocomplete="name" required>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.email }}</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" class="registration-input" :class="emailError ? 'is-invalid' : ''" :aria-invalid="emailError ? 'true' : undefined" placeholder="you@example.com" required>
          </label>

          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block"><span class="mb-2 block text-sm font-medium text-slate-700">{{ copy.province }}</span><span class="select-wrap"><select v-model="form.province_code" class="registration-field" required @change="changeRegion('province')"><option value="" disabled>{{ copy.selectProvince }}</option><option v-for="region in regions.province" :key="region.code" :value="region.code">{{ region.name }}</option></select><svg class="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span></label>
              <label class="block"><span class="mb-2 block text-sm font-medium text-slate-700">{{ copy.regency }}</span><span class="select-wrap"><select v-model="form.regency_code" class="registration-field" :disabled="!form.province_code" required @change="changeRegion('regency')"><option value="" disabled>{{ copy.selectRegency }}</option><option v-for="region in regions.regency" :key="region.code" :value="region.code">{{ region.name }}</option></select><svg class="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span></label>
              <label class="block"><span class="mb-2 block text-sm font-medium text-slate-700">{{ copy.district }}</span><span class="select-wrap"><select v-model="form.district_code" class="registration-field" :disabled="!form.regency_code" required @change="changeRegion('district')"><option value="" disabled>{{ copy.selectDistrict }}</option><option v-for="region in regions.district" :key="region.code" :value="region.code">{{ region.name }}</option></select><svg class="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span></label>
              <label class="block"><span class="mb-2 block text-sm font-medium text-slate-700">{{ copy.village }}</span><span class="select-wrap"><select v-model="form.village_code" class="registration-field" :disabled="!form.district_code" required><option value="" disabled>{{ copy.selectVillage }}</option><option v-for="region in regions.village" :key="region.code" :value="region.code">{{ region.name }}</option></select><svg class="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span></label>
            </div>
            <p class="text-xs text-slate-600">{{ copy.regionHelp }}</p>
            <label class="block">
              <span class="mb-2 block text-sm text-slate-700">{{ copy.phone }}</span>
              <div class="phone-field flex overflow-hidden rounded-xl border border-slate-300 bg-slate-50 transition focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10">
                <span class="phone-country-wrap"><select v-model="form.phoneCountryIso" :aria-label="copy.phoneCode" class="phone-country">
                  <optgroup :label="copy.mostSelected">
                    <option v-for="country in priorityCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                  <optgroup label="──────────">
                    <option v-for="country in otherCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                </select><svg class="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
                <span class="flex shrink-0 items-center border-l border-slate-200 pl-3 text-sm font-semibold text-slate-600">{{ selectedPhoneCountry.dialCode }}</span>
                <input v-model.trim="form.phoneLocal" type="tel" inputmode="numeric" autocomplete="tel-national" minlength="5" class="registration-phone-input" placeholder="812 3456 7890" required>
              </div>
              <span class="mt-1.5 block text-xs text-slate-600">{{ copy.phoneHelp }}</span>
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="registration-input" :placeholder="copy.passwordPlaceholder" required>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-700">{{ copy.confirmPassword }}</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="registration-input" :placeholder="copy.confirmPlaceholder" required>
          </label>

          <button type="submit" class="registration-submit" :disabled="submitting">
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
  id:{create:'Buat akun',title:'Daftar akun Harlah NU',intro:'Buat akun pemesan, pilih wilayah tempat tinggal, lalu pilih kegiatan dan lengkapi data peserta.',fullName:'Nama lengkap',fullNamePlaceholder:'Nama sesuai identitas',email:'Email',province:'Provinsi',regency:'Kabupaten/Kota',district:'Kecamatan',village:'Desa/Kelurahan',selectProvince:'Pilih provinsi',selectRegency:'Pilih kabupaten/kota',selectDistrict:'Pilih kecamatan',selectVillage:'Pilih desa/kelurahan',regionHelp:'Pilih wilayah secara berurutan dari provinsi sampai desa/kelurahan.',mostSelected:'Pilihan utama',phone:'Nomor WhatsApp',phoneCode:'Kode negara telepon',phoneHelp:'Masukkan nomor tanpa kode negara.',password:'Kata sandi',passwordPlaceholder:'Minimal 8 karakter',confirmPassword:'Ulangi kata sandi',confirmPlaceholder:'Masukkan ulang kata sandi',creating:'Membuat akun…',haveAccount:'Sudah punya akun?',login:'Masuk',required:'Lengkapi semua kolom wajib.',invalidEmail:'Masukkan alamat email yang valid.',phoneLength:'Masukkan nomor telepon yang valid.',passwordLength:'Kata sandi minimal 8 karakter.',passwordMismatch:'Kata sandi tidak sama.',success:'Akun berhasil dibuat. Membuka pendaftaran…',failed:'Akun belum dapat dibuat.'},
  en:{create:'Create account',title:'Create your Harlah NU account',intro:'Create the order owner account, choose your residential area, then choose an activity and enter each participant.',fullName:'Full name',fullNamePlaceholder:'Name as shown on ID',email:'Email',province:'Province',regency:'Regency/City',district:'District',village:'Village',selectProvince:'Select province',selectRegency:'Select regency/city',selectDistrict:'Select district',selectVillage:'Select village',regionHelp:'Select the area in order from province to village.',mostSelected:'Popular choices',phone:'WhatsApp number',phoneCode:'Phone country code',phoneHelp:'Enter the number without its country code.',password:'Password',passwordPlaceholder:'At least 8 characters',confirmPassword:'Confirm password',confirmPlaceholder:'Enter your password again',creating:'Creating account…',haveAccount:'Already have an account?',login:'Sign in',required:'Complete all required fields.',invalidEmail:'Enter a valid email address.',phoneLength:'Enter a valid phone number.',passwordLength:'Password must be at least 8 characters.',passwordMismatch:'Passwords do not match.',success:'Account created. Opening registration…',failed:'The account could not be created.'}
} as const;
const copy=computed(()=>messages[locale.value==='id'?'id':'en']);
useSeoMeta({title:()=>`${copy.value.create} | Harlah NU ke-101`,description:()=>copy.value.intro});

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
const flow = useHariSantriRegistration();
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
      preferred_locale: 'id'
    });

    if (result.success) {
      await flow.refresh();
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
  box-shadow: 0 24px 64px rgba(23, 63, 50, 0.09);
}

.registration-input {
  width: 100%;
  min-height: 3.5rem;
  border: 1px solid #cbd5e1;
  border-radius: .75rem;
  background: #f8fafc;
  padding: .875rem 1rem;
  color: #0f172a;
  font-size: 1rem;
  transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
}

.registration-input::placeholder,
.registration-phone-input::placeholder {
  color: #94a3b8;
}

.registration-input:hover,
.registration-field:hover {
  border-color: #94a3b8;
}

.registration-input:focus,
.registration-field:focus,
.phone-country:focus {
  border-color: #047857;
  outline: none;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgb(4 120 87 / 10%);
}

.registration-input.is-invalid {
  border-color: #f87171;
}

.registration-input.is-invalid:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgb(239 68 68 / 10%);
}

.select-wrap,
.phone-country-wrap {
  position: relative;
  display: block;
}

.registration-field {
  width: 100%;
  min-height: 3.5rem;
  appearance: none;
  border: 1px solid #cbd5e1;
  border-radius: .75rem;
  background-color: #f8fafc;
  padding: .875rem 2.75rem .875rem 1rem;
  color: #0f172a;
  font-size: 1rem;
  transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
}

.registration-field:disabled {
  cursor: not-allowed;
  border-color: #e2e8f0;
  background-color: #f1f5f9;
  color: #94a3b8;
}

.select-chevron {
  position: absolute;
  top: 50%;
  right: .875rem;
  width: 1.15rem;
  height: 1.15rem;
  color: #64748b;
  pointer-events: none;
  transform: translateY(-50%);
}

.registration-field option,
.registration-field optgroup,
.phone-country option,
.phone-country optgroup {
  background: #fff;
  color: #0f172a;
}

.phone-country-wrap {
  flex: 0 0 8.5rem;
  border-right: 1px solid #e2e8f0;
}

.phone-country {
  width: 100%;
  height: 100%;
  min-height: 3.5rem;
  appearance: none;
  border: 0;
  background: transparent;
  padding: .75rem 2rem .75rem .875rem;
  color: #0f172a;
  font-size: .9rem;
  transition: box-shadow .2s ease;
}

.phone-country:focus {
  position: relative;
  z-index: 1;
}

.phone-country-wrap .select-chevron {
  right: .55rem;
  width: 1rem;
  height: 1rem;
}

.registration-phone-input {
  width: 100%;
  min-width: 0;
  min-height: 3.5rem;
  flex: 1;
  background: transparent;
  padding: .75rem;
  color: #0f172a;
  font-size: 1rem;
  outline: none;
}

.registration-submit {
  min-height: 3.25rem;
  width: 100%;
  border-radius: .75rem;
  background: #173f32;
  padding: .75rem 1rem;
  color: #fff;
  font-size: .95rem;
  font-weight: 700;
  transition: background-color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.registration-submit:hover:not(:disabled) {
  background: #285442;
  box-shadow: 0 8px 20px rgb(23 63 50 / 18%);
}

.registration-submit:active:not(:disabled) {
  transform: scale(.99);
}

.registration-submit:disabled {
  cursor: wait;
  opacity: .7;
}

@media (max-width: 767px) {
  .auth-shell {
    padding-inline: 0.75rem;
  }

  .auth-card {
    padding: 1.1rem 1rem;
  }

  .auth-card h1 {
    font-size: clamp(2rem, 9vw, 2.9rem);
    line-height: 1.08;
  }

}

@media (min-width: 480px) and (max-width: 767px) {
  .auth-card .space-y-4 > .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 479px) {
  .auth-card .space-y-4 > .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 380px) {
  .phone-country-wrap {
    flex-basis: 7.25rem;
  }

  .phone-country {
    padding-left: .65rem;
    font-size: .82rem;
  }

  .registration-phone-input {
    padding-inline: .55rem;
  }
}
</style>
