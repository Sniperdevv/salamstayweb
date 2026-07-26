import type { Metadata } from "next";
import Link from "next/link";

import { HomeIcon } from "@/components/icons";
import { HostEmpty } from "@/components/host/host-empty";
import { CREATE_LISTING_HREF } from "@/components/host/host-nav";
import { hostPrimaryPill } from "@/components/host/host-ui";

/**
 * `/host/listings` — `hw-001-host-shell.html` panel D's frame, in the state
 * `ha-035` panel E draws: nothing listed yet.
 *
 * THE SEAM, AND WHY IT IS NOT DRAWN YET
 * -------------------------------------
 * `HOST-SHELL.md` §2c makes this page the seam between the two chromes: a draft
 * row here carries the wizard's own nine-bar progress component at row scale
 * (`.minibars`, 3px tall, 2px gaps, 132px wide) beside a `Draft` chip, the
 * `Step N of 9 · {name}` sentence and `Continue setup`. "One object, two
 * surfaces. Do not draw a second progress rendering for the listings page."
 *
 * None of it appears here, because there is no listing to hang it on. That is
 * also the honest outcome for the one piece of geometry the corpus has not
 * tokenised: `components/host/wizard-progress.tsx` closes by refusing to ship
 * `.minibars` at all, because 3px, 2px and 132px are three values the spacing
 * scale cannot spell, and a component whose entire job is to look identical in
 * two places cannot be built out of three silent roundings. When a draft row
 * exists to need it, it belongs in that file as a variant of
 * `WizardProgressTrack` — never as a second component here, and never with a
 * raw px. The state this page ships needs neither, so nothing was invented to
 * fill a row that has no data.
 *
 * WHAT ELSE PANEL D CARRIES AND THIS DOES NOT
 * -------------------------------------------
 *  · **No listing rows.** Panel D's two rows are `hw-001`'s worked case — a
 *    live Gulberg 2 Residence at PKR 12,500 a night and a Cantt View Residence
 *    draft. A card may carry a worked case; a live page rendering another
 *    person's homes as though they were the reader's would be inventing the
 *    reader's own data.
 *  · **No `Archived listings` link.** Panel D's `.sechead` carries it. A host
 *    with no listings has no archived ones either, and a link to a second empty
 *    is not a next step.
 *  · **No rating, no review count** — `ha-046`'s `4.9 · 128 reviews` is an
 *    invented rating and is copied nowhere.
 *
 * ONE `<h1>`: "Your listings", the page's accessible title. Panel D draws it as
 * the `.sechead`'s 22/600 heading; TASTE §7 maps "sections ≈ 22" to the `h5`
 * rung, which is what it takes here — the nav's current tab already states
 * where the host is, so this heading names the region rather than shouting a
 * page title at a surface that has one. `noindex, follow` is inherited from
 * `app/host/layout.tsx`.
 */
export const metadata: Metadata = {
  title: { absolute: "Your listings — SalamStay hosting" },
};

export default function HostListingsPage() {
  return (
    <>
      <h1 className="mb-4 text-h5 font-semibold text-primary">Your listings</h1>

      <HostEmpty
        glyph={<HomeIcon className="size-6" />}
        title="No listings yet"
        /*
         * `ha-035` panel E's sentence, unchanged. The second half is the one
         * genuinely reassuring fact about the form, and it is the same promise
         * the wizard's action bar makes in `.capnote` ("Your progress saves as
         * you go") — one product saying one thing in two places, which is the
         * only way a host believes it.
         */
        body="Your homes will appear here once you publish one. The listing form saves as you go, so you can stop and come back."
        actions={
          /*
           * The surface's one primary, which is why the nav's `Create a listing`
           * yields to ink-outline on this route too (`host-nav.tsx`). It comes
           * back to green here the day this page has rows: `hw-001` panel D's
           * row actions are `Edit listing` and `Continue setup`, both §5
           * gray-fill, so the body spends no green and the chrome takes it back.
           */
          <Link href={CREATE_LISTING_HREF} className={hostPrimaryPill}>
            Create a listing
          </Link>
        }
      />
    </>
  );
}
