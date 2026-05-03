import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bus Commuter | Live Routes, Stops, and Schedules",
    template: "%s | Bus Commuter",
  },
  description:
    "A premium bus information platform for discovering routes, stops, schedules, and nearby transit options.",
  keywords: ["bus routes", "commuter app", "transit schedules", "nearby bus stops"],
  openGraph: {
    title: "Bus Commuter",
    description: "Find reliable bus routes, stops, timings, and live status updates.",
    url: "https://bus-commuter.vercel.app/",
    siteName: "Bus Commuter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
