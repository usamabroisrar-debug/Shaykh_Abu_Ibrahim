import styles from "./PageShell.module.css";

type PageShellProps = {
  title: string;
  description: string;
};

export function PageShell({ title, description }: PageShellProps) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.kicker}>In Progress</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </main>
  );
}
