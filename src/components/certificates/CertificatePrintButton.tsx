"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type CertificatePrintButtonProps = {
  href?: string;
};

const buttonStyle = {
  display: "inline-flex",
  minHeight: "44px",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(6, 78, 59, 0.22)",
  borderRadius: "999px",
  padding: "0 18px",
  background: "#ffffff",
  color: "#064e3b",
  font: "inherit",
  fontWeight: 900,
  textDecoration: "none",
  cursor: "pointer",
} satisfies CSSProperties;

export function CertificatePrintButton({ href }: CertificatePrintButtonProps) {
  if (href) {
    return (
      <Link href={href} style={buttonStyle}>
        Download Certificate PDF
      </Link>
    );
  }

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={() => {
        window.print();
      }}
    >
      Print / Save PDF
    </button>
  );
}
