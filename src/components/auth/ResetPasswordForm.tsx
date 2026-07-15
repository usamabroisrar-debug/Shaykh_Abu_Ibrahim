"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import type { SiteLocale } from "@/lib/locale";
import styles from "./AuthForms.module.css";

type ResetPasswordFormProps = {
  token: string;
  locale: SiteLocale;
};

export function ResetPasswordForm({ token, locale }: ResetPasswordFormProps) {
  const copy = {
    en: {
      missingToken: "Reset token is missing. Generate a new link from the forgot password page.",
      failed: "Reset failed.",
      networkError: "Password reset could not be completed right now. Please try again.",
      resetToken: "Reset token",
      newPassword: "New password",
      updating: "Updating...",
      update: "Update Password",
      back: "Back to login",
    },
    ur: {
      missingToken: "ری سیٹ ٹوکن موجود نہیں۔ Forgot password صفحہ سے نیا لنک بنائیں۔",
      failed: "ری سیٹ مکمل نہیں ہو سکا۔",
      networkError: "پاس ورڈ ری سیٹ اس وقت مکمل نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
      resetToken: "ری سیٹ ٹوکن",
      newPassword: "نیا پاس ورڈ",
      updating: "اپڈیٹ ہو رہا ہے...",
      update: "پاس ورڈ اپڈیٹ کریں",
      back: "لاگ اِن پر واپس جائیں",
    },
    ar: {
      missingToken: "رمز إعادة التعيين مفقود. أنشئ رابطًا جديدًا من صفحة نسيان كلمة المرور.",
      failed: "فشلت إعادة التعيين.",
      networkError: "تعذر إكمال إعادة تعيين كلمة المرور الآن. حاول مرة أخرى.",
      resetToken: "رمز إعادة التعيين",
      newPassword: "كلمة المرور الجديدة",
      updating: "جارٍ التحديث...",
      update: "تحديث كلمة المرور",
      back: "العودة إلى تسجيل الدخول",
    },
  }[locale];
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
      setError(copy.missingToken);
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
        setError(data.message || copy.failed);
        return;
      }

      setMessage(data.message);
      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch {
      setError(copy.networkError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="reset-token">{copy.resetToken}</label>
        <input id="reset-token" value={token} readOnly />
      </div>

      <div className={styles.field}>
        <label htmlFor="reset-password">{copy.newPassword}</label>
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
        {isLoading ? copy.updating : copy.update}
      </Button>

      <div className={styles.footer}>
        <Link href="/login">{copy.back}</Link>
      </div>
    </form>
  );
}
