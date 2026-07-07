import { ContactPage } from "@/components/public/contact/ContactPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact And Admissions",
  description:
    "Contact Shaykh Abu Ibrahim Islamic Academy for admissions help, course guidance, WhatsApp updates, and social channel connections.",
  path: "/contact",
});

export default function ContactRoute() {
  return <ContactPage />;
}
