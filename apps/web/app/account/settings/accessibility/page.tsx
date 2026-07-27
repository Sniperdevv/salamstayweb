import type { Metadata } from "next";
import Link from "next/link";

import { LanguageGroup } from "@/components/language-group";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";

/**
 * GA-068 — `/account/settings/accessibility`, at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  FOUR CONTROLS ON THE CARD. ZERO ON THE PAGE. EVERY ONE OF THEM IS ABSENT
 *  FOR A DIFFERENT REASON, AND EACH REASON IS WRITTEN OUT WHERE IT BITES.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `ga-068` draws a language radiogroup, a currency Select, a text-size slider
 * and an Appearance Select beside a Reduce-motion Switch. This page draws none
 * of them, and that is not a scoping cut — it is the brief's own rule applied
 * four times: *a control that cannot do anything must say so, or not exist.*
 * The composer's Send (`app/messages/[threadId]/composer.tsx`) is the precedent
 * for saying so; here the honest answer is the second half, because unlike Send
 * there is no action any of these four would ever be the button for.
 *
 *  1. **Language** ships as `LanguageGroup` — the site's own EN/اردو affordance,
 *     imported, not redrawn (`GUEST-SHELL.md` §15 lists the file by name).
 *     `BUILD-DECISIONS.md` #13: *"ship it as a non-link affordance … **Do not add
 *     `/ur/` stubs to quiet the gate.** A language switch that resolves to a
 *     'being written' page is worse than one that visibly isn't ready yet."* No
 *     `/ur/` href appears below; اردو is an inert span inside that component and
 *     the paragraph beside it says why in the reader's own words. Urdu is
 *     `GO-LIVE` C2.
 *  2. **Currency is a fact, not a picker.** `lib/content/listings/is-f7-2bed.ts`
 *     types the currency union with one member and argues it: *"SalamStay lists
 *     homes in Pakistan, and the USD figure the FX surfaces show … is a
 *     conversion displayed at payment time, not a second price anyone set."*
 *     `ga-068` draws a Select whose list has one enabled row; a chooser with one
 *     choice implies a second exists. It is also true today that **no second
 *     currency renders anywhere on this site** — `grep -rn USD app lib components`
 *     returns exactly one hit and it is that type comment — so the card's *"another
 *     currency is shown for reference only"* line would be describing a surface
 *     that is not built. The load-bearing half of it ships; the half about a
 *     second figure does not.
 *  3. **Text size and 4. motion are the reader's, and the site already obeys
 *     them.** The token scale is emitted in `rem`
 *     (`packages/design-tokens/src/tailwind-preset.ts` maps every `fontSize` role
 *     to a rem string), so browser zoom and text size scale the whole page; and
 *     `motion-reduce:` variants ship in 50 files, which is `prefers-reduced-motion`
 *     honoured at the component level rather than promised at the top. An in-app
 *     slider and an in-app switch would sit beside the settings that are actually
 *     doing the work, and only one of each pair would be connected. Building the
 *     connected version means an override written at `<html>` before first paint
 *     plus a Tailwind variant that answers to a class rather than a media query —
 *     a root-level change, and this wave owns `app/account/settings/`. Reported,
 *     not improvised.
 *
 * **Appearance is absent with no line spent arguing it.** The preset does emit a
 * `.dark` scope (`app/theme.css` line 57) — `GUEST-SHELL.md` §10's *"the preset
 * never emits `elevationDark`"* is stale — but nothing on this site ever adds the
 * class: `grep -rn classList app components lib` is empty. So there is one theme,
 * and the section states that as a fact rather than offering a switch between one
 * thing and nothing.
 *
 * WHAT ELSE THE CARD DRAWS THAT IS NOT HERE
 * ------------------------------------------
 *  · **"More languages are on the way."** `ga-068`'s own note says AR and Pashto
 *    are *"on the roadmap, not built"*. `GO-LIVE` C2 tracks Urdu and nothing
 *    else, so a line promising further languages is a roadmap nobody has
 *    committed to — §14's class of invention, in the softest possible voice.
 *    Urdu is named because it is tracked; the plural is not.
 *  · **The live text-size preview.** It previews a slider that is not here.
 *
 * SHAPE (§4c / TASTE §1). Three labelled sections separated by a hairline, no
 * cards and no plates. The third is the `<dl>` anatomy `/account/verification`
 * renders for its three checked fields — a hairline between rows, no container —
 * because §1 puts a block of statements in the "carries NEITHER" column.
 *
 * NO `step.tsx`. There is no state on this page, so there is nothing for a
 * `"use client"` body to hold and `export const metadata` stays where G41 needs
 * it without a split. That is `/account/verification`'s shape and the reason is
 * the same; the two stateful siblings (`personal`, `notifications`) split
 * because they hold state, not because the tree has a house style.
 *
 * GREEN (§8): none in the body. Two roles, both chrome — the wordmark dot and
 * the header avatar. `LanguageGroup`'s active segment is INK, which is that
 * component's own documented reason for existing.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `../../layout.tsx` and again off
 * the registry row; no canonical, no hreflang, no JSON-LD, no breadcrumb;
 * `<main class="co-main">` from the layout, never `indexable`; exactly one
 * `<h1>`, paired with the registered title for G43 — title `Language and
 * accessibility — SalamStay`, `<h1>` `Language and accessibility`.
 *
 * The registry row is still `stub("/account/settings/accessibility", …)`.
 * Flipping it to `page()` is a central edit and is reported, not made here;
 * `pageMetadata` reads the same title either way.
 */
