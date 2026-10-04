import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, Error, ...globals });
  return module.exports;
}

const progress = compile('../app/utils/orderPaymentProgress.ts');
const auth = { isAuthenticated: true, isAdminOrOrganizer: false };
const locale = { value: 'id' };
const states = new Map();
const app = {};
let records = [];
let tenants = [];
let failure = false;
let pages = [];
const { useHariSantriRegistration } = compile('../app/composables/useHariSantriRegistration.ts', {
  require: () => progress,
  useNuxtApp: () => app,
  useAuthStore: () => auth,
  useI18n: () => ({ locale }),
  useRuntimeConfig: () => ({ public: { eventSlug: 'hari-santri-2026' } }),
  useState: (key, initial) => {
    if (!states.has(key)) states.set(key, { value: initial() });
    return states.get(key);
  },
  computed: getter => ({ get value() { return getter(); } }),
  useEvent: () => ({
    getEvents: async () => {
      if (failure) throw new Error('Backend unavailable');
      return { data: [{ id: 'event-1', slug: 'hari-santri-2026' }] };
    }
  }),
  usePayment: () => ({
    getPendingOrders: async (eventId, page, size) => {
      assert.equal(eventId, 'event-1');
      pages.push(page);
      return { data: records.slice((page - 1) * size, page * size), meta: { total: records.length } };
    }
  }),
  useHariSantri: () => ({ getMyBazaarApplications: async () => ({ data: tenants }) })
});
const flow = useHariSantriRegistration();
const order = (id, status, extra = {}) => ({
  order: { id, event_id: 'event-1', status, ...extra }, items: []
});

await flow.refresh();
assert.equal(flow.ctaLabel.value, 'Lanjutkan Pendaftaran');
assert.equal(flow.ctaTo.value, '/daftar');
for (const status of ['draft', 'pending', 'partially_paid']) {
  records = [order('pending-1', status)];
  await flow.refresh();
  assert.equal(flow.status.value, 'payment_pending');
  assert.equal(flow.ctaLabel.value, 'Lanjutkan Pembayaran');
  assert.equal(flow.ctaTo.value, '/dashboard/payment?order_id=pending-1');
}
records = [order('paid-1', 'paid', { remaining_amount: 0, is_payment_complete: true })];
await flow.refresh();
assert.equal(flow.status.value, 'paid');
assert.equal(flow.ctaTo.value, '/dashboard/tiket');
records.push(order('pending-2', 'pending'));
await flow.refresh();
assert.equal(flow.status.value, 'payment_pending');
assert.equal(flow.ctaTo.value, '/dashboard/payment?order_id=pending-2');
records = [order('old', 'expired'), order('cancelled', 'canceled'), order('unrelated', 'pending', { event_id: 'other-event' })];
tenants = [{ event_id: 'event-1', status: 'under_review' }, { event_id: 'other-event', status: 'approved' }];
await flow.refresh();
assert.equal(flow.ctaTo.value, '/daftar');
assert.equal(flow.applications.value.length, 1);
assert.equal(flow.tenantLabel.value, 'Status Pengajuan Tenant');

records = Array.from({ length: 100 }, (_, index) => order(`old-${index}`, 'expired'));
records.push(order('page-2', 'pending'));
pages = [];
await flow.refresh();
assert.equal(pages.join(','), '1,2');
assert.equal(flow.ctaTo.value, '/dashboard/payment?order_id=page-2');
locale.value = 'en';
assert.equal(flow.ctaLabel.value, 'Continue Payment');
assert.equal(flow.tenantLabel.value, 'Tenant Application Status');
failure = true;
await flow.refresh();
assert.equal(flow.loaded.value, false);
assert.equal(flow.error.value, 'Backend unavailable');
assert.equal(flow.ctaLabel.value, 'Check registration status');
failure = false;
auth.isAuthenticated = false;
await flow.refresh();
assert.equal(flow.orders.value.length, 0);
assert.equal(flow.applications.value.length, 0);
assert.equal(flow.ctaTo.value, '/auth/register');
assert.equal(flow.ctaLabel.value, 'Register Participants');
auth.isAuthenticated = true;
auth.isAdminOrOrganizer = true;
assert.equal(flow.ctaTo.value, '/dashboard');
console.log('Hari Santri registration status tests passed.');
