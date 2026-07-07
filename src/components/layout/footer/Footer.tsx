import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { courseNavigation, footerNavigation } from "@/data/navigation";
import { SocialIcon } from "@/components/shared/SocialIcon";
import styles from "./Footer.module.css";

export function Footer() {
  const socialLinks = [
    {
      label: "YouTube",
      href: siteConfig.socials.youtube,
      icon: <SocialIcon name="youtube" size={18} />,
    },
    {
      label: "Facebook",
      href: siteConfig.socials.facebook,
      icon: <SocialIcon name="facebook" size={18} />,
    },
    {
      label: "Instagram",
      href: siteConfig.socials.instagram,
      icon: <SocialIcon name="instagram" size={18} />,
    },
    {
      label: "TikTok",
      href: siteConfig.socials.tiktok,
      icon: <SocialIcon name="tiktok" size={18} />,
    },
    {
      label: "WhatsApp",
      href: siteConfig.socials.whatsapp,
      icon: <SocialIcon name="whatsapp" size={18} />,
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Image
                src="/images/logo-transparent.webp"
                alt="Shaykh Abu Ibrahim"
                width={58}
                height={58}
                className={styles.brandLogo}
              />
            </div>
            <div>
              <p className={styles.brandTitle}>Shaykh Abu Ibrahim</p>
              <p className={styles.brandSubtitle}>Islamic Learning Platform</p>
            </div>
          </div>

          <p className={styles.brandText}>
            Quran, Hadith, Fiqh, Tafseer, and guided Islamic learning in a more
            refined online experience for students and families.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Courses</h3>
          <div className={styles.links}>
            {courseNavigation.slice(0, 4).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Explore</h3>
          <div className={styles.links}>
            {footerNavigation.explore.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Resources</h3>
          <div className={styles.links}>
            {footerNavigation.resources.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Follow Us</h3>
          <p className={styles.socialText}>
            Connect with us for daily Islamic reminders, course updates, and
            academy announcements.
          </p>
          <div className={styles.socialLinks}>
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className={styles.socialLink}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        Copyright {new Date().getFullYear()} Shaykh Abu Ibrahim. All rights
        reserved.
      </div>
    </footer>
  );
}
