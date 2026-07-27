"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";
import {
  PhotoUpload,
  photoUploadStringsEn,
  type ListingPhoto,
  type PhotoUploadInFlight,
  type PhotoUploadStrings,
} from "@/components/host/photo-upload";
import { WizardStep } from "@/components/host/wizard-step";
import { inlineAction } from "@/components/ui";

/**
 * `/host/listings/new/photos` — the create-listing wizard, step 6 of 9.
 * `hw-005-wizard-photos.html`, under `HOST-SHELL.md` and its §16 amendments.
 *
 * WHAT THIS FILE OWNS, AND WHAT IT DOES NOT
 * -----------------------------------------
 * `WizardStep` owns the chrome, the 640 column, the nine bars, the caption and
 * the action bar. `PhotoUpload` owns the dropzone, the in-flight rows, the
 * reorder grid, the cover mark and the per-photo menu. This file owns the four
 * things neither of them can decide: the step's `h1` and explainer, the
 * photographic guidance, the page-level error banner, and — the substantive one
 * — **what actually happens to a file the host chooses**.
 *
 * THE RESIZE CLAIM, EARNED RATHER THAN INHERITED
 * ----------------------------------------------
 * `photo-upload.tsx` flags one string as a claim about behaviour: the card's
 * "Photos are resized in your browser before they are sent". It ships only if
 * the build really downscales client-side.
 *
 * So it really does. `onFilesChosen` reads the file, decodes it, draws it into
 * a canvas bounded at `MAX_STORED_EDGE` and keeps THAT blob as the photo of
 * record; the original on the host's device is never touched and never read
 * again. The grid renders the downscaled blob, so a host who drops eight 12MP
 * camera files is not asked to hold eight 12MP bitmaps in a page.
 *
 * The half of the sentence that is NOT earned is "before they are sent", and
 * the tail that hangs off it ("so a slow connection is not a problem"). Nothing
 * in this wizard is sent anywhere — there is no persistence layer on any of the
 * nine steps yet — so a sentence about what happens to a photograph in transit
 * is a sentence about something that does not happen. It is replaced with what
 * the build can stand behind, and nothing more. When the upload lands, the
 * clause comes back with it, because by then the resized blob will be the thing
 * that travels.
 *
 * THE PROGRESS NUMBER IS A REAL MEASUREMENT
 * -----------------------------------------
 * Which is why the in-flight rows say `Resizing in your browser` rather than
 * `sending`: the percentage is the share of the file actually read off the
 * device, reported by `FileReader`'s own progress events. It is not a timer, not
 * an easing curve, and not a simulation of a network transfer that is not
 * happening. `Cancel` calls `reader.abort()` and the file is dropped — a cancel
 * that does not cancel would be a worse lie than a fake bar.
 *
 * WHAT COULD NOT BE DRAWN HONESTLY, AND WHY
 * -----------------------------------------
 * `ListingPhoto.alt` is documented as "the room, described" — the only place a
 * room name lives, since TASTE §9 forbids text on a photograph. The card can
 * write "Bedroom with a grey headboard" because the card is a worked case. A
 * real host has typed nothing: there is no per-photo description field on
 * `hw-005`, and minting one would be a product decision dressed as an
 * accessibility fix. So `alt` carries the **file name**, which is the one true
 * thing known about that image and is also what a host uses to tell two of their
 * own photos apart. Flagged for whoever owns the photo-description question.
 */

/* ——— Icons ——————————————————————————————————————————————————————————————
 *
 * `hw-005`'s own paths, local to this surface, exactly as `photo-upload.tsx`
 * keeps its glyphs local: these six exist for this one step. Every one sits
 * beside a real label, so every one is `aria-hidden`. Uniform thin stroke
 * across the guidance row (TASTE §11.3) — including the check, which is why it
 * is drawn here rather than borrowed from `marks.tsx`, where it carries the
 * `bold` rung tuned for a mark reversed out of an ink disc.
 */

type GlyphProps = { readonly className?: string };

function Glyph({
  className,
  stroke = iconStroke.thin,
  children,
}: GlyphProps & { readonly stroke?: number; readonly children: ReactNode }) {
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

/** The explainer's mark — a frame with a sun in it. */
function PhotoFrameIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l5-4 4 3 3-2 4 3" />
    </Glyph>
  );
}

function DaylightIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </Glyph>
  );
}

function WideShotIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </Glyph>
  );
}

function TrueToLifeIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12l5 5L20 7" />
    </Glyph>
  );
}

function NoPeopleIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M2 22L22 2" />
    </Glyph>
  );
}

/** The banner's mark. Colour is never the only signal. */
function AlertCircleIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </Glyph>
  );
}

/* ——— The resize ————————————————————————————————————————————————————————— */

/**
 * The longest edge a stored photo keeps.
 *
 * A pixel dimension of a photograph, not a layout value — there is no token
 * role for "how big is a listing photo", and inventing one would put an image
 * pipeline constant on the spacing scale. 1600 is the honest floor for the
 * widest place a listing photo is ever drawn (a guest mosaic hero at 2x on a
 * desktop) and is roughly a tenth of a modern phone file's byte count.
 */
const MAX_STORED_EDGE = 1600;

/** Encoder quality for the re-encode. An encoder setting, not a design value. */
const ENCODE_QUALITY = 0.9;

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png"]);

/** Thrown when the host cancels. Distinguished so a cancel reports nothing. */
const ABORTED = Symbol("aborted");

/**
 * Reads the file, reporting the share of it that has actually come off the
 * device. `FileReader` fires `progress` throughout a large read, so on the
 * phone-sized files this step exists for the number moves and means something.
 */
function readWithProgress(
  file: File,
  reader: FileReader,
  onProgress: (percent: number) => void,
): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onprogress = (event) => {
      if (!event.lengthComputable || event.total === 0) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) resolve(result);
      else reject(new Error("unreadable"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("unreadable"));
    reader.onabort = () => reject(ABORTED);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * The claim, implemented. Decodes, and if the image is larger than the bound,
 * draws it down and re-encodes in its own format — a PNG stays a PNG, because
 * silently turning a host's PNG into a JPG is a decision about their file we
 * were not asked to make. An image already inside the bound is kept as it is;
 * "photos are resized in your browser" describes where the resizing happens,
 * not a promise to re-encode something that needs no re-encoding.
 */
async function resizeInBrowser(buffer: ArrayBuffer, type: string): Promise<string> {
  const source = new Blob([buffer], { type });
  const bitmap = await createImageBitmap(source);
  const longest = Math.max(bitmap.width, bitmap.height);

  if (longest <= MAX_STORED_EDGE) {
    bitmap.close();
    return URL.createObjectURL(source);
  }

  const scale = MAX_STORED_EDGE / longest;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (context === null) {
    bitmap.close();
    return URL.createObjectURL(source);
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const resized = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, ENCODE_QUALITY);
  });
  return URL.createObjectURL(resized ?? source);
}

/* ——— Copy ———————————————————————————————————————————————————————————————— */

/** What to call a format in a sentence. The extension, or the MIME subtype. */
function formatLabel(file: File): string {
  const dot = file.name.lastIndexOf(".");
  if (dot > 0 && dot < file.name.length - 1) return file.name.slice(dot + 1).toUpperCase();
  const slash = file.type.indexOf("/");
  if (slash > 0) return file.type.slice(slash + 1).toUpperCase();
  return "That format";
}

