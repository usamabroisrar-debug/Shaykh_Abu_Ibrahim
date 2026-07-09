import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./Hero.module.css";

const heroContent = {
  en: {
    badge: "Premium Online Islamic Academy",
    title: "Learn Quran Online With Authentic Islamic Guidance",
    description:
      "Build a strong foundation in Quran, Hadith and Islamic knowledge through structured online courses designed for children, adults and advanced learners.",
    miniHighlights: [
      "One-to-one live classes",
      "Flexible worldwide timings",
      "Free trial available",
    ],
    highlights: ["Qaida", "Nazra", "Hifz", "Tajweed", "Tarjuma", "Tafseer", "Hadith"],
    primaryAction: "Apply for Admission",
    secondaryAction: "Explore Courses",
    trusted: "Trusted Learning",
    curriculum: "Authentic Curriculum",
    teachers: "Expert Teachers",
    stats: [
      { label: "Courses", value: "12+" },
      { label: "Students", value: "500+" },
      { label: "Authentic", value: "100%" },
    ],
    certificate: "Certificate",
    certificateDetail: "After Course Completion",
    liveClasses: "Live Classes",
    liveDetail: "Quran • Hadith • Tafseer",
    verified: "Verified Islamic Learning",
    imageAlt: "Online Quran and Islamic learning",
  },
  ur: {
    badge: "پریمیم آن لائن اسلامی اکیڈمی",
    title: "مستند اسلامی رہنمائی کے ساتھ آن لائن قرآن سیکھیں",
    description:
      "بچوں، بڑوں، اور سنجیدہ طلبہ کے لیے ترتیب دیے گئے آن لائن کورسز کے ذریعے قرآن، حدیث، اور اسلامی علوم میں مضبوط بنیاد قائم کریں۔",
    miniHighlights: [
      "ون ٹو ون لائیو کلاسز",
      "دنیا بھر کے اوقات کے مطابق سہولت",
      "فری ٹرائل دستیاب",
    ],
    highlights: ["قاعدہ", "ناظرہ", "حفظ", "تجوید", "ترجمہ", "تفسیر", "حدیث"],
    primaryAction: "داخلے کے لیے اپلائی کریں",
    secondaryAction: "کورسز دیکھیں",
    trusted: "قابل اعتماد تعلیم",
    curriculum: "مستند نصاب",
    teachers: "ماہر اساتذہ",
    stats: [
      { label: "کورسز", value: "12+" },
      { label: "طلبہ", value: "500+" },
      { label: "مستند", value: "100%" },
    ],
    certificate: "سرٹیفکیٹ",
    certificateDetail: "کورس مکمل ہونے کے بعد",
    liveClasses: "لائیو کلاسز",
    liveDetail: "قرآن • حدیث • تفسیر",
    verified: "تصدیق شدہ اسلامی تعلیم",
    imageAlt: "آن لائن قرآن اور اسلامی تعلیم",
  },
  ar: {
    badge: "أكاديمية إسلامية متميزة عبر الإنترنت",
    title: "تعلّم القرآن عبر الإنترنت بإرشاد إسلامي موثوق",
    description:
      "ابنِ أساساً قوياً في القرآن والحديث والعلوم الإسلامية من خلال دورات منظمة للأطفال والكبار والدارسين المتقدمين.",
    miniHighlights: [
      "دروس مباشرة فردية",
      "مواعيد مرنة عالمياً",
      "حصة تجريبية مجانية",
    ],
    highlights: ["القاعدة", "النظرة", "الحفظ", "التجويد", "الترجمة", "التفسير", "الحديث"],
    primaryAction: "قدّم للقبول",
    secondaryAction: "استكشف الدورات",
    trusted: "تعلم موثوق",
    curriculum: "منهج موثوق",
    teachers: "معلمون خبراء",
    stats: [
      { label: "الدورات", value: "12+" },
      { label: "الطلاب", value: "500+" },
      { label: "موثوق", value: "100%" },
    ],
    certificate: "شهادة",
    certificateDetail: "بعد إكمال الدورة",
    liveClasses: "دروس مباشرة",
    liveDetail: "القرآن • الحديث • التفسير",
    verified: "تعلم إسلامي موثق",
    imageAlt: "تعلم القرآن والعلوم الإسلامية عبر الإنترنت",
  },
} as const;

const statIcons = [<BookOpen size={24} key="courses" />, <Users size={24} key="students" />, <ShieldCheck size={24} key="authentic" />];

export async function Hero() {
  const locale = getLocaleFromCookies(await cookies());
  const content = heroContent[locale];

  return (
    <section className={styles.hero}>
      <div className={styles.patternLayer} />
      <div className={styles.goldGlow} />
      <div className={styles.greenGlow} />
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>{content.badge}</span>
          </div>

          <h1 className={styles.title}>{content.title}</h1>

          <p className={styles.description}>{content.description}</p>

          <div className={styles.miniHighlights}>
            {content.miniHighlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className={styles.coursePills}>
            {content.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/admission" className={styles.primaryButton}>
              {content.primaryAction}
            </Link>

            <Link href="/courses" className={styles.secondaryButton}>
              <PlayCircle size={21} />
              {content.secondaryAction}
            </Link>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.rating}>
              <div className={styles.stars}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <strong>{content.trusted}</strong>
            </div>

            <div className={styles.trustItem}>
              <CheckCircle2 size={18} />
              {content.curriculum}
            </div>

            <div className={styles.trustItem}>
              <CheckCircle2 size={18} />
              {content.teachers}
            </div>
          </div>

          <div className={styles.statsGrid}>
            {content.stats.map((stat, index) => (
              <div className={styles.statCard} key={stat.label}>
                <div className={styles.statIcon}>{statIcons[index]}</div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualFrame}>
            <Image
              src="/images/hero.webp"
              alt={content.imageAlt}
              width={820}
              height={620}
              priority
              className={styles.heroImage}
            />
          </div>

          <div className={styles.floatCardTop}>
            <span>{content.certificate}</span>
            <strong>{content.certificateDetail}</strong>
          </div>

          <div className={styles.floatCardBottom}>
            <GraduationCap size={22} />
            <div>
              <span>{content.liveClasses}</span>
              <strong>{content.liveDetail}</strong>
            </div>
          </div>

          <div className={styles.visualBadge}>
            <ShieldCheck size={20} />
            {content.verified}
          </div>
        </div>
      </div>
    </section>
  );
}
