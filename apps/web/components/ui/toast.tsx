"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { duration } from "@salamstay/design-tokens/motion";

import { focusRing } from "@/components/ui";

/**
 * Toast — `design-system/cards/toast-banner.html`, with placement and behaviour
 * from `ga-062` and `ga-104`, the two screen cards that draw one in situ.
 *
 * WHAT A TOAST IS, AND WHAT IT IS NOT
 * -----------------------------------
 * The card's own subtitle: "Ephemeral confirmation vs. contextual status." A
 * toast confirms something that already happened and then leaves. Contextual
 * status that persists is a `.banner` — a bordered, tinted block that sits in
 * the page above the form it is about. That is why there is no `duration: null`
 * here and no persistent toast: a message that stays until dismissed, on a plate
 * the card draws with no close control, is a banner wearing the wrong shape.
 *
 * ANNOUNCED, NEVER FOCUSED
 * ------------------------
 * Nothing in this file calls `focus()`. A toast that stole focus would yank a
 * host out of the field they are typing in to tell them a draft saved. The
 * announcement is carried by the live-region semantics on each item instead —
 * `role="status"` + `aria-live="polite"` for the calm tones, `role="alert"` +
 * `aria-live="assertive"` for `error` and `warning`, `aria-atomic` so the whole
 * sentence is read rather than the changed word. `ga-062` ships exactly that
 * pairing (`role="status" aria-live="polite"`), redundant on paper and worth
 * keeping: some older screen readers honour one of the two and not the other.
 *
 * The list itself is mounted for the lifetime of the provider, empty or not, so
 * a live region always exists before content is inserted into it.
 *
 * THE DWELL PAUSES, AND IT PAUSES FOR THREE REASONS
 * -------------------------------------------------
 * Pointer over the stack, keyboard focus inside it, and the tab going to the
 * background. The third is the one nobody notices and everybody needs: without
 * it a host who switches tabs comes back to a stack that expired while they were
 * gone. None of the three is visible; that is the point.
 *
 * A toast with an action gets a longer dwell than one without, because reaching
 * `Undo` costs a hand movement that reading does not.
 */

/* ── Timings that are not tokens yet ─────────────────────────────────────────
 *
 * DWELL IS NOT ON THE MOTION LADDER, AND IT SHOULD BE.
 *
 * `motion.duration` runs 120 → 480ms and every rung is a TRANSITION length —
 * how long something takes to move. How long a confirmation stays on screen is a
 * different quantity in a different order of magnitude, and the token set has no
 * role for it. These two constants are that missing role, declared once, in the
 * only file that needs them, and flagged: they want a `duration.dwell` /
 * `duration.dwellWithAction` pair in `packages/design-tokens/src/motion.ts` — the
 * same class of gap `BUILD-DECISIONS.md` §17 closed for `overlaySize`.
 *
 * The exit delay below is NOT in that category: it is a transition length, so it
 * reads the ladder.
 */
const TOAST_DWELL_MS = 5000;
const TOAST_DWELL_WITH_ACTION_MS = 8000;

/**
 * How long the item stays mounted after it is dismissed, so its exit can play.
 *
 * `duration.fast` and not `duration.normal`, which the entrance uses: the exit
 * is the system answering, and the entrance is the system speaking. Slow where
 * the user is reading, fast where the system is tidying up.
 */
const TOAST_EXIT_MS = duration.fast;

/**
 * Three at once, and the fourth pushes the oldest out.
 *
 * A stack taller than this stops being a set of confirmations and becomes a log
 * the host has to read, and it starts covering the sticky action bar it is
 * sitting above.
 */
const TOAST_MAX_VISIBLE = 3;

export type ToastTone = "neutral" | "success" | "warning" | "error" | "info";

