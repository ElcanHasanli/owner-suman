"use client";

import { FormEvent, useState } from "react";
import type { CompanyUser, CompanyUserStatus } from "@/types";
import styles from "./EditUserModal.module.css";

interface EditUserModalProps {
  open: boolean;
  user: CompanyUser | null;
  loading?: boolean;
  onSubmit: (body: {
    name: string;
    email: string;
    phone: string | null;
    role: "admin" | "courier";
    status: CompanyUserStatus;
    password?: string;
  }) => void;
  onCancel: () => void;
}

function EditUserForm({
  user,
  loading,
  onSubmit,
  onCancel,
}: {
  user: CompanyUser;
  loading: boolean;
  onSubmit: EditUserModalProps["onSubmit"];
  onCancel: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [role, setRole] = useState<"admin" | "courier">(user.role);
  const [status, setStatus] = useState<CompanyUserStatus>(
    user.status === "inactive" ? "inactive" : "active",
  );
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      role,
      status,
      ...(password ? { password } : {}),
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Rol
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "courier")}
        >
          <option value="admin">Admin</option>
          <option value="courier">Kuryer</option>
        </select>
      </label>

      <label className={styles.field}>
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CompanyUserStatus)}
        >
          <option value="active">Aktiv</option>
          <option value="inactive">Deaktiv</option>
        </select>
      </label>

      <label className={styles.field}>
        Ad
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        Telefon
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>

      <label className={styles.field}>
        Yeni şifrə (opsional)
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Boş saxla — dəyişməz"
          minLength={6}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          Ləğv et
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Saxlanılır..." : "Saxla"}
        </button>
      </div>
    </form>
  );
}

export function EditUserModal({
  open,
  user,
  loading = false,
  onSubmit,
  onCancel,
}: EditUserModalProps) {
  if (!open || !user) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h2 className={styles.title}>İstifadəçini redaktə et</h2>
        <p className={styles.subtitle}>{user.name}</p>
        <EditUserForm
          key={user.id}
          user={user}
          loading={loading}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
