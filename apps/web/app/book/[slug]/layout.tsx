import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { LockIcon } from "@/components/icons";
import { LanguageGroup } from "@/components/language-group";
import { Phrase } from "@/components/numerals";
import { focusRing, inlineAction } from "@/components/ui";
import { BookingProvider } from "@/lib/booking/booking-state";
import { bookableListing, listingName } from "@/lib/content/listings";

/**
 * The `/book/{slug}` boundary — `CHECKOUT-SHELL.md` §2's reduced chrome, and the
 * one place `BookingProvider` mounts.
 *
 * WHAT IT OWNS, AND WHY EACH PIECE IS HERE RATHER THAN IN A STEP
 * -------------------------------------------------------------
 *  · **The reduced header and footer.** §2 removes the search pill, the
 *    marketing nav and the Log in / Sign up pair. Removing the header CTA is
 *    also what settles TASTE §2 structurally rather than by exception: with no
 *    chrome CTA, brand green on every checkout surface is spent on exactly the
 *    wordmark dot, the one enabled primary and the verification shield. Seven
 *    steps drawing their own header is seven chances for one of them to grow a
 *    fourth green thing.
 *  · **`<main class="co-main">`.** §1: never `class="indexable"`. Like
 *    `indexable` it is a marker with no stylesheet behind it — the gates read it
 *    off the served HTML. `HostAppShell` renders its `<main>` for the same
 *    reason: a page cannot get wrong what it does not write.
 *  · **`robots: noindex, follow`.** Next merges metadata down the tree, so a
 *    checkout surface added later is noindex by construction rather than by its
 *    author remembering. `robots.txt` disallows `/book/` besides (ruling 6,
 *    already shipped in `app/robots.ts`); the meta tag is what a crawler that
 *    ignored the file still has to obey.
 *  · **`BookingProvider`.** Its own doc names this file: React context survives
 *    navigation between routes that share a layout and dies when the guest
 *    leaves it, which is exactly the lifetime a draft should have. Mounted per
 *    step instead, every step would open empty.
 *
 * WHAT IT DELIBERATELY DOES NOT OWN
 * ---------------------------------
 * **The `<title>`.** Each step exports its own, from the registry. A title set
 * here would give all seven routes the same string, and G41 compares the served
 * title to `entry.title` byte for byte AND rejects duplicates across an `--all`
 * run — which is exactly the failure the host wizard shipped and had to be
 * unpicked. Seven routes, seven titles, one source: `lib/seo/route-registry.ts`.
 *
 * WHY THE ROOT CHROME IS NOT HERE TO REMOVE
 * -----------------------------------------
 * `app/layout.tsx` renders `SiteHeader` / `SiteFooter` around every route and a
 * Next layout cannot unrender what an ancestor drew, so `components/
 * guest-chrome.tsx` gates them — it already excluded `/host/*` for the identical
 * reason (`HOST-SHELL.md` §1) and now excludes `/book/*` too. That gate resolves
 * during the SERVER render, so the marketing chrome is absent from the emitted
 * HTML rather than removed a frame later. On a `noindex, follow` checkout that
 * distinction is the whole point: a footer carrying twenty marketing hrefs that
 * reaches the crawler has already been followed.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/** Where the header's skip link lands. One `<main>` per step, so a constant is honest. */
const CHECKOUT_MAIN_ID = "checkout-main";

