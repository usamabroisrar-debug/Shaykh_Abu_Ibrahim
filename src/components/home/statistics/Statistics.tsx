import { Container, Section } from "@/components/shared";
import { statistics } from "@/data/statistics";
import styles from "./Statistics.module.css";

export function Statistics() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {statistics.map((stat) => (
            <article key={stat.id} className={styles.card}>
              <strong>{stat.value}</strong>
              <h2>{stat.label}</h2>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
