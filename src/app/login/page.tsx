"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = searchParams.get("from") || "/";
      router.replace(from);
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş uğursuz oldu");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || isAuthenticated) {
    return <div className={styles.centered}>Yüklənir...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.icon}>S</span>
          <div>
            <h1>SUMAN</h1>
            <p>Owner Panel</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.field}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            Şifrə
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Giriş edilir..." : "Daxil ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
