import { cookies } from "next/headers";
import { Mail, MapPin } from "lucide-react";
import { Button, Card, Container, Section } from "@/components/shared";
import { ContactForm } from "@/components/lms/ContactForm";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { SocialIcon } from "@/components/shared/SocialIcon";
import { siteConfig } from "@/config/site";
import { getLocaleContent, getLocaleFromCookies } from "@/lib/locale";
import lmsStyles from "@/components/lms/LmsExperience.module.css";
import styles from "./ContactPage.module.css";

export async function ContactPage() {
  const locale = getLocaleFromCookies(await cookies());
  const content = getLocaleContent(locale);
  const contactMethods = [
    {
      title: content.contact.whatsappChat,
      detail: content.contact.whatsappChatText,
      href: siteConfig.socials.whatsappChat,
      icon: <SocialIcon name="whatsapp" size={22} />,
    },
    {
      title: content.contact.whatsappChannel,
      detail: content.contact.whatsappChannelText,
      href: siteConfig.socials.whatsapp,
      icon: <SocialIcon name="whatsapp" size={22} />,
    },
    {
      title: content.contact.instagram,
      detail: content.contact.instagramText,
      href: siteConfig.socials.instagram,
      icon: <SocialIcon name="instagram" size={22} />,
    },
    {
      title: content.contact.facebook,
      detail: content.contact.facebookText,
      href: siteConfig.socials.facebook,
      icon: <SocialIcon name="facebook" size={22} />,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={content.contact.eyebrow}
        title={content.contact.title}
        description={content.contact.description}
      />

      <Section variant="white">
        <Container className={styles.grid}>
          <Card className={styles.primaryCard}>
            <h2>{content.contact.admissionsSupport}</h2>
            <p>{content.contact.admissionsSupportText}</p>
            <div className={styles.ctas}>
              <Button href={siteConfig.socials.whatsappChat} variant="primary">
                {content.contact.chatWhatsapp}
              </Button>
              <Button href={siteConfig.socials.whatsapp} variant="outline">
                {content.contact.joinChannel}
              </Button>
              <Button href={siteConfig.socials.youtube} variant="ghost">
                {content.contact.visitYoutube}
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
            <span>Structured inquiries and admissions follow-up are both available now</span>
          </div>
        </Container>
      </Section>
    </>
  );
}
