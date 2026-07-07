import styles from "./Section.module.css";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "white" | "dark";
};

export function Section({
  children,
  className = "",
  variant = "light",
}: SectionProps) {
  return (
    <section className={`${styles.section} ${styles[variant]} ${className}`}>
      {children}
    </section>
  );
}