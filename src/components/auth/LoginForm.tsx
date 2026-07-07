"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/shared";
import styles from "./AuthForms.module.css";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/student" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: nextPath,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError("Email ya password match nahi hua. Please dobara try karein.");
      return;
    }

    router.push(result.url || nextPath);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="student@example.com"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          required
        />
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit}>
        {isLoading ? "Signing in..." : "Login To Dashboard"}
      </Button>

      <div className={styles.footer}>
        <Link href="/forgot-password">Forgot password?</Link>
        <span>
          No account yet? <Link href="/register">Create one</Link>
        </span>
      </div>
    </form>
  );
}
