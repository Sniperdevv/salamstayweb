"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./icons";
import { btnBase, btnGhost, btnMd, btnPrimary, focusRing, gutter } from "./ui";

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
 */

export interface SiteHeaderProps {
  /**
   * Collapsed search summary for discovery surfaces — e.g.
   * "F-7, Islamabad · Any week · Add guests". Omit it on marketing, legal and
   * error surfaces and no pill is rendered.
   */
  readonly search?: string;
}

/** The pill is a link, not a button — it still answers a press. */
const pressablePill =
  "transition-[transform,border-color,box-shadow] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.99] motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant motion-reduce:active:scale-100";

const navLink =
  "hidden rounded-md py-3 text-bodySm text-secondary transition-colors duration-instant ease-decelerate hover:text-primary md:inline-flex";

/**
 * v1 language control. `/ur` does not exist yet, so اردو is a plain span rather
 * than a dead link — the corpus' EN/اردو affordance without a promise the
 * router cannot keep. EN is the active language on every shipped route.
 */
function LanguageGroup({ className = "" }: { readonly className?: string }) {
  return (
    <span
      role="group"
      aria-label="Language"
      className={`items-center overflow-hidden rounded-full border border-border-default ${className}`}
    >
      <span
        lang="en"
        aria-current="true"
        className="flex items-center bg-interactive px-3 py-2 text-label font-semibold leading-none text-on-brand"
      >
        EN
      </span>
      <span
        lang="ur"
        className="flex items-center px-3 py-2 font-urdu text-label leading-none text-secondary"
      >
        اردو
      </span>
    </span>
  );
}


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
function derivePillSummary(pathname: string): string | undefined {
  if (pathname === "/search") return "Anywhere \u00b7 Any week \u00b7 Add guests";
  const m = pathname.match(/^\/stays-in-([a-z-]+)(\/([a-z0-9-]+))?/);
  if (m) {
    const city = CITY_LABELS[m[1] ?? ""];
    if (!city) return undefined;
    const area = m[3];
    const label = area ? `${area.toUpperCase().replace(/-(\d)/, "-$1")}, ${city}` : city;
    return `${label} \u00b7 Any week \u00b7 Add guests`;
  }
  if (pathname.startsWith("/guides/where-to-stay-in-")) {
    const city = CITY_LABELS[pathname.split("where-to-stay-in-")[1] ?? ""];
    if (city) return `${city} \u00b7 Any week \u00b7 Add guests`;
  }
  return undefined;
}

export function SiteHeader({ search }: SiteHeaderProps) {
  const pathname = usePathname();
  const pillSummary = search ?? derivePillSummary(pathname);
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
              href="/search"
              className={`mx-auto hidden h-12 max-w-md flex-1 items-center gap-3 rounded-full border border-border-default bg-canvas pl-5 pr-2 shadow-subtle md:flex ${focusRing} ${pressablePill}`}
            >
              <SearchIcon className="size-5 shrink-0 text-secondary" />
              <span className="flex-1 truncate text-bodyMd text-secondary">{pillSummary}</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-interactive">
                <SearchIcon className="size-4 text-on-brand" />
              </span>
            </Link>
          ) : null}

          <nav aria-label="Primary" className="ml-auto flex items-center gap-2 md:gap-4">
            <Link href="/become-a-host" className={`${navLink} ${focusRing}`}>
              Become a host
            </Link>
            <Link href="/help" className={`${navLink} ${focusRing}`}>
              Help
            </Link>

            <LanguageGroup className="hidden md:inline-flex" />

            <Link href="/login" className={`${btnBase} ${btnGhost} ${btnMd}`}>
              Log in
            </Link>
            <Link href="/signup" className={`${btnBase} ${btnPrimary} ${btnMd}`}>
              Sign up
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export default SiteHeader;
