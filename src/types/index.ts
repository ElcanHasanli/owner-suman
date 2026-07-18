export type UserRole = "owner" | "admin" | "courier";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  company_id: number | null;
  company_name: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface Company {
  id: number;
  name: string;
  license_code: string;
  is_active: boolean;
  license_expires_at: string | null;
  created_at: string;
  updated_at: string;
  admin_count?: number;
  courier_count?: number;
  customer_count?: number;
  order_count?: number;
}

export type CompanyUserStatus = "active" | "inactive";

export interface CompanyUser {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: "admin" | "courier";
  status: CompanyUserStatus | string;
  created_at: string;
}

export interface CreateCompanyPayload {
  name: string;
  is_active?: boolean;
  license_expires_at?: string | null;
}

export interface UpdateCompanyPayload {
  name?: string;
  is_active?: boolean;
  license_expires_at?: string | null;
}

export interface CreateCompanyUserPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "admin" | "courier";
}

export interface UpdateCompanyUserBody {
  email?: string;
  password?: string;
  name?: string;
  phone?: string | null;
  role?: "admin" | "courier";
  status?: CompanyUserStatus;
}

export interface DeleteCompanyUserResponse {
  message: string;
  user: CompanyUser;
}

export interface RegenerateLicenseResponse {
  license_code: string;
  message?: string;
}

export type LivePeriod = "today" | "yesterday" | "week" | "month" | "custom";

export interface LiveTotals {
  active_orders: number;
  completed_orders: number;
  sales: number;
  debt_given: number;
  credit: number;
  expenses: number;
  net_balance: number;
}

export interface LiveCompanyRow {
  company_id: number;
  company_name: string;
  is_active: boolean;
  active_orders: number;
  completed_orders: number;
  sales: number;
  debt_given: number;
  credit: number;
  prepaid?: number;
  courier_balance?: number;
  expenses: number;
  net_balance: number;
}

export interface LiveOverviewResponse {
  period: LivePeriod | string;
  startDate: string | null;
  endDate: string | null;
  generated_at: string;
  totals: LiveTotals;
  companies: LiveCompanyRow[];
}

export type LiveEventType =
  | "order_created"
  | "order_assigned"
  | "order_completed"
  | "order_updated"
  | "expense_created"
  | "debt_collected"
  | "warehouse_updated"
  | string;

export interface LiveFeedEvent {
  type: LiveEventType;
  company_id: number;
  company_name: string;
  entity_id: number;
  message: string;
  actor_name: string | null;
  amount: number | null;
  event_at: string;
  event_at_baku: string;
  meta?: Record<string, unknown>;
}

export interface LiveFeedResponse {
  generated_at: string;
  company_id: number | null;
  events: LiveFeedEvent[];
}

export interface CompanyMonitorResponse {
  company: {
    id: number;
    name: string;
    is_active: boolean;
    license_code?: string;
  };
  dashboard: Record<string, unknown>;
  by_courier: Array<Record<string, unknown>>;
  active_orders: Array<Record<string, unknown>>;
  completed_orders: Array<Record<string, unknown>>;
  expenses: Array<Record<string, unknown>>;
  debtPayments: Array<Record<string, unknown>>;
  warehouses: Array<Record<string, unknown>>;
  users: Array<{
    id: number;
    name: string;
    role: string;
    status: string;
  }>;
  counts: {
    active_orders: number;
    completed_orders: number;
    expenses: number;
    debt_payments: number;
  };
  generated_at?: string;
}
