import Image from "next/image";
import Link from "next/link";
import { courseNavigation, footerNavigation } from "@/data/navigation";
import { getLocaleContent, type SiteLocale } from "@/lib/locale";
import { SocialIcon } from "@/components/shared/SocialIcon";
import styles from "./Footer.module.css";

type FooterProps = {
  locale: SiteLocale;
  brandName?: string;
  subtitle?: string;
  footerText?: string;
  logoSrc?: string;
  socials?: {
    youtube: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
    whatsappChat: string;
  };
};

export function Footer({
  locale,
  brandName = "Shaykh Abu Ibrahim",
  subtitle,
  footerText,
  logoSrc = "/images/logo-transparent.webp",
  socials,
}: FooterProps) {
  const content = getLocaleContent(locale);
  const socialData = socials || {
    youtube: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    whatsappChat: "",
  };
  const socialLinks = [
    {
      label: "YouTube",
      href: socialData.youtube,
      icon: <SocialIcon name="youtube" size={18} />,
    },
    {
      label: "Facebook",
      href: socialData.facebook,
      icon: <SocialIcon name="facebook" size={18} />,
    },
    {
      label: "Instagram",
      href: socialData.instagram,
      icon: <SocialIcon name="instagram" size={18} />,
    },
    {
      label: "TikTok",
      href: socialData.tiktok,
      icon: <SocialIcon name="tiktok" size={18} />,
    },
    {
      label: content.footer.whatsappChat,
      href: socialData.whatsappChat,
      icon: <SocialIcon name="whatsapp" size={18} />,
    },
    {
      label: content.footer.whatsappChannel,
      href: socialData.whatsapp,
      icon: <SocialIcon name="whatsapp" size={18} />,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Image
                src={logoSrc}
                alt={brandName}
                width={58}
                height={58}
                className={styles.brandLogo}
              />
            </div>
            <div>
              <p className={styles.brandTitle}>{brandName}</p>
              <p className={styles.brandSubtitle}>{subtitle || content.subtitle}</p>
            </div>
          </div>

          <p className={styles.brandText}>{footerText || content.footer.followText}</p>
        </div>

        <div className={styles.column}>
          <h3>{content.footer.courses}</h3>
          <div className={styles.links}>
            {courseNavigation.slice(0, 4).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>{content.footer.explore}</h3>
          <div className={styles.links}>
            {footerNavigation.explore.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>{content.footer.resources}</h3>
          <div className={styles.links}>
            {footerNavigation.resources.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>{content.footer.followUs}</h3>
          <p className={styles.socialText}>{content.footer.followText}</p>
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
        Copyright {new Date().getFullYear()} {brandName}. {content.footer.rights}
      </div>
    </footer>
  );
}
