import type { ReactNode } from "react";

import { HostAppShell } from "@/components/host/host-chrome";

/**
 * The APP chrome's scope — `HOST-SHELL.md` §2b's header and section nav, and the
 * `<main class="co-main">` every route inside it renders into.
 *
 * WHY A ROUTE GROUP AND NOT `app/host/layout.tsx`
 * ----------------------------------------------
 * `(app)` is a naming-only segment: `app/host/(app)/today/page.tsx` still serves
 * `/host/today`. What it buys is a layout boundary that stops short of the
 * wizard. §2 allows a host route exactly one of the two chromes, and the wizard
 * lives at `/host/listings/new/{step}` — a path UNDER `/host/listings`. A layout
 * at `app/host/` would wrap it in a section nav; a layout at
 * `app/host/listings/` would wrap it too. The group is the only placement that
 * puts `/host/today` and `/host/listings` inside the app shell and leaves
 * `/host/listings/new/*` free to bring its own, and it does it structurally
 * rather than by asking every future author to remember.
 *
 * Concretely, when the wizard lands its steps go at
 * `app/host/listings/new/{step}/page.tsx` — outside this group, inheriting only
 * `app/host/layout.tsx`'s `noindex` — and the two trees coexist because they
 * resolve different paths.
 *
 * The chrome is a component rather than markup inlined here so the same shell
 * can frame `/host/calendar`, `/host/reservations`, `/host/earnings` and
 * `/host/insights` when they land, without a second copy of the header to keep
 * in sync with this one.
 */
export default function HostAppLayout({ children }: { readonly children: ReactNode }) {
  return <HostAppShell>{children}</HostAppShell>;
}
