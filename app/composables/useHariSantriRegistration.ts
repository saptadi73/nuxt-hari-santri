import type { PendingOrderRecord } from '~/composables/usePayment';
import type { BazaarApplicationRecord } from '~/composables/useHariSantri';
import { isOrderFullyPaid } from '~/utils/orderPaymentProgress';

const requests = new WeakMap<object, Promise<void>>();

export function useHariSantriRegistration() {
  const app = useNuxtApp();
  const auth = useAuthStore();
  const { locale } = useI18n();
  const runtime = useRuntimeConfig();
  const events = useEvent();
  const payments = usePayment();
  const hariSantri = useHariSantri();
  const orders = useState<PendingOrderRecord[]>('hari-santri-registration-orders', () => []);
  const applications = useState<BazaarApplicationRecord[]>('hari-santri-registration-applications', () => []);
  const loading = useState('hari-santri-registration-loading', () => false);
  const loaded = useState('hari-santri-registration-loaded', () => false);
  const error = useState('hari-santri-registration-error', () => '');
  const generation = useState('hari-santri-registration-generation', () => 0);
  const id = computed(() => locale.value === 'id');

  const reset = () => {
    generation.value++;
    orders.value = [];
    applications.value = [];
    loaded.value = false;
    loading.value = false;
    error.value = '';
  };
  const pendingOrder = computed(() => orders.value.find(entry =>
    !isOrderFullyPaid(entry.order)
    && (entry.order.allowed_actions?.includes('continue_payment')
      || ['draft', 'pending', 'partially_paid'].includes(entry.order.status.toLowerCase()))
  ));
  const paid = computed(() => orders.value.some(entry => isOrderFullyPaid(entry.order)));
  const status = computed(() => pendingOrder.value ? 'payment_pending' : paid.value ? 'paid' : 'not_registered');
  const ctaTo = computed(() => {
    if (!auth.isAuthenticated) return '/auth/register';
    if (auth.isAdminOrOrganizer) return '/dashboard';
    if (error.value || !loaded.value) return '/dashboard/payment';
    if (pendingOrder.value) return `/dashboard/payment?order_id=${encodeURIComponent(pendingOrder.value.order.id)}`;
    return paid.value ? '/dashboard/tiket' : '/daftar';
  });
  const ctaLabel = computed(() => {
    if (!auth.isAuthenticated) return id.value ? 'Daftar Peserta' : 'Register Participants';
    if (auth.isAdminOrOrganizer) return id.value ? 'Dashboard Panitia' : 'Organizer Dashboard';
    if (loading.value || !loaded.value && !error.value) return id.value ? 'Memeriksa status…' : 'Checking status…';
    if (error.value) return id.value ? 'Periksa status pendaftaran' : 'Check registration status';
    if (pendingOrder.value) return id.value ? 'Lanjutkan Pembayaran' : 'Continue Payment';
    return paid.value ? (id.value ? 'Lihat Tiket' : 'View Tickets') : (id.value ? 'Lanjutkan Pendaftaran' : 'Continue Registration');
  });
  const tenantLabel = computed(() => applications.value.length
    ? (id.value ? 'Status Pengajuan Tenant' : 'Tenant Application Status')
    : (id.value ? 'Daftar Tenant Bazar' : 'Apply as a Bazaar Tenant'));

  const refresh = async () => {
    if (!auth.isAuthenticated || auth.isAdminOrOrganizer) { reset(); return; }
    const pending = requests.get(app);
    if (pending) {
      await pending;
      if (auth.isAuthenticated && !loaded.value && !error.value) return refresh();
      return;
    }
    const currentGeneration = generation.value;
    loading.value = true;
    error.value = '';
    const request = (async () => {
      try {
        const event = (await events.getEvents(1, 100)).data.find(item => item.slug === runtime.public.eventSlug);
        if (!event) throw new Error(id.value ? 'Event Hari Santri belum tersedia.' : 'The Hari Santri event is not available.');
        const [records, tenants] = await Promise.all([
          (async () => {
            const result: PendingOrderRecord[] = [];
            for (let page = 1; ; page++) {
              const response = await payments.getPendingOrders(event.id, page, 100);
              result.push(...response.data.filter(entry => entry.order.event_id === event.id));
              if (response.data.length < 100 || response.meta?.total != null && page * 100 >= response.meta.total) return result;
            }
          })(),
          hariSantri.getMyBazaarApplications()
        ]);
        if (generation.value !== currentGeneration || !auth.isAuthenticated) return;
        orders.value = records;
        applications.value = tenants.data.filter(item => item.event_id === event.id);
        loaded.value = true;
      } catch (cause) {
        if (generation.value === currentGeneration) {
          loaded.value = false;
          error.value = cause instanceof Error ? cause.message : (id.value ? 'Status pendaftaran gagal dimuat.' : 'Registration status could not be loaded.');
        }
      } finally {
        loading.value = false;
      }
    })();
    requests.set(app, request);
    try { await request; } finally { requests.delete(app); }
  };

  return { orders, applications, loading, loaded, error, status, paid, pendingOrder, ctaTo, ctaLabel, tenantLabel, refresh, reset };
}
