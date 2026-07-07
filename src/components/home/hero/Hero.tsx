import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Globe2, GraduationCap, PlayCircle, Star } from "lucide-react";
import { Button, Badge } from "@/components/shared";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.pattern} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <Star size={16} />
            Online Islamic Learning Platform
          </div>

          <h1 className={styles.title}>
            Learn Quran Online With Authentic Islamic Guidance
          </h1>

          <p className={styles.description}>
            Study Qaida, Nazra, Hifz, Tajweed, Quran Translation, Tafseer and
            Hadith through structured online courses designed for children,
            adults and advanced learners.
          </p>

          <div className={styles.actions}>
            <Link href="/admission" className={styles.primaryButton}>
              Apply for Admission
            </Link>

            <Link href="/courses" className={styles.secondaryButton}>
              <PlayCircle size={20} />
              Explore Courses
            </Link>
          </div>

          <div className={styles.trustList}>
            <span>
              <CheckCircle2 size={18} />
              Authentic Curriculum
            </span>
            <span>
              <CheckCircle2 size={18} />
              Expert Teachers
            </span>
            <span>
              <CheckCircle2 size={18} />
              Online Classes
            </span>
          </div>

          <div className={styles.stats}>
            <div>
              <BookOpen size={24} />
              <strong>12+</strong>
              <span>Courses</span>
            </div>

            <div>
              <GraduationCap size={24} />
              <strong>500+</strong>
              <span>Students</span>
            </div>

            <div>
              <Globe2 size={24} />
              <strong>24/7</strong>
              <span>Online Access</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageCard}>
            <Image
              src="/images/hero.webp"
              alt="Quran learning online"
              width={760}
              height={560}
              priority
              className={styles.heroImage}
            />
          </div>

          <div className={styles.floatingCardOne}>
            <span>Live Classes</span>
            <strong>Quran • Hadith • Tafseer</strong>
          </div>

          <div className={styles.floatingCardTwo}>
            <span>Certificate</span>
            <strong>After Course Completion</strong>
          </div>
        </div>
      </div>
    </section>
  );
}