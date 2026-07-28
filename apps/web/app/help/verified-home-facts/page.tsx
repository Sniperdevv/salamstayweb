import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/verified-home-facts` — the article behind the practical-facts table on
 * every listing. Eight hrefs point here, five of them from city pages, which
 * makes it the most-linked article in the discovery half of the site.
 *
 * THIS IS CLAIM 7 TERRITORY AND CLAIM 7 IS THE FLAGSHIP, so the constraint is
 * tighter here than anywhere else in the help set. SEO-RULES §5 states it
 * outright: *"It is stated with real numbers or not at all: a load-shedding
 * window or a backup runtime that the host has not supplied is shown as 'not
 * stated by the host' and never estimated, rounded up, or inherited from
 * another listing. The flagship claim is the one it would be most tempting to
 * embellish and the one where embellishment would be most damaging."*
 *
 * SO THIS ARTICLE PRINTS NO FIGURES. `is-f7-2bed` discloses "~1-2 hrs/day
 * load-shedding" and "up to ~6 hrs/day" of generator runtime, and both are that
 * HOST'S OWN disclosure for that one home. Lifting either onto a help page
 * would turn one host's answer into a platform-wide expectation — the exact
 * "inherited from another listing" failure, one level up. The article describes
 * WHICH FACTS are published and WHO STATES THEM; the numbers live on the
 * listings, where they are true.
 *
 * THE WORD "VERIFIED" IS THE WHOLE PROBLEM AND §verified IS THE ANSWER.
 * The shipped line under every listing's table is *"Last verified by the host
 * on {date}. Hosts confirm these facts each season."* — the host verifies, and
 * `/verification` is unambiguous about what SalamStay does not do: *"It does
 * not certify a host, inspect a home, or make a judgement about who travels
 * with whom."* An article called "Verified home facts" that let a reader
 * believe an inspector had been round would be the most damaging sentence on
 * the site. It is stated plainly, twice, and never softened.
 *
 * COPY PROVENANCE:
 *  · the five published facts — `lib/content/listings/*.ts` `infrastructure`,
 *    which is what `components/listing/listing-amenities.tsx` renders;
 *  · "Last verified by the host on … Hosts confirm these facts each season" —
 *    same source, verbatim;
 *  · the honesty boundary — `/verification`, verbatim;
 *  · claim 7 byte-exact in the strip, claim 4 byte-exact where the badges are
 *    described. Nothing else is a claim.
 */

const PATH = "/help/verified-home-facts";

const DESCRIPTION =
  "Every SalamStay listing publishes the practical facts about the home: load-shedding, backup power, water, gas and internet. Who states them, how often they are re-confirmed, and what happens when one is missing.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Verified home facts", path: PATH },
];

const CONTENTS = [
  { href: "#facts", label: "What is published" },
  { href: "#verified", label: "What “verified” means, and what it does not" },
  { href: "#missing", label: "When a fact is missing" },
  { href: "#badges", label: "The other things on a listing" },
  { href: "#related", label: "Related help" },
] as const;

const FACTS = [
  {
    term: "Electricity",
    detail:
      "The load-shedding pattern the host sees at that address, and the grid company that serves it. Written as hours in a typical day and the part of the day they usually fall in, because that is what decides whether a cut matters to you.",
  },
  {
    term: "Backup power",
    detail:
      "What runs when the grid is off, and for how long. A UPS and a generator do different jobs — one keeps fans, lights and Wi-Fi going through a routine cut, the other covers a long outage — so the listing says which the home has, and whether fuel is included.",
  },
  {
    term: "Water",
    detail:
      "Where the water comes from and whether it is continuous: mains, a storage tank, a bore backup, or some combination. Pressure and hot water are noted where the host has something to say about them.",
  },
  {
    term: "Gas (Sui)",
    detail:
      "Whether piped gas reaches the kitchen and the heaters, and what happens on the cold winter mornings when pressure drops across a city. Homes with an electric backup say so.",
  },
  {
    term: "Wi-Fi",
    detail:
      "The connection type, the speed the host measured, and the date they measured it. A speed with no date on it is a speed from an unknown year.",
  },
] as const;

const RELATED = [
  {
    href: "/help/house-rules",
    title: "House rules on a listing",
    body: "The other half of what a host sets: check-in times, guests, smoking, alcohol, quiet hours.",
  },
  {
    href: "/verification",
    title: "How verification works",
    body: "What SalamStay checks, and the plain statement of what it does not.",
  },
  {
    href: "/help/cancellation",
    title: "Cancellation options and what they refund",
    body: "The third thing on a listing you should read before booking it.",
  },
  {
    href: "/legal/corrections",
    title: "Corrections",
    body: "What we do when something we published turns out to be wrong.",
  },
] as const;

