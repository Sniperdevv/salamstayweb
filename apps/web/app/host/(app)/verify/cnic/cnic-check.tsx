"use client";

import Link from "next/link";
import { useId, useState, type DragEvent as ReactDragEvent, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { AlertCircleIcon, ChevronLeftIcon, InfoIcon } from "@/components/icons";
import { Phrase } from "@/components/numerals";
import { CheckMark } from "@/components/ui/marks";
import { btnSecondary, controlRing, inlineAction, tintTransition } from "@/components/ui";

/**
 * `/host/verify/cnic`, everything from the first section down — HA-007
 * translated to the web shell, carrying HA-009's rejection register.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  A DOCUMENT UPLOAD ON THE WEB IS NOT A PHONE CAMERA
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-007` makes the camera the primary path and hangs a framing guide, a
 * lighting hint and a "Looks clear" pre-flight check off it. The web owns none
 * of that pipeline, and `capture="environment"` on a desktop either does nothing
 * or opens a webcam pointed at the wrong thing. `app/book/[slug]/verify/step.tsx`
 * settled this for the guest side already: **file upload is the primary and
 * committed path**, one `radius.md` `border.default` drop zone wrapping a real
 * `<input type="file">` inside a `<label>` — which is what makes click, keyboard
 * and drag reach the same control — with the camera offered beside it as the §5
 * gray-fill secondary and a sentence saying when it appears. The register is
 * matched rather than re-derived, down to the accepted formats and the deliberate
 * absence of a file-size cap (BUILD-DECISIONS #11: no card carries one, and
 * "10 MB" would be a product decision dressed as a design detail).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CONTROL CANNOT UPLOAD, SO IT SAYS WHAT IT DOES INSTEAD
 * ═══════════════════════════════════════════════════════════════════════════
 * There is no upload endpoint, no document store and no NADRA connection. Two
 * shipped precedents govern a control that cannot act, and this screen takes
 * something from each:
 *
 *  · **The host messages composer** (`../../messages/[threadId]/composer.tsx`)
 *    keeps its field live and disables the control that would transmit, with the
 *    reason in a fixed slot beside it: *"Sending is not connected yet, so nothing
 *    you write here leaves this page."* The submit below is that button.
 *  · **The guest verify step** keeps a real file input and states, per slot,
 *    exactly what happens to a chosen file.
 *
 * What this page will NOT borrow is the guest step's *"Attached. It is sent when
 * you continue."* That sentence is load-bearing on a checkout that at least
 * intends to send; here nothing sends, ever, and a CNIC is the one document
 * where "it is sent when you continue" would be the most expensive sentence on
 * the site to get wrong.
 *
 * So the control's honest job is named and is the whole of what it does: it
 * **checks the format** of a file the host picks and stops. That is a real
 * service — an unsupported format is a common reason a document has to be
 * picked twice — and it is entirely decidable in the browser, which is
 * why it is the one verdict this screen is allowed to reach. The file is never
 * read, never copied into memory, never rendered as a preview and never sent:
 * `file.name` and `file.type` are the only two things touched, and the copy says
 * so where the host is standing.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHERE HA-009 SHIPS, AND WHY NOT AS A SCREEN
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-009` defines the rejection register for the whole host side: a fixable
 * reason stated about the DOCUMENT, never a verdict on the person; an
 * equal-weight retry; and never "Failed", "Denied" or a red mark
 * (`DESIGN.md` §0.2, §10.6). Its three worked reasons are a blurry photo, a
 * cut-off card edge and a name that reads differently from the account.
 *
 * A rejection SCREEN cannot ship, and the guest twin already ruled why:
 * `/account/verification` lists *"Couldn't read the last photo — a rejection
 * reason, from a review nobody has built"* among the things it refuses. A
 * screen that reported a re-take request would be reporting a review that never
 * happened, on the one surface where an invented verdict does the most damage.
 *
 * So the register ships in the three places it is true:
 *
 *  1. **As guidance, before the photo is taken.** `ha-009`'s three fix lists are
 *     the same three facts about a photograph whether they arrive before or
 *     after a review, and before is when they are useful and cost nothing. The
 *     "Getting one clear photo" list below is `ha-009`'s panels A and B, moved
 *     to the front of the flow.
 *  2. **As the ERROR register on a real, local verdict.** An unsupported format
 *     is a fact about a FILE (BUILD-DECISIONS #11), the sentence names the file
 *     and the fix, and the register is red because the red is about the file and
 *     nothing else. There is never a red mark on the card, on the photo or on
 *     the person.
 *  3. **As a stated promise about how a re-take will be worded**, in the closing
 *     section. It is conditional, it invents no reason, and it commits the
 *     product in writing to the one thing `ha-009` exists to protect.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ha-007` AND `ha-018` SHIP HERE THAT CANNOT
 * ═══════════════════════════════════════════════════════════════════════════
 *  · **The live camera surface, the framing guide and "Lighting looks good — hold
 *    steady".** A pre-flight verdict from a pipeline that does not exist.
 *  · **"Looks clear — the text is readable and the whole card is in frame".**
 *    Nothing here inspects an image. The guest step refused the same sentence.
 *  · **The submitted → in review → verified track**, its "Today, 3:40 PM"
 *    timestamp, its "reviewed by a person, not automatically" chip and its
 *    "usually within a few hours". A review, a queue and a turnaround, none of
 *    which exists. The brief that commissioned this page names each by name.
 *  · **The approved state**, its shield, and the HA-004 checklist row flipping to
 *    `Done`. Nothing can complete here, so nothing flips; `/host/onboarding`
 *    draws no `done` state at all and this page cannot hand it one.
 *  · **A NADRA reference number, a Verisys transaction id, a confidence score, a
 *    queue position, a verification date, an expiry date.** None exists.
 *  · **The rendered ID card.** `ha-007`'s review panel draws a neutral CSS
 *    placeholder with a masked identity number. A mask is not a redaction of
 *    real data when there is no real datum behind it — it is an invented
 *    document, and the dots make it read as more credible rather than less. The
 *    same rule `/host/payout-settings` applies to a masked account number
 *    applies harder to a masked CNIC.
 *  · **A consent checkbox.** `ha-007` is reached after the `ha-005` NADRA
 *    consent sheet, which has no route on this site. It is not reproduced here,
 *    and it is not because consent is unimportant: there is nothing to consent
 *    TO. No details leave this page, so a tick would gate a transmission that
 *    never happens, and the consent record it implied would not be stored
 *    either. What the check WILL cover is stated instead, in the same three-cell
 *    anatomy `/account/verification` and the guest step both render, so the host
 *    reads the scope without being asked to authorise a nullity.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  GREEN, ELEVATION, MOTION
 * ═══════════════════════════════════════════════════════════════════════════
 * **No green.** `HOST-SHELL.md` §7: the host app surface is already over TASTE
 * §2's four-role budget through `ha-046`'s inherited chip, nav underline and
 * avatar, and the instruction is "Add nothing to it." The nav's own
 * `Create a listing` keeps the surface's one green; the disabled primary here
 * spends nothing, and §7 says so in those words. The chosen-file mark is INK
 * plus a check glyph plus the word, never a green tick — the same call the guest
 * step makes, for the same reason.
 *
 * **Elevation**: the drop zone and the chosen-file plate carry a border or a
 * `bg.raised` fill and cast nothing (TASTE §1 — a drop target is a form
 * boundary, not a float; `HOST-SHELL.md` §8 — there is no border-and-shadow
 * element on a host surface). The prose sections carry neither.
 *
 * **Motion**: whatever `btnSecondary` and `tintTransition` already carry, and
 * nothing added. §10 bans an entrance animation on a surface the host will
 * revisit, and a host who has to fetch their card from another room will
 * revisit this one.
 */

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Three marks drawn here rather than imported, for the reason
 * `/host/onboarding`, `/host/insights` and `components/host/photo-upload.tsx`
 * all record: the three shared glyph modules are each a closed set with a stated
 * scope, and a mark used on one surface belongs on that surface until a second
 * one needs it. `components/booking/verification-copy.tsx` carries near-twins,
 * and it is the checkout's set — a host surface reaching into it would make the
 * booking module chrome-shared by accident.
 *
 * All three are decorative — each sits inside a labelled control — so all carry
 * `aria-hidden`, and the stroke comes from `iconStroke`, never a literal.
 */

type GlyphProps = { readonly className?: string; readonly stroke?: number };

function Glyph({
  className,
  stroke = iconStroke.thin,
  children,
}: GlyphProps & { readonly children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
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

/** A camera body. Says "take a photo" without naming a device. */
function CameraIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.4" />
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

/** A sun. Even light, and the glare that comes from the wrong kind of it. */
function LightIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </Glyph>
  );
}

/** Four corner brackets. `ha-007`'s framing guide, as a mark. */
function FrameCornersIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
    </Glyph>
  );
}

