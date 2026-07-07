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

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=/courses/${courseSlug}`);
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseSlug }),
    });

    setIsLoading(false);

    if (!response.ok) {
      router.push("/admission");
      return;
    }

    router.push("/student");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleClick} variant="primary">
      {isLoading ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
