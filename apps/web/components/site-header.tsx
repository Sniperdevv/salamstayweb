"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./icons";
import { Num } from "./numerals";
import { LanguageGroup } from "./language-group";
import { MobileMenu } from "./mobile-menu";
import { AccountMenu } from "./account-menu";
import { headerCtaYields } from "./header-cta";
import { btnBase, btnGhost, btnMd, btnOutline, btnPrimary, focusRing, gutter } from "./ui";
import { isSignedIn, setSessionMode, useSessionMode } from "@/lib/mode";

/**
 * SiteHeader — the shipped web chrome (design corpus: the gw-001 light panel is
 * canon for the resting bar; web-header-footer.html for the scrolled and
 * search-pill states; DESIGN.md §8 "Web header + footer").
 *
 * Slim sticky single-row bar at `space-16`, clamped to `container.wide`:
 * wordmark left, the optional collapsed search pill centered, primary nav
 * right. At rest it sits flat on the canvas with a hairline base rule; once the
 * page scrolls it drops the hairline and takes `elevation.subtle`, which is
 * exactly the two states the card draws.
 *
 * Height is deliberately NOT animated — the card condenses 64→56 on scroll, but
 * animating height thrashes layout every frame. The state change rides on
 * border-color + box-shadow only, which is paint-local and interruptible.
 *
 * THE SIGNED-IN BRANCH (`hw-007` panel B, `web-header-footer.html` logged-in)
 * --------------------------------------------------------------------------
 * This bar had no logged-in branch at all: it rendered Log in / Sign up
 * unconditionally, on every route, to everybody. The corpus draws a second
 * composition for the same bar — "logged-in collapses the auth pair into an
 * avatar/account control" — and `hw-007` adds the thing the founder actually
 * asked for beside it: `Switch to hosting`, a 14px secondary text link where
 * `Become a host` used to sit.
 *
 * THREE SUBSTITUTIONS, NOT AN EXTRA ROW OF CHROME. Signed in, `Become a host`
 * becomes `Switch to hosting` (you already can host — the offer becomes a
 * shortcut); `Help` moves into the account menu as `Help centre`; and the auth
 * pair becomes the account control. The bar keeps its item count, which is why
 * the card can call the right side "already crowded" and put the explanation in
 * the menu instead.
 *
 * GREEN (TASTE §2) BALANCES BY ITSELF HERE. The signed-in bar has no `Sign up`,
 * so the brand-filled avatar the card inherits lands in the role the primary CTA
 * just vacated rather than beside it. `headerCtaYields` therefore only ever
 * governs the signed-out branch, which is the only branch that draws a CTA.
 *
 * HYDRATION. `useSessionMode` starts `pending`, so the server HTML and the first
 * client frame both render the signed-out branch and agree by construction. The
 * signed-in branch resolves one frame later, on the client only — it is never in
 * the HTML the SEO gates parse, and the logged-out header stays the crawlable
 * truth. See `lib/mode.ts`; a real, server-readable session removes the frame.
 */

export interface SiteHeaderProps {
  /**
   * Collapsed search summary for discovery surfaces — e.g.
   * "F-7, Islamabad · Any week · Add guests". Omit it on marketing, legal and
   * error surfaces and no pill is rendered.
   */
  readonly search?: string;
}

/**
 * The pill is a link, not a button — it still answers a press.
 *
 * Elevation (TASTE-RULES §1, §10): shadow, never a border. The pill floats over
 * the page the reader scrolls; hover deepens it by one ladder rung
 * (`floating` → `popover`) at `duration.fast`, decelerating, so the response
 * lands the instant the pointer does.
 */
const pressablePill =
  "transition-[transform,box-shadow] duration-fast ease-decelerate hover:shadow-popover active:scale-[0.99] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const navLink =
  "hidden rounded-md py-3 text-bodySm text-secondary transition-colors duration-instant ease-decelerate hover:text-primary md:inline-flex " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

const CITY_LABELS: Record<string, string> = {
  islamabad: "Islamabad",
  karachi: "Karachi",
  lahore: "Lahore",
  peshawar: "Peshawar",
  faisalabad: "Faisalabad",
  rawalpindi: "Rawalpindi",
};

/**
 * Discovery surfaces carry the collapsed search pill (gw-002/003/004/009);
 * marketing, legal and error surfaces do not. Derived from the route so the
 * root layout stays surface-agnostic; an explicit `search` prop still wins.
 */
interface PillTarget {
  readonly summary: string;
  readonly href: string;
  readonly aria: string;
}

function derivePill(pathname: string): PillTarget | undefined {
  if (pathname === "/search")
    return {
      summary: "Anywhere \u00b7 Any week \u00b7 Add guests",
      href: "/search",
      aria: "Search stays",
    };
  const m = pathname.match(/^\/stays-in-([a-z-]+)(\/([a-z0-9-]+))?/);
  if (m) {
    const slug = m[1] ?? "";
    const city = CITY_LABELS[slug];
    if (!city) return undefined;
    const area = m[3];
    const areaLabel = area
      ? /^[a-z]-\d+$/.test(area)
        ? area.toUpperCase()
        : area.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : undefined;
    const label = areaLabel ? `${areaLabel}, ${city}` : city;
    return {
      summary: `${label} \u00b7 Any week \u00b7 Add guests`,
      href: area ? `/search?city=${slug}&area=${area}` : `/search?city=${slug}`,
      aria: `Search stays in ${area ? `${label}` : city}`,
    };
  }
  if (pathname.startsWith("/guides/where-to-stay-in-")) {
    const slug = pathname.split("where-to-stay-in-")[1] ?? "";
    const city = CITY_LABELS[slug];
    if (city)
      return {
        summary: `${city} \u00b7 Any week \u00b7 Add guests`,
        href: `/search?city=${slug}`,
        aria: `Search stays in ${city}`,
      };
  }
  return undefined;
}

