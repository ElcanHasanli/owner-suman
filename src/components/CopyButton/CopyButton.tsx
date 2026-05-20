"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = "Kopyala" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={styles.btn} onClick={handleCopy}>
      {copied ? "Kopyalandı" : label}
    </button>
  );
}
