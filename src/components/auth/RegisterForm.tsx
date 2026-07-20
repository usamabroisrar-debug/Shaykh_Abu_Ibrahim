"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/shared";
import type { SiteLocale } from "@/lib/locale";
import styles from "./AuthForms.module.css";

type RegisterFormProps = {
  locale: SiteLocale;
};

type RegisterRole = "STUDENT" | "PARENT" | "TEACHER";

const copyByLocale = {
  en: {
    failed: "Registration failed.",
    success: "Account created. Signing you in now...",
    passwordMismatch: "Password and confirm password do not match.",
    autoLoginError:
      "Account was created, but auto login could not be completed. Please login manually.",
    networkError: "Registration could not be completed right now. Please try again.",
    fullName: "Full name",
    registerAs: "Register as",
    student: "Student",
    parent: "Parent",
    teacher: "Teacher",
    email: "Email address",
    phone: "Phone / WhatsApp",
    password: "Password",
    confirmPassword: "Confirm password",
    timezone: "Timezone",
    guardianName: "Guardian name",
    guardianPhone: "Guardian phone",
    creating: "Creating account...",
    create: "Create Account",
    already: "Already have an account?",
    login: "Login",
    passwordPlaceholder: "Minimum 8 characters",
  },
  ur: {
    failed: "رجسٹریشن مکمل نہیں ہو سکی۔",
    success: "اکاؤنٹ بن گیا ہے۔ اب آپ کو لاگ اِن کیا جا رہا ہے...",
    passwordMismatch: "پاس ورڈ اور کنفرم پاس ورڈ ایک جیسے نہیں ہیں۔",
    autoLoginError:
      "اکاؤنٹ بن گیا، لیکن آٹو لاگ اِن مکمل نہیں ہو سکا۔ براہ کرم دستی طور پر لاگ اِن کریں۔",
    networkError: "رجسٹریشن اس وقت مکمل نہیں ہو سکی۔ دوبارہ کوشش کریں۔",
    fullName: "پورا نام",
    registerAs: "بطور رجسٹر کریں",
    student: "طالب علم",
    parent: "والدین",
    teacher: "استاد",
    email: "ای میل ایڈریس",
    phone: "فون / واٹس ایپ",
    password: "پاس ورڈ",
    confirmPassword: "پاس ورڈ دوبارہ لکھیں",
    timezone: "ٹائم زون",
    guardianName: "سرپرست کا نام",
    guardianPhone: "سرپرست کا فون",
    creating: "اکاؤنٹ بنایا جا رہا ہے...",
    create: "اکاؤنٹ بنائیں",
    already: "کیا آپ کے پاس پہلے سے اکاؤنٹ ہے؟",
    login: "لاگ اِن",
    passwordPlaceholder: "کم از کم 8 حروف",
  },
  ar: {
    failed: "تعذر إكمال التسجيل.",
    success: "تم إنشاء الحساب. جار تسجيل دخولك الآن...",
    passwordMismatch: "كلمة المرور وتأكيدها غير متطابقين.",
    autoLoginError:
      "تم إنشاء الحساب، لكن تعذر تسجيل الدخول تلقائيا. يرجى تسجيل الدخول يدويا.",
    networkError: "تعذر إكمال التسجيل الآن. حاول مرة أخرى.",
    fullName: "الاسم الكامل",
    registerAs: "سجل كـ",
    student: "طالب",
    parent: "ولي أمر",
    teacher: "معلم",
    email: "البريد الإلكتروني",
    phone: "الهاتف / واتساب",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    timezone: "المنطقة الزمنية",
    guardianName: "اسم ولي الأمر",
    guardianPhone: "هاتف ولي الأمر",
    creating: "جار إنشاء الحساب...",
    create: "إنشاء الحساب",
    already: "هل لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    passwordPlaceholder: "8 أحرف على الأقل",
  },
} as const;

function getDashboardPath(role: RegisterRole) {
  return role === "TEACHER" ? "/teacher" : "/student";
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const copy = copyByLocale[locale];
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as RegisterRole,
    phone: "",
    guardianName: "",
    guardianPhone: "",
    timezone: "Asia/Karachi",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        timezone: form.timezone,
      };
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || copy.failed);
        return;
      }

      setMessage(copy.success);

      const dashboardPath = getDashboardPath(form.role);
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl: dashboardPath,
      });

      if (!signInResult || signInResult.error) {
        setError(copy.autoLoginError);
        router.push("/login");
        return;
      }

      router.push(signInResult.url || dashboardPath);
      router.refresh();
    } catch {
      setError(copy.networkError);
    } finally {
      setIsLoading(false);
    }
  }

  const needsGuardian = form.role === "STUDENT" || form.role === "PARENT";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-name">{copy.fullName}</label>
          <input
            id="register-name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Muhammad Ahmed"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-role">{copy.registerAs}</label>
          <select
            id="register-role"
            value={form.role}
            onChange={(event) => updateField("role", event.target.value as RegisterRole)}
          >
            <option value="STUDENT">{copy.student}</option>
            <option value="PARENT">{copy.parent}</option>
            <option value="TEACHER">{copy.teacher}</option>
          </select>
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-email">{copy.email}</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="student@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-phone">{copy.phone}</label>
          <input
            id="register-phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+92..."
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="register-password">{copy.password}</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder={copy.passwordPlaceholder}
            minLength={8}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-confirm-password">{copy.confirmPassword}</label>
          <input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            placeholder={copy.passwordPlaceholder}
            minLength={8}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="register-timezone">{copy.timezone}</label>
        <input
          id="register-timezone"
          value={form.timezone}
          onChange={(event) => updateField("timezone", event.target.value)}
          placeholder="Asia/Karachi"
        />
      </div>

      {needsGuardian ? (
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="guardian-name">{copy.guardianName}</label>
            <input
              id="guardian-name"
              autoComplete="name"
              value={form.guardianName}
              onChange={(event) => updateField("guardianName", event.target.value)}
              placeholder="Parent / guardian"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="guardian-phone">{copy.guardianPhone}</label>
            <input
              id="guardian-phone"
              autoComplete="tel"
              value={form.guardianPhone}
              onChange={(event) => updateField("guardianPhone", event.target.value)}
              placeholder="+92..."
            />
          </div>
        </div>
      ) : null}

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading ? copy.creating : copy.create}
      </Button>

      <div className={styles.footer}>
        <span>
          {copy.already} <Link href="/login">{copy.login}</Link>
        </span>
      </div>
    </form>
  );
}
