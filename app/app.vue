<template>
  <div class="site-shell min-h-screen text-white">
    <div class="ambient ambient-one" />
    <div class="ambient ambient-two" />

    <header class="sticky top-0 z-50 border-b border-sky-100 bg-white/95 shadow-[0_18px_45px_rgba(15,65,120,0.08)] backdrop-blur-xl">
      <div class="mx-auto flex w-full max-w-[1440px] items-center gap-1.5 px-2 py-2 sm:gap-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="brand-block flex min-w-0 shrink-0 items-center gap-3">
          <span class="brand-mark flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sky-100 bg-white p-0.5 shadow-sm shadow-sky-900/10 sm:h-14 sm:w-14">
            <img :src="siteLogo" alt="Logo Hari Santri 2026">
          </span>
          <span class="brand-copy hidden sm:block">
            <span class="brand-kicker block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-[#07518f]">MWC NU TARUMAJAYA</span>
            <span class="brand-name block whitespace-nowrap text-base font-extrabold tracking-[0.04em] text-[#073b78]">Hari Santri 2026</span>
          </span>
        </NuxtLink>

      <nav class="hidden items-center gap-1 text-sm font-bold text-[#073b78] xl:ml-auto xl:flex">
        <template v-for="item in primaryNav" :key="item.to">
          <details v-if="item.children" class="group relative">
            <summary class="nav-link inline-flex cursor-pointer list-none items-center whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] leading-none text-[#073b78] transition hover:bg-sky-50 hover:text-sky-700">
              {{ item.label }} <span class="ml-1 text-[9px] transition group-open:rotate-180" aria-hidden="true">▼</span>
            </summary>
            <div class="nav-menu-panel absolute left-0 top-10 grid w-52 gap-1 rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-2xl shadow-sky-900/15 backdrop-blur-xl">
              <NuxtLink v-for="child in item.children" :key="child.to" :to="child.to" class="rounded-xl px-4 py-3 text-sm text-sky-900 transition hover:bg-sky-50 hover:text-sky-700" @click="closeMenus">{{ child.label }}</NuxtLink>
            </div>
          </details>
          <NuxtLink v-else :to="item.to" :class="item.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-sky-50 hover:text-sky-700'" class="nav-link inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] leading-none" @click="item.disabled ? $event.preventDefault() : closeMenus()">
            {{ item.label }}
          </NuxtLink>
        </template>
          <details ref="desktopMenuRef" class="group relative" :open="desktopMenuOpen" @toggle="desktopMenuOpen = ($event.target as HTMLDetailsElement).open">
            <summary class="nav-link inline-flex cursor-pointer list-none items-center whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] leading-none text-[#073b78] transition hover:bg-sky-50 hover:text-sky-700">{{ locale === 'id' ? 'Lainnya' : 'More' }} <span class="ml-1 text-[9px] transition group-open:rotate-180" aria-hidden="true">▼</span></summary>
            <div class="nav-menu-panel absolute right-0 top-12 grid w-48 gap-1 rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-2xl shadow-sky-900/15 backdrop-blur-xl">
              <NuxtLink v-for="item in secondaryNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 text-sm text-sky-900 transition hover:bg-sky-50 hover:text-sky-700" @click="closeMenus">{{ item.label }}</NuxtLink>
            </div>
          </details>
        </nav>

        <div class="header-actions ml-auto flex shrink-0 items-center gap-1 sm:gap-2 xl:ml-2">
          <label v-if="!authStore.isAdminOrOrganizer" class="locale-switcher" :aria-label="locale === 'id' ? 'Bahasa' : 'Language'">
            <span class="sr-only">{{ locale === 'id' ? 'Bahasa' : 'Language' }}</span>
            <select :value="locale" @change="changeLocale"><option value="id">ID</option><option value="en">EN</option></select>
          </label>
          <div v-if="isAuthenticated" class="relative">
            <button
              type="button"
              class="inbox-trigger header-cta relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-sky-50 p-0 text-sky-800"
              :title="`Inbox${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`"
              @click="openInbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 5.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.5L12 12Z" />
                <path d="M22 5.5 12 12 2 5.5" />
                <path d="M6.5 10.5V11l.2.2L12 14l5.3-2.8V10.5" />
              </svg>
              <span v-if="unreadCount > 0" class="inbox-badge">
                {{ unreadBadgeText }}
              </span>
            </button>
            <div v-if="showInbox" ref="inboxPanelRef" class="inbox-panel absolute right-0 top-12 z-50 w-[min(22rem,85vw)]">
              <div class="rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-sm shadow-2xl backdrop-blur-xl">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">{{ t('inbox.title') }}</p>
                  <div class="flex items-center gap-2">
                    <button class="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200 hover:bg-white/5" type="button" @click="handleRefreshInbox">
                      {{ t('actions.refresh') }}
                    </button>
                    <button v-if="inboxUnreadCount > 0" class="rounded-full border border-emerald-300/35 px-3 py-1 text-[11px] text-emerald-100 hover:bg-emerald-300/10" type="button" @click="handleMarkAllRead">
                      {{ t('actions.markAllRead') }}
                    </button>
                  </div>
                </div>
                <div class="mb-3 rounded-xl border border-amber-200/20 bg-amber-100/5 px-3 py-2 text-xs text-amber-100">
                  <p class="text-[10px] uppercase tracking-[0.12em] text-amber-200">{{ t('inbox.activeAccount') }}</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ activeAccountName }}</p>
                  <p class="text-[11px] text-slate-300">{{ activeAccountEmail }}</p>
                </div>
                <p v-if="inboxError" class="mb-2 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">{{ inboxError }}</p>
                <div v-if="inboxLoading" class="rounded-lg border border-white/10 px-3 py-4 text-slate-400">{{ t('inbox.loading') }}</div>
                <p v-else-if="!inboxNotifications.length" class="rounded-lg border border-white/10 px-3 py-4 text-slate-400">{{ t('inbox.empty') }}</p>
                <div v-else class="space-y-2">
                  <button
                    v-for="item in inboxNotifications"
                    :key="item.id"
                    type="button"
                    class="w-full rounded-xl border border-white/10 px-3 py-2 text-left transition hover:bg-white/5"
                    :class="item.is_read ? 'bg-white/5 text-slate-300' : 'bg-emerald-300/10 text-white'"
                    @click="handleNotificationAction(item)"
                  >
                    <div class="mb-1 flex items-center justify-between gap-2">
                      <p class="text-xs font-semibold text-amber-100">{{ item.title || 'Notification' }}</p>
                      <span
                        v-if="notificationBadge(item)"
                        class="inline-flex rounded-full bg-amber-400/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-100"
                      >
                        {{ notificationBadge(item) }}
                      </span>
                    </div>
                    <p v-if="item.entity_type || item.entity_id" class="text-[10px] uppercase tracking-[0.15em] text-amber-200/80">
                      {{ item.entity_type || 'entity' }} {{ item.entity_id ? `#${item.entity_id}` : '' }}
                    </p>
                    <p class="mt-1 text-xs text-slate-200">{{ item.message || item.body || '-' }}</p>
                    <p v-if="item.created_at" class="mt-2 text-[11px] text-slate-400">{{ formatDateTime(item.created_at) }}</p>
                    <span v-if="!item.is_read" class="mt-1 inline-flex rounded-full bg-emerald-300/25 px-2 py-1 text-[10px] font-bold text-emerald-100">
                      {{ t('inbox.unread') }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="header-cta hidden whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800 shadow-[0_16px_40px_rgba(14,116,144,0.10)] transition hover:border-sky-300 hover:bg-sky-100 sm:inline-flex">
            {{ locale === 'id' ? 'Daftar Peserta' : 'Register Participants' }}
          </NuxtLink>
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="mobile-register-cta header-cta inline-flex whitespace-nowrap rounded-full bg-sky-700 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-800 sm:hidden">
            {{ locale === 'id' ? 'Daftar' : 'Register' }}
          </NuxtLink>
          <span v-if="isAuthenticated && isRegistrationPaid" class="header-cta hidden whitespace-nowrap rounded-full bg-sky-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-sky-500/20 opacity-90 lg:inline-flex">
            {{ localizedCtaLabel }}
          </span>
          <button v-if="isAuthenticated" type="button" class="header-cta hidden whitespace-nowrap rounded-full bg-sky-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-800 sm:px-5 lg:inline-flex" @click="handleLogout">
            {{ locale === 'id' ? 'Keluar' : 'Sign Out' }}
          </button>
          <NuxtLink v-else to="/auth/login" class="header-signin whitespace-nowrap rounded-full border border-sky-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800 shadow-[0_12px_30px_rgba(14,116,144,0.08)] transition hover:border-sky-300 hover:bg-sky-50 sm:px-5">
            {{ locale === 'id' ? 'Masuk' : 'Sign In' }}
          </NuxtLink>
          <details ref="mobileMenuRef" class="relative xl:hidden" :open="mobileMenuOpen" @toggle="mobileMenuOpen = ($event.target as HTMLDetailsElement).open">
            <summary :aria-label="locale === 'id' ? 'Menu' : 'Menu'" class="menu-button flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-xs font-bold uppercase tracking-[0.12em] text-sky-800 shadow-lg shadow-sky-900/10 transition hover:border-sky-300 hover:bg-sky-100">{{ locale === 'id' ? 'Menu' : 'Menu' }}</summary>
            <nav class="nav-menu-panel absolute right-0 top-12 grid w-[min(80vw,18rem)] gap-1 rounded-2xl border border-sky-100 bg-white/95 p-3 shadow-2xl shadow-sky-900/15 backdrop-blur-xl">
              <template v-for="item in allNav" :key="item.to">
                <details v-if="item.children" class="rounded-xl border border-sky-100">
                  <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-sky-900">{{ item.label }} <span class="text-[10px]" aria-hidden="true">▼</span></summary>
                  <div class="grid gap-1 border-t border-sky-100 p-2">
                    <NuxtLink v-for="child in item.children" :key="child.to" :to="child.to" class="rounded-lg px-4 py-2.5 text-sm text-sky-800 transition hover:bg-sky-50" @click="closeMenus">{{ child.label }}</NuxtLink>
                  </div>
                </details>
                <NuxtLink v-else :to="item.to" :class="item.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-sky-50 hover:text-sky-700'" class="rounded-xl px-4 py-3 text-sm text-sky-900 transition" @click="item.disabled ? $event.preventDefault() : closeMenus()">{{ item.label }}</NuxtLink>
              </template>
              <div v-if="isAuthenticated" class="mt-2 grid gap-2 border-t border-sky-100 pt-3 lg:hidden">
                <NuxtLink v-if="!isRegistrationPaid" :to="paymentCtaTo" class="rounded-xl bg-sky-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-sky-800" @click="closeMenus">
                  {{ localizedCtaLabel }}
                </NuxtLink>
                <span v-else class="rounded-xl bg-sky-50 px-4 py-3 text-center text-sm font-bold text-sky-800">
                  {{ localizedCtaLabel }}
                </span>
                <button type="button" class="rounded-xl border border-sky-200 px-4 py-3 text-left text-sm font-bold text-sky-900 transition hover:bg-sky-50" @click="handleLogout">
                  {{ t('actions.logOut') }}
                </button>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>

    <NuxtLink
      v-if="!authStore.isAdminOrOrganizer && !isRegistrationPaid && !route.path.startsWith('/auth/')"
      :to="paymentCtaTo"
      class="registration-floating-cta fixed top-1/2 right-6 z-40 hidden max-w-sm -translate-y-1/2 items-center gap-3 rounded-full border border-orange-300/40 bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-orange-950/30 transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 lg:inline-flex"
    >
      <span>{{ localizedCtaLabel }}</span>
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </NuxtLink>

    <main>
      <NuxtPage />
    </main>

    <footer class="relative z-10 border-t border-emerald-900/10 bg-[#f5f5ef] text-[#17352c]">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1fr_1.35fr] lg:px-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-emerald-800">Hari Santri 2026</p>
          <p class="mt-3 max-w-sm text-sm leading-7 text-slate-600">{{ locale === 'id' ? 'Sehat bersama, eratkan persaudaraan, rayakan semangat santri.' : 'Move together, strengthen friendship, and celebrate the spirit of the santri.' }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <NuxtLink to="/#tentang">{{ locale === 'id' ? 'Tentang' : 'About' }}</NuxtLink><NuxtLink to="/#kegiatan">{{ locale === 'id' ? 'Kegiatan' : 'Activities' }}</NuxtLink>
          <NuxtLink to="/#rute">{{ locale === 'id' ? 'Rute' : 'Routes' }}</NuxtLink><NuxtLink to="/#agenda">{{ locale === 'id' ? 'Agenda' : 'Agenda' }}</NuxtLink>
          <NuxtLink to="/#bazar">{{ locale === 'id' ? 'Bazar' : 'Bazaar' }}</NuxtLink>
          <NuxtLink to="/#sejarah">{{ locale === 'id' ? 'Sejarah Hari Santri' : 'Santri Day History' }}</NuxtLink><NuxtLink to="/#faq">FAQ</NuxtLink>
        </div>
        <div class="text-sm text-slate-600 md:text-right">
          <p class="md:whitespace-nowrap">{{ locale === 'id' ? 'MWC NU Tarumajaya menyelenggarakan' : 'Presented by MWC NU Tarumajaya' }}</p>
          <p class="mt-1">{{ locale === 'id' ? 'Minggu, 25 Oktober 2026 · Summarecon Crown Gading, Tarumajaya, Bekasi' : 'Sunday, 25 October 2026 · Summarecon Crown Gading, Tarumajaya, Bekasi' }}</p>
          <div class="mt-3 flex flex-wrap gap-4 md:justify-end"><NuxtLink to="/privacy">{{ locale === 'id' ? 'Kebijakan Privasi' : 'Privacy' }}</NuxtLink><NuxtLink to="/terms">{{ locale === 'id' ? 'Syarat & Ketentuan' : 'Terms' }}</NuxtLink><NuxtLink to="/code-of-conduct">{{ locale === 'id' ? 'Tata Tertib' : 'Code of Conduct' }}</NuxtLink><NuxtLink to="/refund-policy">{{ locale === 'id' ? 'Pembatalan' : 'Cancellations' }}</NuxtLink></div>
        </div>
      </div>
      <p class="border-t border-emerald-900/10 px-4 py-5 text-center text-xs text-slate-600">{{ locale === 'id' ? '© 2026 MWC NU Tarumajaya. Hak cipta dilindungi.' : '© 2026 MWC NU Tarumajaya. All rights reserved.' }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import siteLogo from '~/assets/images/logo_santri_2026.png';
import { useCommunication } from '~/composables/useCommunication';
const { t, locale, setLocale } = useI18n();
const localeCookie = useCookie<'id' | 'en'>('hari_santri_locale', { default: () => 'id' });
useHead(() => ({ htmlAttrs: { lang: locale.value } }));
const changeLocale = async (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  if (value !== 'id' && value !== 'en') return;
  await setLocale(value);
  localeCookie.value = value;
  if (authStore.isAuthenticated) {
    try {
      await updatePreferredLocale(value);
    } catch {
      // The locale cookie remains authoritative for this browser session if
      // synchronizing the account preference is temporarily unavailable.
    }
  }
};

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const { logout, updatePreferredLocale } = useAuth();
const registrationFlow = useRegistrationFlow();
const isRegistrationPaid = computed(() => false);
const paymentCtaTo = computed(() => '/dashboard/payment');
const localizedCtaLabel = computed(() => locale.value === 'id' ? 'Lanjutkan Pendaftaran' : 'Continue Registration');
const route = useRoute();
const routeEventId = computed(() => {
  const queryEventId = route.query.event_id;
  if (typeof queryEventId === 'string') return queryEventId.trim();
  if (Array.isArray(queryEventId)) return queryEventId[0] ?? '';
  return '';
});
const activeEventIdForInbox = computed(() => {
  if (routeEventId.value) return routeEventId.value;

  const orders = Array.isArray(registrationFlow.state.value?.orders) ? registrationFlow.state.value?.orders : [];
  const activeOrder = orders.find((order) => {
    const eventId = (order as { event_id?: string })?.event_id;
    return typeof eventId === 'string' && eventId.trim().length > 0;
  });
  if (!activeOrder) return '';

  return (activeOrder as { event_id?: string }).event_id || '';
});

const desktopMenuRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);
const communication = useCommunication();
const showInbox = ref(false);
const inboxPanelRef = ref<HTMLElement | null>(null);
const inboxLoading = ref(false);
const inboxError = ref<string>('');
type InboxNotification = {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  entity_type?: string;
  entity_id?: string;
  is_read?: boolean;
  created_at?: string;
};

const inboxNotifications = ref<Array<InboxNotification>>([]);
const inboxUnreadCount = ref(0);
const inboxPoller = ref<number | null>(null);
const unreadBadgeText = computed(() => (inboxUnreadCount.value > 9 ? '9+' : String(inboxUnreadCount.value)));
const unreadCount = computed(() => inboxUnreadCount.value);
const activeAccountName = computed(() => authStore.user?.full_name || authStore.user?.name || t('inbox.unknownUser'));
const activeAccountEmail = computed(() => authStore.user?.email || t('inbox.unknownEmail'));

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;

  const clickedInsideDesktop = desktopMenuRef.value && desktopMenuRef.value.contains(target);
  const clickedInsideMobile = mobileMenuRef.value && mobileMenuRef.value.contains(target);
  const clickedInsideInbox = inboxPanelRef.value && inboxPanelRef.value.contains(target);
  const clickedInboxTrigger = (target instanceof HTMLElement && target.closest('.inbox-trigger')) || false;

  if (!clickedInsideDesktop && !clickedInsideMobile && !clickedInsideInbox && !clickedInboxTrigger) {
    closeMenus();
    showInbox.value = false;
  }

  if (showInbox.value && !clickedInsideInbox && !clickedInboxTrigger) {
    showInbox.value = false;
  }
};

