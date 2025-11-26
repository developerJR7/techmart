import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TechMart - E-commerce Profissional",
  description: "Plataforma completa de e-commerce com tecnologia de ponta. Produtos de qualidade, pagamento seguro e entrega rápida.",
  keywords: ["e-commerce", "loja online", "tecnologia", "produtos", "compras online", "TechMart"],
  authors: [{ name: "TechMart" }],
  openGraph: {
    title: "TechMart - E-commerce Profissional",
    description: "Plataforma completa de e-commerce com tecnologia de ponta",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechMart - E-commerce Profissional",
    description: "Plataforma completa de e-commerce com tecnologia de ponta",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
