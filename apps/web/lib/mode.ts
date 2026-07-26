"use client";

import { useEffect, useState } from "react";

/**
 * The session stub — ONE module, so every surface that draws the signed-in
 * person reads the same facts from the same place.
 *
 * WHY THIS EXISTS AND WHAT IT DELIBERATELY IS NOT
 * -----------------------------------------------
 * `hw-007` panel B is the founder's headline ask: switching between travelling
 * and hosting, on one account. There is no auth system to switch anything with,
 * and inventing one — a user endpoint, a token shape, a login flow — would be
 * inventing the hardest part of the product as a side effect of building a
 * header. So the *mode* is modelled the way `lib/consent.ts` models the cookie
 * record: one string, one key, read on the client, never guessed on the server.
 *
 * WHAT IS ACTUALLY STORED, EXACTLY
 * --------------------------------
 * One string under one key: `"travelling"` or `"hosting"`. Nothing else. There
 * is no stored user, no stored token and no stored expiry, because none of those
 * exist. **The presence of the key is what "signed in" means here** — which is
 * why there is no `signIn()`: writing a mode is the only way in, and a real
 * session will set that from the server instead.
 *
 * THE FOUR STATES, AND WHY `pending` IS ONE OF THEM
 * -------------------------------------------------
 * `localStorage` is unreadable on the server and unread on the first client
 * frame, so `useSessionMode` starts at `pending` and the server HTML and the
 * first client render agree by construction. The logged-out header is therefore
 * the server-rendered truth and the only thing the SEO gates ever parse; the
 * signed-in branch resolves one frame later, on the client, and appears in no
 * crawlable HTML at all. A real session — a cookie the server can read — removes
 * both the `pending` rung and the one-frame swap; nothing else here changes.
 *
 * WHAT A REAL SESSION REPLACES
 * ----------------------------
 * `readSessionMode` (server-readable cookie / session lookup), `setSessionMode`
 * (a mutation the server acknowledges), `signOut` (a real logout), and
 * `SESSION_ACCOUNT` (the record the session returns). The four exports are the
 * whole surface on purpose: everything that draws the person imports from here,
 * so there is exactly one place to cut over.
 *
 * EVENTS. `setSessionMode` and `signOut` announce themselves, because the header
 * and the host chrome are components with no shared React tree. `storage` is
 * listened to as well, so switching mode in one tab is reported truthfully in
 * another rather than leaving a second tab drawing a stale chrome.
 */

export const SESSION_STORAGE_KEY = "salamstay.session-mode";

/** Fired after the mode is written or cleared. Carries no payload: listeners re-read. */
export const SESSION_CHANGE_EVENT = "salamstay:session-mode-change";

/**
 * The whole vocabulary of the stored record.
 *
 * Two modes of ONE account — never two accounts (`hw-007` panel B). The value
 * says which mode the account is currently in; it says nothing about who the
 * person is, because the person does not change between them.
 */
export type SessionMode = "travelling" | "hosting";

/**
 * What a component can truthfully say about the session right now.
 * `pending`    — not read yet (server render, first client frame).
 * `signed-out` — read, and nothing is stored.
 */
export type SessionState = SessionMode | "signed-out" | "pending";

/** Narrowing helper, so callers never string-compare two literals by hand. */
export function isSignedIn(state: SessionState): state is SessionMode {
  return state === "travelling" || state === "hosting";
}

/** Storage can throw (private mode, blocked storage). Unreadable means signed out. */
export function readSessionMode(): SessionMode | null {
  try {
    const v = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return v === "travelling" || v === "hosting" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Enter a mode. Also the only way in: writing a mode IS signing in here.
 *
 * The switch never re-runs verification — there is nothing to re-run, because
 * there is nothing per-mode to verify. That is not a convenience of the stub; it
 * is `ha-003`'s rule, and a real session must keep it: one account, one
 * verification, carried in both directions.
 */
export function setSessionMode(mode: SessionMode): void {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, mode);
  } catch {
    /* Nothing to do: the chrome stays as it is, which is the honest failure. */
  }
  // Dispatched even when the write threw: what every listener reports next is
  // whatever `readSessionMode` finds, which is the truth either way.
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/** Log out. Drops the record; both modes end together, because it is one account. */
export function signOut(): void {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    /* Nothing stored means nothing to clear; the event below still re-renders the chrome. */
  }
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/** The session, as a value a component may render. Starts `pending`. */
export function useSessionMode(): SessionState {
  const [state, setState] = useState<SessionState>("pending");

  useEffect(() => {
    const sync = () => setState(readSessionMode() ?? "signed-out");
    sync();

    window.addEventListener(SESSION_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}

/**
 * The person, exactly as the corpus draws them — and no wider.
 *
 * `hw-007` panel B draws four facts about the signed-in person and no others:
 * a display name, the initials in the avatar disc, the accessible name on the
 * account control, and an ink verification mark. This record is those four
 * facts. It is NOT a user model: there is no id, no email, no phone, no photo
 * URL, no role array, because the card draws none of those and guessing their
 * shape now is guessing the auth contract.
 *
 * It lives here rather than inside the header for one reason the card is
 * explicit about: **the same avatar, the same initials and the same accessible
 * name appear everywhere the person appears** — the guest header's control, the
 * account menu, and the host header the hosting surfaces draw. "If the avatar
 * changed between them, a reviewer would read two accounts, and no amount of
 * copy would fix that." Two files deriving `"AK"` independently is how that
 * drift starts, so there is one object and every surface imports it.
 *
 * The worked case is the card's own: host Aqib, `hw-001`'s thread.
 */
export interface SessionAccount {
  /** Display name, as drawn in the account menu's head. */
  readonly name: string;
  /** First name — the second half of the accessible name on the account control. */
  readonly firstName: string;
  /** Avatar initials. Same two letters at every avatar size, in both chromes. */
  readonly initials: string;
  /** The ink verification mark's label. Ink, never green — it is a status, not a brand role. */
  readonly verification: string;
}

export const SESSION_ACCOUNT: SessionAccount = {
  name: "Aqib Khan",
  firstName: "Aqib",
  initials: "AK",
  verification: "CNIC verified",
};

/**
 * The accessible name of the account control — `hw-007`'s `aria-label`, byte-exact.
 *
 * Derived once and exported, because the card requires it to be identical on the
 * guest control and on the host header's avatar. Two hand-written copies of one
 * string is the same failure mode as two hand-written copies of the initials.
 */
export const ACCOUNT_LABEL = `Your account, ${SESSION_ACCOUNT.firstName}`;
