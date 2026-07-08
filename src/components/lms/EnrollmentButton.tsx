"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/shared";

type EnrollmentButtonProps = {
  courseSlug: string;
  isAuthenticated: boolean;
};

export function EnrollmentButton({
  courseSlug,
  isAuthenticated,
}: EnrollmentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleClick() {
    setMessage("");
    setError("");

    if (!isAuthenticated) {
      router.push(`/login?next=/courses/${courseSlug}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?next=/courses/${courseSlug}`);
          return;
        }

        setError(
          data.message || "Enrollment complete nahi ho saka. Dobara try karein.",
        );
        return;
      }

      setMessage(data.message || "Enrollment completed successfully.");
      router.push("/student");
      router.refresh();
    } catch {
      setError("Network issue ki wajah se enrollment complete nahi ho saka.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? "Enrolling..." : "Enroll Now"}
      </Button>
      {message ? <div style={{ marginTop: "12px", color: "#166534" }}>{message}</div> : null}
      {error ? <div style={{ marginTop: "12px", color: "#991b1b" }}>{error}</div> : null}
    </>
  );
}
