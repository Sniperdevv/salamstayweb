import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

import PrivacySettings from "./step";

/**
 * GA-125 — `/account/settings/privacy`, at web width.
 *
 * Thin server page, client sibling. The two radiogroups hold state, and
 * `export const metadata` cannot live in a `"use client"` module; inheriting the
 * title from the layout instead is the G41 failure the host wizard shipped nine
 * times. `../notifications/` and `../personal/` are the shape, and the split is
 * for that reason alone — `../accessibility/` holds no state and is therefore a
 * single server page, not a third variation on a house style.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2): `noindex, follow` from `../../layout.tsx`
 * and again off the registry row here; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` from the layout, never `indexable`. Title
 * `Privacy — SalamStay`, `<h1>` `Privacy` (G43), and the `<h1>` never changes
 * with either radiogroup, so the served HTML carries the string the gates read.
 *
 * The registry row is still `stub("/account/settings/privacy", …)`. Flipping it
 * to `page()` is a central edit and is reported, not made here; `pageMetadata`
 * reads the same title either way.
 */
export const metadata: Metadata = pageMetadata("/account/settings/privacy");

export default function PrivacyRoute() {
  return <PrivacySettings />;
}
