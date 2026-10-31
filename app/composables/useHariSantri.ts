import type { useApi, ApiResponse } from '~/composables/useApi';
import type { HarlahFinanceReport } from '~/types/harlahReports';

export type ActivityType = 'CYCLING' | 'FAMILY_WALK';

export type RegionLevel = 'province' | 'regency' | 'district' | 'village';

export interface AdministrativeRegion {
  code: string;
  name: string;
  level: RegionLevel;
  parent_code: string | null;
}

export interface ShirtSizeOption {
  id: string;
  event_id: string;
  code: string;
  label: string;
  size_chart: Record<string, unknown> | null;
  active: boolean;
  sort_order: number;
  capacity: number;
  reserved: number;
  allocated: number;
  available: number;
}

export interface OrderParticipantInput {
  full_name: string;
  birth_date?: string | null;
  guardian_name?: string | null;
  guardian_contact?: string | null;
  province_code?: string;
  regency_code?: string;
  district_code?: string;
  village_code?: string;
  activity_type: ActivityType;
  shirt_size_code: string;
}

export interface OrderParticipantRecord extends OrderParticipantInput {
  id: string;
  participant_number: number;
  status: string;
  created_at: string;
}

export interface HariSantriCheckout {
  payment_id?: string | null;
  payment_no?: string | null;
  reference_id?: string;
  payment_url?: string | null;
  status: string;
  expires_at?: string | null;
  already_paid: boolean;
}

export interface HariSantriPaymentStatus {
  order_id: string;
  order_status: string;
  payment_id: string | null;
  payment_no: string | null;
  payment_status: string;
}

export interface DonationCheckout {
  id: string;
  reference_id: string;
  amount: number;
  currency: 'IDR';
  status: string;
  payment_no: string | null;
  payment_url: string;
}

export interface DonationStatus {
  reference_id: string;
  amount: number;
  currency: 'IDR';
  status: string;
  payment_no: string | null;
  paid_at: string | null;
}

export interface HariSantriTicket {
  ticket_id: string;
  ticket_number: string;
  participant_name: string;
  activity_type: ActivityType;
  status: string;
  qr_token: string;
  issued_at: string;
}

export interface HariSantriInvoice {
  order_id: string;
  order_number: string;
  invoice_number: string;
  event_name: string;
  customer_name: string;
  customer_email: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  currency: string;
  created_at: string;
  items: Array<{ product_name: string; product_type: string; quantity: number; unit_price: number; line_total: number; currency: string }>;
  participants: Array<{ participant_number: number; full_name: string; activity_type: ActivityType; shirt_size_code: string | null; status: string }>;
  payment: { reference_id: string; payment_no: string | null; status: string; amount: number; currency: string; confirmed_at: string | null } | null;
}

export interface HariSantriCheckinResult {
  ticket_number: string;
  participant_name: string;
  checked_in_at: string;
}

export interface BazaarApplicationInput {
  business_name: string;
  representative_name: string;
  contact_email: string;
  contact_phone: string;
  category: 'food' | 'islamic_books' | 'halal_products' | 'other';
  product_summary: string;
  stall_needs: string[];
}

export interface BazaarApplicationRecord extends BazaarApplicationInput {
  id: string;
  event_id: string;
  status: string;
  organizer_notes: string | null;
  created_at: string;
}

export function useHariSantri() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getShirtSizes = (eventId: string) =>
    api<ApiResponse<ShirtSizeOption[]>>(`/events/${encodeURIComponent(eventId)}/shirt-sizes`);

  const getRegions = (level: RegionLevel, parentCode?: string) =>
    api<ApiResponse<AdministrativeRegion[]>>('/regions', {
      query: { level, ...(parentCode ? { parent_code: parentCode } : {}) }
    });

  const getAdminShirtSizes = (eventId: string) =>
    api<ApiResponse<ShirtSizeOption[]>>(`/admin/events/${encodeURIComponent(eventId)}/shirt-sizes`);

  const createShirtSize = (eventId: string, payload: { code: string; label: string; active: boolean; sort_order: number; size_chart?: Record<string, unknown> | null; capacity: number }) =>
    api<ApiResponse<ShirtSizeOption>>(`/admin/events/${encodeURIComponent(eventId)}/shirt-sizes`, { method: 'POST', body: payload });

  const updateShirtSize = (sizeId: string, payload: { code: string; label: string; active: boolean; sort_order: number; size_chart?: Record<string, unknown> | null; capacity: number }) =>
    api<ApiResponse<ShirtSizeOption>>(`/admin/shirt-sizes/${encodeURIComponent(sizeId)}`, { method: 'PUT', body: payload });

  const saveParticipants = (orderId: string, participants: OrderParticipantInput[]) =>
    api<ApiResponse<OrderParticipantRecord[]>>(`/orders/${encodeURIComponent(orderId)}/participants`, {
      method: 'PUT',
      body: { participants }
    });

  const getParticipants = (orderId: string) =>
    api<ApiResponse<OrderParticipantRecord[]>>(`/orders/${encodeURIComponent(orderId)}/participants`);

  const createCheckout = (orderId: string) =>
    api<ApiResponse<HariSantriCheckout>>(`/hari-santri/orders/${encodeURIComponent(orderId)}/checkout`, {
      method: 'POST'
    });

  const getPaymentStatus = (orderId: string) =>
    api<ApiResponse<HariSantriPaymentStatus>>(`/hari-santri/orders/${encodeURIComponent(orderId)}/payment-status`);

  const reconcileOrderPayment = (orderId: string) =>
    api<ApiResponse<Record<string, unknown>>>(`/hari-santri/orders/${encodeURIComponent(orderId)}/payment-reconcile`, { method: 'POST' });

  const createDonation = (payload: { request_id: string; donor_name: string; donor_email: string; amount: number }) =>
    api<ApiResponse<DonationCheckout>>('/donations', { method: 'POST', body: payload });

  const getDonationStatus = (referenceId: string) =>
    api<ApiResponse<DonationStatus>>(`/donations/${encodeURIComponent(referenceId)}/status`);

  const getMyDonations = (page = 1, size = 20) =>
    api<ApiResponse<HarlahFinanceReport>>('/hari-santri/me/donations', { query: { page, size } });

  const reconcilePayment = (referenceId: string) =>
    api<ApiResponse<Record<string, unknown>>>(`/admin/hari-santri/payments/${encodeURIComponent(referenceId)}/reconcile`, { method: 'POST' });

  const getMyTickets = () =>
    api<ApiResponse<HariSantriTicket[]>>('/hari-santri/me/tickets');

  const getMyInvoices = () =>
    api<ApiResponse<HariSantriInvoice[]>>('/hari-santri/me/invoices');

  const checkinTicket = (qrToken: string) =>
    api<ApiResponse<HariSantriCheckinResult>>('/hari-santri/staff/checkins', { method: 'POST', body: { qr_token: qrToken } });

  const submitBazaarApplication = (payload: BazaarApplicationInput) =>
    api<ApiResponse<BazaarApplicationRecord>>('/bazaar/applications', { method: 'POST', body: payload });

  const getMyBazaarApplications = () =>
    api<ApiResponse<BazaarApplicationRecord[]>>('/bazaar/me/applications');

  return { getShirtSizes, getRegions, getAdminShirtSizes, createShirtSize, updateShirtSize, saveParticipants, getParticipants, createCheckout, getPaymentStatus, reconcileOrderPayment, createDonation, getDonationStatus, getMyDonations, reconcilePayment, getMyTickets, getMyInvoices, checkinTicket, submitBazaarApplication, getMyBazaarApplications };
}
