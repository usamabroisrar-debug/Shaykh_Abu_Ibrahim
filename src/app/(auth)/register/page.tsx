import { cookies } from "next/headers";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import styles from "@/components/auth/AuthForms.module.css";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Create Account",
  description:
    "Create a student, parent, or teacher account for admissions, course enrollment, dashboard access, and private academy resources.",
  path: "/register",
});

export default async function RegisterPage() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "New account",
      title: "Create your Shaykh Abu Ibrahim academy account",
      description:
        "Register as a student, parent, or teacher so admissions, course enrollment, dashboard access, and future learning records stay connected.",
      benefits: [
        {
          title: "Student and parent ready",
          text: "Keep admission details, guardian contact, enrollment, and learning progress in one place.",
        },
        {
          title: "Teacher onboarding path",
          text: "Teacher accounts can access role-specific tools as the academy workflow expands.",
        },
        {
          title: "Prepared for LMS growth",
          text: "Your account supports dashboards, certificates, quizzes, lessons, and future course activity.",
        },
      ],
      cardEyebrow: "Register",
      cardTitle: "Create your account",
      cardDescription:
        "After registration, you will be signed in automatically and sent to the right dashboard.",
    },
    ur: {
      eyebrow: "نیا اکاؤنٹ",
      title: "شیخ ابو ابراہیم اکیڈمی کا اکاؤنٹ بنائیں",
      description:
        "طالب علم، والدین، یا استاد کے طور پر رجسٹر کریں تاکہ داخلہ، کورس انرولمنٹ، ڈیش بورڈ، اور تعلیمی ریکارڈ ایک جگہ محفوظ رہیں۔",
      benefits: [
        {
          title: "طلبہ اور والدین کے لیے آسان",
          text: "داخلہ معلومات، سرپرست رابطہ، انرولمنٹ، اور تعلیمی پیش رفت ایک ہی جگہ رہتی ہے۔",
        },
        {
          title: "اساتذہ کے لیے راستہ",
          text: "استاد کا اکاؤنٹ اکیڈمی کے متعلقہ ٹولز اور ورک فلو تک رسائی دے سکتا ہے۔",
        },
        {
          title: "LMS کے لیے تیار",
          text: "یہ اکاؤنٹ ڈیش بورڈ، اسباق، کوئزز، سرٹیفکیٹس، اور کورس سرگرمیوں کے لیے تیار ہے۔",
        },
      ],
      cardEyebrow: "رجسٹر",
      cardTitle: "اپنا اکاؤنٹ بنائیں",
      cardDescription:
        "رجسٹریشن کے بعد آپ کو خودکار طور پر لاگ اِن کر کے درست ڈیش بورڈ پر بھیج دیا جائے گا۔",
    },
    ar: {
      eyebrow: "حساب جديد",
      title: "أنشئ حسابك في أكاديمية شيخ أبو إبراهيم",
      description:
        "سجل كطالب أو ولي أمر أو معلم حتى تبقى بيانات القبول والتسجيل والدروس والسجلات التعليمية مرتبطة في مكان واحد.",
      benefits: [
        {
          title: "جاهز للطلاب وأولياء الأمور",
          text: "تبقى بيانات القبول ومعلومات ولي الأمر والتسجيل والتقدم الدراسي في مكان واحد.",
        },
        {
          title: "مسار للمعلمين",
          text: "يمكن لحساب المعلم الوصول إلى أدوات العمل المناسبة مع توسع نظام الأكاديمية.",
        },
        {
          title: "مهيأ لنظام التعلم",
          text: "يدعم الحساب اللوحات والدروس والاختبارات والشهادات ونشاط الدورات مستقبلا.",
        },
      ],
      cardEyebrow: "تسجيل",
      cardTitle: "أنشئ حسابك",
      cardDescription:
        "بعد التسجيل سيتم تسجيل دخولك تلقائيا وتحويلك إلى لوحة التحكم المناسبة.",
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
      <RegisterForm locale={locale} />
    </AuthShell>
  );
}
