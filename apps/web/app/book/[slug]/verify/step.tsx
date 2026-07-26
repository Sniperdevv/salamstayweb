"use client";

import Link from "next/link";
import { useRef, useState, type DragEvent as ReactDragEvent } from "react";

import { AlertCircleIcon, InfoIcon } from "@/components/icons";
import {
  AttachedFileIcon,
  CameraIcon,
  DOCUMENT_COPY,
  LockIcon,
  PARTY_COPY,
  RailSummaryRow,
  UploadIcon,
  documentWhat,
  listDocumentNames,
} from "@/components/booking/verification-copy";
import { CheckoutStep } from "@/components/booking/checkout-step";
import {
  btnSecondary,
  controlRing,
  fieldErrorLine,
  inlineAction,
  tintTransition,
} from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckMark } from "@/components/ui/marks";
import { documentState, documentsComplete, requiredDocuments } from "@/lib/booking/booking";
import type { DocumentId } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";

/**
 * `/book/{slug}/verify` — step 2 of 4. Card: `gw-023-verify.html`.
 * Contract: `CHECKOUT-SHELL.md` (§15 amendments win), `BUILD-DECISIONS.md`.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE FRAMING IS THE STEP.
 * ───────────────────────────────────────────────────────────────────────────
 * Founder ruling, 2026-07-26: **anyone books**, and the marriage certificate at
 * booking is the ONLY document requirement SalamStay imposes. Every other
 * document here is described by what it CONFIRMS, never by who demands it, and
 * `/verification` is the page that carries the matrix and its grounds.
 *
 * `DESIGN.md` §0.2 / §10.6 and `CHECKOUT-SHELL.md` §15: there is no X-of-shame,
 * no "Failed", no "Denied", and **no red on a family document, ever**. The
 * error register on this screen is reserved for a genuine fault in a FILE — an
 * unsupported format — where the red is about the file and nothing else
 * (BUILD-DECISIONS ruling 11). A document REVIEW outcome would take the warning
 * register; see the note on what is not built, below.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * A DOCUMENT UPLOAD ON THE WEB IS NOT A PHONE CAMERA (gw-023, decision 2)
 * ───────────────────────────────────────────────────────────────────────────
 * The app makes the camera primary. The web owns none of the app's capture
 * pipeline — no framing guide, no lighting hint, no pre-flight blur check — and
 * `capture="environment"` on a desktop either does nothing or opens a webcam
 * pointed at the wrong thing. So **file upload is the primary and committed
 * path**: one `radius.md` `border.default` drop zone per document (a form
 * boundary, so a border and NO shadow — TASTE §1) wrapping a real
 * `<input type="file">` inside a `<label>`, which is what makes click, keyboard
 * and drag all reach the same control.
 *
 * The camera is a second, device-dependent affordance offered as the §5
 * gray-fill secondary, and the screen SAYS SO in plain words rather than letting
 * it silently vanish. A control that is present on one device and absent on
 * another must explain itself, or the guest on a laptop assumes something broke.
 *
 * Accepted formats are stated — JPG, PNG, PDF — and **no file-size cap is
 * printed**: no card in the corpus carries one and "10 MB" would be a product
 * decision dressed as a design detail (ruling 11).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FOUR THINGS THIS SCREEN REFUSES TO CLAIM
 * ───────────────────────────────────────────────────────────────────────────
 * 1. **No blur check result.** The card prints "Looks clear — the text is
 *    readable and the whole card is in frame". Nothing here inspects an image,
 *    so printing that sentence would be a verdict nobody reached. The check is
 *    real product work; it is not faked with a green box.
 * 2. **No "Verified" and no "Needs one more".** `lib/booking/booking.ts` is
 *    explicit that both are verdicts from a review nobody has built, and that a
 *    session storing them would be storing an answer it made up. A slot is
 *    `Not added` or `Added`, which is the whole truth a browser holds.
 * 3. **No upload progress and no "sent".** There is no backend and no request,
 *    so a progress bar would animate a network that does not exist. A chosen
 *    file says it is attached and says when it will be sent.
 * 4. **No review track and no "usually within a few hours".** gw-023's panel 3
 *    reports on a review this build cannot start. Its sub-progress bar is drawn
 *    as upcoming rather than current, and the third phase is named, not
 *    narrated.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE SUB-PROGRESS BARS, AND WHERE THEY REALLY BELONG
 * ───────────────────────────────────────────────────────────────────────────
 * HANDOFF §7.6a locks two stepper renderings and forbids a third: the named
 * circles (the journey) and, inside Verify only, three thin bars for
 * consent → documents → review. Three bars, never four — they are phases, not a
 * document count. They belong INSIDE the shell's `.stepblk`, directly under the
 * caption that says which tier is which, and `CheckoutStep`'s fixed API has no
 * slot for them. They ship here as the first block of the step body — still the
 * main column, still above the first form group (§3's placement rule) — with
 * their own naming sentence so they can never be read as a second journey.
 * Reported: the shell wants a `subProgress` prop.
 */

