import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronLeftIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";

import { StatusChip } from "../../../reservations/reservation-parts";
import { ListingPhrase, ListingSampleStrip } from "../listing-parts";
import { editTitle, findListing, statusHref, type HostListing } from "../listing";

/**
 * `/host/listings/{slug}/edit` — HA-036, the edit-listing section hub, at web
 * width. The return point every post-publish editor in the corpus points at.
 *
 * WHICH CHROME, AND WHY THIS SETTLES AN OPEN QUESTION
 * --------------------------------------------------
 * `HOST-SHELL.md`'s "Unresolved" list names editing a live listing as undrawn:
 * "Whether editing reuses the wizard chrome with a `Save` primary, or the app
 * chrome with sectioned forms, is undrawn." `ha-036` answers it — app chrome,
 * sectioned entries, and explicitly **no wizard bars and no unsaved-changes
 * bar**, "because a hub holds no form, so nothing can diverge". So this route
 * lives INSIDE the `(app)` route group and takes the section nav and
 * `<main class="co-main">` from `app/host/(app)/layout.tsx`, while the creation
 * wizard stays outside it at `/host/listings/new/{step}`. One route shape, two
 * chromes, decided by the group boundary rather than by anyone remembering.
 *
 * THE ONE RULE THE HUB IS BUILT AROUND
 * ------------------------------------
 * `ha-036`: the hub renders **no owned value** — no nightly rate, no capacity,
 * no address, no minimum stay. Each row states the SCOPE of a section and hands
 * off to whatever owns it. A hub that re-printed those values would become a
 * second place they could drift out of sync, which is the same failure
 * `/host/calendar` and `/host/earnings` avoided by deriving their homes from
 * one fixture. Nothing below prints a value. That is also why the collision
 * `../listing.ts` records — two files disagreeing about Cantt View Residence's
 * nightly rate — cannot reach this page.
 *
 * WHAT THE CARD DRAWS THAT IS NOT HERE, EACH WITH ITS REASON
 * ----------------------------------------------------------
 *  · **Sections 5, 6 and 7 — Cultural attributes, Qibla & prayer, Women-only &
 *    mahram.** `REPOSITIONING.md` retires cultural attributes, Qibla direction,
 *    prayer amenities and the mahram restriction outright: "not modelled, not
 *    filtered on, not badged, not marketed." `HOST-SHELL.md` §15 already struck
 *    the same three from the wizard, leaving nine steps. They are not rows here
 *    and they are not softened rows either — a `Not built` chip on a retired
 *    section would say a retired thing is coming.
 *  · **"Eid & Ramadan pricing".** Retired with the rest of the Hijri layer.
 *    §16.3 withdrew the Ramadan/Eid cancellation extension for the same reason:
 *    it referenced a calendar the product no longer ships.
 *  · **The `Live` / `Paused` chip in the header.** Nothing on this build stores
 *    whether a listing is published, so a Server Component cannot know it, and
 *    a chip that guessed would be a claim about state. Lifecycle is the status
 *    page's fact and only its fact — one fact, one owner, applied to the hub's
 *    own header.
 *  · **"Preview as guest".** There is no public page for a fixture home, so the
 *    row's destination is a 404 and its promise — "see the listing exactly the
 *    way a guest does" — is unkeepable. A live link into a 404 is worse than no
 *    link (`../../reservations/[id]/detail.tsx` reached the same conclusion for
 *    three of its own affordances), and an unbuilt chip on it would still imply
 *    a guest-facing page exists to preview.
 *  · **"Every change saves inside the section you open."** `GO-LIVE` A18 is
 *    live: the wizard already promises a host their progress saves when it does
 *    not. This page does not add a second promise of the same class. The strip
 *    says what is actually true instead.
 *  · **The step numerals.** TASTE §7 and §11.20 put zero eyebrows and zero
 *    section numbers on every surface; `../../onboarding/page.tsx` dropped
 *    `ha-004`'s for the same reason. The order is the listing form's and the
 *    `<ol>` carries it.
 *  · **The card's uppercase `.grp` group captions.** 11/600 uppercase +0.05em is
 *    `overline`, and TASTE §7 rules `overline` a form-label token that is NEVER
 *    a section eyebrow. The groups ship as real headings on the ladder instead.
 *
 * HOW A BUILT ROW DIFFERS FROM AN UNBUILT ONE
 * -------------------------------------------
 * The same pair `/host/onboarding` uses, and for the same reason — there is no
 * per-section state to read, so the signal is structural: a row you can open
 * carries an inline action, a row you cannot carries a neutral `Not built` chip
 * and links nowhere. `SectionState` has literally two variants so that adding a
 * third is a type error rather than a copy edit. Nothing here is drawn as done,
 * current, incomplete or locked.
 *
 * NO GREEN ON THIS PAGE. `HOST-SHELL.md` §7 rules the host app surface already
 * over TASTE §2's four-role budget through `ha-046`'s inherited chip, nav
 * underline and avatar, and says what to do about it: **"Add nothing to it."**
 * The nav's own `Create a listing` keeps the surface's one green; every action
 * here is TASTE §8's ink inline action, underlined at rest.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated): `robots: noindex, follow`
 * from `app/host/layout.tsx`; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` from `HostAppShell`; one `<h1>`.
 */

