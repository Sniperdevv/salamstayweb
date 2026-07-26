"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the guest header and footer everywhere EXCEPT the host surfaces.
 *
 * `HOST-SHELL.md` §1: a `/host/*` route carries the host chrome and neither the
 * guest header nor the guest footer. A Next layout cannot remove chrome an
 * ancestor rendered, and the root layout renders both around every route — so
 * until 2026-07-26 `/host/today` shipped the guest header stacked above the host
 * header, and the guest footer below the host `<main>`. Two headers is the
 * visible half; the quieter half is that the footer drags ~20 marketing hrefs
 * onto a surface that is `noindex, follow` — and `follow` means those links are
 * followed from a page that should be a leaf.
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
export function GuestChrome({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  // `startsWith("/host")` alone would also swallow a future `/hosting-guide`.
  // The host tree is `/host` exactly, or anything beneath `/host/`.
  const isHostSurface = pathname === "/host" || pathname?.startsWith("/host/") === true;
  if (isHostSurface) return null;
  return <>{children}</>;
}

export default GuestChrome;