/* ───────────────────── what a browser will accept ───────────────────────── */

/**
 * Types AND extension, byte-for-byte the guest verify step's test and for its
 * stated reason: `file.type` is empty on more Android pickers than anyone
 * expects, and a `.pdf` with no reported type is still a PDF. A `.docx` fails
 * both, which is the case the error register exists for.
 *
 * `ACCEPT` and the sentence under the drop zone are one decision written twice,
 * so they sit adjacent and cannot drift. PDF is in the set because the shipped
 * CNIC slot on `app/book/[slug]/verify/step.tsx` accepts it and a scanned card
 * is a PDF more often than it is a JPG; `ha-007` says "JPG or PNG" for a phone
 * camera, which is a narrower control than a file picker on a laptop.
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
/** The `label`-rung note under a control. Its inline action is a plain link. */
const slotNote = "mt-3 max-w-[62ch] text-label font-regular leading-relaxed text-secondary";

/**
 * The disabled primary — `HOST-SHELL.md` §5: "Disabled = `bg.raised` fill +
 * `text.disabled`, **same size, same place, same label**", on §5's `radius.full`
 * and TASTE §11.7's "visible, in place, shadow-less".
 *
 * ═══ DUPLICATION, DECLARED ═══════════════════════════════════════════════════
 * `app/host/(app)/payout-settings/payout-form.tsx` holds a byte-identical
 * `savePillDisabled` and does not export it. It is one control in one state on
 * the two surfaces the host-setup checklist opens, and it belongs in
 * `components/ui.ts` beside `btnPrimaryPill` — the same fold-up the two message
 * composers already flag for their own copy of it. Not made here:
 * `components/ui.ts` is outside this pass's folder and other authors are in the
 * tree.
 *
 * Spelled out rather than composed, for the reason `components/ui.ts` records
 * against `btnSecondaryMd`: Tailwind emits utilities in token order, so
 * appending `bg-raised` to a string that already carries `bg-interactive` is
 * decided by the stylesheet and not by the order written here. A state is a
 * whole recipe.
 *
 * No `pressable` and no `focusRing`: a genuinely `disabled` button never presses
 * and never takes focus, so both would be dead classes rather than restraint.
 * And it IS a real `disabled` rather than `aria-disabled` — `payout-form.tsx`
 * draws the distinction and it holds here: a button that will enable once the
 * host finishes something takes `aria-disabled` so it can explain itself on
 * focus, and this one can never enable, so keeping it focusable would put a
 * keyboard user on a control that answers nothing. The reason sits directly
 * beneath it in the reading order either way.
 *
 * ONE DELIBERATE DIVERGENCE FROM `payout-form.tsx`: the border is
 * `border.default`, not transparent. `checkout-step.tsx` measured the reason and
 * both message composers carry it — `bg.raised` against `bg.canvas` is 1.06:1 in
 * light and 1.08:1 in dark, so a transparent-edged disabled pill is dim text
 * floating with no shape at all. TASTE §11.7 and §1 both require a disabled
 * control to stay VISIBLE and in place; an invisible one satisfies the letter of
 * "gray fill" and not the rule. Two host surfaces already spell the button both
 * ways; the measured one is taken here and the drift is reported for the central
 * fold-up into `components/ui.ts`.
 */
