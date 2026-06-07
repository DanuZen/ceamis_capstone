import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEAMIS — Control Every Awful Money Impulse System",
  description:
    "Ekosistem pencatatan keuangan Gen-Z berbasis AI, gamifikasi, & edukasi adaptif. Cerdas finansial, kontrol impuls, raih masa depan!",
  keywords: ["keuangan", "Gen-Z", "AI", "gamifikasi", "edukasi finansial", "CEAMIS"],
  icons: {
    icon: "/images/logo_stroke_black.webp",
    shortcut: "/images/logo_stroke_black.webp",
    apple: "/images/logo_stroke_black.webp",
  },
  openGraph: {
    title: "CEAMIS — Control Every Awful Money Impulse System",
    description: "Ekosistem pencatatan keuangan Gen-Z berbasis AI, gamifikasi, & edukasi adaptif. Cerdas finansial, kontrol impuls, raih masa depan!",
    url: "https://ceamis-capstone.vercel.app",
    siteName: "CEAMIS",
    images: [
      {
        url: "https://ceamis-capstone.vercel.app/images/ceamis-og.png",
        width: 1200,
        height: 630,
        alt: "CEAMIS – Aplikasi Keuangan Gen-Z",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CEAMIS — Control Every Awful Money Impulse System",
    description: "Ekosistem pencatatan keuangan Gen-Z berbasis AI, gamifikasi, & edukasi adaptif.",
    images: ["https://ceamis-capstone.vercel.app/images/ceamis-og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
