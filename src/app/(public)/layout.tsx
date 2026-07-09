import { cookies } from "next/headers";
import { Footer } from "@/components/layout/footer/Footer";
import { FloatingWhatsApp } from "@/components/layout/floatingWhatsApp/FloatingWhatsApp";
import { LocaleBar } from "@/components/layout/localeBar/LocaleBar";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { getLocaleFromCookies } from "@/lib/locale";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocaleFromCookies(await cookies());

  return (
    <>
      <LocaleBar locale={locale} />
      <Navbar locale={locale} />
      <main className="pageShell">{children}</main>
      <Footer locale={locale} />
      <FloatingWhatsApp />
    </>
  );
}
