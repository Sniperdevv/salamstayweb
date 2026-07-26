"use client";

import {
  useCallback,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";
import { InfoIcon, PinIcon } from "@/components/icons";
import { Segment, Segmented } from "@/components/ui/segmented";
import { btnSecondary, focusRing } from "@/components/ui";

/**
 * The listing wizard's location step — `hw-006-wizard-location.html`, built in
 * Tailwind against `@salamstay/design-tokens` rather than ported from the
 * card's stylesheet (BUILD-DECISIONS ruling 0).
 *
 * It owns the map, the centre-locked pin, the guest-facing circle and the
 * precision control. It does NOT own the address fields, the cantonment banner
 * or the action bar — those are the page's, and the address fields in
 * particular are the reason this component is allowed to be a picture (below).
 *
 * DECISION 1 — THE MAP NAMES NO PROVIDER AND CLAIMS NO ACCURACY.
 * What is drawn is an inline SVG street schematic on themed surface roles. No
 * tiles are fetched, nothing is hotlinked, no attribution strip is drawn and no
 * script is loaded — the tile source is undecided in every file in this
 * repository, so drawing an attribution would be picking the vendor by
 * accident. `HA-020`'s "Placed within about 30 m of your address" is NOT
 * carried forward: it is a geocoding-accuracy figure with no source. Nothing
 * here states how close the pin lands, how wide the circle is, or how far the
 * offset runs. The copy states the MECHANISM and no number at all.
 *
 * DECISION 2 — CENTRE-LOCK, NOT A DRAGGABLE PIN.
 * The pin does not move. It stands on a ground mark at the geometric centre and
 * the MAP moves underneath it (DESIGN §8.6). The target never leaves the
 * screen, one gesture does the whole job on a trackpad and a phone alike, and
 * the exact point is at a known place so the ground mark can be drawn once and
 * be right forever. **The map is never the only path**: the address fields
 * above it are the accessible input and the pin follows them, so a host who
 * never touches this component still finishes the step.
 *
 * DECISION 3 — THE CIRCLE IS OFFSET FROM THE PIN, AND SAYS SO.
 * DESIGN §8.6 specifies the guest-facing circle on a *jittered* centre, never
 * the exact pin. `HA-020` draws it concentric, which quietly promises the
 * opposite: that the circle's middle is the house. This draws the offset
 * visibly and the caption under the map says so in words. It costs one
 * translate and it is the difference between a preview and a diagram.
 *
 * DECISION 4 — THE PIN AND THE CIRCLE ARE INK, NOT BRAND.
 * HOST-SHELL §7 caps the wizard surface at three brand roles — the wordmark
 * dot, the progress bars and the one enabled primary — and TASTE §2's four
 * roles do not include a map overlay, while §3 puts selection on ink. A pin is
 * the selection of a point, so it resolves through `interactive.selectedFill`
 * and inverts with the theme for free: near-black on a pale map, near-white on
 * a dark one, which a brightened green pin could not do without becoming a
 * fourth green role.
 *
 * WHAT A REAL MAP INTEGRATION WOULD ADD
 * -------------------------------------
 * DESIGN §5 / §8.6 name MapLibre, and its keyboard and ARIA contract is what
 * this component already implements — a focusable, labelled container that pans
 * on arrow keys — so the substrate can be swapped for a real map without the
 * accessibility story changing. What it cannot do today it deliberately does
 * not fake: there is no projection here, so it emits no coordinate. `onAdjusted`
 * fires when a pan settles and carries no payload; the build replaces it with
 * the map instance's own settle event and reads the centre off the map.
 */

/* ——— Icons ——————————————————————————————————————————————————————————————
 *
 * Local to this file: the schematic's own marks, from `hw-006`'s paths. Every
 * one sits beside a real label, so all are `aria-hidden`.
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

/** The "drag the map" chip's mark — four arrows out of a cross. */
function DragMapIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M12 3v18M3 12h18" />
      <path d="M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3" />
    </Glyph>
  );
}

/** The map, still coming. */
function LayersIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z" />
      <path d="M9 4v13M15 6.5v13" />
    </Glyph>
  );
}

/** The map, not coming. */
function LayersOffIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z" />
      <path d="M4 4l16 16" />
    </Glyph>
  );
}

