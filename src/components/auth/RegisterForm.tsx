"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/shared";
import styles from "./AuthForms.module.css";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    timezone: "Asia/Karachi",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    setMessage("Account created. Signing you in now...");

    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: form.role === "TEACHER" ? "/teacher" : "/student",
    });

    router.push(signInResult?.url || (form.role === "TEACHER" ? "/teacher" : "/student"));
    router.refresh();
  }

  const needsGuardian = form.role === "STUDENT" || form.role === "PARENT";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Muhammad Ahmed"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-role">Register as</label>
          <select
            id="register-role"
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
          >
            <option value="STUDENT">Student</option>
            <option value="PARENT">Parent</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="student@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-phone">Phone / WhatsApp</label>
          <input
            id="register-phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+92..."
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-timezone">Timezone</label>
          <input
            id="register-timezone"
            value={form.timezone}
            onChange={(event) => updateField("timezone", event.target.value)}
            placeholder="Asia/Karachi"
          />
        </div>
      </div>

      {needsGuardian ? (
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="guardian-name">Guardian name</label>
            <input
              id="guardian-name"
              value={form.guardianName}
              onChange={(event) => updateField("guardianName", event.target.value)}
              placeholder="Parent / guardian"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="guardian-phone">Guardian phone</label>
            <input
              id="guardian-phone"
              value={form.guardianPhone}
              onChange={(event) => updateField("guardianPhone", event.target.value)}
              placeholder="+92..."
            />
          </div>
        </div>
      ) : null}

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className={styles.footer}>
        <span>
          Already have an account? <Link href="/login">Login</Link>
        </span>
      </div>
    </form>
  );
}
