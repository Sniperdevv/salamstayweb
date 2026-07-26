"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the guest header and footer everywhere EXCEPT the surfaces that bring
 * their own reduced chrome: the host tree, and checkout.
 *
 * `HOST-SHELL.md` §1: a `/host/*` route carries the host chrome and neither the
 * guest header nor the guest footer. `CHECKOUT-SHELL.md` §2 says the same thing
 * about `/book/*` and says it in more detail — the checkout header is the
 * wordmark, an encryption status line, the language switch and ONE exit link,
 * with "no search pill, no marketing nav, no Log in / Sign up", and the footer
 * is a single legal row rather than a four-column sitemap. A Next layout cannot
 * remove chrome an ancestor rendered, and the root layout renders both around
 * every route — so until 2026-07-26 `/host/today` shipped the guest header
 * stacked above the host header, and the guest footer below the host `<main>`.
 * Two headers is the visible half; the quieter half is that the footer drags
 * ~20 marketing hrefs onto a surface that is `noindex, follow` — and `follow`
 * means those links are followed from a page that should be a leaf.
 *
 * On checkout the search pill is the one that matters most: §2's reasoning is
 * that "a search box inside a checkout invites abandonment and re-entry into a
 * different listing". Removing the header's Sign up is also what settles TASTE
 * §2 structurally — with no chrome CTA, brand green on a checkout surface is
 * spent on exactly the wordmark dot, the one enabled primary and the
 * verification shield, which is §7's budget without needing an exception.
 *
 * **This gate is server-correct, not a post-hydration cleanup.** `usePathname()`
 * resolves during the server render of a client component, so on `/host/*` the
 * chrome is absent from the emitted HTML rather than removed a frame later. That
 * distinction is the whole point: a footer that reaches the crawler and is then
 * deleted by JavaScript has already been crawled.
 *
 * `children` stays a `ReactNode` rather than this file importing the two
 * components, which keeps `SiteFooter` a server component — it is passed
 * through, never re-rendered on the client.
 *
 * THE PROPER FIX, when the app is next reorganised: move the guest routes into a
 * `(guest)` route group whose layout owns this chrome, and let `/host/*` sit
 * outside it. That is structural and needs no runtime check at all. It means
 * relocating every top-level route folder, which is a mechanical change with
 * real blast radius, so it is not being done in the middle of a build wave.
 * Logged rather than quietly deferred.
 */
/**
 * A prefix match that cannot over-reach: `startsWith("/host")` alone would also
 * swallow a future `/hosting-guide`, and `startsWith("/book")` a `/bookings-faq`.
 * A tree is the prefix exactly, or anything beneath it with the slash.
 */
function isUnder(pathname: string | null, root: string): boolean {
  return pathname === root || pathname?.startsWith(`${root}/`) === true;
}

/** The trees that draw their own chrome. Adding one is adding a line here. */
const REDUCED_CHROME_ROOTS = ["/host", "/book"] as const;

export function GuestChrome({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  if (REDUCED_CHROME_ROOTS.some((root) => isUnder(pathname, root))) return null;
  return <>{children}</>;
}

export default GuestChrome;
