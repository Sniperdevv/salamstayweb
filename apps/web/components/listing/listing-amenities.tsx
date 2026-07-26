import type { ReactElement } from "react";
import Link from "next/link";
import { Num } from "@/components/numerals";
import { ArrowRightIcon } from "@/components/icons";
import { FamilyIcon, NoAlcoholIcon, ShieldCheckIcon } from "@/components/home-icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { AmenityId, ListingContent, TableRow } from "@/lib/content/listings/is-f7-2bed";
import { AirConditioningIcon, CheckIcon, LockIcon, WifiIcon } from "./icons";
import { Copy, anchorOffset, listingH3, listingLink, listingPara, listingSection } from "./shell";

/**
 * Amenities & house rules, with the home-infrastructure table under it. The web
 * twins of the shipped app screens ga-029 and ga-031.
 *
 * **What used to sit between them is gone.** This component drew a third block
 * here: a Qibla bearing, a prayer paragraph and a list of masjid distances (the
 * web twin of ga-030). REPOSITIONING.md retires all of it, so the block is
 * deleted rather than emptied — no heading with nothing under it, no `prayer &&`
 * guard waiting for data that will not come back. The amenity grid now runs
 * straight into "Home infrastructure", which shortens the page by a screen and
 * puts the practical table, the product's lead differentiator, higher up it.
 * ga-030 has no web twin any more, and G78's parity claim is one screen
 * narrower than it was.
 *
 * **A house rule at exactly Wi-Fi weight.** The direction's thesis survives the
 * repositioning intact, with a smaller set to apply it to: "No-alcohol home"
 * and "Family-friendly" are set in the same type, at the same size, on the same
 * row rhythm, with the same glyph weight as "Air conditioning" and "Wi-Fi
 * (fibre)". No section of their own, no decoration, no green. They are facts
 * about a home, stated plainly.
 *
 * **No icon plates.** The card draws each glyph in a bordered `bg.raised` tile.
 * §1: content blocks carry neither border nor shadow, and eight tiles in a grid
 * is eight small boxes doing nothing a bare glyph does not. §6 also caps
 * `bg.raised` at five jobs, and "icon chip" is not one of them.
 *
 * **The five labels are the schema.** `LodgingBusiness.amenityFeature` is
 * built from this same array (G44 requires the names to match the visible
 * attributes EXACTLY), so a copy edit here moves the structured data with it
 * and the two cannot drift. Three labels leaving the grid took three
 * `amenityFeature` entries with them, which is the contract working rather
 * than the contract breaking.
 *
 * **Both tables are real tables.** A `<caption>`, `<th scope="col">` where
 * there are column heads and `<th scope="row">` on every row, because this
 * genuinely is tabular data and a grid of divs would strip the row/column
 * relationships a screen reader needs. What the card's tables do NOT get is the
 * outer plate: no border box, no radius, no tinted header cells. Hairline row
 * rules and nothing else, which is §1's restraint applied to a table, and
 * §11.9's inset-dividers instinct applied to the one place where a full-width
 * rule is correct — the rule IS the row boundary here, not decoration inside a
 * padded container.
 *
 * The affirmation glyph is ink, not the card's green tick: §2 keeps green off
 * everything but the wordmark dot, the search circle, one CTA and verification
 * marks, and "the generator exists" is a fact, not a verification.
 */

type IconComponent = (props: { readonly className?: string }) => ReactElement;

/**
 * Attribute id → glyph. The two house-rule marks come from the shipped
 * `home-icons` set so a "Family-friendly" here is byte-identical to a
 * "Family-friendly" on the city rail; the three the corpus had not drawn for
 * the web live in this directory's own icon file.
 */
const AMENITY_ICONS: Record<AmenityId, IconComponent> = {
  "no-alcohol": NoAlcoholIcon,
  family: FamilyIcon,
  wifi: WifiIcon,
  "air-conditioning": AirConditioningIcon,
  "self-check-in": LockIcon,
};

function DataRow({ row }: { readonly row: TableRow }) {
  return (
    <tr className="border-t border-hairline align-top">
      <th
        scope="row"
        className="w-[34%] py-3 pr-4 text-left text-bodySm font-semibold text-primary"
      >
        <Num>{row.header}</Num>
      </th>
      <td className="py-3 text-bodySm text-secondary">
        <span className={row.affirmed ? "flex items-center gap-1.5 font-medium text-primary" : ""}>
          {row.affirmed ? <CheckIcon className="size-4 shrink-0 text-secondary" /> : null}
          <Copy {...row.value} />
        </span>
        {/* 13/400 (`label`), not 12 — §7's ladder bottoms out at 13. The note
            is the qualifier on the value above it ("UPS keeps fans, lights and
            Wi-Fi through routine cuts; the diesel generator covers longer
            outages…"), which is the half of the cell that says what the value
            means for a night in the house. Not fine print. */}
        {row.note ? (
          <span className="mt-1 block text-label text-secondary">
            <Num>{row.note}</Num>
          </span>
        ) : null}
      </td>
    </tr>
  );
}

export function ListingAmenities({ listing }: { readonly listing: ListingContent }) {
  const { amenities, infrastructure } = listing;

  return (
    <section id="amenities" aria-labelledby="amenities-h" className={`${listingSection} ${anchorOffset}`}>
      <h2 id="amenities-h" className={sectionH2}>
        {amenities.heading}
      </h2>
      <p className={`mt-2 ${listingPara}`}>
        <Num>{amenities.sub}</Num>
      </p>

      <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {amenities.items.map((item) => {
          const Icon = AMENITY_ICONS[item.id];
          return (
            <li key={item.id} className="flex gap-3.5">
              <Icon className="mt-0.5 size-6 shrink-0 text-secondary" />
              <span className="min-w-0">
                <span className="block text-bodyMd font-medium text-primary">{item.label}</span>
                <span className="mt-0.5 block text-bodySm text-secondary">
                  <Num>{item.detail}</Num>
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <Link href={amenities.allHref} className={`mt-6 ${listingLink} ${focusRing}`}>
        {amenities.allLabel}
        <ArrowRightIcon className="size-4" />
      </Link>

      {/* ── Home infrastructure (web twin of ga-031) ─────────────────────── */}
      <h3 className={`mt-10 ${listingH3}`}>{infrastructure.heading}</h3>

      <table className="mt-3 w-full max-w-[68ch] border-collapse text-left">
        <caption className="pb-3 text-left text-bodySm text-secondary">
          <Num>{infrastructure.caption}</Num>
        </caption>
        <tbody>
          {infrastructure.rows.map((row) => (
            <DataRow key={row.header} row={row} />
          ))}
        </tbody>
      </table>

      {/* 13/400 (`label`), not 12. This is the line that dates the table above
          it — "Last verified by the host on 18 July 2026" — and how old a fact
          is is part of the fact (§12). A freshness statement set smaller than
          everything it qualifies is a disclaimer, which is the one thing it
          must not read as. */}
      <p className="mt-4 flex max-w-[65ch] items-start gap-2 text-label text-secondary">
        <ShieldCheckIcon className="mt-px size-4 shrink-0 text-secondary" />
        <span>
          <Num>{infrastructure.verified}</Num>
        </span>
      </p>
    </section>
  );
}

export default ListingAmenities;
