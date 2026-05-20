import { clearAuth, getToken } from "./auth-storage";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearAuth();
      onUnauthorized?.();
    }
    const message =
      (data as { error?: string }).error || res.statusText || "Xəta baş verdi";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export const ownerApi = {
  getCompanies: () => api<import("@/types").Company[]>("/api/owner/companies"),
  getCompany: (id: number) =>
    api<import("@/types").Company>(`/api/owner/companies/${id}`),
  createCompany: (body: import("@/types").CreateCompanyPayload) =>
    api<import("@/types").Company>("/api/owner/companies", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCompany: (id: number, body: import("@/types").UpdateCompanyPayload) =>
    api<import("@/types").Company>(`/api/owner/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  regenerateLicense: (id: number) =>
    api<import("@/types").RegenerateLicenseResponse>(
      `/api/owner/companies/${id}/regenerate-license`,
      { method: "POST" },
    ),
  getCompanyUsers: (id: number) =>
    api<import("@/types").CompanyUser[]>(`/api/owner/companies/${id}/users`),
  createCompanyUser: (
    id: number,
    body: import("@/types").CreateCompanyUserPayload,
  ) =>
    api<import("@/types").CompanyUser>(`/api/owner/companies/${id}/users`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCompanyUser: (
    companyId: number,
    userId: number,
    body: import("@/types").UpdateCompanyUserBody,
  ) =>
    api<import("@/types").CompanyUser>(
      `/api/owner/companies/${companyId}/users/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    ),
  deleteCompanyUser: (companyId: number, userId: number) =>
    api<import("@/types").DeleteCompanyUserResponse>(
      `/api/owner/companies/${companyId}/users/${userId}`,
      { method: "DELETE" },
    ),
};

export const authApi = {
  login: (email: string, password: string) =>
    api<import("@/types").LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};