const loadInboxNotifications = async () => {
  if (!isAuthenticated.value) return;
  inboxLoading.value = true;
  inboxError.value = '';
  const isAdminInbox = authStore.isAdminOrOrganizer;
  const eventId = activeEventIdForInbox.value;
  try {
    const notificationsRequest = (isAdminInbox && eventId)
      ? communication.getAdminNotifications(eventId)
      : communication.getNotifications();
    const unreadRequest = communication.getInboxUnreadCount(eventId || undefined);
    const [notificationsResponse, unreadResponse] = await Promise.all([notificationsRequest, unreadRequest]);

    inboxNotifications.value = notificationsResponse.data ?? [];
    inboxUnreadCount.value = unreadResponse.data?.unread_count ?? 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load inbox';
    inboxError.value = message;
    inboxNotifications.value = [];
    inboxUnreadCount.value = 0;
  } finally {
    inboxLoading.value = false;
  }
};

const refreshUnreadOnly = async () => {
  if (!isAuthenticated.value) return;
  const eventId = activeEventIdForInbox.value;
  try {
    const unreadResponse = await communication.getInboxUnreadCount(eventId || undefined);
    inboxUnreadCount.value = unreadResponse.data?.unread_count ?? 0;
  } catch {
    // silent
  }
};

const handleRefreshInbox = async () => {
  await loadInboxNotifications();
};