/**
 * The plate, per tone.
 *
 * `neutral` is the card's `.toast.ink` — `bg.inverse`, no border. The semantic
 * tones are the card's tinted trio: the tone's own `bg` behind the tone's own
 * `fg`, inside a 1px `border` of the tone's own border role. Colour is never the
 * only signal — the sentence says what happened, and the live-region politeness
 * says how urgent it is, both of which survive a monochrome screen.
 *
 * TOKEN GAP, CLOSED 2026-07-26. This shipped as `text-on-brand` for one pass,
 * because `colors.ts` had carried `text.onInverse` since the ramp was written
 * but neither the preset nor the generated `theme.css` ever emitted it — so the
 * class did not exist and the nearest reachable foreground role was the brand
 * one. Identical in light (both #FFFFFF) and one near-black rung off in dark,
 * which is exactly the sort of near-miss that survives review forever.
 *
 * The role now emits (`--ss-text-on-inverse`, 51 → 52 vars) and this reads the
 * token that actually names the job: ink laid on `bg.inverse`. Flagging the gap
 * rather than papering over it with `text-canvas` — a background role used as a
 * text colour, resolving to the same pixels while naming the wrong thing — is
 * what made the fix a one-line change.
 */
const TONE_PLATE: Record<ToastTone, string> = {
  neutral: "bg-inverse text-on-inverse",
  success: "border border-success-border bg-success-bg text-success",
  warning: "border border-warning-border bg-warning-bg text-warning",
  error: "border border-error-border bg-error-bg text-error",
  info: "border border-info-border bg-info-bg text-info",
};

/**
 * The action's colour.
 *
 * On the ink plate the card names `interactive.linkOnInverse` — the one role that
 * exists precisely because brand green is unreadable on near-black. On a tinted
 * plate the action inherits the tone's own foreground, which is what the card
 * draws for `Retry` on the error toast.
 */
const TONE_ACTION: Record<ToastTone, string> = {
  neutral: "text-link-on-inverse",
  success: "",
  warning: "",
  error: "",
  info: "",
};

/** `error` and `warning` interrupt; everything else waits its turn. */
const isAssertive = (tone: ToastTone): boolean => tone === "error" || tone === "warning";

export interface ToastAction {
  /** One or two words — `Undo`, `Retry`, `View`. */
  readonly label: string;
  readonly onClick: () => void;
}

export interface ToastOptions {
  /**
   * What happened, in the past tense, as a finished sentence without a full
   * stop — "Saved to Islamabad — August", "Payment declined". Honesty law
   * applies: no counts, ratings or superlatives the product cannot support.
   */
  readonly message: ReactNode;
  readonly tone?: ToastTone;
  /**
   * The leading glyph. Decorative and `aria-hidden` at the call site — the
   * message is the accessible content.
   *
   * There is no per-tone default, and that is a gap rather than a choice: the
   * corpus draws a check, a bang-in-a-circle and a bang-in-a-triangle on these
   * plates, and only the check exists in `components/ui/marks.tsx` today. The
   * other two belong in `components/icons.tsx`, which this file does not own.
   * Pass one for any tone that is not `neutral`.
   */
  readonly icon?: ReactNode;
  readonly action?: ToastAction;
}

interface ToastEntry {
  readonly id: number;
  readonly tone: ToastTone;
  readonly message: ReactNode;
  readonly icon: ReactNode | null;
  readonly action: ToastAction | null;
  /** `false` starts the exit; the item unmounts `TOAST_EXIT_MS` later. */
  readonly open: boolean;
}

interface DwellTimer {
  handle: ReturnType<typeof setTimeout> | null;
  /** Milliseconds still owed when the timer is next started. */
  remaining: number;
  startedAt: number;
}

export interface ToastApi {
  /** Shows a toast and returns its id, so a caller can dismiss it early. */
  readonly toast: (options: ToastOptions) => number;
  readonly dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/**
 * `const { toast } = useToast()` — the whole developer-facing surface.
 *
 * No per-call-site state, no imperative singleton, no `<Toaster/>` that has to be
 * placed in a particular corner of a particular layout. One provider near the
 * root, and every surface below it can say what just happened.
 */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error("useToast must be called inside a ToastProvider.");
  }
  return api;
}

export type ToastPlacement = "bottom" | "top";

export interface ToastProviderProps {
  /**
   * `bottom` by default. Choose `top` on a surface whose bottom edge is already
   * spoken for — the host wizard's sticky action bar is exactly that case, and a
   * toast landing on `Continue` would cover the control it is reporting about.
   */
  readonly placement?: ToastPlacement;
  /** Names the list for assistive tech. Translate it on the Urdu routes. */
  readonly label?: string;
  readonly children: ReactNode;
}

