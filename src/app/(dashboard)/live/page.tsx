"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge/Badge";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { StatsCard } from "@/components/StatsCard/StatsCard";
import { ownerApi } from "@/lib/api";
import {
  eventDedupeKey,
  formatMoney,
  formatMoneyAz,
} from "@/lib/format";
import type {
  LiveCompanyRow,
  LiveFeedEvent,
  LiveOverviewResponse,
  LivePeriod,
} from "@/types";
import shared from "@/styles/shared.module.css";
import live from "@/styles/live.module.css";

const PERIODS: { value: LivePeriod; label: string }[] = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dünən" },
  { value: "week", label: "Həftə" },
  { value: "month", label: "Ay" },
];

const LIVE_POLL_MS = 20_000;
const FEED_POLL_MS = 12_000;
const FEED_MAX = 80;

function eventTypeLabel(type: string): string {
  switch (type) {
    case "order_created":
      return "Yeni";
    case "order_assigned":
      return "Təyin";
    case "order_completed":
      return "Tamam";
    case "order_updated":
      return "Yeniləndi";
    case "expense_created":
      return "Xərc";
    case "debt_collected":
      return "Borc";
    case "warehouse_updated":
      return "Anbar";
    default:
      return type;
  }
}

function eventTypeClass(type: string): string {
  if (type === "order_completed") return live.typeDone;
  if (type.startsWith("order_")) return live.typeOrder;
  if (type === "expense_created") return live.typeExpense;
  if (type === "debt_collected") return live.typeDebt;
  return live.typeBadge;
}

function mergeFeed(
  prev: LiveFeedEvent[],
  incoming: LiveFeedEvent[],
): LiveFeedEvent[] {
  const map = new Map<string, LiveFeedEvent>();
  for (const e of [...incoming, ...prev]) {
    map.set(eventDedupeKey(e), e);
  }
  return Array.from(map.values())
    .sort(
      (a, b) =>
        new Date(b.event_at).getTime() - new Date(a.event_at).getTime(),
    )
    .slice(0, FEED_MAX);
}

