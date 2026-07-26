import Link from "next/link";
import type { ReactNode } from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";

import { fieldLabel, inlineAction } from "@/components/ui";
import type { DocumentId, PartyType } from "@/lib/booking/booking";

/**
 * The words and the glyphs the Party step (gw-022) and the Verify step (gw-023)
 * both say, in one place.
 *
 * WHY A SHARED MODULE AND NOT TWO COPIES
 * --------------------------------------
 * `lib/booking/booking.ts` deliberately carries ids and order only, and says
 * why: "a second copy of 'A married man and woman' living in a types file is a
 * second copy that will drift". The same argument applies one level up — step 1
 * PROMISES a document set and step 2 COLLECTS it, and the whole point of
 * gw-022's third section is that the two agree. Two files each holding their own
 * "FRC · the NADRA Family Registration Certificate" is exactly the drift the
 * cards were written to prevent, so both steps import from here.
 *
 * WHY THE GLYPHS LIVE HERE TOO
 * ----------------------------
 * `components/host/photo-upload.tsx` states the house rule: a glyph is local to
 * one surface until a second surface needs it, then it is PROMOTED, never
 * copied. Every mark below is drawn on both steps, so none of them is local to
 * either; and none exists in `components/icons.tsx` yet, which carries the
 * discovery/chrome set. They sit beside the copy they belong to rather than
 * being pasted into two route files.
 *
 * THE FOUNDER RULING THIS COPY IS WRITTEN UNDER (2026-07-26)
 * ---------------------------------------------------------
 * **Anyone books — men and women, together or alone.** The marriage certificate
 * at booking is the ONLY document requirement SalamStay imposes; hosts do not
 * set document requirements. A party type therefore decides which documents the
 * next step asks for and says nothing else about the guest, and no string here
 * attributes a requirement to a host.
 *
 * `REPOSITIONING.md` is binding on top of that: no retired vocabulary anywhere
 * (no halal, Qibla, prayer space, masjid, mahram), money is "held in trust
 * until you check in", and `/verification` — never `/shariah-policy` — is the
 * page that carries the matrix these rows are read from.
 *
 * The one sentence that recurs, from `/verification` itself: **documents confirm
 * a booking type and are never shown to the host.**
 */

/* ——— Glyphs ————————————————————————————————————————————————————————————— */

type GlyphProps = { readonly className?: string };

function Glyph({
  className,
  children,
}: GlyphProps & { readonly children: ReactNode }) {
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
      className={className}
    >
      {children}
    </svg>
  );
}

/** A national identity card. gw-022's CNIC row, gw-023's CNIC slot. */
export function IdCardIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M14 10h4M14 14h4" />
    </Glyph>
  );
}

/** A certificate — the FRC, the B-Form, the Nikah Nama, a power of attorney. */
export function CertificateIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 9h6M9 13h6" />
    </Glyph>
  );
}

/** A passport book. */
export function PassportIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 3h9l5 5v13H5z" />
      <path d="M9 9h5M9 13h6M9 17h4" />
    </Glyph>
  );
}

/** A visa page, or an entry stamp. */
export function VisaPageIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 14h8" />
    </Glyph>
  );
}

/** A head and shoulders — the selfie that matches a card to its holder. */
export function FaceIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="9" r="3.4" />
      <path d="M5.5 20v-.8a6.5 6.5 0 0 1 13 0v.8" />
    </Glyph>
  );
}

/** The device-dependent capture affordance. */
export function CameraIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.4" />
    </Glyph>
  );
}

/** A file lifting out of a tray — the drop zone's mark. */
export function UploadIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Glyph>
  );
}

/** A closed padlock — the privacy strip's mark. */
export function LockIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Glyph>
  );
}

/** A picture file — the attached-file row's mark. */
export function AttachedFileIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M4 18l5-4 4 3 3-2 4 3" />
    </Glyph>
  );
}

/* ——— The party ladder ————————————————————————————————————————————————————
 *
 * Six rows, in `PARTY_TYPES` order, at one visual weight, with nothing framed
 * as the normal one. `document` is the MATRIX fact for the row — what that way
 * of booking confirms — and is static on purpose: what THIS booking owes is
 * derived from `requiredDocuments(draft)` and rendered in the step's third
 * section, where it can take the guest count into account.
 */

