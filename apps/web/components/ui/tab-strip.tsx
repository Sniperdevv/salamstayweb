"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { focusRing, tintTransition } from "@/components/ui";

/**
 * The tab strip — `ha-046`'s `.hostnav`, matched by `hw-007` and specified by
 * `HOST-SHELL.md` §2b: a row of underline tabs on a hairline, `bg.canvas`, no
 * shadow (§8 — it does not float over scrolled content, so it does not cast).
 *
 * ONE SKIN, TWO SEMANTICS — AND ONLY ONE OF THEM ROVES
 * ----------------------------------------------------
 * `.hostnav` is drawn once in the corpus and used for two different jobs, and
 * they are not the same control:
 *
 *   `TabStrip` + `TabLink`  — NAVIGATION. Today / Calendar / Listings /
 *     Reservations / Earnings / Insights. Real `<a href>`s that change route,
 *     inside a `<nav>`, with `aria-current="page"` on the one you are on. Every
 *     link is its own tab stop, which is the correct and required behaviour for
 *     links — the APG is explicit that a set of navigation links must NOT be
 *     given `role="tablist"`, and putting a roving tabindex on them would take
 *     five of the six destinations out of the tab order.
 *
 *   `Tabs` + `TabList` + `Tab` + `TabPanel` — IN-PAGE TABS. One panel visible at
 *     a time, no navigation. `role="tablist"` / `role="tab"` / `role="tabpanel"`,
 *     and THIS is where the roving tabindex lives: exactly one tab carries
 *     `tabIndex=0` (the selected one), every other carries `-1`, and Arrow /
 *     Home / End move focus between them. Arrow direction reads the strip's
 *     computed `direction`, so Right Arrow means "previous" under RTL — the one
 *     thing a hand-rolled roving tabindex always ships backwards.
 *
 * Picking the wrong one is a real defect, not a preference: a tablist announces
 * "tab, 3 of 6" and promises a panel below it. If the click loads a page, it is
 * a link.
 *
 * WHY `Tabs` IS ITS OWN COMPONENT
 * -------------------------------
 * A `tabpanel` is a SIBLING of the `tablist`, never a child of it — a panel
 * nested inside `role="tablist"` is invalid ARIA and would be laid out as if it
 * were a tab. So the state the two halves share cannot live on the tablist
 * element: `Tabs` holds it (the `useId()` base, the selected value, the change
 * handler, the indicator colour) and renders NO DOM of its own, leaving the
 * strip and the panels as the plain siblings the role demands. `TabList` keeps
 * only what is genuinely the list's: its accessible name, its activation mode,
 * the `role="tablist"` element and the keys that rove across it.
 *
 * THE ACTIVE UNDERLINE IS INK BY DEFAULT
 * --------------------------------------
 * TASTE §3: selected is near-black, never green. `ha-046` draws the host nav's
 * active underline in brand, and `HOST-SHELL.md` §2b rules on it directly —
 * "Flagged, not fixed… Inherit them; do not 'fix' them ad hoc on a sibling card,
 * and do not invent new brand roles either." So `indicator="brand"` exists and
 * reproduces `ha-046` exactly where the host app chrome calls for it, and every
 * other surface gets ink, which is what TASTE says without an exception. The
 * default is the law; the opt-in is the inheritance.
 *
 * SIZE
 * ----
 * The card sets tabs at 15px; there is no 15 on the type scale (TASTE §7 says so
 * outright in the footer redline) and TASTE §10's own sticky-anchor-bar entry
 * puts tabs at "16/500 ink". `text-bodyMd` is therefore the rung, and the row
 * lands within a pixel and a half of the card's height.
 */

export type TabIndicator = "ink" | "brand";

/**
 * The strip: a hairline the tabs sit on, and a 1px overlap so the active tab's
 * 2px underline covers it rather than stacking on it.
 *
 * No horizontal padding: `ha-046`'s 24px gutter belongs to the host app chrome,
 * not to every strip that will ever use this. Add `px-6` at that call site.
 *
 * No `overflow-x-auto` either, and that is a gap rather than a decision — see
 * the note at the foot of this file.
 */
export const tabStrip = "flex items-center gap-1 border-b border-hairline bg-canvas";

/** `.navspacer` — pushes a trailing control (`＋ Create a listing`) to the end. */
export function TabStripSpacer() {
  return <span aria-hidden="true" className="flex-1" />;
}

