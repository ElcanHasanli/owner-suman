import styles from "./StatsCard.module.css";

interface StatsCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      {hint && <span className={styles.hint}>{hint}</span>}
    </article>
  );
}
