"use client";

import Link from "next/link";
import { useId, useState, type DragEvent as ReactDragEvent, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { AlertCircleIcon, ChevronLeftIcon } from "@/components/icons";
import { CheckMark } from "@/components/ui/marks";
import {
  btnPrimaryPillInert,
  controlRing,
  focusRing,
  inlineAction,
  tintTransition,
} from "@/components/ui";

/**
 * `/host/verify/tourism-licence`, everything from the first section down —
 * HA-010 translated to the web shell, with HA-011 reduced to the strip above and
 * HA-009's register restated for a document rather than a photograph.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE ANATOMY IS `../cnic/cnic-check.tsx`'s, NOT A SECOND ONE
 * ═══════════════════════════════════════════════════════════════════════════
 * A `radius.md` `border.default` drop zone wrapping a real `<input type="file">`
 * inside a `<label>` — the shape that makes click, keyboard and drag reach one
 * control — the same accepted set, the same two-part test, the same chosen-file
 * plate, the same error register, and the same closing action row. Two document
 * checks one directory apart must not ship two idioms for one job.
 *
 * WHAT IS DELIBERATELY LIGHTER THAN THE CNIC PAGE, AND WHY:
 *
 *  · **No camera secondary.** `ha-007` makes a live capture the primary path for
 *    a card the host photographs *now*, and the CNIC page carries `capture` for
 *    it. A licence is a document already issued to the host — it arrives as a
 *    file or as a piece of paper that has been photographed at some point — so a
 *    second control gated on the device would be an affordance for a case the
 *    file picker already covers. The note under the drop zone says so, because a
 *    host who saw a camera button next door and none here would otherwise assume
 *    something is missing.
 *  · **No photographic guidance list.** `ha-009`'s three fix lists are facts
 *    about photographing a plastic card under a lamp. They are already on the
 *    CNIC page, where the host is holding a card; repeating them here would be
 *    one sentence about glare doing duty on a page about a certificate.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CONTROL CANNOT SEND, SO IT SAYS WHAT IT DOES INSTEAD
 * ═══════════════════════════════════════════════════════════════════════════
 * There is no upload endpoint, no document store and nothing that reads a
 * licence. An upload control that accepts a file and drops it is worse than a
 * disabled one, because a host would believe their licence had been filed — and
 * a host who believes they are licensed with the platform behaves differently
 * from one who knows they are not.
 *
 * So the control's honest job is named and is the whole of what it does: it
 * **checks the format** of a file the host picks, and stops. That is a real
 * service and it is entirely decidable in the browser, which is why it is the
 * one verdict this screen is allowed to reach. The file is never read, never
 * copied into memory, never rendered as a preview and never sent: `file.name`
 * and `file.type` are the only two things touched, and the copy says so where
 * the host is standing.
 *
 * `aria-disabled`, NOT `disabled`, ON THE SEND — the shipped idiom, and a
 * correction to the sibling
 * ---------------------------------------------------------------------------
 * `../../messages/[threadId]/composer.tsx`, `../../reservations/[id]/detail.tsx`
 * and `../../help/contact/contact-form.tsx` all reach for `aria-disabled` on a
 * control that cannot act, for one stated reason: a `disabled` button leaves the
 * tab order, so a keyboard or screen-reader user reaches the field, finds no way
 * forward, and is never told why — the explanation becomes a paragraph they
 * would have to go hunting for. `aria-disabled` keeps the control focusable,
 * announces it as dimmed, and `aria-describedby` reads the reason out at the
 * moment it matters. **There is no `onClick`**: the button is inert by
 * construction rather than by an early return somebody could delete.
 *
 * `../cnic/cnic-check.tsx` uses a real `disabled` and argues the opposite — that
 * a control which can *never* enable should not hold focus. Three of the four
 * shipped surfaces disagree with it, and the a11y argument is one-way: the
 * reason is exactly what a keyboard user cannot otherwise find. This page takes
 * the majority idiom and the divergence is reported for one central ruling
 * rather than resolved by whoever touched a file last. `cnic` is not edited
 * here — a behaviour change to a shipped verification control is not a tidy-up.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  GREEN, ELEVATION, MOTION
 * ═══════════════════════════════════════════════════════════════════════════
 * **No green.** `HOST-SHELL.md` §7 — the host app surface is already over TASTE
 * §2's four-role budget through `ha-046`'s inherited chip, nav underline and
 * avatar, and the instruction is "Add nothing to it." The chosen-file mark is
 * INK plus a check glyph plus the word, never a green tick: a success colour
 * here would read as "verified" on the one page where that word means something
 * specific. `ha-010`'s green `Save license` is the disabled pill, which spends
 * nothing.
 *
 * **Elevation**: the drop zone and the chosen-file plate carry a border or a
 * `bg.raised` fill and cast nothing — a drop target is a form boundary, not a
 * float (TASTE §1), and `HOST-SHELL.md` §8 is explicit that there is no
 * border-and-shadow element on a host surface. The prose sections carry neither:
 * a block of statements is a glyph, a line and air, divided by one hairline per
 * gap rather than plated.
 *
 * **Motion**: whatever `tintTransition` already carries on the drop zone's
 * border, and nothing added. §10 bans an entrance animation on a surface the
 * host will revisit, and a host who has to fetch a certificate from a drawer
 * will revisit this one.
 */

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Two marks drawn here rather than imported, for the reason `../page.tsx`,
 * `../cnic/cnic-check.tsx` and `components/host/photo-upload.tsx` all record:
 * the three shared glyph modules are each a closed set with a stated scope, and
 * a mark used on one surface belongs on that surface until a second one needs
 * it. Both sit inside a labelled control, so both are `aria-hidden`, and the
 * stroke comes from `iconStroke` rather than a literal.
 */

type GlyphProps = { readonly className?: string };

function Glyph({ className, children }: GlyphProps & { readonly children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** A file lifting out of a tray. */
function UploadIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Glyph>
  );
}

/** A page with a corner turned. The chosen file, not the document on it. */
function AttachedFileIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Glyph>
  );
}

