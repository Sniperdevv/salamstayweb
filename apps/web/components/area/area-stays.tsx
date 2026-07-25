import { StayRail } from "@/components/stays/stay-rail";
import { fromStayCard } from "@/lib/content/featured-stays";
import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm } from "@/components/discovery/shell";

/**
 * Stays in {area} — the rail, and the second thing on the page.
 *
 * v1 drew this as `StayGrid`: six 4:3 reading tiles with attribute pills and a
 * price row, three across, under a section eyebrow, a heading and a two-line
 * intro, as the THIRD block on the page — behind "About F-7". It filled two
 * screens and it arrived after a screen and a half of prose about a sector the
 * reader had already chosen. The rail is the same six homes at browsing scale
 * — near-square photograph, name, sector, price line — six across at this
 * shell's width, arriving directly under the H1.
 *
 * On the block order: SEO-RULES §3.3 lists the required blocks as
 * "intro → local context → listings in-area → practical notes → parent-city
 * link", and this page draws context AFTER the listings. Every required block
 * is still present, still above the FAQ, and every sample verbatim H2 §3.3
 * names is unchanged; what moved is the order of two adjacent blocks, under
 * the founder-ordered redesign whose whole thesis is that inventory leads.
 * §3.2 lists the same pair in the same order for city pages and Phase 3
 * already shipped the inversion there, so this is the precedent applied one
 * level down rather than a new liberty.
 *
 * `priority` marks the first card only: it is the LCP element now that the
 * typographic hero is gone, and a second priority image on the page would only
 * compete with it for the same connection.
 *
 * `newChip` is OFF, on every rail on the site. The chip means one checkable
 * thing — this home has no published two-way review — and pre-launch that is
 * true of EVERY listing, so a row of six identical chips is a texture rather
 * than six facts, and a mark that distinguishes nothing teaches the reader to
 * stop seeing it. It comes back on the first surface that mixes reviewed and
 * unreviewed homes, which is what it was always for.
 *
 * The supply note stays, because the honest statement it carries is about the
 * ABSENCE of ratings and that absence is still on the screen. It now says so in
 * its own words instead of pointing at a chip.
 *
 * The projection through `fromStayCard` carries "F-7, Islamabad" as the card's
 * place line rather than the fixture's `location` ("Entire apartment · 2
 * bedrooms · 6 guests"), so a home rendered here and the same home rendered in
 * the homepage's F-7 rail cannot drift.
 *
 * ── The supply note is an info strip ──────────────────────────────────────
 * TASTE-RULES §6 gives `bg.raised` five jobs, and one of them is exactly this:
 * an info strip at `radius.md` with only the payload bolded. The note was a
 * bare gray caption floating under the rail, which is the shape of a footnote
 * nobody reads; on the tint it reads as a small standing statement about the
 * row above it, which is what it is. §11.14 is the same rule from the other
 * side: contextual micro-strips are `bg.raised`, tiny, factual.
 *
 * The payload is "two-way review", because that is the condition the whole
 * sentence turns on: a rating exists only after one. §7 and §11.12: bold the
 * payload word only, never a whole sentence.
 */

/**
 * The substring the strip emphasises. It lives here rather than in the content
 * file because it is a typographic decision about this strip, not a fact about
 * the sector — and if a future area's note does not contain it, the strip
 * simply renders plain rather than breaking.
 */
const NOTE_PAYLOAD = "two-way review";

function SupplyNote({ text }: { readonly text: string }) {
  const at = text.indexOf(NOTE_PAYLOAD);
  if (at < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <strong className="font-semibold text-primary">{NOTE_PAYLOAD}</strong>
      {text.slice(at + NOTE_PAYLOAD.length)}
    </>
  );
}

export function AreaStays({ area }: { readonly area: AreaContent }) {
  const { stays } = area;
  const place = `${area.name}, ${area.cityName}`;

  return (
    <div className={`${shell} ${rhythm}`}>
      <StayRail
        heading={stays.heading}
        headingId="stays-h"
        stays={stays.items.map((s) => fromStayCard(s, place))}
        viewAll={{ href: stays.viewAll.href, label: stays.viewAll.label }}
        newChip={false}
        priority
      />

      {/* The `.supplynote`, under the rail rather than under a grid: it answers
          the question the row above it raises — where are the ratings — and a
          reader who never scrolls past the rail has still read it.

          13/400 (`label`), not 12: `caption` is the smallest role on the
          ladder and §7 puts micro at 13. At 12 on a tint the strip read as
          fine print, which is the one thing an honesty statement must not
          look like. */}
      <p className="mt-4 max-w-[76ch] rounded-md bg-raised px-4 py-3 text-label font-normal text-secondary">
        <SupplyNote text={stays.note} />
      </p>
    </div>
  );
}

export default AreaStays;