function joinLabels(labels: readonly string[]): string {
  if (labels.length === 1) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1] ?? ""}`;
}

/**
 * Both registers of one refusal (HOST-SHELL §11.3): the page-level banner with
 * a named recovery action, and the line under the control at fault.
 *
 * ERROR and not warning — an unsupported format is a fact about the file
 * (BUILD-DECISIONS #11). And still no size cap, in either register, because
 * there is no size cap: `ACCEPTED_TYPES` is the whole of what this step filters.
 */
interface Refusal {
  readonly banner: ReactNode;
  readonly inline: ReactNode;
}

const ANCHOR = "photo-drop";

function formatRefusal(files: readonly File[]): Refusal {
  const labels = Array.from(new Set(files.map(formatLabel)));
  const heic = labels.some((label) => label === "HEIC" || label === "HEIF");
  const first = files[0];
  const single = files.length === 1 && first !== undefined;

  /* The iPhone sentence is only true of HEIC, so it only appears for HEIC.
     Advice attached to a format it does not describe is worse than no advice. */
  const iphone = heic ? (
    <> On an iPhone, share the photo and choose to save it as a JPG, then add it again.</>
  ) : null;

  return {
    banner: single ? (
      <>
        <b className="font-semibold text-primary">One file could not be added.</b>{" "}
        <span className="num">{first.name}</span> is a {formatLabel(first)} file, and photos on
        SalamStay are JPG or PNG.{iphone} The other photos on this step are unaffected.
      </>
    ) : (
      <>
        <b className="font-semibold text-primary">Some files could not be added.</b>{" "}
        <span className="num">{files.length}</span> of them are {joinLabels(labels)}, and photos on
        SalamStay are JPG or PNG.{iphone} The other photos on this step are unaffected.
      </>
    ),
    inline: single ? (
      <>
        {formatLabel(first)} is not accepted here. Add the same photo as a{" "}
        <b className="font-semibold">JPG</b> or a <b className="font-semibold">PNG</b> and it will go
        straight in.
      </>
    ) : (
      <>
        {joinLabels(labels)} are not accepted here. Add the same photos as a{" "}
        <b className="font-semibold">JPG</b> or a <b className="font-semibold">PNG</b> and they will
        go straight in.
      </>
    ),
  };
}

function unreadableRefusal(name: string): Refusal {
  return {
    banner: (
      <>
        <b className="font-semibold text-primary">One file could not be read.</b>{" "}
        <span className="num">{name}</span> did not open as an image. Try adding it again, or open it
        on your device and export a fresh JPG. The other photos on this step are unaffected.
      </>
    ),
    inline: <>That file did not open as an image. Add it again, or export a fresh copy of it.</>,
  };
}

/**
 * The component's strings, with the four that describe BEHAVIOUR re-pointed at
 * the behaviour this build actually has. Everything else is `hw-005`'s English
 * as `photo-upload.tsx` ships it.
 */
const strings: PhotoUploadStrings = {
  ...photoUploadStringsEn,
  gridNote: (
    <>
      You can also drop files straight onto the grid.{" "}
      <b className="font-semibold text-primary">JPG or PNG.</b> Photos are resized in your browser as
      you add them, and the originals on your device are left exactly as they are.
    </>
  ),
  emptyNote: (
    <>
      A few good photos beat a long gallery. Photos are resized in your browser as you add them, and
      the originals on your device are left exactly as they are.
    </>
  ),
  sending: "Resizing in your browser ·",
  progressOf: (name) => `Resizing progress for ${name}`,
  cancelUploadOf: (name) => `Stop adding ${name}`,
};

/* ——— Recipes ————————————————————————————————————————————————————————————— */

/**
 * `.fsec` — HOST-SHELL §5's section: hairline rule, then the heading.
 *
 * The card writes `padding:28px 0; margin-top:28px`, and 28 is not a rung on the
 * spacing scale (24 and 32 are its neighbours). One rung, used twice, beats a
 * raw 28 written twice: 32 above the rule and 32 below it, with the next
 * section's own top margin closing the gap. The rhythm the card is describing —
 * air, rule, heading — survives; the arbitrary number does not ship.
 */
const section = "mt-8 border-t border-hairline pt-8";
const sectionTitle = "text-h5 font-semibold text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm font-regular leading-normal text-secondary";

/** `.ghint` — the step's one explainer. Icon and text in open space, no box. */
const hintRow =
  "mt-6 flex items-start gap-3 text-bodySm font-regular leading-relaxed text-secondary";

/**
 * The photographic guidance — hairline-divided rows in open space.
 *
 * No plate, no card, no bordered box: TASTE §1 puts content in open space, and
 * this is the "Things to know"-class block that rule was written for.
 */
const guidance = [
  {
    icon: <DaylightIcon className="size-4" />,
    title: "Shoot in daylight",
    body: "Open the curtains and switch the lights off. A dark room photographs darker than it looks.",
  },
  {
    icon: <WideShotIcon className="size-4" />,
    title: "Stand in a corner and show the whole room",
    body: "A wide shot tells a guest how much space there is. A close-up of a cushion does not.",
  },
  {
    icon: <TrueToLifeIcon className="size-4" />,
    title: "Show what guests will actually find",
    body: "Skip the filters. The photo should match the home on the day they arrive.",
  },
  {
    /* Founder ruling, HOST-SHELL §16.3: this stays, as plain photographic
       guidance. It arrived hung off a step the repositioning retired; the
       repositioning retires the framing, not the practice, and the practice is
       ordinary listing-photo advice. Nothing cultural is said, or implied. */
    icon: <NoPeopleIcon className="size-4" />,
    title: "Leave people out of the frame",
    body: "Guests are looking at the home. Family, staff and neighbours stay out of shot, including in the background.",
  },
] as const;

/* ——— Page ———————————————————————————————————————————————————————————————— */

export default function PhotosStepPage() {
  const [photos, setPhotos] = useState<readonly ListingPhoto[]>([]);
  const [uploads, setUploads] = useState<readonly PhotoUploadInFlight[]>([]);
  const [refusal, setRefusal] = useState<Refusal | null>(null);

  /** Readers by job, so `Cancel` can abort the one it names. */
  const readers = useRef(new Map<string, FileReader>());
  const nextKey = useRef(0);

  /**
   * A mirror of `photos`, read by the async pipeline.
   *
   * A resize finishes some hundreds of milliseconds after the click that
   * started it, by which time the array captured in that render may be two
   * reorders old. The ref is what "the photo this id points at, now" means.
   */
  const photosRef = useRef<readonly ListingPhoto[]>(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const key = (prefix: string) => {
    nextKey.current += 1;
    return `${prefix}-${nextKey.current}`;
  };

  /**
   * One file, from the host's disk to a tile.
   *
   * `replaceId` set → the resized blob takes that tile's place and keeps its
   * position, which is what "Replace this photo" means: the ORDER is the thing
   * the host arranged, and replacing a picture must not undo it.
   */
  const addFile = async (file: File, replaceId: string | null) => {
    const jobId = key("job");
    const reader = new FileReader();
    readers.current.set(jobId, reader);
    setUploads((prev) => [...prev, { id: jobId, name: file.name, percent: 0 }]);

    try {
      const buffer = await readWithProgress(file, reader, (percent) => {
        setUploads((prev) => prev.map((u) => (u.id === jobId ? { ...u, percent } : u)));
      });
      const src = await resizeInBrowser(buffer, file.type);

      if (replaceId === null) {
        setPhotos((prev) => [...prev, { id: key("photo"), src, alt: file.name }]);
      } else {
        const previous = photosRef.current.find((p) => p.id === replaceId);
        setPhotos((prev) =>
          prev.map((p) => (p.id === replaceId ? { id: p.id, src, alt: file.name } : p)),
        );
        if (previous !== undefined) URL.revokeObjectURL(previous.src);
      }
    } catch (error) {
      /* A cancel is the host's own decision and needs no message. Anything else
         is a fact about the file, and every error names its next action (§12). */
      if (error !== ABORTED) setRefusal(unreadableRefusal(file.name));
    } finally {
      readers.current.delete(jobId);
      setUploads((prev) => prev.filter((u) => u.id !== jobId));
    }
  };

  const onFilesChosen = (files: readonly File[]) => {
    const accepted = files.filter((file) => ACCEPTED_TYPES.has(file.type));
    const refused = files.filter((file) => !ACCEPTED_TYPES.has(file.type));

    setRefusal(refused.length === 0 ? null : formatRefusal(refused));
    for (const file of accepted) void addFile(file, null);
  };

  /** Every reorder, cover change and removal arrives here. Removals free their blob. */
  const onPhotosChange = (next: readonly ListingPhoto[]) => {
    const keep = new Set(next.map((p) => p.id));
    for (const photo of photosRef.current) {
      if (!keep.has(photo.id)) URL.revokeObjectURL(photo.src);
    }
    setPhotos(next);
  };

  const onCancelUpload = (id: string) => {
    readers.current.get(id)?.abort();
  };

  const empty = photos.length === 0;
  const working = uploads.length > 0;

  /**
   * The gate, and the caption's second line that explains it.
   *
   * Disabled while the step has no answer, and disabled while the browser is
   * still resizing — a host who presses Continue mid-resize would leave with
   * photos the next step never received. The primary keeps its size, its place
   * and its label either way (§4); only the fill changes, and `.capnote` is a
   * fixed slot, so answering the question never shoves the page.
   *
   * A refusal does NOT disable it. The photos already added are fine, and one
   * rejected file must not hold the step hostage (`hw-005` panel D).
   */
  const note = empty
    ? "Add at least one photo to continue."
    : working
      ? "The photos you just added are still being resized."
      : "Nothing you enter is saved yet.";

  return (
    <WizardStep
      step={6}
      stepName="Photos"
      note={note}
      backHref="/host/listings/new/practical-facts"
      nextHref="/host/listings/new/title-description"
      nextDisabled={empty || working}
    >
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">Photos of your place</h1>
        <p className="mt-2 max-w-[56ch] text-bodyMd font-regular text-secondary">
          Guests decide from what they see here. Wide, daylit, and the same rooms they will walk into
          on arrival.
        </p>
      </div>

      {/*
        Drag-to-reorder is STATED, in words, and the sentence says the drag is
        optional — because the menu beside it makes every move the drag makes,
        and a drag-only reorder is unusable from a keyboard and awkward on a
        touchscreen. The card writes "its ⋯ menu"; the button it describes draws
        three dots VERTICALLY and its accessible name is "Options for the
        photo", so the prose here says `options menu` and points at the control
        that exists rather than at a horizontal ellipsis that does not.
      */}
      <p className={hintRow}>
        <PhotoFrameIcon className="mt-0.5 size-4 flex-none text-tertiary" />
        {empty ? (
          <span>
            Start with the room you would show a guest first.{" "}
            <b className="font-semibold text-primary">Whatever you add first becomes your cover</b>,
            and you can change it at any time from that photo&rsquo;s options menu.
          </span>
        ) : (
          <span>
            <b className="font-semibold text-primary">The first photo is your cover</b> — it is the
            one guests see in search results. Drag a photo to move it, or open its options menu;
            every move works both ways, so nothing here needs a drag.
          </span>
        )}
      </p>

      {/*
        The page-level register of an error, above the form, with a named
        recovery action (HOST-SHELL §11.3). Border, no shadow — it bounds a
        message, it does not float over one (TASTE §1).

        `role="status"` is the one thing here the card cannot draw: a refusal
        that only appears is a refusal a screen-reader user has to go looking
        for. Polite, not `alert` — a file the host can simply add again is not
        an interruption. The inline line under the dropzone carries no role, so
        nothing is announced twice.
      */}
      {refusal === null ? null : (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-lg border border-error-border bg-error-bg p-4"
        >
          <AlertCircleIcon className="mt-0.5 size-5 flex-none text-error" />
          <div className="max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
            <p>{refusal.banner}</p>
            <a href={`#${ANCHOR}`} className={`mt-2 inline-block text-bodySm ${inlineAction}`}>
              Go to the upload
            </a>
          </div>
        </div>
      )}

      {/*
        A real `<form>` (HOST-SHELL §11.1), and a submit that is stopped rather
        than pointed at a route. The action bar's primary is a link owned by
        `WizardStep`, and this step has exactly one text-ish control path, which
        is the shape where a browser fires implicit submission on Enter. Letting
        that through would reload the page and drop every blob the host just
        added. The `id` is here so the shell can adopt the form the day a submit
        target exists.
      */}
      <form id="photos-form" onSubmit={(event) => event.preventDefault()}>
        <section className={section} aria-labelledby="photos-grid-h">
          <h2 id="photos-grid-h" className={sectionTitle}>
            Your photos
          </h2>
          <p className={sectionSub}>The order below is the order guests scroll.</p>

          <PhotoUpload
            id={ANCHOR}
            labelledBy="photos-grid-h"
            photos={photos}
            onPhotosChange={onPhotosChange}
            onFilesChosen={onFilesChosen}
            uploads={uploads}
            onCancelUpload={onCancelUpload}
            onReplacePhoto={(id, file) => void addFile(file, id)}
            rejection={refusal === null ? null : { message: refusal.inline }}
            strings={strings}
          />
        </section>

        <section className={section} aria-labelledby="photo-guidance-h">
          <h2 id="photo-guidance-h" className={sectionTitle}>
            What makes a photo work
          </h2>
          <p className={sectionSub}>Four habits, not a standard to pass.</p>

          <ul className="mt-4">
            {guidance.map((item) => (
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
      </form>
    </WizardStep>
  );
}