interface EditParams {
  readonly slug: string;
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<EditParams>;
}): Promise<Metadata> {
  const listing = findListing((await params).slug);

  /* A slug nobody has is answered by `notFound()` below. Returning nothing here
     lets that 404 render instead of throwing on the way to it. */
  if (listing === undefined) return {};

  return { title: { absolute: editTitle(listing) } };
}

/* ───────────────────────────── the sections ─────────────────────────────── */

type SectionState =
  | { readonly kind: "unbuilt" }
  | { readonly kind: "open"; readonly href: string; readonly label: string };

interface ListingSection {
  readonly title: string;
  /**
   * What the section OWNS, never what it currently holds. Every sentence is the
   * scope `ha-036` writes, checked against the wizard step that collects it so
   * the hub and the form cannot describe two different products — the sentences
   * use `app/host/listings/new/{step}`'s own vocabulary where the card's had
   * drifted (the card promises a description "in English and Urdu"; the step
   * collects one language).
   */
  readonly scope: string;
  readonly state: SectionState;
}

interface SectionGroup {
  readonly heading: string;
  readonly sections: readonly ListingSection[];
}

function groupsFor(listing: HostListing): readonly SectionGroup[] {
  return [
    {
      /*
       * `HOST-SHELL.md` §15's nine steps, in the form's order. The card's
       * "Cultural & practical" group held the three retired sections plus the
       * PK-practical trio; the trio became step 5, "Practical facts", and it
       * sits here where the form puts it rather than under a heading of its
       * own. §15: step 5 is the flagship, "do not soften it into 'amenities,
       * continued'" — which is why its scope names the six facts.
       */
      heading: "Your home",
      sections: [
        {
          title: "Property type",
          scope: "What kind of place it is, and how much of it a guest gets.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Location",
          scope: "The address, and how much of it a guest sees before they book.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Capacity",
          scope: "Guests, bedrooms, beds and bathrooms.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Amenities",
          scope: "What a guest can actually use on the day they arrive.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Practical facts",
          scope:
            "Load-shedding, backup power, water, sui gas, Wi-Fi and parking — the facts guests check before anything else.",
          state: { kind: "unbuilt" },
        },
      ],
    },
    {
      heading: "How it reads to guests",
      sections: [
        {
          title: "Photos",
          scope: "Add, reorder, caption, and choose the one guests see first.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Title & description",
          scope: "The name guests see, and the description underneath it.",
          state: { kind: "unbuilt" },
        },
        {
          title: "House rules",
          scope: "Check-in and check-out times, quiet hours, and the rules of your home.",
          state: { kind: "unbuilt" },
        },
      ],
    },
    {
      heading: "Money & dates",
      sections: [
        {
          title: "Pricing & availability",
          scope: "Your nightly rate, the cleaning fee, and the shortest stay you take.",
          state: { kind: "unbuilt" },
        },
        {
          /*
           * The one section row on this hub whose owner already exists, and it
           * is a whole route rather than a listing-scoped editor: `/host/calendar`
           * owns which nights are open for every home, with a switcher between
           * them. `ha-036` routes its "Calendar & per-date prices" sub-row to
           * exactly that path, so the link is the card's and not an improvised
           * one. The scope sentence says the switcher out loud, because a host
           * arriving from one listing's hub should not have to discover that
           * the page they land on covers both homes.
           *
           * Per-date PRICES are deliberately not claimed: `ha-042` owns them,
           * `/host/calendar` ships without a price override and says so, and a
           * row promising an editor that route does not have would be the dead
           * link this page exists to avoid.
           */
          title: "Calendar",
          scope:
            "Which nights are open, and which are already taken. It covers every home you have, with a switcher between them.",
          state: { kind: "open", href: "/host/calendar", label: "Open your calendar" },
        },
      ],
    },
    {
      heading: "This listing",
      sections: [
        {
          /*
           * Kept as a row, and worded so it makes no determination. The
           * cantonment consequence is real in this product — `location/step.tsx`
           * detects it from the host's own typed address and
           * `../../reservations/[id]` tells a host about the NOC — so a host
           * looking for where a permission lives is looking for something that
           * exists as an idea. `/host/onboarding` states the same conditional
           * for the account-level row and names no city, cantonment or property
           * type; this row does not name one either.
           */
          title: "Licenses & compliance",
          scope:
            "Where a local authority asks for a permission before an address can host guests, it would be kept here.",
          state: { kind: "unbuilt" },
        },
        {
          title: "Listing status",
          scope: "Take this listing off search, or remove it altogether.",
          state: {
            kind: "open",
            href: statusHref(listing.id),
            label: "Open listing status",
          },
        },
      ],
    },
  ];
}

