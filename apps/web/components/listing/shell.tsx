import { Fragment } from "react";
import { withNumerals } from "@/components/numerals";
import { inlineAction } from "@/components/ui";
import type { RichText } from "@/lib/content/listings/is-f7-2bed";

/**
 * Listing-page grammar — the type roles, the section rhythm and the one text
 * renderer every block on gw-004 reads from.
 *
 * It used to export two. `Plain` was `Num` from `components/numerals.tsx` with
 * a different key prefix and the same docstring, word for word, over the same
 * `withNumerals` call — a second name for one behaviour, which is how the
 * behaviours diverge. `Num` is the survivor because it is the canonical
 * module's, already read by seven other surfaces; the nineteen call sites in
 * this directory now import it from there. `Copy` stays, because it is
 * genuinely local: payload emphasis (§7/§11.12) on top of the same isolation.
 *
 * The measures and the H2 role are the discovery templates' own
 * (`components/discovery/shell.ts`), imported rather than re-derived so a
 * listing page and the area page above it line up under the same header. What
 * is genuinely local is below: a listing is the one content page on the site
 * with a two-column body, so it needs a section rule the single-column
 * templates do not.
 *
 * Type ladder on this page (TASTE-RULES §7 — H1 ≈ 26 · sections ≈ 22 · card
 * titles 16): `h3` role (28) for the H1, `h5` (20) for section headings, 16/600
 * for sub-headings, 16/400 for the lead, 14/400 gray for body and meta. Nothing
 * on a content page reaches `display`.
 */

/** Sub-heading inside a section (Your host, Home infrastructure). */
export const listingH3 = "text-bodyMd font-semibold text-primary";

/**
 * Section rhythm in the left column: vertical space and nothing else.
 *
 * The hairline BETWEEN sections is the container's, via `divide-y
 * divide-hairline` — which draws a rule above every child except the first, so
 * the column never opens with a line and no section has to know whether it is
 * first. §1 is why there is only a rule: content blocks carry neither border
 * nor shadow, so the sections are separated without any of them being boxed.
 */
export const listingSection = "py-8 md:py-10";

/** The column that owns the rules between those sections. */
export const listingColumn = "divide-y divide-hairline";

/** Answer-first opening paragraph. 16/400, capped at a reading measure. */
export const listingLead = "max-w-[65ch] text-bodyMd leading-relaxed text-secondary";

/** Everything after the lead. */
export const listingPara = "max-w-[65ch] text-bodySm leading-relaxed text-secondary";

/**
 * Inline text action at this page's meta size — §8's underline-at-rest, in ink.
 * Never brand: §2 spends green on four roles and a body link is not one of
 * them, which is why the card's green `.morelink` reads ink here.
 */
export const listingLink = `inline-flex items-center gap-2 text-bodySm font-medium ${inlineAction}`;

/**
 * The nightly rate, as a skeleton (§12).
 *
 * Null data is NEVER a dash on the live site — it is suppressed, or it ships a
 * `backgrounds.skeleton` shimmer. The card corpus draws "from PKR —" as a
 * documented placeholder; a visitor reading a dash has to decide whether it
 * means free, unknown or broken, and the honest answer is "a number belongs
 * here and is not published yet", which is what a skeleton says without asking
 * anyone to parse punctuation as a value.
 *
 * `bg-skeleton` is the role, one class for both themes — `#EEF0F1` light,
 * `#161B1A` dark, which is `backgrounds.skeleton.*.base` and exactly what the
 * hand-named `bg-slate-100 dark:bg-raised` pair resolved to before the preset
 * exposed it.
 *
 * STATIC, deliberately: no pulse. A shimmer means "this is arriving", and
 * nothing is arriving — pricing is not on its way over this request, or over
 * any request this build can make. An animated bar would be a loading state
 * that never resolves, which is a lie told at 2s intervals. The bar's job is
 * to hold the shape of a value that is not published yet, and a still bar does
 * that honestly.
 *
 * `aria-hidden`, because a screen reader gets the home and no price, which is
 * the honest reading; a skeleton announced as "loading" would promise the same
 * number the pulse used to.
 */
export const priceSkeleton = "inline-block h-5 w-24 rounded-sm bg-skeleton align-middle";

/**
 * Sticky offsets. The header is 64px and the anchor bar 56px, both sticky, so
 * anything else that sticks has to clear their sum. `top-16` puts the anchor
 * bar directly under the header; `top-36` (144) puts the booking card one
 * `space-6` under the anchor bar.
 */
export const stickyUnderHeader = "top-16";
export const stickyUnderAnchorBar = "top-36";

/**
 * Scroll offset for the three anchor targets, so a jump does not land the
 * heading behind 120px of sticky chrome.
 */
export const anchorOffset = "scroll-mt-32";

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * One run of copy: payload words at 600 in ink, every digit run isolated.
 *
 * §7 and §11.12 — "bold the payload word only, never a whole sentence". The
 * emphasis list lives in the content object beside the sentence it belongs to,
 * so a copy edit and its emphasis cannot drift apart, and a payload that no
 * longer appears in the text simply renders plain rather than throwing.
 */
export function Copy({ text, bold }: RichText) {
  if (!bold || bold.length === 0) return <>{withNumerals(text, "c")}</>;

  const pattern = new RegExp(`(${bold.map(escapeRe).join("|")})`, "g");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={`b${i}`} className="font-semibold text-primary">
            {withNumerals(part, `b${i}`)}
          </strong>
        ) : (
          <Fragment key={`s${i}`}>{withNumerals(part, `s${i}`)}</Fragment>
        ),
      )}
    </>
  );
}
