import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SocialIcon } from "@/components/shared/SocialIcon";
import styles from "./FloatingWhatsApp.module.css";

export function FloatingWhatsApp() {
  return (
    <Link
      href={siteConfig.socials.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp"
      className={styles.button}
    >
      <span className={styles.tooltip}>WhatsApp</span>
      <span className={styles.iconWrap}>
        <SocialIcon name="whatsapp" size={22} />
      </span>
    </Link>
  );
}
