"use client";

import { Button } from "@/components/shared";

export function CertificatePrintButton() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        window.print();
      }}
    >
      Print / Save PDF
    </Button>
  );
}