/* ───────────────────── what a browser will accept ───────────────────────── */

/**
 * Types AND extension, byte-for-byte `../cnic/cnic-check.tsx`'s test and the
 * guest verify step's before it, for the stated reason: `file.type` is empty on
 * more Android pickers than anyone expects, and a `.pdf` with no reported type
 * is still a PDF. A `.docx` fails both, which is the case the error register
 * exists for. `ACCEPT` and the sentence under the drop zone are one decision
 * written twice, so they sit adjacent and cannot drift.
 *
 * No file-size cap — BUILD-DECISIONS #11: no card carries one, and a megabyte
 * figure would be a product decision dressed as a design detail.
 */
const ACCEPT = "image/jpeg,image/png,application/pdf";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_EXTENSION = /\.(jpe?g|png|pdf)$/i;

function isSupported(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSION.test(file.name);
}

/* ───────────────────────────── recipes ──────────────────────────────────── */

/** `hw-001`'s `.fsec` — a hairline rule with `space-7` above and below it. */
const section = "mt-7 border-t border-hairline pt-7";
const sectionHeading = "text-h5 font-semibold text-primary";
const sectionBody = "mt-3 text-bodySm font-regular leading-relaxed text-secondary";
/** The `label`-rung note under a control. */
const slotNote = "mt-3 max-w-[62ch] text-label font-regular leading-relaxed text-secondary";

/**
 * The disabled send.
 *
 * ═══ DUPLICATION, DECLARED ═══════════════════════════════════════════════════
 * This is the FOURTH copy of one class string — `composer.tsx` (host),
 * `messages/[threadId]/composer.tsx` (guest), `help/contact/contact-form.tsx`
 * and now this. It belongs in `components/ui.ts` beside `btnPrimaryPill` as
 * `btnPrimaryPillInert`, and every one of those files has said so. Not made
 * here: `components/ui.ts` is outside this pass's folder and other authors are
 * in the tree this wave.
 *
 * Spelled out rather than composed, for the reason `components/ui.ts` records
 * against `btnSecondaryMd`: Tailwind emits utilities in token order, so
 * appending `bg-raised` to a string that already carries `bg-interactive` is
 * decided by the stylesheet and not by the order written here. A state is a
 * whole recipe.
 *
 * `focusRing` and NOT `pressable`. The control is focusable on purpose — that is
 * the whole point of `aria-disabled` over `disabled` — so it must show where
 * focus is. It is not pressable, and a control that cannot be pressed does not
 * answer a press: that absence IS the signal (TASTE §1, where the press, like
 * the shadow, is the enabled signal).
 *
 * The border is `border.default` and not transparent. `checkout-step.tsx`
 * measured the reason and both message composers carry it: `bg.raised` against
 * `bg.canvas` is 1.06:1 in light and 1.08:1 in dark, so a transparent-edged
 * disabled pill is dim text floating with no shape at all. TASTE §11.7 and §1
 * both require a disabled control to stay VISIBLE and in place.
 */
