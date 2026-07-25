import { LegalPage } from "@/components/legal/legal-page";
import { privacyPage } from "@/lib/content/legal/privacy";
import { pageMetadata } from "@/lib/seo/metadata";

/** GW-011 — `/legal/privacy`. See `components/legal/legal-page.tsx` for the contract. */
export const metadata = pageMetadata(privacyPage.path, privacyPage.metaDescription);

export default function PrivacyPolicyPage() {
  return <LegalPage page={privacyPage} />;
}
