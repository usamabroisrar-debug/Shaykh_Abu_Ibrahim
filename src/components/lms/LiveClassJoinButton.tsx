"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LiveClassJoinButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function joinClass() {
    startTransition(() => {
      router.push(`/live-class/${sessionId}`);
    });
  }

  return (
    <span>
      <button type="button" onClick={joinClass} disabled={isPending}>
        {isPending ? "Opening..." : "Join live class"}
      </button>
    </span>
  );
}
