import { UtilityPage } from "@/components/public/utility/UtilityPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms And Conditions",
  description:
    "Review the expected terms for using the academy website, courses, resources, and future student learning services.",
  path: "/terms",
});

export default function TermsRoute() {
  return (
    <UtilityPage
      eyebrow="Terms"
      title="Basic terms for using the academy website and learning services"
      description="These terms provide a practical baseline for website use, course participation, and respectful engagement as the platform expands."
      sections={[
        {
          title: "Using the website",
          body: "Visitors are expected to use the academy website responsibly, respectfully, and only for legitimate educational, informational, and communication purposes.",
        },
        {
          title: "Learning participation",
          body: "Students and families should follow teacher guidance, class expectations, and academy communication standards in ways that support a respectful learning environment.",
        },
        {
          title: "Content and materials",
          body: "Academy resources, lesson structures, and branded materials should be treated as protected educational content and not reused inappropriately.",
        },
        {
          title: "Platform evolution",
          body: "As the LMS grows to include dashboards, assessments, certificates, and payments, these terms can be expanded with more detailed service conditions.",
        },
      ]}
      primaryCta={{ label: "View Privacy Policy", href: "/privacy-policy" }}
      secondaryCta={{ label: "Contact Support", href: "/contact" }}
    />
  );
}
