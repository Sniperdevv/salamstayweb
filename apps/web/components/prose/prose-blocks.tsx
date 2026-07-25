import type { ReactNode } from "react";
import Link from "next/link";
import { Num } from "@/components/numerals";
import { btnSecondary, focusRing } from "@/components/ui";
import { inlineLink } from "@/components/stays/styles";
import {
  column,
  factRow,
  headingGap,
  prose,
  sectionGap,
  sectionH2,
  shell,
  strip,
} from "./shell";

/**
 * The five shapes every prose page is built from. Between them they draw all
 * four content surfaces (GW-006 / 007 / 008 / 009); no page defines a sixth.
 *
 * The card contracts draw most of this content as bordered, rounded cards on a
 * tinted plate — three-across claim cards, four-across step cards, two-across
 * fact cards. None of that survives the TASTE v2 bar: §1 is the governing rule
 * of the system and it is unambiguous that a content block carries NEITHER a
 * border nor a shadow, and that "Things to know"-class sections are title +
 * body in open space. The COPY is the card's, verbatim. The containers are not.
 *
 * The same rule removes the eyebrows (`.sec-eyebrow` above every H2 in all four
 * cards): §7 says `overline` is a form-label token and §11.20 bans section
 * eyebrows outright. Every one is dropped, and no information goes with it —
 * "Plainly", "Both sides", "Still have a question?" label headings that already
 * say what they are.
 *
 * Motion: hover and press only, inherited from `inlineAction`. Nothing enters
 * on load and nothing reveals on scroll. These pages answer a question someone
 * arrived with; staging their paragraphs would delay the answer and re-play on
 * every back-navigation.
 */

/* ────────────────────────────── section ────────────────────────────── */

export interface ProseSectionProps {
  /** Anchor id. The heading takes `{id}-h` so `aria-labelledby` can reach it. */
  readonly id: string;
  readonly heading: string;
  readonly children: ReactNode;
  /** The closing section owns its own bottom space rather than the rhythm. */
  readonly last?: boolean;
}

export function ProseSection({ id, heading, children, last = false }: ProseSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className={`${shell} ${last ? "pb-14 md:pb-16" : sectionGap}`}
    >
      <h2 id={`${id}-h`} className={sectionH2}>
        {heading}
      </h2>
      {children}
    </section>
  );
}

/* ─────────────────────────────── prose ─────────────────────────────── */

/**
 * A run of paragraphs at the reading measure. `space-y-4` rather than a margin
 * on each `<p>`, so a run's internal gap is one value and the run's distance
 * from the heading is the shared `headingGap`.
 */
export function Prose({
  children,
  gap = true,
}: {
  readonly children: ReactNode;
  /** Off when the run follows a strip or a list rather than a heading. */
  readonly gap?: boolean;
}) {
  return <div className={`${gap ? headingGap : "mt-6"} space-y-4 ${prose}`}>{children}</div>;
}

/**
 * A transliterated term on first use — `amanah`, `markaz`. `<i>` is the HTML
 * element for exactly this (a phrase in another language, set off from the
 * prose around it), and slope is the card's own treatment.
 *
 * Ink, and no weight bump: §7 bolds the payload word, and a word already
 * marked by its slope does not need marking a second time.
 */
export function Term({ children }: { readonly children: ReactNode }) {
  return <i className="text-primary">{children}</i>;
}

/* ──────────────────────────── fact / step rows ─────────────────────── */

export interface FactRow {
  readonly term: string;
  readonly detail: ReactNode;
}

/**
 * Term + description rows. A `<dl>`, because that is what they are: the card
 * draws them as a `<ul>` of `<span>` pairs, which loses the association.
 */
