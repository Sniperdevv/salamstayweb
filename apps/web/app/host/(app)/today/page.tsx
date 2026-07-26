import type { Metadata } from "next";
import Link from "next/link";

import { HomeIcon } from "@/components/icons";
import { btnSecondary } from "@/components/ui";
import { HostEmpty } from "@/components/host/host-empty";
import { CREATE_LISTING_HREF } from "@/components/host/host-nav";
import { hostPrimaryPill } from "@/components/host/host-ui";

/**
 * `/host/today` — `hw-007-publish-and-host.html` panel E, the first-run state.
 *
 * WHY THE FIRST-RUN STATE IS THE STATE THIS PAGE SHIPS
 * ----------------------------------------------------
 * `hw-007` draws `/host/today` twice: panel D with one listing filled in and
 * waiting to publish, panel E with nothing in the account at all. Panel D's
 * content is a worked case — a named draft, a thumbnail, a nine-of-nine progress
 * row — and a card is allowed a worked case. A live page is not: there is no
 * session and no listing behind this route, so rendering "Cantt View Residence
 * is filled in and waiting for you to publish it" would be inventing the host's
 * own data, which is the same failure as inventing a rating. Panel E is the
 * state that actually exists, and it is the one that ships. Panel D is the
 * shape this page takes the day a draft exists to put in it.
 *
 * WHAT IS DELIBERATELY ABSENT — `hw-007`'s own list, honoured
 * ----------------------------------------------------------
 *  · **No KPI row.** `ha-046` opens this dashboard with occupancy, earnings and
 *    a sparkline. A host whose only listing has never been published has none of
 *    those numbers, "and rendering them at zero — or at all — would be
 *    inventing."
 *  · **No rating and no review count.** `ha-046` ships `4.9 · 128 reviews` on
 *    its listing tiles. Zero real reviews exist. Not copied, here or anywhere.
 *  · **No date or time strip.** `ha-046` heads the page with "Thursday, 24 July
 *    2026 · 3 stays hosting in…"; TASTE §11.20 has no room for a locale/time
 *    strip, and the line a host needs is what is waiting for them.
 *  · **No greeting by name, and no religious greeting.** `ha-046` opens with the
 *    latter; `REPOSITIONING.md` retires it, and `hw-007` replaces it with
 *    "Welcome back, Aqib". The name is data this build does not have, so the
 *    greeting keeps its warmth and drops the payload it cannot honestly print.
 *    Dropping the religious framing did not license a colder product (§12) and
 *    dropping the name must not either.
 *
 * ONE `<h1>`, and it is the empty's own line. Panel E has no title above the
 * empty — the empty IS the page — so "Welcome to hosting" is the route's
 * accessible title rather than an SEO artefact (§1). `noindex, follow` is
 * inherited from `app/host/layout.tsx`; no canonical, no hreflang, no JSON-LD,
 * no breadcrumb.
 */
export const metadata: Metadata = {
  title: { absolute: "Today — SalamStay hosting" },
};

export default function HostTodayPage() {
  return (
    <HostEmpty
      glyph={<HomeIcon className="size-6" />}
      heading="h1"
      title="Welcome to hosting"
      /*
       * The second sentence is the load-bearing one, and it is `ha-003`'s rule
       * rather than a fresh line: "your guest verification carries over." The
       * switch never re-runs verification — that is the difference between one
       * account and two, and it is the thing a host arriving here is most likely
       * to be bracing for. `hw-007` states it as a completed fact about this
       * host's CNIC; with no session to read, it is stated as the fact about the
       * product that it is, which is also the more durable sentence.
       *
       * Plain neutral description throughout. No §5 claim appears on this
       * surface: §12 allows exactly one on a host card and it is claim 7, on the
       * wizard step that collects it.
       */
      body={
        <>
          Your check-ins, guest messages and payouts will appear here once a listing is live. Your
          guest verification carries over, so the first step is the place itself.
        </>
      }
      actions={
        <>
          {/*
            The surface's one primary (TASTE §2 role 3) — which is exactly why
            the nav's identical `Create a listing` yields to ink-outline on this
            route. `ha-046` shipped both in green; `hw-007` panel E is the
            correction, and `host-nav.tsx` carries the rule.
          */}
          <Link href={CREATE_LISTING_HREF} className={hostPrimaryPill}>
            Create a listing
          </Link>
          {/*
            The §5 gray-fill secondary. `hw-007` points this at
            `/host/help/what-hosting-involves`, a page nobody has written;
            `/become-a-host` is written, shipped, and is the surface whose whole
            job is answering this question. A real page beats a thin stub with
            the same label on it.
          */}
          <Link href="/become-a-host" className={btnSecondary}>
            What hosting involves
          </Link>
        </>
      }
    />
  );
}