/**
 * The pin itself — solid, standing on the point rather than hovering over it.
 *
 * `currentColor` so it can resolve through `interactive.selectedFill` on the
 * wrapper and invert with the theme; the eye is `interactive.selectedFg`, which
 * is the label colour that role always travels with.
 */
function PinMark({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 26 34" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M13 1c6.1 0 11 4.9 11 11 0 7.6-11 21-11 21S2 19.6 2 12C2 5.9 6.9 1 13 1z"
        fill="currentColor"
      />
      <circle cx="13" cy="12" r="4.2" className="fill-selected-fg" />
    </svg>
  );
}

/* ——— Geometry ————————————————————————————————————————————————————————————
 *
 * Drawing numbers, not design tokens — the same class of value as the `d`
 * attribute of a path or the anchor of a map label. They describe where things
 * sit inside a picture; nothing here is a colour, a spacing rung or a duration.
 */

/**
 * The substrate is drawn 120% of the box in both axes and centred, so panning
 * reveals more drawing rather than bare ground. The pan is clamped to the
 * overscan, which is what keeps the box covered at every offset.
 */
const OVERSCAN = 0.1;

/** One arrow press moves the view by this fraction of the box. Shift × 4. */
const NUDGE = 0.025;
const NUDGE_FAST = 4;

/**
 * Where the three street names sit, as fractions of the OVERSCANNED layer — so
 * they pan with the roads they name and stay at real CSS type sizes instead of
 * being scaled by the SVG viewport transform. The names are properties of the
 * address, so they arrive as a prop; only the anchors live here.
 */
const LABEL_ANCHORS = ["left-[12.5%] top-[30%]", "left-[43%] top-[75%]", "left-[73%] top-[75%]"] as const;

const clamp = (value: number, limit: number): number =>
  value < -limit ? -limit : value > limit ? limit : value;

/* ——— Copy ———————————————————————————————————————————————————————————————— */

export type LocationMapState = "blank" | "loading" | "ready" | "failed";
export type LocationPrecision = "neighbourhood" | "city";

/**
 * Every visible string, so the `/ur/` route supplies its own set rather than
 * this component carrying two languages. Defaults are `hw-006`'s English.
 */
export interface LocationPickerStrings {
  /** The chip in the map's top corner. */
  readonly dragChip: string;
  /**
   * Read only by assistive tech, and it says the thing the chip cannot fit:
   * that the arrow keys work, and that the address above is what actually
   * places the pin.
   */
  readonly adjustHint: string;
  /** Under the map. The circle's offset is stated, not implied. */
  readonly caption: ReactNode;
  readonly blankTitle: string;
  readonly blankBody: string;
  readonly loadingTitle: string;
  readonly loadingBody: string;
  readonly failedTitle: string;
  readonly failedBody: string;
  readonly retry: string;
  readonly precisionLabel: string;
  readonly neighbourhood: string;
  readonly cityOnly: string;
  /** The sentence under the segmented control. `publicLine` is the payload. */
  readonly precisionHint: (publicLine: ReactNode) => ReactNode;
  /** Shown only in the City-only position. A real trade, stated as one. */
  readonly cityTradeOff: ReactNode;
}

export const locationPickerStringsEn: LocationPickerStrings = {
  dragChip: "Drag the map",
  adjustHint:
    "Drag the map, or use the arrow keys, to move the pin. The address above places the pin; this only refines it.",
  caption: (
    <>
      The dashed circle is what guests see before they book, and{" "}
      <b className="font-semibold text-secondary">its middle is not your pin</b> — we shift it on purpose so
      the circle cannot be read backwards into an address.
    </>
  ),
  blankTitle: "No pin yet",
  blankBody: "Fill in the address above and the pin appears here. You can move it afterwards.",
  loadingTitle: "Bringing up the map",
  loadingBody: "The rest of this page works while you wait — the address is what sets your location.",
  failedTitle: "The map did not load",
  failedBody:
    "Your address is saved and it is what places you on the site. You can come back and adjust the pin any time from your listing page.",
  retry: "Try again",
  precisionLabel: "How much of the location is public",
  neighbourhood: "Neighbourhood",
  cityOnly: "City only",
  precisionHint: (publicLine) => (
    <>
      Guests browsing will read <b className="font-semibold text-secondary">{publicLine}</b>. Either way,{" "}
      <b className="font-semibold text-secondary">
        your street address is only shared after a booking is confirmed
      </b>{" "}
      — that part is not a setting.
    </>
  ),
  cityTradeOff: (
    <>
      <b className="font-semibold text-primary">Fewer people will find you this way.</b> Most guests search by
      area, so a listing that names only its city turns up in fewer of those searches. It is a real trade and
      it is yours to make.
    </>
  ),
};

