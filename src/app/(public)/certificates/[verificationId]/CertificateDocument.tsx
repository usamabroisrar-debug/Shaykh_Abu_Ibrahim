import Image from "next/image";
import styles from "./page.module.css";

type CertificateDocumentProps = {
  certificate: {
    certificateNo: string;
    verificationId: string;
    studentName: string;
    courseName: string;
    teacherName?: string | null;
    issuedAt: Date;
    siteSettings: {
      brandName: string;
      logoSrc: string;
    };
  };
};

export function CertificateDocument({ certificate }: CertificateDocumentProps) {
  return (
    <div className={styles.certificateCard}>
      <span className={styles.cornerTopLeft} aria-hidden="true" />
      <span className={styles.cornerTopRight} aria-hidden="true" />
      <span className={styles.cornerBottomLeft} aria-hidden="true" />
      <span className={styles.cornerBottomRight} aria-hidden="true" />
      <span className={styles.frameLineOuter} aria-hidden="true" />
      <span className={styles.frameLineInner} aria-hidden="true" />

      <div className={styles.certificateInner}>
        <div className={styles.brandRow}>
          <div className={styles.brandBlock}>
            <div className={styles.logoWrap}>
              <Image
                src={certificate.siteSettings.logoSrc}
                alt={certificate.siteSettings.brandName}
                width={92}
                height={92}
                className={styles.logo}
                priority
              />
            </div>
            <div>
              <strong className={styles.brandName}>
                {certificate.siteSettings.brandName}
              </strong>
              <span className={styles.brandSub}>
                Shaykh Abu Ibrahim Islamic Academy
              </span>
            </div>
          </div>

          <div className={styles.brandMeta}>
            <span className={styles.arabicLine}>بسم الله الرحمن الرحيم</span>
            <span>Official Shaykh Abu Ibrahim certification</span>
          </div>
        </div>

        <span className={styles.eyebrow}>Official Shaykh Abu Ibrahim certificate</span>

        <div className={styles.hero}>
          <h1>Certificate of Completion</h1>
          <span className={styles.heroDivider} aria-hidden="true" />
          <p className={styles.certifyLabel}>This is to certify that</p>
          <p>
            This document confirms that the learner below successfully completed
            a Shaykh Abu Ibrahim course and the record has been verified in the
            live system.
          </p>
        </div>

        <h2 className={styles.studentName}>{certificate.studentName}</h2>

        <p className={styles.courseLine}>
          has successfully completed <strong>{certificate.courseName}</strong>
        </p>

        <p className={styles.completionNote}>
          with guided study, verified progress, and successful completion under
          Shaykh Abu Ibrahim supervision.
        </p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <span>Certificate no</span>
            <strong>{certificate.certificateNo}</strong>
          </div>
          <div className={styles.detailCard}>
            <span>Verification id</span>
            <strong>{certificate.verificationId}</strong>
          </div>
          <div className={styles.detailCard}>
            <span>Issued by</span>
            <strong>{certificate.teacherName || "Shaykh Abu Ibrahim"}</strong>
          </div>
          <div className={styles.detailCard}>
            <span>Issued on</span>
            <strong>
              {certificate.issuedAt.toLocaleDateString("en-PK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </div>
        </div>

        <p className={styles.footerNote}>
          Verified against the Shaykh Abu Ibrahim database. Families and
          institutions can use the verification id above to confirm authenticity.
        </p>

        <div className={styles.signatureRow}>
          <div className={styles.signatureCard}>
            <span>Instructor</span>
            <strong>{certificate.teacherName || "Shaykh Abu Ibrahim"}</strong>
            <small>Course instructor / certifying teacher</small>
          </div>

          <div className={`${styles.signatureCard} ${styles.sealCard}`}>
            <span>Academy seal</span>
            <div className={styles.sealMedallion}>
              <div className={styles.sealCenter}>
                <Image
                  src={certificate.siteSettings.logoSrc}
                  alt={certificate.siteSettings.brandName}
                  width={70}
                  height={70}
                  className={styles.sealLogo}
                  priority
                />
              </div>
            </div>
            <strong>{certificate.siteSettings.brandName}</strong>
            <small>Official digital verification record</small>
          </div>

          <div className={styles.signatureCard}>
            <span>Status</span>
            <strong>Verified</strong>
            <small>Live record found in Shaykh Abu Ibrahim database</small>
          </div>
        </div>
      </div>
    </div>
  );
}
