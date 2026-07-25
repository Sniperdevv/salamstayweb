import { LegalPage } from "@/components/legal/legal-page";
import { communityStandardsPage } from "@/lib/content/legal/community-standards";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-013 — `/legal/community-standards`. The host-preference framing in
 * "Respect for the home" is structural, not decorative: see the NEVER #3 note
 * at the head of `lib/content/legal/community-standards.ts`.
 */
export const metadata = pageMetadata(
  communityStandardsPage.path,
  communityStandardsPage.metaDescription,
);

export default function CommunityStandardsPage() {
  return <LegalPage page={communityStandardsPage} />;
}