const openInbox = async () => {
  showInbox.value = false;
  await navigateTo('/dashboard/inbox');
};

const handleMarkRead = async (notification: InboxNotification) => {
  try {
    const isAdminInbox = authStore.isAdminOrOrganizer;
    const eventId = activeEventIdForInbox.value;
    await (isAdminInbox && eventId
      ? communication.markAdminNotificationRead(notification.id, eventId)
      : communication.markNotificationRead(notification.id));
    await loadInboxNotifications();
  } catch {
    inboxError.value = 'Unable to mark notification as read';
  }
};

const resolveNotificationRoute = (notification: InboxNotification) => {
  const entityType = (notification.entity_type || '').toLowerCase();
  const id = notification.entity_id || '';
  if (!id) return '';

  switch (entityType) {
    case 'order':
      return `/dashboard/payment?order_id=${encodeURIComponent(id)}`;
    case 'payment':
      return `/dashboard/payment-status?payment_id=${encodeURIComponent(id)}`;
    case 'invoice':
      return `/dashboard/invoice?order_id=${encodeURIComponent(id)}`;
    case 'conversation':
    case 'message':
      return `/business-matching`;
    case 'conversation_id':
      return '/business-matching';
    case 'admin_order':
    case 'manual_payment':
    case 'manual_payment_confirmation':
      return `/admin/manual-payments?order_id=${encodeURIComponent(id)}`;
    case 'new_message':
    case 'meeting_request':
    case 'meeting_requested':
    case 'meeting_accepted':
    case 'meeting_declined':
    case 'meeting_confirmed':
    case 'meeting_reschedule':
    case 'meeting_cancelled':
    case 'meeting_reschedule_requested':
      return '/business-matching';
    case 'payment_status_update':
      return '/admin/transactions';
    default:
      return '/dashboard';
  }
};

