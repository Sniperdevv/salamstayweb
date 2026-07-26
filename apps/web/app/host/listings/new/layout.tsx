import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The create-listing wizard's boundary — `/host/listings/new/{step}`,
 * `HOST-SHELL.md` §2a.
 *
 * WHERE THIS SITS, AND WHY IT IS NOT INSIDE `(app)`
 * ------------------------------------------------
 * §2: "A host card wears **one** [chrome]. Never both, never a hybrid." The app
 * chrome — header plus the Today / Calendar / Listings section nav — is scoped
 * by `app/host/(app)/layout.tsx`, and `(app)` is a naming-only group precisely
 * so that this tree, which lives at a path UNDER `/host/listings`, falls outside
 * it. A layout at `app/host/` or at `app/host/listings/` would wrap the wizard
 * in a section nav; the group is the only placement that does not.
 *
 * So a wizard step inherits `app/host/layout.tsx`'s `noindex` and **nothing
 * else**, and brings its own chrome via `components/host/wizard-step.tsx`. A
 * step must show no tab strip. That is checkable by eye in a browser and it is
 * structural rather than remembered.
 *
 * WHAT THIS DRAWS: THE COLUMN THE STICKY ACTION BAR NEEDS
 * ------------------------------------------------------
 * One flex column, at least the viewport tall. It is not decoration — it is the
 * mechanism behind §4's `position: sticky; bottom: 0`.
 *
 * In `hw-001` the scrollport is `.wz`, a fixed-height `overflow-y:auto` panel.
 * In the build it is the viewport, and §4 says "the markup and CSS are the same
 * in both". A `bottom: 0` sticky element only pins while its containing block's
 * bottom edge is below the viewport's, so on a step whose form is shorter than
 * the screen — step 1 on a desktop is close — a bar with no column under it
 * would come to rest in the middle of the page instead of on the bottom edge.
 * The column plus `flex-1` on the step's `<main>` puts it on that edge in both
 * cases, with no second rule for the short one.
 *
 * `min-h-[100dvh]` and not `h-screen`: `dvh` tracks the mobile address bar, so
 * the bar does not jump when the bar collapses. The root layout's `<body>`
 * already ships the same unit for the same reason. Nothing above this has
 * `overflow` set, which is the other thing sticky needs.
 *
 * The header and the footer are not rendered here even though a layout is where
 * persistent chrome usually goes: `WizardStep` renders header, `<main>` and the
 * action bar as three siblings, and a layout cannot interleave `children`
 * between two of its own elements. They land as direct children of this column
 * either way.
 *
 * `bg-canvas` because the wizard is opaque end to end — the action bar carries
 * no scrim and no `backdrop-filter` (§4, TASTE §11.20), so content passing under
 * it must pass under a solid surface.
 *
 * THE ROOT LAYOUT'S GUEST CHROME IS ALREADY GONE HERE, via `GuestChrome`, which
 * resolves during the server render: §1's "every web-drawn host card ends at
 * `</main>`" holds, and the wizard is not sitting under a marketing header.
 */

/**
 * `noindex, follow`, restated.
 *
 * `app/host/layout.tsx` already sets it for the whole `/host/*` prefix and Next
 * merges metadata down the tree, so this is belt-and-braces rather than news —
 * but a nine-step funnel is the surface where an author is most likely to add
 * `export const metadata` to a step and not think about robots, and this keeps
 * the wizard's own boundary stating the fact rather than inheriting it silently.
 * §1: no canonical, no hreflang pair, no JSON-LD, no breadcrumb, on any of the
 * nine.
 *
 * THE TITLE IS THE FUNNEL'S, AND IT IS HERE BECAUSE NO STEP CAN CARRY ONE
 * ----------------------------------------------------------------------
 * Every one of the nine steps gates a control on the host's own answers, so
 * every one of them is a Client Component — checked, not assumed: all nine
 * `page.tsx` files under this layout carry `"use client"` and none of them
 * exports `metadata`, because a Client Component cannot. A title declared here
 * is therefore the only title any of them has today.
 *
 * `List your place — SalamStay hosting` is `lib/seo/route-registry.ts`'s entry
 * for step 1, byte for byte, so G41 compares like with like the moment that
 * entry is promoted from `stub()` to `page()`. It is also an honest title for
 * the funnel as a whole rather than a step-1 string that leaked upward — the
 * registry named the funnel, not the question ("What kind of place is it?" is
 * the H1). (`absolute` rather than `default`, which Next's `TemplateString`
 * type only accepts alongside a `template` this tree has no use for.)
 *
 * **FLAGGED, and it is the whole wizard's problem, not this file's:** steps 2–9
 * currently serve this title too. Before their registry entries are promoted to
 * `page()`, each step needs either a registry title equal to this one, or a thin
 * Server Component `page.tsx` that exports its own `metadata` and renders the
 * step's Client Component as a co-located sibling — which is the shape the App
 * Router wants for an interactive page and the one fix that scales to nine.
 * Whoever owns that change owns nine files; this layout owns none of them.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: { absolute: "List your place — SalamStay hosting" },
};

export default function HostListingWizardLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <div className="flex min-h-[100dvh] flex-col bg-canvas">{children}</div>;
}
