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
