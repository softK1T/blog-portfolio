import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: `${siteConfig.name} - Portfolio & Blog`,
  description: siteConfig.description,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: `${siteConfig.name} - Portfolio & Blog`,
    description: siteConfig.description,
    url: "https://example.com",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Portfolio & Blog`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.className} antialiased min-h-screen bg-background`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-3 py-2 rounded-md"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
