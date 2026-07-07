"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import styles from "./AuthForms.module.css";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    setResetUrl("");

    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.message || "Could not start reset flow.");
      return;
    }

    setMessage(data.message);
    if (data.resetUrl) {
      setResetUrl(data.resetUrl);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="student@example.com"
          required
        />
      </div>

      {message ? (
        <div className={styles.message}>
          {message}{" "}
          {resetUrl ? (
            <Link className={styles.inlineLink} href={resetUrl}>
              Open reset page
            </Link>
          ) : null}
        </div>
      ) : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit}>
        {isLoading ? "Preparing reset..." : "Generate Reset Link"}
      </Button>

      <div className={styles.footer}>
        <Link href="/login">Back to login</Link>
      </div>
    </form>
  );
}
