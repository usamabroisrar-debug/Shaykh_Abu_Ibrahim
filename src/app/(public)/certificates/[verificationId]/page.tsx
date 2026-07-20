import { notFound } from "next/navigation";
import { CertificatePrintButton } from "@/components/certificates/CertificatePrintButton";
import { Badge, Button, Container, Section } from "@/components/shared";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getLocalizedSiteSettings } from "@/services/settings/site-settings.service";
import { CertificateDocument } from "./CertificateDocument";
import styles from "./page.module.css";

export async function generateMetadata(
  props: PageProps<"/certificates/[verificationId]">,
) {
  const { verificationId } = await props.params;

  return buildMetadata({
    title: `Certificate Verification ${verificationId}`,
    description:
      "Verify a Shaykh Abu Ibrahim certificate using its unique verification identifier.",
    path: `/certificates/${verificationId}`,
  });
}

export default async function CertificateVerificationPage(
  props: PageProps<"/certificates/[verificationId]">,
) {
  const { verificationId } = await props.params;

  let certificate = null;

  try {
    const [certificateRecord, siteSettings] = await Promise.all([
      prisma.certificate.findUnique({
        where: { verificationId },
      }),
      getLocalizedSiteSettings("en"),
    ]);

    certificate = certificateRecord
      ? {
          ...certificateRecord,
          siteSettings,
        }
      : null;
  } catch {
    certificate = null;
  }

  if (!certificate) {
    notFound();
  }

  const printHref = `/certificates/${verificationId}/print`;

  return (
    <Section className={styles.printSection}>
      <Container className={styles.printContainer}>
        <div className={styles.page}>
          <div className={styles.topBar}>
            <Badge variant="gold">Certificate verified</Badge>
            <CertificatePrintButton href={printHref} />
          </div>

          <CertificateDocument certificate={certificate} />

          <div className={styles.actions}>
            <Button href="/courses">Explore Courses</Button>
            <CertificatePrintButton href={printHref} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
