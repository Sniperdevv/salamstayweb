/**
 * The legal-page content contract — GW-010 … GW-014.
 *
 * Five approved cards ship the same document: one H1, a last-updated stamp, an
 * on-this-page anchor nav, then numbered H2 clauses, some H3 sub-clauses, and a
 * contact block. Only the copy differs, so the copy is data and the document is
 * a template (`components/legal/legal-page.tsx`).
 *
 * WHY RICH TEXT IS TYPED RUNS AND NOT AN HTML STRING
 * --------------------------------------------------
 * Legal copy is card-verbatim: it carries bolded payload words, inline links,
 * digit runs and two transliterated Arabic terms. Storing it as HTML would mean
 * `dangerouslySetInnerHTML` on every paragraph, which puts card copy one typo
 * away from an injection surface and hides three of this repo's binding rules
 * from the type checker. As typed runs the rules hold BY CONSTRUCTION:
 *
 *  · `num(…)` is the only way to render a figure, so TASTE §12 / the `.num`
 *    RTL-isolation canon cannot be forgotten on a number.
 *  · `link(…)` is the only way to render an anchor, so TASTE §8's
 *    underline-at-rest ink treatment is not a per-author decision, and every
 *    href sits in one grep-able place for the G37 registry check.
 *  · `bold(…)` marks a payload word (TASTE §7 "bold the payload word only");
 *    there is no run that bolds a block, so a whole bolded sentence is not
 *    expressible.
 *
 * The constructors below are one letter longer than the markup they replace, so
 * a paragraph still reads as a sentence when you diff it against its card.
 */

/** One span of card copy. Recursive so a bolded clause can contain a figure. */
export type Run =
  | string
  | { readonly bold: readonly Run[] }
  | { readonly num: string }
  | { readonly term: string }
  | { readonly href: string; readonly label: readonly Run[] };

export type Rich = readonly Run[];

/** Payload emphasis. Never a whole sentence — TASTE §7. */
export const bold = (...runs: Run[]): Run => ({ bold: runs });

/**
 * A digit run. Renders inside `.num`, which sets tabular figures and, under
 * `[dir="rtl"]`, isolates the run back to LTR so Urdu prose cannot reorder it.
 * Every figure on these pages goes through here — dates, counts, rupee amounts,
 * clause numbers, the ledger.
 */
export const num = (value: string): Run => ({ num: value });

/** A transliterated term the cards set apart: `amanah`, `wakala`. */
export const term = (value: string): Run => ({ term: value });

/** An inline link. Ink, underlined at rest (TASTE §8) — never brand green (§2). */
export const link = (href: string, ...label: Run[]): Run => ({ href, label });

/** Title + body, the shape every fact row and step on these pages takes. */
export interface Entry {
  readonly title: Rich;
  readonly body: Rich;
}

/**
 * One row of a data table: a row header plus its cells.
 *
 * The cards render the negative column (GW-012's "no refund") in
 * `text.tertiary`. That role is AA-large only — its own token note says use it
 * at 18.66px and above — and these cells are 14px, so every cell here is
 * `text.secondary` and the column heading does the distinguishing. Contrast is
 * not a place to copy a card.
 */
export interface TableRow {
  readonly header: Rich;
  readonly cells: readonly Rich[];
}

/** A read-only consent state row. These are disclosures, never controls. */
export interface StateRow {
  readonly title: Rich;
  readonly body: Rich;
  /** "Always on" | "Off" — the state as shipped, not a switch. */
  readonly state: string;
  /** Locked-on rows take the ink fill (TASTE §3); everything else is outline. */
  readonly locked?: boolean;
}

/** One line of the GW-012 worked example. */
export interface LedgerRow {
  readonly title: Rich;
  readonly note: Rich;
  readonly value: Rich;
  /** Kept off the refund — rendered quiet, exactly as the card ships it. */
  readonly muted?: boolean;
}

export type Block =
  /** Body paragraph. */
  | { readonly kind: "p"; readonly text: Rich }
  /** The one support line a section may carry under its H2 (the card's `sec-sub`). */
  | { readonly kind: "note"; readonly text: Rich }
  /** Sub-clause heading. */
  | { readonly kind: "h3"; readonly text: string }
  /** Fact rows in open space — no plate, no card (TASTE §1). */
  | { readonly kind: "facts"; readonly items: readonly Entry[]; readonly single?: boolean }
  /** An ordered flow: the amanah hold, the mediation route. */
  | { readonly kind: "steps"; readonly items: readonly Entry[] }
  /** A `bg.raised` info strip (TASTE §6, job 3). */
  | { readonly kind: "callout"; readonly title: Rich; readonly body: Rich }
  /**
   * A labelled counsel slot: a clause that is NOT WRITTEN YET, shown as a
   * visibly unfinished row rather than filled with plausible legal text.
   * `columns` renders an empty table head (GW-014's cookie inventory).
   */
  | {
      readonly kind: "slot";
      readonly label: string;
      readonly title: Rich;
      readonly body: Rich;
      readonly columns?: readonly string[];
    }
  | {
      readonly kind: "table";
      readonly caption: string;
      /** DOM id for the caption paragraph; the table points at it with `aria-describedby`. */
      readonly captionId: string;
      readonly head: readonly string[];
      readonly rows: readonly TableRow[];
    }
  | { readonly kind: "states"; readonly items: readonly StateRow[] }
  | {
      readonly kind: "ledger";
      readonly title: Rich;
      readonly meta: Rich;
      readonly rows: readonly LedgerRow[];
      readonly total: LedgerRow;
    }
  /**
   * GW-013 only, and structurally load-bearing: the host's own requests for
   * their own home, kept in their own container so they can never be read as
   * SalamStay conduct rules.
   */
  | {
      readonly kind: "hostGroup";
      readonly heading: string;
      readonly note: Rich;
      readonly items: readonly { readonly title: Rich; readonly quote: string }[];
    }
  /** A shipped sentence quoted as the boundary it sets, plus what it governs. */
  | { readonly kind: "boundary"; readonly text: Rich; readonly source: Rich }
  /**
   * GW-014 only: the consent record, with the one real control that backs the
   * sentence "Change it here" — it clears the stored choice and brings the
   * root-layout banner back.
   */
  | { readonly kind: "consentRecord"; readonly title: Rich; readonly body: Rich };

export interface Section {
  /** Anchor target; the on-this-page nav is built from these. */
  readonly id: string;
  /** H2 text. The anchor nav reuses it, so label and heading cannot drift. */
  readonly heading: string;
  readonly blocks: readonly Block[];
}

/** The closing contact block every one of the five cards ends on. */
export interface ClosingBlock {
  readonly title: string;
  readonly body: Rich;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

export interface LegalPageContent {
  /** Registry path — drives title, robots and canonical (G4/G6/G41). */
  readonly path: string;
  readonly metaDescription: string;
  readonly h1: string;
  /**
   * Home › {policy}. TWO levels, deliberately: there is no `/legal` index route
   * in the registry, so an intermediate crumb would be a dead href.
   */
  readonly crumbs: readonly { readonly name: string; readonly path: string }[];
  readonly lede: Rich;
  /** The honest authoring date of the design. Rendered inside `.num`. */
  readonly lastUpdated: string;
  readonly sections: readonly Section[];
  readonly closing: ClosingBlock;
}
