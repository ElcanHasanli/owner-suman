"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/Badge/Badge";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { EditUserModal } from "@/components/EditUserModal/EditUserModal";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ownerApi } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { CompanyUser, CompanyUserStatus } from "@/types";
import shared from "@/styles/shared.module.css";

export default function CompanyUsersPage() {
  const params = useParams();
  const id = Number(params.id);

  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState<CompanyUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"admin" | "courier">("admin");

  async function fetchUsers() {
    if (!id || Number.isNaN(id)) return;
    const data = await ownerApi.getCompanyUsers(id);
    setUsers(data);
  }

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    let cancelled = false;
    ownerApi
      .getCompanyUsers(id)
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    clearMessages();
    setSubmitting(true);
    try {
      await ownerApi.createCompanyUser(id, {
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim() || undefined,
        role,
      });
      setSuccess("İstifadəçi yaradıldı");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setRole("admin");
      setShowForm(false);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSubmit(body: {
    name: string;
    email: string;
    phone: string | null;
    role: "admin" | "courier";
    status: CompanyUserStatus;
    password?: string;
  }) {
    if (!editingUser) return;
    clearMessages();
    setEditLoading(true);
    try {
      const updated = await ownerApi.updateCompanyUser(
        id,
        editingUser.id,
        body,
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u)),
      );
      setSuccess("İstifadəçi yeniləndi");
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    clearMessages();
    setDeleteLoading(true);
    try {
      await ownerApi.deleteCompanyUser(id, deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setSuccess("İstifadəçi silindi");
      setDeletingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleStatusChange(
    user: CompanyUser,
    status: CompanyUserStatus,
  ) {
    if (user.status === status) return;
    clearMessages();
    setStatusUpdatingId(user.id);
    try {
      const updated = await ownerApi.updateCompanyUser(id, user.id, {
        status,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u)),
      );
      setSuccess("Status yeniləndi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div className={shared.page}>
      <PageHeader
        title="Şirkət istifadəçiləri"
        description="Admin və kuryer hesabları"
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={shared.btnPrimary}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Bağla" : "Yeni istifadəçi"}
            </button>
            <Link href={`/companies/${id}`} className={shared.btnSecondary}>
              Geri
            </Link>
          </div>
        }
      />

      {error && <p className={shared.error}>{error}</p>}
      {success && <p className={shared.success}>{success}</p>}

      {showForm && (
        <section className={shared.card} style={{ marginBottom: "1rem" }}>
          <div className={shared.cardBody}>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
              Yeni istifadəçi
            </h2>
            <form className={shared.form} onSubmit={handleCreate}>
              <div className={shared.field}>
                <label htmlFor="role">Rol</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "courier")
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="courier">Kuryer</option>
                </select>
              </div>

              <div className={shared.field}>
                <label htmlFor="name">Ad</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={shared.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={shared.field}>
                <label htmlFor="password">Şifrə</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className={shared.field}>
                <label htmlFor="phone">Telefon (opsional)</label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className={shared.btnPrimary}
                disabled={submitting}
              >
                {submitting ? "Yaradılır..." : "Yarat"}
              </button>
            </form>
          </div>
        </section>
      )}

      <section className={shared.card}>
        {loading ? (
          <p className={shared.loadingText}>Yüklənir...</p>
        ) : users.length === 0 ? (
          <p className={shared.empty}>İstifadəçi yoxdur</p>
        ) : (
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Status</th>
                  <th>Yaradılma</th>
                  <th>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      {u.phone && (
                        <div style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          {u.phone}
                        </div>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <Badge
                        variant={u.role === "admin" ? "success" : "neutral"}
                      >
                        {u.role === "admin" ? "Admin" : "Kuryer"}
                      </Badge>
                    </td>
                    <td>
                      <select
                        className={shared.statusSelect}
                        value={u.status === "inactive" ? "inactive" : "active"}
                        disabled={statusUpdatingId === u.id}
                        onChange={(e) =>
                          handleStatusChange(
                            u,
                            e.target.value as CompanyUserStatus,
                          )
                        }
                        aria-label={`${u.name} statusu`}
                      >
                        <option value="active">Aktiv</option>
                        <option value="inactive">Deaktiv</option>
                      </select>
                    </td>
                    <td>{formatDateTime(u.created_at)}</td>
                    <td>
                      <div className={shared.tableActions}>
                        <button
                          type="button"
                          className={shared.linkBtn}
                          onClick={() => {
                            clearMessages();
                            setEditingUser(u);
                          }}
                        >
                          Redaktə
                        </button>
                        <span aria-hidden>·</span>
                        <button
                          type="button"
                          className={shared.linkBtnDanger}
                          onClick={() => {
                            clearMessages();
                            setDeletingUser(u);
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <EditUserModal
        open={!!editingUser}
        user={editingUser}
        loading={editLoading}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditingUser(null)}
      />

      <ConfirmModal
        open={!!deletingUser}
        title="İstifadəçini sil?"
        message={
          deletingUser
            ? `«${deletingUser.name}» (${deletingUser.email}) hesabı silinəcək. Bu əməliyyat geri qaytarıla bilməz.`
            : ""
        }
        confirmLabel="Sil"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
}
