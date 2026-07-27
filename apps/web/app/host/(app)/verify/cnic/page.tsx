import type { Metadata } from "next";

import { VerificationStrip } from "../verification-strip";
import CnicCheck from "./cnic-check";

/**
 * `/host/verify/cnic` — HA-007 at web width, carrying HA-009's rejection
 * register. The body is `./cnic-check.tsx`; this file is the route.
 *
 * THIS FILE IS A SERVER COMPONENT AND `./cnic-check.tsx` IS THE CLIENT ONE
 * ------------------------------------------------------------------------
 * The check holds a chosen file name and a format verdict, so it is
 * `"use client"`, and **a Client Component cannot export `metadata`**.
 * Inheriting a title from a layout instead is what the nine wizard steps did,
 * and `G41` — a HARD gate comparing the served `<title>` to the registry byte
 * for byte AND rejecting duplicates across a run — failed eight of them for it.
 * So the route is this thin wrapper and the check is its one client sibling, the
 * shape `app/host/(app)/reservations/[id]/page.tsx` and
 * `app/host/(app)/payout-settings/page.tsx` both document.
 *
 * The title is written out rather than read through `pageMetadata`, matching
 * every other host surface: that helper throws on a path the registry does not
 * carry, this route is not registered yet, and the registry is updated
 * centrally.
 *
 * WHAT IS ABOVE THE CHECK AND WHY IT IS UP HERE: the heading, the lead and the
 * honesty strip are static, so they render on the server and stay out of the
 * client bundle. Everything from the first section down is either interactive or
 * sits inside the check's own reading order, so it lives in the sibling.
 *
 * NO CONTEXT LINE ON THIS PAGE, AND THAT IS A DECISION
 * ----------------------------------------------------
 * `/host/verify` carries "Host setup · Identity" because it is the destination
 * of the checklist's Identity row and nothing in the chrome points at it. This
 * page sits one level below that. Repeating the same crumb here would name a
 * parent that is not this page's parent; extending it to "Host setup · Identity
 * · CNIC" would chain a second `·`, which TASTE §7 forbids in as many words. So
 * the way back is the one control `HOST-SHELL.md` §4 already specifies for it —
 * an inline text action on the leading edge of the action row, ink, underlined
 * at rest, chevron leading, mirrored under RTL — and it points at
 * `/host/verify`, which is §15's "the last state that still exists".
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * -------------------------------------------------
 * `robots: noindex, follow` from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb. `<main class="co-main">` arrives from
 * `HostAppShell` via the `(app)` route group, so this file adds no chrome.
 *
 * ONE `<h1>`: "Verify your CNIC", at the `h4` rung — a real page title, not a
 * region label, since the nav does not name this route. It is the registered
 * title minus the site suffix, which is what G43 compares.
 */
export const metadata: Metadata = {
  title: { absolute: "Verify your CNIC — SalamStay hosting" },
};

export default function HostCnicCheckPage() {
  return (
    <div className="max-w-prose">
      <h1 className="text-h4 font-semibold text-primary">Verify your CNIC</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        One clear photo of the front of your card. It is a one-time step, and every guest who books
        with you completes the same one.
      </p>

      <VerificationStrip className="mt-5" />

      <CnicCheck />
    </div>
  );
}