const sendDisabled = btnPrimaryPillInert;

/**
 * The four things `COMPLIANCE_MAP.md` §11.5.4 records as the capture — licence
 * number, issuing authority, province, expiry — and `/host/verify`'s row already
 * names three of them in one sentence. Four, and never a fifth: the point of
 * naming them is that the list is short and closed, exactly as
 * `../cnic/cnic-check.tsx` names the three fields its check matches.
 *
 * Conditional tense throughout, because none of it is held. No values: a licence
 * number, an authority and a date rendered as examples would be an invented
 * document, and `ha-010` ships all three (`TL-2026-04821`, `Provincial tourism
 * authority — Punjab`, `14 Nov 2026`).
 *
 * No digits anywhere on this page, which is why no `Phrase` wrapper appears
 * below (GO-LIVE A17 asks for the isolate on any SENTENCE carrying a digit run;
 * there is none to isolate).
 */
const WOULD_RECORD: readonly { readonly field: string; readonly what: string }[] = [
  { field: "Licence number", what: "As printed on the licence itself" },
  { field: "Issuing authority", what: "The tourism authority that granted it" },
  { field: "Province", what: "Where the home is, which is what decides the authority" },
  { field: "Expiry date", what: "The date printed on the licence" },
];

export function LicenceCheck() {
  /**
   * The file name, and a rejected file name. Nothing else is held, because
   * nothing else is looked at: the `File` object itself is never stored, never
   * read and never turned into an object URL, so there is no preview to remember
   * and no bytes in memory to leak into a re-render.
   */
  const [fileName, setFileName] = useState<string | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [filesOver, setFilesOver] = useState(false);

  const baseId = useId();
  const errorId = `${baseId}-format-error`;
  const sendReasonId = `${baseId}-send-reason`;

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file === undefined) return;

    if (!isSupported(file)) {
      setRejected(file.name);
      return;
    }
    setRejected(null);
    setFileName(file.name);
  };

  const isFileDrag = (event: ReactDragEvent): boolean =>
    Array.from(event.dataTransfer.types).includes("Files");

  /**
   * `preventDefault` on `dragover` is not decoration: without it the browser's
   * default is to NAVIGATE to the dropped file, which is a host losing the page
   * because they missed a small input. Copied deliberately from the sibling
   * check and the wizard's photo grid, which both say the same thing.
   */
  const fileDrop = {
    onDragOver: (event: ReactDragEvent<HTMLElement>) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setFilesOver(true);
    },
    onDragLeave: (event: ReactDragEvent<HTMLElement>) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      setFilesOver(false);
    },
    onDrop: (event: ReactDragEvent<HTMLElement>) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      setFilesOver(false);
      onFiles(event.dataTransfer.files);
    },
  };

  return (
    <form
      /*
       * A real `<form>`, because the fields inside it are a real form and the
       * shape the eventual mutation takes should not have to be invented later.
       * It submits nowhere: there is no submit control at all — the send is a
       * `type="button"` with `aria-disabled` — and `onSubmit` is stopped anyway
       * so a stray Enter cannot navigate.
       */
      onSubmit={(event) => event.preventDefault()}
    >
      {/* ─────────────────── what the licence is ─────────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-what-h`}>
        <h2 id={`${baseId}-what-h`} className={sectionHeading}>
          What the licence is
        </h2>
        <p className={sectionBody}>
          Short-stay accommodation is licensed at the province level. A host letting a home for
          short stays holds a licence from the tourism authority of the province the home is in, and
          Gilgit-Baltistan and Azad Jammu and Kashmir each have their own tourism board. It is
          permission to operate a home for short stays, and it attaches to the property as much as
          to the person operating it.
        </p>
        {/*
          The refusal, said out loud in the body rather than only in a comment —
          the same call `/host/help/regulations/cantonment-noc` makes with
          "Nothing on this site decides that about any address." A host planning
          an application needs to know which questions this page is deliberately
          not answering, or they will read the silence as "there is nothing more
          to it".
        */}
        <p className={sectionBody}>
          Which authority issues yours depends on where the home is, and{" "}
          <b className="font-semibold text-primary">this page does not name it for you</b>. What
          that authority asks an applicant to bring, what it charges and how long it takes are
          questions for it rather than for SalamStay, and nothing on this site answers them.
        </p>
      </section>

      {/* ─────────────────── what would be recorded ──────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-record-h`}>
        <h2 id={`${baseId}-record-h`} className={sectionHeading}>
          What SalamStay would record
        </h2>
        {/*
          The second clause explains the absence of the form `ha-010` draws.
          A host arriving from that world would notice four named fields and no
          inputs, and read the gap as a bug rather than as the point.
        */}
        <p className={sectionBody}>
          Four things, when there is somewhere to keep them. None of them is held today, and there
          is no field on this page to type one into.
        </p>

        {/*
          The same three-cell anatomy `../cnic/cnic-check.tsx`,
          `/account/verification` and the checkout's consent section all render:
          a hairline between rows and no container at all. TASTE §1 puts a block
          of statements in the "carries NEITHER" column, and a rule between two
          data rows is a separator, not a box.
        */}
        <dl className="mt-5 max-w-[62ch]">
          {WOULD_RECORD.map((row) => (
            <div
              key={row.field}
              className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0"
            >
              <dt className="w-36 flex-none text-bodySm font-medium text-primary">{row.field}</dt>
              <dd className="min-w-0 flex-1 text-bodySm text-secondary">{row.what}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─────────────────── the document ────────────────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-copy-h`}>
        <h2 id={`${baseId}-copy-h`} className={sectionHeading}>
          A copy of your licence
        </h2>
        <p className={sectionBody}>
          Choosing a file here checks that its format would be accepted, and stops there. The
          document itself is never opened, copied or uploaded: only its file name and its format are
          looked at, and nothing leaves this tab.
        </p>

        <div className="mt-5 max-w-overlay-dialogMd">
          {fileName === null ? (
            /*
              A real `<input type="file">` inside a `<label>` — the anatomy that
              makes click, keyboard and drag all reach one control, and the
              shipped shape on `../cnic/cnic-check.tsx`,
              `app/book/[slug]/verify/step.tsx` and
              `components/host/photo-upload.tsx`. Border, no shadow: a drop
              target is a form boundary, not a float (TASTE §1).
            */
            <label
              {...fileDrop}
              className={`relative flex cursor-pointer items-center gap-4 rounded-md border p-4 ${
                filesOver ? "border-border-strong" : "border-border-default hover:border-border-strong"
              } ${rejected === null ? "" : "border-error"} ${tintTransition}`}
            >
              <input
                type="file"
                className="peer sr-only"
                name="tourism-licence"
                accept={ACCEPT}
                aria-describedby={rejected === null ? undefined : errorId}
                onChange={(event) => onFiles(event.target.files)}
              />
              <span aria-hidden="true" className={`${controlRing} rounded-md`} />
              <span className="grid size-10 flex-none place-items-center rounded-full bg-raised text-secondary">
                <UploadIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-bodySm font-medium text-primary underline underline-offset-4">
                  Choose a file, or drag one here
                </b>
                <span className="mt-0.5 block text-label font-regular text-secondary">
                  JPG, PNG or PDF
                </span>
              </span>
            </label>
          ) : (
            /*
              The chosen state. INK plus a check glyph plus the word, never a
              green tick — a success colour here would be an extra green on a
              surface TASTE §2 already has over budget, and it would read as
              "verified" on the one page where that word means something
              specific.

              The second line is the whole truth about what happened, and it is
              deliberately NOT the guest step's "Attached. It is sent when you
              continue." Nothing is sent, ever.
            */
            <div className="rounded-md bg-raised p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-md border border-hairline bg-canvas text-secondary">
                  <AttachedFileIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  {/* A file name is a Latin run, not a digit run — `<bdi>` is the
                      isolate that keeps it readable inside an RTL paragraph. */}
                  <bdi className="block truncate text-bodySm font-medium text-primary">
                    {fileName}
                  </bdi>
                  <span className="mt-0.5 flex items-center gap-1.5 text-label font-regular text-secondary">
                    <CheckMark className="size-3.5 flex-none text-primary" />
                    That format would be accepted. Nothing has been sent.
                  </span>
                </span>
                <label className="relative flex-none cursor-pointer rounded-sm text-bodySm font-medium text-primary underline underline-offset-4">
                  <input
                    type="file"
                    className="peer sr-only"
                    name="tourism-licence"
                    accept={ACCEPT}
                    onChange={(event) => onFiles(event.target.files)}
                  />
                  <span aria-hidden="true" className={`${controlRing} rounded-sm`} />
                  Choose another
                </label>
              </div>
            </div>
          )}

          {/*
            The ERROR register, and the only verdict this screen is allowed to
            reach — an unsupported format is a fact about a FILE
            (BUILD-DECISIONS #11). The red is about the file and nothing else;
            there is never a red mark on a document about a person or on the
            person (`DESIGN.md` §0.2). Colour is never the only signal, so the
            glyph and the bolded payload carry it in monochrome, and the sentence
            names the fix rather than the fault.
          */}
          {rejected === null ? null : (
            <p
              id={errorId}
              role="alert"
              className="mt-3 flex max-w-[62ch] items-start gap-2 text-label font-regular leading-relaxed text-error"
            >
              <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
              <span>
                <b className="font-semibold">
                  <bdi>{rejected}</bdi> cannot be read.
                </b>{" "}
                Save it as a JPG, PNG or PDF, or photograph the printed licence instead.
              </span>
            </p>
          )}

          {/*
            Why there is no camera button here when the CNIC check next door has
            one. A control present on one surface and absent on its sibling must
            explain itself, or a host assumes something broke.
          */}
          <p className={slotNote}>
            There is no separate camera button on this page, because a licence is a document you
            already hold rather than one you take now. A photograph of the printed certificate is
            read in exactly the same way as a scan — choose it the same way you would any other
            file.
          </p>
        </div>
      </section>

      {/* ─────────────────── if a copy cannot be used ────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-retake-h`}>
        <h2 id={`${baseId}-retake-h`} className={sectionHeading}>
          If a copy cannot be used
        </h2>
        {/*
          `ha-009`'s register, stated as the commitment it is rather than
          performed as a verdict nobody reached — and about a DOCUMENT rather
          than about a photograph of a card, which is where it differs from the
          sibling's version of this section rather than repeating it. Every
          clause is checkable against that card: a reason about the document, a
          next step, no "Failed", no "Denied", no judgement about the person.
        */}
        <p className={sectionBody}>
          If a copy ever needs sending again, the message will name one thing about the{" "}
          <b className="font-semibold text-primary">document</b> — that a line could not be read,
          that a page was missing, that the scan came out too dark to make out — and it will say
          what to do about it. It will not say &ldquo;failed&rdquo;, &ldquo;rejected&rdquo; or
          &ldquo;denied&rdquo;, and it will not say anything about you, your licence or your
          hosting.
        </p>
        <p className={sectionBody}>
          Nothing on this page has been through a review, because nothing has been sent to one. No
          document has been read, and no result is being held back.
        </p>
      </section>

      {/* ─────────────────── actions ─────────────────────────────────────── */}
      <div className={section}>
        {/*
          `HOST-SHELL.md` §4's row, minus the sticky bar this page does not have:
          Back on the leading edge, the send on the trailing edge, and
          `justify-between` mirrors under RTL for free.

          BACK IS AN INLINE TEXT ACTION, NOT THE §5 GRAY-FILL BUTTON, and the
          reason is the collision `payout-form.tsx` records and the CNIC check
          repeats: §5 puts the gray-fill secondary on `bg.raised`, and §5 also
          puts a disabled primary on `bg.raised`, so drawn as buttons the pair
          reads as two disabled controls differing only in radius. §4's own
          answer removes the collision instead of inventing a third fill.

          It points at `/host/verify` — §15's "the last state that still exists",
          and the page whose tourism-licence row opened this one.
        */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/host/verify"
            className={`inline-flex items-center gap-1 ${inlineAction} text-bodySm`}
          >
            <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
            Back to your verification
          </Link>

          <button
            type="button"
            aria-disabled="true"
            aria-describedby={sendReasonId}
            className={sendDisabled}
          >
            Send your licence
          </button>
        </div>

        {/*
          `HOST-SHELL.md` §3's fixed `.capnote` slot, in prose: this is how a
          disabled control explains itself here, and §12 requires that every one
          does. `text.secondary` and not tertiary — GO-LIVE C7 has the tertiary
          ramp under AA review at body sizes, and this is a sentence the host is
          expected to read.

          It names the next real thing rather than ending — §12's "never a dead
          end". `/host/help` is a built page and its whole job is listing what
          this site can and cannot answer, which is the honest onward step from a
          control that cannot act. Deliberately NOT `/host/help/contact`: that
          form cannot send either, and one dead end should not hand off to
          another.
        */}
        <p
          id={sendReasonId}
          className="mt-3 text-bodySm font-regular leading-relaxed text-secondary"
        >
          Disabled because there is nowhere to send it. SalamStay has no document store and nothing
          that reads a licence, so this page cannot start a check.{" "}
          <Link href="/host/help" className={inlineAction}>
            What else this site can answer for hosts
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LicenceCheck;
