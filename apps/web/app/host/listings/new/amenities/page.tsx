"use client";

import { useState, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { InfoIcon } from "@/components/icons";
import { WizardStep } from "@/components/host/wizard-step";
import {
  controlRing,
  controlRingSelected,
  hostFieldSub,
  pressableSurface,
  tintTransition,
} from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";

/**
 * Step 4 of 9 — `/host/listings/new/amenities`.
 *
 * `hw-003-wizard-multi.html` panel C (filled) and panel D (empty, primary
 * disabled), under `HOST-SHELL.md` §5 / §11 / §12 and §16's amendments.
 *
 * THE MULTI-SELECT IS THE OPTION CARD WITH A SQUARE MARK
 * -----------------------------------------------------
 * hw-003 DECISION 1, unchanged: §5's `.ocard` anatomy in the `.ocards.two` grid,
 * with exactly one difference — the mark swaps `radius.full` for `radius.sm`.
 * **Circle = one of these. Square = any of these.** That is the only shape
 * convention in interface design users already know, it costs one token, and it
 * means multi-select needs no second component. The ring, the ink fill, the
 * white check and the no-fill-change rule are identical to the radio card that
 * step 5 draws.
 *
 * A description appears only where the label is genuinely ambiguous. "TV —
 * guests can watch television" is padding, and padding on twelve rows is a
 * screenful of nothing. Grid cells stretch, so the rows stay level regardless.
 *
 * GROUPING IS THE SHELL'S OWN `.fsec` RHYTHM, NOT A MICRO-LABEL
 * ------------------------------------------------------------
 * Three `<section>`s with a hairline and a 22/600 heading. `ha-022` groups with
 * an uppercase micro-label; that is an eyebrow, and TASTE §7 has none of them
 * anywhere on this product.
 *
 * WHAT THIS STEP DELIBERATELY DOES NOT COLLECT
 * -------------------------------------------
 * Backup power and parking. `ha-022` ships both here; step 5 collects them
 * properly — backup power as a four-way choice with a runtime, parking as a
 * three-way choice — and asking twice would let one listing contradict itself.
 * `Wi-Fi` stays, because this step collects whether it exists at all and step 5
 * collects the speed. The one `.ghint` says where the rest went, so a host does
 * not go hunting for them.
 *
 * THE ESCAPE HATCH, AND WHY THE GATE NEEDS ONE
 * -------------------------------------------
 * §11.2 requires a disabled primary that names its blocking action, and "tick at
 * least one amenity" is a dead end for a plain room that genuinely has none of
 * the twelve. So the step ships `None of these apply to this place` with the
 * consequence stated plainly — the same honesty affordance step 5 gives
 * load-shedding (§6: "says, in plain words, what the listing will read
 * instead"). The gate is then "one amenity OR the escape hatch", which has no
 * dead end. hw-003 DECISION 4 flags the gate itself as invented: the corpus does
 * not state what gates step 4.
 *
 * WHY THIS IS A CLIENT COMPONENT
 * ------------------------------
 * The gate. §3's `.capnote` is a FIXED SLOT whose text is the blocking reason
 * while the primary is disabled and the autosave line while it is enabled — so
 * the step has to know what has been ticked to write it, and a server component
 * cannot. The cost is the `metadata` export (a client page may not carry one);
 * `noindex, follow` still arrives from `app/host/layout.tsx`, which is the field
 * that matters on a host route.
 */

/* ── Glyphs ──────────────────────────────────────────────────────────────────
 *
 * The twelve amenity paths, verbatim from hw-003 panel C. They live here rather
 * than in `components/icons.tsx` because that file belongs to another agent in
 * this wave and none of these glyphs is in it yet — merge candidate, flagged,
 * not a design decision. Stroke is `iconStroke.thin`, never a literal; size is
 * set by the caller with a spacing-token class. All decorative: every one sits
 * beside a real text label, so each is `aria-hidden`.
 */

function Glyph({ children }: { readonly children: ReactNode }) {
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
      className="size-5"
    >
      {children}
    </svg>
  );
}

const WifiGlyph = (
  <Glyph>
    <path d="M2.5 9a15 15 0 0 1 19 0" />
    <path d="M5.5 12.5a10.5 10.5 0 0 1 13 0" />
    <path d="M8.5 16a6 6 0 0 1 7 0" />
    <path d="M12 19.5h.01" />
  </Glyph>
);

