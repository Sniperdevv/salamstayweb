import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  HelpIcon,
  HomeIcon,
  MessageIcon,
  PinIcon,
  SearchIcon,
} from "@/components/icons";
import { btnBase, btnGhost, btnLg, btnPrimary, focusRing, gutter } from "@/components/ui";

/**
 * GW-015 — the not-found shell served for any undefined route.
 *
 * SEO-RULES §3.11 contract, carried verbatim from the card:
 *  · real HTTP 404 (Next serves this file with a 404 status), never a 200,
 *    never redirected to the homepage;
 *  · noindex, follow — the recovery links are the whole point of the page;
 *  · NO canonical, NO hreflang, NO JSON-LD, NO breadcrumb;
 *  · <main> carries NO `indexable` class — this page is not content.
 *
 * Deliberate absences (do not "complete" without founder sign-off): no search
 * INPUT, no "did you mean", no recently-viewed, no auto-redirect countdown, no
 * error code beyond the plain 404 eyebrow.
 */


const CITIES = [
  { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
  { href: "/stays-in-karachi", label: "Stays in Karachi" },
  { href: "/stays-in-lahore", label: "Stays in Lahore" },
  { href: "/stays-in-peshawar", label: "Stays in Peshawar" },
  { href: "/stays-in-faisalabad", label: "Stays in Faisalabad" },
  { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
] as const;

const chip =
  "group inline-flex h-12 items-center gap-2 rounded-full border border-border-default bg-canvas px-5 text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate hover:border-border-brand hover:text-interactive active:scale-[0.97] motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant motion-reduce:active:scale-100";

const row =
  "group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-instant ease-decelerate hover:bg-raised";

export default function NotFound() {
  return (
    <main>
      <title>Page not found — SalamStay</title>
      <meta name="robots" content="noindex, follow" />
      {/* HERO — the plain statement, then the two first moves */}
      <section className="bg-canvas bg-[radial-gradient(120%_90%_at_86%_-10%,var(--ss-interactive-subtle)_0%,transparent_46%)]">
        <div className={`mx-auto max-w-page py-12 md:py-16 ${gutter}`}>
          <p className="text-overline uppercase text-interactive">
            Error <span className="num">404</span>
          </p>
          <h1 className="mt-3 max-w-[18ch] text-h2 font-semibold tracking-tighter text-primary md:text-h1 md:font-semibold">
            Page not found
          </h1>
          <p className="mt-4 max-w-[62ch] text-bodyLg text-secondary">
            The link you followed is broken, or this page has moved.{" "}
            <strong className="font-semibold text-primary">
              Nothing has happened to your account, your trip, or a booking in progress
            </strong>{" "}
            — the page at this address simply isn&rsquo;t here.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className={`${btnBase} ${btnPrimary} ${btnLg}`}>
              Go to the SalamStay homepage
              <ArrowRightIcon className="size-5" />
            </Link>
            <Link href="/search" className={`${btnBase} ${btnGhost} ${btnLg}`}>
              Search all stays
              <SearchIcon className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CITY RECOVERY — the six beta cities, real links */}
      <section id="cities" aria-labelledby="cities-h" className="border-t border-hairline">
        <div className={`mx-auto max-w-page py-12 ${gutter}`}>
          <h2 id="cities-h" className="text-h4 text-primary">
            Browse stays by city
          </h2>
          <p className="mt-2 max-w-[68ch] text-bodyMd text-secondary">
            SalamStay is in beta in <strong className="font-semibold text-primary">six</strong>{" "}
            Pakistani cities. Any of these will take you somewhere that exists.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {CITIES.map((c) => (
              <Link key={c.href} href={c.href} className={`${chip} ${focusRing}`}>
                <PinIcon className="size-4 text-tertiary transition-colors duration-instant ease-decelerate group-hover:text-interactive" />
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HELP RECOVERY */}
      <section id="help" aria-labelledby="help-h" className="border-t border-hairline">
        <div className={`mx-auto max-w-page py-12 ${gutter}`}>
          <h2 id="help-h" className="text-h4 text-primary">
            Looking for something specific?
          </h2>
          <p className="mt-2 max-w-[68ch] text-bodyMd text-secondary">
            If you arrived here from a link inside SalamStay, the help center is the fastest
            way back to whatever you were doing.
          </p>

          <ul className="mt-6 overflow-hidden rounded-lg border border-hairline bg-canvas">
            <li>
              <Link href="/help" className={`${row} ${focusRing}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-subtle text-interactive">
                  <HelpIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">Help center</span>
                  <span className="text-bodySm text-secondary">
                    Booking, verification, payments, hosting — answers grouped by what
                    you&rsquo;re trying to do.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
            <li className="border-t border-hairline">
              <Link href="/help/contact" className={`${row} ${focusRing}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-subtle text-interactive">
                  <MessageIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">
                    Contact support
                  </span>
                  <span className="text-bodySm text-secondary">
                    Write in Urdu or English, whichever you&rsquo;d rather use. A person reads
                    every ticket.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
            <li className="border-t border-hairline">
              <Link href="/become-a-host" className={`${row} ${focusRing}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-subtle text-interactive">
                  <HomeIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">
                    Become a host
                  </span>
                  <span className="text-bodySm text-secondary">
                    How listing a home on SalamStay works, and what you control as a host.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
          </ul>

          <p className="mt-5 max-w-[66ch] text-bodySm text-tertiary">
            If a page on SalamStay linked you here, that link is our mistake and we&rsquo;d
            like to fix it — you can report a broken link the same way you&rsquo;d report
            anything else on the site, through{" "}
            <Link
              href="/help/contact"
              className={`font-medium text-link underline-offset-4 hover:underline ${focusRing} rounded-sm`}
            >
              contact support
            </Link>{" "}
            or our{" "}
            <Link
              href="/legal/corrections"
              className={`font-medium text-link underline-offset-4 hover:underline ${focusRing} rounded-sm`}
            >
              corrections policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
