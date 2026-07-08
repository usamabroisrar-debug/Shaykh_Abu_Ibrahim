"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import styles from "./AuthForms.module.css";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const hasToken = Boolean(token.trim());
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (!hasToken) {
      setIsLoading(false);
      setError("Reset token missing hai. Forgot password page se naya link generate karein.");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Reset failed.");
        return;
      }

      setMessage(data.message);
      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch {
      setError("Password reset is waqt complete nahi ho saka. Dobara try karein.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="reset-token">Reset token</label>
        <input id="reset-token" value={token} readOnly />
      </div>

      <div className={styles.field}>
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          required
        />
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button
        type="submit"
        className={styles.submit}
        disabled={isLoading || !hasToken}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>

      <div className={styles.footer}>
        <Link href="/login">Back to login</Link>
      </div>
    </form>
  );
}
