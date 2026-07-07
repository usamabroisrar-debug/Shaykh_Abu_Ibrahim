import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords = siteConfig.keywords,
  image = siteConfig.ogImage,
}: MetadataInput): Metadata {
  const canonical = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: `${siteConfig.url}${canonical === "/" ? "" : canonical}`,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