const sendPillDisabled =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full " +
  "border border-border-default bg-raised px-6 text-bodyMd font-semibold text-disabled";

/**
 * The three fields the CNIC check matches, exactly as `ga-075` lists them and as
 * `/account/verification` and the checkout's consent section both already
 * render them. Three, and never a fourth: the whole point of naming them is that
 * the list is short and closed.
 *
 * `Phrase` on the `13-digit` cell — GO-LIVE A17. `.num` puts the run in its own
 * bidi run, and an isolate is a neutral object to the text around it, so where
 * that run meets a paragraph boundary it takes the PARAGRAPH's direction and
 * jumps to the far end of the phrase. Inline, never on the `<dd>`: a block would
 * take its `text-align` from the resolved direction and drag the value to the
 * wrong edge.
 */
const CHECKED_FIELDS: readonly { readonly field: string; readonly what: ReactNode }[] = [
  { field: "Name", what: <>As it appears on your CNIC</> },
  {
    field: "CNIC number",
    what: (
      <Phrase>
        Your <span className="num">13</span>-digit identity number
      </Phrase>
    ),
  },
  { field: "Date of birth", what: <>Confirms the match against NADRA&apos;s record</> },
];

/**
 * `ha-009` panels A and B, moved to the front of the flow — the three things
 * that make a photograph of a card unusable, each stated as a fact about the
 * PHOTOGRAPH and paired with what to do. Not one of them says anything about the
 * host, and that is the register, not a coincidence.
 *
 * The anatomy is `app/host/listings/new/photos/step.tsx`'s "What makes a photo
 * work" block, reused rather than re-derived: a glyph disc, a 16/600 title, a
 * 14/400 body, hairline-divided rows and no plate. It is the same product
 * problem — photographic guidance — on the same shell, and one shell should not
 * ship two shapes for it. `ha-009` marks each line with a brand-green tick;
 * `HOST-SHELL.md` §7 caps this surface's brand roles and a guidance tick is not
 * one of the four, so the glyph is `text.secondary` and the words do the work.
 */
