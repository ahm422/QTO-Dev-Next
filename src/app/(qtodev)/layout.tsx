import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroScrollProvider } from "@/contexts/HeroScrollContext";

export default function QTODevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroScrollProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </HeroScrollProvider>
    </div>
  );
}
