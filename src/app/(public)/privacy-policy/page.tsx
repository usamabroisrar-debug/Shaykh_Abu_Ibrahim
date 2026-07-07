import { UtilityPage } from "@/components/public/utility/UtilityPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how Shaykh Abu Ibrahim Islamic Academy may collect, use, and protect student, parent, and visitor information across the website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyRoute() {
  return (
    <UtilityPage
      eyebrow="Privacy Policy"
      title="How academy information is expected to be handled with care"
      description="This policy page sets the baseline for respectful data handling while the academy platform continues to grow into a fuller LMS."
      sections={[
        {
          title: "Information we may collect",
          body: "Depending on the feature, the academy may collect names, contact details, student level information, course preferences, and communications relevant to admissions or learning support.",
        },
        {
          title: "How information may be used",
          body: "Collected information is intended to support admissions guidance, student communication, course coordination, platform improvements, and a better learning experience.",
        },
        {
          title: "Protection and access",
          body: "Sensitive student and family information should be handled carefully, stored securely, and accessed only where needed for legitimate academy operations.",
        },
        {
          title: "Future platform updates",
          body: "As the LMS expands with dashboards, quizzes, certificates, and payments, this privacy policy can be extended with clearer operational and legal detail.",
        },
      ]}
      primaryCta={{ label: "Contact The Academy", href: "/contact" }}
    />
  );
}
