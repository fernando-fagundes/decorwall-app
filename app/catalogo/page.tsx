import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo Online - DecorWall",
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-4">
        <CatalogClient />
      </main>
      <Footer />
    </>
  );
}
