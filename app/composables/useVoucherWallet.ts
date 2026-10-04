import type { ApiResponse } from '~/composables/useApi';

export interface ParticipantVoucher {
  voucher_id: string;
  participant_id: string;
  participant_name: string;
  balance: number;
  initial_balance: number;
  status: 'active' | 'revoked' | 'expired';
  qr_token: string | null;
  expires_at: string;
  issued_at: string;
}

export interface VoucherParticipant {
  participant_id: string;
  participant_number: number;
  participant_name: string;
  activity_type: string;
  order_id: string;
}

export interface WalletTransfer {
  transfer_id: string;
  participant_id: string;
  exhibitor_id: string;
  amount: number;
  direction: string;
  created_at: string;
}

export interface Settlement {
  settlement_id: string;
  exhibitor_id: string;
  amount: number;
  status: 'pending' | 'confirmed';
  payment_reference: string | null;
  notes: string | null;
  requested_at: string;
  confirmed_at: string | null;
}

export interface ExhibitorWalletTarget { exhibitor_id: string; business_name: string; balance: number }
export interface MyExhibitor extends ExhibitorWalletTarget { status: string }
export interface AdminSettlement extends Settlement { business_name: string }
export interface SettlementReconciliation { exhibitor_id: string; business_name: string; total_credits: number; pending_settlement: number; confirmed_settlement: number; wallet_balance: number; expected_balance: number; status: 'matched' | 'mismatch' }
export interface HariSantriAuditLog { id: string; actor_user_id: string | null; actor_name: string | null; action: string; entity_type: string; entity_id: string | null; payload: Record<string, unknown>; created_at: string }

export function useVoucherWallet() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const listMyVouchers = () => api<ApiResponse<ParticipantVoucher[]>>('/hari-santri/me/wallets');
  const myTransfers = () => api<ApiResponse<WalletTransfer[]>>('/hari-santri/me/wallet/transfers');
  const exhibitorWallet = (exhibitorId: string) => api<ApiResponse<{ exhibitor_id: string; balance: number }>>(`/hari-santri/exhibitors/${encodeURIComponent(exhibitorId)}/wallet`);
  const exhibitorTransfers = (exhibitorId: string) => api<ApiResponse<WalletTransfer[]>>(`/hari-santri/exhibitors/${encodeURIComponent(exhibitorId)}/wallet/transfers`);
  const charge = (exhibitorId: string, payload: { qr_token: string; amount: number; request_id: string; participant_password: string }) => api<ApiResponse<{ transfer_id: string; participant_balance: number; exhibitor_balance: number; amount: number }>>(`/hari-santri/exhibitors/${encodeURIComponent(exhibitorId)}/wallet/charge`, { method: 'POST', body: payload });
  const myExhibitorWallet = () => api<ApiResponse<{ exhibitor_id: string; balance: number }>>('/hari-santri/me/exhibitor/wallet');
  const myExhibitorTransfers = () => api<ApiResponse<WalletTransfer[]>>('/hari-santri/me/exhibitor/wallet/transfers');
  const chargeMyExhibitor = (payload: { qr_token: string; amount: number; request_id: string; participant_password: string }) => api<ApiResponse<{ transfer_id: string; participant_balance: number; exhibitor_balance: number; amount: number }>>('/hari-santri/me/exhibitor/wallet/charge', { method: 'POST', body: payload });
  const myExhibitors = () => api<ApiResponse<MyExhibitor[]>>('/hari-santri/me/exhibitors');
  const selectedExhibitorWallet = (exhibitorId: string) => api<ApiResponse<{ exhibitor_id: string; balance: number }>>(`/hari-santri/me/exhibitors/${encodeURIComponent(exhibitorId)}/wallet`);
  const selectedExhibitorTransfers = (exhibitorId: string, filters?: { date_from?: string; date_to?: string }) => api<ApiResponse<WalletTransfer[]>>(`/hari-santri/me/exhibitors/${encodeURIComponent(exhibitorId)}/wallet/transfers`, { query: filters });
  const chargeSelectedExhibitor = (exhibitorId: string, payload: { qr_token: string; amount: number; request_id: string; participant_password: string }) => api<ApiResponse<{ transfer_id: string; participant_balance: number; exhibitor_balance: number; amount: number }>>(`/hari-santri/me/exhibitors/${encodeURIComponent(exhibitorId)}/wallet/charge`, { method: 'POST', body: payload });
  const requestMySettlement = (exhibitorId: string, payload: { payment_reference?: string; notes?: string }) => api<ApiResponse<Settlement>>(`/hari-santri/me/exhibitors/${encodeURIComponent(exhibitorId)}/settlements`, { method: 'POST', body: payload });
  const confirmMySettlement = (settlementId: string) => api<ApiResponse<Settlement>>(`/hari-santri/me/exhibitor/settlements/${encodeURIComponent(settlementId)}/confirm`, { method: 'POST' });
  const adminVouchers = (status?: string) => api<ApiResponse<ParticipantVoucher[]>>('/admin/hari-santri/vouchers', { query: status ? { status } : undefined });
  const voucherParticipants = () => api<ApiResponse<VoucherParticipant[]>>('/admin/hari-santri/voucher-participants');
  const createVoucher = (participantId: string, initialBalance: number) => api<ApiResponse<ParticipantVoucher>>('/admin/hari-santri/vouchers', { method: 'POST', body: { participant_id: participantId, initial_balance: initialBalance } });
  const adjustVoucher = (voucherId: string, amount: number, reason: string) => api<ApiResponse<{ voucher_id: string; balance: number }>>(`/admin/hari-santri/vouchers/${encodeURIComponent(voucherId)}/adjust`, { method: 'POST', body: { amount, reason } });
  const revokeVoucher = (voucherId: string) => api<ApiResponse<{ voucher_id: string; status: string }>>(`/admin/hari-santri/vouchers/${encodeURIComponent(voucherId)}/revoke`, { method: 'POST' });
  const createSettlement = (exhibitorId: string, payload: { amount: number; payment_reference?: string; notes?: string }) => api<ApiResponse<Settlement>>(`/admin/hari-santri/exhibitors/${encodeURIComponent(exhibitorId)}/settlements`, { method: 'POST', body: payload });
  const confirmSettlement = (settlementId: string) => api<ApiResponse<Settlement>>(`/admin/hari-santri/settlements/${encodeURIComponent(settlementId)}/confirm`, { method: 'POST' });
  const approvedExhibitors = () => api<ApiResponse<ExhibitorWalletTarget[]>>('/admin/hari-santri/exhibitors/approved');
  const settlements = () => api<ApiResponse<AdminSettlement[]>>('/admin/hari-santri/settlements');
  const settlementReconciliation = () => api<ApiResponse<SettlementReconciliation[]>>('/admin/hari-santri/settlements/reconciliation');
  const auditLogs = (filters?: { action?: string; limit?: number }) => api<ApiResponse<HariSantriAuditLog[]>>('/admin/hari-santri/audit-logs', { query: filters });

  return { listMyVouchers, myTransfers, exhibitorWallet, exhibitorTransfers, charge, myExhibitorWallet, myExhibitorTransfers, chargeMyExhibitor, myExhibitors, selectedExhibitorWallet, selectedExhibitorTransfers, chargeSelectedExhibitor, requestMySettlement, confirmMySettlement, adminVouchers, voucherParticipants, approvedExhibitors, settlements, settlementReconciliation, auditLogs, createVoucher, adjustVoucher, revokeVoucher, createSettlement, confirmSettlement };
}
