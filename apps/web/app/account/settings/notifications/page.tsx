import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

import NotificationPreferences from "./step";

/**
 * GA-069 — `/account/settings/notifications`, at web width.
 *
 * Thin server page, client sibling. The consent switch holds state, and
 * `export const metadata` cannot live in a `"use client"` module; inheriting the
 * title from the layout instead is the G41 failure the host wizard shipped nine
 * times. `app/trips/[id]/cancel/` is the shape.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2): `noindex, follow` from `../../layout.tsx`
 * and again off the registry row here; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` from the layout. Title `Notifications —
 * SalamStay`, `<h1>` `Notifications` (G43), and the `<h1>` never changes with
 * the switch, so the served HTML carries the string the gates read.
 */
export const metadata: Metadata = pageMetadata("/account/settings/notifications");

export default function NotificationsRoute() {
  return <NotificationPreferences />;
}
