import Link from "next/link";
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
        <svg
          viewBox="0 0 32 32"
          width="43"
          height="43"
          aria-hidden="true"
          className={styles.whatsappIcon}
        >
          <path d="M16.01 3.2c-7.06 0-12.8 5.68-12.8 12.67 0 2.24.6 4.42 1.73 6.34L3.1 28.8l6.82-1.78a12.94 12.94 0 0 0 6.09 1.52c7.06 0 12.8-5.68 12.8-12.67S23.07 3.2 16.01 3.2Zm0 23.18c-1.9 0-3.76-.5-5.38-1.45l-.39-.23-4.04 1.06 1.08-3.89-.25-.4a10.38 10.38 0 0 1-1.65-5.6c0-5.79 4.77-10.5 10.63-10.5s10.63 4.71 10.63 10.5-4.77 10.5-10.63 10.5Z" />
          <path d="M21.94 18.56c-.32-.16-1.9-.93-2.2-1.04-.3-.1-.52-.16-.74.16-.22.32-.85 1.04-1.04 1.26-.19.22-.38.24-.7.08-.32-.16-1.35-.49-2.56-1.56-.95-.84-1.59-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.57.16-.19.22-.32.32-.54.1-.22.05-.4-.03-.57-.08-.16-.74-1.77-1.01-2.42-.27-.63-.54-.54-.74-.55h-.63c-.22 0-.57.08-.87.4-.3.32-1.14 1.1-1.14 2.69 0 1.58 1.17 3.11 1.33 3.33.16.22 2.31 3.49 5.6 4.89.78.33 1.39.53 1.86.68.78.25 1.49.21 2.05.13.63-.09 1.9-.77 2.17-1.51.27-.74.27-1.38.19-1.51-.08-.13-.3-.22-.62-.38Z" />
        </svg>
      </span>
    </Link>
  );
}
