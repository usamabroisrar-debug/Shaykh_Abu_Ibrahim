import { cookies } from "next/headers";
import { Footer } from "@/components/layout/footer/Footer";
import { FloatingWhatsApp } from "@/components/layout/floatingWhatsApp/FloatingWhatsApp";
import { LocaleBar } from "@/components/layout/localeBar/LocaleBar";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { getLocaleFromCookies } from "@/lib/locale";
import { getLocalizedSiteSettings } from "@/services/settings/site-settings.service";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocaleFromCookies(await cookies());
  const settings = await getLocalizedSiteSettings(locale);

  return (
    <>
      <LocaleBar locale={locale} />
      <Navbar
        locale={locale}
        brandName={settings.brandName}
        subtitle={settings.subtitle}
        logoSrc={settings.logoSrc}
      />
      <main className="pageShell">{children}</main>
      <Footer
        locale={locale}
        brandName={settings.brandName}
        subtitle={settings.subtitle}
        footerText={settings.footerText}
        logoSrc={settings.logoSrc}
        socials={settings.socials}
      />
      <FloatingWhatsApp href={settings.socials.whatsappChat} />
    </>
  );
}
