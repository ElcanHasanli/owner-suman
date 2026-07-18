"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/Badge/Badge";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { StatsCard } from "@/components/StatsCard/StatsCard";
import { ownerApi } from "@/lib/api";
import {
  formatMoney,
  formatMoneyAz,
  nestNumber,
  rowField,
} from "@/lib/format";
import type { CompanyMonitorResponse, LivePeriod } from "@/types";
import shared from "@/styles/shared.module.css";
import live from "@/styles/live.module.css";

const PERIODS: { value: LivePeriod; label: string }[] = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dünən" },
  { value: "week", label: "Həftə" },
  { value: "month", label: "Ay" },
];

const MONITOR_POLL_MS = 30_000;

type TabId =
  | "active"
  | "completed"
  | "expenses"
  | "debts"
  | "warehouses"
  | "couriers"
  | "users";

function dashboardCards(dashboard: Record<string, unknown>) {
  return [
    {
      label: "Satış",
      value: formatMoneyAz(
        nestNumber(dashboard, ["sales", "total"]) ||
          nestNumber(dashboard, ["sales"]),
      ),
    },
    {
      label: "Borc verilən",
      value: formatMoneyAz(
        nestNumber(dashboard, ["debt_given", "total"]) ||
          nestNumber(dashboard, ["debt_given"]),
      ),
    },
    {
      label: "Kredit",
      value: formatMoneyAz(
        nestNumber(dashboard, ["credit", "total"]) ||
          nestNumber(dashboard, ["credit"]),
      ),
    },
    {
      label: "Öncədən ödəniş",
      value: formatMoneyAz(
        nestNumber(dashboard, ["prepaid", "total"]) ||
          nestNumber(dashboard, ["prepaid"]),
      ),
    },
    {
      label: "Kuryer balansı",
      value: formatMoneyAz(
        nestNumber(dashboard, ["courier_balance", "total"]) ||
          nestNumber(dashboard, ["courier_balance"]),
      ),
    },
    {
      label: "Xərclər",
      value: formatMoneyAz(
        nestNumber(dashboard, ["expenses", "total"]) ||
          nestNumber(dashboard, ["expenses"]),
      ),
    },
    {
      label: "Net balans",
      value: formatMoneyAz(
        nestNumber(dashboard, ["net_balance", "total"]) ||
          nestNumber(dashboard, ["net_balance"]),
      ),
    },
  ];
}

