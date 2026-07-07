import { Award, BookOpenText, Globe2, HeartHandshake } from "lucide-react";
import { Card, Container, Section, SectionTitle } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import styles from "./AboutPage.module.css";

const values = [
  {
    title: "Authentic learning",
    description:
      "Every pathway is shaped around dependable Islamic knowledge, respectful teaching, and practical clarity.",
    icon: <BookOpenText size={24} />,
  },
  {
    title: "Family-friendly delivery",
    description:
      "Our learning experience is being built for children, adults, and households balancing faith goals with modern schedules.",
    icon: <HeartHandshake size={24} />,
  },
  {
    title: "Global online access",
    description:
      "Live classes, guided study, and mentor touchpoints make it easier for learners worldwide to stay connected and consistent.",
    icon: <Globe2 size={24} />,
  },
  {
    title: "Premium standards",
    description:
      "We care about scholarship and presentation together, so students experience both beauty and substance from the first visit.",
    icon: <Award size={24} />,
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About The Academy"
        title="A modern Islamic academy built around structure, sincerity, and steady progress"
        description="Shaykh Abu Ibrahim Islamic Academy is being shaped as a complete digital learning environment for Quran, Tajweed, Hifz, Tafseer, Hadith, Fiqh, and family-centered Islamic education."
        primaryCta={{ label: "Explore Courses", href: "/courses" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />

      <Section variant="white">
        <Container className={styles.storyGrid}>
          <div className={styles.story}>
            <SectionTitle
              eyebrow="Our Mission"
              title="We want online Islamic education to feel serious, welcoming, and beautifully organized"
              description="The academy vision is to help students build strong Quran foundations, deeper understanding, and lasting study habits through clear pathways and thoughtful teaching."
              align="left"
            />
          </div>

          <Card className={styles.statement}>
            <p>
              Students should not have to choose between authentic scholarship
              and a polished modern learning experience. We are building both
              together.
            </p>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="What We Stand For"
            title="Core principles guiding the academy experience"
            description="These values shape how we present courses, communicate with families, and design the broader LMS roadmap."
          />

          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <Card key={value.title} className={styles.valueCard}>
                <div className={styles.iconWrap}>{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
