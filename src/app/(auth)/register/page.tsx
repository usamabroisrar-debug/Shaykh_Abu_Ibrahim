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
      title: "Create an academy account built for structured Islamic study",
      description:
        "Start with the role that matches your journey so we can connect admissions, enrollments, support, and future learning progress correctly.",
      benefits: [
        {
          title: "Student and parent ready",
          text: "Capture guardian details early so admissions and support stay family-friendly.",
        },
        {
          title: "Teacher onboarding path",
          text: "Faculty accounts can now move into role-specific tools and operational workflows.",
        },
        {
          title: "Prepared for LMS growth",
          text: "Profiles are shaped to support dashboards, certificates, quizzes, and future integrations.",
        },
      ],
      cardEyebrow: "Register",
      cardTitle: "Create your account",
      cardDescription:
        "Register once, then use the same account for admission tracking, enrollment, course activity, and direct academy communication.",
    },
    ur: {
      eyebrow: "نیا اکاؤنٹ",
      title: "منظم اسلامی تعلیم کے لیے اکیڈمی اکاؤنٹ بنائیں",
      description:
        "اپنے سفر کے مطابق کردار منتخب کریں تاکہ ہم داخلہ، انرولمنٹ، سپورٹ، اور آئندہ تعلیمی پیش رفت کو درست طور پر جوڑ سکیں۔",
      benefits: [
        {
          title: "طالب علم اور والدین کے لیے تیار",
          text: "سرپرست معلومات ابتدا میں محفوظ کریں تاکہ داخلہ اور سپورٹ خاندان دوست رہے۔",
        },
        {
          title: "اساتذہ آن بورڈنگ راستہ",
          text: "اساتذہ اکاؤنٹس اب کردار کے مطابق ٹولز اور عملی ورک فلو میں جا سکتے ہیں۔",
        },
        {
          title: "LMS کی ترقی کے لیے تیار",
          text: "پروفائلز کو اس طرح ترتیب دیا گیا ہے کہ ڈیش بورڈز، سرٹیفکیٹس، کوئزز، اور آئندہ انٹیگریشنز کی سپورٹ ہو۔",
        },
      ],
      cardEyebrow: "رجسٹر",
      cardTitle: "اپنا اکاؤنٹ بنائیں",
      cardDescription:
        "ایک بار رجسٹر کریں، پھر اسی اکاؤنٹ سے داخلہ ٹریکنگ، انرولمنٹ، کورس سرگرمی، اور براہ راست اکیڈمی رابطہ استعمال کریں۔",
    },
    ar: {
      eyebrow: "حساب جديد",
      title: "أنشئ حسابًا أكاديميًا مبنيًا للدراسة الإسلامية المنظمة",
      description:
        "ابدأ بالدور الذي يناسب رحلتك حتى نربط القبول والتسجيل والدعم والتقدم التعليمي المستقبلي بشكل صحيح.",
      benefits: [
        {
          title: "جاهز للطلاب وأولياء الأمور",
          text: "احفظ بيانات ولي الأمر مبكرًا حتى يبقى القبول والدعم ملائمين للأسرة.",
        },
        {
          title: "مسار انضمام المعلمين",
          text: "يمكن لحسابات المعلمين الآن الانتقال إلى أدوات وتدفقات عمل خاصة بالأدوار.",
        },
        {
          title: "مهيأ لنمو نظام التعلم",
          text: "صُممت الملفات الشخصية لدعم اللوحات والشهادات والاختبارات والتكاملات المستقبلية.",
        },
      ],
      cardEyebrow: "تسجيل",
      cardTitle: "أنشئ حسابك",
      cardDescription:
        "سجّل مرة واحدة، ثم استخدم الحساب نفسه لمتابعة القبول والتسجيل ونشاط الدورات والتواصل المباشر مع الأكاديمية.",
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
