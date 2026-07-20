"use client";

import { useState } from "react";

export function PaymentCheckoutButton({ courseId }: { courseId: string }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function startCheckout() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.checkoutUrl) {
        setMessage(payload.error || "Payment checkout is not available right now.");
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setMessage("Payment checkout could not be started. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={startCheckout} disabled={isLoading}>
        {isLoading ? "Starting checkout..." : "Pay online"}
      </button>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
