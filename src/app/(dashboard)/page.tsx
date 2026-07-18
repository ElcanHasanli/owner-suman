"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { StatsCard } from "@/components/StatsCard/StatsCard";
import { ownerApi } from "@/lib/api";
import type { Company } from "@/types";
import shared from "@/styles/shared.module.css";

export default function DashboardPage() {
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

  const active = companies.filter((c) => c.is_active).length;
  const totalOrders = companies.reduce((s, c) => s + (c.order_count ?? 0), 0);
  const totalCustomers = companies.reduce(
    (s, c) => s + (c.customer_count ?? 0),
    0,
  );

  return (
    <div className={shared.page}>
      <PageHeader
        title="Dashboard"
        description="Platform üzrə ümumi statistika"
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href="/live" className={shared.btnPrimary}>
              Canlı monitor
            </Link>
            <Link href="/companies/new" className={shared.btnSecondary}>
              Yeni şirkət
            </Link>
          </div>
        }
      />

      {error && <p className={shared.error}>{error}</p>}

      {loading ? (
        <p className={shared.loadingText}>Yüklənir...</p>
      ) : (
        <>
          <div className={shared.statsGrid}>
            <StatsCard label="Ümumi şirkət" value={companies.length} />
            <StatsCard label="Aktiv şirkət" value={active} />
            <StatsCard label="Müştərilər" value={totalCustomers} />
            <StatsCard label="Sifarişlər" value={totalOrders} />
          </div>

          <section className={shared.card}>
            <div className={shared.cardBody}>
              <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
                Son şirkətlər
              </h2>
              {companies.length === 0 ? (
                <p className={shared.empty}>Hələ şirkət yoxdur</p>
              ) : (
                <div className={shared.tableWrap}>
                  <table className={shared.table}>
                    <thead>
                      <tr>
                        <th>Ad</th>
                        <th>Status</th>
                        <th>Sifariş</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.slice(0, 5).map((c) => (
                        <tr key={c.id}>
                          <td>
                            <Link href={`/companies/${c.id}`}>{c.name}</Link>
                          </td>
                          <td>{c.is_active ? "Aktiv" : "Deaktiv"}</td>
                          <td>{c.order_count ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {companies.length > 0 && (
                <p style={{ marginTop: "1rem" }}>
                  <Link href="/companies">Bütün şirkətlər →</Link>
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
