import { LISTINGS, findListing, type HostListing } from "../../calendar/calendar-data";
import { RESERVATIONS } from "../../reservations/reservations";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO LISTING STORE. THIS FILE WRITES NO HOME OF ITS OWN.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The two listing-scoped surfaces — the edit hub (HA-036) and the lifecycle
 * controls (HA-076) — need to know which homes exist, what they are called,
 * where they are, and how many guests are booked into them. SalamStay has no
 * listings table, so all four answers come from the ONE booking-shaped fixture
 * the product already has, through the derivation `/host/calendar` already
 * publishes.
 *
 * THE JOIN, STATED ONCE
 * ---------------------
 * `../../calendar/calendar-data.ts` derives `LISTINGS` from the `listing` /
 * `city` values in `../../reservations/reservations.ts` — "two homes exist
 * because two homes have stays; there is no second list to fall out of step."
 * `/host/calendar` and `/host/earnings` both read that derivation. This file
 * re-exports it rather than repeating it, so the edit hub is the FOURTH host
 * surface on one account of the homes and not a fourth account of them.
 * Emptying `RESERVATIONS` empties all four in one edit.
 *
 * `HostListing.id` carries a note in `calendar-data.ts` saying the slug is
 * "used as a key and in `aria` text, never in a URL". That was true when it was
 * written and these two routes are the extension of it: `/host/listings/{slug}`
 * is the URL shape the corpus draws (`ha-036`, `ha-076`), and the slug it wants
 * is the one that file already computes. Deriving a second slug here from the
 * same name would be two spellings of one identifier. That comment is left
 * where it is rather than edited from this folder.
 *
 * THE ONE DISAGREEMENT IN THE PRODUCT, NAMED RATHER THAN INHERITED
 * ---------------------------------------------------------------
 * `lib/content/host-listing-draft-fixture.tsx` also carries a **Cantt View
 * Residence** — `hw-007`'s worked case, at `PKR 12,000` a night in
 * "Rawalpindi" — and `/host/listings/cantt-view-residence/published` renders
 * it. The reservations fixture books the same-named home at `PKR 9,500` in
 * "Rawalpindi Cantonment". Two files, one home, two rates.
 *
 * Neither surface built here prints a rate, so neither can take a side, and
 * that is not a dodge: `ha-036`'s load-bearing rule is that the hub renders NO
 * owned value — "a hub that re-printed those values would become a second place
 * they could drift" — and the lifecycle screen follows it for the same reason.
 * The collision is real and belongs in the same sweep that reconciles the draft
 * fixture with the reservations one; it is recorded here so the next author
 * meets it as a known fact rather than as a surprise.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * -----------------------------
 * No view count, no "seen N times", no quality score, no completeness
 * percentage, no search ranking, no published-on date and no last-edited
 * timestamp. Not one of those is recorded anywhere in this product, and a
 * fixture is not a licence to invent a measurement — `reservations.ts` says so
 * in its own header and it is the same rule here.
 */

export type { HostListing };
export { LISTINGS, findListing };

/**
 * How many guests are actually booked into this home.
 *
 * `upcoming` and `current` only. A `request` is a guest who has ASKED and is
 * waiting — `calendar-data.ts` makes exactly this distinction when it decides
 * which nights a stay locks, and the same reasoning applies harder here: a
 * request nobody has accepted must not block a host from removing their own
 * listing. `past` is finished and blocks nothing.
 *
 * This is the only derived NUMBER either surface prints, and it is a count of
 * rows in a fixture rather than a metric about a listing. It is what the
 * unpublish consequences and the delete gate are both about, so it is counted
 * once, here, instead of twice with two filters.
 */
export function confirmedStays(listing: HostListing): number {
  return RESERVATIONS.filter(
    (r) => r.listing === listing.name && (r.status === "upcoming" || r.status === "current"),
  ).length;
}

/**
 * "confirmed stay" rather than `ha-076`'s "upcoming booking".
 *
 * One of the two stays this fixture counts for Gulberg 2 Residence is Ayesha
 * Khan, who is CHECKED IN — calling her stay "upcoming" in a sentence about
 * what unpublishing does to it would be wrong in the one register where the
 * host has to be able to trust the words. "Confirmed" covers both a guest who
 * has arrived and one who has not, which is exactly the set the sentence means.
 */
export function stayCountPhrase(count: number): string {
  return count === 1 ? "confirmed stay" : "confirmed stays";
}

/* ─────────────────────────────── routes ─────────────────────────────────── */

export const editHref = (slug: string): string => `/host/listings/${slug}/edit`;
export const statusHref = (slug: string): string => `/host/listings/${slug}/status`;

/**
 * The `<title>` for each route, from one place.
 *
 * `G41` is a HARD gate: it compares the served `<title>` to the registry byte
 * for byte AND rejects duplicates across the whole run. A dynamic segment is
 * the easiest place in a Next app to ship one title for many pages, so both
 * titles carry the home's name and are unique by construction. Each is also the
 * page's own `<h1>` plus the shell suffix, which is the pattern every other host
 * route follows.
 *
 * Written here rather than read through `pageMetadata` because that helper
 * throws on a path the registry does not carry, and the registry is updated
 * centrally once these folders exist — the same note `/host/calendar`,
 * `/host/listings` and `/host/onboarding` each record.
 */
export const editHeading = (listing: HostListing): string => `Edit ${listing.name}`;
export const statusHeading = (listing: HostListing): string => `Status of ${listing.name}`;

export const editTitle = (listing: HostListing): string =>
  `${editHeading(listing)} — SalamStay hosting`;
export const statusTitle = (listing: HostListing): string =>
  `${statusHeading(listing)} — SalamStay hosting`;
