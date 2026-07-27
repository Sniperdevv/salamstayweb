import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

import PersonalInfoForm from "./step";

/**
 * GA-047 — `/account/settings/personal`, at web width.
 *
 * THE FILE IS THREE LINES BECAUSE OF ONE HARD GATE. The form below holds state,
 * so it is a client component; `export const metadata` cannot live in a
 * `"use client"` module, and a title inherited from the layout instead is how
 * the host wizard shipped nine steps sharing one string and failed G41 eight
 * times. Thin server page owns the title, client sibling owns the state —
 * `app/trips/[id]/cancel/` is the shape this copies.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2): `noindex, follow` from `../../layout.tsx`
 * and again off the registry row here; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` from the layout. The `<h1>` is in the
 * client body — it never changes with the form's state, so the served HTML
 * carries the string G30/G41/G43 read: title `Personal info — SalamStay`, `<h1>`
 * `Personal info`.
 */
export const metadata: Metadata = pageMetadata("/account/settings/personal");

export default function PersonalInfoRoute() {
  return <PersonalInfoForm />;
}
