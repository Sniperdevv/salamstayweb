import { LegalPage } from "@/components/legal/legal-page";
import { cookiePolicyPage } from "@/lib/content/legal/cookie-policy";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-014 — `/legal/cookie-policy`. The card folds the root-layout consent
 * banner into this row; the banner itself lives in
 * `components/consent-banner.tsx` and is mounted once in `app/layout.tsx`.
 */
export const metadata = pageMetadata(cookiePolicyPage.path, cookiePolicyPage.metaDescription);

export default function CookiePolicyPage() {
  return <LegalPage page={cookiePolicyPage} />;
}
