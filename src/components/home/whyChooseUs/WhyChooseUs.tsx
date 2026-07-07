import {
  BookOpenCheck,
  Clock3,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/shared";
import { academyFeatures } from "@/data/features";
import styles from "./WhyChooseUs.module.css";

const icons = [ShieldCheck, BookOpenCheck, Globe2, Clock3];

export function WhyChooseUs() {
  return (
    <Section variant="white" className={styles.section}>
      <Container className={styles.layout}>
        <div className={styles.intro}>
          <SectionTitle
            eyebrow="Why Choose Us"
            title="A premium online academy built for trust, depth, and consistency"
            description="Our experience is shaped to feel polished on the surface and dependable underneath, with real structure for students and families."
            align="left"
          />

          <div className={styles.assuranceCard}>
            <div className={styles.assuranceIcon}>
              <Sparkles size={22} />
            </div>
            <div>
              <strong>Designed for long-term learning</strong>
              <p>
                From onboarding to course completion, each touchpoint is being
                built to support clarity, accountability, and barakah in study.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {academyFeatures.map((feature, index) => {
            const Icon = icons[index];

            return (
              <article key={feature.id} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