const notificationBadge = (notification: InboxNotification) => {
  switch ((notification.type || '').toLowerCase()) {
    case 'payment_status_update':
      return 'Payment';
  }

  const entityType = (notification.entity_type || '').toLowerCase();
  switch (entityType) {
    case 'meeting_request':
    case 'meeting_requested':
    case 'meeting_accepted':
    case 'meeting_declined':
    case 'meeting_confirmed':
    case 'meeting_reschedule':
    case 'meeting_reschedule_requested':
    case 'meeting_cancelled':
    case 'new_message':
      return 'Meeting';
    case 'manual_payment':
    case 'manual_payment_confirmation':
    case 'admin_order':
      return 'Manual Payment';
    default:
      return '';
  }
};

const handleNotificationAction = async (notification: InboxNotification) => {
  const targetRoute = resolveNotificationRoute(notification);
  await handleMarkRead(notification);
  if (!targetRoute) return;

  showInbox.value = false;
  await navigateTo(targetRoute);
};

const handleMarkAllRead = async () => {
  try {
    const isAdminInbox = authStore.isAdminOrOrganizer;
    const eventId = activeEventIdForInbox.value;
    await (isAdminInbox && eventId
      ? communication.markAllAdminNotificationsRead(eventId)
      : communication.markAllNotificationsRead());
    await loadInboxNotifications();
  } catch {
    inboxError.value = 'Unable to mark all notifications as read';
  }
};