export default async function CheckoutLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;

  /**
   * `bookableListing` returns a home only when its seven `/book/{slug}/{step}`
   * rows are in the registry. Eleven homes have content; one is registered. A
   * checkout rendered for an unregistered home would have no title for G41 to
   * compare and no `pageMetadata()` call that does not throw, so the honest
   * answer is a 404 rather than a page that half-works.
   */
  const listing = bookableListing(slug);
  if (listing === undefined) notFound();

  return (
    <>
      {/*
        The checkout chrome precedes the form on all seven steps, which is the
        repeated block WCAG 2.4.1 asks to be bypassable. It targets this shell's
        own `<main>` rather than the root layout's `#main-content`, which wraps
        the header and would land a keyboard user above the links they were
        trying to skip.

        INK, not the brand fill the site header's skip link uses: §7 budgets this
        surface at three green roles and a fourth that only a keyboard user ever
        sees is still a fourth. `wizard-step.tsx` made the same call.
      */}
      <a
        href={`#${CHECKOUT_MAIN_ID}`}
        className={`sr-only rounded-md bg-selected text-bodySm font-semibold text-selected-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:px-4 focus:py-3 ${focusRing}`}
      >
        Skip to the form
      </a>

      {/*
        §2: 64px, `bg.canvas`, `elevation.subtle` (§8). NOT sticky — §3 puts the
        stepper in the main column precisely so the progress indicator does not
        scroll away from the form, which is an argument that only holds if the
        chrome does. The gutter is the card's 28, dropping to 20 on a phone.
      */}
      <header
        className={`relative z-header flex h-16 items-center gap-3 bg-canvas px-5 shadow-subtle md:gap-4 md:px-7`}
      >
        {/* TASTE §2 role 1 — the wordmark dot, and the only ink-and-green pair
            in this chrome. It points at `/`, as the card does: the way out of a
            checkout to the rest of the site. */}
        <Link
          href="/"
          aria-label="SalamStay — home"
          className={`shrink-0 rounded-md text-h5 font-semibold tracking-tight text-primary ${focusRing}`}
        >
          Salam<span className="text-interactive">.</span>Stay
        </Link>

        <span aria-hidden="true" className="flex-1" />

        {/*
          A statement, not a control. It hides below `sm`, where the card's own
          390px panel drops it too — at that width the language switch and the
          way out are what a guest needs from this bar.
        */}
        <span className="hidden shrink-0 items-center gap-2 text-label font-regular text-secondary sm:inline-flex">
          <LockIcon className="size-4 shrink-0" />
          Your details are encrypted
        </span>

        {/*
          Ruling 13: اردو ships as an inert `<span>`, not a link. No `/ur/` route
          exists, the site is EN-only in v1, and G37 fails any internal href not
          in the registry — so a language switch that resolved to a "being
          written" stub would be worse than one that visibly is not ready. Urdu
          is tracked at GO-LIVE C2. `LanguageGroup` already ships exactly this,
          with the current item INK-filled rather than brand (§7: a green
          language chip would be a fourth green role competing with the CTA).
        */}
        <LanguageGroup className="inline-flex" />

        {/*
          §2's ONE exit affordance, and §15: `Save & exit` is the route out to the
          listing — which is what makes a `Back` link that only goes one step not
          a dead end. Post-flow it reads `Done`, which is that step's own call to
          make; nothing here fixes the label for a surface that has no draft left
          to save.
        */}
        <Link
          href={listing.path}
          className={`${inlineAction} shrink-0 text-bodySm font-medium`}
        >
          Save &amp; exit
        </Link>
      </header>

      <main id={CHECKOUT_MAIN_ID} tabIndex={-1} className="co-main outline-none">
        <BookingProvider listing={listing}>{children}</BookingProvider>
      </main>

      {/*
        §2: the `bg.raised` band and its hairline top survive from the marketing
        footer; the four-column sitemap does not. A `noindex` checkout has no
        crawl job and thirty outbound links are thirty ways to lose a booking.
        One legal row stays, because legal reachability during a payment flow is
        not optional.
      */}
      <footer className="mt-4 border-t border-hairline bg-raised px-5 py-6 md:px-7">
        <h2 className="sr-only">Footer</h2>
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-4 text-label font-regular text-secondary">
          {/* GO-LIVE A17. The year is a `.num` isolate with prose on both sides
              of it, so under RTL the line read `SalamStay · Booking Margalla
              View Apartment © 2026`. The isolate wraps the copyright line, not
              the year inside it — and sits inside this flex item rather than
              replacing it, so the footer row keeps its own direction. */}
          <span>
            <Phrase>
              © <span className="num">2026</span> SalamStay ·{" "}
              <span className="sr-only">Booking </span>
              {listingName(listing)}
            </Phrase>
          </span>
          {/* Ink, not gray, and no underline at rest — TASTE §10's footer recipe.
              §8's underline-at-rest governs inline text actions inside prose;
              these are chrome destinations, drawn the way the site footer draws
              its own bottom row. */}
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { href: "/legal/terms", label: "Terms" },
              { href: "/legal/privacy", label: "Privacy" },
              { href: "/legal/guest-refund-policy", label: "Guest refund policy" },
              { href: "/help", label: "Help center" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`-mx-1 rounded-md px-1 py-1 text-primary underline-offset-4 transition-colors duration-instant ease-decelerate hover:underline motion-reduce:transition-[opacity,color] ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