/* ————— section recipe — CHECKOUT-SHELL §5 (see the Party step) ——————————— */

const section = "border-t border-hairline py-8 first:border-t-0 first:pt-6";
/** §5's 520 group. See the Party step for why the 512 rung rides along. */
const groupWidth = "max-w-lg max-w-overlay-dialogMd";
const sectionTitle = "text-h5 font-semibold text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm leading-normal text-secondary";
const hintRow =
  "mt-5 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";
/** `.dnote` — the 13px note under a control. Its inline action is a plain link. */
const slotNote = "mt-3 max-w-[62ch] text-label font-regular leading-relaxed text-secondary";

/* ————— what a browser will accept ————————————————————————————————————————
 *
 * Types AND extension, because `file.type` is empty on more Android pickers
 * than anyone expects and a `.pdf` with no reported type is still a PDF. A
 * `.docx` fails both, which is the case the error register exists for.
 */
const ACCEPT = "image/jpeg,image/png,application/pdf";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_EXTENSION = /\.(jpe?g|png|pdf)$/i;

function isSupported(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSION.test(file.name);
}

/* ————— the three sub-phases ——————————————————————————————————————————————— */

type SubPhase = "consent" | "documents" | "check";

function SubProgress({ phase, ready }: { readonly phase: SubPhase; readonly ready: boolean }) {
  const bar = (index: number) => {
    const order: SubPhase[] = ["consent", "documents", "check"];
    const current = order.indexOf(phase);
    if (index < current) return "bg-interactive";
    if (index === current) return ready ? "bg-interactive" : "bg-interactive opacity-50";
    return "bg-sunken";
  };

  return (
    <div className="pb-8">
      {/* `max-w-md` is the shell's own stepper width, so the bars sit exactly
          under the four circles rather than beside them. */}
      <div aria-hidden="true" className="flex max-w-md gap-1">
        {[0, 1, 2].map((index) => (
          <span key={index} className={`h-1 flex-1 rounded-full ${bar(index)}`} />
        ))}
      </div>
      <p className="mt-3 max-w-[62ch] text-label font-regular leading-relaxed text-secondary">
        Consent, then documents, then a check.{" "}
        {phase === "consent" ? (
          <>
            You are on <b className="font-semibold text-primary">consent</b>.
          </>
        ) : ready ? (
          <>
            Your documents are ready to send for{" "}
            <b className="font-semibold text-primary">the check</b>.
          </>
        ) : (
          <>
            You are on <b className="font-semibold text-primary">documents</b>.
          </>
        )}
      </p>
    </div>
  );
}

/* ————— one document ——————————————————————————————————————————————————————— */

