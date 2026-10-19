import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../app/pages/donasi.vue', import.meta.url), 'utf8');
const body = source.split('<script setup lang="ts">')[1].split('</script>')[0];
const calls = [], redirects = [], stored = new Map([['hari-santri-order-id', 'old-order']]);
let respond = async () => { throw new Error('Temporary failure'); };
const context = {
  ref: value => ({ value }), computed: getter => ({ get value() { return getter(); } }),
  useHariSantri: () => ({ createDonation: async payload => { calls.push(payload); return respond(); } }),
  crypto: { randomUUID: () => 'stable-donation-request' },
  sessionStorage: { removeItem: key => stored.delete(key), setItem: (key, value) => stored.set(key, value) },
  window: { location: { assign: url => redirects.push(url) } }, useSeoMeta: () => {}, Error,
};
vm.createContext(context);
vm.runInContext(ts.transpileModule(body + '\nglobalThis.form = { amount, donorName, donorEmail, loading, error, submitDonation };', {
  compilerOptions: { target: ts.ScriptTarget.ES2022 }
}).outputText, context);
const form = context.form;
for (const invalid of [undefined, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
  form.amount.value = invalid;
  await form.submitDonation();
  assert.ok(form.error.value);
}
assert.equal(calls.length, 0);
form.amount.value = 25000;
form.donorName.value = 'Donatur Uji';
form.donorEmail.value = 'donor@example.com';
await form.submitDonation();
assert.equal(form.error.value, 'Temporary failure');
assert.equal(redirects.length, 0);
let complete;
respond = () => new Promise(resolve => { complete = resolve; });
const pending = form.submitDonation();
await form.submitDonation();
assert.equal(calls.length, 2, 'Concurrent submit must not create another request');
assert.equal(calls[0].request_id, calls[1].request_id, 'Retry must reuse the request ID');
assert.equal(calls[1].amount, 25000);
assert.equal(calls[1].donor_name, 'Donatur Uji');
assert.equal(calls[1].donor_email, 'donor@example.com');
const paymentUrl = 'https://bayar.gagakrimang.web.id/p/test#test-token';
complete({ data: { reference_id: 'DON-HS26-TEST', payment_url: paymentUrl } });
await pending;
assert.deepEqual(redirects, [paymentUrl]);
assert.equal(stored.get('hari-santri-donation-reference'), 'DON-HS26-TEST');
assert.equal(stored.has('hari-santri-order-id'), false);
assert.equal(form.loading.value, false);
console.log('Donation payment tests passed: validation, retry, concurrent click, payload, redirect, session separation.');
