import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AppProviders } from "@/providers/AppProviders";
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
      { url: "/favicon-64x64.png", type: "image/png", sizes: "64x64" },
      { url: "/images/logo2.webp", type: "image/webp" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-64x64.png"],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rdf+xml": "/ontology.owl",
    },
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

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      logo: `${siteConfig.url}/images/logo2.webp`,
    },
  };

  return (
    <html lang="en">
      <body className={styles.body}>
        <AppProviders>{children}</AppProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </body>
    </html>
  );
}
