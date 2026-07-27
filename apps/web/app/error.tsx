"use client";

import Link from "next/link";

import { Phrase } from "@/components/numerals";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronRightIcon,
  HelpIcon,
  InfoIcon,
  MessageIcon,
  RetryIcon,
} from "@/components/icons";
import {
  btnBase,
  btnGhost,
  btnLg,
  btnPrimary,
  focusRing,
  gutter,
  inlineAction,
} from "@/components/ui";

/**
 * GW-016 — the unhandled-error shell.
 *
 * SEO-RULES §3.11 contract: noindex, no canonical, no hreflang, no JSON-LD, no
 * breadcrumb, and a <main> that carries NO `indexable` class. The robots tag is
 * rendered inline (React hoists it into <head>) because a client error boundary
 * cannot export `metadata`.
 *
 * The honesty budget is the design. Deliberate absences, per the card: NO
 * status-page link (SalamStay ships no status page), NO estimated fix time and
 * NO SLA, NO "report this issue" button (server errors are captured
 * automatically), NO error/trace ID to quote at support.
 */

const row =
  "group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-instant ease-decelerate hover:bg-raised";

const rowIcon =
  "grid size-8 shrink-0 place-items-center rounded-md bg-raised text-secondary";

export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  // `error` is intentionally not surfaced: the card ships no error ID, no trace
  // ID and no "report this" affordance — capture is automatic on the server.
  void error;

  return (
    <main>
      <title>Something went wrong — SalamStay</title>
      <meta name="robots" content="noindex" />

      {/* HERO — the plain statement, then the retry */}
      <section className="bg-canvas">
        <div className={`mx-auto max-w-page py-12 md:py-16 ${gutter}`}>
          <p className="text-overline uppercase text-tertiary">
            {/* A17: `500` is a `.num` isolate ending the line, so under RTL it
                took the paragraph direction and the status read `500 Error`. */}
            <Phrase>
              Error <span className="num">500</span>
            </Phrase>
          </p>
          <h1 className="mt-3 max-w-[19ch] text-h2 font-semibold tracking-tighter text-primary md:text-h1 md:font-semibold">
            Something went wrong on our side
          </h1>
          <p className="mt-4 max-w-[64ch] text-bodyLg text-secondary">
            This isn&rsquo;t your connection and it isn&rsquo;t your account — a request to
            SalamStay failed.{" "}
            <strong className="font-semibold text-primary">
              The error was recorded automatically, so you don&rsquo;t need to send it to us.
            </strong>{" "}
            Trying again is usually enough.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className={`${btnBase} ${btnPrimary} ${btnLg}`}
            >
              Try again
              <RetryIcon className="size-5" />
            </button>
            <Link href="/" className={`${btnBase} ${btnGhost} ${btnLg}`}>
              Go to the SalamStay homepage
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>

          <div
            role="note"
            className="mt-7 flex max-w-[72ch] items-start gap-4 rounded-lg border border-info-border bg-info-bg p-5"
          >
            <InfoIcon className="mt-1 size-5 shrink-0 text-info" />
            <div className="flex flex-col gap-1">
              <span className="text-bodySm font-semibold text-primary">
                If this happened while you were booking
              </span>
              <span className="text-bodySm text-secondary">
                A booking exists only once you&rsquo;ve seen a confirmation with a booking
                reference on it. If you didn&rsquo;t see one, nothing was booked and nothing
                was charged. Check{" "}
                <Link
                  href="/trips"
                  className={`font-medium ${inlineAction} ${focusRing}`}
                >
                  your trips
                </Link>{" "}
                before you start again, so you don&rsquo;t end up booking twice.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN DO */}
      <section id="next" aria-labelledby="next-h" className="border-t border-hairline">
        <div className={`mx-auto max-w-page py-12 ${gutter}`}>
          <h2 id="next-h" className="text-h4 text-primary">
            What you can do now
          </h2>
          <p className="mt-2 max-w-[68ch] text-bodyMd text-secondary">
            In the order that usually works.
          </p>

          <ul className="mt-6 overflow-hidden rounded-lg border border-hairline bg-canvas">
            <li>
              <button type="button" onClick={() => reset()} className={`${row} ${focusRing}`}>
                <span className={rowIcon}>
                  <RetryIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">
                    Try the same page again
                  </span>
                  <span className="text-bodySm text-secondary">
                    This retries the request that failed, at the same address. Most one-off
                    errors clear on the second attempt.
                  </span>
                </span>
              </button>
            </li>
            <li className="border-t border-hairline">
              <Link href="/trips" className={`${row} ${focusRing}`}>
                <span className={rowIcon}>
                  <CalendarIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">
                    Check your trips
                  </span>
                  <span className="text-bodySm text-secondary">
                    See whether the booking you were making went through before you try it
                    again.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
            <li className="border-t border-hairline">
              <Link href="/help" className={`${row} ${focusRing}`}>
                <span className={rowIcon}>
                  <HelpIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">Help center</span>
                  <span className="text-bodySm text-secondary">
                    Booking, verification, payments and hosting, answered by what you&rsquo;re
                    trying to do.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
            <li className="border-t border-hairline">
              <Link href="/help/contact" className={`${row} ${focusRing}`}>
                <span className={rowIcon}>
                  <MessageIcon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-bodyMd font-semibold text-primary">
                    Contact support
                  </span>
                  <span className="text-bodySm text-secondary">
                    Write in Urdu or English, whichever you&rsquo;d rather use. A person reads
                    every ticket.
                  </span>
                </span>
                <ChevronRightIcon className="ml-auto size-5 shrink-0 text-tertiary" />
              </Link>
            </li>
          </ul>

          <p className="mt-6 max-w-[70ch] text-bodySm text-tertiary">
            We&rsquo;re not showing you a countdown or a status page, because{" "}
            <strong className="font-semibold text-secondary">
              we don&rsquo;t publish either one
            </strong>{" "}
            and we&rsquo;d rather not invent a number we can&rsquo;t hold to. If the fault is
            on our side and widespread, trying again shortly is the honest advice. If it keeps
            failing only for you, support is the faster path — and the error you hit is
            already in our logs by the time you write.
          </p>
        </div>
      </section>
    </main>
  );
}
