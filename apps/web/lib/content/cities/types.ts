/**
 * City-landing content model, v2 — the data contract behind the GW-002
 * template, rebuilt inventory-first (Phase 3 of the Airbnb-gap redesign).
 *
 * `/stays-in-islamabad` is the first of six city landings (Wave 1 + Wave 1b).
 * The layout lives once in `components/city/*`; a city ships by adding one
 * object of this shape. Nothing here is optional decoration: every field maps
 * to a block the page draws, so a missing field is a missing block, caught by
 * the compiler rather than by a reviewer reading rendered HTML.
 *
 * What changed in v2, and why (see MIGRATION at the foot of this file for the
 * mechanical list the five remaining city files must follow):
 *
 * - **`hero` is gone.** The shipped page opened with an intro paragraph, a
 *   four-fact strip and a 21:9 city photograph, and the first home appeared
 *   below the fold. A city landing is an inventory page; the photography on it
 *   should be the inventory. The LCP element is now the first card of the
 *   featured rail, which is the same move the homepage made in Phase 2.
 * - **`intro: RichText` became `support: string`.** The old intro set three
 *   SEO-RULES §5 claims in `<strong>` inside a five-line paragraph. Claims are
 *   now stated once each, verbatim, where they are load-bearing (the FAQ), and
 *   the support line is one plain descriptive sentence that says where in the
 *   city you are looking. A claim is never paraphrased and then presented as
 *   the claim.
 * - **Every `eyebrow` is gone.** Six uppercase micro-labels above six headings
 *   is a rhythm, not information, and the redesign direction bans them.
 * - **`CityArea.blurb` became `CityArea.line`.** Areas are wayfinding, not
 *   inventory: a dense six-across row of thumb + name + one line, rather than
 *   six paragraphs. The full sector prose the blurbs carried survives verbatim
 *   in FAQ answer 1, which G49 pins in place.
 * - **`stays.intro` is gone.** The rail heading is the whole label. The line it
 *   carried ("every listing shows its own load-shedding hours and backup
 *   power") survives verbatim in the practical notes and in FAQ answer 3.
 *
 * Rules this file enforces by construction, unchanged from v1:
 * - Copy is DATA, never JSX. The same string feeds the visible FAQ and the
 *   FAQPage JSON-LD, so G49 (schema ≡ visible, verbatim) cannot drift.
 * - Icons are referenced by role id, not by component, so a content file never
 *   imports React and a city cannot invent a glyph outside the corpus set.
 * - Photography is referenced by `ImageId`, so every frame is a manifest entry
 *   with real dimensions, real alt text and a declared authenticity flag (G57).
 * - Every `href` must resolve in `lib/seo/route-registry.ts` (G37). The
 *   registry is the gate; this file is where a bad link gets written, so keep
 *   paths literal and greppable.
 */

import type { ImageId } from "@/lib/content/image-manifest";
import type {
  AttributeIcon,
  FaqEntry,
  RelatedLink,
  StayCardContent,
} from "@/lib/content/stays";

/**
 * The vocabulary this model shares with the area template lives in
 * `lib/content/stays.ts` and is re-exported here so a city content file still
 * has one import. `RichText` / `Emphasis` are no longer among them: no city
 * field carries emphasised runs since the intro paragraph went away.
 */
export type { AttributeIcon, RelatedLink } from "@/lib/content/stays";

/**
 * "Things to know" column glyphs. No `price`: the nightly-price column is
 * suppressed until live pricing ships, because §12 does not allow "PKR —" to
 * stand in for a number on the live site.
 */
export type FactIcon = "season" | "transit" | "areas";

/** Practical-notes glyphs. */
export type NoteIcon = "power" | "transit" | "weather";

export interface CityFact {
  readonly icon: FactIcon;
  /** Column title, 14/600 ink, e.g. "Best season". Sentence case, never caps:
   *  `overline` is a FORM-LABEL token and never a section micro-label (§7). */
  readonly label: string;
  /** The fact itself. */
  readonly value: string;
  /** The qualifier that trails it, e.g. "· cool, clear". Both render as one
   *  gray body line under the title. */
  readonly muted: string;
}

export interface CityArea {
  /** Sector or neighbourhood name — the `<h3>`, and the tile's visible label. */
  readonly name: string;
  /**
   * One line of where-in-it, in the register of the homepage city tiles
   * ("F-7 Markaz and Jinnah Super"). The tile clamps to two lines, so a longer
   * string stays in the DOM and in the accessibility tree but does not stretch
   * the row. Keep it under about 30 characters if you want one line at the
   * six-across breakpoint.
   */
  readonly line: string;
  /** Area page. Omitted on the wayfinding tile, which is not a place. */
  readonly href?: string;
  /**
   * Accessible name for the tile link, e.g. "View stays in F-6". The visible
   * label is the bare sector name, which is thin as link text on its own; this
   * gives the anchor its purpose without printing a second line under it.
   * Required whenever `href` is set. Omitted on the wayfinding tile.
   */
  readonly linkLabel?: string;
  /** Omitted on the wayfinding note, which renders its glyph instead. */
  readonly image?: ImageId;
  /**
   * Marks the ONE entry per city that is not a place you can book — the
   * landmark list a visitor navigates by.
   *
   * It is declared rather than inferred. "No `href` and no `image`" identifies
   * it on Islamabad, where the five sectors have both, and identifies nothing
   * on the other five cities, where no area page or verified sector photograph
   * exists yet and every entry looks the same. The template needs to know which
   * row is the note on ALL six — it draws it full width, under the others, with
   * the landmark glyph — so the content says which one it is.
   *
   * Exactly one per city. `href` and `image` are always absent when this is set.
   */
  readonly wayfinding?: true;
}

