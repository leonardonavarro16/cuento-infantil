import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

// Título: muy bold, chunky, impacto visual máximo — ideal para cuentos infantiles
const lilitaOne = Lilita_One({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400", // Lilita One solo tiene un peso (ya es ultra-bold por diseño)
});

// Narración: redonda y muy legible para niños
const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "El Gato con Botas",
  description: "Un cuento interactivo de Charles Perrault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lilitaOne.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
