import styles from "./Card.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div className={`${styles.card} ${hover ? styles.hover : ""} ${className}`}>
      {children}
    </div>
  );
}