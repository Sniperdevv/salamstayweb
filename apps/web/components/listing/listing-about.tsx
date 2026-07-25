import Link from "next/link";
import { ChevronRightIcon, InfoIcon } from "@/components/icons";
import { ShieldCheckIcon } from "@/components/home-icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { Copy, Plain, listingH3, listingLead, listingPara, listingSection } from "./shell";

/**
 * About this stay, and the host row under it.
 *
 * **Answer-first, in 54 words.** The lead names the home, the sector, the walk
 * to the masjid, the sleeping capacity, the kitchen, the alcohol policy, the
 * Qibla and the backup power — everything the query behind this page is
 * actually asking — before the reader has scrolled. Two payload phrases carry
 * 600 weight and nothing else does (§7: bold the payload word only, never a
 * sentence).
 *
 * **The host row is open, not a card.** §1's third clause: content blocks carry
 * neither border nor shadow, and a person is content. The card corpus draws a
 * bordered plate here; the plate is the difference between a page that reads as
 * a document and one that reads as a dashboard, and the restraint is most of
 * the premium read. What survives is the avatar, the name, the meta line and a
 * chevron that says the row goes somewhere.
 *
 * **The verification shield sits at 4 o'clock, with its own ring** (§10, §11.11)
 * — bottom-right of the avatar, ringed in canvas so it reads as a separate
 * object at every avatar size rather than as a hole in the photograph. It is
 * this page's ONE green mark that is not the CTA: §2 gives verification marks a
 * standing role, and "this specific person has been verified" is exactly what
 * the role is for.
 *
 * **The no-reviews note is an info strip, not a blue callout.** §6 gives
 * `bg.raised` five jobs and this is one of them; the card's semantic-info panel
 * would be a sixth surface tint on a site that has exactly one (§6's theme
 * lock). Only "New listing." is bolded — the payload, not the paragraph.
 *
 * There is no Reviews H2 anywhere on this page, and no stars, score, count or
 * AggregateRating. Zero real reviews exist. On an indexable page a rating
 * without reviews is a hard structured-data failure, not a design choice.
 */

const hostRow =
  "group -mx-2 flex items-center gap-4 rounded-lg px-2 py-3 " +
  "transition-[transform,background-color] duration-instant ease-decelerate hover:bg-raised active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export function ListingAbout({ listing }: { readonly listing: ListingContent }) {
  const { about, host } = listing;

  return (
    <section aria-labelledby="about-h" className={listingSection}>
      <h2 id="about-h" className={sectionH2}>
        {about.heading}
      </h2>

      <p className={`mt-4 ${listingLead}`}>
        <Copy {...about.lead} />
      </p>
      <p className={`mt-4 ${listingPara}`}>
        <Plain>{about.para}</Plain>
      </p>

      <h3 className={`mt-8 ${listingH3}`}>{host.heading}</h3>

      <Link href={host.href} className={`mt-3 ${hostRow} ${focusRing}`}>
        <span className="relative shrink-0">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-full bg-raised text-bodySm font-bold tracking-wide text-primary"
          >
            {host.initials}
          </span>
          {/* 4 o'clock, own ring — §11.11, at every size in the ladder. */}
          <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-canvas ring-2 ring-canvas">
            <ShieldCheckIcon className="size-4 text-interactive" />
          </span>
        </span>

        <span className="min-w-0">
          <span className="block text-bodyMd font-semibold text-primary">{host.name}</span>
          <span className="mt-0.5 block text-bodySm text-secondary">
            <Plain>{host.meta}</Plain>
          </span>
        </span>

        <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
      </Link>

      <p className="mt-4 flex max-w-[65ch] gap-3 rounded-md bg-raised px-4 py-3 text-bodySm leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-secondary" />
        <span>
          <Copy {...host.note} />
        </span>
      </p>
    </section>
  );
}

export default ListingAbout;
