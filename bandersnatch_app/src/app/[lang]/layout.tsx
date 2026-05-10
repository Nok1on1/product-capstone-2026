import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "@/app/globals.css";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientProviders } from "@/app/client-providers";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { AlertBanner } from "@/components/AlertBanner";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bandersnatch - Home",
  description: "Bus #3 Real-Time Tracker",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${lexend.variable} font-sans h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
        <template
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ClientProviders>
              <TopNav lang={lang} />
              <AlertBanner />
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
              <BottomNav lang={lang} />
            </ClientProviders>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