const INDICATOR: Record<TabIndicator, string> = {
  ink: "border-b-selected",
  brand: "border-b-interactive",
};

/**
 * The shape both a `TabLink` and a `Tab` wear.
 *
 * `-mb-px` is what makes the underline read as a state of the strip's own
 * hairline rather than a second rule under it. `border-b-2` is present at rest
 * in `transparent`, so becoming current re-colours a border that was always
 * there and the label never moves.
 *
 * No underline at rest, and TASTE §8 is not being broken: §8 governs inline text
 * actions inside prose (Share, Save, Show more). These are navigation tabs in
 * their own chrome and TASTE §10 states their treatment exactly — 16/500 ink,
 * hairline bottom. The site footer is the other sanctioned suspension of the
 * same rule.
 */
function tabItemClass(current: boolean, indicator: TabIndicator): string {
  return [
    "-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3.5",
    "text-bodyMd no-underline",
    tintTransition,
    focusRing,
    current
      ? `font-semibold text-primary ${INDICATOR[indicator]}`
      : "font-medium border-b-transparent text-secondary hover:text-primary",
  ].join(" ");
}

/* ───────────────────────── navigation: links ────────────────────────────── */

/**
 * The strip hands its indicator choice down rather than making every `TabLink`
 * repeat it — six links that each had to be told "brand" is six chances for one
 * of them to be told something else.
 */
const TabIndicatorContext = createContext<TabIndicator>("ink");

