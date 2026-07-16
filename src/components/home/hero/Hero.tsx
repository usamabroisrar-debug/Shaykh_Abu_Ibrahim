import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { getLocaleFromCookies } from "@/lib/locale";
import { getLocalizedHomepageHeroSettings } from "@/services/settings/site-settings.service";
import styles from "./Hero.module.css";

export async function Hero() {
  const locale = getLocaleFromCookies(await cookies());
  const content = await getLocalizedHomepageHeroSettings(locale);

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

        </div>

        <div className={styles.visual}>
          <div className={styles.visualFrame}>
            <Image
              src={content.imageSrc}
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
