import { Footer } from "@/components/layout/footer/Footer";
import { FloatingWhatsApp } from "@/components/layout/floatingWhatsApp/FloatingWhatsApp";
import { Navbar } from "@/components/layout/navbar/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="pageShell">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
