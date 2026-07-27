import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Num } from "@/components/numerals";
import { StayCardCompact } from "@/components/stays/stay-card-compact";
import { pageMetadata } from "@/lib/seo/metadata";

import { TripBackLink, TripPageHead, TripSection } from "../../trips/[id]/trip-chrome";
import { EXAMPLE_WISHLIST, isExampleWishlistSlug, wishlistPath } from "../example-wishlist";
import { ExampleWishlistStrip } from "../wishlist-chrome";

/**
 * GA-102 — `/wishlists/{slug}`, one saved list, at web width.
 *
 * `GUEST-SHELL.md` §4b's detail frame, in ONE column: `.backrow` → `.pagehead` →
 * labelled `<section>`. **No summary rail** (§4b), **no card around the
 * content** (TASTE §1: a content block carries neither border nor shadow, and
 * "that restraint is most of the premium read").
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE SLUG GUARD — AND THE ROUTING SHADOW THAT ISN'T ONE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §12 lifts `GO-LIVE` A11 into a hard rule: *"A surface keyed to a record that
 * does not exist **refuses to render** — 404, or a redirect to its index. It
 * never renders a fixture."* `isExampleWishlistSlug()` is that refusal, asked on
 * the SERVER in both `generateMetadata` and the route body, so an unknown slug
 * never emits a byte of wishlist document — no flash, nothing for a client guard
 * to undo. The reader lands on `app/not-found.tsx`.
 *
 * **THERE IS NO `RegistryStub` BRANCH HERE, AND THAT IS A CHECKED FACT RATHER
 * THAN AN OVERSIGHT.** `app/trips/[id]/page.tsx` carries one because it genuinely
 * shadows `/trips/requests` — a registered stub `app/book/{slug}/status` links —
 * and taking it away from `app/[...registered]/page.tsx`, the least specific
 * route in the tree, would have turned a live 200 into a 404 with no gate
 * reporting it (`validate-pages --all` fetches only `page` routes). The same
 * hazard was checked for this route on 2026-07-27: `lib/seo/route-registry.ts`
 * holds **exactly one** `/wishlists*` key, `/wishlists` itself, which is one
 * segment and is served by `../page.tsx`. This dynamic segment therefore takes
 * nothing from the catch-all, and a stub branch here would be a branch for an
 * empty set — code teaching the next reader that stubs live under `/wishlists`
 * when none do.
 *
 * **The day a single-segment `/wishlists/*` stub is registered** — `ga-103`'s
 * create screen at `/wishlists/new` is the obvious candidate; its edit screen at
 * `/wishlists/{slug}/edit` is three segments and safely below this route — this
 * file starts eating it silently. At that moment: add the stub branch (the
 * `entry?.status === "stub"` pair from `app/trips/[id]/page.tsx`) AND move the
 * `<main>` out of `app/wishlists/layout.tsx`, because `RegistryStub` brings its
 * own landmark. Those two edits are one edit.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ga-102` DRAWS THAT THIS DOES NOT SHIP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §0.2 is load-bearing: the card predates `REPOSITIONING.md`, the `ga-*` sweep
 * has not run, and this card is one of the staler ones in the corpus.
 *
 *  · **Star ratings and review counts.** `4.92 (214)` and `4.74 (58)`, in amber.
 *    §14's first row, by name: *"star ratings and review counts. There are zero
 *    real reviews."* And TASTE §11.4 would make them ink even if they existed.
 *  · **Nightly prices.** `PKR 14,200 / night` on every card. No nightly price is
 *    published for any of these homes; the compact card ships the
 *    `backgrounds.skeleton` bar instead, which is §12's and TASTE §12's rule —
 *    *"null money is never a dash on a live surface — skeleton or nothing"*.
 *  · **The `SalamStar host` tag** burnt onto a photograph. An invented badge
 *    (§14) and a TASTE §9 violation twice over — no text ever sits directly on a
 *    photograph, and there is no such programme.
 *  · **The host-gender line the card puts under two of its three names, and its
 *    matching badge.** `REPOSITIONING.md` retires the pair outright — *"we do
 *    not have such policy"*, and SalamStay has no host-gender field — and
 *    SEO-RULES §5 slot 5 is struck, which makes the card's wording a banned
 *    string in any construction. It is not re-typed here, per §13.
 *    (`Women-only` survives in the shipped `ATTRIBUTES` lexicon as a house rule
 *    a host may set; none of the five homes here carries it, so it does not
 *    appear, and this page does not go looking for it.)
 *  · **`Halal kitchen` and `Qibla` badges.** `REPOSITIONING.md`'s removal list,
 *    first line.
 *  · **The muted static map strip.** `ga-102` builds it out of coloured
 *    `<span>`s with sector labels and heart pins. `/trips/{id}` already refused
 *    the identical device on the identical grounds: *"There is no map, and a
 *    picture of one assembled from divs is a fabricated screenshot of a feature
 *    that does not exist."*
 *  · **The filled heart, the remove action and the Undo snackbar.** All three
 *    need a wishlist store. There is none, and the shipped
 *    `components/stays/wishlist-heart.tsx` is explicit that the heart navigates
 *    rather than toggling for exactly that reason. The hearts on the cards below
 *    are therefore the site's ONE heart in its one honest state — unfilled,
 *    `aria-pressed="false"`, labelled "Sign up to save" — which says the same
 *    thing the strip says, in the control's own state.
 *  · **`Your note` rows and `Add a note`.** A note is a write. Nothing can hold
 *    one.
 *  · **The `Recently added` sort control.** It would reorder a five-item fixture
 *    by a timestamp nobody recorded — an invented fact wearing a control.
 *  · **The `Edit this wishlist` action.** `/wishlists/{slug}/edit` (`ga-103`) is
 *    not in the registry and G37 fails the build on an href that does not
 *    resolve.
 *  · **`/rooms/{slug}` hrefs.** §1c strikes them: a listing is
 *    `/stays-in-{city}/{area}/{slug}`, and `/rooms/*` survives only as the app
 *    deep-link stub that 301s.
 *  · **The empty-list register.** `ga-102` draws one, and it is unreachable
 *    here: the list is a constant of five, so the branch could never render. §12
 *    asks every surface to ship its registers; it does not ask for a branch the
 *    surface has no state to enter. It lands with the store.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  PRIVATE, NOT COLLABORATIVE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md`'s **Unresolved** records the contradiction: `ga-126` says
 * wishlists are private with no public affordance; `ga-095` draws a
 * collaborative wishlist with invitees; both are `app+web` and no later ruling
 * picks. `ga-126` owns the overview, so the private reading ships and **nothing
 * on this page shares, invites or collaborates** — no Share control, no invitee
 * row, no avatar stack, no "public" toggle. The boundary is stated in plain
 * words once, on the overview's empty state, where a first-time reader is
 * standing. It is flagged upward, not resolved here.
 *
 * ROUTE CONTRACT (§2), none of it restated below: `noindex, follow` — inherited
 * from `../layout.tsx` and re-stated by `pageMetadata` off the registry row; no
 * canonical; no hreflang; no JSON-LD; no breadcrumb; `<main class="co-main">`
 * from `../layout.tsx`; exactly one `<h1>`, paired with the registered title for
 * G43 — title `Your wishlist — Islamabad in August`, `<h1>` `Islamabad in
 * August`.
 *
 * NO CLIENT BOUNDARY, and therefore no split metadata file. Nothing here reads
 * `SESSION_ACCOUNT` or any other client-only fact — a saved list is about homes,
 * not about the person — so this stays a Server Component end to end. The one
 * client leaf on the page is `WishlistHeart`, inside `StayCardCompact`, which
 * already draws its own boundary.
 *
 * MOTION: none of its own. The cards carry the shipped compact-card motion (a
 * 1.03 photograph under the pointer, 0.99 on press, both collapsing under
 * reduced motion) and nothing is added on top. §11: *"No entrance animation on a
 * list the guest will revisit"* — a wishlist is the definition of one, and a
 * five-card stagger seen fifty times a week is a delay, not a delight.
 */

