import { Mail, MapPin } from "lucide-react";
import { Button, Card, Container, Section } from "@/components/shared";
import { ContactForm } from "@/components/lms/ContactForm";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { SocialIcon } from "@/components/shared/SocialIcon";
import { siteConfig } from "@/config/site";
import lmsStyles from "@/components/lms/LmsExperience.module.css";
import styles from "./ContactPage.module.css";

const contactMethods = [
  {
    title: "WhatsApp Channel",
    detail: "Daily updates, reminders, and admission touchpoints.",
    href: siteConfig.socials.whatsapp,
    icon: <SocialIcon name="whatsapp" size={22} />,
  },
  {
    title: "Instagram",
    detail: "Visual updates and academy highlights.",
    href: siteConfig.socials.instagram,
    icon: <SocialIcon name="instagram" size={22} />,
  },
  {
    title: "Facebook",
    detail: "Community presence and announcements.",
    href: siteConfig.socials.facebook,
    icon: <SocialIcon name="facebook" size={22} />,
  },
];

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach out for admissions, course guidance, and academy updates"
        description="If you want help choosing the right pathway or are preparing to enroll a child or family member, this is the best place to start."
      />

      <Section variant="white">
        <Container className={styles.grid}>
          <Card className={styles.primaryCard}>
            <h2>Admissions support</h2>
            <p>
              The academy now supports saved contact submissions as well, so you
              can either message us directly on social platforms or leave a
              structured inquiry for admissions and course guidance.
            </p>
            <div className={styles.ctas}>
              <Button href={siteConfig.socials.whatsapp} variant="primary">
                Open WhatsApp
              </Button>
              <Button href={siteConfig.socials.youtube} variant="outline">
                Visit YouTube
              </Button>
            </div>
          </Card>

          <div className={styles.methods}>
            {contactMethods.map((item) => (
              <Card key={item.title} className={styles.methodCard}>
                <div className={styles.iconWrap}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  Connect now
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={lmsStyles.formCard}>
            <h2>Send a structured inquiry</h2>
            <p>
              Share your course questions, admissions needs, or family learning
              goals and the message will be stored for follow-up.
            </p>
            <ContactForm />
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.infoStrip}>
          <div className={styles.infoCard}>
            <MapPin size={18} />
            <span>Serving online students and families globally</span>
          </div>
          <div className={styles.infoCard}>
            <Mail size={18} />
            <span>Social-first communication while the full admissions flow is built</span>
          </div>
        </Container>
      </Section>
    </>
  );
}
