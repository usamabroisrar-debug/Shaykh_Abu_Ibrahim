import { AboutPage } from "@/components/public/about/AboutPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About The Academy",
  description:
    "Learn how Shaykh Abu Ibrahim Islamic Academy combines authentic scholarship, structured online learning, and family-friendly Islamic education.",
  path: "/about",
});

export default function AboutRoute() {
  return <AboutPage />;
}