const refreshRegistrationFlow = async () => {
  if (!isAuthenticated.value) return;
  try {
    await registrationFlow.loadFlow(true);
  } catch {
    // A temporary progress request failure must not break navigation or authentication.
  }
};

const handleWindowFocus = () => { void refreshRegistrationFlow(); };
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') void refreshRegistrationFlow();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);

  void refreshRegistrationFlow();
  if (isAuthenticated.value) {
    void loadInboxNotifications();
    inboxPoller.value = window.setInterval(() => {
      void refreshUnreadOnly();
    }, 60000);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('focus', handleWindowFocus);
  if (inboxPoller.value) clearInterval(inboxPoller.value);
});

watch(isAuthenticated, (value) => {
  if (!value) {
    showInbox.value = false;
    inboxNotifications.value = [];
    inboxUnreadCount.value = 0;
    if (inboxPoller.value) {
      clearInterval(inboxPoller.value);
      inboxPoller.value = null;
    }
    return;
  }
  void refreshRegistrationFlow();
  void loadInboxNotifications();
  if (inboxPoller.value) clearInterval(inboxPoller.value);
  inboxPoller.value = window.setInterval(() => {
    void refreshUnreadOnly();
  }, 60000);
});

watch(showInbox, (open) => {
  if (!open || !isAuthenticated.value) return;
  void loadInboxNotifications();
});

