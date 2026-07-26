import Link from "next/link";
import type { ReactNode } from "react";

import { PersonIcon } from "@/components/home-icons";
import { HelpIcon } from "@/components/icons";
import { LanguageGroup } from "@/components/language-group";
import { focusRing, pressable } from "@/components/ui";
import { HostNav } from "./host-nav";
import { hostChromeGutter } from "./host-ui";

/**
 * The host APP chrome — `HOST-SHELL.md` §2b, drawn by `hw-001` panel D and
 * `hw-007` panels D and E, inherited from `ha-046`.
 *
 * ONE OF TWO CHROMES, AND THEY DO NOT COMPOSE
 * -------------------------------------------
 * §2: "A host card wears **one** of these. Never both, never a hybrid." The
 * other is the wizard chrome at `/host/listings/new/{step}` — a reduced header
 * with a context line and a sticky nine-bar action bar, no section nav, no
 * language switch, no avatar. That is why this shell is a component the app
 * routes opt into rather than something `app/host/layout.tsx` imposes on the
 * whole subtree: a wizard step that inherited a section nav would be wearing
 * both.
 *
 * WHAT §2b SPECIFIES, AND THE TWO DEPARTURES FROM `ha-046` IT MANDATES
 * --------------------------------------------------------------------
 * 60px header — wordmark · `Hosting` chip · spacer · "Switch to travelling" ·
 * language switch · currency · help · avatar — over the section nav, with the
 * content column centred beneath both. The departures:
 *  · **the currency reads `PKR` alone.** `ha-046` appends the bare rupee glyph;
 *    §16.1 struck even the "numeric input prefix" carve-out §2b had left it. It
 *    ships in no file, this one included.
 *  · **the language switch's current item is ink-filled, not brand-filled**
 *    (TASTE §3). `LanguageGroup` already ships exactly that and is shared with
 *    the guest header, so the correction arrives for free rather than being
 *    re-made here.
 *
 * WHAT IS INHERITED AND NOT "FIXED": the `Hosting` chip's brand label on a
 * brand-subtle fill and the avatar's brand fill are `ha-046`'s own language and
 * put this surface over TASTE §2's four green roles. §2b: "Flagged, not fixed…
 * Inherit them; do not 'fix' them ad hoc on a sibling card, and do not invent
 * new brand roles either." Nothing green has been added; nothing green has been
 * taken away either.
 *
 * WHAT IS NOT HERE
 * ----------------
 * No search pill, no marketing nav, no Log in / Sign up (§2a's list holds for
 * both chromes) and — §1's one explicit divergence from `CHECKOUT-SHELL.md` —
 * **no site footer.** "Every web-drawn host card ends at `</main>`. The host
 * surfaces are an authenticated app shell whose bottom edge is the action bar
 * (wizard) or the content (app)." No breadcrumb either, on any host route.
 */

/** Where the header's own skip link lands. See `HostAppShell`. */
const HOST_MAIN_ID = "host-main";

/**
 * The account control, without a name.
 *
 * `ha-046` and both `hw-` cards draw a brand disc carrying the host's initials
 * and an `aria-label` of "Your account, Aqib". The initials and the name are
 * that host's data, and there is no session on this build to read them from —
 * so the disc keeps its role, its size and its fill, and the payload it cannot
 * honestly print becomes the neutral person glyph the corpus already uses.
 * Inventing "AK" would be the same class of thing as inventing a rating.
 *
 * The label drops the name for the same reason and stays a complete sentence
 * without it.
 */
