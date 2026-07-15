import { cookies } from "next/headers";
import { AdmissionForm } from "@/components/lms/AdmissionForm";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { Badge, Card, Container, Section } from "@/components/shared";
import { courses } from "@/data/courses";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";
import styles from "@/components/lms/LmsExperience.module.css";

export const metadata = buildMetadata({
  title: "Admission",
  description:
    "Review the academy admission flow for course matching, family details, scheduling, and the next steps for online Islamic enrollment.",
  path: "/admission",
});

export default async function AdmissionRoute() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      heroEyebrow: "Admission",
      heroTitle: "A clearer admission journey for students, parents, and families",
      heroDescription:
        "The academy now has a real admission request flow for course matching, guardian details, timezone planning, and guided follow-up.",
      badge: "Enrollment guidance",
      summaryTitle: "Apply with clarity before you commit to the full learning path",
      summaryText:
        "Admissions are designed to gather the information we need for better course recommendations, smoother family communication, and stronger student placement from day one.",
      matching: "Course matching",
      matchingText: "Choose the most relevant path before direct enrollment.",
      guardian: "Guardian details",
      guardianText: "Support younger learners and family-led study journeys.",
      timezone: "Timezone planning",
      timezoneText: "Help the academy guide suitable scheduling from the start.",
      formTitle: "Start your admission request",
      formText:
        "Submit your details and we will review the best pathway for your level, age group, and study goals.",
    },
    ur: {
      heroEyebrow: "داخلہ",
      heroTitle: "طلبہ، والدین، اور خاندانوں کے لیے زیادہ واضح داخلہ سفر",
      heroDescription:
        "اکیڈمی میں اب کورس میچنگ، سرپرست معلومات، ٹائم زون منصوبہ بندی، اور رہنمائی پر مبنی فالو اپ کے لیے حقیقی داخلہ درخواست نظام موجود ہے۔",
      badge: "داخلہ رہنمائی",
      summaryTitle: "مکمل تعلیمی راستے سے پہلے وضاحت کے ساتھ اپلائی کریں",
      summaryText:
        "داخلہ فارم اس لیے بنایا گیا ہے کہ ہم بہتر کورس تجاویز، ہموار خاندانی رابطہ، اور ابتدا سے مضبوط طالب علم پلیسمنٹ دے سکیں۔",
      matching: "کورس میچنگ",
      matchingText: "براہ راست انرولمنٹ سے پہلے موزوں ترین راستہ منتخب کریں۔",
      guardian: "سرپرست معلومات",
      guardianText: "کم عمر طلبہ اور خاندانی تعلیمی سفر کی بہتر مدد کریں۔",
      timezone: "ٹائم زون منصوبہ بندی",
      timezoneText: "اکیڈمی کو ابتدا ہی سے موزوں شیڈول تجویز کرنے میں مدد دیں۔",
      formTitle: "اپنی داخلہ درخواست شروع کریں",
      formText: "اپنی تفصیلات جمع کریں، ہم آپ کی سطح، عمر، اور اہداف کے مطابق بہتر راستہ تجویز کریں گے۔",
    },
    ar: {
      heroEyebrow: "القبول",
      heroTitle: "رحلة قبول أوضح للطلاب وأولياء الأمور والعائلات",
      heroDescription:
        "لدى الأكاديمية الآن مسار حقيقي لطلبات القبول يشمل مواءمة الدورات وبيانات أولياء الأمور وتخطيط المنطقة الزمنية والمتابعة الموجهة.",
      badge: "إرشاد القبول",
      summaryTitle: "قدّم بوضوح قبل الالتزام بالمسار التعليمي الكامل",
      summaryText:
        "صُمم القبول لجمع المعلومات التي نحتاجها لتوصيات أفضل للدورات وتواصل أسلس مع الأسرة ووضع أقوى للطالب منذ اليوم الأول.",
      matching: "مواءمة الدورة",
      matchingText: "اختر المسار الأنسب قبل التسجيل المباشر.",
      guardian: "بيانات ولي الأمر",
      guardianText: "ادعم المتعلمين الصغار والرحلات الدراسية الأسرية بشكل أفضل.",
      timezone: "تخطيط المنطقة الزمنية",
      timezoneText: "ساعد الأكاديمية على اقتراح جدول مناسب منذ البداية.",
      formTitle: "ابدأ طلب القبول",
      formText: "أرسل بياناتك وسنراجع أفضل مسار يناسب مستواك وفئتك العمرية وأهدافك الدراسية.",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
      />

      <Section>
        <Container className={styles.heroCard}>
          <div className={styles.summary}>
            <Badge variant="gold">{copy.badge}</Badge>
            <h2>{copy.summaryTitle}</h2>
            <p>{copy.summaryText}</p>

            <div className={styles.featureGrid}>
              <Card className={styles.featureCard}>
                <strong>{copy.matching}</strong>
                <p>{copy.matchingText}</p>
              </Card>
              <Card className={styles.featureCard}>
                <strong>{copy.guardian}</strong>
                <p>{copy.guardianText}</p>
              </Card>
              <Card className={styles.featureCard}>
                <strong>{copy.timezone}</strong>
                <p>{copy.timezoneText}</p>
              </Card>
            </div>
          </div>

          <div className={styles.formCard}>
            <h2>{copy.formTitle}</h2>
            <p>{copy.formText}</p>
            <AdmissionForm locale={locale} />
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container>
          <div className={styles.featureGrid}>
            {courses.slice(0, 3).map((course) => (
              <Card key={course.id} className={styles.featureCard}>
                <strong>{resolveLocalizedInlineText(course.title, locale)}</strong>
                <p>{resolveLocalizedRichText(course.rawDescription || course.shortDescription, locale)}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