watch(activeEventIdForInbox, (eventId, previousEventId) => {
  if (!isAuthenticated.value) return;
  if (eventId && eventId !== previousEventId) {
    void loadInboxNotifications();
  }
});

const handleLogout = async () => {
  await logout();
  await navigateTo('/');
};

const desktopMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

const closeMenus = () => {
  desktopMenuOpen.value = false;
  mobileMenuOpen.value = false;
};

type NavItem = { to: string; label: string; disabled?: boolean; children?: NavItem[] };

const primaryNav = computed<NavItem[]>(() => locale.value === 'id' ? [
  { to: '/', label: 'Beranda' },
  { to: '/#tentang', label: 'Tentang Acara' },
  { to: '/#kegiatan', label: 'Kegiatan & Paket' },
  { to: '/#rute', label: 'Rute' },
  { to: '/#agenda', label: 'Agenda' },
  { to: '/#pengisi-acara', label: 'Pengisi Acara' },
  { to: '/#hadiah', label: 'Hadiah' },
  { to: '/#bazar', label: 'Bazar & Voucher' },
  { to: '/#sejarah', label: 'Sejarah Hari Santri' }
] : [
  { to: '/', label: 'Home' },
  { to: '/#tentang', label: 'About' },
  { to: '/#kegiatan', label: 'Activities & Packages' },
  { to: '/#rute', label: 'Routes' },
  { to: '/#agenda', label: 'Agenda' },
  { to: '/#pengisi-acara', label: 'Performers' },
  { to: '/#hadiah', label: 'Prizes' },
  { to: '/#bazar', label: 'Bazaar & Vouchers' },
  { to: '/#sejarah', label: 'Santri Day History' }
]);
const secondaryNav = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { to: '/#faq', label: 'FAQ' },
    { to: '/daftar-tenant', label: locale.value === 'id' ? 'Daftar Tenant Bazar' : 'Apply as a Bazaar Tenant' },
    { to: '/dashboard', label: 'Dashboard' }
  ];

  if (authStore.isAdminOrOrganizer) {
    items.push({ to: '/admin/packages', label: locale.value === 'id' ? 'Kelola Paket' : 'Manage Packages' });
    items.push({ to: '/admin/participants-report', label: locale.value === 'id' ? 'Laporan Peserta' : 'Participant Reports' });
    items.push({ to: '/admin/announcements', label: locale.value === 'id' ? 'Pengumuman' : 'Announcements' });
  }

  return items;
});
const allNav = computed(() => [...primaryNav.value, ...secondaryNav.value]);
</script>