function AccountAvatar() {
  return (
    <Link
      href="/account"
      aria-label="Your account"
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-interactive text-on-brand ${focusRing} ${pressable}`}
    >
      <PersonIcon className="size-5" />
    </Link>
  );
}

export function HostHeader() {
  return (
    <header
      /*
       * 60px in the card; the spacing scale runs 48 → 64 with nothing between,
       * so `h-16` (64) is the rung. It is also the guest header's height, which
       * is the better of the two accidents available: a host switching modes
       * gets a bar that stays put instead of jumping 4px.
       */
      className={`flex h-16 items-center gap-4 border-b border-hairline bg-canvas ${hostChromeGutter}`}
    >
      {/*
        The wordmark points at Today, not at `/` — `/` is the traveller side,
        and inside this shell the home is the shell's own first section. Both
        `hw-` cards link it that way. Ink with a green dot (TASTE §2 role 1).
      */}
      <Link
        href="/host/today"
        aria-label="SalamStay hosting — Today"
        className={`shrink-0 rounded-md text-h5 font-semibold tracking-tight text-primary ${focusRing}`}
      >
        Salam<span className="text-interactive">.</span>Stay
      </Link>

      {/* Inherited from `ha-046`, over budget, flagged — see the file note. */}
      <span className="shrink-0 rounded-full bg-brand-subtle px-3 py-1 text-caption font-semibold text-interactive">
        Hosting
      </span>

      <span aria-hidden="true" className="flex-1" />

      {/*
        THE WAY BACK IS ALWAYS VISIBLE, at every width. `hw-007`: "A door you can
        see from the inside is what makes the room not a trap." So this is the
        one item on the trailing side with no responsive hide — the three below
        it drop below `md`, this does not.

        No underline at rest, and TASTE §8 is not being broken: §8 governs inline
        text actions inside prose. This is a chrome link, and the guest header's
        own nav links are drawn the same way.
      */}
      <Link
        href="/"
        className={`shrink-0 rounded-md text-bodySm text-secondary transition-colors duration-instant ease-decelerate hover:text-primary motion-reduce:transition-[opacity,color] ${focusRing}`}
      >
        Switch to travelling
      </Link>

      <LanguageGroup className="hidden md:inline-flex" />

      {/*
        A statement, not a switch. The card draws `.curr` as a span and there is
        no currency picker on this build; a control that looked pressable and
        opened nothing would be worse than the label. `PKR` alone — §6 and
        §16.1: the bare rupee glyph ships in no file.
      */}
      <span className="hidden shrink-0 text-bodySm text-secondary md:inline">PKR</span>

      <Link
        href="/help"
        aria-label="Help center"
        className={`hidden size-10 shrink-0 place-items-center rounded-full border border-border-default bg-canvas text-secondary transition-colors duration-instant ease-decelerate hover:border-border-strong motion-reduce:transition-[opacity,border-color] md:grid ${focusRing}`}
      >
        <HelpIcon className="size-5" />
      </Link>

      <AccountAvatar />
    </header>
  );
}

/**
 * Header + section nav + the content column. Every `/host/{section}` page's
 * frame, and the boundary that guarantees the route contract's `<main>`.
 *
 * `class="co-main"`, never `class="indexable"` (§1). Like `indexable` it is a
 * marker with no stylesheet behind it: the gates read the class off the served
 * HTML, and a class that also painted something would make the semantic
 * statement and the layout impossible to change independently.
 */
export function HostAppShell({ children }: { readonly children: ReactNode }) {
  return (
    <>
      {/*
        Six repeated nav links precede the content on every host page, which is
        exactly what WCAG 2.4.1 asks to be bypassable. It targets this shell's
        own `<main>` rather than the root layout's `#main-content`, which wraps
        the host chrome and would land a keyboard user above the nav they were
        trying to skip.
      */}
      <a
        href={`#${HOST_MAIN_ID}`}
        className={`sr-only rounded-md bg-interactive text-bodySm font-semibold text-on-brand focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:px-4 focus:py-3 ${focusRing}`}
      >
        Skip to content
      </a>

      <HostHeader />
      <HostNav />

      {/*
        `.main` is `max-width:1148px; padding:28px 24px 40px`. 1148 is not a
        container rung; `container.page` (1120) is the neighbour and the only
        one that is not the full 1280 dashboard width. The three paddings are
        exact (28 = space-7, 24 = space-6, 40 = space-10).
      */}
      <main
        id={HOST_MAIN_ID}
        tabIndex={-1}
        className="co-main mx-auto w-full max-w-page px-6 pb-10 pt-7 outline-none"
      >
        {children}
      </main>
    </>
  );
}

export default HostAppShell;