/** A featured-stay tile. Same object the area template lists (`StayCardContent`). */
export type CityStay = StayCardContent;

export interface CityNote {
  readonly icon: NoteIcon;
  readonly heading: string;
  /**
   * The full note. The card clamps it to two lines and a disclosure opens the
   * rest in place, so the whole string is always in the served HTML and in the
   * accessibility tree — a city may write the note it needs without having to
   * guess a card height.
   */
  readonly body: string;
}

export interface CityFilter {
  readonly icon: AttributeIcon;
  readonly label: string;
  readonly href: string;
}

/** Question and answer, rendered visibly AND as FAQPage from this one source. */
export type CityFaq = FaqEntry;

export interface RelatedColumn {
  readonly heading: string;
  readonly links: readonly RelatedLink[];
  /** Optional footnote explaining an incomplete column. */
  readonly note?: string;
}

export interface CityContent {
  /** URL slug fragment, e.g. "islamabad". */
  readonly slug: string;
  /** Full route, e.g. "/stays-in-islamabad". Must be a registry `page`. */
  readonly path: string;
  /** Display name used in prose, e.g. "Islamabad". */
  readonly name: string;
  /** ~160 chars, from the card header comment. Feeds `pageMetadata`. */
  readonly metaDescription: string;

  /** The one `<h1>`. */
  readonly h1: string;
  /**
   * ONE line under the H1, at most twenty words. Plain neutral description —
   * where in the city you are looking, in checkable local terms. It may refer
   * to a §5 claim in ordinary words, but it may NOT paraphrase a claim and
   * present the paraphrase as the claim; claims appear only in their registry
   * wording, and on this template that means the FAQ.
   */
  readonly support: string;
  /**
   * The "things to know" columns under the support line — three of them, drawn
   * in open space with no box (§1). There is no price column and there will not
   * be one until live pricing ships.
   */
  readonly facts: readonly CityFact[];

  readonly stays: {
    readonly heading: string;
    readonly items: readonly CityStay[];
    /** The rail's trailing link, e.g. search filtered to this city. */
    readonly viewAll: RelatedLink;
  };

  readonly areas: {
    readonly heading: string;
    /** Two or three lines of how the city is laid out. The one prose run
     *  outside the FAQ, and the reason a reader can orient before scanning. */
    readonly intro: string;
    readonly items: readonly CityArea[];
  };

  readonly notes: {
    readonly heading: string;
    readonly items: readonly CityNote[];
  };

  readonly filters: {
    readonly heading: string;
    readonly items: readonly CityFilter[];
  };

  readonly faq: {
    readonly heading: string;
    readonly items: readonly CityFaq[];
  };

  readonly related: {
    readonly heading: string;
    readonly columns: readonly RelatedColumn[];
  };
}

/* ── MIGRATION: v1 → v2 ───────────────────────────────────────────────────
   For each of the five city files still to be written (Karachi, Lahore,
   Peshawar, Faisalabad, Rawalpindi), or for any v1 draft already in hand:

   1. DELETE `hero`. No city photograph is rendered. If a manifest frame was
      reserved for it, leave the manifest alone — an unused entry is legal.
   2. REPLACE `intro: RichText` with `support: string`. Twenty words maximum,
      one line, no `{ strong }` runs, no §5 claim wording. Say where in the
      city the inventory is.
   3. DELETE `areas.eyebrow`, `stays.eyebrow`, `notes.eyebrow`, `faq.eyebrow`,
      `related.eyebrow`. The template no longer reads them.
   4. DELETE `stays.intro`. Keep `stays.heading`, `stays.items` (exactly six,
      in rail order — the first is the LCP image) and `stays.viewAll`.
   5. RENAME `CityArea.blurb` → `CityArea.line` and SHORTEN it to the
      where-in-it register. Any sector detail you cut must already appear
      verbatim somewhere that stays visible, and in practice that is FAQ
      answer 1 ("Which areas are best to stay in …?"). Keep `href` and
      `linkLabel` exactly as they were: `linkLabel` is now the anchor's
      accessible name rather than a visible row link.
   6. `notes`, `filters`, `faq.items` and `related.columns` are UNCHANGED.
      Note bodies may stay as long as they need to be.
   7. Six areas is the row the grid is tuned for (five places plus one
      wayfinding tile with no `href` and no `image`). Five or seven still lay
      out; four leaves a visible hole at the six-across breakpoint. */
