import Link from "next/link";
import { SocialIcon } from "@/components/shared/SocialIcon";
import styles from "./FloatingWhatsApp.module.css";

type FloatingWhatsAppProps = {
  href?: string;
};

export function FloatingWhatsApp({ href = "#" }: FloatingWhatsAppProps) {
  return (
    <Link
      href={href}
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
