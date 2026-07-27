import type { Metadata } from "next";

import { HostSetupContext, HostSetupStrip } from "../onboarding/host-setup";
import PayoutForm from "./payout-form";

/**
 * `/host/payout-settings` — HA-016 at web width. The step money cannot leave
 * escrow without, and the highest-risk page in this pass.
 *
 * THIS FILE IS A SERVER COMPONENT AND `./payout-form.tsx` IS THE CLIENT ONE
 * ------------------------------------------------------------------------
 * The form holds a chosen destination and a typed name, so it is `"use client"`,
 * and a Client Component cannot export `metadata`. Inheriting a title from a
 * layout instead is exactly what the nine wizard steps did, and `G41` — a HARD
 * gate comparing the served `<title>` to the registry byte for byte AND
 * rejecting duplicates across a run — failed eight of them for it. So the route
 * is this thin wrapper and the form is its one client sibling, the shape
 * `app/host/(app)/reservations/page.tsx` documents.
 *
 * The title is written out rather than read through `pageMetadata`, matching
 * every other host surface: that helper throws on a path the registry does not
 * carry, this route is not registered yet, and the registry is updated
 * centrally.
 *
 * WHAT IS ABOVE THE FORM AND WHY IT IS UP HERE: the context line, the heading
 * and the honesty strip are static, so they render on the server and stay out of
 * the client bundle. Everything from the first question down is interactive or
 * sits inside the form's own reading order, so it lives in the sibling.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * -------------------------------------------------
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb — the "Host setup · Payout" line is §7.6a
 * chrome and emits no breadcrumb markup (see `HostSetupContext`).
 * `<main class="co-main">` arrives from `HostAppShell` via the `(app)` route
 * group, so this file adds no chrome.
 *
 * ONE `<h1>`: "Payout details", at the `h4` rung rather than the `h5` the six nav
 * sections take — the nav does not name this route, so the heading is a real page
 * title and not a region label. Same reasoning as `/host/onboarding` and
 * `/host/reservations/[id]`.
 */
export const metadata: Metadata = {
  title: { absolute: "Payout details — SalamStay hosting" },
};

export default function HostPayoutSettingsPage() {
  return (
    <div className="max-w-prose">
      <HostSetupContext section="Payout" />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Payout details</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        Where SalamStay would send what a stay earns.
      </p>

      <HostSetupStrip className="mt-5" />

      <PayoutForm />
    </div>
  );
}
