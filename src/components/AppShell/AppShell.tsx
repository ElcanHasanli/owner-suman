"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./AppShell.module.css";

const navItems = [
  { href: "/live", label: "Canlı" },
  { href: "/", label: "Dashboard" },
  { href: "/companies", label: "Şirkətlər" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>S</span>
          <div>
            <strong>SUMAN</strong>
            <span>Owner Panel</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? styles.navActive : styles.navLink}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.userBlock}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            Çıxış
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
