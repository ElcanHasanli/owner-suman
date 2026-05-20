"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/Badge/Badge";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ownerApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Company } from "@/types";
import shared from "@/styles/shared.module.css";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ownerApi
      .getCompanies()
      .then(setCompanies)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={shared.page}>
      <PageHeader
        title="Şirkətlər"
        description="Platforma qoşulmuş bütün şirkətlər"
        action={
          <Link href="/companies/new" className={shared.btnPrimary}>
            Yeni şirkət
          </Link>
        }
      />

      {error && <p className={shared.error}>{error}</p>}

      <section className={shared.card}>
        {loading ? (
          <p className={shared.loadingText}>Yüklənir...</p>
        ) : companies.length === 0 ? (
          <p className={shared.empty}>Şirkət tapılmadı</p>
        ) : (
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Lisenziya</th>
                  <th>Status</th>
                  <th>Admin</th>
                  <th>Kuryer</th>
                  <th>Müştəri</th>
                  <th>Sifariş</th>
                  <th>Bitmə tarixi</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/companies/${c.id}`}>{c.name}</Link>
                    </td>
                    <td>
                      <code>{c.license_code}</code>
                    </td>
                    <td>
                      <Badge variant={c.is_active ? "success" : "danger"}>
                        {c.is_active ? "Aktiv" : "Deaktiv"}
                      </Badge>
                    </td>
                    <td>{c.admin_count ?? 0}</td>
                    <td>{c.courier_count ?? 0}</td>
                    <td>{c.customer_count ?? 0}</td>
                    <td>{c.order_count ?? 0}</td>
                    <td>{formatDate(c.license_expires_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