export interface PartyCopy {
  readonly name: string;
  readonly hint: string;
  /** `null` where the row asks for nothing beyond the identity document. */
  readonly document: string | null;
  /** The second sentence of "What step 2 will ask for", once this row is chosen. */
  readonly consequence: ReactNode;
}

export const PARTY_COPY: Record<PartyType, PartyCopy> = {
  solo: {
    name: "Just me",
    hint: "One traveller, any gender",
    document: null,
    consequence: "Nothing is asked for beyond your identity document. This is a one-time check.",
  },
  couple: {
    name: "Couple",
    hint: "A married man and woman",
    document: "Nikah Nama",
    consequence:
      "A marriage certificate is the one document SalamStay itself asks for, and it confirms a booking type and nothing else. This is a one-time check.",
  },
  siblings: {
    name: "Siblings",
    hint: "A brother and sister travelling",
    document: "FRC",
    consequence:
      "An FRC is the NADRA record that shows two people are family. This is a one-time check.",
  },
  family: {
    name: "Family",
    hint: "Adults with children on the booking",
    document: "FRC and B-Form",
    // Claim 3 (SEO-RULES §5), byte-exact, and the only claim this section makes.
    consequence: (
      <>
        SalamStay offers <b className="font-semibold text-primary">FRC-verified family bookings</b>,
        so a family can book together with confidence. This is a one-time check.
      </>
    ),
  },
  women: {
    name: "Group of women",
    hint: "Women travelling together",
    document: null,
    consequence: "Nothing is asked for beyond your identity document. This is a one-time check.",
  },
  proxy: {
    name: "Booking for someone else",
    hint: "You are arranging this for another guest",
    document: "Power of attorney",
    consequence:
      "A power of attorney confirms you are acting for the guest who will stay. This is a one-time check.",
  },
};

/* ——— The documents ——————————————————————————————————————————————————————— */

export interface DocumentCopy {
  readonly name: string;
  readonly icon: (props: GlyphProps) => ReactNode;
  /** gw-022's `.ddesc` — what this document is, and why it is asked for. */
  readonly lead: ReactNode;
  /** gw-022's trailing inline action, where the corpus ships one. */
  readonly more?: { readonly href: string; readonly label: string };
  /** gw-023's `.dwhat` — the one line under the name on the upload slot. */
  readonly what: string;
  /** gw-023's per-slot note, where the corpus ships one. */
  readonly slotNote?: ReactNode;
  /** True where one slot legitimately collects several files (ruling 12). */
  readonly multiple?: boolean;
}

export const DOCUMENT_COPY: Record<DocumentId, DocumentCopy> = {
  cnic: {
    name: "CNIC",
    icon: IdCardIcon,
    what: "Front and back",
    lead: "Front and back. Short-stay guest registration is a routine legal requirement in Pakistan, and SalamStay files it for you and your host, so a CNIC is asked for on every booking.",
  },
  selfie: {
    name: "Selfie",
    icon: FaceIcon,
    what: "Confirms the CNIC is yours",
    lead: "One photo of your face, so the card can be matched to you. A photo works — there is nothing to install and nothing to hold still for.",
  },
  passport: {
    name: "Passport",
    icon: PassportIcon,
    what: "The photo page",
    lead: "The photo page, issued by your own country.",
  },
  visa: {
    name: "Pakistan visa",
    icon: VisaPageIcon,
    what: "Or a valid entry stamp",
    lead: "The visa page, or a valid entry stamp. Registering foreign guests with local authorities is required by Pakistani regulations; your passport and visa let your host complete this for you, in the background.",
    more: { href: "/help/foreign-guests", label: "How this works for overseas guests" },
  },
  "nikah-nama": {
    name: "Nikah Nama",
    icon: CertificateIcon,
    what: "Because you booked as a couple",
    lead: "The marriage certificate. It is the one document SalamStay itself asks for, it confirms a booking type, and it tells us nothing else about you.",
  },
  frc: {
    name: "FRC",
    icon: CertificateIcon,
    what: "Because you booked as a family",
    lead: (
      <>
        The NADRA Family Registration Certificate. If an FRC is not to hand, a{" "}
        <b className="font-semibold text-primary">Bayan-e-Halfi</b> (affidavit) is offered as an
        equal path, not a lesser one.
      </>
    ),
    more: { href: "/help/verification/what-is-an-frc", label: "What is an FRC, and how do I get one?" },
    slotNote: (
      <>
        No FRC to hand? A <b className="font-semibold text-primary">Bayan-e-Halfi</b> (affidavit) is
        an equal path, not a lesser one, and it is read the same way.
      </>
    ),
  },
  "b-form": {
    name: "B-Form",
    icon: CertificateIcon,
    // BUILD-DECISIONS ruling 12: the requirement is per child, the UI is ONE
    // slot that accepts several files and says which children it covers.
    multiple: true,
    what: "For the children on this booking",
    lead: "One NADRA B-Form per child, alongside the adults' verification. It identifies a child who has no CNIC of their own.",
    // No `more` here on purpose: `/legal/data-handling` is linked once per page,
    // from the closing privacy line. Two "How we handle your data" links three
    // lines apart reads as a template, not as an offer.
    slotNote: "One file per child is fine — add them all here.",
  },
  "poa-wakala": {
    name: "Power of attorney",
    icon: CertificateIcon,
    what: "Because you are booking for someone else",
    lead: "Because you are arranging this stay for another guest. It names you as the person acting for them, and confirms a booking type — nothing else.",
  },
};