/* ────────────────────────────── the page ────────────────────────────────── */

export default async function HostEditListingPage({
  params,
}: {
  readonly params: Promise<EditParams>;
}) {
  const listing = findListing((await params).slug);

  /*
   * There is no listing store, so "not one of the homes the reservations
   * fixture names" is the only way this can fail, and `notFound()` is the
   * honest answer. It is NOT a placeholder for a fetch: a page that invented a
   * listing for an unknown slug would invent a home, a city and a set of
   * sections belonging to nobody.
   */
  if (listing === undefined) notFound();

  const groups = groupsFor(listing);

  return (
    <div className="max-w-prose">
      {/* TASTE §8 — ink, underlined at rest. `HOST-SHELL.md` §1 rules out a
          breadcrumb on every host route, and this is a single Back rather than
          a trail. The chevron mirrors under RTL. */}
      <Link href="/host/listings" className={`inline-flex items-center gap-1 ${inlineAction}`}>
        <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
        Back to your listings
      </Link>

      {/* `h4` where the six nav sections take `h5`: the nav says "Listings" but
          not which one, so this is a real page title rather than a region label
          (TASTE §7 puts a content page's H1 at the 24–26 rung). Same rung
          `/host/reservations/[id]` and `/host/onboarding` take, for the same
          reason. */}
      <h1 className="mt-5 text-h4 font-semibold text-primary">
        <ListingPhrase lead="Edit " name={listing.name} />
      </h1>
      <p className="mt-1 text-bodyMd font-regular text-secondary">{listing.city}</p>

      <ListingSampleStrip className="mt-5" />

      <p className="mt-6 text-bodyMd font-regular leading-relaxed text-secondary">
        Every part of a listing, in the order the listing form asks for it. Two of the twelve rows
        open something on this site. The other ten have no editor yet and are marked, rather than
        linked to a page that is not there.
      </p>

      {groups.map((group) => (
        <section key={group.heading} className="mt-8 border-t border-hairline pt-7">
          <h2 className="text-h6 font-semibold text-primary">{group.heading}</h2>

          {/*
            ELEVATION: neither. TASTE §1 gives a shadow to what floats and a
            border to a form boundary or an unselected choice; a hub row is
            none of the three. `ha-036` draws each group as a bordered plate
            with hairlines inside it, which at web width becomes four boxes
            stacked down a column — the box-per-idea habit
            `components/host/host-sections.tsx` argues against and §1 calls
            "most of the premium read". So the rows are open, divided by one
            hairline PER GAP.

            `<ol>` because the order is the product's: a property type comes
            before a price, and the listing form asks in this sequence.
          */}
          <ol className="mt-4 divide-y divide-hairline">
            {group.sections.map((section) => (
              <li key={section.title} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {/*
                    `<h3>` at the `bodyMd` rung: the tag carries the outline —
                    twelve named rows under four group headings, reachable by
                    heading navigation — and the class carries the visual rank
                    (TASTE §7, card titles 16/500-600).
                  */}
                  <h3 className="text-bodyMd font-semibold text-primary">{section.title}</h3>
                  {section.state.kind === "unbuilt" ? (
                    /*
                      `StatusChip` imported from the reservations surface rather
                      than redrawn — one chip recipe, `neutral` tone. It is a
                      word, not a colour: nothing about this state is carried by
                      the tint, so it survives a monochrome screen and a
                      colour-blind reader without a second signal.

                      "Not built", not "Not built yet" — the second promises a
                      release nobody has scheduled. Copied from
                      `/host/onboarding`, which is where this pattern ships.
                    */
                    <StatusChip tone="neutral">Not built</StatusChip>
                  ) : null}
                </div>

                <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                  {section.scope}
                </p>

                {section.state.kind === "open" ? (
                  <p className="mt-3">
                    <Link
                      href={section.state.href}
                      className={`${inlineAction} text-bodySm`}
                    >
                      {section.state.label}
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}

      {/*
        The closing paragraph does the job `/host/earnings`, `/host/insights` and
        `/host/onboarding` all give theirs: it reconciles what the reader came
        for with what is here, and it states the rule that decided the page's
        shape rather than apologising for it. Present tense — this is current
        behaviour, not a promise about a release.
      */}
      <p className="mt-8 border-t border-hairline pt-8 text-bodySm font-regular leading-relaxed text-secondary">
        Each part of a listing is edited in one place only, which is why nothing on this page prints
        a value — no price, no capacity, no address. A second copy of a fact is a second place for it
        to go stale, and what a guest reads and what you set have to be the same thing.
      </p>
    </div>
  );
}
