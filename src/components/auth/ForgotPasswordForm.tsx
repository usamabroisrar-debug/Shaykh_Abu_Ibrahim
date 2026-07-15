"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import type { SiteLocale } from "@/lib/locale";
import styles from "./AuthForms.module.css";

type ForgotPasswordFormProps = {
  locale: SiteLocale;
};

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const copy = {
    en: {
      failed: "Could not start reset flow.",
      networkError: "Could not start reset flow. Please check your connection.",
      email: "Email address",
      openReset: "Open reset page",
      preparing: "Preparing reset...",
      submit: "Generate Reset Link",
      back: "Back to login",
    },
    ur: {
      failed: "ری سیٹ عمل شروع نہیں ہو سکا۔",
      networkError: "ری سیٹ عمل شروع نہیں ہو سکا۔ براہ کرم کنکشن چیک کریں۔",
      email: "ای میل ایڈریس",
      openReset: "ری سیٹ صفحہ کھولیں",
      preparing: "ری سیٹ تیار ہو رہا ہے...",
      submit: "ری سیٹ لنک بنائیں",
      back: "لاگ اِن پر واپس جائیں",
    },
    ar: {
      failed: "تعذر بدء مسار إعادة التعيين.",
      networkError: "تعذر بدء مسار إعادة التعيين. يرجى التحقق من الاتصال.",
      email: "البريد الإلكتروني",
      openReset: "افتح صفحة إعادة التعيين",
      preparing: "جارٍ تجهيز إعادة التعيين...",
      submit: "إنشاء رابط إعادة التعيين",
      back: "العودة إلى تسجيل الدخول",
    },
  }[locale];
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

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || copy.failed);
        return;
      }

      setMessage(data.message);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setError(copy.networkError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="forgot-email">{copy.email}</label>
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
              {copy.openReset}
            </Link>
          ) : null}
        </div>
      ) : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading ? copy.preparing : copy.submit}
      </Button>

      <div className={styles.footer}>
        <Link href="/login">{copy.back}</Link>
      </div>
    </form>
  );
}