/* ——— Recipes ————————————————————————————————————————————————————————————— */

/**
 * The map box. Border and NO shadow: TASTE §1 — it is a form control, not a
 * floating thing. Every non-ready state is the same box at the same aspect,
 * radius and border weight, so the page never jumps when the map resolves.
 *
 * TWO RATIOS RATHER THAN THE CARD'S TWO HEIGHTS. `hw-006` fixes 264px wide and
 * 220px below 820, and the spacing scale tops out at 96 — no vertical rung can
 * spell either number, and a raw `h-[264px]` is exactly the literal the token
 * rules exist to stop. The two ratios land on both of the card's heights at the
 * widths the card measures them at: 3:2 puts a 340px narrow column at 227, and
 * 600/264 puts the 592px content column at 260. The shipped guest map expresses
 * its own height the same way.
 */
const mapBox =
  "relative mt-4 aspect-[3/2] w-full overflow-hidden rounded-lg border min-[820px]:aspect-[600/264]";

/**
 * A chip sitting ON the map. Opaque `bg.canvas` plus `elevation.onMedia` —
 * a map is media, and that shadow exists for exactly this: legibility on ground
 * whose colour nothing can predict (TASTE §1, §10 map controls).
 */
const mapChip =
  "pointer-events-none absolute inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 " +
  "text-bodySm font-semibold shadow-on-media";

/** The centred message the three non-ready states share. */
const mapMessage =
  "absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center";

/* ——— The map ————————————————————————————————————————————————————————————— */

export interface LocationMapProps {
  readonly state: LocationMapState;
  /**
   * The box's accessible name — the drawing, described. It is the only route a
   * screen reader has to what the picture shows, so it names the pin AND the
   * off-centre circle.
   */
  readonly mapLabel: string;
  /** The area chip in the map's bottom corner. Omit and no chip is drawn. */
  readonly areaLabel?: string;
  /** Up to three street or area names placed on the schematic. */
  readonly labels?: readonly string[];
  /** `failed` only. Without it the state ships no recovery, which is a dead end. */
  readonly onRetry?: () => void;
  /**
   * Fired when a pan settles. It carries NO coordinate: there is no projection
   * in this component to produce one, and inventing a number here would be
   * inventing the accuracy claim `hw-006` deleted. The build replaces this with
   * the map instance's settle event.
   */
  readonly onAdjusted?: () => void;
  readonly strings?: LocationPickerStrings;
  readonly className?: string;
}