export function ToastProvider({
  placement = "bottom",
  label = "Notifications",
  children,
}: ToastProviderProps) {
  const [entries, setEntries] = useState<readonly ToastEntry[]>([]);

  const nextId = useRef(0);
  const dwell = useRef(new Map<number, DwellTimer>());
  const exits = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  /** Ids in arrival order that have not begun their exit — the eviction queue. */
  const live = useRef<number[]>([]);
  /** Pointer over the stack, focus inside it, or the tab in the background. */
  const paused = useRef(false);

  /**
   * Every callback below is declared so that its dependencies are themselves
   * stable, which makes all of them stable for the life of the provider. That is
   * not tidiness: a `setTimeout` closure holding a stale `dismiss` is the classic
   * way to dismiss the wrong toast after a re-render, and the usual fix — a
   * "latest ref" written during render — is a side effect in the render body.
   * Stable identities remove the need for either.
   */

  const clearDwell = useCallback((id: number) => {
    const timer = dwell.current.get(id);
    if (timer?.handle != null) clearTimeout(timer.handle);
    dwell.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      clearDwell(id);
      live.current = live.current.filter((liveId) => liveId !== id);

      setEntries((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, open: false } : entry)),
      );

      if (exits.current.has(id)) return;
      exits.current.set(
        id,
        setTimeout(() => {
          exits.current.delete(id);
          setEntries((current) => current.filter((entry) => entry.id !== id));
        }, TOAST_EXIT_MS),
      );
    },
    [clearDwell],
  );

  /**
   * `startDwell` refuses to start while the stack is paused, which is what makes
   * a toast that ARRIVES during a hover behave like the ones already there.
   * Without the guard, a confirmation that lands under a resting pointer starts
   * counting down immediately and expires under it.
   */
  const startDwell = useCallback(
    (id: number) => {
      if (paused.current) return;
      const timer = dwell.current.get(id);
      if (!timer || timer.handle !== null) return;
      timer.startedAt = Date.now();
      timer.handle = setTimeout(() => dismiss(id), timer.remaining);
    },
    [dismiss],
  );

  /**
   * Pause banks the time already served rather than restarting it, so a host who
   * hovers a toast for four seconds does not get a fresh five when they leave.
   */
  const pause = useCallback(() => {
    paused.current = true;
    const now = Date.now();
    for (const timer of dwell.current.values()) {
      if (timer.handle === null) continue;
      clearTimeout(timer.handle);
      timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt));
      timer.handle = null;
    }
  }, []);

  const resume = useCallback(() => {
    paused.current = false;
    for (const id of dwell.current.keys()) startDwell(id);
  }, [startDwell]);

  const toast = useCallback(
    (options: ToastOptions): number => {
      const id = nextId.current;
      nextId.current += 1;

      const tone = options.tone ?? "neutral";
      const action = options.action ?? null;

      setEntries((current) => [
        ...current,
        {
          id,
          tone,
          message: options.message,
          icon: options.icon ?? null,
          action,
          open: true,
        },
      ]);

      dwell.current.set(id, {
        handle: null,
        remaining: action ? TOAST_DWELL_WITH_ACTION_MS : TOAST_DWELL_MS,
        startedAt: Date.now(),
      });
      startDwell(id);

      live.current = [...live.current, id];
      while (live.current.length > TOAST_MAX_VISIBLE) {
        const oldest = live.current[0];
        if (oldest === undefined) break;
        dismiss(oldest);
      }

      return id;
    },
    [startDwell, dismiss],
  );

  /** The third pause reason: a backgrounded tab is not a tab anyone is reading. */
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) pause();
      else resume();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pause, resume]);

  /** Every handle this provider created dies with it. */
  useEffect(() => {
    const dwellTimers = dwell.current;
    const exitTimers = exits.current;
    return () => {
      for (const timer of dwellTimers.values()) {
        if (timer.handle != null) clearTimeout(timer.handle);
      }
      dwellTimers.clear();
      for (const handle of exitTimers.values()) clearTimeout(handle);
      exitTimers.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/*
        The positioner is `pointer-events-none` across the full width so it never
        eats a click on the page beneath it; the list re-enables them for itself.
        `z-toast` is the ladder's rung for this layer — above the modal, below the
        tooltip.
      */}
      <div
        className={`pointer-events-none fixed inset-x-0 z-toast flex justify-center px-4 ${
          placement === "bottom" ? "bottom-0 pb-4" : "top-0 pt-4"
        }`}
      >
        <ol
          aria-label={label}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
          className={`pointer-events-auto flex w-full max-w-overlay-toastMax gap-3 ${
            // Newest nearest the edge the stack is docked to, at both placements.
            placement === "bottom" ? "flex-col" : "flex-col-reverse"
          }`}
        >
          {entries.map((entry) => (
            <ToastItem key={entry.id} entry={entry} placement={placement} />
          ))}
        </ol>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * One item, and the only thing in this file that moves.
 *
 * MOUNT, PAINT, THEN FLIP — not `@starting-style`
 * ----------------------------------------------
 * The item renders in its closed state, an effect flips it open after the first
 * paint, and a CSS transition carries it. `dialog.tsx` uses the same shape for
 * the same reason: a CSS transition is interruptible and retargetable, so a
 * toast dismissed while it is still arriving reverses from wherever it has got
 * to instead of restarting from zero the way a keyframe would. Toasts are the
 * canonical rapidly-added element; this is the case that rule was written for.
 *
 * ONE PATH IN, THE SAME PATH OUT
 * ------------------------------
 * The closed state is the same at both ends — an 8px offset toward the edge the
 * stack is docked to, plus zero opacity. A surface that arrives from below and
 * leaves to the side breaks the spatial model the reader just built, and it is
 * what makes a future swipe-to-dismiss feel wrong before it is even built.
 * Never from `scale(0)` or from zero height: nothing in the world appears out of
 * nothing.
 *
 * Under `prefers-reduced-motion` the movement goes and the fade stays, at the
 * shortest rung — dampen, never remove (`CHECKOUT-SHELL.md` §10).
 */
function ToastItem({
  entry,
  placement,
}: {
  readonly entry: ToastEntry;
  readonly placement: ToastPlacement;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(true);
  }, []);

  const visible = shown && entry.open;
  const closed = placement === "bottom" ? "translate-y-2 opacity-0" : "-translate-y-2 opacity-0";
  const assertive = isAssertive(entry.tone);

  return (
    <li
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className={
        `flex items-center gap-3 rounded-md px-4 py-3 shadow-popover ` +
        `transition-[transform,opacity] ease-decelerate ` +
        `motion-reduce:translate-y-0 motion-reduce:transition-[opacity] ` +
        `motion-reduce:duration-instant motion-reduce:ease-decelerate ` +
        // Entering is the system speaking, leaving is the system tidying up.
        (visible ? "duration-normal " : "duration-fast ") +
        `${TONE_PLATE[entry.tone]} ` +
        (visible ? "translate-y-0 opacity-100" : closed)
      }
    >
      {entry.icon ? (
        <span aria-hidden="true" className="flex size-5 flex-none items-center justify-center">
          {entry.icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1 text-bodySm">{entry.message}</span>

      {entry.action ? (
        /*
         * Underlined at rest (TASTE §8; `ga-104` draws `.toast-act` with
         * `text-decoration:underline`, and a screen card outranks the component
         * card that omits it). 13/600 per the component card — TASTE §7 keeps 700
         * for large headings and person names.
         *
         * Hover dims by opacity rather than by colour because there is no
         * "secondary on inverse" text role to step down to, and inventing one for
         * a hover state would be a new token in a component file.
         */
        <button
          type="button"
          onClick={entry.action.onClick}
          className={
            `flex-none rounded-sm text-label font-semibold underline underline-offset-4 ` +
            `transition-opacity duration-instant ease-decelerate hover:opacity-80 ` +
            `${TONE_ACTION[entry.tone]} ${focusRing}`
          }
        >
          {entry.action.label}
        </button>
      ) : null}
    </li>
  );
}

export default ToastProvider;
