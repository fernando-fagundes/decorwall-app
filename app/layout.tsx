import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecorWall - Papel de Parede Personalizado",
  description: "Comércio e indústria de papel de parede",
  openGraph: {
    title: "DecorWall - Papel de Parede Personalizado",
    description: "Comércio e indústria de papel de parede",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
