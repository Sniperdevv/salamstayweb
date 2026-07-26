"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent as ReactChangeEvent,
  type DragEvent as ReactDragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";
import { RetryIcon } from "@/components/icons";
import {
  controlRing,
  focusRing,
  inlineAction,
  pressableCircle,
  pressableSurface,
} from "@/components/ui";
import { PlusIcon } from "./host-icons";

/**
 * The listing wizard's photo step — `hw-005-wizard-photos.html`, built in
 * Tailwind against `@salamstay/design-tokens` rather than ported from the
 * card's stylesheet (BUILD-DECISIONS ruling 0).
 *
 * It owns the dropzone, the in-flight rows, the arranged grid, the cover mark
 * and the per-photo menu. It does NOT own the step's `h1`, the `ghint`, the
 * page-level error banner, the photographic guidance rows or the action bar —
 * those belong to the page, and a primitive that drew them could not be reused
 * by the edit-a-listing surface HOST-SHELL §16 names as undrawn.
 *
 * THE FOUR THINGS THIS COMPONENT WILL NOT DO
 * ------------------------------------------
 * 1. **No scrim, ever.** TASTE §9 is absolute: zero overlays, zero darkening,
 *    no text on a photograph. The cover badge and the two tile controls are
 *    OPAQUE `bg.canvas` surfaces carrying `elevation.onMedia` — the treatment
 *    TASTE §10 specifies for a badge pill over media — and the room name lives
 *    in `alt` and in the menu button's accessible name, never burnt onto the
 *    image.
 * 2. **The cover mark is a frame, not a star.** A star is the rating glyph and
 *    this product has no ratings; borrowing it would imply one.
 * 3. **No file-size cap and no photo count.** The cap is a product decision
 *    nobody has made (`BUILD-DECISIONS.md` #11), so accepted formats are stated
 *    and nothing else is. The count is the habit that produced "Show all 24
 *    photos"; the grid is the count.
 * 4. **No drag-only reorder.** Every move a drag can make, the per-photo menu
 *    can make — the menu is the keyboard and touch path, and it is the reason
 *    the drag is allowed to exist at all.
 *
 * WHAT A REAL UPLOAD WOULD ADD, AND WHERE
 * ---------------------------------------
 * Nothing here talks to a server and no API shape is invented. `onFilesChosen`
 * hands the page the `File[]` the host picked and stops; `uploads` and
 * `rejection` are how the page tells this component what became of them. The
 * build fills in a thumbnail per accepted file, a progress source, a cancel that
 * actually aborts, and a persisted order. See the note on `strings.gridNote`
 * for the one sentence whose truth the build has to earn.
 */

/* ——— Icons ——————————————————————————————————————————————————————————————
 *
 * Local to this file rather than added to `components/host/host-icons.tsx`:
 * these glyphs exist for this one surface and `hw-005`'s own paths are the
 * source. Every one sits beside a real label or inside a labelled control, so
 * all are `aria-hidden`.
 *
 * `PlusIcon` was one of them until the host nav's `Create a listing` drew the
 * same mark. One glyph with two call sites is a shared glyph, so it moved to
 * `host-icons.tsx` and is imported above. The rule above still holds for the
 * rest: local until a second surface needs it, then promoted, never copied.
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

/**
 * The cover mark — a picture frame, and deliberately NOT a star.
 *
 * `ha-027` marks the cover with a solid star. A star is the rating glyph; this
 * product has no ratings and will not imply one, so the mark says "this is the
 * picture guests see" in the vocabulary of pictures.
 */
function CoverFrameIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 17l5-4 4 3 3-2 4 3" />
    </Glyph>
  );
}

/** The file row's leading mark — a frame with a sun in it. */
function ImageFileIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M4 18l5-4 4 3 3-2 4 3" />
    </Glyph>
  );
}

/** The dropzone's mark — a file lifting out of a tray. */
function UploadIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Glyph>
  );
}

function ArrowUpIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </Glyph>
  );
}

function ArrowDownIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </Glyph>
  );
}

function TrashIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 12h8l1-12" />
    </Glyph>
  );
}

/** The inline error's mark. Colour is never the only signal. */
function AlertCircleIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </Glyph>
  );
}

