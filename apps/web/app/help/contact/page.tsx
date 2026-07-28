import Link from "next/link";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { FactList, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { prose, sectionGap, shell } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import { exampleStripGuest, exampleStripLead } from "@/components/ui/example-strip";
import { pageMetadata } from "@/lib/seo/metadata";
import { ContactForm } from "./contact-form";

/**
 * GA-109 — contact support, at `/help/contact`.
 *
 * This is the most-linked unbuilt help path on the site (nine hrefs from live
 * pages: every `ClosingNote` on the trust cluster, the refund policy's
 * "special circumstances" clause, the help hub). It is also the one page in the
 * help set that is a SCREEN rather than an article, which decides most of what
 * follows.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  IT IS `noindex, follow`, AND THAT IS A CONTENT DECISION, NOT A SEO ONE
 * ═══════════════════════════════════════════════════════════════════════════
 * SEO-RULES §3.10 makes the help HUB and substantive ARTICLES `index, follow`,
 * and it is silent on a support screen because §3.10 describes articles. Two
 * reasons decide it here, and both point the same way:
 *
 *  1. There is no ticket store (below). A page that ranks for "salamstay
 *     contact" and then cannot take a message is the worst possible landing —
 *     it wastes the one arrival where the reader most needed something to
 *     happen. Indexing it would be optimising for a search result we cannot
 *     honour.
 *  2. It is not an article. It has no answer-first resolution, no step list, no
 *     body a crawler could describe; it is a form and a list of routes.
 *
 * So: `noindex, follow`, no canonical, no JSON-LD, `co-main` rather than
 * `indexable` (`components/registry-stub.tsx` sets that precedent for the same
 * reason — the marker says "this is not a document"), and a VISIBLE breadcrumb
 * with no `BreadcrumbList` beside it. G40 checks the two agree only on indexable
 * pages; the trail stays because a reader who lands here from a listing needs
 * the way back to `/help`, and navigation is not a schema obligation.
 *
 * When a ticket store exists this becomes a founder call, not a rebuild: flip
 * the registry row, add the `BreadcrumbList`, and the strip below comes out.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THE PAGE IS HONEST ABOUT, AND WHERE THE HONESTY LIVES
 * ═══════════════════════════════════════════════════════════════════════════
 * Nothing on this site can receive a support message: no ticket store, no
 * transport, no inbox on the other end. That fact goes in the `exampleStrip`
 * recipe — the slot that is REMOVED when the gap closes — and not into body
 * prose, because body prose about a missing feature becomes a lie the day the
 * feature lands. The disabled Send carries the same fact a second time in its
 * `.ctanote`, where a reader who never scrolled to the strip still meets it.
 *
 * NO RESPONSE-TIME PROMISE, and no §5 claim either. `GUEST-SHELL.md` §13 makes
 * claim 8 the only permitted statement about support availability — but claim 8
 * printed directly above a Send that cannot send would read as a promise the
 * page is simultaneously withdrawing. Plain neutral description is the other
 * permitted register, and it is the right one here. `/trust-and-safety` and
 * `/help/cantonment-stays` still carry claim 8 byte-exact, where it is true of
 * the product rather than of this form.
 *
 * TASTE: zero green (the one control is disabled, and a disabled primary spends
 * nothing — `GUEST-SHELL.md` §8), zero eyebrows, zero plates under content, one
 * `bg.raised` tint doing two of its five §6 jobs (the honesty strip, and the
 * category panel that is an info strip in everything but name).
 */

const PATH = "/help/contact";

export const metadata = pageMetadata(
  PATH,
  "How to reach SalamStay support: choose what your question is about, see the help written for it, and write to a person in Urdu or English.",
);

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Contact support", path: PATH },
] as const;

export default function ContactSupportPage() {
  return (
    <>
      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="co-main">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">Contact support</h1>

          <p className={`mt-3 ${prose}`}>
            Tell us what is going on. A <strong>person reads every ticket</strong>, in Urdu or in
            English, and the reply comes back in whichever language you wrote in. Nothing here has
            to be proved, explained twice, or written formally.
          </p>

          {/* The honesty strip — the slot that gets removed. Its own sentence,
              not a sibling's: the wording differs because the gap differs
              (`components/ui/example-strip.ts`). */}
          <p className={`mt-6 ${exampleStripGuest}`}>
            <span className={exampleStripLead}>Not connected yet.</span> SalamStay has no support
            inbox on the web build, so this form cannot deliver a message and no ticket is created.
          </p>

          <ContactForm />
        </section>

        <ProseSection id="what-happens" heading="What happens to a ticket">
          <Prose>
            <p>
              Written down here because the form does not say it, and because the two facts a
              person most wants before writing to a company are{" "}
              <strong>who reads this</strong> and <strong>what they can see</strong>.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "A person reads it",
                detail:
                  "Not a model, and not a queue that closes itself. Support answers in Urdu or English, whichever you wrote in.",
              },
              {
                term: "No reply time is promised",
                detail:
                  "We do not publish one, because we would rather not state a number we cannot keep. That is a deliberate absence, not an oversight.",
              },
              {
                term: "A safety concern is not a complaint against anyone",
                detail: (
                  <>
                    Telling us something worries you is not an accusation and is never treated as
                    one. If anyone is in immediate danger, contact local emergency services first —
                    we are not an emergency service.
                  </>
                ),
              },
              {
                term: "Reporting is private",
                detail: (
                  <>
                    The person you report is never told who reported them. That is the same on{" "}
                    <Link href="/help/report" className={`${inlineAction} ${focusRing}`}>
                      the report page
                    </Link>{" "}
                    and in the app.
                  </>
                ),
              },
            ]}
          />
        </ProseSection>

        <ProseSection id="elsewhere" heading="Things that are not a support ticket" last>
          <Prose>
            <p>
              Three questions come to support that already have a page of their own, and each of
              these is faster than writing to us.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "A page on this site is wrong",
                detail: (
                  <>
                    That is a correction, and it has its own route — read{" "}
                    <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
                      how we handle corrections
                    </Link>
                    , and what we do when we get one wrong.
                  </>
                ),
              },
              {
                term: "You want to know where your money is",
                detail: (
                  <>
                    Your payment is held in trust until you check in.{" "}
                    <Link
                      href="/help/payments/how-money-is-held"
                      className={`${inlineAction} ${focusRing}`}
                    >
                      How your money is held
                    </Link>{" "}
                    walks through every step of it.
                  </>
                ),
              },
              {
                term: "A document was not accepted",
                detail: (
                  <>
                    A person reviews every document and tells you exactly what was unclear.{" "}
                    <Link href="/help/verification" className={`${inlineAction} ${focusRing}`}>
                      Verification and documents
                    </Link>{" "}
                    covers what each one is for.
                  </>
                ),
              },
            ]}
          />
        </ProseSection>
      </main>
    </>
  );
}
