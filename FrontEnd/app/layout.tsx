import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Antenas de Ouro",
  description: "Sistema de Frequência Escolar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} antialiased min-h-screen`}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}