export function FactList({ items }: { readonly items: readonly FactRow[] }) {
  return (
    <dl className={`${headingGap} ${column}`}>
      {items.map((item) => (
        <div key={item.term} className={factRow}>
          {/* `Num` on the term, not on the detail: a term is a short label and
              the digit runs in it ("24/7", "1-2 days") are the ones a reader
              scans. The shipped `.num` canon isolates every run so RTL cannot
              reorder it. */}
          <dt className="text-bodyMd font-semibold text-primary">
            <Num>{item.term}</Num>
          </dt>
          <dd className="mt-1.5 text-bodySm text-secondary [&_strong]:font-semibold [&_strong]:text-primary">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The same rows where order is load-bearing — the amanah hold, the mediation
 * track. An `<ol>`, and deliberately WITHOUT printed step numbers: the step
 * names are verb phrases ("You pay", "Held in amanah", "You check in"), the
 * list element already carries the order for assistive tech, and a numeral in
 * front of each one is the "Stage 1 / Stage 2" tic.
 */
export function StepList({ items }: { readonly items: readonly FactRow[] }) {
  return (
    <ol className={`${headingGap} ${column}`}>
      {items.map((item) => (
        <li key={item.term} className={factRow}>
          <p className="text-bodyMd font-semibold text-primary">{item.term}</p>
          <p className="mt-1.5 text-bodySm text-secondary [&_strong]:font-semibold [&_strong]:text-primary">
            {item.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ──────────────────────────────── strip ────────────────────────────── */

/**
 * `bg.raised` info strip: one bold payload line, one body line. The card draws
 * these as blue-tinted `info.bg` callouts with a glyph; §6 says the site has
 * exactly ONE section tint and it is `bg.raised`, so the second tint goes and
 * the glyph goes with it (§11.20: zero decoration).
 */
export function NoteStrip({
  heading,
  children,
}: {
  readonly heading: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className={`mt-6 ${strip}`}>
      {/* The heading is a §5 claim on most of these strips, and claim 8 carries
          "24/7". A string heading gets its digit runs isolated; a ReactNode
          heading has already composed its own. */}
      <p className="text-bodyMd font-semibold text-primary">
        {typeof heading === "string" ? <Num>{heading}</Num> : heading}
      </p>
      <p className="mt-2 text-bodySm text-secondary [&_strong]:font-semibold [&_strong]:text-primary">
        {children}
      </p>
    </div>
  );
}

/* ─────────────────────────────── links ─────────────────────────────── */

export interface ProseLink {
  readonly href: string;
  readonly label: string;
}

/**
 * The cards' "deep link" rows. Underlined at rest, in ink (§8) — not brand:
 * §2 spends green on four roles and a row of help links is none of them.
 *
 * NO leading or trailing arrow glyph, though every card draws one. Three
 * arrows in a row all pointing the same way is decoration rather than
 * direction, which is the finding `components/city/city-related.tsx` already
 * recorded when it dropped its own nine.
 *
 * A plain `<ul>`, not a `<nav>`: the footer already publishes four navigation
 * landmarks and these pages carry three or four link rows each. Twenty
 * landmarks describing one page is worse for a screen-reader user than none.
 */
export function LinkRow({ links }: { readonly links: readonly ProseLink[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link href={link.href} className={`${inlineLink} ${focusRing}`}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The closing block every trust-cluster card ships: a support line, the two or
 * three places to read next, and one action.
 *
 * Two decisions worth stating.
 *
 * The action is the SECONDARY button — §5's one gray-fill plate, imported
 * whole — and not the card's green `btn-primary`. §2 allows exactly one primary
 * CTA per surface, and the doctrine is that the header CTA yields to a
 * PAGE-OWNED primary (`site-header.tsx`). Greening this button would claim that
 * slot for "open a help ticket" on every trust page that ships this block, and
 * demote the header's Sign up on all of them, to promote the least important
 * action on the page. The claim is not worth making. Same target, ink label.
 *
 * It sits in open space rather than on the card's `bg.raised` plate. A plate
 * under a plate does not work — the §5 button IS `bg.raised`, so on a raised
 * strip it would either vanish or have to invert into a shape that exists
 * nowhere else on the site. The strips on these pages are reserved for the
 * sentences that carry a boundary; a closing paragraph is not one.
 */
export function ClosingNote({
  children,
  action,
}: {
  readonly children: ReactNode;
  readonly action: ProseLink;
}) {
  return (
    <>
      <div className={`${headingGap} space-y-4 ${prose}`}>{children}</div>
      <Link href={action.href} className={`mt-6 ${btnSecondary}`}>
        {action.label}
      </Link>
    </>
  );
}
