"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { newDraft } from "./booking";
import type {
  BookingDraft,
  DocumentId,
  DocumentSlot,
  GuestCounts,
  Nationality,
  PartyType,
  PaymentRail,
  StayDates,
} from "./booking";

/**
 * The in-progress booking, held for the length of one visit and no longer.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * Session-only. Nothing is written to `localStorage`, nothing is sent anywhere,
 * and a hard reload starts over. That is not a shortcut waiting to be fixed —
 * it is the honest position while there is no backend: a draft that survived a
 * reload would be a promise that a booking is being held, and nothing is
 * holding it. `booking.ts` exports `reachedStep`/`canView` so a step that is
 * loaded cold can send the guest back to the one screen that can answer for it,
 * rather than printing a total for dates nobody picked.
 *
 * Auth is stubbed at `GUEST_IS_SIGNED_IN`. No step builds a login gate.
 *
 * WHERE IT MOUNTS
 * ---------------
 * In `app/book/[slug]/layout.tsx`, wrapping all seven step routes. React
 * context survives navigation between routes that share a layout and dies when
 * the guest leaves the layout, which is exactly the lifetime a checkout draft
 * should have. Mounted per step instead, every step would open with an empty
 * draft. The layout is a Server Component and `ListingContent` is plain data,
 * so it hands the listing straight in as a prop.
 *
 * WHY IT LOOKS LESS LIKE `lib/consent.ts` THAN IT MIGHT
 * -----------------------------------------------------
 * That module is this codebase's other piece of client state and the pattern is
 * followed where the reasoning transfers, but two of its mechanisms are
 * deliberately absent, and knowing why matters more than matching the shape:
 *
 *  · NO CUSTOM EVENTS. Consent broadcasts because the banner that writes it and
 *    the policy page that reports it are siblings under the root layout with no
 *    shared tree to pass through. Everything that reads a booking draft — the
 *    step form, the summary rail, the mobile bar, the header — is inside the
 *    checkout layout, so context reaches all of them and an event bus would be
 *    a second channel saying the same thing.
 *  · NO `pending` STATE. Consent starts pending because `localStorage` cannot be
 *    read on the server or on the first client frame, so any other opening
 *    value would be a guess rendered as an answer. This draft is seeded from a
 *    prop and is identical on the server and on the first frame, so there is no
 *    window in which it could guess. The same principle is enforced instead by
 *    the shape of the draft: every answer the guest has not given is `null`, and
 *    a screen that needs one asks `canView` rather than filling it in.
 *
 * What IS carried over: the storage of the value is module-private, the only
 * way in is the exported hook, and a component that asks for the draft outside
 * the provider gets a thrown error rather than a plausible empty one.
 */

export interface BookingSession {
  readonly draft: BookingDraft;
  /** `null` clears the selection, which is what "Change" on the rail does. */
  readonly setDates: (dates: StayDates | null) => void;
  readonly setGuests: (guests: GuestCounts) => void;
  readonly setParty: (party: PartyType) => void;
  /**
   * Switching this is a real fork (gw-022): it changes which identity documents
   * are owed, so `requiredDocuments` returns a different list and slots for the
   * documents the other branch asked for stop being read.
   */
  readonly setNationality: (nationality: Nationality) => void;
  readonly setDocument: (id: DocumentId, slot: DocumentSlot) => void;
  readonly setRail: (rail: PaymentRail) => void;
  /** Back to a fresh draft on the same listing. "Save & exit" territory. */
  readonly reset: () => void;
}

const BookingContext = createContext<BookingSession | null>(null);

export function BookingProvider({
  listing,
  children,
}: {
  listing: ListingContent;
  children: ReactNode;
}) {
  // The initialiser runs once. Re-seeding on a `listing` prop change would wipe
  // a draft mid-flow, and one checkout layout only ever serves one home.
  const [draft, setDraft] = useState<BookingDraft>(() => newDraft(listing));

  const setDates = useCallback((dates: StayDates | null) => {
    setDraft((d) => ({ ...d, dates }));
  }, []);

  const setGuests = useCallback((guests: GuestCounts) => {
    setDraft((d) => ({ ...d, guests }));
  }, []);

  const setParty = useCallback((party: PartyType) => {
    setDraft((d) => ({ ...d, party }));
  }, []);

  const setNationality = useCallback((nationality: Nationality) => {
    setDraft((d) => ({ ...d, nationality }));
  }, []);

  const setDocument = useCallback((id: DocumentId, slot: DocumentSlot) => {
    setDraft((d) => ({ ...d, documents: { ...d.documents, [id]: slot } }));
  }, []);

  const setRail = useCallback((rail: PaymentRail) => {
    setDraft((d) => ({ ...d, rail }));
  }, []);

  const reset = useCallback(() => {
    setDraft((d) => newDraft(d.listing));
  }, []);

  const value = useMemo<BookingSession>(
    () => ({
      draft,
      setDates,
      setGuests,
      setParty,
      setNationality,
      setDocument,
      setRail,
      reset,
    }),
    [draft, setDates, setGuests, setParty, setNationality, setDocument, setRail, reset],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

/**
 * The booking in progress. Throws outside a `BookingProvider`, on purpose: a
 * fallback empty draft would let a step render a plausible screen from a
 * mounting mistake, and a checkout that quietly forgets is the one failure this
 * whole module exists to prevent.
 */
export function useBooking(): BookingSession {
  const session = useContext(BookingContext);
  if (session === null) {
    throw new Error("useBooking must be used inside <BookingProvider> (app/book/[slug]/layout.tsx)");
  }
  return session;
}
