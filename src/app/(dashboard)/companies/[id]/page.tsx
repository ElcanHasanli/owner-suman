"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/Badge/Badge";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { CopyButton } from "@/components/CopyButton/CopyButton";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ownerApi } from "@/lib/api";
import { dateInputToIso, formatDate, toDateInputValue } from "@/lib/format";
import type { Company } from "@/types";
import shared from "@/styles/shared.module.css";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRegenModal, setShowRegenModal] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    ownerApi
      .getCompany(id)
      .then((c) => {
        setCompany(c);
        setName(c.name);
        setIsActive(c.is_active);
        setExpiresAt(toDateInputValue(c.license_expires_at));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!company) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await ownerApi.updateCompany(company.id, {
        name: name.trim(),
        is_active: isActive,
        license_expires_at: dateInputToIso(expiresAt),
      });
      setCompany(updated);
      setSuccess("Dəyişikliklər saxlanıldı");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate() {
    if (!company) return;
    setRegenerating(true);
    setError("");
    setSuccess("");
    try {
      const res = await ownerApi.regenerateLicense(company.id);
      setCompany({ ...company, license_code: res.license_code });
      setSuccess("Yeni lisenziya kodu yaradıldı");
      setShowRegenModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return <p className={shared.loadingText}>Yüklənir...</p>;
  }

  if (!company) {
    return (
      <div className={shared.page}>
        <p className={shared.error}>{error || "Şirkət tapılmadı"}</p>
        <Link href="/companies" className={shared.btnSecondary}>
          Geri
        </Link>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <PageHeader
        title={company.name}
        description={`ID: ${company.id}`}
        action={
          <Link
            href={`/companies/${company.id}/users`}
            className={shared.btnPrimary}
          >
            İstifadəçilər
          </Link>
        }
      />

      {error && <p className={shared.error}>{error}</p>}
      {success && <p className={shared.success}>{success}</p>}

      <div className={shared.metaGrid}>
        <div className={shared.metaItem}>
          <span>Status</span>
          <Badge variant={company.is_active ? "success" : "danger"}>
            {company.is_active ? "Aktiv" : "Deaktiv"}
          </Badge>
        </div>
        <div className={shared.metaItem}>
          <span>Admin</span>
          <strong>{company.admin_count ?? 0}</strong>
        </div>
        <div className={shared.metaItem}>
          <span>Kuryer</span>
          <strong>{company.courier_count ?? 0}</strong>
        </div>
        <div className={shared.metaItem}>
          <span>Müştəri</span>
          <strong>{company.customer_count ?? 0}</strong>
        </div>
        <div className={shared.metaItem}>
          <span>Sifariş</span>
          <strong>{company.order_count ?? 0}</strong>
        </div>
        <div className={shared.metaItem}>
          <span>Yaradılma</span>
          <strong>{formatDate(company.created_at)}</strong>
        </div>
      </div>

      <section className={shared.card}>
        <div className={shared.cardBody}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Lisenziya kodu</h2>
          <div className={shared.licenseBox}>
            <span className={shared.licenseCode}>{company.license_code}</span>
            <CopyButton value={company.license_code} />
            <button
              type="button"
              className={shared.btnDanger}
              onClick={() => setShowRegenModal(true)}
            >
              Yenilə
            </button>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            Admin və kuryer login üçün bu kodu istifadə edirlər.
          </p>
        </div>
      </section>

      <section className={shared.card} style={{ marginTop: "1rem" }}>
        <div className={shared.cardBody}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>Redaktə</h2>
          <form className={shared.form} onSubmit={handleSave}>
            <div className={shared.field}>
              <label htmlFor="name">Şirkət adı</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={shared.checkboxRow}>
              <input
                id="is_active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="is_active">Aktiv</label>
            </div>

            <div className={shared.field}>
              <label htmlFor="expires">Lisenziya bitmə tarixi</label>
              <input
                id="expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div className={shared.actions}>
              <button
                type="submit"
                className={shared.btnPrimary}
                disabled={saving}
              >
                {saving ? "Saxlanılır..." : "Saxla"}
              </button>
              <Link href="/companies" className={shared.btnSecondary}>
                Geri
              </Link>
            </div>
          </form>
        </div>
      </section>

      <ConfirmModal
        open={showRegenModal}
        title="Lisenziya kodunu yenilə?"
        message="Köhnə lisenziya kodu işləməyəcək. Admin və kuryerlər yeni kodla daxil olmalıdır."
        confirmLabel="Yenilə"
        danger
        loading={regenerating}
        onConfirm={handleRegenerate}
        onCancel={() => setShowRegenModal(false)}
      />
    </div>
  );
}
