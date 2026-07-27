/**
 * The settings hub's hints, and the state its children start from — ONE module,
 * because `GUEST-SHELL.md` §5 makes that a correctness rule rather than a tidy
 * one:
 *
 *   > Every row spells out its current value as a hint … This is the hub's whole
 *   > job — it is legible at a glance — and it is also a trap: **the hint must be
 *   > read from the same source of truth as the child page**, or the hub
 *   > contradicts the screen it opens. Never hard-code a hint.
 *
 * `ga-123` hard-codes three of them ("WhatsApp · Push · quiet hours on", "HBL
 * •••• 8842 · 2 more saved", "English · اردو available"). All three are false
 * here, in three different ways, and each is corrected below with its reason.
 *
 * WHAT THIS MODULE IS NOT. It is not a user model and it does not become one.
 * `lib/mode.ts` says why: *"there is no stored user, no stored token and no
 * stored expiry, because none of those exist"*, and guessing their shape now is
 * guessing the auth contract. **Nothing here is a fact about a person.** Every
 * value below is either a fact about what the PRODUCT does, taken from a shipped
 * surface, or a statement about how much of an account has been filled in — and
 * the answer to that is currently "almost none", which is the truth this whole
 * tree is built around.
 */

/* ── Personal info (GA-047) ──────────────────────────────────────────────── */

/**
 * The one identity fact that exists is the display name, and it is NOT
 * re-exported from here.
 *
 * `SESSION_ACCOUNT` lives in `lib/mode.ts` behind `"use client"`, and under RSC
 * a client module's exports arrive on the server as references rather than
 * values — a server page that read a name through this module would render an
 * empty string. The one surface that needs it (`personal/step.tsx`) is already a
 * client component and imports `lib/mode.ts` directly, which is also what that
 * file asks for: one object, imported everywhere, never re-derived.
 *
 * Everything else `ga-047` draws — a date of birth, `+92 300 ••• ••67`,
 * `aqib.gulab@gmail.com`, a second address in verify-pending — is account data
 * about a person, which §14 rules a fabrication until a record exists.
 */

/**
 * The hub's Personal info hint. Derived, so it cannot disagree with the form
 * the row opens: that form seeds exactly one field and leaves three empty.
 */
export const personalHint = "Name added · no date of birth, phone or email";

/* ── Payment methods (GA-062) ────────────────────────────────────────────── */

/**
 * There are none, and the empty array is the point rather than a placeholder to
 * be filled in later.
 *
 * `ga-062` draws three saved methods and `ga-123` puts the first one's tail in
 * the hub hint. A masked tail is still an instrument: `HBL •••• 8842` asserts
 * that somebody's card is on file, which §14 lists under "never invented" beside
 * booking references and totals. The type is exported so that a future page
 * reading a real wallet gets a compile error if it forgets the empty case, not
 * so that a fixture can be dropped in here.
 */
export interface SavedPaymentMethod {
  readonly id: string;
  readonly name: string;
}

export const SAVED_PAYMENT_METHODS: readonly SavedPaymentMethod[] = [];

export const paymentHint =
  SAVED_PAYMENT_METHODS.length === 0
    ? "Nothing saved yet"
    : `${SAVED_PAYMENT_METHODS.length} saved`;

/* ── Notifications (GA-069) ──────────────────────────────────────────────── */

/**
 * THE CONSENT MODEL IS NOT `ga-069`'S. IT IS THE SHIPPED PRIVACY POLICY'S.
 *
 * `ga-069` draws a four-type × three-channel matrix in which WhatsApp, Push and
 * SMS are each switchable for booking updates, messages and reminders. The
 * indexable Privacy Policy this site already serves says the opposite, in a
 * section written against `ga-076` and named for PECA
 * (`lib/content/legal/privacy.ts`, "Messages: what's needed, and what's
 * optional"):
 *
 *   · **WhatsApp and SMS — needed for your bookings.** Booking confirmations,
 *     verification codes, messages from your host; SMS is the backup channel if
 *     WhatsApp can't reach you. These two **stay on** — `locked: true` in that
 *     module — "and you'll always be told why before one arrives."
 *   · **Offers & tips — marketing.** "**Off unless you turn it on.** Turning it
 *     on is entirely your choice, and never needed to book or host."
 *   · "This meets Pakistan's Electronic Crime Act (PECA) rules for consent:
 *     transactional messages are disclosed plainly, and marketing is opt-in
 *     only. Change this anytime in **Notification & channel preferences**."
 *
 * That last sentence names this screen as the place the choice is made, so the
 * screen has to be the shape the policy promises. Two consequences, both
 * deliberate divergences from the card:
 *
 *  1. **The transactional channels carry no switch.** A control that cannot be
 *     turned off is a lie about who decides; the honest rendering is a stated
 *     fact with the reason attached. Rendering three switches a guest cannot
 *     move would also invite the read that they had consented to something.
 *  2. **There is exactly one control on the page**, it is marketing, and it is
 *     OFF. Nothing is pre-ticked, because opt-in means an affirmative act.
 *
 * `Push` does not appear at all: there is no SalamStay app to receive a push and
 * no web-push registration on this site, so offering it as a channel would be
 * offering a delivery route that does not exist.
 */
