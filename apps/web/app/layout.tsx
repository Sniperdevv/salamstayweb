import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConsentBanner } from "@/components/consent-banner";
import { GuestChrome } from "@/components/guest-chrome";
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
            here; a discovery route group passes it once GW-002/003/005 land.

            Wrapped in `GuestChrome` because `/host/*` carries its own header and
            no site footer (HOST-SHELL §1), and a host layout cannot unrender
            what this one rendered. The gate resolves during SSR, so the host
            routes never emit this chrome at all. */}
        <GuestChrome>
          <SiteHeader />
        </GuestChrome>
        <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <GuestChrome>
          <SiteFooter />
        </GuestChrome>
        {/* GW-014 root-layout consent overlay. Client-only and mounted last, so
            it never appears in the initial HTML the SEO gates parse (G61) and
            never precedes the page's own content in the reading order.
            EXTENDED-GATES.md:201 permits it explicitly; it is not an
            interstitial. */}
        <ConsentBanner />
      </body>
    </html>
  );
}
