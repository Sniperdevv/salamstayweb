import { LegalPage } from "@/components/legal/legal-page";
import { guestRefundPolicyPage } from "@/lib/content/legal/guest-refund-policy";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-012 — `/legal/guest-refund-policy`. The canonical cancellation source
 * (GATE 14 / F16): the Terms and the community standards both defer here
 * rather than restating a window, so there is one place a tier can be wrong.
 */
export const metadata = pageMetadata(
  guestRefundPolicyPage.path,
  guestRefundPolicyPage.metaDescription,
);

export default function GuestRefundPolicyPage() {
  return <LegalPage page={guestRefundPolicyPage} />;
}