const KitchenGlyph = (
  <Glyph>
    <path d="M4 10h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M2.5 10h19" />
    <path d="M8 6.5V4M12 6.5V4M16 6.5V4" />
  </Glyph>
);

const HotWaterGlyph = (
  <Glyph>
    <path d="M12 3.5s4.5 5 4.5 8a4.5 4.5 0 0 1-9 0c0-3 4.5-8 4.5-8z" />
    <path d="M4 19c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0 2.7 1 4 0" />
  </Glyph>
);

const WasherGlyph = (
  <Glyph>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="13.5" r="4" />
    <path d="M7.5 6.5h.01M11 6.5h.01" />
  </Glyph>
);

const AirConGlyph = (
  <Glyph>
    <rect x="3" y="4.5" width="18" height="7" rx="2" />
    <path d="M6.5 8.5h11" />
    <path d="M7 15c0 1.5 1 1.5 1 3M12 15c0 1.5 1 1.5 1 3M17 15c0 1.5 1 1.5 1 3" />
  </Glyph>
);

const HeaterGlyph = (
  <Glyph>
    <rect x="4" y="7" width="16" height="11" rx="2" />
    <path d="M8 7v11M12 7v11M16 7v11" />
    <path d="M6 20v1.5M18 20v1.5" />
    <path d="M7 4.5c0 1 1.5 1 1.5 2" />
  </Glyph>
);

const TvGlyph = (
  <Glyph>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M9 20.5h6" />
    <path d="M12 17v3.5" />
  </Glyph>
);

const DeskGlyph = (
  <Glyph>
    <path d="M3 13h18" />
    <path d="M5 13v7M19 13v7" />
    <path d="M8 13V9.5a2 2 0 0 1 2-2h5" />
    <path d="M14 4.5h4v3.5h-4z" />
  </Glyph>
);

const LiftGlyph = (
  <Glyph>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M12 3v18" />
    <path d="M8 9.5L9.5 7 11 9.5" />
    <path d="M15 14.5L16.5 17 18 14.5" />
  </Glyph>
);

const BalconyGlyph = (
  <Glyph>
    <path d="M3 20h18" />
    <path d="M4.5 20v-7h15v7" />
    <path d="M8 13v7M12 13v7M16 13v7" />
    <path d="M7 9.5V6a5 5 0 0 1 10 0v3.5" />
  </Glyph>
);

const GardenGlyph = (
  <Glyph>
    <path d="M12 20v-6" />
    <path d="M12 14c-3.5 0-5-2-5-4.5S9 4 12 4s5 2.5 5 5.5S15.5 14 12 14z" />
    <path d="M4 20h16" />
  </Glyph>
);

const RooftopGlyph = (
  <Glyph>
    <path d="M3 8.5h18" />
    <path d="M5 8.5V20h14V8.5" />
    <path d="M8 20v-4h3v4" />
    <path d="M14 12.5h3" />
    <path d="M12 8.5V5" />
  </Glyph>
);

/* ── The amenity set ─────────────────────────────────────────────────────────
 *
 * hw-003 panel C's twelve, in its three groups and its order. `description` is
 * present on four of them and absent on the rest, which is the card's own
 * editorial call, not an oversight.
 */

interface Amenity {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly icon: ReactNode;
}

interface AmenityGroup {
  readonly id: string;
  readonly heading: string;
  readonly items: readonly Amenity[];
}

const AMENITY_GROUPS: readonly AmenityGroup[] = [
  {
    id: "essentials",
    heading: "Essentials",
    items: [
      { id: "wifi", title: "Wi-Fi", icon: WifiGlyph },
      { id: "kitchen", title: "Kitchen", description: "Guests can cook", icon: KitchenGlyph },
      {
        id: "hot-water",
        title: "Hot water",
        description: "Geyser or instant heater",
        icon: HotWaterGlyph,
      },
      { id: "washing-machine", title: "Washing machine", icon: WasherGlyph },
    ],
  },
  {
    id: "comfort",
    heading: "Comfort",
    items: [
      { id: "air-conditioning", title: "Air conditioning", icon: AirConGlyph },
      { id: "heater", title: "Heater", description: "For colder winters", icon: HeaterGlyph },
      { id: "tv", title: "TV", icon: TvGlyph },
      {
        id: "workspace",
        title: "Dedicated workspace",
        description: "A desk and a chair",
        icon: DeskGlyph,
      },
    ],
  },
  {
    id: "building",
    heading: "The building and outside",
    items: [
      { id: "lift", title: "Lift", icon: LiftGlyph },
      { id: "balcony", title: "Balcony or terrace", icon: BalconyGlyph },
      { id: "garden", title: "Garden or lawn", icon: GardenGlyph },
      {
        id: "rooftop",
        title: "Rooftop access",
        description: "Open to guests",
        icon: RooftopGlyph,
      },
    ],
  },
];

