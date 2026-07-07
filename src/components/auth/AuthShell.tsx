import styles from "./AuthForms.module.css";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: Array<{ title: string; text: string }>;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  benefits,
  children,
}: AuthShellProps) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.panel}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>

          <div className={styles.panelList}>
            {benefits.map((item) => (
              <div key={item.title} className={styles.panelItem}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>{children}</section>
      </div>
    </main>
  );
}