export interface TabStripProps {
  /**
   * Names the `<nav>`. Required — a second navigation landmark on a page with
   * no name is a landmark a screen-reader user cannot tell from the first one.
   */
  readonly label: string;
  readonly indicator?: TabIndicator;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The navigation strip. Renders a `<nav>`; its children are `TabLink`s, an
 * optional `TabStripSpacer`, and whatever trailing control the surface carries.
 */
export function TabStrip({ label, indicator = "ink", children, className = "" }: TabStripProps) {
  return (
    <TabIndicatorContext.Provider value={indicator}>
      <nav aria-label={label} className={`${tabStrip} ${className}`}>
        {children}
      </nav>
    </TabIndicatorContext.Provider>
  );
}

export interface TabLinkProps {
  readonly href: string;
  /**
   * The one you are on. Emits `aria-current="page"`, which is the whole
   * accessible statement — the colour and the weight are the sighted half of the
   * same fact, never the only half.
   */
  readonly current?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function TabLink({ href, current = false, children, className = "" }: TabLinkProps) {
  const indicator = useContext(TabIndicatorContext);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`${tabItemClass(current, indicator)} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ──────────────────────── in-page tabs: roving ──────────────────────────── */

interface TabsContextValue {
  readonly baseId: string;
  readonly value: string;
  readonly select: (value: string) => void;
  readonly indicator: TabIndicator;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/** `useId()` output plus a value, made id-safe. Values may contain anything. */
const idPart = (value: string): string => value.replace(/[^A-Za-z0-9_-]/g, "-");
const tabId = (baseId: string, value: string): string => `${baseId}tab-${idPart(value)}`;
const panelId = (baseId: string, value: string): string => `${baseId}panel-${idPart(value)}`;

export type TabActivation = "automatic" | "manual";

export interface TabsProps {
  /** The selected tab's value. Controlled — `Tabs` stores nothing. */
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly indicator?: TabIndicator;
  /** A `TabList`, then the `TabPanel`s, as siblings. */
  readonly children: ReactNode;
}

/**
 * The provider, and deliberately not an element.
 *
 * Rendering a wrapper `<div>` here would insert a box between the strip and
 * whatever lays the surface out, so `Tabs` returns its children untouched: the
 * DOM is exactly the tablist and the panels the call site wrote, and dropping
 * `Tabs` around an existing pair changes no layout at all.
 *
 * The context object is rebuilt on every render rather than memoised, and that
 * is the honest shape: every field in it changes on the one event that
 * re-renders this component, and the consumers below are its own children, so a
 * `useMemo` here would never once avoid a re-render it did not already owe.
 */
export function Tabs({ value, onChange, indicator = "ink", children }: TabsProps) {
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ baseId, value, select: onChange, indicator }}>
      {children}
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  /** `aria-label` for the tablist. Use `labelledBy` when a visible heading exists. */
  readonly label?: string;
  readonly labelledBy?: string;
  /**
   * `automatic` (the APG default, and the default here) selects as focus moves —
   * correct when the panels are already rendered and switching costs nothing.
   * `manual` moves focus only and waits for Enter, Space or a click; reach for it
   * when a panel fetches, so arrowing past three tabs does not fire three loads.
   */
  readonly activation?: TabActivation;
  readonly children: ReactNode;
  readonly className?: string;
}

export function TabList({
  label,
  labelledBy,
  activation = "automatic",
  children,
  className = "",
}: TabListProps) {
  /* Both hooks run before the guard below, so the throw never changes the order
     React sees on a subsequent render. */
  const list = useRef<HTMLDivElement>(null);
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("TabList must be rendered inside Tabs.");
  }

  /**
   * The roving tabindex's other half. `Tab` owns `tabIndex={selected ? 0 : -1}`;
   * this owns the keys that move it.
   *
   * Tabs are read out of the DOM rather than a registered-ref ledger — the same
   * technique `dialog.tsx` uses for its focus trap. A ledger has to survive
   * mounting, unmounting and reordering; `querySelectorAll` is already in
   * document order and cannot go stale.
   */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const root = list.current;
    if (!root) return;

    const tabs = Array.from(
      root.querySelectorAll<HTMLElement>('[role="tab"]:not([aria-disabled="true"])'),
    );
    if (tabs.length === 0) return;

    const from = tabs.findIndex((tab) => tab === document.activeElement);
    if (from === -1) return;

    /**
     * Direction is read from the strip, not assumed. Under RTL the first tab is
     * on the right, so Right Arrow must move to the PREVIOUS tab — reversing
     * this is the single most common roving-tabindex bug, and this product ships
     * every surface in Urdu.
     */
    const forward =
      getComputedStyle(root).direction === "rtl" ? "ArrowLeft" : "ArrowRight";

    const to =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === forward
            ? (from + 1) % tabs.length
            : (from - 1 + tabs.length) % tabs.length;

    const next = tabs[to];
    if (!next) return;

    event.preventDefault();
    next.focus();

    if (activation === "automatic") {
      const nextValue = next.dataset["value"];
      if (nextValue !== undefined) ctx.select(nextValue);
    }
  };

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={`${tabStrip} ${className}`}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  readonly value: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Tab({ value, disabled = false, children, className = "" }: TabProps) {
  const tabs = useContext(TabsContext);
  if (!tabs) {
    throw new Error("Tab must be rendered inside Tabs.");
  }

  const selected = tabs.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={tabId(tabs.baseId, value)}
      aria-controls={panelId(tabs.baseId, value)}
      aria-selected={selected}
      /*
       * `aria-disabled`, not `disabled`. TASTE §11.7: a disabled control stays
       * visible and in place — and it also stays REACHABLE, so a keyboard user
       * can find out it is there. A `disabled` attribute would drop it out of
       * the roving order silently.
       */
      aria-disabled={disabled || undefined}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      onClick={disabled ? undefined : () => tabs.select(value)}
      className={`${tabItemClass(selected, tabs.indicator)} ${
        disabled ? "cursor-default text-disabled hover:text-disabled" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  /** The `Tab` value this panel belongs to. */
  readonly value: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The panel. `tabIndex={0}` so a keyboard user can reach and scroll its content
 * even when nothing inside it is focusable, and `hidden` rather than unmounted
 * so the tab's `aria-controls` always points at something that exists.
 */
export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const tabs = useContext(TabsContext);
  if (!tabs) {
    throw new Error("TabPanel must be rendered inside Tabs.");
  }

  const selected = tabs.value === value;

  return (
    <div
      role="tabpanel"
      id={panelId(tabs.baseId, value)}
      aria-labelledby={tabId(tabs.baseId, value)}
      tabIndex={0}
      hidden={!selected}
      className={`${focusRing} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * UNDRAWN, AND NOT INVENTED HERE: what this strip does when it is wider than the
 * viewport.
 *
 * `ha-046` is a web-drawn card at a 1148px `.main` and six tabs plus a trailing
 * primary fit it. No card in the corpus draws the narrow case, and the two
 * obvious answers both cost something real: `overflow-x-auto` clips the 4px
 * offset of `focusRing` on the first and last tab (an `overflow-x` value other
 * than `visible` forces `overflow-y` to `auto`, so the ring is cut top and
 * bottom), and wrapping to two lines is a two-line nav at desktop. Tabs carry
 * `shrink-0` and `whitespace-nowrap` per the card; the surface that first needs
 * a narrow host nav should get a card for it.
 */

export default TabStrip;
