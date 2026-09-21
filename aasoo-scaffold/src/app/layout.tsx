import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const iranSans = localFont({
  src: "../../public/fonts/iran-sans.woff2",
  variable: "--font-iran-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آسو مکرومه | دست‌بافت مکرومه",
  description:
    "فروشگاه آنلاین محصولات مکرومه دست‌بافت آسو. هر قطعه با دست بافته شده و منحصربفرد است.",
  metadataBase: new URL("https://aasoomacrame.example"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable} suppressHydrationWarning>
      <body className={cn(iranSans.className, "min-h-dvh bg-[#faf7f2] text-neutral-900")}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
