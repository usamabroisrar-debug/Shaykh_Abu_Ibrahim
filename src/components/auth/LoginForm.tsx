"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { type SiteLocale } from "@/lib/locale";
import { Button } from "@/components/shared";
import styles from "./AuthForms.module.css";

type LoginFormProps = {
  nextPath?: string;
  locale: SiteLocale;
};

export function LoginForm({ nextPath = "/student", locale }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: nextPath,
      });

      if (!result || result.error) {
        setError(
          locale === "en"
            ? "Email or password did not match. Please try again."
            : locale === "ar"
              ? "البريد الإلكتروني أو كلمة المرور غير متطابقين. حاول مرة أخرى."
              : "ای میل یا پاس ورڈ درست نہیں۔ دوبارہ کوشش کریں۔"
        );
        return;
      }

      router.push(result.url || nextPath);
      router.refresh();
    } catch {
      setError(
        locale === "en"
          ? "Login could not be completed right now. Please try again."
          : locale === "ar"
            ? "تعذر إكمال تسجيل الدخول حالياً. حاول مرة أخرى."
            : "اس وقت لاگ اِن مکمل نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="login-email">
          {locale === "en" ? "Email address" : locale === "ar" ? "البريد الإلكتروني" : "ای میل ایڈریس"}
        </label>
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
        <label htmlFor="login-password">
          {locale === "en" ? "Password" : locale === "ar" ? "كلمة المرور" : "پاس ورڈ"}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={
            locale === "en"
              ? "Minimum 8 characters"
              : locale === "ar"
                ? "8 أحرف على الأقل"
                : "کم از کم 8 حروف"
          }
          required
        />
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading
          ? locale === "en"
            ? "Signing in..."
            : locale === "ar"
              ? "جاري تسجيل الدخول..."
              : "لاگ اِن ہو رہا ہے..."
          : locale === "en"
            ? "Login To Dashboard"
            : locale === "ar"
              ? "الدخول إلى اللوحة"
              : "ڈیش بورڈ میں لاگ اِن"}
      </Button>

      <div className={styles.footer}>
        <Link href="/forgot-password">
          {locale === "en" ? "Forgot password?" : locale === "ar" ? "هل نسيت كلمة المرور؟" : "پاس ورڈ بھول گئے؟"}
        </Link>
        <span>
          {locale === "en"
            ? "No account yet? "
            : locale === "ar"
              ? "ليس لديك حساب؟ "
              : "ابھی اکاؤنٹ نہیں؟ "}
          <Link href="/register">
            {locale === "en" ? "Create one" : locale === "ar" ? "أنشئ حساباً" : "اکاؤنٹ بنائیں"}
          </Link>
        </span>
      </div>
    </form>
  );
}
