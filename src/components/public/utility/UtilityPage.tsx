import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Card, Container, Section, SectionTitle } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import styles from "./UtilityPage.module.css";

type UtilityPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  highlights?: string[];
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export function UtilityPage({
  eyebrow,
  title,
  description,
  sections,
  highlights = [],
  primaryCta,
  secondaryCta,
}: UtilityPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />

      {highlights.length ? (
        <Section variant="white">
          <Container>
            <div className={styles.highlights}>
              {highlights.map((item) => (
                <div key={item} className={styles.highlight}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Details"
            title="Important information"
            description="Clear, readable sections so students and families can understand expectations without friction."
          />
          <div className={styles.grid}>
            {sections.map((section) => (
              <Card key={section.title} className={styles.card} hover={false}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </Card>
            ))}
          </div>

          {primaryCta || secondaryCta ? (
            <div className={styles.actions}>
              {primaryCta ? (
                <Button href={primaryCta.href} variant="primary">
                  {primaryCta.label}
                  <ArrowRight size={18} />
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="outline">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
