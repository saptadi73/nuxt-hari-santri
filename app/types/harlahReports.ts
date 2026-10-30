export interface HarlahReportSummary {
  total_records: number;
  paid_records: number;
  pending_records: number;
  failed_records: number;
  total_paid: number;
  currency: string;
}

export interface HarlahFinanceItem {
  id: string;
  event_id?: string | null;
  event_name?: string | null;
  reference_id: string;
  payment_no?: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string | null;
  created_at: string;
  donor_name?: string;
  donor_email?: string;
  order_id?: string;
  order_number?: string;
  order_status?: string;
  customer_name?: string;
  customer_email?: string;
}

export interface HarlahFinanceReport {
  summary: HarlahReportSummary;
  items: HarlahFinanceItem[];
}
