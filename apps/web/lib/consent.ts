"use client";

import { useEffect, useState } from "react";

/**
 * The consent record — ONE module, so the banner that writes it and the policy
 * page that reports it cannot drift.
 *
 * WHY THIS EXISTS
 * ---------------
 * `/legal/cookie-policy` is the surface whose entire job is telling the reader
 * what is stored and what they chose. It printed "Essential only" as static
 * server HTML, which was simply wrong for anyone who had pressed **Accept all**.
 * A page cannot disclose a value it has no way to read, so the storage key, the
 * events and the reader move here and both sides import them.
 *
 * WHAT IS ACTUALLY STORED, EXACTLY
 * --------------------------------
 * One string under one key: `"all"` or `"essential"`. There are no per-category
 * records, because there are no per-category controls — the banner ships two
 * buttons and they are the whole vocabulary. Anything on the policy page that
 * described four independent switches was describing software that does not
 * exist; the copy now describes this.
 *
 * THE THREE STATES A READER CAN BE IN, AND WHY `pending` IS ONE OF THEM
 * --------------------------------------------------------------------
 * `localStorage` is unreadable on the server and unread on the first client
 * frame, so `useConsent` starts at `pending` and the server HTML and the first
 * client render agree by construction (no hydration mismatch, and — the point —
 * no frame in which the page states a choice the reader did not make). The
 * caller renders `pending` as an honest "this fills in once the page has
 * loaded", never as a guess. `ConsentResetButton` gates on the same idea with
 * its `ready` flag.
 *
 * EVENTS. `writeConsent` and `clearConsent` announce themselves, because the
 * banner and the policy page are two components with no shared React tree —
 * they are siblings under the root layout. `storage` is listened to as well, so
 * a choice made in one tab is reported truthfully in another rather than
 * leaving a second tab printing a stale answer.
 */

export const CONSENT_STORAGE_KEY = "salamstay.cookie-consent";

/** Fired after a choice is written. Carries no payload: listeners re-read. */
export const CONSENT_CHANGE_EVENT = "salamstay:cookie-consent-change";

/** Fired after the record is dropped. The banner reopens on this. */
export const CONSENT_RESET_EVENT = "salamstay:cookie-consent-reset";

/** The whole vocabulary of the stored record. */
export type ConsentChoice = "all" | "essential";

/**
 * What a component can truthfully say about the record right now.
 * `pending` — not read yet (server render, first client frame).
 * `unset`   — read, and nothing is stored.
 */
export type ConsentState = ConsentChoice | "unset" | "pending";

/** Storage can throw (private mode, blocked cookies). A choice we cannot record is a choice we ask for again. */
export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* Nothing to do: the banner will ask again next visit, which is the honest failure. */
  }
  // Dispatched even when the write threw: what the policy page reports next is
  // whatever `readConsent` finds, which is the truth either way.
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* Nothing stored means nothing to clear; the event below still reopens the banner. */
  }
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}

/** The stored choice, as a value a component may render. Starts `pending`. */
export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>("pending");

  useEffect(() => {
    const sync = () => setState(readConsent() ?? "unset");
    sync();

    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    window.addEventListener(CONSENT_RESET_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
      window.removeEventListener(CONSENT_RESET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}
