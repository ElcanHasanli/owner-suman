"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/CopyButton/CopyButton";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ownerApi } from "@/lib/api";
import { dateInputToIso } from "@/lib/format";
import type { Company } from "@/types";
import shared from "@/styles/shared.module.css";

export default function NewCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Company | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const company = await ownerApi.createCompany({
        name: name.trim(),
        is_active: isActive,
        license_expires_at: dateInputToIso(expiresAt),
      });
      setCreated(company);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className={shared.page}>
        <PageHeader title="Şirkət yaradıldı" />
        <p className={shared.success}>
          <strong>{created.name}</strong> uğurla əlavə edildi. Lisenziya kodunu
          müştəriyə verin.
        </p>
        <div className={shared.licenseBox}>
          <span className={shared.licenseCode}>{created.license_code}</span>
          <CopyButton value={created.license_code} />
        </div>
        <div className={shared.actions}>
          <Link href={`/companies/${created.id}`} className={shared.btnPrimary}>
            Şirkət detalları
          </Link>
          <button
            type="button"
            className={shared.btnSecondary}
            onClick={() => router.push("/companies")}
          >
            Şirkətlər siyahısı
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <PageHeader
        title="Yeni şirkət"
        description="Yeni müştəri şirkəti yaradın"
      />

      {error && <p className={shared.error}>{error}</p>}

      <section className={shared.card}>
        <div className={shared.cardBody}>
          <form className={shared.form} onSubmit={handleSubmit}>
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
              <label htmlFor="expires">Lisenziya bitmə tarixi (opsional)</label>
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
                disabled={submitting}
              >
                {submitting ? "Yaradılır..." : "Yarat"}
              </button>
              <Link href="/companies" className={shared.btnSecondary}>
                Ləğv et
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