export default function CompanyMonitorPage() {
  const params = useParams();
  const id = Number(params.id);

  const [period, setPeriod] = useState<LivePeriod>("today");
  const [data, setData] = useState<CompanyMonitorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabId>("active");

  const load = useCallback(async () => {
    if (!id || Number.isNaN(id)) return;
    try {
      const res = await ownerApi.getCompanyMonitor(id, { period });
      setData(res);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Monitor yüklənmədi");
    } finally {
      setLoading(false);
    }
  }, [id, period]);

  function changePeriod(next: LivePeriod) {
    if (next === period) return;
    setLoading(true);
    setPeriod(next);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- monitor poll
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, MONITOR_POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  if (loading && !data) {
    return <p className={shared.loadingText}>Yüklənir...</p>;
  }

  if (!data && error) {
    return (
      <div className={shared.page}>
        <p className={shared.error}>{error}</p>
        <Link href="/live" className={shared.btnSecondary}>
          Canlıya qayıt
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const cards = dashboardCards(data.dashboard ?? {});
  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "active", label: "Aktiv", count: data.counts?.active_orders ?? 0 },
    {
      id: "completed",
      label: "Tamamlanan",
      count: data.counts?.completed_orders ?? 0,
    },
    { id: "expenses", label: "Xərclər", count: data.counts?.expenses ?? 0 },
    {
      id: "debts",
      label: "Borc ödəniş",
      count: data.counts?.debt_payments ?? 0,
    },
    {
      id: "warehouses",
      label: "Anbar",
      count: data.warehouses?.length ?? 0,
    },
    {
      id: "couriers",
      label: "Kuryer üzrə",
      count: data.by_courier?.length ?? 0,
    },
    { id: "users", label: "İstifadəçilər", count: data.users?.length ?? 0 },
  ];

  let rows: Array<Record<string, unknown>> = [];
  if (tab === "active") rows = data.active_orders ?? [];
  else if (tab === "completed") rows = data.completed_orders ?? [];
  else if (tab === "expenses") rows = data.expenses ?? [];
  else if (tab === "debts") rows = data.debtPayments ?? [];
  else if (tab === "warehouses") rows = data.warehouses ?? [];
  else if (tab === "couriers") rows = data.by_courier ?? [];

  return (
    <div className={shared.page} style={{ maxWidth: 1280 }}>
      <PageHeader
        title={data.company.name}
        description="Şirkət monitoru — yalnız oxuma"
        action={
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link href="/live" className={shared.btnSecondary}>
              Canlı
            </Link>
            <Link
              href={`/companies/${id}`}
              className={shared.btnSecondary}
            >
              Detal
            </Link>
            <Link
              href={`/companies/${id}/users`}
              className={shared.btnPrimary}
            >
              İstifadəçilər
            </Link>
          </div>
        }
      />

      <div className={live.periodBar}>
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            className={
              period === p.value ? live.periodBtnActive : live.periodBtn
            }
            onClick={() => changePeriod(p.value)}
          >
            {p.label}
          </button>
        ))}
        <Badge variant={data.company.is_active ? "success" : "danger"}>
          {data.company.is_active ? "Aktiv" : "Deaktiv"}
        </Badge>
        <span className={live.liveDot}>
          Yenilənir ·{" "}
          {data.generated_at
            ? new Date(data.generated_at).toLocaleTimeString("az-AZ")
            : "30 s"}
        </span>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={live.monitorGrid}>
        {cards.map((c) => (
          <StatsCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <div className={live.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? live.tabActive : live.tab}
            onClick={() => setTab(t.id)}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <section className={shared.card}>
        {tab === "users" ? (
          data.users?.length ? (
            <div className={shared.tableWrap}>
              <table className={shared.table}>
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Rol</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td>{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={shared.empty}>İstifadəçi yoxdur</p>
          )
        ) : rows.length === 0 ? (
          <p className={shared.empty}>Məlumat yoxdur</p>
        ) : (
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  {tab === "couriers" ? (
                    <>
                      <th>Kuryer</th>
                      <th>Satış</th>
                      <th>Sifariş</th>
                      <th>Xərc</th>
                    </>
                  ) : tab === "warehouses" ? (
                    <>
                      <th>Ad / Kuryer</th>
                      <th>Məlumat</th>
                    </>
                  ) : tab === "expenses" || tab === "debts" ? (
                    <>
                      <th>Təsvir</th>
                      <th>Məbləğ</th>
                      <th>Tarix</th>
                    </>
                  ) : (
                    <>
                      <th>ID</th>
                      <th>Müştəri / Status</th>
                      <th>Məbləğ</th>
                      <th>Kuryer</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const key =
                    Number(row.id) ||
                    Number(row.order_id) ||
                    Number(row.courier_id) ||
                    idx;
                  if (tab === "couriers") {
                    return (
                      <tr key={key}>
                        <td>
                          {rowField(row, [
                            "courier_name",
                            "name",
                            "courier",
                          ])}
                        </td>
                        <td>
                          {formatMoney(
                            Number(row.sales ?? row.total_sales ?? 0),
                          )}
                        </td>
                        <td>
                          {String(
                            row.orders ??
                              row.order_count ??
                              row.completed_orders ??
                              "—",
                          )}
                        </td>
                        <td>
                          {formatMoney(Number(row.expenses ?? 0))}
                        </td>
                      </tr>
                    );
                  }
                  if (tab === "warehouses") {
                    return (
                      <tr key={key}>
                        <td>
                          {rowField(row, [
                            "courier_name",
                            "name",
                            "title",
                          ])}
                        </td>
                        <td className={live.muted}>
                          {rowField(row, [
                            "summary",
                            "note",
                            "updated_at",
                            "status",
                          ])}
                        </td>
                      </tr>
                    );
                  }
                  if (tab === "expenses" || tab === "debts") {
                    return (
                      <tr key={key}>
                        <td>
                          {rowField(row, [
                            "description",
                            "note",
                            "customer_name",
                            "type",
                          ])}
                        </td>
                        <td>
                          {formatMoney(
                            Number(row.amount ?? row.total ?? 0),
                          )}
                        </td>
                        <td>
                          {rowField(row, [
                            "created_at",
                            "paid_at",
                            "date",
                          ])}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={key}>
                      <td>
                        {rowField(row, ["id", "order_id"], String(key))}
                      </td>
                      <td>
                        {rowField(row, [
                          "customer_name",
                          "customer",
                          "status",
                        ])}
                      </td>
                      <td>
                        {formatMoney(
                          Number(
                            row.amount ??
                              row.total ??
                              row.price ??
                              0,
                          ),
                        )}
                      </td>
                      <td>
                        {rowField(row, [
                          "courier_name",
                          "courier",
                          "assigned_to",
                        ])}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
