import Link from "next/link";
import { ConsentResetButton } from "@/components/consent-banner";
import { ConsentStateLine } from "@/components/legal/consent-state-line";
import {
  blockTitle,
  bodyText,
  closingBlock,
  dateStrip,
  detailText,
  documentColumn,
  documentHead,
  factGrid,
  factGridSingle,
  factRow,
  factRowTwoCol,
  factTitle,
  ledeText,
  pageH1,
  sectionBlock,
  sectionH2,
  shell,
  strip,
  subH3,
  tableCaption,
  tableCell,
  tableEl,
  tableHeadCell,
  tableRow,
  tableRowHead,
} from "@/components/editorial/prose";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "@/components/icons";
import { btnSecondary, inlineAction } from "@/components/ui";
import { JsonLdScript, breadcrumbList } from "@/lib/seo/jsonld";
import type {
  Block,
  Entry,
  LedgerRow,
  LegalPageContent,
  Rich,
  Run,
  Section,
} from "@/lib/content/legal/types";

/**
 * GW-010 … GW-014 — ONE legal-document template, five content files.
 *
 * The five cards ship the same document with different clauses, so the document
 * lives here and the clauses live in `lib/content/legal/*`. A sixth policy needs
 * a content object and a four-line route file; it needs nothing from this file.
 *
 * THE SEMANTIC CONTRACT (identical on all five, SEO-RULES §3.8)
 * ------------------------------------------------------------
 *  · One `<h1>`, one `<main class="indexable">`; header and footer landmarks
 *    come from the shared chrome in `app/layout.tsx`.
 *  · Breadcrumb is REQUIRED and is TWO levels: Home › {policy}. There is no
 *    `/legal` index route in the registry, so an intermediate "Legal" crumb
 *    would be a dead href and a crawlable link to a page that does not exist.
 *    The visible trail and the BreadcrumbList are built from the same array, so
 *    G40's "visible ≡ schema" holds by construction.
 *  · JSON-LD is **BreadcrumbList and nothing else** (G74). No WebPage, no
 *    FAQPage, no Rating: §3.8 permits exactly one type on a policy page, and
 *    the "on this page" list is a nav, not a Q&A.
 *  · Every heading is real and non-empty, h1 → h2 → h3 with no skips (G30/G78).
 *
 * THE VISUAL TREATMENT (v2 prose — where this departs from the cards' v1 skin)
 * ---------------------------------------------------------------------------
 * Card COPY is verbatim; card CHROME is re-cut to the TASTE-RULES bar:
 *
 *  · **Zero eyebrows.** The cards label each section "Clause 4" / "Section 7"
 *    above its H2. §7 is explicit that `overline` is a form-label token and
 *    never a section eyebrow, and §11.20 bans section numbering outright. The
 *    numbering survives where it is actually useful — in the on-this-page nav,
 *    which is what a reader counts against.
 *  · **Ink links, underlined at rest** (§8), never brand green (§2). Green on
 *    these pages is spent entirely on the wordmark dot and the header's one CTA;
 *    a legal page with forty green links spends the whole budget on prose.
 *  · **No plates on content.** §1: fact rows are title + body in open space
 *    with a hairline between them, not cards. `bg.raised` appears only where §6
 *    sanctions it — info strips, the counsel slots, the host-preference group —
 *    which is what keeps four hundred lines of policy reading as sections
 *    rather than as a wall of boxes.
 *  · **One measure.** `container.prose` (720px ≈ 72ch), left-aligned inside the
 *    `container.wide` shell so the H1 starts under the wordmark rather than
 *    three hundred pixels right of it.
 *  · **Type ladder** (§7): H1 at `h3` (28), sections at `h5` (20), body 16/400,
 *    fact-row detail 14. A content page never shouts; `display` is funnel-only.
 *  · **`.num` on every figure**, by construction — see `lib/content/legal/types`.
 *
 * WHERE THE CLASSES LIVE. Not here. Every measure, role and rule above is
 * imported from `components/editorial/prose.ts`, which is the ONE grammar the
 * whole legal family reads — this template plus GW-017 and GW-018, which cannot
 * use this template but must not look like a different site. This file keeps
 * the component logic (the run/block/section renderers and the semantic
 * contract); it keeps no copy of the style strings, because the copy it used to
 * keep was byte-identical and held in sync by a comment. See that file's header
 * for the reasoning.
 *
 * MOTION: none, deliberately. The only moving parts are the shared press/hover
 * feedback on links and buttons. Anchor jumps are not animated: a reader who
 * clicks "5. Paying, and how your money is held" wants to be there, and smooth
 * scrolling a 4000px document turns one click into a second of travel.
 */

/* ── inline runs ─────────────────────────────────────────────────────────── */

