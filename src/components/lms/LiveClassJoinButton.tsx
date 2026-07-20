"use client";

import { useState, useTransition } from "react";

export function LiveClassJoinButton({ sessionId }: { sessionId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function joinClass() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(payload.message || "Live class could not be opened.");
        return;
      }

      if (payload.livekitUrl && String(payload.livekitUrl).startsWith("http")) {
        window.open(`${payload.livekitUrl}?token=${encodeURIComponent(payload.token)}`, "_blank");
        return;
      }

      setMessage("LiveKit URL is not configured yet. Ask admin to add NEXT_PUBLIC_LIVEKIT_URL.");
    });
  }

  return (
    <span>
      <button type="button" onClick={joinClass} disabled={isPending}>
        {isPending ? "Preparing..." : "Join live class"}
      </button>
      {message ? <small>{message}</small> : null}
    </span>
  );
}
