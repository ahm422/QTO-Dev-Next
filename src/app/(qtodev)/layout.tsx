import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export const revalidate = 3600;

export default function QTODevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