export const metadata: Metadata = pageMetadata("/account/settings/accessibility");

/**
 * The three display settings this site takes from somewhere else, and where
 * "somewhere else" is.
 *
 * A `<dl>` and not a list of switches, for the reason in the header. Every entry
 * is checkable: the `rem` claim against the preset, the reduced-motion claim
 * against 50 files of `motion-reduce:`, the one-theme claim against an empty
 * `classList` grep.
 */
const DISPLAY_FACTS = [
  {
    term: "Text size",
    what: "Every size on SalamStay is set in relative units, so your browser's text-size and zoom settings scale the whole page together — headings, labels and buttons, not only the paragraphs.",
  },
  {
    term: "Motion",
    what: "When your device has Reduce Motion turned on, SalamStay drops the travel and keeps the fade. Nothing disappears; it just stops moving.",
  },
  {
    term: "Theme",
    what: "The site is drawn in one light theme. There is no dark theme to switch to yet.",
  },
] as const;

export default function LanguageAndAccessibilityPage() {
  return (
    <>
      {/* §5: *"Back is the hub."* Every settings child ships one ink underlined
          back link to `/account/settings`. */}
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Language and accessibility"
        sub="What SalamStay is written in, what it prices in, and the display settings it takes from your own device."
      />

      <ExampleAccountStrip className="mt-6">
        Every line below is a fact about the site or about your browser, so there is nothing on this
        page to save and nothing to switch.
      </ExampleAccountStrip>

      <AccountSection
        id="language"
        heading="Language"
        sub="SalamStay is published in English today."
        className="mt-8"
      >
        {/*
          The site's own control, imported (§15). Rendering it here rather than
          drawing a two-row radiogroup is deliberate: this is the same affordance
          the reader has already seen in the header on every page, and a settings
          screen that draws a second, different-looking language control would be
          asking which of the two is the real one.

          `inline-flex` is the caller's job — `LanguageGroup` sets no display
          class, exactly as `site-header.tsx`, `mobile-menu.tsx`, `host-chrome.tsx`
          and `app/book/[slug]/layout.tsx` all pass it.
        */}
        <LanguageGroup className="mt-5 inline-flex" />

        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          That is the control in the site header, shown here so this page can say what it does.{" "}
          <span lang="ur" className="font-urdu">
            اردو
          </span>{" "}
          is on it because Urdu is coming, and it does not move yet: no page on SalamStay is written
          in Urdu, so there is nothing to switch to. A switch that opened a half-written page would
          be the worse of the two.
        </p>
      </AccountSection>

      <AccountSection
        id="currency"
        heading="Currency"
        sub="SalamStay lists homes in Pakistan, and prices them in one currency."
        className="mt-8"
      >
        <p className="mt-5 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          Every stay is priced, quoted and paid in{" "}
          <b className="font-semibold text-primary">PKR</b>. There is no second currency to pick and
          none shown anywhere on the site, so the price you read is the amount you are charged.
        </p>

        {/*
          The diaspora half of `ga-057`'s context, without inventing the FX
          surface the card draws. Saying what a foreign bank does is a fact about
          banks; quoting a rate would be a figure SalamStay does not hold, and
          §14 is explicit that a figure nobody holds is a fabrication rather than
          a rounding.
        */}
        <p className="mt-4 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          A card issued outside Pakistan is charged that same PKR amount, and the bank that issued
          it sets the exchange rate. SalamStay does not show a converted figure, because it would
          not be the one you are charged.
        </p>
      </AccountSection>

      <AccountSection
        id="display"
        heading="Text size and motion"
        sub="These belong to your browser and your device, and SalamStay follows both."
        className="mt-8"
      >
        {/*
          `/account/verification`'s three-cell anatomy, reused rather than
          redrawn: a hairline between rows and no container at all. TASTE §1 puts
          a block of statements in the "carries NEITHER" column, and a rule
          between two rows is a separator, not a box.
        */}
        <dl className="mt-5 max-w-[62ch]">
          {DISPLAY_FACTS.map((row) => (
            <div
              key={row.term}
              className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0"
            >
              <dt className="w-24 flex-none text-bodySm font-medium text-primary">{row.term}</dt>
              <dd className="min-w-0 flex-1 text-bodySm leading-relaxed text-secondary">
                {row.what}
              </dd>
            </div>
          ))}
        </dl>

        {/*
          §12's "never a dead end" applied to an absent control rather than a
          disabled one: the reader is told where the working version of each of
          these lives, in the words they would use to find it. `/help` is a built
          page, so the way onward actually goes somewhere.
        */}
        <p className="mt-5 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          There is deliberately nothing here to switch. A text-size slider or a theme picker on this
          page would sit beside the ones your browser and your device already have, and only one of
          each pair would be connected — so change them where you already change them.{" "}
          <Link href="/help" className={`${inlineAction} font-medium`}>
            Ask the help centre if something is hard to read
          </Link>
          .
        </p>
      </AccountSection>
    </>
  );
}
