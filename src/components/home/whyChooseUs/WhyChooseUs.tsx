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
            title="Why families choose a clearer, more structured Quran learning experience"
            description="The academy is designed around trust, teacher quality, and a smoother online journey from trial class to consistent progress."
            align="left"
          />

          <div className={styles.assuranceCard}>
            <div className={styles.assuranceIcon}>
              <Sparkles size={22} />
            </div>
            <div>
              <strong>Designed for long-term learning</strong>
              <p>
                From the first class to sustained study, every touchpoint is
                organized to support clarity, accountability, and steady growth.
              </p>
            </div>
          </div>

          <div className={styles.sidePoints}>
            <div>
              <strong>Personal attention</strong>
              <p>Live one-to-one guidance keeps every student supported at their own pace.</p>
            </div>
            <div>
              <strong>Global flexibility</strong>
              <p>Schedules can adapt across time zones for children, adults, and families.</p>
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
