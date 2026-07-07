import { Check } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { pricingPlans } from "@/data/pricing";
import styles from "./PricingPlans.module.css";

export function PricingPlans() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Pricing Plans"
            title="Flexible online class plans for different study rhythms"
            description="A clean pricing structure helps families understand commitment, frequency, and support level before starting."
            align="left"
          />
          <p className={styles.note}>
            Inspired by common Quran academy pricing models, but presented here
            in a more premium, calmer, and easier-to-scan format.
          </p>
        </div>

        <div className={styles.grid}>
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`${styles.card} ${plan.isPopular ? styles.popular : ""}`}
            >
              <div className={styles.topRow}>
                <div>
                  <span className={styles.planName}>{plan.name}</span>
                  <h3>
                    {plan.price} <small>{plan.cadence}</small>
                  </h3>
                </div>
                {plan.isPopular ? (
                  <span className={styles.badge}>Most Popular</span>
                ) : null}
              </div>

              <p className={styles.description}>{plan.description}</p>

              <div className={styles.featureList}>
                {plan.features.map((feature) => (
                  <div key={feature} className={styles.feature}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button href="/admission" variant={plan.isPopular ? "primary" : "outline"}>
                Apply For Admission
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
