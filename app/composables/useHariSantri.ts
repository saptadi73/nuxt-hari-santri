import type { useApi, ApiResponse } from '~/composables/useApi';

export type ActivityType = 'CYCLING' | 'FAMILY_WALK';

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

export interface HariSantriTicket {
  ticket_id: string;
  ticket_number: string;
  participant_name: string;
  activity_type: ActivityType;
  status: string;
  qr_token: string;
  issued_at: string;
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

  const getMyTickets = () =>
    api<ApiResponse<HariSantriTicket[]>>('/hari-santri/me/tickets');

  const checkinTicket = (qrToken: string) =>
    api<ApiResponse<HariSantriCheckinResult>>('/hari-santri/staff/checkins', { method: 'POST', body: { qr_token: qrToken } });

  const submitBazaarApplication = (payload: BazaarApplicationInput) =>
    api<ApiResponse<BazaarApplicationRecord>>('/bazaar/applications', { method: 'POST', body: payload });

  const getMyBazaarApplications = () =>
    api<ApiResponse<BazaarApplicationRecord[]>>('/bazaar/me/applications');

  return { getShirtSizes, getAdminShirtSizes, createShirtSize, updateShirtSize, saveParticipants, getParticipants, createCheckout, getPaymentStatus, getMyTickets, checkinTicket, submitBazaarApplication, getMyBazaarApplications };
}
