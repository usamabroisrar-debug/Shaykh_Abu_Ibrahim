import styles from "./Badge.module.css";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "gold" | "green" | "dark";
  className?: string;
};

export function Badge({
  children,
  variant = "green",
  className = "",
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}