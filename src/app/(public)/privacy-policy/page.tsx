import { cookies } from "next/headers";
import { UtilityPage } from "@/components/public/utility/UtilityPage";
import { getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how Shaykh Abu Ibrahim Islamic Academy may collect, use, and protect student, parent, and visitor information across the website.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyRoute() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "Privacy Policy",
      title: "How academy information is expected to be handled with care",
      description:
        "This policy page sets the baseline for respectful data handling while the academy platform continues to grow into a fuller LMS.",
      detailsEyebrow: "Details",
      detailsTitle: "Important information",
      detailsDescription:
        "Clear, readable sections so students and families can understand expectations without friction.",
      sections: [
        {
          title: "Information we may collect",
          body: "Depending on the feature, the academy may collect names, contact details, student level information, course preferences, and communications relevant to admissions or learning support.",
        },
        {
          title: "How information may be used",
          body: "Collected information is intended to support admissions guidance, student communication, course coordination, platform improvements, and a better learning experience.",
        },
        {
          title: "Protection and access",
          body: "Sensitive student and family information should be handled carefully, stored securely, and accessed only where needed for legitimate academy operations.",
        },
        {
          title: "Future platform updates",
          body: "As the LMS expands with dashboards, quizzes, certificates, and payments, this privacy policy can be extended with clearer operational and legal detail.",
        },
      ],
      cta: "Contact The Academy",
    },
    ur: {
      eyebrow: "پرائیویسی پالیسی",
      title: "اکیڈمی کی معلومات کو احتیاط کے ساتھ کیسے سنبھالا جانا چاہیے",
      description: "یہ پالیسی صفحہ احترام کے ساتھ ڈیٹا ہینڈلنگ کی بنیادی رہنمائی دیتا ہے جبکہ پلیٹ فارم مزید مکمل LMS کی طرف بڑھ رہا ہے۔",
      detailsEyebrow: "تفصیلات",
      detailsTitle: "اہم معلومات",
      detailsDescription: "واضح اور آسان حصے تاکہ طلبہ اور خاندان بلا رکاوٹ توقعات سمجھ سکیں۔",
      sections: [
        {
          title: "ہم کون سی معلومات جمع کر سکتے ہیں",
          body: "فیچر کے مطابق اکیڈمی نام، رابطہ معلومات، طالب علم کی سطح، کورس ترجیحات، اور داخلہ یا تعلیمی مدد سے متعلق پیغامات جمع کر سکتی ہے۔",
        },
        {
          title: "معلومات کیسے استعمال ہو سکتی ہیں",
          body: "جمع شدہ معلومات داخلہ رہنمائی، طالب علم رابطہ، کورس ترتیب، پلیٹ فارم بہتری، اور بہتر تعلیمی تجربے کے لیے استعمال کی جا سکتی ہیں۔",
        },
        {
          title: "تحفظ اور رسائی",
          body: "حساس طالب علم اور خاندانی معلومات کو احتیاط سے سنبھالا جانا چاہیے، محفوظ رکھا جانا چاہیے، اور صرف ضرورت کے مطابق استعمال ہونا چاہیے۔",
        },
        {
          title: "مستقبل کی پلیٹ فارم اپڈیٹس",
          body: "جیسے جیسے LMS ڈیش بورڈز، کوئزز، سرٹیفکیٹس، اور ادائیگیوں کے ساتھ بڑھے گا، اس پالیسی کو مزید واضح عملی اور قانونی تفصیل کے ساتھ وسیع کیا جا سکتا ہے۔",
        },
      ],
      cta: "اکیڈمی سے رابطہ کریں",
    },
    ar: {
      eyebrow: "سياسة الخصوصية",
      title: "كيف ينبغي التعامل مع معلومات الأكاديمية بعناية",
      description:
        "تضع هذه الصفحة الأساس للتعامل المحترم مع البيانات بينما تستمر المنصة في النمو نحو نظام تعلم أكثر اكتمالًا.",
      detailsEyebrow: "التفاصيل",
      detailsTitle: "معلومات مهمة",
      detailsDescription: "أقسام واضحة وسهلة القراءة حتى يتمكن الطلاب والأسر من فهم التوقعات دون تعقيد.",
      sections: [
        {
          title: "المعلومات التي قد نجمعها",
          body: "بحسب الميزة، قد تجمع الأكاديمية الأسماء وبيانات الاتصال ومستوى الطالب وتفضيلات الدورة والاتصالات المتعلقة بالقبول أو دعم التعلم.",
        },
        {
          title: "كيفية استخدام المعلومات",
          body: "تهدف المعلومات المجمعة إلى دعم إرشاد القبول والتواصل مع الطلاب وتنسيق الدورات وتحسين المنصة وتجربة تعلم أفضل.",
        },
        {
          title: "الحماية والوصول",
          body: "يجب التعامل مع معلومات الطلاب والأسر الحساسة بعناية وتخزينها بأمان والوصول إليها فقط عند الحاجة التشغيلية المشروعة.",
        },
        {
          title: "تحديثات المنصة المستقبلية",
          body: "مع توسع نظام التعلم ليشمل اللوحات والاختبارات والشهادات والمدفوعات، يمكن توسيع هذه السياسة بمزيد من التفاصيل التشغيلية والقانونية الواضحة.",
        },
      ],
      cta: "اتصل بالأكاديمية",
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
      primaryCta={{ label: copy.cta, href: "/contact" }}
    />
  );
}