<style scoped>
.locale-switcher select {
  height: 2.25rem;
  cursor: pointer;
  border: 1px solid rgb(2 132 199 / 28%);
  border-radius: 999px;
  background: #fff;
  padding: 0 .65rem;
  color: #073b78;
  font-size: .7rem;
  font-weight: 800;
}

.brand-block {
  transition: transform 180ms ease;
}

.brand-mark img {
  transform: scale(1.04);
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.brand-mark {
  width: 3rem;
  height: 3rem;
}

.partner-logo {
  display: grid;
  width: 1.2rem;
  height: 1.2rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgb(2 132 199 / 16%);
  border-radius: .45rem;
  background: transparent;
  padding: 0;
}

.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.partner-logo--awec img { transform: scale(1.08); }
.partner-logo--iwapi { background: transparent; }
.partner-logo--iwapi img { transform: scale(1.1); }

@media (max-width: 360px) {
  .brand-block {
    gap: .2rem;
    min-width: 0;
    flex: 1 1 auto;
  }

  .brand-copy {
    display: none !important;
  }

  .brand-mark {
    width: 2.15rem;
    height: 2.15rem;
  }

  .header-actions {
    gap: .2rem;
  }

  .locale-switcher {
    display: none;
  }

  .mobile-register-cta {
    padding-inline: .55rem;
    font-size: .56rem;
    letter-spacing: .12em;
  }

  .partner-logos {
    display: flex;
    flex-shrink: 0;
    gap: .2rem;
    padding-left: .3rem;
  }

  .partner-logo {
    width: 1.15rem;
    height: 1.15rem;
    border-radius: .38rem;
    padding: .06rem;
  }
}

@media (min-width: 640px) {
  .brand-mark {
    width: 3.5rem;
    height: 3.5rem;
  }

  .partner-logo {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: .8rem;
    padding: .2rem;
  }
}

.brand-fallback {
  line-height: 1;
  color: #073b78;
  font-size: 0.65rem;
  font-size: clamp(0.62rem, 1.8vw, 0.75rem);
}

.brand-block:hover {
  transform: translateY(-1px);
}

.brand-kicker,
.brand-name,
.nav-link,
.registration-floating-cta,
.header-cta,
.header-signin,
.menu-button {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-kicker {
  text-shadow: none;
}

.brand-name {
  letter-spacing: 0.08em;
}

.inbox-trigger {
  position: relative;
}

.inbox-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  display: inline-flex;
  min-width: 1.2rem;
  height: 1.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding-inline: 0.32rem;
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1;
  color: #042f2e;
  background: #34d399;
  border: 1px solid rgba(4, 47, 46, 0.8);
}

.inbox-panel {
  position: absolute;
  z-index: 50;
  right: 0;
  width: min(22rem, calc(100vw - 1rem));
  max-width: 22rem;
}

.nav-link {
  color: #073b78;
  font-weight: 800;
  letter-spacing: 0.08em;
  font-size: 12px;
  line-height: 1;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}

.nav-link:hover,
.header-cta:hover,
.header-signin:hover,
.menu-button:hover {
  transform: translateY(-1px);
}

summary.nav-link,
.nav-link {
  display: inline-flex;
  align-items: center;
}

.header-actions {
  min-width: 0;
  max-width: 100%;
}

.header-cta,
.header-signin,
.menu-button {
  font-weight: 800;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, filter 180ms ease;
}

.nav-menu-panel {
  border: 1px solid rgba(14, 116, 144, 0.12);
  box-shadow: 0 24px 70px rgba(14, 116, 144, 0.18);
}

summary::-webkit-details-marker {
  display: none;
}

@media (max-width: 639px) {
  .mobile-register-cta {
    display: none;
  }

  .partner-logos {
    display: flex;
    flex-shrink: 0;
    gap: .2rem;
    padding-left: .35rem;
  }

  .partner-logo {
    width: 1.35rem;
    height: 1.35rem;
    border-radius: .5rem;
  }

  .brand-block .brand-mark {
    width: 2rem;
    height: 2rem;
  }

  .brand-kicker,
  .brand-name {
    display: none;
  }

  .header-actions {
    gap: 0.4rem;
    max-width: 100%;
    flex-shrink: 0;
  }

  .header-cta,
  .header-signin {
    padding-inline: 0.6rem;
    letter-spacing: 0.08em;
    font-size: 0.58rem;
  }

  .header-cta {
    max-width: 100%;
    white-space: nowrap;
  }

  .header-signin {
    padding-inline: 0.7rem;
  }

  .inbox-trigger {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
  }

  .inbox-panel {
    right: -0.25rem;
    width: min(20rem, calc(100vw - 0.75rem));
  }

  .menu-button {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    font-size: 0.54rem;
  }
}

@media (max-width: 479px) {
  .locale-switcher select {
    padding-inline: 0.5rem;
  }
}
</style>
