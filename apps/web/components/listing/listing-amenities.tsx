import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import {
  FamilyIcon,
  HalalKitchenIcon,
  NoAlcoholIcon,
  QiblaIcon,
  ShieldCheckIcon,
} from "@/components/home-icons";
import { MasjidIcon } from "@/components/stays/icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { AmenityId, ListingContent, TableRow } from "@/lib/content/listings/is-f7-2bed";
import {
  AirConditioningIcon,
  CheckIcon,
  CompassIcon,
  LockIcon,
  PrayerMatIcon,
  WifiIcon,
} from "./icons";
import {
  Copy,
  Plain,
  anchorOffset,
  listingH3,
  listingLink,
  listingPara,
  listingSection,
} from "./shell";

/**
 * Amenities & cultural attributes, with the prayer/Qibla and home-infrastructure
 * blocks under it. The web twins of the shipped app screens ga-029, ga-030 and
 * ga-031 — G78 structural parity binds all three.
 *
 * **Cultural facts at exactly Wi-Fi weight.** This is the direction's whole
 * thesis in one grid: "No-alcohol home" and "Qibla marked" are set in the same
 * type, at the same size, on the same row rhythm, with the same glyph weight as
 * "Air conditioning" and "Wi-Fi (fibre)". No section of their own, no crescent
 * decoration, no green. They are attributes of a home, stated plainly, and
 * anything that singled them out would be the "Islamic look" the direction
 * explicitly is not.
 *
 * **No icon plates.** The card draws each glyph in a bordered `bg.raised` tile.
 * §1: content blocks carry neither border nor shadow, and eight tiles in a grid
 * is eight small boxes doing nothing a bare glyph does not. §6 also caps
 * `bg.raised` at five jobs, and "icon chip" is not one of them.
 *
 * **The eight labels are the schema.** `LodgingBusiness.amenityFeature` is
 * built from this same array (G44 requires the names to match the visible
 * attributes EXACTLY), so a copy edit here moves the structured data with it
 * and the two cannot drift.
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
 * Attribute id → glyph. Cultural marks come from the shipped `home-icons` set
 * so a "Halal kitchen" here is byte-identical to a "Halal kitchen" on the city
 * rail; only the three the corpus had not drawn for the web live in this
 * directory's own icon file.
 */
const AMENITY_ICONS: Record<AmenityId, IconComponent> = {
  "no-alcohol": NoAlcoholIcon,
  "halal-kitchen": HalalKitchenIcon,
  "prayer-mat": PrayerMatIcon,
  qibla: QiblaIcon,
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
        <Plain>{row.header}</Plain>
      </th>
      <td className="py-3 text-bodySm text-secondary">
        <span className={row.affirmed ? "flex items-center gap-1.5 font-medium text-primary" : ""}>
          {row.affirmed ? <CheckIcon className="size-4 shrink-0 text-secondary" /> : null}
          <Copy {...row.value} />
        </span>
        {row.note ? (
          <span className="mt-1 block text-caption text-secondary">
            <Plain>{row.note}</Plain>
          </span>
        ) : null}
      </td>
    </tr>
  );
}

export function ListingAmenities({ listing }: { readonly listing: ListingContent }) {
  const { amenities, prayer, infrastructure } = listing;

  return (
    <section id="amenities" aria-labelledby="amenities-h" className={`${listingSection} ${anchorOffset}`}>
      <h2 id="amenities-h" className={sectionH2}>
        {amenities.heading}
      </h2>
      <p className={`mt-2 ${listingPara}`}>
        <Plain>{amenities.sub}</Plain>
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
                  <Plain>{item.detail}</Plain>
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

      {/* ── Prayer, Qibla, masjid distances (web twin of ga-030) ─────────── */}
      <h3 className={`mt-10 ${listingH3}`}>{prayer.heading}</h3>

      <div className="mt-3 flex max-w-[65ch] gap-3.5">
        <CompassIcon className="mt-0.5 size-6 shrink-0 text-secondary" />
        <div className="min-w-0">
          <p className="text-bodyMd font-medium text-primary">
            <Plain>{prayer.bearing}</Plain>
          </p>
          <p className="mt-1.5 text-bodySm leading-relaxed text-secondary">
            <Copy {...prayer.body} />
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {prayer.masjids.map((m) => (
          <li key={m.name} className="flex gap-3.5">
            <MasjidIcon className="mt-0.5 size-5 shrink-0 text-tertiary" />
            <span className="min-w-0">
              <span className="block text-bodySm font-medium text-primary">
                <Plain>{m.name}</Plain>
              </span>
              <span className="mt-0.5 block text-bodySm text-secondary">
                <Plain>{m.distance}</Plain>
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className={`mt-5 ${listingPara}`}>
        <Plain>{prayer.para}</Plain>
      </p>
      <Link href={prayer.link.href} className={`mt-4 ${listingLink} ${focusRing}`}>
        {prayer.link.label}
        <ArrowRightIcon className="size-4" />
      </Link>

      {/* ── Home infrastructure (web twin of ga-031) ─────────────────────── */}
      <h3 className={`mt-10 ${listingH3}`}>{infrastructure.heading}</h3>

      <table className="mt-3 w-full max-w-[68ch] border-collapse text-left">
        <caption className="pb-3 text-left text-bodySm text-secondary">
          <Plain>{infrastructure.caption}</Plain>
        </caption>
        <tbody>
          {infrastructure.rows.map((row) => (
            <DataRow key={row.header} row={row} />
          ))}
        </tbody>
      </table>

      <p className="mt-4 flex max-w-[65ch] items-start gap-2 text-caption text-secondary">
        <ShieldCheckIcon className="mt-px size-4 shrink-0 text-secondary" />
        <span>
          <Plain>{infrastructure.verified}</Plain>
        </span>
      </p>
    </section>
  );
}

export default ListingAmenities;
