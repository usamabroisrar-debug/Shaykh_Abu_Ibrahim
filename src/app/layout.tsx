import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shaykh Abu Ibrahim | Premium Islamic Learning Platform",
    template: "%s | Shaykh Abu Ibrahim",
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  icons: {
    icon: [
      { url: "/images/logo2.webp", type: "image/webp" },
      { url: "/images/logo-transparent.webp", type: "image/webp" },
    ],
    apple: [{ url: "/images/logo2.webp", type: "image/webp" }],
    shortcut: ["/images/logo2.webp"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Online Quran Classes with Shaykh Abu Ibrahim",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Islamic Academy`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Quran Classes with Shaykh Abu Ibrahim",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: "Shaykh Abu Ibrahim Islamic Academy",
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo-transparent.webp`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.socials),
  };

  return (
    <html lang="en">
      <body className={styles.body}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