/* ── The option card, square-marked ──────────────────────────────────────────
 *
 * §5's `.ocard`: `radius.lg`, one `border.default`, `bg.canvas`, NO shadow —
 * TASTE §1 gives a form control a border and nothing to cast, and §8 puts no
 * shadow on any host surface at all.
 *
 * SELECTION IS A RING, NOT A FILL. `inset 0 0 0 2px interactive.selected`, ink
 * and never brand (TASTE §3), drawn as `ring-2 ring-inset` so the card's
 * contents never shift by the 1px a real border would cost (§5, and
 * `CHECKOUT-SHELL.md` §5's `.editing` reasoning). The same overlay carries
 * focus, because the focusable node is an `sr-only` input — see `controlRing`,
 * which compiles to `~` rather than `:has()` so a browser without `:has()` still
 * shows a focus state.
 *
 * The mark fades AND scales in from 75%, never from 0 (§10: nothing in the real
 * world appears from nothing). Reduced motion drops the transform and keeps the
 * fade. The glyph is in the DOM at rest and simply unpainted, so choosing
 * something reflows nothing.
 *
 * Sizes are rungs, not the card's px: the 36px icon disc becomes `size-10` (the
 * rung `SwitchRow` already rounded it to), the 22px mark becomes `size-5` (the
 * rung `Checkbox` and `RadioRow` already use for the same idiom), and §5's
 * 15/600 title becomes 16/600 — TASTE §7's "card titles 16/500-600", since 15 is
 * not on the type scale in either direction.
 */
