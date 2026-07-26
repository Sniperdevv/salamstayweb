"use client";

import Link from "next/link";

import { ACCOUNT_LABEL, SESSION_ACCOUNT, setSessionMode } from "@/lib/mode";
import { focusRing, pressable } from "@/components/ui";

/**
 * The host header's two session-bearing controls, as a client leaf.
 *
 * `host-chrome.tsx` is a Server Component — correctly, since almost none of the
 * host shell needs interactivity — and a Server Component cannot read a session
 * that lives in `localStorage`. Two defects came out of that single fact, and
 * both are fixed here rather than by making the whole shell a client tree:
 *
 * **The host and the guest were visibly different people.** The guest header
 * draws a brand disc reading `AK` with `aria-label="Your account, Aqib"`; the
 * host header drew the same disc with a neutral person glyph and
 * `aria-label="Your account"`. The reasoning at the time was sound and is worth
 * preserving: there was no session to read a name from, and inventing initials
 * is the same class of thing as inventing a rating. But `lib/mode.ts` landed in
 * the same wave carrying `SESSION_ACCOUNT`, whose own doc says it exists so
 * "the host header imports the same record" — and `account-menu.tsx` states
 * plainly that if the avatar changes between the two chromes, a reviewer reads
 * two accounts. The record exists now, so the disc reads it. Nothing is invented;
 * one source is read twice.
 *
 * **The mode switch was one-way.** `Switch to travelling` was a plain `<Link>`
 * with no `setSessionMode` call, because a Server Component has no handler to
 * put one in. The guest side writes the mode on both of its switches, so a host
 * who came back this way left the session saying `hosting` on the guest site:
 * the desktop header then offered "Switch to hosting" while the mobile sheet
 * offered "Switch to travelling", on the same page, at the same moment. Two
 * controls, one session, opposite claims.
 *
 * The write happens on click, before navigation. It is not in an effect on the
 * destination, because the destination is the guest site — which must not have
 * to know that something might have arrived from hosting.
 */

export function HostAccountAvatar() {
  return (
    <Link
      href="/account"
      aria-label={ACCOUNT_LABEL}
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-interactive text-bodySm font-semibold text-on-brand ${focusRing} ${pressable}`}
    >
      {/* Not `.num`, and not tabular: these are letters. */}
      <span aria-hidden="true">{SESSION_ACCOUNT.initials}</span>
    </Link>
  );
}

export function SwitchToTravelling({ className }: { readonly className?: string }) {
  return (
    <Link href="/" onClick={() => setSessionMode("travelling")} className={className}>
      Switch to travelling
    </Link>
  );
}