function RunNode({ run }: { readonly run: Run }) {
  if (typeof run === "string") return <>{run}</>;

  if ("bold" in run)
    return (
      <strong className="font-semibold text-primary">
        <Runs runs={run.bold} />
      </strong>
    );

  if ("num" in run) return <span className="num">{run.num}</span>;

  // `amanah`, `wakala` — set apart as terms, not emphasised as claims.
  if ("term" in run) return <em className="font-semibold italic text-primary">{run.term}</em>;

  /* No `${focusRing}` appended here or on the on-this-page anchors: these two
     inline links used to fall back to the browser's default outline while every
     sibling control on the page drew the DESIGN.md §8 2px `focusRing` ring —
     two focus languages on one tab route. `inlineAction` now composes the ring
     itself (`ui.ts`), which is the right place for it: the rule is a property
     of every inline text action, not of the two that happen to sit on a legal
     page. */
  return (
    <Link href={run.href} className={inlineAction}>
      <Runs runs={run.label} />
    </Link>
  );
}

function Runs({ runs }: { readonly runs: Rich }) {
  return (
    <>
      {runs.map((run, i) => (
        <RunNode key={i} run={run} />
      ))}
    </>
  );
}

/* ── shared block furniture ──────────────────────────────────────────────── */

/**
 * A fact row. §1's "icon + title + body in open space" with the icon dropped:
 * on a prose page these lists run four and six items deep, and forty decorative
 * glyphs down a legal document is texture, not information. The hairline does
 * the separating; the row keeps the card's title and body verbatim.
 *
 * 16/500 title over 14 detail — the one place the 14 rung survives on these
 * pages (see `detailText`).
 */
function FactRow({ item, single }: { readonly item: Entry; readonly single: boolean }) {
  return (
    <li className={single ? factRow : factRowTwoCol}>
      <p className={factTitle}>
        <Runs runs={item.title} />
      </p>
      <p className={`mt-1 ${detailText}`}>
        <Runs runs={item.body} />
      </p>
    </li>
  );
}