export const TRANSACTIONAL_CHANNELS = "WhatsApp, with SMS as a backup";

/**
 * What the always-on messages actually carry — `ga-069`'s first three types,
 * kept as description now that they are no longer three sets of switches.
 *
 * `glyph` is an id rather than a component so this module stays free of JSX and
 * can be imported by a server page and a client step alike. The page maps it.
 */
export type TransactionalGlyph = "booking" | "message" | "code";

export const TRANSACTIONAL_KINDS: readonly {
  readonly glyph: TransactionalGlyph;
  readonly title: string;
  readonly body: string;
}[] = [
  {
    glyph: "booking",
    title: "Booking updates",
    body: "A confirmation when a booking is made, and a note when something about it changes.",
  },
  {
    glyph: "message",
    title: "Messages",
    body: "When your host or SalamStay support writes to you about a stay.",
  },
  {
    glyph: "code",
    title: "Verification codes",
    body: "The code that proves a phone number is yours, when you are asked for one.",
  },
];

/**
 * Marketing consent. `false`, and it is a constant rather than a default the
 * client may seed from — nothing may arrive pre-ticked, in this build or the
 * next one.
 */
export const MARKETING_OPT_IN_DEFAULT = false;

export const notificationHint = MARKETING_OPT_IN_DEFAULT
  ? "Booking messages on · offers on"
  : "Booking messages on · offers off";

/* ── Language (GA-068) ───────────────────────────────────────────────────── */

/**
 * `ga-123`'s hint reads "English · اردو available". Urdu is not available:
 * `BUILD-DECISIONS.md` #13 rules that no `/ur/` twin is registered and that the
 * language switch ships as an inert span, and `GO-LIVE` C2 tracks Urdu as
 * outstanding. A hub that says a language is available opens a switch that
 * cannot deliver it.
 */
export const INTERFACE_LANGUAGE = "English";

/* ── Privacy (GA-125) ────────────────────────────────────────────────────── */

/**
 * THE TWO PRIVACY DEFAULTS ARE THE SHIPPED PRIVACY POLICY'S, NOT `ga-125`'S —
 * WHICH HAPPENS TO AGREE, AND THAT IS WHY THEY LIVE HERE RATHER THAN IN THE PAGE.
 *
 * `lib/content/legal/privacy.ts` serves an indexable section called *"Your
 * privacy defaults"* at `/legal/privacy#defaults`, and it commits to both:
 *
 *   > You're in control of what others can see and who can reach you. **We start
 *   > you on the more private choice** — you don't have to go hunting through
 *   > settings to be safe by default.
 *   >  · *Who can see your profile — hosts you book with.*
 *   >  · *Who can message you — hosts with a booking.*
 *
 * A public page states the starting position; the screen behind the login has to
 * open on the same one, or a guest meets two products. So the two values are
 * constants read by the child page AND by the hub hint below — §5's rule that
 * *"the hint must be read from the same source of truth as the child page"*, in
 * the only form that makes it structurally true.
 *
 * These are the ONLY two `ga-125` rows that survive as controls, and the other
 * two are absent for reasons written out in `privacy/step.tsx`: approximate
 * location is a rule of the product rather than a setting (the policy files it
 * under *"What we never share"*, which opens *"not as a setting you have to
 * find"*), and blocked people has no store, no count, and no registered route
 * for G37 to resolve.
 */
export type ProfileVisibility = "hosts-you-book-with" | "everyone";
export type MessagingScope = "hosts-with-a-booking" | "anyone";

export const PROFILE_VISIBILITY_DEFAULT: ProfileVisibility = "hosts-you-book-with";
export const MESSAGING_SCOPE_DEFAULT: MessagingScope = "hosts-with-a-booking";

/**
 * The hub's Privacy hint, derived from the two constants above so it cannot
 * describe a screen that opens on something else.
 *
 * Until this page was built the hub carried a plain description ("What you share,
 * and who can reach you"), which §5 permits for a row with no state to read —
 * *"The rows that carry no state (Support, Legal, Privacy) carry a plain
 * description instead."* That row now has state, so it states it. `ga-125`'s own
 * hub hint ("Messaging limited to your hosts · Trip safety on") is still not
 * copied: half of it names a surface that does not exist.
 *
 * `·` once, spaces both sides, never chained (TASTE §7).
 */
const VISIBILITY_HINT: Readonly<Record<ProfileVisibility, string>> = {
  "hosts-you-book-with": "Profile: hosts you book with",
  everyone: "Profile: everyone",
};

const MESSAGING_HINT: Readonly<Record<MessagingScope, string>> = {
  "hosts-with-a-booking": "messages: hosts with a booking",
  anyone: "messages: anyone",
};

export const privacyHint = `${VISIBILITY_HINT[PROFILE_VISIBILITY_DEFAULT]} · ${MESSAGING_HINT[MESSAGING_SCOPE_DEFAULT]}`;
