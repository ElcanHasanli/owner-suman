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