export function SiteHeader({ search }: SiteHeaderProps) {
  const pathname = usePathname();
  const pill = derivePill(pathname);
  const ctaYields = headerCtaYields(pathname);
  const pillSummary = search ?? pill?.summary;
  const session = useSessionMode();
  const signedIn = isSignedIn(session);
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Scroll state via IntersectionObserver on a zero-impact sentinel: no scroll
  // listener, no per-frame work on the main thread.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(entry ? !entry.isIntersecting : false),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only rounded-md bg-interactive text-bodySm font-semibold text-on-brand focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:px-4 focus:py-3 ${focusRing}`}
      >
        Skip to content
      </a>

      <div ref={sentinel} aria-hidden="true" className="-mb-px h-px" />

      <header
        data-scrolled={scrolled ? "true" : "false"}
        className="sticky top-0 z-header border-b border-hairline bg-canvas transition-[border-color,box-shadow] duration-fast ease-decelerate data-[scrolled=true]:border-transparent data-[scrolled=true]:shadow-subtle motion-reduce:duration-instant"
      >
        <div className={`mx-auto flex h-16 max-w-wide items-center gap-4 ${gutter}`}>
          <Link
            href="/"
            aria-label="SalamStay — home"
            className={`shrink-0 rounded-md text-h5 font-semibold tracking-tight text-primary ${focusRing}`}
          >
            Salam<span className="text-interactive">.</span>Stay
          </Link>

          {pillSummary ? (
            <Link
              href={pill?.href ?? "/search"}
              aria-label={pill?.aria ?? "Search stays"}
              className={`mx-auto hidden h-12 max-w-md flex-1 items-center gap-3 rounded-full bg-canvas pl-5 pr-1.5 shadow-floating md:flex ${focusRing} ${pressablePill}`}
            >
              <SearchIcon className="size-5 shrink-0 text-secondary" />
              {/* The sector summaries carry digit runs — "F-7, Islamabad · Any
                  week · Add guests" — and an unisolated run reverses under RTL
                  (TASTE §12, the shipped `.num` canon). `Num` is applied to the
                  whole string rather than to the summaries known to need it,
                  because `search` is caller-supplied and `derivePill` grows a
                  case every time a city or area label does; a hand-tagged run is
                  the run somebody forgets. The regex starts a run AT the digit,
                  so `F-7` isolates its `7` and leaves the sector prefix in the
                  text flow, and a summary with no digits passes through
                  untouched. Visible string unchanged either way. */}
              <span className="flex-1 truncate text-bodyMd text-secondary">
                <Num>{pillSummary}</Num>
              </span>
              {/* §10: diameter = pill height − 12, so 36 on this 48px pill.
                  That is also the only CONCENTRIC answer (§4): the pill's end
                  cap is a 24px-radius semicircle whose centre sits 24px in, so
                  an 18px-radius circle clears every edge by exactly 6px — which
                  is why the pill's right padding is 1.5 (6) and not 2 (8). The
                  shipped 32px circle was concentric with an 8px inset and so
                  landed 4px short of the redline; the two numbers move
                  together or not at all. */}
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-interactive">
                <SearchIcon className="size-4 text-on-brand" />
              </span>
            </Link>
          ) : null}

          <nav aria-label="Primary" className="ml-auto flex items-center gap-2 md:gap-4">
            {signedIn ? (
              <>
                {/* THE ASYMMETRY IS THE CARD'S AND IT IS KEPT: the guest side
                    gets this header link AND the menu's lead row; the host side
                    gets its header link only. Do not smooth it — the bar carries
                    the shortcut, the menu carries the sentence that explains
                    what the shortcut does to your verification.

                    It shares `navLink` with the signed-out pair, which hides it
                    below `md`. That is the same argument one width down: at
                    375px the bar has room for the wordmark, the person and the
                    menu, and the row inside the menu is then the whole
                    affordance. */}
                <Link
                  href="/host/today"
                  onClick={() => setSessionMode("hosting")}
                  className={`${navLink} ${focusRing}`}
                >
                  Switch to hosting
                </Link>

                <LanguageGroup className="hidden md:inline-flex" />

                <AccountMenu />
              </>
            ) : (
              <>
                <Link href="/become-a-host" className={`${navLink} ${focusRing}`}>
                  Become a host
                </Link>
                <Link href="/help" className={`${navLink} ${focusRing}`}>
                  Help
                </Link>

                <LanguageGroup className="hidden md:inline-flex" />

                {/* Below `md` the auth pair would leave a 375px bar with no room
                    for anything else, so Log in moves into the menu and Sign up —
                    the primary action — stays on the bar. Both are in the menu too;
                    a duplicated sign-up entry costs nothing and a missing one costs
                    a signup. */}
                <Link
                  href="/login"
                  className={`hidden md:inline-flex ${btnBase} ${btnGhost} ${btnMd}`}
                >
                  Log in
                </Link>
                {/* Green doctrine: the header CTA yields to a page-owned primary.
                    See `header-cta.ts` — the same test drives the copy of this
                    button inside `MobileMenu`, so the control is one treatment at
                    both widths. */}
                <Link
                  href="/signup"
                  className={`${btnBase} ${ctaYields ? btnOutline : btnPrimary} ${btnMd}`}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Sibling of the primary nav, not a child: the menu contains its own
              labelled <nav>, and nesting one inside the other would give
              assistive tech two navigation landmarks describing the same set of
              destinations at two different breakpoints. */}
          <MobileMenu />
        </div>
      </header>
    </>
  );
}

export default SiteHeader;
