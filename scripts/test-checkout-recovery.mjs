import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../app/pages/daftar.vue', import.meta.url), 'utf8');
const body = source.slice(source.indexOf('const recoverExistingOrder ='), source.indexOf('onMounted(async'));
let roster = [], destinations = [];
const flow = { refresh: async () => {}, error: { value: '' }, pendingOrder: { value: null },
  status: { value: 'not_registered' }, ctaTo: { value: '/dashboard/payment' } };
const resumeOrderId = { value: '' }, activity = { value: '' }, selectedProductId = { value: '' };
const context = { registrationProgress: flow, hariSantriApi: { getParticipants: async () => ({ data: roster }) },
  navigateTo: async path => destinations.push(path), products: { value: [{ id: 'p1', metadata_json: { activity_type: 'FAMILY_WALK' } }] },
  resumeOrderId, activity, selectedProductId, nextTick: async () => {}, encodeURIComponent };
vm.createContext(context);
vm.runInContext(ts.transpileModule(body + '\nglobalThis.recover = recoverExistingOrder;', {
  compilerOptions: { target: ts.ScriptTarget.ES2022 }
}).outputText, context);
assert.equal(await context.recover(), false);
flow.pendingOrder.value = { order: { id: 'existing' }, items: [{ product_id: 'p1' }] };
assert.equal(await context.recover(), false);
assert.equal(resumeOrderId.value, 'existing');
assert.equal(selectedProductId.value, 'p1');
roster = [{ id: 'participant' }];
assert.equal(await context.recover(), true);
assert.equal(destinations.at(-1), '/dashboard/payment?order_id=existing');
for (const status of ['paid', 'paid_needs_review']) {
  flow.status.value = status;
  assert.equal(await context.recover(), true);
  assert.equal(destinations.at(-1), flow.ctaTo.value);
}
flow.error.value = 'Network failure';
await assert.rejects(context.recover(), /Status pesanan/);
assert.ok(source.includes('if (submitting.value) return;'));
console.log('Checkout recovery tests passed (new, incomplete, existing, paid, review, network failure).');