/**
 * Result-grid `sizes`. The authenticated column is `container.page` (1120) less
 * a 48px gutter = 1072; four columns with three 16px gaps puts a tile at 256.
 * Derived the same way `components/search/search-shell.tsx` derives its own, so
 * the two grids cannot disagree about what they are asking the browser for.
 */
const SAVED_TILE_SIZES =
  "(min-width: 1120px) 256px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 45vw";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isExampleWishlistSlug(slug)) notFound();
  return pageMetadata(wishlistPath());
}

export default async function WishlistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isExampleWishlistSlug(slug)) notFound();

  const list = EXAMPLE_WISHLIST;

  return (
    <>
      {/*
        §4b's `.backrow`: ink, underlined at rest (TASTE §8), chevron leading and
        mirrored under RTL. The label is the destination's own name, which is the
        shipped convention on every guest detail surface — `Your trips`, `Your
        messages`, `Your trip`. `CHECKOUT-SHELL.md` §15 in its general form:
        Back returns to the last state that still exists.
      */}
      <TripBackLink href="/wishlists">Your wishlists</TripBackLink>

      {/*
        `.pagehead` — the list's own name, then the one line a guest writes under
        it (`ga-102`'s `.dsub`). Both come from `example-wishlist.ts`; neither is
        typed twice.
      */}
      <TripPageHead title={list.name} sub={list.description} className="mt-4" />

      {/*
        The strip, before the content it qualifies rather than after it — a
        reader who scrolls past five homes and then learns they are an example
        has already read them as their own. `/trips/{id}`, `/messages/{id}` and
        the five `/account` surfaces all place it in this position.
      */}
      <ExampleWishlistStrip className="mt-6">
        The homes are real listings on this site; the list around them is written into it.
      </ExampleWishlistStrip>

      <TripSection
        id="saved-homes"
        heading="Homes in this list"
        /*
          §4b's `.sec-sub`. It replaces `ga-102`'s `.lt-count` row, which pairs a
          count with a sort control — the control is refused above, and a count
          alone floating over a grid is a label with no line to sit on.

          The sector names are the reason this sentence exists: a saved list is
          the one surface in the product that mixes sectors, and saying which
          ones is a fact about the five cards below rather than a statistic about
          anything. `Num` isolates every digit run in it — the count AND the
          three sector numbers — because an unisolated run reverses under RTL,
          and "F-7" is exactly the shape `numerals.tsx` was written for.
        */
        sub={<Num>{`${list.stays.length} homes, across F-7, F-8 and F-6.`}</Num>}
        className="mt-8"
      >
        {/*
          The site's ONE inventory tile, in the grid `/search` already ships —
          `grid-cols-2` up to `sm`, three to `lg`, four above. A fourth card
          family for "a home you saved" would be a fourth thing to keep in step
          with the photograph, the title clamp and the price skeleton.

          Keyed on the frame rather than the route: `LISTING_THUMBS` gives each
          listing one photograph and no two of these five share one, so the frame
          is the stabler key — the same reasoning `search-shell.tsx` records.

          `newChip={false}`: the chip is honest on all five, so drawing it would
          be five identical marks saying nothing about the difference between
          five homes.
        */}
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {list.stays.map((stay, i) => (
            <li key={stay.image}>
              <StayCardCompact
                stay={stay}
                sizes={SAVED_TILE_SIZES}
                newChip={false}
                priority={i === 0}
              />
            </li>
          ))}
        </ul>
      </TripSection>
    </>
  );
}
