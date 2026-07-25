import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ORIGIN } from "@/lib/seo/route-registry";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: { absolute: "SalamStay" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-[100dvh] flex-col font-sans">
        {/* Shared web chrome. The header's search pill is prop-gated and off
            here; a discovery route group passes it once GW-002/003/005 land. */}
        <SiteHeader />
        <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