function AmenityCard({
  amenity,
  checked,
  onChange,
}: {
  readonly amenity: Amenity;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}) {
  return (
    <label
      /*
        `pressableSurface` and NOT `pressableSurface` + `tintTransition`: both
        set `transition-property`, so which one wins would be decided by the
        order Tailwind happens to emit them in rather than by the order they are
        written here (`host-ui.ts` documents the same trap for `rounded-*`).
        `pressableSurface` already carries background, border, colour AND the
        `scale(.995)` press §10 budgets for a surface this size.
      */
      className={`relative flex min-h-16 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-canvas p-4 hover:border-border-strong ${pressableSurface}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        name={`amenity-${amenity.id}`}
        value={amenity.id}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`. */}
      <span
        aria-hidden="true"
        className={`${controlRing} rounded-lg ${checked ? controlRingSelected : ""}`}
      />

      <span
        aria-hidden="true"
        className="flex size-10 flex-none items-center justify-center rounded-full bg-raised text-secondary"
      >
        {amenity.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-semibold text-primary">{amenity.title}</span>
        {amenity.description ? (
          <span className="mt-1 block text-label font-regular leading-snug text-secondary">
            {amenity.description}
          </span>
        ) : null}
      </span>

      {/* The mark sits in a 24px box — the title's own line box at 16/1.5 — so it
          optically centres on the FIRST line of a card whose description wraps.
          `radius.sm`, not `full`: square = any of these. */}
      <span aria-hidden="true" className="flex h-6 flex-none items-center">
        <span
          className={`flex size-5 items-center justify-center rounded-sm border ${tintTransition} ${
            checked
              ? "border-selected bg-selected text-selected-fg"
              : "border-border-default bg-canvas text-selected-fg"
          }`}
        >
          <CheckMark
            className={`size-3 transition-[opacity,transform] duration-instant ease-standard motion-reduce:scale-100 ${
              checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
      </span>
    </label>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

export default function AmenitiesStepPage() {
  const [ticked, setTicked] = useState<readonly string[]>([]);
  const [noneApply, setNoneApply] = useState(false);

  /**
   * The two answers are mutually exclusive, and the card cannot draw that — it
   * is one static file. A place cannot both have a balcony and have none of the
   * twelve, and a form that lets a host assert both would publish a listing that
   * contradicts itself. So ticking an amenity releases the escape hatch and
   * ticking the escape hatch clears the amenities. Nothing is hidden or
   * disabled: every control stays in place and stays pressable, so the host can
   * change their mind in one click either way.
   */
  function toggleAmenity(id: string, next: boolean) {
    setTicked((current) => (next ? [...current, id] : current.filter((item) => item !== id)));
    if (next) {
      setNoneApply(false);
    }
  }

  function toggleNoneApply(next: boolean) {
    setNoneApply(next);
    if (next) {
      setTicked([]);
    }
  }

  const answered = ticked.length > 0 || noneApply;

  return (
    <WizardStep
      step={4}
      stepName="Amenities"
      /**
       * §3: the caption's second line is a FIXED SLOT — the autosave line while
       * the primary is enabled, the blocking reason while it is disabled — so
       * answering the question never shoves the page by a line. The disabled
       * string is hw-003 panel D's, verbatim.
       */
      note={
        answered
          ? "Your progress saves as you go."
          : "Tick one amenity, or the box below them, to continue."
      }
      backHref="/host/listings/new/capacity"
      nextHref="/host/listings/new/practical-facts"
      nextDisabled={!answered}
    >
      {/* `.pagehead` — 44px above the h1 is `space-11` exactly, and it belongs to
          the page head rather than to the column, which `.wzwrap` pads only at
          the bottom. */}
      <div className="pt-11">
        <h1 className="text-h3 font-semibold tracking-normal text-primary">What can guests use?</h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Tick everything this place actually has. Leave out anything a guest could not use on the
          day they arrive.
        </p>
      </div>

      {/* `.ghint` — the step's one explainer. It exists to stop a host hunting
          for the practical facts here: step 5 collects them properly, and
          collecting them twice would let one listing contradict itself. */}
      <p className="mt-6 flex items-start gap-3 text-bodySm leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-5 flex-none text-tertiary" />
        <span>
          Load-shedding, backup power, water, sui gas, Wi-Fi speed and parking all have{" "}
          <b className="font-semibold text-primary">their own step next</b> — you do not need them
          here.
        </span>
      </p>

      {/* A real `<form>` (§11.1). Navigation is the shell's sticky bar, so there
          is no submit control inside it and an implicit submission would go
          nowhere. */}
      <form onSubmit={(event) => event.preventDefault()}>
        {AMENITY_GROUPS.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`${group.id}-heading`}
            className="mt-8 border-t border-hairline pt-8"
          >
            <h2
              id={`${group.id}-heading`}
              className="text-h5 font-semibold text-primary"
            >
              {group.heading}
            </h2>

            {/* `.ocards.two`, collapsing to one column below `md`. §5 puts the
                same collapse on `.fld2` and the card's `.nar` panel mirrors it. */}
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.items.map((amenity) => (
                <AmenityCard
                  key={amenity.id}
                  amenity={amenity}
                  checked={ticked.includes(amenity.id)}
                  onChange={(next) => toggleAmenity(amenity.id, next)}
                />
              ))}
            </div>

            {/* The escape hatch, after the LAST group — it is the answer to the
                whole question, not to this section, and it has to be reachable
                without scrolling back up. */}
            {group.id === "building" ? (
              <label className="relative mt-4 flex cursor-pointer items-start gap-3 px-0.5 py-1">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  name="no-amenities"
                  checked={noneApply}
                  onChange={(event) => toggleNoneApply(event.target.checked)}
                />

                <span aria-hidden="true" className={`${controlRing} rounded-md`} />

                <span aria-hidden="true" className="flex h-6 flex-none items-center">
                  <span
                    className={`flex size-5 items-center justify-center rounded-sm border ${tintTransition} ${
                      noneApply
                        ? "border-selected bg-selected text-selected-fg"
                        : "border-border-default bg-canvas text-selected-fg"
                    }`}
                  >
                    <CheckMark
                      className={`size-3 transition-[opacity,transform] duration-instant ease-standard motion-reduce:scale-100 ${
                        noneApply ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      }`}
                    />
                  </span>
                </span>

                <span className="min-w-0 flex-1 text-bodySm text-primary">
                  None of these apply to this place
                  <span className={hostFieldSub}>
                    Your listing then shows{" "}
                    <b className="font-semibold text-secondary">no amenities list at all</b>, rather
                    than an empty one. You can still describe the place in your own words on a later
                    step.
                  </span>
                </span>
              </label>
            ) : null}
          </section>
        ))}
      </form>
    </WizardStep>
  );
}
