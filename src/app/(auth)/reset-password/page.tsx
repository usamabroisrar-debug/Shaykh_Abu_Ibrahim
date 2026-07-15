import { cookies } from "next/headers";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import styles from "@/components/auth/AuthForms.module.css";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Reset Password",
  description:
    "Set a new password for your academy account and return to your protected dashboard and course experience.",
  path: "/reset-password",
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "Set new password",
      title: "Choose a fresh password and return to your dashboard",
      description: "Use the reset token created for your account and update your password securely.",
      benefits: [
        {
          title: "Token-based recovery",
          text: "Each reset request creates a dedicated token with an expiry window.",
        },
        {
          title: "Account continuity",
          text: "Your enrollments, admissions, and notifications stay connected to the same account.",
        },
        {
          title: "Protected dashboard access",
          text: "Once complete, you can log back into the correct role-specific experience.",
        },
      ],
      cardEyebrow: "Reset",
      cardTitle: "Update your password",
      cardDescription: "Paste or open your reset token link, then choose a new password for your account.",
    },
    ur: {
      eyebrow: "نیا پاس ورڈ سیٹ کریں",
      title: "نیا پاس ورڈ منتخب کریں اور اپنے ڈیش بورڈ پر واپس جائیں",
      description: "اپنے اکاؤنٹ کے لیے بنائے گئے ری سیٹ ٹوکن سے محفوظ طریقے سے پاس ورڈ اپڈیٹ کریں۔",
      benefits: [
        {
          title: "ٹوکن پر مبنی بحالی",
          text: "ہر ری سیٹ درخواست ایک مخصوص ٹوکن اور ایکسپائری ونڈو بناتی ہے۔",
        },
        {
          title: "اکاؤنٹ تسلسل",
          text: "آپ کی انرولمنٹس، داخلے، اور نوٹیفکیشنز اسی اکاؤنٹ سے جڑی رہتی ہیں۔",
        },
        {
          title: "محفوظ ڈیش بورڈ رسائی",
          text: "عمل مکمل ہونے کے بعد آپ درست کردار والے تجربے میں دوبارہ لاگ اِن کر سکتے ہیں۔",
        },
      ],
      cardEyebrow: "ری سیٹ",
      cardTitle: "اپنا پاس ورڈ اپڈیٹ کریں",
      cardDescription: "اپنا ری سیٹ ٹوکن لنک کھولیں یا پیسٹ کریں، پھر اپنے اکاؤنٹ کے لیے نیا پاس ورڈ منتخب کریں۔",
    },
    ar: {
      eyebrow: "تعيين كلمة مرور جديدة",
      title: "اختر كلمة مرور جديدة وارجع إلى لوحتك",
      description: "استخدم رمز إعادة التعيين الذي أُنشئ لحسابك وحدّث كلمة المرور بأمان.",
      benefits: [
        {
          title: "استرداد قائم على الرمز",
          text: "ينشئ كل طلب إعادة تعيين رمزًا مخصصًا مع نافذة صلاحية.",
        },
        {
          title: "استمرارية الحساب",
          text: "تبقى تسجيلاتك وطلباتك وإشعاراتك مرتبطة بالحساب نفسه.",
        },
        {
          title: "وصول محمي إلى اللوحة",
          text: "بعد الاكتمال يمكنك تسجيل الدخول مجددًا إلى التجربة الصحيحة بحسب الدور.",
        },
      ],
      cardEyebrow: "إعادة تعيين",
      cardTitle: "حدّث كلمة مرورك",
      cardDescription: "افتح أو الصق رابط رمز إعادة التعيين، ثم اختر كلمة مرور جديدة لحسابك.",
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
      <ResetPasswordForm token={params.token || ""} locale={locale} />
    </AuthShell>
  );
}
