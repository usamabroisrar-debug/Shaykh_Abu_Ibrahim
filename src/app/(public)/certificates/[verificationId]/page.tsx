import { notFound } from "next/navigation";
import { Badge, Button, Container, Section } from "@/components/shared";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import styles from "@/components/lms/LmsExperience.module.css";

export async function generateMetadata(
  props: PageProps<"/certificates/[verificationId]">,
) {
  const { verificationId } = await props.params;

  return buildMetadata({
    title: `Certificate Verification ${verificationId}`,
    description:
      "Verify an academy certificate using its unique verification identifier.",
    path: `/certificates/${verificationId}`,
  });
}

export default async function CertificateVerificationPage(
  props: PageProps<"/certificates/[verificationId]">,
) {
  const { verificationId } = await props.params;

  let certificate = null;

  try {
    certificate = await prisma.certificate.findUnique({
      where: { verificationId },
    });
  } catch {
    certificate = null;
  }

  if (!certificate) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <div className={styles.formCard}>
          <Badge variant="gold">Certificate verified</Badge>
          <h1 style={{ marginTop: 16, marginBottom: 12 }}>Verification successful</h1>
          <p style={{ marginBottom: 20 }}>
            This certificate record matches a valid academy issuance.
          </p>
          <div className={styles.list}>
            <div className={styles.listItem}>
              <strong>Certificate number</strong>
              <div className={styles.listItemMeta}>{certificate.certificateNo}</div>
            </div>
            <div className={styles.listItem}>
              <strong>Student name</strong>
              <div className={styles.listItemMeta}>{certificate.studentName}</div>
            </div>
            <div className={styles.listItem}>
              <strong>Course name</strong>
              <div className={styles.listItemMeta}>{certificate.courseName}</div>
            </div>
            <div className={styles.listItem}>
              <strong>Issued at</strong>
              <div className={styles.listItemMeta}>
                {certificate.issuedAt.toDateString()}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <Button href="/courses">Explore Courses</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
