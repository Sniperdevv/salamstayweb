/**
 * The furniture `/host/messages` and `/host/messages/{threadId}` share.
 *
 * Server-safe on purpose — nothing here holds state, so the thread's client
 * composer is the only component that crosses the boundary.
 *
 * Everything is `HOST-SHELL.md` §2b's app chrome vocabulary, which means the
 * two systematic changes `reservation-parts.tsx` already records apply here
 * unchanged: **no brand green added** (§7 — the app surface is already over
 * TASTE §2's four-role budget through `ha-046`'s chip, nav underline and avatar,
 * and the ruling is "Add nothing to it"), and **border or nothing, never a
 * shadow** (TASTE §1; §8 — nothing on a host surface floats over scrolled
 * content).
 */

/* ───────────────────────────── honesty ──────────────────────────────────── */

/**
 * The strip that keeps the one host thread honest.
 *
 * ═══ WHY THIS IS A SIBLING AND NOT `SampleDataStrip` ═════════════════════════
 * `../reservations/reservation-parts.tsx` ships `SampleDataStrip`, and its
 * sentence ends *"…and accepting or declining one saves nothing."* That is true
 * of a reservation and false here: there is nothing on a messages surface to
 * accept or decline, and a strip that names two actions this page does not offer
 * is a strip a host learns to stop reading.
 *
 * So this carries the **byte-identical class string** and different words —
 * exactly the move `HostSetupStrip` makes in
 * `../onboarding/host-setup.tsx`, for exactly the same reason. The recipe is one
 * recipe (TASTE §6's `bg.raised` info strip, `radius.md`, payload word bolded
 * and nothing else); the claim belongs to the surface making it.
 *
 * Not dismissible, and not styled as a warning: nothing is wrong. SalamStay
 * simply has no message store, and a host is entitled to know that before they
 * read a conversation as something a person actually sent them.
 *
 * ═══ WHAT THE THIRD CLAUSE IS DOING ═════════════════════════════════════════
 * *"It is not on your account"* is not hedging. `lib/mode.ts` fixes the signed-in
 * person as **Aqib Khan**, and `../reservations/reservations.ts` gives that
 * account two homes — Gulberg 2 Residence and Cantt View Residence. The booking
 * this conversation belongs to is Margalla View Apartment in F-7, **hosted by
 * Ayesha** (`lib/booking/trip-record.ts`). One is not the other, and
 * `lib/seo/route-registry.ts` states the standing rule against pretending
 * otherwise: writing a figure that belongs to a different fictional host would
 * "put two fictional accounts in one product … A host who noticed would be right
 * to stop trusting both screens."
 *
 * The honest reading is therefore the same one `/messages` and
 * `/messages/host-margalla-view` already ship on the guest side: **the inbox is
 * a claim about what the reader has, and stays empty; the thread is a worked
 * example, and says so.** `app/trips/page.tsx` wrote the rule — *"a sentence
 * saying 'these are examples' under a heading that says 'Your trips' is a page
 * arguing with itself."* This strip is the second half of that: a worked example
 * IS allowed to say what it is, and this is where it says it.
 *
 * ═══ THE LAST CLAUSE ════════════════════════════════════════════════════════
 * Nothing in this build names the guest on that booking. `TRIP` names the home,
 * the city and the host; `thread.ts` labels the two speakers by side; every
 * guest surface writes "You". The one name available is the account holder's,
 * and printing it here would render one person messaging himself. `/host/today`
 * already ruled on the general case when it dropped `hw-007`'s "Welcome back,
 * Aqib" — *"the name is data this build does not have"* — so the name is
 * dropped, and the drop is stated rather than left as a hole a reader has to
 * explain to themselves.
 *
 * DELETE THIS STRIP AND THE THREAD IN THE SAME COMMIT, OR NEITHER.
 */
export function ExampleThreadStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p
      className={`max-w-prose rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
    >
      <b className="font-semibold text-primary">Example data.</b> SalamStay has no message store
      yet, so the conversation below is written into the site — the host&rsquo;s side of the example
      booking the guest pages already carry. It is not on your account, nobody sent it and nobody
      read it, and nothing here names the guest, because no record does.
    </p>
  );
}

export default ExampleThreadStrip;