/**
 * The two solid glyphs — six dots and three. Filled rather than stroked, which
 * is the card's own treatment: at this size a stroked dot is a ring.
 */
function GripIcon({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function KebabIcon({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

/* ——— Data ———————————————————————————————————————————————————————————————— */

export interface ListingPhoto {
  /** Stable across a reorder. The tiles are keyed by it and focus follows it. */
  readonly id: string;
  /** Whatever the page can put in an `<img>` — an object URL, or a stored one. */
  readonly src: string;
  /**
   * The room, described. This is the ONLY place the room name lives: TASTE §9
   * forbids text on a photograph, so the caption `ha-027` burnt onto each tile
   * is `alt` here, where a screen reader needs it and a sighted host does not.
   */
  readonly alt: string;
}

/** A file the page has accepted and is sending. This component only draws it. */
export interface PhotoUploadInFlight {
  readonly id: string;
  readonly name: string;
  /** 0–100. A fact about that file, not a claim — printed, `.num`-isolated. */
  readonly percent: number;
}

/**
 * A file that did not go in, as the page decided it. This component never
 * decides it: whether an unsupported format is caught in the browser or by the
 * server is a build decision, and `accept` on the input is the only filtering
 * that happens here.
 */
export interface PhotoRejection {
  /** The sentence under the dropzone. It names the format AND the fix. */
  readonly message: ReactNode;
}

/* ——— Copy ———————————————————————————————————————————————————————————————— */

/**
 * Every visible string, so the `/ur/` route supplies its own set rather than
 * this component carrying two languages. Defaults are `hw-005`'s English.
 */
export interface PhotoUploadStrings {
  readonly dropTitle: string;
  /** Accepted formats and nothing else. There is no size cap to print. */
  readonly dropFormats: string;
  readonly addMore: string;
  readonly cover: string;
  readonly optionsFor: (alt: string) => string;
  readonly makeCover: string;
  readonly moveEarlier: string;
  readonly moveLater: string;
  readonly replace: string;
  readonly remove: string;
  /**
   * The note under the grid.
   *
   * BUILD NOTE — "Photos are resized in your browser before they are sent" is a
   * statement about behaviour, not a description of a picture. It is the card's
   * own sentence and it is kept, but it is only true once the build actually
   * downscales on the client before sending. If that is not implemented, this
   * string changes; it does not ship as an aspiration.
   */
  readonly gridNote: ReactNode;
  readonly emptyNote: ReactNode;
  readonly uploadingNote: ReactNode;
  /** Precedes the per-file percentage. */
  readonly sending: string;
  readonly cancel: string;
  readonly cancelUploadOf: (name: string) => string;
  readonly progressOf: (name: string) => string;
  /** Announced politely after a move the host made without a pointer. */
  readonly movedTo: (alt: string, position: number, total: number) => string;
  readonly becameCover: (alt: string) => string;
  readonly removed: (alt: string) => string;
}

export const photoUploadStringsEn: PhotoUploadStrings = {
  dropTitle: "Choose photos, or drag them here",
  dropFormats: "JPG or PNG",
  addMore: "Add more photos",
  cover: "Cover photo",
  optionsFor: (alt) => `Options for the photo: ${alt}`,
  makeCover: "Make this the cover",
  moveEarlier: "Move earlier",
  moveLater: "Move later",
  replace: "Replace this photo",
  remove: "Remove from listing",
  gridNote: (
    <>
      You can also drop files straight onto the grid.{" "}
      <b className="font-semibold text-primary">JPG or PNG.</b> Photos are resized in your browser before
      they are sent, so a slow connection is not a problem.
    </>
  ),
  emptyNote: (
    <>
      A few good photos beat a long gallery. Photos are resized in your browser before they are sent, so a
      slow connection is not a problem.
    </>
  ),
  uploadingNote: <>You can carry on adding photos while these finish.</>,
  sending: "Resized in your browser · sending",
  cancel: "Cancel",
  cancelUploadOf: (name) => `Cancel the upload of ${name}`,
  progressOf: (name) => `Upload progress for ${name}`,
  movedTo: (alt, position, total) => `${alt} moved to position ${position} of ${total}.`,
  becameCover: (alt) => `${alt} is now the cover photo.`,
  removed: (alt) => `${alt} removed from the listing.`,
};

/* ——— Recipes ————————————————————————————————————————————————————————————— */

/**
 * `ACCEPT` and `strings.dropFormats` are one decision written twice, so they sit
 * adjacent and cannot drift. HEIC is absent on purpose — it is the format the
 * card's error state exists to explain.
 */
const ACCEPT = "image/jpeg,image/png";

/**
 * The dropzone. Border, no shadow: TASTE §1 — a drop target is a form boundary,
 * not a floating thing. Padding and fill live on the two variants rather than
 * here, so a compound utility never has to out-order a shorthand.
 */
const dropBase =
  "relative flex cursor-pointer items-center gap-3 rounded-md border " +
  "transition-[border-color] duration-instant ease-decelerate " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant";

/** Compact: the row that carries an error line under it. */
const dropCompact = "bg-canvas p-4";

/**
 * The empty step's dropzone is the whole answer to the step, so it takes the
 * room the grid would have taken. Same component, more air, dashed edge.
 */
const dropBig = "flex-col justify-center gap-3 border-dashed bg-sunken px-6 py-10 text-center";

/**
 * A tile control — the ⋯ button and the grip. OPAQUE canvas plus
 * `elevation.onMedia`, never a translucent disc over a darkened photo. The
 * shadow is not a lift: it is the legibility insurance that lets a white
 * surface hold its edge on unknowable imagery (TASTE §1, §10).
 */
const tileControl =
  "grid size-8 flex-none place-items-center rounded-full bg-canvas text-primary shadow-on-media";

/** One row of the per-photo menu. */
const menuItem =
  "flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-start text-bodySm font-regular text-primary " +
  "transition-[background-color] duration-instant ease-decelerate hover:bg-raised " +
  "aria-disabled:text-disabled aria-disabled:hover:bg-transparent " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant";

/** The prose rung under the grid and under the dropzone. */
const note = "mt-3 max-w-[62ch] text-label font-regular leading-relaxed text-secondary";

/**
 * The grid's breakpoint is 820px, which is `hw-005`'s own number and not a
 * Tailwind rung — the wizard's action bar wraps there, and the grid drops to one
 * column with it so the step re-shapes once rather than twice. Written as the
 * arbitrary variant it is, exactly as the checkout calendar writes 1080.
 */
const gridShape = "mt-4 grid grid-cols-1 gap-2 min-[820px]:grid-cols-2";

/* ——— Component ——————————————————————————————————————————————————————————— */

export interface PhotoUploadProps {
  /** The arranged order. Index 0 is the cover — that is the whole model. */
  readonly photos: readonly ListingPhoto[];
  /** Every reorder, cover change and removal comes back out through here. */
  readonly onPhotosChange: (photos: readonly ListingPhoto[]) => void;
  /** What the host picked, in the order the browser gave them. */
  readonly onFilesChosen: (files: readonly File[]) => void;
  /** Files the page is sending. Each draws a geometry-matched skeleton tile. */
  readonly uploads?: readonly PhotoUploadInFlight[];
  readonly onCancelUpload?: (id: string) => void;
  /**
   * Supplied → the menu offers "Replace this photo" and opens a picker for that
   * one tile. Omitted → the row is not drawn. This component will not pretend to
   * replace a photograph it has nowhere to put.
   */
  readonly onReplacePhoto?: (id: string, file: File) => void;
  /**
   * The page's own decision about a file it would not take. Drawing it here puts
   * the error under the control at fault; the page still owns the page-level
   * banner above the section, because HOST-SHELL §11.3 wants both registers.
   */
  readonly rejection?: PhotoRejection | null;
  /** On the wrapper, so a banner's "Go to the upload" link has a target. */
  readonly id?: string;
  /** `id` of the section's `<h2>`, when the grid should be announced under it. */
  readonly labelledBy?: string;
  readonly strings?: PhotoUploadStrings;
  readonly className?: string;
}

export function PhotoUpload({
  photos,
  onPhotosChange,
  onFilesChosen,
  uploads = [],
  onCancelUpload,
  onReplacePhoto,
  rejection = null,
  id,
  labelledBy,
  strings = photoUploadStringsEn,
  className = "",
}: PhotoUploadProps) {
  const reactId = useId();
  const pickerId = `${reactId}-picker`;

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [filesOver, setFilesOver] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const replaceRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<string | null>(null);

  /**
   * Focus after a re-render, addressed by a key rather than by a node.
   *
   * A reorder moves the tile's DOM node, and a node that moves can lose focus.
   * Every control that has to survive a reorder registers itself under a stable
   * key (`photoId` for the ⋯ button, `photoId:action` for a menu row), so "put
   * focus back where the host left it" is one lookup rather than a guess about
   * what React did with the subtree.
   */
  const controls = useRef(new Map<string, HTMLElement>());
  const pendingFocus = useRef<string | null>(null);

  const register = useCallback((key: string, node: HTMLElement | null) => {
    if (node === null) controls.current.delete(key);
    else controls.current.set(key, node);
  }, []);

  useEffect(() => {
    const key = pendingFocus.current;
    if (key === null) return;
    pendingFocus.current = null;
    controls.current.get(key)?.focus();
  });

  /** A pointer press outside the open menu's tile closes it, and moves no focus. */
  useEffect(() => {
    if (openMenuId === null) return;
    const onPointerDown = (event: PointerEvent) => {
      const tile = controls.current.get(`${openMenuId}:tile`);
      if (tile !== undefined && event.target instanceof Node && tile.contains(event.target)) return;
      setOpenMenuId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenuId]);

  const total = photos.length;
  const isEmpty = total === 0 && uploads.length === 0;

  /* ——— The moves. Every one leaves through `onPhotosChange`. ——————————— */

  const applyMove = useCallback(
    /** `focusKey` is `null` for a pointer reorder: the pointer is the focus. */
    (from: number, to: number, focusKey: string | null) => {
      if (from < 0 || to < 0 || to >= photos.length || from === to) return;
      const next = photos.slice();
      const [moved] = next.splice(from, 1);
      if (moved === undefined) return;
      next.splice(to, 0, moved);
      onPhotosChange(next);
      setAnnouncement(
        to === 0 ? strings.becameCover(moved.alt) : strings.movedTo(moved.alt, to + 1, next.length),
      );
      if (focusKey !== null) pendingFocus.current = focusKey;
    },
    [photos, onPhotosChange, strings],
  );

  const removePhoto = useCallback(
    (photoId: string) => {
      const index = photos.findIndex((p) => p.id === photoId);
      const photo = photos[index];
      if (photo === undefined) return;
      const next = photos.filter((p) => p.id !== photoId);
      onPhotosChange(next);
      setAnnouncement(strings.removed(photo.alt));
      setOpenMenuId(null);
      // Focus whatever now stands in that place; at the end of the grid, the one
      // before it. An empty grid has no tile to return to, so focus falls to the
      // picker, which is the only thing left to do.
      const survivor = next[Math.min(index, next.length - 1)];
      pendingFocus.current = survivor === undefined ? pickerId : survivor.id;
    },
    [photos, onPhotosChange, strings, pickerId],
  );

  /* ——— Files ——————————————————————————————————————————————————————————— */

  const takeFiles = useCallback(
    (list: FileList | null) => {
      if (list === null || list.length === 0) return;
      onFilesChosen(Array.from(list));
    },
    [onFilesChosen],
  );

  const onPicked = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      takeFiles(event.target.files);
      // Cleared so choosing the same file twice still fires a change.
      event.target.value = "";
    },
    [takeFiles],
  );

  /* ——— Drag: photos reorder, files land ————————————————————————————————— */

  const isFileDrag = (event: ReactDragEvent): boolean =>
    Array.from(event.dataTransfer.types).includes("Files");

  /**
   * One set of handlers for every surface that says "or drag them here" — the
   * grid, the big dropzone and the compact one.
   *
   * `preventDefault` on `dragover` is not optional decoration: without it the
   * browser's default is to NAVIGATE to the dropped file, which is a host losing
   * a half-filled wizard step because they missed a 1px input.
   */
  const fileDrop = {
    onDragOver: (event: ReactDragEvent<HTMLElement>) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setFilesOver(true);
    },
    onDragLeave: (event: ReactDragEvent<HTMLElement>) => {
      // Crossing between two tiles fires `dragleave` on the grid; only leaving
      // the surface itself should put the edge back.
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      setFilesOver(false);
    },
    onDrop: (event: ReactDragEvent<HTMLElement>) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      setFilesOver(false);
      takeFiles(event.dataTransfer.files);
    },
  };

  const onTileDragOver = (event: ReactDragEvent, photoId: string) => {
    if (draggingId === null || isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverId(photoId);
  };

  const onTileDrop = (event: ReactDragEvent, photoId: string) => {
    if (draggingId === null || isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const from = photos.findIndex((p) => p.id === draggingId);
    const to = photos.findIndex((p) => p.id === photoId);
    setDraggingId(null);
    setOverId(null);
    applyMove(from, to, null);
  };

  /* ——— The menu's keyboard contract ————————————————————————————————————— */

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, photoId: string) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpenMenuId(null);
      pendingFocus.current = photoId;
      return;
    }
    if (event.key === "Tab") {
      // Not trapped: a menu is not a dialog. It closes and lets focus leave.
      setOpenMenuId(null);
      return;
    }

    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLElement);

    let next: number | null = null;
    if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % items.length;
    else if (event.key === "ArrowUp") next = current <= 0 ? items.length - 1 : current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next === null) return;

    event.preventDefault();
    items[next]?.focus();
  };

  /* ——— Render ——————————————————————————————————————————————————————————— */

  const picker = (
    <input
      id={pickerId}
      ref={(node) => {
        register(pickerId, node);
      }}
      type="file"
      className="peer sr-only"
      accept={ACCEPT}
      multiple
      onChange={onPicked}
    />
  );

  return (
    <div id={id} className={className}>
      {isEmpty ? (
        <>
          <label
            {...fileDrop}
            className={
              `mt-4 ${dropBase} ${dropBig} ` +
              (filesOver ? "border-border-strong" : "border-border-default hover:border-border-strong")
            }
          >
            {picker}
            <span aria-hidden="true" className={`${controlRing} rounded-md`} />
            <span className="grid size-12 flex-none place-items-center rounded-full border border-hairline bg-canvas text-secondary">
              <UploadIcon className="size-5" />
            </span>
            <span className="block">
              <b className="block text-bodyMd font-medium text-primary underline underline-offset-4">
                {strings.dropTitle}
              </b>
              <span className="mt-0.5 block text-label font-regular text-secondary">
                {strings.dropFormats}
              </span>
            </span>
          </label>
          <p className={note}>{strings.emptyNote}</p>
        </>
      ) : (
        <>
          <div
            {...fileDrop}
            className={gridShape}
            // `role="group"` only when there is a heading to name it with. A
            // group with no accessible name is one more boundary a screen reader
            // announces and learns nothing from.
            {...(labelledBy === undefined ? {} : { role: "group", "aria-labelledby": labelledBy })}
          >
            {photos.map((photo, index) => (
              <PhotoTile
                key={photo.id}
                photo={photo}
                index={index}
                total={total}
                strings={strings}
                menuOpen={openMenuId === photo.id}
                dragging={draggingId === photo.id}
                dropTarget={overId === photo.id && draggingId !== null && draggingId !== photo.id}
                canReplace={onReplacePhoto !== undefined}
                register={register}
                onOpenMenu={() => {
                  setOpenMenuId(photo.id);
                  pendingFocus.current = `${photo.id}:first`;
                }}
                onCloseMenu={() => {
                  setOpenMenuId(null);
                  pendingFocus.current = photo.id;
                }}
                onMenuKeyDown={(event) => onMenuKeyDown(event, photo.id)}
                onMove={(delta) =>
                  applyMove(index, index + delta, `${photo.id}:${delta < 0 ? "earlier" : "later"}`)
                }
                onMakeCover={() => applyMove(index, 0, `${photo.id}:cover`)}
                onReplace={() => {
                  replacingId.current = photo.id;
                  replaceRef.current?.click();
                }}
                onRemove={() => removePhoto(photo.id)}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  // Firefox refuses to start a drag with an empty payload.
                  event.dataTransfer.setData("application/x-salamstay-photo", photo.id);
                  setDraggingId(photo.id);
                  setOpenMenuId(null);
                }}
                onDragOver={(event) => onTileDragOver(event, photo.id)}
                onDrop={(event) => onTileDrop(event, photo.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setOverId(null);
                }}
              />
            ))}

            {/* Geometry-matched, one per file still in flight: the same 3:2 tile
                at the same radius in the same cell the photograph will occupy,
                so nothing moves when it arrives. Opacity pulse only — TASTE
                §11.20 puts this product on zero gradients, so no shimmer sweep,
                and reduced motion stops it dead without the tile moving. */}
            {uploads.map((upload) => (
              <span
                key={upload.id}
                aria-hidden="true"
                className="block aspect-[3/2] w-full animate-pulse rounded-lg bg-skeleton motion-reduce:animate-none"
              />
            ))}

            {/* The add affordance sits IN the grid when there is nothing to
                explain. A rejection replaces it with the full dropzone row
                below, which is the only anatomy that can carry an error line. */}
            {rejection === null ? (
              <label
                className={
                  "relative flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center gap-2 " +
                  "rounded-lg border border-dashed bg-sunken text-secondary " +
                  // HOST-SHELL §10's third press depth, `.995`, for a LARGE
                  // surface. `.97` on a 300px tile travels 9px and reads as the
                  // grid lurching under the pointer rather than as a press;
                  // `.995` is a 1.5px settle. This shipped with no press at all
                  // and a note saying the recipe was missing — `pressableSurface`
                  // landed in `components/ui.ts` on 2026-07-26 and the tile takes
                  // it. It also carries the border-colour and reduced-motion
                  // clauses the hand-rolled transition used to spell out.
                  `${pressableSurface} ` +
                  (filesOver ? "border-border-strong " : "border-border-default hover:border-border-strong ")
                }
              >
                {picker}
                <span aria-hidden="true" className={`${controlRing} rounded-lg`} />
                <PlusIcon className="size-5 text-tertiary" />
                <span className="text-bodySm font-medium">{strings.addMore}</span>
              </label>
            ) : null}
          </div>

          {/* One row per file in flight, plus its own progress. A percentage is
              a fact about that file, so it is printed and `.num`-isolated. */}
          {uploads.map((upload) => (
            <div key={upload.id}>
              <div className="mt-3 flex items-center gap-3 rounded-md bg-raised p-3">
                <span
                  aria-hidden="true"
                  className="grid size-8 flex-none place-items-center rounded-md border border-hairline bg-canvas text-secondary"
                >
                  <ImageFileIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  {/* A filename is one LTR token rather than a digit run inside
                      a sentence, so it takes `.num`'s isolation wholesale. */}
                  <span className="num block truncate text-bodySm font-medium text-primary">
                    {upload.name}
                  </span>
                  <span className="mt-0.5 block text-label font-regular text-secondary">
                    {strings.sending} <span className="num">{upload.percent}%</span>
                  </span>
                </span>
                {onCancelUpload === undefined ? null : (
                  <button
                    type="button"
                    onClick={() => onCancelUpload(upload.id)}
                    aria-label={strings.cancelUploadOf(upload.name)}
                    className={`flex-none text-bodySm ${inlineAction}`}
                  >
                    {strings.cancel}
                  </button>
                )}
              </div>
              <div
                role="progressbar"
                aria-valuenow={upload.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={strings.progressOf(upload.name)}
                className="mt-2 h-1 overflow-hidden rounded-full bg-sunken"
              >
                {/* Never eased: the bar reports a measurement, and a bar that
                    animates toward a number is telling a story about a number it
                    does not have yet. */}
                <span
                  className="block h-full rounded-full bg-selected"
                  style={{ width: `${upload.percent}%` }}
                />
              </div>
            </div>
          ))}

          {rejection === null ? null : (
            <div className="mt-4">
              <label {...fileDrop} className={`${dropBase} ${dropCompact} border-error`}>
                {picker}
                <span aria-hidden="true" className={`${controlRing} rounded-md`} />
                <span className="grid size-10 flex-none place-items-center rounded-full bg-raised text-secondary">
                  <UploadIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-bodyMd font-medium text-primary underline underline-offset-4">
                    {strings.dropTitle}
                  </b>
                  <span className="mt-0.5 block text-label font-regular text-secondary">
                    {strings.dropFormats}
                  </span>
                </span>
              </label>
              {/* The ERROR register, because an unsupported format is a fact
                  about the FILE (BUILD-DECISIONS #11). A review outcome takes
                  the warning register instead; there is never a red mark on a
                  person or a family document. */}
              <p className="mt-3 flex max-w-[62ch] items-start gap-2 text-label font-regular leading-relaxed text-error">
                <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
                <span>{rejection.message}</span>
              </p>
            </div>
          )}

          <p className={note}>{uploads.length > 0 ? strings.uploadingNote : strings.gridNote}</p>
        </>
      )}

      {/* The one-tile picker behind "Replace this photo". Rendered once and
          outside the grid, so a reorder cannot unmount it mid-dialog. */}
      {onReplacePhoto === undefined ? null : (
        <input
          ref={replaceRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept={ACCEPT}
          onChange={(event) => {
            const file = event.target.files?.[0];
            const target = replacingId.current;
            event.target.value = "";
            replacingId.current = null;
            if (file === undefined || target === null) return;
            onReplacePhoto(target, file);
          }}
        />
      )}

      <p className="sr-only" role="status">
        {announcement}
      </p>
    </div>
  );
}

