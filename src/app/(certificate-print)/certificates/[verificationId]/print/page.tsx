import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateAutoPrint } from "@/components/certificates/CertificateAutoPrint";
import { prisma } from "@/lib/prisma";
import { getLocalizedSiteSettings } from "@/services/settings/site-settings.service";
import { CertificateDocument } from "@/app/(public)/certificates/[verificationId]/CertificateDocument";
import styles from "@/app/(public)/certificates/[verificationId]/page.module.css";

export default async function CertificatePrintPage(
  props: PageProps<"/certificates/[verificationId]/print">,
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

  return (
    <main className={styles.printOnlyPage}>
      <div className={styles.printOnlyActions}>
        <span>Print dialog will open automatically.</span>
        <Link href={`/certificates/${verificationId}`}>Back to verification</Link>
      </div>
      <CertificateDocument certificate={certificate} />
      <CertificateAutoPrint />
    </main>
  );
}