function DocumentSlot({
  id,
  childCount,
  fileNames,
  showCameraNote,
  rejected,
  onFiles,
}: {
  readonly id: DocumentId;
  readonly childCount: number;
  readonly fileNames: readonly string[];
  readonly showCameraNote: boolean;
  readonly rejected: string | null;
  readonly onFiles: (id: DocumentId, files: FileList | null) => void;
}) {
  const copy = DOCUMENT_COPY[id];
  const Icon = copy.icon;
  const added = fileNames.length > 0;
  const [filesOver, setFilesOver] = useState(false);
  const errorId = `${id}-error`;

  const isFileDrag = (event: ReactDragEvent): boolean =>
    Array.from(event.dataTransfer.types).includes("Files");

  /**
   * `preventDefault` on `dragover` is not decoration: without it the browser's
   * default is to NAVIGATE to the dropped file, which is a guest losing a
   * half-filled checkout because they missed a 1px input.
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
      onFiles(id, event.dataTransfer.files);
    },
  };

  return (
    <div className="border-t border-hairline py-6 first:border-t-0 first:pt-1">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 size-5 flex-none text-secondary" />
        <span className="min-w-0 flex-1">
          <span className="block text-bodyMd font-medium text-primary">{copy.name}</span>
          <span className="mt-0.5 block text-label font-regular text-secondary">
            {documentWhat(id, childCount)}
          </span>
        </span>
        {/*
          An added document is INK plus a check glyph plus the word — never a
          green tick per row. Four success marks on one screen is exactly the
          colour spend TASTE §1/§2 exist to prevent.
        */}
        {added ? (
          <span className="flex flex-none items-center gap-2 text-label font-medium text-primary">
            <CheckMark className="size-4" />
            Added
          </span>
        ) : (
          <span className="flex-none text-label font-regular text-tertiary">Not added</span>
        )}
      </div>

      {added ? (
        <div className="mt-4 rounded-md bg-raised p-3">
          {fileNames.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className={`flex items-center gap-3 ${index === 0 ? "" : "mt-3"}`}
            >
              <span className="grid size-9 flex-none place-items-center rounded-md border border-hairline bg-canvas text-secondary">
                <AttachedFileIcon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                {/* A file name is a Latin run, not a digit run — `<bdi>` is the
                    isolate that keeps it readable inside an RTL paragraph. */}
                <bdi className="block truncate text-bodySm font-medium text-primary">{name}</bdi>
                <span className="mt-0.5 block text-label font-regular text-secondary">
                  Attached. It is sent when you continue.
                </span>
              </span>
              {index === 0 ? (
                <label className="relative flex-none cursor-pointer rounded-sm text-bodySm font-medium text-primary underline underline-offset-4">
                  <input
                    type="file"
                    className="peer sr-only"
                    name={id}
                    accept={ACCEPT}
                    multiple={copy.multiple}
                    onChange={(event) => onFiles(id, event.target.files)}
                  />
                  <span aria-hidden="true" className={`${controlRing} rounded-sm`} />
                  Replace
                </label>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <>
          <label
            {...fileDrop}
            className={`relative mt-4 flex cursor-pointer items-center gap-4 rounded-md border p-4 ${
              filesOver ? "border-border-strong" : "border-border-default hover:border-border-strong"
            } ${rejected ? "border-error" : ""} ${tintTransition}`}
          >
            <input
              type="file"
              className="peer sr-only"
              name={id}
              accept={ACCEPT}
              multiple={copy.multiple}
              aria-describedby={rejected ? errorId : undefined}
              onChange={(event) => onFiles(id, event.target.files)}
            />
            <span aria-hidden="true" className={`${controlRing} rounded-md`} />
            <span className="grid size-10 flex-none place-items-center rounded-full bg-raised text-secondary">
              <UploadIcon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block text-bodySm font-medium text-primary underline underline-offset-4">
                {copy.multiple ? "Choose files, or drag them here" : "Choose a file, or drag one here"}
              </b>
              <span className="mt-0.5 block text-label font-regular text-secondary">
                JPG, PNG or PDF
              </span>
            </span>
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className={`relative cursor-pointer ${btnSecondary}`}>
              <input
                type="file"
                className="peer sr-only"
                name={`${id}-camera`}
                accept="image/*"
                capture="environment"
                multiple={copy.multiple}
                onChange={(event) => onFiles(id, event.target.files)}
              />
              <span aria-hidden="true" className={`${controlRing} rounded-md`} />
              <CameraIcon className="size-4 flex-none text-secondary" />
              Use camera
            </label>
            {id === "selfie" ? (
              <Link className={inlineAction} href="/help/verification">
                Why is a selfie needed?
              </Link>
            ) : null}
          </div>
        </>
      )}

      {rejected ? (
        <p id={errorId} className={fieldErrorLine} role="alert">
          <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
          <span>
            <b className="font-semibold">
              <bdi>{rejected}</bdi> cannot be read.
            </b>{" "}
            Save it as a JPG, PNG or PDF, or photograph the printed document instead.
          </span>
        </p>
      ) : null}

      {copy.slotNote ? (
        <p className={slotNote}>
          {copy.slotNote}
          {copy.more ? (
            <>
              {" "}
              <Link className={inlineAction} href={copy.more.href}>
                {copy.more.label}
              </Link>
            </>
          ) : null}
        </p>
      ) : null}

      {showCameraNote ? (
        <p className={slotNote}>
          <b className="font-semibold text-primary">Use camera</b> appears on a phone or tablet that
          has one. On a computer, take a photo with any camera and upload the file — it is read in
          exactly the same way.
        </p>
      ) : null}
    </div>
  );
}

/* ————— the step ——————————————————————————————————————————————————————————— */

export default function VerifyStep({ slug }: { readonly slug: string }) {
  const { draft, setDocument } = useBooking();

  /**
   * Consent is held here rather than on the draft, and that is deliberate. The
   * draft is the shared booking model; a consent flag on it would be readable
   * — and settable — by every other step. ga-075's ruling is that the box ships
   * UNCHECKED and nothing may pre-tick it, so the value opens at `false` in the
   * one component that renders the box.
   */
  const [consented, setConsented] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [rejected, setRejected] = useState<Partial<Record<DocumentId, string>>>({});
  const [chosenFiles, setChosenFiles] = useState<Partial<Record<DocumentId, readonly string[]>>>({});
  const declineRef = useRef<HTMLButtonElement | null>(null);

  const party = draft.party;
  const documents = requiredDocuments(draft);
  const complete = documentsComplete(draft);
  const added = documents.filter((id) => documentState(draft, id) === "added");
  const missing = documents.filter((id) => documentState(draft, id) === "not-added");
  const sending = documents.filter((id) => documentState(draft, id) === "sending");

  const namesFor = (id: DocumentId): readonly string[] => {
    const local = chosenFiles[id];
    if (local && local.length > 0) return local;
    const stored = draft.documents[id];
    return stored && stored.state === "added" && stored.fileName ? [stored.fileName] : [];
  };

  const onFiles = (id: DocumentId, files: FileList | null) => {
    const picked = files ? Array.from(files) : [];
    if (picked.length === 0) return;

    const unsupported = picked.find((file) => !isSupported(file));
    if (unsupported) {
      setRejected((current) => ({ ...current, [id]: unsupported.name }));
      return;
    }

    setRejected((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setChosenFiles((current) => ({ ...current, [id]: picked.map((file) => file.name) }));
    setDocument(id, { state: "added", fileName: picked[0]?.name ?? null });
  };

  /* ——— what blocks the primary, and what it says ——————————————————————— */

  const phase: SubPhase = consented ? "documents" : "consent";
  const partyChosen = party !== null;

  const note = !partyChosen
    ? "Choose who is staying at step 1 to continue."
    : declined
      ? "Consent to the CNIC check to continue."
      : !consented
        ? "Tick the box to continue."
        : missing.length > 0
          ? `Add your ${listDocumentNames(missing)} to continue.`
          : sending.length > 0
            ? "Finish your uploads to continue."
            : "You will not be charged yet.";

  /**
   * The camera note is said ONCE, under the first slot — the first place the
   * guest meets the button. gw-023 hangs it on the selfie because its CNIC slot
   * is already filled on that panel; on a live page the first slot is the one
   * that has to explain the control.
   */
  const cameraNoteOn: DocumentId | undefined = documents[0];

  return (
    <CheckoutStep
      step={2}
      listing={draft.listing}
      heading="Verify who is staying"
      sub="Your documents, once. Future bookings skip this step entirely, and nothing is charged yet."
      backHref={`/book/${slug}/party`}
      nextHref={`/book/${slug}/price`}
      nextDisabled={!partyChosen || !consented || !complete}
      /*
        NOT "Send for review". gw-023's rail says that because the card has a
        review behind it; this build has none, and a button labelled with a
        submission that does not happen is the one kind of copy this flow cannot
        afford. gw-023's own panel 3 already ships "Continue to price" for the
        control that leads to step 3, so the label is the card's, used honestly.
      */
      nextLabel="Continue to price"
      note={note}
      showRail
      railRows={
        <RailSummaryRow
          label="Party"
          empty={party === null || added.length === 0}
          changeHref={`/book/${slug}/party`}
          value={
            party === null ? (
              "Not chosen yet"
            ) : added.length === 0 ? (
              `${PARTY_COPY[party].name} · no documents added yet`
            ) : (
              <>
                {PARTY_COPY[party].name} · <span className="num">{added.length}</span> of{" "}
                <span className="num">{documents.length}</span>{" "}
                {documents.length === 1 ? "document" : "documents"} added
              </>
            )
          }
        />
      }
    >
      {!partyChosen ? (
        /*
          A cold load with no party chosen. The step cannot honestly ask for
          documents it has no basis for, and printing the identity pair alone
          would be a shorter list than this booking owes. One recovery, one
          route out — no dead end.
        */
        <section className={section} aria-labelledby="resume-heading">
          <h2 id="resume-heading" className={sectionTitle}>
            Step 1 first
          </h2>
          <p className={sectionSub}>
            Which documents this step asks for depends on who is staying, and that answer is not on
            this booking yet. Nothing is lost — your dates are still held.
          </p>
          <p className="mt-5">
            <Link className={inlineAction} href={`/book/${slug}/party`}>
              Go to who is staying
            </Link>
          </p>
        </section>
      ) : (
        <>
          <SubProgress phase={phase} ready={consented && complete} />

          {!consented ? (
            /* ——— Consent (ga-075, carried over whole) ——————————————————— */
            <section className={section} aria-labelledby="consent-heading">
              <h2 id="consent-heading" className={sectionTitle}>
                Your consent for CNIC verification
              </h2>
              <p className={sectionSub}>
                SalamStay runs on{" "}
                <b className="font-semibold text-primary">
                  CNIC-verified guests and hosts via NADRA Verisys
                </b>{" "}
                — a mutual formality, for you and for your host. A stranger is handing you the keys
                to their home, and both sides should know who the other is. Short-stay guest
                registration is also a routine legal requirement in Pakistan — the same formality
                any hotel completes — and SalamStay files it for you and your host.
              </p>

              <p className="mt-5 flex max-w-lg max-w-overlay-dialogMd items-start gap-3 rounded-md border border-info-border bg-info-bg p-3 text-label leading-relaxed">
                <LockIcon className="mt-0.5 size-4 flex-none text-info" />
                <span>
                  <b className="block font-semibold text-info">
                    Encrypted, and used only for this one-time match
                  </b>
                  <span className="text-secondary">Hosts and guests never see these details.</span>
                </span>
              </p>

              {/* Exactly the three fields ga-075 lists, and nothing else. */}
              <dl className="mt-5 max-w-lg max-w-overlay-dialogMd">
                {[
                  { field: "Name", what: <>As it appears on your CNIC</> },
                  {
                    field: "CNIC number",
                    what: (
                      <>
                        Your <span className="num">13</span>-digit identity number
                      </>
                    ),
                  },
                  {
                    field: "Date of birth",
                    what: <>Confirms the match against NADRA&apos;s record</>,
                  },
                ].map((row) => (
                  <div
                    key={row.field}
                    className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0"
                  >
                    <dt className="w-32 flex-none text-bodySm font-medium text-primary">
                      {row.field}
                    </dt>
                    <dd className="min-w-0 flex-1 text-bodySm text-secondary">{row.what}</dd>
                  </div>
                ))}
              </dl>
              <p className={slotNote}>
                Nothing beyond this is sent, and none of it is shown to hosts or other guests.
              </p>

              {declined ? (
                /*
                  Declining is a choice, not a fault, so it takes the INFO
                  register — never warning and never error. Nothing has moved,
                  and the way back is one visible action.
                */
                <div className="mt-5 max-w-lg max-w-overlay-dialogMd rounded-md border border-info-border bg-info-bg p-4">
                  <p className="text-bodySm font-semibold text-primary">
                    You have not consented to the CNIC check.
                  </p>
                  <p className="mt-1 text-bodySm leading-relaxed text-secondary">
                    Nothing has been sent to NADRA Verisys, nothing has been charged, and your dates
                    are still held. You can consent whenever you want to.
                  </p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link className={inlineAction} href="/stays-in-islamabad">
                      Browse stays in Islamabad
                    </Link>
                    <button
                      type="button"
                      className={inlineAction}
                      onClick={() => {
                        setDeclined(false);
                        declineRef.current?.focus();
                      }}
                    >
                      Go back to the consent
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  <Checkbox
                    checked={consented}
                    onChange={setConsented}
                    name="nadra-consent"
                    className="mt-5 max-w-lg max-w-overlay-dialogMd"
                  >
                    I agree to share these details with NADRA Verisys to verify my identity.
                  </Checkbox>
                  <div className="mt-3">
                    <button
                      ref={declineRef}
                      type="button"
                      className={btnSecondary}
                      onClick={() => setDeclined(true)}
                    >
                      I do not consent
                    </button>
                  </div>
                </>
              )}

              <p className={hintRow}>
                <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
                <span>
                  <b className="font-semibold text-primary">
                    Without this check, booking is not possible.
                  </b>{" "}
                  You can still browse stays — you just will not be able to book until you consent,
                  and you can consent any time from Verification.{" "}
                  <Link className={inlineAction} href="/verification">
                    How verification works
                  </Link>
                </span>
              </p>
            </section>
          ) : (
            /* ——— Documents ————————————————————————————————————————————— */
            <section className={section} aria-labelledby="documents-heading">
              <h2 id="documents-heading" className={sectionTitle}>
                Your documents
              </h2>
              <p className={sectionSub}>
                Upload a photo or a scan of each one. JPG, PNG and PDF all work. A marriage
                certificate from a couple is the only document SalamStay itself requires; everything
                else here confirms a booking type and nothing more.
              </p>

              <div className={`mt-5 ${groupWidth}`}>
                {documents.map((id) => (
                  <DocumentSlot
                    key={id}
                    id={id}
                    childCount={draft.guests.children}
                    fileNames={namesFor(id)}
                    showCameraNote={id === cameraNoteOn}
                    rejected={rejected[id] ?? null}
                    onFiles={onFiles}
                  />
                ))}
              </div>

              <p className="mt-6 flex max-w-lg max-w-overlay-dialogMd items-start gap-3 rounded-md border border-info-border bg-info-bg p-3 text-label leading-relaxed">
                <LockIcon className="mt-0.5 size-4 flex-none text-info" />
                <span>
                  <b className="block font-semibold text-info">
                    Encrypted, used only for verification
                  </b>
                  <span className="text-secondary">
                    Every document is reviewed privately by a person and then kept encrypted.
                    Documents confirm a booking type and are never shown to the host, to other
                    guests, or on your profile.
                  </span>
                </span>
              </p>

              <p className={hintRow}>
                <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
                <span>
                  <b className="font-semibold text-primary">This works both ways.</b> A stranger is
                  handing you the keys to their home, and both sides should know who the other is —
                  the same reason a hotel takes your ID. Your host verifies exactly as you do; it is
                  a short formality for both of you, not a judgment.{" "}
                  <Link className={inlineAction} href="/legal/data-handling">
                    How we handle your data
                  </Link>
                </span>
              </p>
            </section>
          )}
        </>
      )}
    </CheckoutStep>
  );
}