/* ——— One tile ———————————————————————————————————————————————————————————— */

function PhotoTile({
  photo,
  index,
  total,
  strings,
  menuOpen,
  dragging,
  dropTarget,
  canReplace,
  register,
  onOpenMenu,
  onCloseMenu,
  onMenuKeyDown,
  onMove,
  onMakeCover,
  onReplace,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  readonly photo: ListingPhoto;
  readonly index: number;
  readonly total: number;
  readonly strings: PhotoUploadStrings;
  readonly menuOpen: boolean;
  readonly dragging: boolean;
  readonly dropTarget: boolean;
  readonly canReplace: boolean;
  readonly register: (key: string, node: HTMLElement | null) => void;
  readonly onOpenMenu: () => void;
  readonly onCloseMenu: () => void;
  readonly onMenuKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
  readonly onMove: (delta: number) => void;
  readonly onMakeCover: () => void;
  readonly onReplace: () => void;
  readonly onRemove: () => void;
  readonly onDragStart: (event: ReactDragEvent) => void;
  readonly onDragOver: (event: ReactDragEvent) => void;
  readonly onDrop: (event: ReactDragEvent) => void;
  readonly onDragEnd: () => void;
}) {
  const isCover = index === 0;
  const menuId = `${photo.id}-menu`;

  /**
   * The menu's rows, built once so the keyboard walk and the pointer see exactly
   * the same list.
   *
   * Nothing is omitted at a bound: a move that cannot happen is `aria-disabled`
   * and keeps its place, so the menu is one shape for every photo and the reason
   * a row is unavailable is visible rather than inferred from a gap (TASTE
   * §11.7, applied to a list instead of a control). `aria-disabled` rather than
   * `disabled` so the row is still reachable by the arrow walk and still
   * announces itself — a row that vanishes from the walk is a row the host
   * cannot find out about.
   */
  const items: readonly {
    readonly key: string;
    readonly label: string;
    readonly icon: ReactNode;
    readonly disabled: boolean;
    readonly separated: boolean;
    readonly run: () => void;
  }[] = [
    {
      key: "cover",
      label: strings.makeCover,
      icon: <CoverFrameIcon className="size-4 text-secondary" />,
      disabled: isCover,
      separated: false,
      run: onMakeCover,
    },
    {
      key: "earlier",
      label: strings.moveEarlier,
      icon: <ArrowUpIcon className="size-4 text-secondary" />,
      disabled: index === 0,
      separated: false,
      run: () => onMove(-1),
    },
    {
      key: "later",
      label: strings.moveLater,
      icon: <ArrowDownIcon className="size-4 text-secondary" />,
      disabled: index === total - 1,
      separated: false,
      run: () => onMove(1),
    },
    ...(canReplace
      ? [
          {
            key: "replace",
            label: strings.replace,
            icon: <RetryIcon className="size-4 text-secondary" />,
            disabled: false,
            // The hairline sits above the two rows that change the FILE rather
            // than its place in the order.
            separated: true,
            run: onReplace,
          },
        ]
      : []),
    {
      key: "remove",
      label: strings.remove,
      // INK, not `error.fg`. No host card in the corpus rules on a destructive
      // menu row, and minting a red role here would be inventing one; the word
      // and the glyph carry the meaning.
      icon: <TrashIcon className="size-4 text-secondary" />,
      disabled: false,
      separated: !canReplace,
      run: onRemove,
    },
  ];

  return (
    <div
      ref={(node) => {
        register(`${photo.id}:tile`, node);
      }}
      // Above its siblings while its menu is open, and no higher: the wizard's
      // sticky action bar sits at `z-sticky`, and pinned chrome must always win
      // against content that scrolls under it.
      className={`relative ${menuOpen ? "z-raised" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <span
        className={
          "block overflow-hidden rounded-lg bg-sunken " +
          // Ink, inset, no fill change — TASTE §3's selection language, reused
          // to say "this is where it will land".
          (dropTarget ? "ring-2 ring-inset ring-selected " : "") +
          // Transient drag feedback on the source tile, not a treatment on the
          // photograph: opacity is what reduced motion keeps, and it is gone the
          // instant the pointer is released.
          (dragging ? "opacity-50" : "")
        }
      >
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block aspect-[3/2] w-full object-cover"
        />
      </span>

      {isCover ? (
        <span className="absolute start-3 top-3 inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 text-bodySm font-semibold text-primary shadow-on-media">
          <CoverFrameIcon className="size-4 text-secondary" />
          {strings.cover}
        </span>
      ) : null}

      <span className="absolute end-3 top-3 flex items-center gap-2">
        {/* Pointer-only, and `aria-hidden` because of it: the grip starts a
            drag, and the drag is the path this component does not rely on. The
            ⋯ beside it makes every move the grip makes, from a keyboard. */}
        <span aria-hidden="true" className={`${tileControl} cursor-grab active:cursor-grabbing`}>
          <GripIcon className="size-4" />
        </span>

        <button
          type="button"
          ref={(node) => {
            register(photo.id, node);
          }}
          onClick={() => (menuOpen ? onCloseMenu() : onOpenMenu())}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          aria-label={strings.optionsFor(photo.alt)}
          // `pressableCircle`, not `pressable`: scale is optical, and .97 on a
          // 32px disc moves one pixel. §10's second depth exists for exactly
          // this size of control.
          className={`${tileControl} ${focusRing} ${pressableCircle}`}
        >
          <KebabIcon className="size-4" />
        </button>
      </span>

      {menuOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={strings.optionsFor(photo.alt)}
          onKeyDown={onMenuKeyDown}
          // The one floating element on this step, so it is the one thing that
          // casts (TASTE §1). Canvas, `radius.lg`, `elevation.popover`, no
          // border — in dark it is the shadow that does the separating.
          //
          // Sized by its longest row and capped at the tile, rather than at a
          // fixed width: the Urdu labels are longer than the English ones, and a
          // menu that fits one language and clips the other is a menu that was
          // measured once. (`overlaySize.tooltipMax` would be the tidier cap,
          // but the tokens package's `dist` predates that role reaching the
          // preset's `maxWidth`, so the class does not exist in this build.)
          className="absolute end-3 top-12 w-max max-w-full rounded-lg bg-canvas p-2 shadow-popover"
        >
          {items.map((item, i) => (
            <Fragment key={item.key}>
              {item.separated ? (
                <span aria-hidden="true" className="mx-3 my-2 block h-px bg-hairline" />
              ) : null}
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                ref={(node) => {
                  register(`${photo.id}:${item.key}`, node);
                  if (i === 0) register(`${photo.id}:first`, node);
                }}
                aria-disabled={item.disabled || undefined}
                onClick={() => {
                  if (item.disabled) return;
                  item.run();
                }}
                className={`${menuItem} ${focusRing}`}
              >
                {item.icon}
                {item.label}
              </button>
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default PhotoUpload;
