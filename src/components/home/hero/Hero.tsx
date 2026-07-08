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
import styles from "./Hero.module.css";

const highlights = [
  "Qaida",
  "Nazra",
  "Hifz",
  "Tajweed",
  "Tarjuma",
  "Tafseer",
  "Hadith",
];

const stats = [
  {
    label: "Courses",
    value: "12+",
    icon: <BookOpen size={24} />,
  },
  {
    label: "Students",
    value: "500+",
    icon: <Users size={24} />,
  },
  {
    label: "Authentic",
    value: "100%",
    icon: <ShieldCheck size={24} />,
  },
];

export function Hero() {
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
            <span>Premium Online Islamic Academy</span>
          </div>

          <h1 className={styles.title}>
            Learn Quran Online With Authentic Islamic Guidance
          </h1>

          <p className={styles.description}>
            Build a strong foundation in Quran, Hadith and Islamic knowledge
            through structured online courses designed for children, adults and
            advanced learners.
          </p>

          <div className={styles.miniHighlights}>
            <span>One-to-one live classes</span>
            <span>Flexible worldwide timings</span>
            <span>Free trial available</span>
          </div>

          <div className={styles.coursePills}>
            {highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/admission" className={styles.primaryButton}>
              Apply for Admission
            </Link>

            <Link href="/courses" className={styles.secondaryButton}>
              <PlayCircle size={21} />
              Explore Courses
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
              <strong>Trusted Learning</strong>
            </div>

            <div className={styles.trustItem}>
              <CheckCircle2 size={18} />
              Authentic Curriculum
            </div>

            <div className={styles.trustItem}>
              <CheckCircle2 size={18} />
              Expert Teachers
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div className={styles.statCard} key={stat.label}>
                <div className={styles.statIcon}>{stat.icon}</div>
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
              alt="Online Quran and Islamic learning"
              width={820}
              height={620}
              priority
              className={styles.heroImage}
            />
          </div>

          <div className={styles.floatCardTop}>
            <span>Certificate</span>
            <strong>After Course Completion</strong>
          </div>

          <div className={styles.floatCardBottom}>
            <GraduationCap size={22} />
            <div>
              <span>Live Classes</span>
              <strong>Quran • Hadith • Tafseer</strong>
            </div>
          </div>

          <div className={styles.visualBadge}>
            <ShieldCheck size={20} />
            Verified Islamic Learning
          </div>
        </div>
      </div>
    </section>
  );
}
