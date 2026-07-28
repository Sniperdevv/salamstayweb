import type { ReactNode } from "react";
import Link from "next/link";
import { Phrase } from "@/components/numerals";
import { HelpfulVote } from "@/components/prose/helpful-vote";
import { ClosingNote, ProseSection } from "@/components/prose/prose-blocks";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { column, factRow, headingGap, prose, sectionGap, shell } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import { JsonLdScript, article, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";

/**
 * GW-020's article shape, extracted so the help corpus has ONE of it.
 *
 * `app/help/cantonment-stays/page.tsx` was the first and for a while the only
 * instantiation of the card, and it draws the whole shell inline: JSON-LD,
 * breadcrumb, H1, byline, answer-first paragraph, "In this article", the body,
 * "Was this article helpful?", "Related help", "Still need help?". Every one of
 * those is the CARD, not that article — so the second one to ship would have
 * copied ~120 lines of frame to say something different in the middle. The
 * eight-copy `example-strip` finding is the same shape one wave earlier, and
 * the lesson it recorded is the one applied here: **the frame is the
 * duplication, the words are not.**
 *
 * So the frame lives here and each article passes its own words. The BODY stays
 * `children` rather than becoming a block schema like `lib/content/legal`'s:
 * these are prose pages whose sections are genuinely different shapes (a table
 * here, a step list there, a strip somewhere else), and a `kind:` union wide
 * enough to cover them would be a second layout language to learn on top of the
 * five `prose-blocks` primitives that already draw all of it.
 *
 * WHAT IS FIXED HERE AND MAY NOT BE PASSED IN
 * -------------------------------------------
 *  · `<main class="indexable">` and exactly one `<h1>` (G30).
 *  · The byline: "SalamStay Editorial", the initials disc, the reviewed date.
 *    There is no person behind the byline and the disc carries no face, which
 *    is `/authors/salamstay-editorial`'s own mark.
 *  · The helpfulness block: two plain equal buttons, NO count, NO percentage,
 *    NO score. A helpfulness statistic would be a number we do not have.
 *  · Article + BreadcrumbList JSON-LD, and never FAQPage. §3.10 and G74 are
 *    explicit: a single how-to article is `Article`; wrapping prose in FAQ
 *    markup to farm rich results is the banned move. An article that grows a
 *    genuine multi-Q&A block can add `ProseFaq` + `faqPage()` at its call site
 *    — and would then have to earn its own matrix row in
 *    `scripts/validate-pages.mjs`.
 *
 * DATES. `datePublished` equals `dateModified` and both equal the day the
 * article ships. Back-dating an article to look established is exactly the kind
 * of fact this site does not make up (`help/cantonment-stays` says so first).
 *
 * TASTE: zero eyebrows, zero plates, zero glyphs, zero green. §1 keeps content
 * blocks in open space; §2's green budget is spent on the wordmark dot and the
 * header's one CTA before this page starts. The closing action is the §5
 * gray-fill secondary, via `ClosingNote`.
 */

export interface HelpArticleLink {
  readonly href: string;
  readonly title: string;
  readonly body: string;
}

export interface HelpArticleProps {
  /** Registry path. Used for the canonical, the Article URL and the last crumb. */
  readonly path: string;
  /** The H1, and the `headline` of the Article node. One per page. */
  readonly h1: string;
  /** The meta description, reused as the Article `description`. */
  readonly description: string;
  /**
   * The slug `HelpfulVote` records the reader's answer under, on their own
   * device. Distinct per article, because the answer is per article.
   */
  readonly slug: string;
  readonly crumbs: readonly Crumb[];
  /** §3.10's answer-first block: 40-60 words that actually answer the title. */
  readonly answer: ReactNode;
  /** The section anchors, in document order. */
  readonly contents: readonly { readonly href: string; readonly label: string }[];
  readonly related: readonly HelpArticleLink[];
  /** The closing paragraph(s) above the Contact support button. */
  readonly support: ReactNode;
  /** The `<ProseSection>`s that make up the body. */
  readonly children: ReactNode;
}

/**
 * The review date, shared by every article in this build.
 *
 * One constant rather than a prop: these all publish together, and a per-page
 * date would invite somebody to type a plausible one. When an article is
 * genuinely re-reviewed on its own it takes its own date — at which point this
 * becomes the default and that article overrides it.
 */
export const REVIEWED_ISO = "2026-07-28";
export const REVIEWED = "28 July 2026";

export function HelpArticle({
  path,
  h1,
  description,
  slug,
  crumbs,
  answer,
  contents,
  related,
  support,
  children,
}: HelpArticleProps) {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(crumbs),
          article({
            headline: h1,
            path,
            description,
            datePublished: REVIEWED_ISO,
            dateModified: REVIEWED_ISO,
          }),
        ]}
      />

      <ProseBreadcrumb crumbs={crumbs} />

      <main className="indexable">
        <article>
          <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
            <h1 className="text-h3 font-semibold text-primary">{h1}</h1>

            {/* Byline. Initials disc, no face — there is no person behind it. */}
            <div className="mt-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-raised text-bodySm font-semibold text-primary"
              >
                SE
              </span>
              <p className="text-bodySm text-secondary">
                <Link
                  href="/authors/salamstay-editorial"
                  className={`font-medium ${inlineAction} ${focusRing}`}
                >
                  SalamStay Editorial
                </Link>
                {/* `Phrase` around the WHOLE line, not around the date —
                    GO-LIVE A17. `.num` makes the date its own bidi run, which
                    an RTL paragraph is then free to reorder past "Last
                    reviewed"; the isolate has to cover the sentence for there
                    to be nothing left inside it to reorder. The span keeps its
                    `block` and the `Phrase` nests inside it, because `dir` on a
                    block resolves `text-align: start` and would jump the line
                    to the other edge. */}
                <span className="mt-0.5 block">
                  <Phrase>
                    Last reviewed{" "}
                    <time dateTime={REVIEWED_ISO} className="num">
                      {REVIEWED}
                    </time>{" "}
                    · Available in Urdu
                  </Phrase>
                </span>
              </p>
            </div>

            {/* Answer-first (§3.10 / §7). No "In short" label above it — the
                answer is already the first thing under the title, so the label
                was doing no work and §7 puts the eyebrow count at zero. */}
            <div className={`mt-5 ${prose}`}>{answer}</div>

            {/* A labelled nav, not a heading: an h2 here would put a heading
                with no section under it between the H1 and the first one. */}
            <nav aria-label="In this article" className="mt-8 border-t border-hairline pt-6">
              <p className="text-bodyMd font-semibold text-primary">In this article</p>
              <ol className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                {contents.map((c, i) => (
                  <li key={c.href} className="flex items-baseline gap-2.5">
                    <span className="num shrink-0 text-bodySm text-tertiary">{i + 1}</span>
                    <a href={c.href} className={`text-bodySm ${inlineAction} ${focusRing}`}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          {children}

          {/* Two plain, equal buttons. No counts, no percentage, no score. The
              answer is recorded in `localStorage` on the reader's own device
              and acknowledged in a live region; nothing is posted anywhere,
              because there is nowhere honest to post it to yet. */}
          <div className={`${shell} ${sectionGap}`}>
            <div className={`border-t border-hairline pt-6 ${column}`}>
              <p className="text-bodyMd font-semibold text-primary">Was this article helpful?</p>
              <HelpfulVote slug={slug} />
            </div>
          </div>
        </article>

        <ProseSection id="related" heading="Related help">
          {/* Hairline rows in open space, never a bordered list (§1). */}
          <ul className={`${headingGap} ${column}`}>
            {related.map((r) => (
              <li key={r.href} className={factRow}>
                <p className="text-bodyMd font-medium text-primary">
                  <Link href={r.href} className={`${inlineAction} ${focusRing}`}>
                    {r.title}
                  </Link>
                </p>
                <p className="mt-1.5 text-bodySm text-secondary">{r.body}</p>
              </li>
            ))}
          </ul>
        </ProseSection>

        <ProseSection id="support" heading="Still need help?" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            {support}
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}

export default HelpArticle;
