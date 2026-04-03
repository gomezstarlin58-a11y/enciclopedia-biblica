import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Biblia IA | La Sabiduría de los Siglos",
  description: "Plataforma de estudio teológico, comunidad e Inteligencia Artificial.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${inter.className} ${playfair.variable} bg-[#0c0d0c] text-[#F9F6F0] antialiased selection:bg-[#D1A65B]/30`}>
        {/* Aquí se cargará la presentación a pantalla completa */}
        {children}
      </body>
    </html>
  );
}