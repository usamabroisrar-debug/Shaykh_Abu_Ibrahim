import { cookies } from "next/headers";
import { Award, BookOpenText, Globe2, HeartHandshake } from "lucide-react";
import { Card, Container, Section, SectionTitle } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./AboutPage.module.css";

const values = [
  {
    title: "Authentic learning",
    description:
      "Every pathway is shaped around dependable Islamic knowledge, respectful teaching, and practical clarity.",
    icon: <BookOpenText size={24} />,
  },
  {
    title: "Family-friendly delivery",
    description:
      "Our learning experience is designed for children, adults, and households balancing faith goals with modern schedules.",
    icon: <HeartHandshake size={24} />,
  },
  {
    title: "Global online access",
    description:
      "Live classes, guided study, and mentor touchpoints make it easier for learners worldwide to stay connected and consistent.",
    icon: <Globe2 size={24} />,
  },
  {
    title: "Premium standards",
    description:
      "We care about scholarship and presentation together, so students experience both beauty and substance from the first visit.",
    icon: <Award size={24} />,
  },
];

export async function AboutPage() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      heroEyebrow: "About The Academy",
      heroTitle: "A modern Islamic academy built around structure, sincerity, and steady progress",
      heroDescription:
        "Shaykh Abu Ibrahim Islamic Academy is being shaped as a complete digital learning environment for Quran, Tajweed, Hifz, Tafseer, Hadith, Fiqh, and family-centered Islamic education.",
      primaryCta: "Explore Courses",
      secondaryCta: "Contact Us",
      missionEyebrow: "Our Mission",
      missionTitle:
        "We want online Islamic education to feel serious, welcoming, and beautifully organized",
      missionDescription:
        "The academy vision is to help students build strong Quran foundations, deeper understanding, and lasting study habits through clear pathways and thoughtful teaching.",
      statement:
        "Students should not have to choose between authentic scholarship and a polished modern learning experience. We are building both together.",
      valuesEyebrow: "What We Stand For",
      valuesTitle: "Core principles guiding the academy experience",
      valuesDescription:
        "These values shape how we present courses, communicate with families, and design the broader LMS roadmap.",
    },
    ur: {
      heroEyebrow: "اکیڈمی کا تعارف",
      heroTitle: "ایک جدید اسلامی اکیڈمی جو ترتیب، اخلاص، اور مستقل ترقی کے گرد قائم ہے",
      heroDescription:
        "شیخ ابو ابراہیم اسلامی اکیڈمی قرآن، تجوید، حفظ، تفسیر، حدیث، فقہ، اور خاندان دوست اسلامی تعلیم کے لیے ایک مکمل ڈیجیٹل تعلیمی ماحول کے طور پر تیار کی جا رہی ہے۔",
      primaryCta: "کورسز دیکھیں",
      secondaryCta: "رابطہ کریں",
      missionEyebrow: "ہمارا مقصد",
      missionTitle: "ہم چاہتے ہیں کہ آن لائن اسلامی تعلیم سنجیدہ، خوش آمدیدی، اور خوبصورت انداز میں منظم محسوس ہو",
      missionDescription:
        "اکیڈمی کا وژن طلبہ کو مضبوط قرآنی بنیاد، گہری سمجھ، اور دیرپا مطالعہ عادات دینے کے لیے واضح راستے اور فکری تدریس فراہم کرنا ہے۔",
      statement:
        "طلبہ کو مستند دینی علم اور جدید خوبصورت تعلیمی تجربے میں سے کسی ایک کا انتخاب نہ کرنا پڑے۔ ہم دونوں کو ساتھ بنا رہے ہیں۔",
      valuesEyebrow: "ہم کن اصولوں پر قائم ہیں",
      valuesTitle: "وہ بنیادی اصول جو اکیڈمی کے تجربے کی رہنمائی کرتے ہیں",
      valuesDescription: "یہ اقدار طے کرتی ہیں کہ ہم کورسز کیسے پیش کرتے ہیں، خاندانوں سے کیسے رابطہ کرتے ہیں، اور LMS کی سمت کیسے بناتے ہیں۔",
    },
    ar: {
      heroEyebrow: "عن الأكاديمية",
      heroTitle: "أكاديمية إسلامية حديثة مبنية على التنظيم والإخلاص والتقدم الثابت",
      heroDescription:
        "تُشكَّل أكاديمية شيخ أبو إبراهيم الإسلامية كبيئة تعلم رقمية متكاملة للقرآن والتجويد والحفظ والتفسير والحديث والفقه والتعليم الإسلامي المراعي للأسرة.",
      primaryCta: "استكشف الدورات",
      secondaryCta: "اتصل بنا",
      missionEyebrow: "رسالتنا",
      missionTitle: "نريد أن تبدو التربية الإسلامية عبر الإنترنت جادة ومرحبة ومنظمة بشكل جميل",
      missionDescription:
        "رؤية الأكاديمية هي مساعدة الطلاب على بناء أساس قوي في القرآن، وفهم أعمق، وعادات دراسة ثابتة من خلال مسارات واضحة وتعليم واعٍ.",
      statement:
        "لا ينبغي للطلاب أن يختاروا بين العلم الشرعي الأصيل وتجربة تعلم حديثة مصقولة. نحن نبني الاثنين معًا.",
      valuesEyebrow: "ما الذي نمثله",
      valuesTitle: "المبادئ الأساسية التي توجه تجربة الأكاديمية",
      valuesDescription:
        "تشكل هذه القيم طريقة تقديم الدورات والتواصل مع الأسر وتصميم خارطة الطريق الأوسع لنظام التعلم.",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryCta={{ label: copy.primaryCta, href: "/courses" }}
        secondaryCta={{ label: copy.secondaryCta, href: "/contact" }}
      />

      <Section variant="white">
        <Container className={styles.storyGrid}>
          <div className={styles.story}>
            <SectionTitle
              eyebrow={copy.missionEyebrow}
              title={copy.missionTitle}
              description={copy.missionDescription}
              align="left"
            />
          </div>

          <Card className={styles.statement}>
            <p>{copy.statement}</p>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow={copy.valuesEyebrow}
            title={copy.valuesTitle}
            description={copy.valuesDescription}
          />

          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <Card key={value.title} className={styles.valueCard}>
                <div className={styles.iconWrap}>{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
