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
            Choose a clear monthly rhythm, then start with a guided conversation
            before final enrollment.
          </p>
        </div>

        <div className={styles.quickBenefits}>
          <span>One-on-one live classes</span>
          <span>Flexible global timings</span>
          <span>Structured progress guidance</span>
        </div>

        <div className={styles.grid}>
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`${styles.card} ${plan.isPopular ? styles.popular : ""}`}
            >
              {plan.isPopular ? (
                <span className={styles.cornerBadge}>Recommended</span>
              ) : null}

              <div className={styles.planBar}>
                <span className={styles.planName}>{plan.name}</span>
                {plan.isPopular ? (
                  <span className={styles.badge}>Most Popular</span>
                ) : null}
              </div>

              <div className={styles.topRow}>
                <div>
                  <h3>
                    {plan.price} <small>{plan.cadence}</small>
                  </h3>
                  <p className={styles.classesLabel}>{plan.features[0]}</p>
                </div>
                <div className={styles.priceNote}>
                  <strong>Free trial</strong>
                  <span>Start before full admission</span>
                </div>
              </div>

              <p className={styles.description}>{plan.description}</p>

              <div className={styles.metaStrip}>
                <span>Online 1:1</span>
                <span>Flexible timings</span>
              </div>

              <div className={styles.featureList}>
                {plan.features.slice(1).map((feature) => (
                  <div key={feature} className={styles.feature}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <Button href="/admission" variant={plan.isPopular ? "primary" : "outline"}>
                  Start Free Trial
                </Button>
                <p className={styles.helper}>No payment required for first consultation</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
