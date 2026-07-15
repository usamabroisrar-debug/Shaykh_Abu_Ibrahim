import { cookies } from "next/headers";
import { UtilityPage } from "@/components/public/utility/UtilityPage";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms And Conditions",
  description:
    "Review the expected terms for using the academy website, courses, resources, and future student learning services.",
  path: "/terms",
});

export default async function TermsRoute() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "Terms",
      title: "Basic terms for using the academy website and learning services",
      description:
        "These terms provide a practical baseline for website use, course participation, and respectful engagement as the platform expands.",
      detailsEyebrow: "Details",
      detailsTitle: "Important information",
      detailsDescription:
        "Clear, readable sections so students and families can understand expectations without friction.",
      sections: [
        {
          title: "Using the website",
          body: "Visitors are expected to use the academy website responsibly, respectfully, and only for legitimate educational, informational, and communication purposes.",
        },
        {
          title: "Learning participation",
          body: "Students and families should follow teacher guidance, class expectations, and academy communication standards in ways that support a respectful learning environment.",
        },
        {
          title: "Content and materials",
          body: "Academy resources, lesson structures, and branded materials should be treated as protected educational content and not reused inappropriately.",
        },
        {
          title: "Platform evolution",
          body: "As the LMS grows to include dashboards, assessments, certificates, and payments, these terms can be expanded with more detailed service conditions.",
        },
      ],
      primary: "View Privacy Policy",
      secondary: "Contact Support",
    },
    ur: {
      eyebrow: "شرائط",
      title: "اکیڈمی ویب سائٹ اور تعلیمی خدمات کے استعمال کے بنیادی اصول",
      description: "یہ شرائط ویب سائٹ کے استعمال، کورس شرکت، اور پلیٹ فارم کے پھیلاؤ کے دوران بااحترام تعامل کے لیے ایک عملی بنیاد فراہم کرتی ہیں۔",
      detailsEyebrow: "تفصیلات",
      detailsTitle: "اہم معلومات",
      detailsDescription: "واضح اور آسان حصے تاکہ طلبہ اور خاندان بغیر مشکل کے توقعات سمجھ سکیں۔",
      sections: [
        {
          title: "ویب سائٹ کا استعمال",
          body: "وزیٹرز سے توقع ہے کہ وہ اکیڈمی ویب سائٹ کو ذمہ داری، احترام، اور صرف جائز تعلیمی، معلوماتی، اور رابطہ مقاصد کے لیے استعمال کریں گے۔",
        },
        {
          title: "تعلیمی شرکت",
          body: "طلبہ اور خاندانوں کو استاد کی رہنمائی، کلاس توقعات، اور اکیڈمی رابطہ معیار پر عمل کرنا چاہیے تاکہ بااحترام تعلیمی ماحول قائم رہے۔",
        },
        {
          title: "مواد اور وسائل",
          body: "اکیڈمی کے وسائل، اسباق کی ترتیب، اور برانڈڈ مواد کو محفوظ تعلیمی مواد سمجھا جانا چاہیے اور نامناسب انداز میں دوبارہ استعمال نہیں ہونا چاہیے۔",
        },
        {
          title: "پلیٹ فارم کی ترقی",
          body: "جیسے جیسے LMS ڈیش بورڈز، اسیسمنٹس، سرٹیفکیٹس، اور ادائیگیوں تک بڑھے گا، ان شرائط کو مزید تفصیلی سروس اصولوں کے ساتھ وسیع کیا جا سکتا ہے۔",
        },
      ],
      primary: "پرائیویسی پالیسی دیکھیں",
      secondary: "سپورٹ سے رابطہ کریں",
    },
    ar: {
      eyebrow: "الشروط",
      title: "الشروط الأساسية لاستخدام موقع الأكاديمية وخدمات التعلم",
      description:
        "توفر هذه الشروط أساسًا عمليًا لاستخدام الموقع والمشاركة في الدورات والتفاعل باحترام مع توسع المنصة.",
      detailsEyebrow: "التفاصيل",
      detailsTitle: "معلومات مهمة",
      detailsDescription: "أقسام واضحة وسهلة القراءة حتى يتمكن الطلاب والأسر من فهم التوقعات بسلاسة.",
      sections: [
        {
          title: "استخدام الموقع",
          body: "يُتوقع من الزوار استخدام موقع الأكاديمية بمسؤولية واحترام ولأغراض تعليمية ومعلوماتية وتواصلية مشروعة فقط.",
        },
        {
          title: "المشاركة التعليمية",
          body: "ينبغي على الطلاب والأسر اتباع توجيهات المعلمين وتوقعات الصف ومعايير التواصل في الأكاديمية بما يدعم بيئة تعلم محترمة.",
        },
        {
          title: "المحتوى والمواد",
          body: "ينبغي التعامل مع موارد الأكاديمية وهياكل الدروس والمواد ذات العلامة التجارية كمحتوى تعليمي محمي وعدم إعادة استخدامها بشكل غير مناسب.",
        },
        {
          title: "تطور المنصة",
          body: "مع نمو نظام التعلم ليشمل اللوحات والتقييمات والشهادات والمدفوعات، يمكن توسيع هذه الشروط بمزيد من تفاصيل الخدمة.",
        },
      ],
      primary: "عرض سياسة الخصوصية",
      secondary: "اتصل بالدعم",
    },
  }[locale];

  return (
    <UtilityPage
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      detailsEyebrow={copy.detailsEyebrow}
      detailsTitle={copy.detailsTitle}
      detailsDescription={copy.detailsDescription}
      sections={copy.sections}
      primaryCta={{ label: copy.primary, href: "/privacy-policy" }}
      secondaryCta={{ label: copy.secondary, href: "/contact" }}
    />
  );
}
