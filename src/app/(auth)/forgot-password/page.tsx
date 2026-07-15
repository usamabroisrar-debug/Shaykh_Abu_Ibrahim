import { cookies } from "next/headers";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import styles from "@/components/auth/AuthForms.module.css";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description:
    "Request a password reset for your student, parent, teacher, or admin account and restore secure dashboard access.",
  path: "/forgot-password",
});

export default async function ForgotPasswordPage() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "Password reset",
      title: "Recover access without losing your progress",
      description:
        "If your login is blocked, generate a reset link and move back into admissions, courses, and your academy dashboard.",
      benefits: [
        {
          title: "Quick recovery flow",
          text: "Generate a reset link immediately from the email attached to your account.",
        },
        {
          title: "Safe role continuity",
          text: "Once reset is complete, you return to the same student, teacher, or admin flow.",
        },
        {
          title: "Instant recovery link",
          text: "A reset link is generated immediately so you can continue the recovery flow without waiting.",
        },
      ],
      cardEyebrow: "Recover access",
      cardTitle: "Forgot your password?",
      cardDescription: "Enter your email and we will prepare a password reset link for this account.",
    },
    ur: {
      eyebrow: "پاس ورڈ ری سیٹ",
      title: "اپنی پیش رفت کھوئے بغیر رسائی بحال کریں",
      description: "اگر لاگ اِن رکا ہوا ہے تو ری سیٹ لنک بنائیں اور دوبارہ داخلہ، کورسز، اور اپنے اکیڈمی ڈیش بورڈ میں جائیں۔",
      benefits: [
        {
          title: "تیز بحالی عمل",
          text: "اپنے اکاؤنٹ سے جڑی ای میل سے فوراً ری سیٹ لنک بنائیں۔",
        },
        {
          title: "محفوظ کردار تسلسل",
          text: "ری سیٹ مکمل ہونے کے بعد آپ اسی طالب علم، استاد، یا ایڈمن فلو میں واپس جائیں گے۔",
        },
        {
          title: "فوری بحالی لنک",
          text: "ری سیٹ لنک فوراً تیار ہو جاتا ہے تاکہ آپ انتظار کے بغیر عمل جاری رکھ سکیں۔",
        },
      ],
      cardEyebrow: "رسائی بحال کریں",
      cardTitle: "پاس ورڈ بھول گئے؟",
      cardDescription: "اپنی ای میل درج کریں اور ہم اس اکاؤنٹ کے لیے پاس ورڈ ری سیٹ لنک تیار کریں گے۔",
    },
    ar: {
      eyebrow: "إعادة تعيين كلمة المرور",
      title: "استعد الوصول دون فقدان تقدمك",
      description:
        "إذا كان تسجيل الدخول متعذرًا، فأنشئ رابط إعادة تعيين وعد إلى القبول والدورات ولوحة الأكاديمية.",
      benefits: [
        {
          title: "مسار استرداد سريع",
          text: "أنشئ رابط إعادة التعيين فورًا من البريد المرتبط بحسابك.",
        },
        {
          title: "استمرارية آمنة للدور",
          text: "بعد اكتمال إعادة التعيين تعود إلى نفس مسار الطالب أو المعلم أو المشرف.",
        },
        {
          title: "رابط استرداد فوري",
          text: "يُنشأ رابط إعادة التعيين مباشرة حتى تتابع مسار الاسترداد دون انتظار.",
        },
      ],
      cardEyebrow: "استعد الوصول",
      cardTitle: "هل نسيت كلمة المرور؟",
      cardDescription: "أدخل بريدك الإلكتروني وسنجهز رابط إعادة تعيين كلمة المرور لهذا الحساب.",
    },
  }[locale];
  return (
    <AuthShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      benefits={copy.benefits}
    >
      <span className={styles.eyebrow}>{copy.cardEyebrow}</span>
      <h2 className={styles.title}>{copy.cardTitle}</h2>
      <p className={styles.description}>{copy.cardDescription}</p>
      <ForgotPasswordForm locale={locale} />
    </AuthShell>
  );
}
