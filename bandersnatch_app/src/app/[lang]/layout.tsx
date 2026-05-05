import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";

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
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning className={`${lexend.variable} font-sans h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-screen bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TopNav lang={lang} />
            {children}
            <BottomNav lang={lang} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
