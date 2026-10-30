<template>
  <div class="finance-table-shell">
    <table class="finance-table">
      <thead><tr><th>{{ kind === 'payments' ? 'Pemesan' : 'Donatur' }}</th><th>Referensi</th><th>Nominal</th><th>Status</th><th>Tanggal</th></tr></thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td :data-label="kind === 'payments' ? 'Pemesan' : 'Donatur'"><strong>{{ identityName(item) }}</strong><small v-if="showIdentity">{{ identityEmail(item) }}</small><small v-if="item.event_name">{{ item.event_name }}</small></td>
          <td data-label="Referensi"><strong class="reference">{{ item.reference_id }}</strong><small v-if="kind === 'payments' && item.order_number">Pesanan {{ item.order_number }}</small><small v-if="item.payment_no">Pembayaran {{ item.payment_no }}</small></td>
          <td data-label="Nominal"><strong>{{ money(item.amount, item.currency) }}</strong></td>
          <td data-label="Status"><span class="status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span></td>
          <td data-label="Tanggal"><strong>{{ formatDate(item.paid_at || item.created_at) }}</strong><small>{{ item.paid_at ? 'Dikonfirmasi lunas' : 'Dibuat' }}</small></td>
        </tr>
        <tr v-if="!items.length"><td colspan="5" class="empty">{{ emptyLabel }}</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { HarlahFinanceItem } from '~/types/harlahReports';
const props = withDefaults(defineProps<{ items: HarlahFinanceItem[]; kind?: 'payments' | 'donations'; showIdentity?: boolean; emptyLabel?: string }>(), { kind: 'donations', showIdentity: false, emptyLabel: 'Belum ada data.' });
const identityName = (item: HarlahFinanceItem) => props.kind === 'payments' ? (item.customer_name || 'Peserta') : (item.donor_name || 'Donatur');
const identityEmail = (item: HarlahFinanceItem) => props.kind === 'payments' ? item.customer_email : item.donor_email;
const money = (amount: number, currency = 'IDR') => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0));
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const statusLabel = (value: string) => ({ PAID: 'Lunas', PENDING: 'Menunggu', UNKNOWN: 'Perlu diperiksa', CREATING: 'Dibuat', CREATED: 'Dibuat', FAILED: 'Gagal', EXPIRED: 'Kedaluwarsa', CANCELED: 'Dibatalkan' }[value?.toUpperCase()] || value);
const statusClass = (value: string) => { const status = value?.toUpperCase(); if (status === 'PAID') return 'is-paid'; if (['FAILED', 'EXPIRED', 'CANCELED'].includes(status)) return 'is-failed'; return 'is-pending'; };
</script>

<style scoped>
.finance-table-shell{overflow-x:auto;border:1px solid #d9e0d8;background:#fff}.finance-table{width:100%;border-collapse:collapse;color:#17352c;font-size:.88rem}th{background:#edf3ea;color:#2d7258;font-size:.68rem;letter-spacing:.09em;text-align:left;text-transform:uppercase}th,td{padding:1rem;border-bottom:1px solid #e2e8df;vertical-align:top}tbody tr:last-child td{border-bottom:0}td strong,td small{display:block}td small{margin-top:.28rem;color:#6b7c72;font-size:.72rem}.reference{overflow-wrap:anywhere}.status{display:inline-flex;border-radius:999px;padding:.35rem .65rem;font-size:.68rem;font-weight:800}.is-paid{background:#dcefe2;color:#12603b}.is-pending{background:#fff0c2;color:#805a00}.is-failed{background:#fee2e2;color:#991b1b}.empty{padding:2rem;color:#6b7c72;text-align:center}
@media(max-width:720px){.finance-table-shell{border:0;background:transparent;overflow:visible}.finance-table,.finance-table tbody,.finance-table tr,.finance-table td{display:block;width:100%}.finance-table thead{display:none}.finance-table tr{margin-bottom:.8rem;border:1px solid #d9e0d8;border-radius:1rem;background:#fff;padding:.45rem .85rem}.finance-table td{display:grid;grid-template-columns:minmax(6.5rem,35%) 1fr;gap:.7rem;border-bottom:1px solid #edf0eb;padding:.7rem 0}.finance-table td::before{content:attr(data-label);color:#2d7258;font-size:.65rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase}.finance-table td:last-child{border-bottom:0}.finance-table td.empty{display:block;text-align:center}.finance-table td.empty::before{display:none}}
</style>
