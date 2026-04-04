import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblia IA - La Sabiduría de los Siglos",
  description: "Enciclopedia Bíblica interactiva con IA y Patrística",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      {/* 👇 Aquí eliminamos el 'div' asfixiante y dejamos que los hijos ocupen toda la pantalla 👇 */}
      <body className={`${playfair.className} bg-[#0c0d0c] text-[#F9F6F0] antialiased min-h-screen w-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}