import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { iconStroke } from "@salamstay/design-tokens/icons";
import { HelpIcon, InfoIcon } from "@/components/icons";
import { Phrase } from "@/components/numerals";
import {
  FactRow,
  FactRows,
  postFlowNote,
  postFlowPrimary,
  postFlowSection,
  postFlowSectionSub,
  postFlowSectionTitle,
  WizardPostFlow,
} from "@/components/host/wizard-post-flow";
import { btnSecondaryMd, inlineAction, pressable } from "@/components/ui";
import {
  CANTONMENT_NOC_HREF,
  CANTONMENT_NOC_LABEL,
  CLAIM_LOAD_SHEDDING,
  HOST_LISTING_DRAFT as L,
  LocationPin,
  VerifiedShield,
} from "@/lib/content/host-listing-draft-fixture";
import { image } from "@/lib/content/image-manifest";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/host/listings/new/preview` — the publish preview.
 * `hw-007-publish-and-host.html` **panel A**, the card's authoritative semantic
 * page, under `HOST-SHELL.md` §15 and its §16 amendments.
 *
 * This is where step 9's `Review and publish` lands, and until now it landed on
 * a registry stub. Nine steps of a host's evening ended on "This page is being
 * written"; that is what this file is for.
 *
 * POST-FLOW, WHICH IS A STRUCTURE AND NOT A MOOD
 * ----------------------------------------------
 * §15: the preview renders AFTER 9 of 9 with no bars and no caption. It wears
 * the wizard chrome and it is not a tenth step, so it takes `WizardPostFlow`
 * rather than `WizardStep` — see that file for what the footer does differently
 * and why its top edge is a hairline again.
 *
 * `Back` GOES TO STEP 9, AND THE BRIEF FOR THIS FILE SAID `/host/listings`
 * ----------------------------------------------------------------------
 * Flagged rather than silently resolved either way. `HOST-SHELL.md` §15's
 * 2026-07-26 ruling settles BOTH post-flow surfaces in one bullet and settles
 * them differently:
 *
 *   · "**Publish preview** → `Back` goes to step 9,
 *     `/host/listings/new/pricing`. This is a genuine step back: nothing has
 *     been published, the draft is intact, and the host is re-opening the last
 *     thing they filled in."
 *   · "**Published** → `Back` goes to `/host/listings`. The listing is live;
 *     there is no previous state."
 *
 * `hw-007` panel A draws `href="/host/listings/new/pricing"` literally, and the
 * card's own header note says the same thing in prose ("On the preview that is
 * exact: Back → `/host/listings/new/pricing`, step 9"). The generalisation the
 * brief quoted — Back returns to the last state that still exists, and "not
 * published yet" is not a state you can return to — is the ruling's reasoning
 * for the PUBLISHED screen, and it does not reach this one: nothing has been
 * published here, so "not published yet" is not a state behind this page, it is
 * the state this page is in. Built to the card. One-word change at this call
 * site if the ruling moves.
 *
 * THE LISTING IS A FIXTURE AND THE FIXTURE SAYS SO
 * -----------------------------------------------
 * There is no draft store — the nine steps hold their answers in `useState` and
 * drop them on navigation — so this page has no host answers to render.
 * `lib/content/host-listing-draft-fixture.tsx` carries `hw-007`'s worked case
 * and documents exactly what that means. Nothing on this page is the reader's
 * data. When the draft lands, that module is deleted and this file's `L` comes
 * from the session; the shapes were chosen so that is an import change.
 *
 * PUBLISHING IS A POST, SO THE PRIMARY IS A REAL SUBMIT
 * ----------------------------------------------------
 * The card is explicit: "publishing is a POST, so the primary is a real submit
 * and not a link dressed as one." It is one here — a real `<form>` with a
 * server action, and a `<button type="submit" form="publish-form">` in the
 * action bar, associated across the DOM by the `form` attribute exactly as the
 * card draws it. It works with JavaScript off.
 *
 * WHAT THAT ACTION DOES TODAY IS NAVIGATE, AND NOTHING ELSE. There is no API,
 * no listing record and nothing to write, so `publishListing` redirects and
 * stops. It is the seam the real mutation lands in, kept in the shape the real
 * mutation will have rather than approximated with a link that would have to be
 * torn out. Flagged here because a reader of this page in a browser cannot see
 * the difference: a host who presses `Publish listing` on the running site has
 * not published anything.
 *
 * SEMANTICS (§1): `noindex, follow` inherited from `app/host/layout.tsx` and
 * restated by the wizard boundary; `<main class="co-main">`, never `indexable`;
 * ONE `<h1>`; no canonical, no hreflang pair, no JSON-LD, no breadcrumb.
 */

/**
 * The title is the registry's, looked up rather than retyped.
 *
 * G41 compares the served `<title>` to `lib/seo/route-registry.ts` byte for
 * byte, and the nine steps shipped one shared title and cost eight gate
 * failures for it. `pageMetadata` makes drift structurally impossible: there is
 * one string and this file does not hold a copy of it. It also means this page
 * needs no `"use client"` sibling — nothing on it is interactive beyond a form
 * submit, so the whole surface is a Server Component and the metadata trap
 * never arises.
 */
export const metadata: Metadata = pageMetadata("/host/listings/new/preview");

/**
 * The publish POST.
 *
 * `redirect()` throws `NEXT_REDIRECT`, which is how a server action navigates;
 * it is not an early return and nothing below it would run. When there is a
 * listing to create, it is created here — and the redirect target stops being a
 * constant and becomes the created row's slug.
 */
async function publishListing(): Promise<void> {
  "use server";
  redirect(L.publishedHref);
}

const PUBLISH_FORM_ID = "publish-form";

/* ——— The guest-eye preview ————————————————————————————————————————————————
 *
 * `.gpv` — a bordered container, NO shadow (TASTE §1: it bounds content, it
 * does not float over it). `radius.xl` outer, `overflow-hidden`, and the photo
 * composition sits flush inside it, which is what makes every interior corner
 * square: the mosaic is ONE object and only its four outer corners round
 * (TASTE §4.2). That is the opposite call from `hw-005`'s manager grid, where
 * every tile is its own object and carries its own radius.
 *
 * Below the breakpoint the composition stops being a mosaic and becomes a
 * stack; the outer corners stay `xl` and the interior corners stay square,
 * because it is still one object.
 *
 * ZERO SCRIM, ZERO OVERLAY, NO TEXT ON A PHOTOGRAPH (TASTE §9). The `New
 * listing` chip sits BELOW the composition in `.pvbody`, not burnt onto the
 * hero, and there is no photo counter and no credit on any frame.
 */
function GuestEyePreview() {
  const hero = image(L.hero);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-canvas">
      <div className="grid gap-2 md:grid-cols-[1.7fr_1fr] md:grid-rows-2">
        {/*
          The hero's 3:2 sizes the whole composition: it spans both rows, so the
          two `1fr` rows split its height and the side tiles stretch to match.
          Without that the side stack outgrows the hero and the block ends in a
          white step. `1.7fr` is a RATIO and not a spacing value — there is no
          token scale for "how wide is the hero against its tiles", and the card
          draws this one.
        */}
        <span className="relative block aspect-[3/2] min-h-0 overflow-hidden md:row-span-2">
          <Image
            src={hero.file}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            sizes="(min-width: 768px) 368px, 92vw"
            priority
            className="size-full object-cover"
          />
        </span>

        {L.tiles.map((id) => {
          const tile = image(id);
          return (
            <span
              key={id}
              className="relative block aspect-[3/2] min-h-0 overflow-hidden md:aspect-auto"
            >
              <Image
                src={tile.file}
                alt={tile.alt}
                width={tile.width}
                height={tile.height}
                sizes="(min-width: 768px) 216px, 92vw"
                loading="lazy"
                className="size-full object-cover"
              />
            </span>
          );
        })}
      </div>

      <div className="px-5 pb-5 pt-4">
        {/*
          TASTE §12's honest equivalent of a rating row. `ha-046` ships
          `4.9 · 128 reviews` on its listing tiles; zero real reviews exist, so
          no rating, no count and no superlative appears here or anywhere else
          on this flow.
        */}
        <span className="inline-flex h-6 items-center rounded-full border border-hairline bg-raised px-2.5 text-caption font-semibold text-secondary">
          New listing
        </span>

        <span className="mt-2.5 block text-bodyMd font-semibold text-primary">{L.title}</span>

        <span className="mt-1 flex items-center gap-2 text-bodySm font-regular text-secondary">
          <span aria-hidden="true" className="flex-none text-tertiary">
            {LocationPin}
          </span>
          {L.area}
        </span>

        {/*
          `·` one per gap, spaces both sides, never chained decoratively
          (TASTE §7). Each digit run is its own `.num`, and each sits inside the
          same text run as its noun so no flex gap can open inside a phrase.

          `Phrase` around the line — GO-LIVE A17. Three isolates in one sentence,
          the last of them at the end of the run, so under RTL that one took the
          paragraph direction and led: `6 Entire place · 3 bedrooms · 2 bathrooms
          · sleeps`. Inside the block span, never on it (`numerals.tsx`).
        */}
        <span className="mt-1.5 block text-bodySm font-regular text-secondary">
          <Phrase>
            {L.stayType} · <span className="num">{L.bedrooms}</span> bedrooms ·{" "}
            <span className="num">{L.bathrooms}</span> bathrooms · sleeps{" "}
            <span className="num">{L.sleeps}</span>
          </Phrase>
        </span>

        {/*
          `PKR 12,000` — three-letter code, one space, thousands separator. The
          bare rupee glyph ships in no file (§6, §16.1). Not underlined: TASTE §8
          underlines a price only where it opens a breakdown, and this one does
          not.
        */}
        <span className="mt-3 block text-bodyMd font-regular text-secondary">
          <b className="font-semibold text-primary">
            PKR <span className="num">{L.nightly}</span>
          </b>{" "}
          a night
        </span>
      </div>

      <div className="border-t border-hairline px-5 py-4">
        <h3 className="text-bodySm font-semibold text-primary">The practical facts</h3>

        {/*
          The ONE §5 claim on this flow, byte-exact, at the moment the host sees
          their own practical facts rendered for a guest (HOST-SHELL §12: if a
          claim appears on a host card, it is claim 7). `.ghint` — icon and
          sentence in open space, no box, no plate (TASTE §1).

          The second half of the sentence is the §6 rule stated to the person it
          protects: a fact the host left blank reads as "not stated by the host"
          and is never estimated, rounded up, or inherited from a nearby listing.
        */}
        <p className="mt-3 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary">
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className="font-semibold text-primary">{CLAIM_LOAD_SHEDDING}</b> — these six lines
            are yours, exactly as you gave them. Anything you left blank reads as &ldquo;not stated
            by the host&rdquo;, and we never fill it in for you.
          </span>
        </p>

        <FactRows>
          {L.facts.map((fact) => (
            <FactRow key={fact.id} icon={fact.icon} title={fact.title} detail={fact.detail} />
          ))}
        </FactRows>
      </div>

      <div className="border-t border-hairline px-5 py-4">
        <h3 className="text-bodySm font-semibold text-primary">House rules</h3>
        {/*
          Chips: `rounded-full`, `border.default`, no fill change and no shadow —
          they are unselected-choice-shaped rather than selected, because a guest
          reads them and nobody picks them. Each label is a single element, so a
          flex gap cannot open inside "Check-in after 2:00 PM"
          (BUILD-DECISIONS #22).
        */}
        <ul className="mt-3 flex flex-wrap gap-2">
          {L.rules.map((rule) => (
            <li
              key={rule.id}
              className="inline-flex h-8 items-center gap-2 rounded-full border border-border-default bg-canvas px-3 text-label font-regular text-primary"
            >
              <span aria-hidden="true" className="flex-none text-secondary">
                {rule.icon}
              </span>
              {rule.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-hairline px-5 py-4">
        <h3 className="text-bodySm font-semibold text-primary">Your host</h3>
        <div className="mt-3 flex items-center gap-3">
          {/*
            `bg.raised` and ink, not the brand-filled avatar `ha-046` draws.
            §7 budgets this surface at two green roles and both are spent; a
            third on a decorative disc is the spend TASTE §2 exists to stop.
          */}
          <span
            aria-hidden="true"
            className="grid size-10 flex-none place-items-center rounded-full bg-raised text-bodySm font-semibold text-primary"
          >
            {L.hostInitials}
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-bodySm font-semibold text-primary">
              Hosted by {L.hostName}
            </b>
            <span className="mt-0.5 block text-label font-regular text-secondary">
              {L.hostCity}
            </span>
          </span>
          {/*
            The verification mark — INK, with a shield and the word. `gw-023`'s
            rule: a green tick per row is exactly the colour spend TASTE §1/§2
            exist to prevent, and green here would be a third role.
          */}
          <span className="flex flex-none items-center gap-1.5 text-label font-medium text-primary">
            <span aria-hidden="true">{VerifiedShield}</span>
            CNIC verified
          </span>
        </div>
      </div>
    </div>
  );
}

/* ——— Rows ————————————————————————————————————————————————————————————————— */

/** The check on a `done` row. Colour is never the only signal (§11). */
function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.bold}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="size-4"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

/** The minus on a `pending` row. Not a cross: nothing here has failed. */
function PendingGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.bold}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="size-4"
    >
      <path d="M8 12h8" />
    </svg>
  );
}

/* ——— Page ———————————————————————————————————————————————————————————————— */

export default function PublishPreviewPage() {
  return (
    <WizardPostFlow
      ctxNow="New listing"
      headerActions={
        <>
          {/*
            `Questions?` points at `/help` and not at the card's
            `/host/help/publishing-a-listing`, which is in no registry and has no
            folder. Same call `wizard-step.tsx` made and for the same reason: a
            real page beats a thin stub with the same label on it, and a host
            mid-publish must not be handed a 404. A 40px square below `sm`,
            labelled above it; the `aria-label` sits on the link at both widths
            so the accessible name does not change when the label appears.
          */}
          <Link href="/help" aria-label="Questions?" className={`${btnSecondaryMd} w-10 sm:w-auto sm:px-4`}>
            <HelpIcon className="size-4" />
            <span className="hidden sm:inline">Questions?</span>
          </Link>
          <Link href="/host/listings" className={`${btnSecondaryMd} px-4`}>
            Save &amp; exit
          </Link>
        </>
      }
      backHref="/host/listings/new/pricing"
      backLabel="Back"
      primary={
        <button
          type="submit"
          form={PUBLISH_FORM_ID}
          className={`${postFlowPrimary} justify-self-end bg-interactive text-on-brand hover:bg-interactive-hover ${pressable}`}
        >
          Publish listing
        </button>
      }
    >
      {/* `.pagehead` — 44 above the `h1`, which is the chrome's own step-in.
          `h1` at the `h3` rung (TASTE §7: content pages open at ~26 and never
          shout; `display` stays funnel-hero-only). */}
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">How guests will see it</h1>
        <p className="mt-2 max-w-[56ch] text-bodyMd font-regular text-secondary">
          {L.name} is not live yet. Read it the way a guest would, change anything that is not
          right, then publish.
        </p>
      </div>

      {/*
        A real `<form>` (§11.1) whose submit is the action bar's primary,
        associated by `form=` across the DOM because the bar is chrome and lives
        outside this element. `action` is the server function; with JavaScript
        off the browser posts the form natively and lands in the same place.
      */}
      <form id={PUBLISH_FORM_ID} action={publishListing}>
        <section className={postFlowSection} aria-labelledby="preview-h">
          <h2 id="preview-h" className={postFlowSectionTitle}>
            Your listing
          </h2>
          <p className={postFlowSectionSub}>
            The photos are in the order you set on the previous step.{" "}
            <b className="font-semibold text-primary">The first one is the cover.</b>
          </p>

          <GuestEyePreview />
        </section>

        {/*
          `Who can book` — and every word of it is a readback of what step 2
          already told this host when their own typed address matched a
          cantonment. Nothing new is asserted, no document is requested here, and
          the host sets neither of these: §16.3 is explicit that hosts do not set
          document requirements and the wizard must never imply they can.

          The two host-set restrictions step 8 DOES offer (Families only, Women
          guests only) are off in this draft and are therefore absent, rather
          than rendered as a row saying "off". A guest reads the rules that
          apply.
        */}
        <section className={postFlowSection} aria-labelledby="who-h">
          <h2 id="who-h" className={postFlowSectionTitle}>
            Who can book
          </h2>
          <p className={postFlowSectionSub}>
            {L.name} sits inside a cantonment, so one of these two opens later than the other. Both
            are stated on the listing itself; neither is hidden from a guest.
          </p>

          <FactRows>
            <FactRow
              tone="done"
              icon={<CheckGlyph />}
              title="Guests travelling on a CNIC"
              detail="Bookable the moment you publish."
            />
            <FactRow
              tone="pending"
              icon={<PendingGlyph />}
              title="Guests travelling on a foreign passport"
              detail={
                <>
                  Off until your cantonment NOC is verified. Nothing is lost while it is checked —
                  the listing stays live for everyone else.{" "}
                  <Link href={CANTONMENT_NOC_HREF} className={`text-label ${inlineAction}`}>
                    {CANTONMENT_NOC_LABEL}
                  </Link>
                </>
              }
            />
          </FactRows>
        </section>

        {/*
          `Before you publish` — the gating checklist, and it gates nothing,
          because arriving here means the nine steps are answered. One row, and
          one row is the honest count: nothing else in this build can be
          incomplete at this point. A checklist padded to look like a checklist
          would be inventing conditions.
        */}
        <section className={postFlowSection} aria-labelledby="check-h">
          <h2 id="check-h" className={postFlowSectionTitle}>
            Before you publish
          </h2>

          <FactRows>
            <FactRow
              tone="done"
              icon={<CheckGlyph />}
              title={
                <>
                  All <span className="num">9</span> steps are filled in
                </>
              }
              detail={
                <>
                  You can still change any of them after publishing, and the listing stays live
                  while you do.{" "}
                  <Link
                    href="/host/listings/new/property-type"
                    className={`text-label ${inlineAction}`}
                  >
                    Go back through the steps
                  </Link>
                </>
              }
            />
          </FactRows>

          <p className={postFlowNote}>
            Publishing does not lock anything. It makes the listing findable, and it is reversible
            from <b className="font-semibold text-primary">Listings</b> at any time.
          </p>
        </section>
      </form>
    </WizardPostFlow>
  );
}
