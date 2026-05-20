import styles from "./Badge.module.css";

type BadgeVariant = "success" | "danger" | "neutral" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
  );
}