function LedgerLine({ row, total }: { readonly row: LedgerRow; readonly total?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 py-3 ${
        total ? "border-t border-border-default" : "border-t border-hairline"
      }`}
    >
      <span className="min-w-0">
        {/* 16/600 on the total, 16/500 on a line, 14 underneath. Never 14-on-14. */}
        <span
          className={`block text-bodyMd ${
            total ? "font-semibold text-primary" : "font-medium text-primary"
          }`}
        >
          <Runs runs={row.title} />
        </span>
        <span className="mt-0.5 block text-bodySm text-secondary">
          <Runs runs={row.note} />
        </span>
      </span>
      <span
        className={`shrink-0 text-bodyMd ${
          total ? "font-semibold text-primary" : row.muted ? "text-secondary" : "text-primary"
        }`}
      >
        <Runs runs={row.value} />
      </span>
    </div>
  );
}

/* ── blocks ──────────────────────────────────────────────────────────────── */

function BlockNode({ block }: { readonly block: Block }) {
  switch (block.kind) {
    case "p":
      return (
        <p className={`mt-4 ${bodyText}`}>
          <Runs runs={block.text} />
        </p>
      );

    case "note":
      return (
        <p className="mt-4 text-bodyMd text-secondary">
          <Runs runs={block.text} />
        </p>
      );

    case "h3":
      return <h3 className={subH3}>{block.text}</h3>;

    case "facts":
      return (
        <ul className={block.single ? factGridSingle : factGrid}>
          {block.items.map((item, i) => (
            <FactRow key={i} item={item} single={block.single === true} />
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mt-6 grid gap-x-10 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="border-t border-hairline py-4 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
            >
              <p className={factTitle}>
                <span className="num mr-2 text-secondary">{i + 1}</span>
                <Runs runs={item.title} />
              </p>
              <p className={`mt-1 ${detailText}`}>
                <Runs runs={item.body} />
              </p>
            </li>
          ))}
        </ol>
      );

    case "callout":
      return (
        <aside className={strip}>
          <p className={blockTitle}>
            <Runs runs={block.title} />
          </p>
          <p className={`mt-1.5 ${bodyText}`}>
            <Runs runs={block.body} />
          </p>
        </aside>
      );

    /**
     * The honesty boundary, made visible. A clause SalamStay has not settled is
     * shown as an empty, labelled row — never as plausible legal text. The label
     * is sentence case, not the card's uppercase micro-caps: §7 keeps `overline`
     * for form labels, and a page with four uppercase strips reads as the
     * eyebrow tic §11.20 bans.
     */
    case "slot":
      return (
        <div className={strip}>
          <p className="border-b border-hairline pb-3 text-bodySm font-semibold text-secondary">
            {block.label}
          </p>
          <p className={`mt-3 ${blockTitle}`}>
            <Runs runs={block.title} />
          </p>
          <p className={`mt-1.5 ${bodyText}`}>
            <Runs runs={block.body} />
          </p>
          {/* Legend below: `label` (13), not `caption` (12). §7's ladder bottoms out
              at 13, and this legend is read-this-line copy — it defines the shape of
              the inventory the slot promises. Missed by the 2026-07-25 sweep. */}
          {block.columns ? (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-hairline pt-3 text-label text-secondary">
              {block.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          ) : null}
        </div>
      );

    /**
     * A real table, in a scroller of its own — the one place on these pages
     * where content is allowed to be wider than the column. The page body never
     * scrolls sideways; this container does.
     *
     * The caption sits OUTSIDE the scroller as a paragraph tied to the table by
     * `aria-describedby`, rather than inside it as `<caption>`. A `<caption>` is
     * laid out at the table's width, so on a phone the sentence explaining the
     * table would itself need horizontal scrolling to read. Outside, it wraps in
     * the reading column and is still announced when the table is entered.
     */
    case "table":
      return (
        <div className="mt-6">
          <p id={block.captionId} className={tableCaption}>
            {block.caption}
          </p>
          <div className="overflow-x-auto">
            <table aria-describedby={block.captionId} className={`${tableEl} min-w-[34rem]`}>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className={tableHeadCell}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className={tableRow}>
                    <th scope="row" className={tableRowHead}>
                      <Runs runs={row.header} />
                    </th>
                    {row.cells.map((cell, j) => (
                      <td key={j} className={tableCell}>
                        <Runs runs={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    /**
     * Consent state, disclosed — NOT a control. The cards draw switches here;
     * rendering a switch that cannot switch anything would be the one thing
     * these pages exist to avoid. The state ships as a label: ink fill for
     * locked-on (TASTE §3: selection is ink, never green), outline for off.
     */
    case "states":
      return (
        <ul className="mt-6">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 border-t border-hairline py-4 first:border-t-0 first:pt-0"
            >
              <span className="min-w-0 flex-1">
                <span className={`block ${factTitle}`}>
                  <Runs runs={item.title} />
                </span>
                <span className={`mt-1 block ${detailText}`}>
                  <Runs runs={item.body} />
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-caption font-medium ${
                  item.locked
                    ? "bg-selected text-selected-fg"
                    : "border border-border-default text-secondary"
                }`}
              >
                {item.state}
              </span>
            </li>
          ))}
        </ul>
      );

    case "ledger":
      return (
        <div className="mt-6">
          <p className={factTitle}>
            <Runs runs={block.title} />
          </p>
          <p className="mt-1 text-bodySm text-secondary">
            <Runs runs={block.meta} />
          </p>
          <div className="mt-4">
            {block.rows.map((row, i) => (
              <LedgerLine key={i} row={row} />
            ))}
            <LedgerLine row={block.total} total />
          </div>
        </div>
      );

    /**
     * GW-013's structural ruling, rendered: the host's own requests for their
     * own home sit in their own container, under their own heading, so they can
     * never be read as SalamStay conduct rules. Collapsing the two would make
     * SalamStay the arbiter of religious practice, which is exactly what the
     * card forbids.
     */
    case "hostGroup":
      return (
        <div className="mt-6 rounded-md bg-raised p-5 md:p-6">
          <h3 className={blockTitle}>{block.heading}</h3>
          <p className={`mt-1.5 ${bodyText}`}>
            <Runs runs={block.note} />
          </p>
          <ul className="mt-4">
            {block.items.map((item, i) => (
              <li key={i} className="border-t border-hairline py-3 first:border-t-0 first:pt-0">
                <p className="text-bodySm font-medium text-primary">
                  <Runs runs={item.title} />
                </p>
                <p className="mt-0.5 text-bodySm text-secondary">{item.quote}</p>
              </li>
            ))}
          </ul>
        </div>
      );

    case "boundary":
      return (
        <blockquote className={strip}>
          <p className="text-bodyMd text-primary">
            <Runs runs={block.text} />
          </p>
          {/* Attribution is meta, not body: it stays on the 14 rung. */}
          <p className={`mt-2 ${detailText}`}>
            <Runs runs={block.source} />
          </p>
        </blockquote>
      );

    /**
     * The control sits BELOW the strip, not inside it. The §5 secondary button
     * is a `bg.raised` plate, and a raised plate on a raised plate is not a
     * button — it is the same gray twice, which is exactly how it rendered on
     * the first pass. The strip states the record; the canvas underneath is
     * where the action can still read as one.
     *
     * THE STRIP'S MIDDLE LINE IS THE ONLY PER-READER SENTENCE ON THESE PAGES.
     * It is a client island (`ConsentStateLine`) because the value it reports
     * lives in the reader's browser and this template is a Server Component:
     * rendered here, the record could only ever be a guess, and it was — a
     * fixed "Essential only" served to everyone including everyone who had
     * pressed Accept all. The content file keeps the two lines that are true
     * for every reader (the title, and what the button underneath does); the
     * island keeps the one that is not.
     */
    case "consentRecord":
      return (
        <div className="mt-6">
          <div className="rounded-md bg-raised p-5">
            <p className={blockTitle}>
              <Runs runs={block.title} />
            </p>
            <ConsentStateLine />
            <p className={`mt-1.5 ${bodyText}`}>
              <Runs runs={block.body} />
            </p>
          </div>
          <div className="mt-4">
            <ConsentResetButton />
          </div>
        </div>
      );
  }
}