export function LocationMap({
  state,
  mapLabel,
  areaLabel,
  labels = [],
  onRetry,
  onAdjusted,
  strings = locationPickerStringsEn,
  className = "",
}: LocationMapProps) {
  const reactId = useId();
  const hintId = `${reactId}-hint`;
  const captionId = `${reactId}-caption`;

  const boxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  /**
   * The pan lives in a ref and is written straight to the node's `transform`.
   *
   * A pointer drag produces a value every frame, and a value that goes through
   * `useState` re-renders the whole subtree every frame — which on the phones
   * this market runs is the difference between a map that follows the thumb and
   * one that stutters behind it. Nothing else on the page reads the offset, so
   * there is nothing for state to be the source of truth FOR.
   */
  const offset = useRef({ x: 0, y: 0 });
  const drag = useRef<{ readonly pointerId: number; readonly x: number; readonly y: number } | null>(null);

  const panTo = useCallback((x: number, y: number) => {
    const box = boxRef.current;
    const layer = layerRef.current;
    if (box === null || layer === null) return;
    offset.current = {
      x: clamp(x, box.clientWidth * OVERSCAN),
      y: clamp(y, box.clientHeight * OVERSCAN),
    };
    layer.style.transform = `translate3d(${offset.current.x}px, ${offset.current.y}px, 0)`;
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // A second finger arriving mid-drag must not become the drag: without this
    // the map jumps to wherever the new contact landed.
    if (drag.current !== null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX - offset.current.x,
      y: event.clientY - offset.current.y,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (active === null || active.pointerId !== event.pointerId) return;
    panTo(event.clientX - active.x, event.clientY - active.y);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (active === null || active.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onAdjusted?.();
  };

  /**
   * Arrow keys pan the VIEW in the arrow's direction, which is the same
   * convention every map on the web uses and the opposite of moving the pin —
   * the pin is centre-locked and has no direction of its own.
   *
   * They do NOT mirror under RTL. The calendar mirrors its arrows because the
   * grid mirrors; geography does not, and a host in Rawalpindi pressing the
   * right arrow means east in either language.
   *
   * Nothing eases: a key repeated dozens of times is the one case where
   * animation reads as lag rather than polish.
   */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (box === null) return;
    const scale = NUDGE * (event.shiftKey ? NUDGE_FAST : 1);
    const stepX = box.clientWidth * scale;
    const stepY = box.clientHeight * scale;
    const { x, y } = offset.current;

    if (event.key === "ArrowLeft") panTo(x + stepX, y);
    else if (event.key === "ArrowRight") panTo(x - stepX, y);
    else if (event.key === "ArrowUp") panTo(x, y + stepY);
    else if (event.key === "ArrowDown") panTo(x, y - stepY);
    else return;

    event.preventDefault();
    onAdjusted?.();
  };

  const caption = (
    <p
      id={captionId}
      className="mt-3 flex max-w-[62ch] items-start gap-2 text-label font-regular leading-relaxed text-tertiary"
    >
      <InfoIcon className="mt-0.5 size-4 flex-none" />
      <span>{strings.caption}</span>
    </p>
  );

  if (state !== "ready") {
    const copy =
      state === "blank"
        ? { icon: <PinIcon className="size-6" />, title: strings.blankTitle, body: strings.blankBody }
        : state === "loading"
          ? { icon: <LayersIcon className="size-6" />, title: strings.loadingTitle, body: strings.loadingBody }
          : { icon: <LayersOffIcon className="size-6" />, title: strings.failedTitle, body: strings.failedBody };

    return (
      <div className={className}>
        <div className={`${mapBox} border-dashed border-border-default bg-sunken`}>
          <div
            className={
              `${mapMessage} ` +
              // Opacity only, and never a shimmer sweep: TASTE §11.20 puts this
              // product on zero gradients. Reduced motion stops it dead while
              // the box and its sentence stay exactly where they are.
              (state === "loading" ? "animate-pulse motion-reduce:animate-none" : "")
            }
          >
            <span aria-hidden="true" className="text-tertiary">
              {copy.icon}
            </span>
            <span className="text-bodySm font-semibold text-primary">{copy.title}</span>
            <span className="max-w-[40ch] text-label font-regular leading-relaxed text-secondary">
              {copy.body}
            </span>
            {state === "failed" && onRetry !== undefined ? (
              <button type="button" onClick={onRetry} className={`mt-2 ${btnSecondary}`}>
                {strings.retry}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={boxRef}
        // MapLibre's own contract: a focusable, labelled container that pans on
        // arrow keys. `group` rather than `region` — a landmark per map inside a
        // wizard form is noise in the landmark list, and this is a grouping of
        // marks, not a section of the page.
        role="group"
        tabIndex={0}
        aria-label={mapLabel}
        aria-describedby={`${hintId} ${captionId}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Required for `pointermove` to arrive during a touch drag. The map is a
        // fraction of the step's height, so there is page above and below it to
        // scroll from.
        className={`${mapBox} group touch-none border-border-default bg-sunken cursor-grab active:cursor-grabbing ${focusRing}`}
      >
        {/* The ground. Drawn at 120% and centred, so a pan reveals more drawing
            rather than bare fill. Nothing is fetched: no tiles, no script, no
            attribution strip, and therefore no vendor picked by accident.

            `slice`, not `none`: the box carries two aspect ratios across the
            820 breakpoint, and a non-uniform scale would render the vertical
            roads thinner than the horizontal ones at exactly one of them. */}
        <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute -inset-[10%]">
          <svg
            viewBox="0 0 600 264"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full"
          >
            {/* Open ground and water: one neutral step off the map's fill, so
                the schematic has depth without a single invented hue. A green
                park would read as a fifth brand role on a surface HOST-SHELL §7
                caps at three. */}
            <ellipse cx="512" cy="46" rx="120" ry="62" className="fill-canvas" />
            <ellipse cx="58" cy="234" rx="94" ry="42" className="fill-canvas" />
            <path d="M0 96 L600 96" className="fill-none stroke-border-default" strokeWidth={11} strokeLinecap="round" />
            <path d="M0 196 L600 196" className="fill-none stroke-hairline" strokeWidth={6} strokeLinecap="round" />
            <path d="M180 0 L180 264" className="fill-none stroke-hairline" strokeWidth={6} strokeLinecap="round" />
            <path d="M420 96 L420 264" className="fill-none stroke-hairline" strokeWidth={6} strokeLinecap="round" />
            <path d="M420 196 L600 236" className="fill-none stroke-hairline" strokeWidth={6} strokeLinecap="round" />
            <path
              d="M0 26 L600 50"
              className="fill-none stroke-border-default"
              strokeWidth={2.5}
              strokeDasharray="9 7"
            />
          </svg>

          {LABEL_ANCHORS.map((anchor, i) => {
            const label = labels[i];
            return label === undefined ? null : (
              <span
                key={anchor}
                className={`absolute whitespace-nowrap text-caption font-medium text-secondary ${anchor}`}
              >
                {label}
              </span>
            );
          })}
        </div>

        {/* The guest-facing circle. Ink-weight and DELIBERATELY off-centre from
            the pin: a concentric circle silently promises that its middle is the
            address, and this one says the opposite in the caption below. It does
            not pan — the jitter is computed from the pin, so it travels with the
            pin, not with the ground.

            `border.strong` rather than an ink alpha: over this fill it resolves
            to the same value the card's `rgba(ink,.34)` does, in BOTH themes, and
            it is a role the token set actually owns. Same pair the shipped guest
            listing map draws. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[70%] -translate-x-1/2 -translate-y-1/2"
        >
          <span className="block size-full -translate-x-[16%] translate-y-[9%] rounded-full border border-dashed border-border-strong bg-raised" />
        </span>

        {/* The centre-locked mark: a zero-size point at the exact centre. The
            ground mark is flat rather than a crosshair — with a pin STANDING on
            the point, a crosshair's upper arm is permanently behind the pin's
            body, so it would only ever be drawn half. */}
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-0">
          <span className="absolute left-1/2 top-1/2 h-1 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-strong" />
          <PinMark
            className={
              "absolute bottom-0 left-1/2 h-8 w-6 -translate-x-1/2 text-selected " +
              // Picked up, not pressed — the one lift on this surface, and the
              // only place the difference is worth drawing. Reduced motion takes
              // the transform and leaves the pin exactly where it is.
              "transition-transform duration-instant ease-decelerate group-active:-translate-y-1 " +
              "motion-reduce:transition-none motion-reduce:group-active:translate-y-0"
            }
          />
        </span>

        {areaLabel === undefined ? null : (
          <span className={`${mapChip} bottom-3 start-3 text-primary`}>{areaLabel}</span>
        )}

        <span className={`${mapChip} top-3 end-3 text-secondary`}>
          <DragMapIcon className="size-4" />
          {strings.dragChip}
        </span>
      </div>

      {/* Outside the box on purpose: `aria-describedby` reaches it wherever it
          lives, and inside the group it would be read twice — once as the
          description and once as the group's own content. It says the thing the
          chip cannot fit, including that the arrow keys work. */}
      <span id={hintId} className="sr-only">
        {strings.adjustHint}
      </span>

      {caption}
    </div>
  );
}

/* ——— The precision control ——————————————————————————————————————————————— */

export interface LocationPrecisionControlProps {
  readonly value: LocationPrecision;
  readonly onChange: (value: LocationPrecision) => void;
  /**
   * The shared `name` for the two radios. Not cosmetic: it is what the browser
   * groups them by, and two controls on one page sharing a name become one.
   */
  readonly name: string;
  /**
   * The line guests will actually read, composed by the page from the address —
   * `Saddar, Rawalpindi Cantt` in one position, `Rawalpindi` in the other. The
   * component never derives it: how narrowly an address is written is content,
   * not layout.
   */
  readonly publicLine: ReactNode;
  readonly strings?: LocationPickerStrings;
  readonly className?: string;
}

/**
 * What this control honestly controls: HOW NARROWLY THE PUBLIC LOCATION LINE IS
 * WRITTEN. It does not offer to reveal the exact pin before a booking, because
 * DESIGN §8.6 states flatly that a listing shows only the circle until a booking
 * is confirmed — a toggle that could switch that off would be a product decision
 * dressed as a design detail. The second half of the hint is byte-identical in
 * both positions on purpose: the street address is not a setting, and the
 * sentence that says so must not read as though it were negotiable.
 *
 * IT NO LONGER DRAWS ITS OWN TRACK (2026-07-26)
 * ---------------------------------------------
 * This shipped with a hand-rolled `bg.sunken` track, `peer`-driven ink
 * selection and a `max-[820px]:flex-col` stack — an independent implementation
 * of the object `components/ui/segmented.tsx` now owns. Two renderings of one
 * control diverge; the only question is when. So the whole track is the shared
 * primitive and this component keeps what is genuinely its own: the copy, the
 * `LocationPrecision` union, and the city-only trade-off block below the track.
 *
 * Three visual consequences, all of them the primitive's decisions and all of
 * them accepted rather than worked around:
 *  · the segment label is `label` (13) where this drew `bodySm` (14); the card
 *    sets 13.5 and there is no 13.5 on the scale.
 *  · the hint sits at `mt-2`/`leading-normal` where this drew `mt-3`/relaxed.
 *  · the stack breakpoint is `md` (768) where this pinned the card's 820. 820 is
 *    not a rung and the raw variant was the only raw px left in this file;
 *    `stack` is the primitive's answer and it is already flagged there.
 *
 * The hint also gains something: `Segmented` wires it to the group with
 * `aria-describedby`, so it is read as part of the control instead of being
 * stranded as nearby prose — which is what it was here.
 */
export function LocationPrecisionControl({
  value,
  onChange,
  name,
  publicLine,
  strings = locationPickerStringsEn,
  className = "",
}: LocationPrecisionControlProps) {
  return (
    <div className={className}>
      <Segmented
        name={name}
        value={value}
        /*
         * Narrowed rather than cast. `Segmented` speaks `string` because it has
         * no way to know a caller's union, and `as LocationPrecision` would make
         * an unknown value type-check its way into the listing's public location
         * line. Two segments exist; anything else is not a precision.
         */
        onChange={(next) => {
          if (next === "neighbourhood" || next === "city") onChange(next);
        }}
        label={strings.precisionLabel}
        hint={strings.precisionHint(publicLine)}
        stack
        className="mt-4"
      >
        <Segment value="neighbourhood">{strings.neighbourhood}</Segment>
        <Segment value="city">{strings.cityOnly}</Segment>
      </Segmented>

      {value === "city" ? (
        <p className="mt-4 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary">
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>{strings.cityTradeOff}</span>
        </p>
      ) : null}
    </div>
  );
}

/* ——— Both, composed ————————————————————————————————————————————————————— */

export interface LocationPickerProps extends LocationMapProps {
  readonly precision: LocationPrecision;
  readonly onPrecisionChange: (value: LocationPrecision) => void;
  readonly precisionName?: string;
  readonly publicLine: ReactNode;
  /**
   * Between the map and the precision control the page puts its own `<h2>` and
   * `.sec-sub` — the two are separate `fsec` sections in the card, not one
   * block. Compose them yourself when the step needs the heading between them;
   * this convenience wrapper is for the case where it does not.
   */
  readonly precisionClassName?: string;
}

export function LocationPicker({
  precision,
  onPrecisionChange,
  precisionName = "location-precision",
  publicLine,
  precisionClassName = "",
  ...map
}: LocationPickerProps) {
  return (
    <>
      <LocationMap {...map} />
      <LocationPrecisionControl
        value={precision}
        onChange={onPrecisionChange}
        name={precisionName}
        publicLine={publicLine}
        className={precisionClassName}
        // `exactOptionalPropertyTypes` — an omitted `strings` and a `strings` of
        // `undefined` are different things here, and only the first one falls
        // through to the default.
        {...(map.strings === undefined ? {} : { strings: map.strings })}
      />
    </>
  );
}

export default LocationPicker;
