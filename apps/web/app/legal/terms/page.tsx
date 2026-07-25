import { LegalPage } from "@/components/legal/legal-page";
import { termsPage } from "@/lib/content/legal/terms";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-010 — `/legal/terms`. Layout in `components/legal/legal-page.tsx`, copy in
 * `lib/content/legal/terms.ts`; title, robots and canonical come off the route
 * registry so they cannot drift from the declared contract (G4/G6/G41).
 */
export const metadata = pageMetadata(termsPage.path, termsPage.metaDescription);

export default function TermsOfServicePage() {
  return <LegalPage page={termsPage} />;
}
