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
 * THE TITLE HERE IS THE FUNNEL'S NAME AND NOBODY'S SERVED TITLE
 * -------------------------------------------------------------
 * Every one of the nine steps gates a control on the host's own answers, so the
 * body of every one of them is a Client Component, and a Client Component
 * cannot export `metadata`. For a while that made this the only title any of
 * them had, and all nine served it — a G41 failure (no two routes may share a
 * `<title>`), because the gate compares served strings, not intent.
 *
 * Fixed 2026-07-26 with the shape the App Router wants for an interactive page:
 * each `{step}/page.tsx` is now a thin Server Component that exports its own
 * `metadata` and renders the step's `"use client"` body from a co-located
 * `step.tsx`. The nine titles live in those nine files, each matching its
 * `lib/seo/route-registry.ts` entry byte for byte, and each declared `absolute`
 * for the reason below. Adding a tenth step means adding that pair, not editing
 * this file.
 *
 * So this title is now served by nothing. `/host/listings/new` has no
 * `page.tsx` and 404s into the root `not-found`, which sits outside this layout
 * and carries its own title; every step below overrides this one. It stays for
 * two reasons: it names the funnel, and it is the string a step would fall back
 * to if its `metadata` export were ever dropped — a wrong-but-plausible title
 * rather than a leaked neighbour's. (`absolute` rather than `default`, which
 * Next's `TemplateString` type only accepts alongside a `template` this tree has
 * no use for; `absolute` is also what stops the site template appending twice.)
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