/**
 * gw-023's `.dwhat`, with the two lines that are facts about THIS booking
 * rather than about the document.
 *
 * The B-Form line is the one ruling 12 requires: one slot, several files,
 * "labelled so it says which children it covers". The count is a digit run, so
 * it is isolated (`.num`) like every other digit on the site.
 */
export function documentWhat(id: DocumentId, children: number): ReactNode {
  if (id === "b-form") {
    return (
      <>
        For the <span className="num">{children}</span>
        {children === 1 ? " child" : " children"} on this booking
      </>
    );
  }
  return DOCUMENT_COPY[id].what;
}

/**
 * "your selfie and B-Form" — the list a blocking reason names.
 *
 * Deliberately no digits: the reason is rendered by the shell's `note` slot as
 * a plain string, and a digit run that reaches a string prop cannot be wrapped
 * in `.num` by the caller. Naming the documents is more useful than counting
 * them anyway.
 */
/**
 * The four identity ids. Everything else `requiredDocuments` returns is a
 * PARTY document, which is what the rail's Party row and the step's consequence
 * section both need to name.
 */
const IDENTITY_DOCUMENTS: readonly DocumentId[] = ["cnic", "selfie", "passport", "visa"];

export function partyDocuments(ids: readonly DocumentId[]): readonly DocumentId[] {
  return ids.filter((id) => !IDENTITY_DOCUMENTS.includes(id));
}

/**
 * §4's `.sumrow`, for the ONE extra row steps 1 and 2 add to the rail via
 * `CheckoutStep`'s `railRows` slot.
 *
 * **This is a second implementation of `SummaryRow` and it should not stay one.**
 * `components/booking/checkout-step.tsx` owns the rail and draws Dates and
 * Guests with a private `SummaryRow` of exactly this anatomy; it opened the
 * `railRows` slot for the party row but did not export the row component that
 * fills it, so the only alternative was to leave the slot empty and lose a row
 * §4 requires. Reported: export `SummaryRow` and delete this.
 */
export function RailSummaryRow({
  label,
  value,
  empty,
  changeHref,
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly empty: boolean;
  readonly changeHref?: string;
}) {
  return (
    <div className="mt-3.5 flex items-baseline gap-3">
      <span className="min-w-0 flex-1">
        <span className={fieldLabel}>{label}</span>
        <span className={`mt-1 block text-bodySm ${empty ? "text-secondary" : "text-primary"}`}>
          {value}
        </span>
      </span>
      {changeHref === undefined ? null : (
        <Link href={changeHref} className={`${inlineAction} flex-none text-bodySm font-medium`}>
          Change
        </Link>
      )}
    </div>
  );
}

export function listDocumentNames(ids: readonly DocumentId[]): string {
  const names = ids.map((id) => DOCUMENT_COPY[id].name);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0] as string;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1] as string}`;
}