/* ── document ────────────────────────────────────────────────────────────── */

function SectionNode({ section, index }: { readonly section: Section; readonly index: number }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className={sectionBlock}>
      <h2 id={`${section.id}-h`} className={sectionH2}>
        {section.heading}
      </h2>
      {section.blocks.map((block, i) => (
        <BlockNode key={`${index}-${i}`} block={block} />
      ))}
    </section>
  );
}

export function LegalPage({ page }: { readonly page: LegalPageContent }) {
  return (
    <>
      {/* BreadcrumbList and nothing else (§3.8 / G74). Same array as the trail. */}
      <JsonLdScript data={[breadcrumbList(page.crumbs)]} />

      {/* Outside <main>: the trail says where this page sits in the site, which
          is chrome rather than the page's own content. */}
      <div className={`${shell} pt-4`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center text-bodySm text-tertiary">
            {page.crumbs.map((crumb, i) => {
              const isCurrent = i === page.crumbs.length - 1;
              return (
                <li
                  key={crumb.path}
                  className='flex items-center after:mx-2 after:text-border-strong after:content-["/"] last:after:content-none'
                >
                  {isCurrent ? (
                    <span aria-current="page" className="font-medium text-primary">
                      {crumb.name}
                    </span>
                  ) : (
                    /* §8: underlined AT REST, in ink. This was hand-rolled to
                       underline on hover — the one link on the page that made
                       the reader move the pointer to find out it was a link,
                       and a second, quieter grammar for something `ui.ts`
                       already defines. It is now the same `inlineAction` every
                       other text action on the site uses; the current crumb
                       keeps its distinction the way it always did, by being
                       unlinked ink at 500. */
                    <Link href={crumb.path} className={inlineAction}>
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <main className="indexable">
        <div className={shell}>
          <div className={documentColumn}>
            <div className={documentHead}>
              <h1 className={pageH1}>{page.h1}</h1>
              <p className={ledeText}>
                <Runs runs={page.lede} />
              </p>

              {/*
                The two date rows. `bg.raised` info strip (§6), payload bolded
                and nothing else (§7). The effective date is a SLOT, not a date:
                no policy effective-date pattern is shipped anywhere in the
                corpus, so the row states what is true — the stamp lands at
                publication — and the absence of the bold payload weight is the
                signal that nothing has been settled yet.
              */}
              <dl className={dateStrip}>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Last updated</dt>
                  <dd className="num text-bodySm font-semibold text-primary">
                    {page.lastUpdated}
                  </dd>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <ClockIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Effective date</dt>
                  <dd className="text-bodySm text-secondary">set at publication</dd>
                </div>
              </dl>

              {/*
                On this page. Not a heading — a labelled nav; adding an h2 here
                would put a heading with no section under it between the H1 and
                the first clause. The numbers are the only place the cards'
                clause numbering survives, because this is the one place a
                reader counts.
              */}
              <nav aria-label="On this page" className="mt-8 border-t border-hairline pt-6">
                {/* 16/600 label over 14 entries: one full step, never 14-on-14. */}
                <p className={blockTitle}>On this page</p>
                <ol className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                  {page.sections.map((section, i) => (
                    <li key={section.id} className="flex items-baseline gap-2.5">
                      <span className="num shrink-0 text-bodySm text-secondary">{i + 1}</span>
                      <a href={`#${section.id}`} className={`text-bodySm ${inlineAction}`}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {page.sections.map((section, i) => (
              <SectionNode key={section.id} section={section} index={i} />
            ))}

            {/*
              Closing contact block. The action is the §5 gray-fill secondary
              button, NOT a green primary: green is budgeted at four roles per
              surface (§2), one of them the surface's single primary CTA, and
              the doctrine is that the header CTA yields to a PAGE-OWNED
              primary. A policy document owns none — nobody arrives at the terms
              to open a support ticket — so the header keeps its green and this
              stays ink.
            */}
            <div className={closingBlock}>
              <p className={blockTitle}>{page.closing.title}</p>
              <p className={`mt-1.5 ${bodyText}`}>
                <Runs runs={page.closing.body} />
              </p>
              <Link href={page.closing.ctaHref} className={`mt-5 ${btnSecondary}`}>
                {page.closing.ctaLabel}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default LegalPage;
