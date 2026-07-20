import { cookies } from "next/headers";
import { AdmissionForm } from "@/components/lms/AdmissionForm";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { Badge, Card, Container, Section } from "@/components/shared";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";
import { getPublicCourses } from "@/services/course/course.service";
import styles from "@/components/lms/LmsExperience.module.css";

export const metadata = buildMetadata({
  title: "Admission",
  description:
    "Review the academy admission flow for course matching, family details, scheduling, and online Islamic enrollment.",
  path: "/admission",
});

const admissionCopy = {
  en: {
    heroEyebrow: "Admission",
    heroTitle: "A clearer admission journey for students, parents, and families",
    heroDescription:
      "Share your level, preferred course, guardian details, and schedule so the academy can recommend the right learning path.",
    badge: "Enrollment guidance",
    summaryTitle: "Apply with clarity before you commit to the full learning path",
    summaryText:
      "Admissions help us recommend the right course, communicate clearly with families, and place each student with better structure from day one.",
    matching: "Course matching",
    matchingText: "Choose the most relevant path before direct enrollment.",
    guardian: "Guardian details",
    guardianText: "Support younger learners and family-led study journeys.",
    timezone: "Timezone planning",
    timezoneText: "Help the academy guide suitable scheduling from the start.",
    formTitle: "Start your admission request",
    formText:
      "Submit your details and we will review the best pathway for your level, age group, and study goals.",
    noCourses: "Published courses will appear here once they are added from the admin panel.",
  },
  ur: {
    heroEyebrow: "داخلہ",
    heroTitle: "طلبہ، والدین، اور خاندانوں کے لیے واضح داخلہ سفر",
    heroDescription:
      "اپنی سطح، پسندیدہ کورس، سرپرست معلومات، اور شیڈول بتائیں تاکہ اکیڈمی بہتر تعلیمی راستہ تجویز کر سکے۔",
    badge: "داخلہ رہنمائی",
    summaryTitle: "مکمل تعلیمی راستے سے پہلے وضاحت کے ساتھ اپلائی کریں",
    summaryText:
      "داخلہ فارم بہتر کورس تجاویز، واضح خاندانی رابطہ، اور مضبوط طالب علم پلیسمنٹ کے لیے ضروری معلومات جمع کرتا ہے۔",
    matching: "کورس میچنگ",
    matchingText: "براہ راست انرولمنٹ سے پہلے موزوں ترین راستہ منتخب کریں۔",
    guardian: "سرپرست معلومات",
    guardianText: "کم عمر طلبہ اور خاندانی تعلیمی سفر کی بہتر مدد کریں۔",
    timezone: "ٹائم زون منصوبہ بندی",
    timezoneText: "اکیڈمی کو شروع سے مناسب شیڈول تجویز کرنے میں مدد دیں۔",
    formTitle: "اپنی داخلہ درخواست شروع کریں",
    formText: "اپنی تفصیلات جمع کریں، ہم آپ کی سطح، عمر، اور اہداف کے مطابق بہتر راستہ تجویز کریں گے۔",
    noCourses: "شائع شدہ کورسز admin panel سے add ہونے کے بعد یہاں نظر آئیں گے۔",
  },
  ar: {
    heroEyebrow: "القبول",
    heroTitle: "رحلة قبول واضحة للطلاب وأولياء الأمور",
    heroDescription:
      "شارك مستواك والدورة المطلوبة وبيانات ولي الأمر والجدول المناسب لنقترح لك المسار الأفضل.",
    badge: "إرشاد القبول",
    summaryTitle: "قدّم بوضوح قبل الالتزام بالمسار الكامل",
    summaryText:
      "يساعدنا القبول على توصية الدورة المناسبة والتواصل بوضوح مع الأسرة ووضع الطالب في مسار منظم منذ البداية.",
    matching: "اختيار الدورة",
    matchingText: "اختر المسار الأنسب قبل التسجيل المباشر.",
    guardian: "بيانات ولي الأمر",
    guardianText: "دعم المتعلمين الصغار والرحلات الدراسية الأسرية.",
    timezone: "تخطيط الوقت",
    timezoneText: "ساعد الأكاديمية على اقتراح جدول مناسب من البداية.",
    formTitle: "ابدأ طلب القبول",
    formText: "أرسل بياناتك وسنراجع أفضل مسار يناسب مستواك وعمرك وأهدافك.",
    noCourses: "ستظهر الدورات المنشورة هنا بعد إضافتها من لوحة الإدارة.",
  },
};

export default async function AdmissionRoute() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = admissionCopy[locale];
  const courses = await getPublicCourses();

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
            <AdmissionForm locale={locale} courses={courses} />
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container>
          {courses.length ? (
            <div className={styles.featureGrid}>
              {courses.slice(0, 3).map((course) => (
                <Card key={course.id} className={styles.featureCard}>
                  <strong>{resolveLocalizedInlineText(course.title, locale)}</strong>
                  <p>
                    {resolveLocalizedRichText(
                      course.rawDescription || course.shortDescription,
                      locale
                    )}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className={styles.featureCard}>{copy.noCourses}</Card>
          )}
        </Container>
      </Section>
    </>
  );
}