const PHOTO_GUIDANCE: readonly {
  readonly title: string;
  readonly body: string;
  readonly icon: ReactNode;
}[] = [
  {
    title: "Even light, card flat",
    body: "Glare across the print will stop a card being read. Lay it on a plain surface, away from a direct lamp rather than under one.",
    icon: <LightIcon className="size-4" />,
  },
  {
    title: "All four corners in the frame",
    body: "A corner outside the frame leaves the card incomplete. Step back slightly rather than filling every pixel with it.",
    icon: <FrameCornersIcon className="size-4" />,
  },
  {
    title: "Steady as the shutter fires",
    body: "Blur comes from the phone moving as the shutter fires. Rest your elbows on something, or choose a photo you have already taken.",
    icon: <CameraIcon className="size-4" />,
  },
];

export function CnicCheck() {
  /**
   * The file name, and a rejected file name. Nothing else is held, because
   * nothing else is looked at: the `File` object itself is never stored, never
   * read and never turned into an object URL, so there is no preview to
   * remember and no bytes in memory to leak into a re-render.
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
   * because they missed a 1px input. Copied deliberately from the guest step and
   * the wizard's photo grid, which both say the same thing.
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
       * It submits nowhere: the only submit control is `disabled`, and this
       * stops implicit submission, which a disabled button does not prevent on
       * its own.
       */
      onSubmit={(event) => event.preventDefault()}
    >
      {/* ─────────────────── what the check covers ───────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-covers-h`}>
        <h2 id={`${baseId}-covers-h`} className={sectionHeading}>
          What the check covers
        </h2>
        <p className={sectionBody}>
          CNIC verification is one match against NADRA&apos;s record, and these three fields are the
          whole of it.
        </p>

        {/*
          The same three-cell anatomy `/account/verification` and the checkout's
          consent section render, reused rather than re-drawn: a hairline between
          rows and no container at all. TASTE §1 puts a block of statements in
          the "carries NEITHER" column, and a rule between two data rows is a
          separator, not a box.
        */}
        <dl className="mt-5 max-w-[62ch]">
          {CHECKED_FIELDS.map((row) => (
            <div
              key={row.field}
              className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0"
            >
              <dt className="w-32 flex-none text-bodySm font-medium text-primary">{row.field}</dt>
              <dd className="min-w-0 flex-1 text-bodySm text-secondary">{row.what}</dd>
            </div>
          ))}
        </dl>

        {/*
          `/account/verification`'s closing sentence, mirrored for the host side.
          It is a statement about the DATA — what is sent, and to whom it is
          shown — and deliberately not a statement about a status, because a
          sentence like "your account carries a verification mark" would assert
          the host account the strip above has just said does not exist.
        */}
        <p className={sectionBody}>
          Nothing beyond these three is sent, and none of it is shown to a guest or to another host.
        </p>

        {/*
          The mutual-formality framing, in the calm `info` register rather than
          as a defence. `DESIGN.md` §0.2: verification is a formality between
          people trusted by default, and the sentence that asks for a document
          explains itself in one plain line. Colour is not the only signal — the
          glyph and the bolded payload carry it in monochrome. Border, no shadow,
          `radius.lg` (`HOST-SHELL.md` §5 puts banners there).
        */}
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary">
          <InfoIcon className="mt-0.5 size-5 flex-none text-info" />
          {/*
            The guest verify step's own sentence, mirrored rather than
            re-written: one framing, said the same way on both sides of one
            check. `DESIGN.md` §0.2 — a mutual formality between people trusted
            by default, never a suspicion, and the repositioning did not license
            a colder version of it.
          */}
          <span>
            <b className="font-semibold text-primary">This works both ways.</b> You are handing a
            stranger the keys to your home, and both sides should know who the other is — the same
            reason a hotel takes ID. Your guest verifies exactly as you do; it is a short formality
            for both of you, not a judgment.{" "}
            <Link href="/verification" className={inlineAction}>
              How verification works
            </Link>
          </span>
        </p>
      </section>

      {/* ─────────────────── the photo ───────────────────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-photo-h`}>
        <h2 id={`${baseId}-photo-h`} className={sectionHeading}>
          A photo of the front of your card
        </h2>
        <p className={sectionBody}>
          Choosing a file here checks that its format would be accepted, and stops there. The photo
          itself is never opened, copied or uploaded: only its file name and its format are looked
          at, and nothing leaves this tab.
        </p>

        <div className="mt-5 max-w-overlay-dialogMd">
          {fileName === null ? (
            <>
              {/*
                A real `<input type="file">` inside a `<label>` — the anatomy
                that makes click, keyboard and drag all reach one control, and
                the shipped shape on `app/book/[slug]/verify/step.tsx` and
                `components/host/photo-upload.tsx`. Border, no shadow: a drop
                target is a form boundary, not a float (TASTE §1).
              */}
              <label
                {...fileDrop}
                className={`relative flex cursor-pointer items-center gap-4 rounded-md border p-4 ${
                  filesOver
                    ? "border-border-strong"
                    : "border-border-default hover:border-border-strong"
                } ${rejected === null ? "" : "border-error"} ${tintTransition}`}
              >
                <input
                  type="file"
                  className="peer sr-only"
                  name="cnic-front"
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

              <div className="mt-3">
                {/*
                  The camera as the §5 gray-fill secondary, device-dependent and
                  said out loud rather than left to vanish silently — a control
                  present on one device and absent on another must explain
                  itself, or the host on a laptop assumes something broke.
                */}
                <label className={`relative cursor-pointer ${btnSecondary}`}>
                  <input
                    type="file"
                    className="peer sr-only"
                    name="cnic-front-camera"
                    accept="image/*"
                    capture="environment"
                    onChange={(event) => onFiles(event.target.files)}
                  />
                  <span aria-hidden="true" className={`${controlRing} rounded-md`} />
                  <CameraIcon className="size-4 flex-none text-secondary" />
                  Use camera
                </label>
              </div>
            </>
          ) : (
            /*
              The chosen state. INK plus a check glyph plus the word, never a
              green tick — the same call the guest step makes: a success colour
              here would be the fifth green on a surface TASTE §2 already has
              over budget, and it would read as "verified" on the one page where
              that word means something specific.

              The second line is the whole truth about what happened, and it is
              deliberately NOT the guest step's "Attached. It is sent when you
              continue." Nothing is sent, and this is the document where that
              sentence would cost the most.
            */
            <div className="rounded-md bg-raised p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-md border border-hairline bg-canvas text-secondary">
                  <AttachedFileIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  {/* A file name is a Latin run, not a digit run — `<bdi>` is
                      the isolate that keeps it readable inside an RTL
                      paragraph. */}
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
                    name="cnic-front"
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
            there is no red on the card, on the photograph or on the person, ever
            (`DESIGN.md` §0.2). Colour is never the only signal, so the glyph and
            the bolded payload carry it in monochrome, and the sentence names the
            fix rather than the fault. It is the guest step's sentence, shared on
            purpose: one boundary, described once, on both sides of the same
            check.
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
                Save it as a JPG, PNG or PDF, or photograph the printed card instead.
              </span>
            </p>
          )}

          <p className={slotNote}>
            <b className="font-semibold text-primary">Use camera</b> appears on a phone or tablet
            that has one. On a computer, take a photo with any camera and choose the file — it is
            read in exactly the same way.
          </p>
        </div>
      </section>

      {/* ─────────────────── getting one clear photo ─────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-clear-h`}>
        <h2 id={`${baseId}-clear-h`} className={sectionHeading}>
          Getting one clear photo
        </h2>
        <p className={sectionBody}>
          Three habits, not a standard to pass.
        </p>

        {/*
          Elevation: neither. A guidance list is content, so it is a glyph, a
          line and air, divided by one hairline PER GAP rather than plated
          (TASTE §1, §11.9).
        */}
        <ul className="mt-4 max-w-[62ch]">
          {PHOTO_GUIDANCE.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 border-t border-hairline py-4 first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className="grid size-8 flex-none place-items-center rounded-full bg-raised text-secondary"
              >
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-bodyMd font-semibold text-primary">{item.title}</b>
                <span className="mt-1 block text-bodySm font-regular leading-normal text-secondary">
                  {item.body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────── if a photo cannot be used ───────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-retake-h`}>
        <h2 id={`${baseId}-retake-h`} className={sectionHeading}>
          If a photo cannot be used
        </h2>
        {/*
          `ha-009`'s register, stated as the commitment it is rather than
          performed as a verdict nobody reached. Every clause is checkable
          against that card: a reason about the document, a next step, no
          "Failed", no "Denied", no judgement about the person, and no red mark
          on a family document.
        */}
        <p className={sectionBody}>
          If a photo ever needs taking again, the message will name one thing about the{" "}
          <b className="font-semibold text-primary">photo</b> — that it came out blurry, that a
          corner fell outside the frame, that a printed line could not be read — and it will say what
          to do about it. It will not say &ldquo;failed&rdquo;, &ldquo;rejected&rdquo; or
          &ldquo;denied&rdquo;, and it will not say anything about you. Being asked for a second
          photo is a fact about a photograph, never a question about who you are.
        </p>
        <p className={sectionBody}>
          Nothing on this page has been through a review, because nothing has been sent to one. No
          photo has been read, and no result is being held back.
        </p>
        <p className={sectionBody}>
          Getting hold of a document you do not have, and what happens when a name is spelled
          differently on two records, are answered in the help centre.{" "}
          <Link href="/help/verification" className={inlineAction}>
            Verification and documents
          </Link>
        </p>
      </section>

      {/* ─────────────────── actions ─────────────────────────────────────── */}
      <div className={section}>
        {/*
          `HOST-SHELL.md` §4's row, minus the sticky bar this page does not have:
          Back on the leading edge, the primary on the trailing edge, and
          `justify-between` mirrors under RTL for free.

          BACK IS AN INLINE TEXT ACTION, NOT THE §5 GRAY-FILL BUTTON, and the
          reason is the collision `payout-form.tsx` records: §5 puts the gray-fill
          secondary on `bg.raised`, and §5 also puts a disabled primary on
          `bg.raised`, so drawn as buttons the pair reads as two disabled
          controls differing only in radius. §4's own answer removes the
          collision instead of inventing a third fill.

          It points at `/host/verify` — §15's "the last state that still exists",
          and the page whose CNIC row opened this one.
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
            type="submit"
            disabled
            aria-describedby={sendReasonId}
            className={sendPillDisabled}
          >
            Send for verification
          </button>
        </div>

        {/*
          `HOST-SHELL.md` §3's fixed `.capnote` slot, in prose: this is how a
          disabled primary explains itself here, and §12 requires that every
          disabled control does. `text.secondary` and not tertiary — GO-LIVE C7
          has the tertiary ramp under AA review at body sizes, and this is a
          sentence the host is expected to read.

          It names the next real thing rather than ending — §12's "never a dead
          end" — and the destination is a page that exists and that this host has
          already come through.
        */}
        <p id={sendReasonId} className="mt-3 text-bodySm font-regular leading-relaxed text-secondary">
          Disabled because there is nowhere to send it. SalamStay has no connection to NADRA Verisys
          yet and no store for a document, so this page cannot start a check.{" "}
          <Link href="/host/onboarding" className={inlineAction}>
            See what else host setup asks for
          </Link>
        </p>
      </div>
    </form>
  );
}

export default CnicCheck;
