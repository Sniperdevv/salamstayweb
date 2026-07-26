"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { TabLink, TabStrip, TabStripSpacer } from "@/components/ui/tab-strip";
import { btnOutline, btnPrimary } from "@/components/ui";
import { PlusIcon } from "./host-icons";
import { hostChromeGutter, hostNavCtaShape } from "./host-ui";

/**
 * The host section nav — `ha-046`'s `.hostnav`, matched by `hw-001` panel D and
 * `hw-007` panels D/E, and specified by `HOST-SHELL.md` §2b.
 *
 * Six destinations and a trailing `Create a listing`, on a hairline, no shadow
 * (§8: it does not float over scrolled content, so it does not cast). The skin
 * and the whole keyboard contract come from `components/ui/tab-strip.tsx`; this
 * file supplies the destinations, the current-route test and the CTA's colour.
 *
 * THE ACTIVE UNDERLINE IS BRAND HERE, AND ONLY HERE
 * -------------------------------------------------
 * `TabStrip`'s default indicator is ink, which is what TASTE §3 says without an
 * exception. §2b rules specifically on this strip: `ha-046`'s brand underline,
 * the `Hosting` chip and the brand avatar put the host app surface over §2's
 * four green roles, and they are **"flagged, not fixed… Inherit them; do not
 * 'fix' them ad hoc on a sibling card, and do not invent new brand roles
 * either."** So `indicator="brand"` is passed here deliberately, it is the
 * inheritance rather than a preference, and re-adjudicating it belongs to the
 * corpus sweep.
 */

export interface HostSection {
  readonly href: string;
  readonly label: string;
}

/**
 * §2b's six, in the card's order. Today is the shell's home — the wordmark
 * points at it too.
 *
 * Four of the six have no page yet and resolve as registry stubs. They are in
 * the nav anyway because the nav is a fact about the product's shape, not about
 * this week's build order, and a section that appears when its page lands would
 * make the chrome move under a host who had learned where things are.
 */
export const HOST_SECTIONS: readonly HostSection[] = [
  { href: "/host/today", label: "Today" },
  { href: "/host/calendar", label: "Calendar" },
  { href: "/host/listings", label: "Listings" },
  { href: "/host/reservations", label: "Reservations" },
  { href: "/host/earnings", label: "Earnings" },
  { href: "/host/insights", label: "Insights" },
];

/** Step 1 of the nine-step wizard — `HOST-SHELL.md` §15. */
export const CREATE_LISTING_HREF = "/host/listings/new/property-type";

/**
 * GREEN DOCTRINE ON THIS SHELL — the nav CTA yields to a page-owned primary.
 *
 * The identical rule `components/header-cta.ts` states for the guest header's
 * `Sign up`, and `hw-007` draws the resolution rather than leaving it to be
 * inferred: panel D's nav CTA is `.btn.btn-primary` (green) because that page's
 * own actions are all §5 gray-fill secondaries, and panel E's is `.btn.yield`
 * (ink outline) because the first-run empty's `Create a listing` IS the
 * surface's one primary — and it is the same action, so a green pair would be
 * one call rendered twice in the colour that means "this is the call".
 * `ha-046` shipped exactly that duplicate; `hw-007` is the correction.
 *
 * WHY A PATH SET AND NOT A PROP
 * -----------------------------
 * The nav is drawn once, in the layout, so a page cannot hand it a flag. The
 * yield is therefore declared here beside the routes it applies to — the same
 * shape and the same trade-off `header-cta.ts` already lives with.
 *
 * WHAT PUTS A ROUTE ON THIS LIST, so the next person can take one off: the
 * page's body renders a green primary. Both host surfaces do today because both
 * are in their first-run empty, and the empty's one next step is the green.
 * `/host/listings` comes off this list the moment it has a listing row to draw
 * — `hw-001` panel D's rows carry `Edit listing` and `Continue setup`, both
 * gray-fill, and with nothing green in the body the nav takes the green back.
 */
const CTA_OWNED_BY_PAGE: ReadonlySet<string> = new Set(["/host/today", "/host/listings"]);

/**
 * The same rule for a SUBTREE, because a dynamic route cannot be a member of a
 * set of literal paths.
 *
 * `/host/reservations/{id}` renders `Accept request` — the surface's one green
 * primary, and the only place in this product where a host commits to a
 * booking. The trailing slash is load-bearing: it matches every reservation and
 * NOT `/host/reservations` itself, whose list spends no green at all (the
 * request cards' `Review request` is the §5 gray-fill secondary, precisely so
 * two requests on screen cannot be two primaries).
 *
 * Added 2026-07-26 with the reservations surfaces. The list above is still the
 * right shape for a fixed route; this is the one-line extension a dynamic one
 * needs, rather than a second mechanism.
 */
const CTA_OWNED_BY_SUBTREE: readonly string[] = ["/host/reservations/"];

export function hostNavCtaYields(pathname: string): boolean {
  return (
    CTA_OWNED_BY_PAGE.has(pathname) ||
    CTA_OWNED_BY_SUBTREE.some((prefix) => pathname.startsWith(prefix))
  );
}

export function HostNav() {
  const pathname = usePathname();
  const yields = hostNavCtaYields(pathname);

  return (
    <TabStrip
      label="Hosting sections"
      indicator="brand"
      /*
       * NARROW: the strip scrolls below `lg` rather than wrapping or shrinking.
       *
       * `tab-strip.tsx` closes with this exact gap — no card in the corpus draws
       * a narrow host nav, and both obvious answers cost something. Six tabs and
       * a pill need roughly 700px; at 360 they would push the whole document
       * sideways, and a page that scrolls horizontally is broken in a way a
       * clipped ring is not. So the scroll is taken, and it is taken ONLY where
       * it is needed: `lg` (1024) is comfortably above the ~720px the row wants,
       * so at every width the corpus actually draws (the cards are 1200 wide and
       * their narrow panel is 820) the row is static and the focus ring is whole.
       *
       * The cost, stated: `overflow-x: auto` forces `overflow-y` to `auto` too,
       * so below `lg` the 4px offset on a focused tab's ring clips top and
       * bottom. The ring is still visible on the left and right edges. The
       * alternative — padding the strip to make room — would lift the active
       * tab's 2px underline off the hairline it is supposed to BE, which is the
       * whole idea of the control. This is the surface `tab-strip.tsx` says
       * should get a card for it; it still should.
       */
      className={`${hostChromeGutter} max-lg:overflow-x-auto`}
    >
      {HOST_SECTIONS.map((section) => (
        <TabLink key={section.href} href={section.href} current={pathname === section.href}>
          {section.label}
        </TabLink>
      ))}

      <TabStripSpacer />

      <Link
        href={CREATE_LISTING_HREF}
        className={`${hostNavCtaShape} ${yields ? btnOutline : btnPrimary}`}
      >
        <PlusIcon className="size-4" />
        Create a listing
      </Link>
    </TabStrip>
  );
}

export default HostNav;
