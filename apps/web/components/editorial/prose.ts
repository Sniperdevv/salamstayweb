import { gutter } from "@/components/ui";

/**
 * The policy-document grammar, for the two §3.8 pages that are NOT one of the
 * five clause documents: GW-017 (editorial and fact-check policy) and GW-018
 * (corrections policy).
 *
 * WHY THIS FILE EXISTS AND WHAT IT IS: every value below is lifted, unchanged,
 * from `components/legal/legal-page.tsx` — the template that renders GW-010 …
 * GW-014 at `/legal/*`. Those two pages sit in the same directory, in the same
 * footer group, one click from each other; if they were re-measured they would
 * read as a different site. They do not go through `LegalPage` itself because
 * neither is a clause document: gw-017 is a sourcing table plus a process, and
 * gw-018 turns on a real `<table>` in a real EMPTY state plus a labelled format
 * specimen, and neither shape is in that template's block union. Adding two
 * one-off block kinds to a shared union to serve two pages is how a template
 * stops being a template.
 *
 * So: same measures, same roles, same rules, different assembly. If
 * `legal-page.tsx` moves, this file moves with it — that is the whole contract,
 * and it is why the strings are here rather than retyped inside each page.
 *
 * The v2 bar those values encode, in one place:
 *  · `container.wide` shell, `container.prose` (720px ≈ 72ch) reading column
 *    left-aligned inside it, so the H1 starts under the wordmark.
 *  · H1 at `h3` (28), sections at `h5` (20), block titles 16/500-600, body 14 —
 *    never 14-on-14 (TASTE-RULES §7).
 *  · Zero eyebrows. Sections are separated by a hairline rule, never a plate:
 *    §1 puts content blocks in open space with neither border nor shadow.
 *  · `bg.raised` only where §6 sanctions it — the date strip and info strips.
 *  · Green is spent before the page starts (wordmark dot + the header's one
 *    CTA), so links are ink-underlined-at-rest (§8) and the closing action is
 *    the §5 gray-fill secondary button.
 */

export const shell = `mx-auto max-w-wide ${gutter}`;

/** The reading column. `max-w-prose` resolves to `container.prose` = 720px. */
export const column = "max-w-prose";

/** The document body: column, top padding, and the bottom space of the page. */
export const documentColumn = "max-w-prose pb-12 md:pb-16";
export const documentHead = "pt-6 md:pt-8";

export const pageH1 = "text-h3 text-primary";
export const ledeText = "mt-4 text-bodyLg leading-relaxed text-secondary";

/** The date strip under the lede. `bg.raised`, payload bolded (§6/§7). */
export const dateStrip = "mt-6 rounded-md bg-raised p-4";

export const sectionBlock = "scroll-mt-24 border-t border-hairline py-8 md:py-10";
export const sectionH2 = "text-h5 text-primary";
/**
 * A real subsection inside a section. 16/600, the same role the five clause
 * documents and the four trust pages both use for an `<h3>` — the step down
 * from it is the fact title's 16/500, a weight step rather than a size step.
 */
export const subH3 = "mt-8 text-bodyMd font-semibold text-primary";

export const bodyText = "text-bodySm leading-relaxed text-secondary";
export const paraText = `mt-4 ${bodyText}`;

/**
 * Fact rows: a rule between rows, never a box around each one. The first row
 * drops its rule because the heading above it is already the boundary; in a
 * two-column grid the second row drops it too, because it is also a first row.
 */
export const factGrid = "mt-6 grid gap-x-10 md:grid-cols-2";
export const factGridSingle = "mt-6 grid gap-x-10";
export const factRow = "border-t border-hairline py-4 first:border-t-0 first:pt-0";
export const factRowTwoCol = `${factRow} md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2)]:pt-0`;

/** 16/500 title over 14 body. Never 14-on-14. */
export const factTitle = "text-bodyMd font-medium text-primary";
/** 16/600 — a strip heading or a block that names itself. */
export const blockTitle = "text-bodyMd font-semibold text-primary";

/** `bg.raised`, `radius.md` (§6 job three). No border, no shadow. */
export const strip = "mt-6 rounded-md bg-raised p-5";

/**
 * Data table. No wrapper border and no rounded plate: the rules between rows
 * ARE the table, and a box around them would be the card treatment §1 removes.
 * Wide tables scroll inside their own box rather than pushing the page sideways.
 */
export const tableScroll = "mt-6 overflow-x-auto";
export const tableEl = "w-full border-collapse text-left";
export const tableCaption = "mb-3 text-left text-bodySm text-secondary";
export const tableHeadCell =
  "border-b border-border-default pb-2 pr-4 align-bottom text-bodySm font-semibold text-primary last:pr-0";
export const tableRow = "border-b border-hairline align-top last:border-b-0";
export const tableRowHead = "py-3 pr-4 text-left text-bodySm font-medium text-primary";
export const tableCell = "py-3 pr-4 text-bodySm text-secondary last:pr-0";

/** The closing contact block: hairline, title, body, gray-fill action. */
export const closingBlock = "border-t border-hairline pt-8 md:pt-10";
