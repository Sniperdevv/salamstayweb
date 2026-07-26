"use client";

import { useState, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { InfoIcon } from "@/components/icons";
import { WizardStep } from "@/components/host/wizard-step";
import {
  controlRing,
  controlRingSelected,
  hostFieldLabel,
  hostFieldSub,
  pressableSurface,
  tintTransition,
} from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { Segment, Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";

/**
 * Step 5 of 9 — `/host/listings/new/practical-facts`. **The flagship step.**
 *
 * `hw-001-host-shell.html` panel A (filled) and panel C (error), with `ha-026`
 * as the phone ancestor, under `HOST-SHELL.md` §5 / §6 / §12 / §15 and §16.
 *
 * WHY THIS STEP EXISTS AND WHY IT LEADS
 * -------------------------------------
 * `SEO-RULES.md` §5 claim 7 — **`Listings show load-shedding hours and backup
 * power`** — is the registry's flagship, and `REPOSITIONING.md` makes the
 * practical facts the product's lead differentiator rather than a footnote.
 * §15's last line is the instruction: "Step 5 is the flagship step. It leads
 * with the practical facts, and its explainer carries claim 7. **Do not soften
 * it into 'amenities, continued'.**"
 *
 * So the claim is on this page, byte-exact, in the `.ghint` directly under the
 * page head — the first sentence a host reads after the question itself. It is
 * the ONE claim on this surface (§12: "If a claim appears on a host card, it is
 * that one, and it appears on the step that collects it"). Everything else here
 * is plain neutral description.
 *
 * EVERY FIGURE IS THE HOST'S, AND NOTHING IS SEEDED
 * ------------------------------------------------
 * §6, the claim-7 rule: "**Never derive a number the host did not give you.** A
 * load-shedding window or a backup runtime the host has not supplied is `not
 * stated by the host` — never estimated, rounded up, or inherited from a nearby
 * listing." hw-001's panel A ships `4 hours`, `8 hours`, `25 Mbps` and a
 * gated-parking choice; those are its worked case (host Aqib, Cantt View
 * Residence) and the card says so in its own header. **A live page opens with
 * every field blank**, because a plausible default here is a fabricated
 * disclosure about someone's home, and this is precisely the claim where
 * embellishment would do the most damage.
 *
 * The step therefore ships §6's explicit "I cannot state this reliably"
 * affordance — the load-shedding checkbox — and says in plain words what the
 * listing reads instead. The page sub-head extends the same permission to every
 * other field: "leave anything you cannot state reliably".
 *
 * WHAT GATES THE STEP — INVENTED HERE, AND FLAGGED
 * -----------------------------------------------
 * The corpus does not state it (the same gap hw-003 DECISION 4 flags for step
 * 4). What panel C DOES establish is the shape: it draws exactly one blocking
 * condition, a backup type chosen with no runtime beside it. This step extends
 * that to the two facts the flagship claim actually promises a reader:
 *
 *   1. load-shedding — a figure, OR the "not predictable" tick
 *   2. backup power — a choice, and `None` is one of them
 *   3. and, only if a backup source is on site, how long it runs
 *
 * Water, sui gas, Wi-Fi speed and parking may be left blank and show as "not
 * stated by the host". None of the three conditions is a dead end: every one of
 * them can be satisfied by an honest "there is nothing to state here".
 *
 * WHY THIS IS A CLIENT COMPONENT
 * ------------------------------
 * The gate. §3's `.capnote` is a FIXED SLOT carrying the blocking reason while
 * the primary is disabled and the autosave line while it is enabled, so the step
 * has to know what has been answered to write it. The cost is the `metadata`
 * export (a client page may not carry one); `noindex, follow` still arrives from
 * `app/host/layout.tsx`, which is the field that matters on a host route.
 */

/* ── Glyphs ──────────────────────────────────────────────────────────────────
 *
 * The ten option-card paths, verbatim from hw-001 panel A. Here rather than in
 * `components/icons.tsx` because that file belongs to another agent in this wave
 * and none of these is in it — merge candidate, flagged, not a design decision.
 * Stroke is `iconStroke.thin`, never a literal. All decorative, all `aria-hidden`.
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

const NoBackupGlyph = (
  <Glyph>
    <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
    <path d="M4 4l16 16" />
  </Glyph>
);

const UpsGlyph = (
  <Glyph>
    <rect x="3" y="8" width="18" height="9" rx="2" />
    <path d="M7 8V6M17 8V6" />
    <path d="M7.5 12.5h4" />
  </Glyph>
);

const GeneratorGlyph = (
  <Glyph>
    <rect x="3" y="7" width="18" height="11" rx="2" />
    <path d="M7 7V5h10v2" />
    <circle cx="9" cy="12.5" r="2.2" />
    <path d="M14 11h4M14 14h4" />
  </Glyph>
);

const SolarGlyph = (
  <Glyph>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
  </Glyph>
);

const MainsWaterGlyph = (
  <Glyph>
    <path d="M12 3.5s5.5 6 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5z" />
  </Glyph>
);

const TankGlyph = (
  <Glyph>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M8 9V6.5a4 4 0 0 1 8 0V9" />
    <path d="M7.5 14.5h9" />
  </Glyph>
);

const BoreholeGlyph = (
  <Glyph>
    <path d="M12 3v8" />
    <path d="M8 6.5h8" />
    <path d="M6 11h12l-1.5 9h-9z" />
  </Glyph>
);

const NoParkingGlyph = (
  <Glyph>
    <path d="M5 17h14" />
    <path d="M6 17v2M18 17v2" />
    <path d="M6.5 12l1.2-3.4A2 2 0 0 1 9.6 7.2h4.8a2 2 0 0 1 1.9 1.4L17.5 12" />
    <path d="M4 4l16 16" />
  </Glyph>
);

const StreetParkingGlyph = (
  <Glyph>
    <path d="M4 16h16" />
    <path d="M6.5 11l1.2-3.4A2 2 0 0 1 9.6 6.2h4.8a2 2 0 0 1 1.9 1.4L17.5 11" />
    <rect x="4" y="11" width="16" height="5" rx="1.5" />
    <path d="M3 20h18" />
  </Glyph>
);

const GatedParkingGlyph = (
  <Glyph>
    <rect x="3.5" y="6" width="17" height="13" rx="2" />
    <path d="M3.5 10.5h17" />
    <path d="M8 15h3" />
    <path d="M12 6V3" />
  </Glyph>
);

/* ── The option card ─────────────────────────────────────────────────────────
 *
 * §5's `.ocard`, circular mark: `radius.lg`, one `border.default`, `bg.canvas`,
 * NO shadow — §8 puts no shadow on any host surface, and TASTE §1 gives a form
 * control a border and nothing to cast.
 *
 * SELECTION IS A RING, NOT A FILL. `inset 0 0 0 2px interactive.selected` — ink,
 * never brand (TASTE §3; §7 budgets this surface three greens and a chosen card
 * is not one of them) — drawn as `ring-2 ring-inset` so the card's contents
 * never shift by the 1px a real border costs. The same overlay carries focus,
 * because the focusable node is an `sr-only` input; `controlRing` compiles to
 * `~` rather than `:has()`, so a browser without `:has()` still shows focus.
 *
 * NATIVE RADIOS, HIDDEN, NOT REBUILT. The inputs share a `name`, which is what
 * buys one tab stop, arrow-key navigation, wrap-around, Home/End, the correct
 * announcement and RTL-correct arrow direction — all from the browser, none of
 * it re-implemented with a roving `tabIndex` that will be subtly wrong.
 * `radio-group.tsx` makes the same call for the checkout's rows.
 *
 * The mark fades AND scales in from 75%, never from 0 (§10). Reduced motion
 * drops the transform and keeps the fade. The glyph is in the DOM at rest and
 * simply unpainted, so choosing something reflows nothing.
 *
 * Sizes are rungs, not the card's px: the 36px disc becomes `size-10` (the rung
 * `SwitchRow` rounded it to), the 22px mark `size-5` (the rung `Checkbox` and
 * `RadioRow` use for the same idiom), §5's 15/600 title 16/600 — TASTE §7's
 * "card titles 16/500-600", since 15 is on the type scale in neither direction.
 */
function OptionCard({
  name,
  value,
  title,
  description,
  icon,
  checked,
  onChange,
}: {
  readonly name: string;
  readonly value: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
  readonly checked: boolean;
  readonly onChange: (value: string) => void;
}) {
  return (
    <label
      /*
        `pressableSurface` alone, never `pressableSurface` + `tintTransition`:
        both set `transition-property`, so which one won would be decided by the
        order Tailwind emits them in rather than the order written here
        (`host-ui.ts` documents the same trap for `rounded-*`). It already
        carries background, border, colour and §10's `scale(.995)` — the press
        depth for a surface this size, not a button's `.97`.
      */
      className={`relative flex min-h-16 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-canvas p-4 hover:border-border-strong ${pressableSurface}`}
    >
      <input
        type="radio"
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
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
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-semibold text-primary">{title}</span>
        <span className="mt-1 block text-label font-regular leading-snug text-secondary">
          {description}
        </span>
      </span>

      {/* The mark sits in a 24px box — the title's own line box at 16/1.5 — so it
          centres on the FIRST line of a card whose description wraps to two.
          Circle = one of these; step 4's square mark = any of these. */}
      <span aria-hidden="true" className="flex h-6 flex-none items-center">
        <span
          className={`flex size-5 items-center justify-center rounded-full border ${tintTransition} ${
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

/* ── The measured-value field ────────────────────────────────────────────────
 *
 * §5's `.fwrap` + `.finput` + `.funit`: a 48px `radius.md` shell on
 * `border.default` over `bg.sunken`, the value at 16/400 — "a form value is
 * content, not a label" — and the unit inside the field, trailing, at 14/400
 * secondary. **Never a second control**: the unit is a fact about the field, not
 * a thing to choose.
 *
 * `.num` goes on the INPUT (hw-001's `class="finput num"`), which is what makes
 * the run tabular and, under RTL, isolated back to LTR. §6 and BUILD-DECISIONS
 * #2 admit no carve-out here: an unisolated digit run reverses under RTL, and
 * these fields ship in Urdu.
 *
 * The focus ring is the `controlRing` overlay rather than `focusRing` on the
 * input, because the input is borderless inside the shell and a 2px ring hugging
 * a bare text line reads as a second, smaller field inside the first —
 * `TextInput` answers the identical shape the identical way.
 */
function UnitField({
  id,
  label,
  unit,
  value,
  onChange,
  placeholder,
  hint,
}: {
  readonly id: string;
  readonly label: ReactNode;
  readonly unit: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly hint?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={hostFieldLabel}>
        {label}
      </label>

      <div
        className={`relative mt-2 flex min-h-12 items-center gap-3 rounded-md border border-border-default bg-sunken px-4 ${tintTransition} hover:border-border-strong`}
      >
        <input
          id={id}
          name={id}
          type="text"
          inputMode="numeric"
          className="peer num min-w-0 flex-1 border-none bg-transparent p-0 text-bodyMd font-regular text-primary outline-none placeholder:text-secondary"
          value={value}
          placeholder={placeholder}
          /*
            Digits and a single decimal point only. A measured figure is the one
            thing this field is for, and letting prose in would put an
            un-isolatable string inside a `.num` run.
          */
          onChange={(event) => onChange(event.target.value.replace(/[^0-9.]/g, ""))}
        />

        <span aria-hidden="true" className="flex-none text-bodySm text-secondary">
          {unit}
        </span>

        {/* Later sibling of the peer input, see `controlRing`. */}
        <span aria-hidden="true" className={`${controlRing} rounded-md`} />
      </div>

      {hint ? <span className={hostFieldSub}>{hint}</span> : null}
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────────
 *
 * hw-001 panel A's own options and its own descriptions, in its order.
 */

const BACKUP_OPTIONS = [
  { value: "none", title: "None", description: "The mains, and nothing else", icon: NoBackupGlyph },
  { value: "ups", title: "UPS", description: "Fans, lights and Wi-Fi", icon: UpsGlyph },
  {
    value: "generator",
    title: "Generator",
    description: "Everything, including the AC",
    icon: GeneratorGlyph,
  },
  {
    value: "solar",
    title: "Solar and battery",
    description: "Runs on stored charge",
    icon: SolarGlyph,
  },
] as const;

const WATER_OPTIONS = [
  {
    value: "municipal",
    title: "Municipal supply, all day",
    description: "Mains water on the taps whenever guests need it",
    icon: MainsWaterGlyph,
  },
  {
    value: "municipal-tank",
    title: "Municipal supply with an underground tank",
    description: "Stored and pumped, so a supply cut is not felt inside",
    icon: TankGlyph,
  },
  {
    value: "borehole",
    title: "Borehole and tank",
    description: "Your own bore, not the municipal line",
    icon: BoreholeGlyph,
  },
] as const;

const PARKING_OPTIONS = [
  {
    value: "none",
    title: "None",
    description: "Guests will need to park elsewhere",
    icon: NoParkingGlyph,
  },
  {
    value: "street",
    title: "On the street",
    description: "Outside the gate, first come first served",
    icon: StreetParkingGlyph,
  },
  {
    value: "gated",
    title: "Gated, inside the property",
    description: "Behind your own gate, off the road",
    icon: GatedParkingGlyph,
  },
] as const;

/**
 * When load-shedding usually falls.
 *
 * hw-001's worked case reads "Afternoon, about 2 to 5 PM"; the OPTION SET behind
 * it is in no card, so it is chosen here and flagged. Parts of the day rather
 * than clock windows, for two reasons that agree:
 *
 *   · An `<option>` holds TEXT, so a `.num` span cannot go inside one, and
 *     `Select`'s `numeric` prop forces the whole control LTR — which is wrong
 *     for a list of Urdu prose. `select.tsx` names this as the one case it
 *     cannot isolate per-run. Digit-free labels sidestep it entirely.
 *   · Publishing a clock window the host picked off a menu would dress a rough
 *     answer up as a measurement. The step already asks for the one number that
 *     matters (hours a day) in a field where the host types their own figure.
 */
const WINDOW_OPTIONS = [
  { value: "mornings", label: "Mornings" },
  { value: "afternoons", label: "Afternoons" },
  { value: "evenings", label: "Evenings" },
  { value: "overnight", label: "Overnight" },
  { value: "varies", label: "It changes from day to day" },
] as const;

/* ────────────────────────────────────────────────────────────────────────── */

export default function PracticalFactsStepPage() {
  const [loadSheddingHours, setLoadSheddingHours] = useState("");
  const [loadSheddingWindow, setLoadSheddingWindow] = useState("");
  const [scheduleUnstated, setScheduleUnstated] = useState(false);
  const [backup, setBackup] = useState("");
  const [backupHours, setBackupHours] = useState("");
  const [water, setWater] = useState("");
  const [gas, setGas] = useState("");
  const [wifiSpeed, setWifiSpeed] = useState("");
  const [parking, setParking] = useState("");

  /**
   * The two load-shedding answers are mutually exclusive and the card cannot
   * draw that — it is one static file. A host cannot say both "four hours,
   * afternoons" and "my area's schedule is not predictable enough to state", and
   * a form that let them assert both would publish a listing contradicting
   * itself. So each side clears the other. **Nothing is disabled**: every
   * control stays in place and stays pressable, so changing your mind is one
   * click in either direction (TASTE §11.7's spirit, one step earlier — the
   * control never goes dead in the first place).
   */
  function setHours(next: string) {
    setLoadSheddingHours(next);
    if (next !== "") {
      setScheduleUnstated(false);
    }
  }

  function setWindow(next: string) {
    setLoadSheddingWindow(next);
    if (next !== "") {
      setScheduleUnstated(false);
    }
  }

  function setUnstated(next: boolean) {
    setScheduleUnstated(next);
    if (next) {
      setLoadSheddingHours("");
      setLoadSheddingWindow("");
    }
  }

  /**
   * `None` clears the runtime for the same reason: a listing cannot show how
   * long a backup runs when there is no backup. `ha-026` states the rule for
   * this field by name — "Only shown if backup power is on site" — so choosing
   * `None`, or not having chosen yet, takes the field off the page rather than
   * leaving a live input that can only produce a contradiction.
   */
  function chooseBackup(next: string) {
    setBackup(next);
    if (next === "none") {
      setBackupHours("");
    }
  }

  const backupOnSite = backup !== "" && backup !== "none";

  const loadSheddingAnswered = loadSheddingHours !== "" || scheduleUnstated;
  const backupAnswered = backup !== "";
  const runtimeAnswered = !backupOnSite || backupHours !== "";

  const blocked = !loadSheddingAnswered || !backupAnswered || !runtimeAnswered;

  /**
   * §3's fixed second line. One blocking reason at a time, in the order the host
   * meets them down the page, so the sentence always points at the next thing
   * rather than the last. Each names an action that ends the block, and every
   * one of them can be satisfied with an honest "there is nothing to state".
   */
  const note = !loadSheddingAnswered
    ? "Give a load-shedding figure, or tick that your area's schedule is not predictable."
    : !backupAnswered
      ? "Choose a backup power option. None is one of them."
      : !runtimeAnswered
        ? "Add how many hours the backup runs, or choose None above."
        : "Your progress saves as you go.";

  return (
    <WizardStep
      step={5}
      stepName="Practical facts"
      note={note}
      backHref="/host/listings/new/amenities"
      nextHref="/host/listings/new/photos"
      nextDisabled={blocked}
    >
      {/* `.pagehead` — 44px above the h1 is `space-11` exactly, and it belongs to
          the page head rather than the column, which `.wzwrap` pads only at the
          bottom. */}
      <div className="pt-11">
        <h1 className="text-h3 font-semibold tracking-normal text-primary">
          The practical facts about your place
        </h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Guests check these before anything else. Fill in what you know for certain, and leave
          anything you cannot state reliably.
        </p>
      </div>

      {/*
        THE CLAIM. `SEO-RULES.md` §5 claim 7, byte-exact and bolded as the
        payload of the sentence (§12: bold the payload only). The rest of the
        line is §6's own promise about blank fields, in the words hw-001 wrote
        it. Do not paraphrase either half.
      */}
      <p className="mt-6 flex items-start gap-3 text-bodySm leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-5 flex-none text-tertiary" />
        <span>
          <b className="font-semibold text-primary">
            Listings show load-shedding hours and backup power
          </b>{" "}
          — so whatever you leave blank shows on your listing as &ldquo;not stated by the
          host&rdquo;. We never estimate it, round it up, or copy it from a nearby home.
        </span>
      </p>

      {/* A real `<form>` (§11.1). Navigation is the shell's sticky bar, so there
          is no submit control inside it and an implicit submission — which a
          single-field form would otherwise trigger on Enter — would go nowhere. */}
      <form onSubmit={(event) => event.preventDefault()}>
        {/* ── ELECTRICITY ─────────────────────────────────────────────────── */}
        <section aria-labelledby="electricity-heading" className="mt-8 border-t border-hairline pt-8">
          <h2 id="electricity-heading" className="text-h5 font-semibold text-primary">
            Electricity
          </h2>
          <p className="mt-2 max-w-[62ch] text-bodySm text-secondary">
            Guests plan their day around this. Give your{" "}
            <b className="font-semibold text-primary">typical</b> week, not your worst day.
          </p>

          {/* `.fld2` — two up, collapsing to one column below `md`. */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <UnitField
              id="load-shedding-hours"
              label="Load-shedding on a typical day"
              unit="hours"
              value={loadSheddingHours}
              onChange={setHours}
              placeholder="Hours a day"
            />

            <Select
              id="load-shedding-window"
              label="When it usually falls"
              value={loadSheddingWindow}
              onChange={setWindow}
              options={WINDOW_OPTIONS}
              placeholder="Choose a time of day"
              name="load-shedding-window"
            />
          </div>

          {/* §6's "I cannot state this reliably" affordance, and the sentence
              that says what the listing reads instead. */}
          <label className="relative mt-4 flex cursor-pointer items-start gap-3 px-0.5 py-1">
            <input
              type="checkbox"
              className="peer sr-only"
              name="schedule-unstated"
              checked={scheduleUnstated}
              onChange={(event) => setUnstated(event.target.checked)}
            />

            <span aria-hidden="true" className={`${controlRing} rounded-md`} />

            <span aria-hidden="true" className="flex h-6 flex-none items-center">
              <span
                className={`flex size-5 items-center justify-center rounded-sm border ${tintTransition} ${
                  scheduleUnstated
                    ? "border-selected bg-selected text-selected-fg"
                    : "border-border-default bg-canvas text-selected-fg"
                }`}
              >
                <CheckMark
                  className={`size-3 transition-[opacity,transform] duration-instant ease-standard motion-reduce:scale-100 ${
                    scheduleUnstated ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                />
              </span>
            </span>

            <span className="min-w-0 flex-1 text-bodySm text-primary">
              My area&rsquo;s schedule is not predictable enough to state
              <span className={hostFieldSub}>
                Tick this and your listing reads{" "}
                <b className="font-semibold text-secondary">
                  Load-shedding: not stated by the host
                </b>{" "}
                instead of a number. That is an honest answer, and guests read it as one.
              </span>
            </span>
          </label>

          <fieldset className="mt-5">
            <legend className={hostFieldLabel}>Backup power</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
              {BACKUP_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="backup"
                  value={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  checked={backup === option.value}
                  onChange={chooseBackup}
                />
              ))}
            </div>
          </fieldset>

          {backupOnSite ? (
            <div className="mt-5">
              <UnitField
                id="backup-hours"
                label="How long the backup runs"
                unit="hours"
                value={backupHours}
                onChange={setBackupHours}
                placeholder="Hours it runs"
                hint="On a full tank or a full charge. Guests use this to work out whether the fans stay on overnight."
              />
            </div>
          ) : null}
        </section>

        {/* ── WATER AND GAS ───────────────────────────────────────────────── */}
        <section aria-labelledby="water-heading" className="mt-8 border-t border-hairline pt-8">
          <h2 id="water-heading" className="text-h5 font-semibold text-primary">
            Water and gas
          </h2>
          <p className="mt-2 max-w-[62ch] text-bodySm text-secondary">
            Two facts that decide whether a family books a place in July.
          </p>

          <fieldset className="mt-5">
            <legend className={hostFieldLabel}>Water supply</legend>
            <div className="mt-2 flex flex-col gap-3">
              {WATER_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="water"
                  value={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  checked={water === option.value}
                  onChange={setWater}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            {/*
              `<legend>` inside a `<fieldset>` rather than `Segmented`'s `label`
              prop, so the visible text and the accessible name are one node and
              cannot drift apart in translation. `labelledBy` wires the group to
              it.

              `stack` below `md`: §5 bans a two-line segment label, and three
              segments across a 360px viewport would wrap "Low pressure in
              winter" every time.
            */}
            <legend id="gas-label" className={hostFieldLabel}>
              Sui gas
            </legend>
            <Segmented
              name="gas"
              /*
                `""` — nothing chosen. `Segmented`'s value is non-nullable
                because `hw-006` ships a setting whose every state is a real
                answer; this one is a DISCLOSURE, and seeding it to "Connected"
                would be the platform stating a fact about someone's gas line.
                An empty track is the honest rendering of a question not yet
                answered, and every segment stays reachable.
              */
              value={gas}
              onChange={setGas}
              labelledBy="gas-label"
              stack
              className="mt-2"
              hint={
                <>
                  Winter pressure drops are normal in most cities. Saying so up front is better than
                  a guest finding out at <span className="num">7</span> AM in January.
                </>
              }
            >
              <Segment value="connected">Connected</Segment>
              <Segment value="low-winter">Low pressure in winter</Segment>
              <Segment value="not-connected">Not connected</Segment>
            </Segmented>
          </fieldset>
        </section>

        {/* ── INTERNET AND PARKING ────────────────────────────────────────── */}
        <section aria-labelledby="internet-heading" className="mt-8 border-t border-hairline pt-8">
          <h2 id="internet-heading" className="text-h5 font-semibold text-primary">
            Internet and parking
          </h2>
          <p className="mt-2 max-w-[62ch] text-bodySm text-secondary">
            Both matter more to business guests than photographs do.
          </p>

          <div className="mt-5">
            <UnitField
              id="wifi-speed"
              label="Wi-Fi speed"
              unit="Mbps"
              value={wifiSpeed}
              onChange={setWifiSpeed}
              placeholder="Measured speed"
              hint="The speed you actually get, not the one on the bill. Run a test on the guest room's Wi-Fi if you are not sure."
            />
          </div>

          <fieldset className="mt-5">
            <legend className={hostFieldLabel}>Parking</legend>
            <div className="mt-2 flex flex-col gap-3">
              {PARKING_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="parking"
                  value={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  checked={parking === option.value}
                  onChange={setParking}
                />
              ))}
            </div>
          </fieldset>
        </section>
      </form>
    </WizardStep>
  );
}