export default function LivePage() {
  const router = useRouter();
  const [period, setPeriod] = useState<LivePeriod>("today");
  const [overview, setOverview] = useState<LiveOverviewResponse | null>(null);
  const [events, setEvents] = useState<LiveFeedEvent[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const sinceRef = useRef<string | null>(null);
  const feedBootstrapped = useRef(false);

  const loadOverview = useCallback(async () => {
    try {
      const data = await ownerApi.getLive({ period });
      setOverview(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "İcmal yüklənmədi");
    } finally {
      setLoading(false);
    }
  }, [period]);

  function changePeriod(next: LivePeriod) {
    if (next === period) return;
    setLoading(true);
    setPeriod(next);
  }

  const loadFeed = useCallback(async (incremental: boolean) => {
    try {
      const data = await ownerApi.getLiveFeed({
        limit: 50,
        ...(incremental && sinceRef.current
          ? { since: sinceRef.current }
          : {}),
      });
      if (incremental && sinceRef.current) {
        setEvents((prev) => mergeFeed(prev, data.events));
      } else {
        setEvents(mergeFeed([], data.events));
        feedBootstrapped.current = true;
      }
      const newest = data.events[0]?.event_at || data.generated_at;
      if (newest) {
        const prev = sinceRef.current;
        if (!prev || new Date(newest) > new Date(prev)) {
          sinceRef.current = newest;
        }
      } else if (data.generated_at) {
        sinceRef.current = data.generated_at;
      }
    } catch {
      /* feed xətası icmalı bloklamır */
    }
  }, []);

  useEffect(() => {
    // Polling: first fetch + interval (setState inside async callbacks)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- live poll
    void loadOverview();
    const id = window.setInterval(() => {
      void loadOverview();
    }, LIVE_POLL_MS);
    return () => window.clearInterval(id);
  }, [loadOverview]);

  useEffect(() => {
    sinceRef.current = null;
    feedBootstrapped.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feed poll
    void loadFeed(false);
    const id = window.setInterval(() => {
      void loadFeed(feedBootstrapped.current);
    }, FEED_POLL_MS);
    return () => window.clearInterval(id);
  }, [loadFeed]);

  const totals = overview?.totals;
  const companies: LiveCompanyRow[] = overview?.companies ?? [];

  return (
    <div className={shared.page} style={{ maxWidth: 1280 }}>
      <PageHeader
        title="Canlı monitor"
        description="Bütün şirkətlərin günün icmalı və son əməliyyatlar (yalnız izləmə)"
        action={
          <Link href="/companies" className={shared.btnSecondary}>
            Şirkətlər
          </Link>
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
        <span className={live.liveDot}>
          Canlı · {overview?.generated_at
            ? new Date(overview.generated_at).toLocaleTimeString("az-AZ")
            : "…"}
        </span>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      {loading && !overview ? (
        <p className={shared.loadingText}>Yüklənir...</p>
      ) : (
        <div className={shared.statsGrid}>
          <StatsCard
            label="Aktiv sifariş"
            value={totals?.active_orders ?? 0}
          />
          <StatsCard
            label="Tamamlanan"
            value={totals?.completed_orders ?? 0}
          />
          <StatsCard label="Satış" value={formatMoneyAz(totals?.sales)} />
          <StatsCard
            label="Borc verilən"
            value={formatMoneyAz(totals?.debt_given)}
          />
          <StatsCard label="Kredit" value={formatMoneyAz(totals?.credit)} />
          <StatsCard label="Xərc" value={formatMoneyAz(totals?.expenses)} />
          <StatsCard
            label="Net balans"
            value={formatMoneyAz(totals?.net_balance)}
          />
        </div>
      )}

      <div className={live.layout}>
        <section className={shared.card}>
          <div className={shared.cardBody} style={{ paddingBottom: 0 }}>
            <h2 className={live.sectionTitle}>Şirkətlər</h2>
          </div>
          {companies.length === 0 ? (
            <p className={shared.empty}>Məlumat yoxdur</p>
          ) : (
            <div className={shared.tableWrap}>
              <table className={`${shared.table} ${live.tableClickable}`}>
                <thead>
                  <tr>
                    <th>Şirkət</th>
                    <th>Status</th>
                    <th>Aktiv</th>
                    <th>Tamam</th>
                    <th>Satış</th>
                    <th>Borc</th>
                    <th>Xərc</th>
                    <th>Net</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr
                      key={c.company_id}
                      onClick={() =>
                        router.push(`/companies/${c.company_id}/monitor`)
                      }
                    >
                      <td>
                        <strong>{c.company_name}</strong>
                      </td>
                      <td>
                        <Badge variant={c.is_active ? "success" : "danger"}>
                          {c.is_active ? "Aktiv" : "Deaktiv"}
                        </Badge>
                      </td>
                      <td>{c.active_orders}</td>
                      <td>{c.completed_orders}</td>
                      <td>{formatMoney(c.sales)}</td>
                      <td>{formatMoney(c.debt_given)}</td>
                      <td>{formatMoney(c.expenses)}</td>
                      <td>{formatMoney(c.net_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className={live.feedCard}>
          <div className={live.feedHeader}>
            <span>Son əməliyyatlar</span>
            <span className={live.muted}>{events.length}</span>
          </div>
          <div className={live.feedList}>
            {events.length === 0 ? (
              <p className={live.feedEmpty}>Hələ event yoxdur</p>
            ) : (
              events.map((e) => (
                <button
                  key={eventDedupeKey(e)}
                  type="button"
                  className={live.feedItem}
                  onClick={() =>
                    router.push(`/companies/${e.company_id}/monitor`)
                  }
                >
                  <div className={live.feedMeta}>
                    <span
                      className={`${live.typeBadge} ${eventTypeClass(e.type)}`}
                    >
                      {eventTypeLabel(e.type)}
                    </span>
                    <Badge variant="neutral">{e.company_name}</Badge>
                    <span className={live.feedTime}>{e.event_at_baku}</span>
                  </div>
                  <p className={live.feedMessage}>{e.message}</p>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
