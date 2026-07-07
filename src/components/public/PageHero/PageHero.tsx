import { Badge, Button, Container, Section } from "@/components/shared";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.copy}>
          <Badge variant="gold">{eyebrow}</Badge>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>

          {(primaryCta || secondaryCta) && (
            <div className={styles.actions}>
              {primaryCta ? (
                <Button href={primaryCta.href} variant="primary">
                  {primaryCta.label}
                </Button>
              ) : null}

              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="outline">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