export default function VerifiedHomeFactsPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Verified home facts on a listing"
      description={DESCRIPTION}
      slug="verified-home-facts"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          Every listing publishes the practical facts about the home —{" "}
          <strong>load-shedding, backup power, water, gas and internet</strong> — as a table you
          can read before you book. <strong>The host states them and dates them</strong>, and
          confirms them again each season. SalamStay does not inspect the home, and a fact the host
          has not given is shown as not stated rather than filled in with a guess.
        </p>
      }
      support={
        <>
          <p>
            If you stayed somewhere and the facts on the listing were not the facts in the house,
            tell us. That is worth more to us than a review, and it is the kind of thing a listing
            gets corrected for. A person reads every ticket, in Urdu or in English.
          </p>
          <p>
            Or read{" "}
            <Link href="/trust-and-safety" className={inlineAction}>
              trust and safety
            </Link>
            , or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="facts" heading="What is published">
        <Prose>
          <p>
            Five facts, on every home, in the same order and the same table. They are the ones that
            decide what a night in a Pakistani house is actually like, and they are the ones no
            photograph shows.
          </p>
        </Prose>

        <FactList items={FACTS} />

        {/* §5 claim 7, byte-exact — the flagship. Plain description under it,
            and no figure anywhere near it. */}
        <NoteStrip heading="Listings show load-shedding hours and backup power">
          Stated for the individual home by the host who lives with it, not for the sector, the city
          or the country. <strong>Two homes on one street can have different answers</strong>, which
          is why it is published per listing rather than as an area note.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="verified" heading="What “verified” means, and what it does not">
        <Prose>
          <p>
            It means the host has stated the fact, put a date on it, and is asked to confirm it
            again each season. The date sits under the table on every listing —{" "}
            <strong>&ldquo;last verified by the host&rdquo;</strong> — because how old a fact is is
            part of the fact.
          </p>
          <p>
            It does not mean anyone from SalamStay has been to the house.{" "}
            <strong>
              SalamStay checks identity and files what the law requires. It does not certify a host,
              inspect a home, or make a judgement about who travels with whom.
            </strong>{" "}
            The home facts are the host&apos;s account of their own home, published under their
            name, with a date on it — which is a different and smaller thing than an inspection, and
            saying otherwise would be the one lie on this page worth avoiding.
          </p>
          <p>
            What the date buys you is accountability rather than certification: a host who states
            six hours of generator runtime and delivers two has said something checkable, in
            writing, before you paid.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="missing" heading="When a fact is missing">
        <Prose>
          <p>
            Some hosts do not have an answer to every row — a new listing, a home the host does not
            live in, a connection nobody has measured. Where that happens the listing says the fact
            was <strong>not stated by the host</strong>.
          </p>
          <p>
            It is never estimated, never rounded up, and{" "}
            <strong>never inherited from a nearby listing</strong>. A neighbour&apos;s generator is
            not evidence about this house, and an area average is not evidence about anything. A
            blank that says it is blank is more useful than a number that might be someone
            else&apos;s.
          </p>
          <p>
            If a row matters to you and it is not stated, ask the host before you book. That is a
            normal question and hosts expect it.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="badges" heading="The other things on a listing">
        <Prose>
          <p>
            The practical facts sit alongside two other kinds of statement, and they are not the
            same kind of thing.
          </p>
        </Prose>

        <FactList
          items={[
            {
              term: "Amenities",
              detail:
                "What the home has — Wi-Fi, parking, a kitchen, heating. Shown as a plain list, at the same visual weight as each other, with no badge ranked above another.",
            },
            {
              term: "House rules",
              detail: (
                <>
                  What the host asks of you: check-in and check-out times, the guest count, smoking,
                  parties, quiet hours.{" "}
                  <strong>No-alcohol listings by default</strong> — a host who allows it has to opt
                  in and disclose. Read{" "}
                  <Link href="/help/house-rules" className={`${inlineAction} ${focusRing}`}>
                    house rules on a listing
                  </Link>
                  .
                </>
              ),
            },
            {
              term: "Verification for your booking",
              detail: (
                <>
                  Which document your party type verifies before you reserve. That is about the
                  booking rather than about the home —{" "}
                  <Link href="/help/verification" className={`${inlineAction} ${focusRing}`}>
                    verification and documents
                  </Link>{" "}
                  covers it.
                </>
              ),
            },
          ]}
        />
      </ProseSection>
    </HelpArticle>
  );
}
