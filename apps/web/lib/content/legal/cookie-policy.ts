import { bold, link, num } from "./types";
import type { LegalPageContent } from "./types";

/**
 * GW-014 — Cookie policy, `/legal/cookie-policy`, plus the root-layout consent
 * banner (`components/consent-banner.tsx`), which the SCREENS §2 GW-014 row
 * folds into this one row.
 *
 * THE SOURCING PROBLEM, STATED PLAINLY
 * ------------------------------------
 * The word "cookie" appears ZERO times as visible copy anywhere else in the
 * corpus: the only shipped hit is the footer's "Cookie policy" anchor pointing
 * here. There is no shipped banner copy, no category table, no cookie name, no
 * lifetime and no named analytics vendor. So this page is built the only honest
 * way available:
 *
 *  1. The four CATEGORY NAMES come from the design registry itself
 *     (SCREENS.md "consent toggles (Essential/Analytics/Marketing/
 *     Preferences)"). That is a design spec, not a factual claim.
 *  2. The DEFAULTS and the TONE are transplanted from the shipped consent
 *     doctrine: nothing pre-selected, marketing off by default, essential
 *     visible-but-disabled and disclosed rather than hidden.
 *  3. Every FACTUAL detail is a slot. No cookie name, lifetime or third party
 *     is stated, because none is shipped. An inventory of invented cookie names
 *     is worse than an inventory that admits it is not published yet.
 *
 * WHAT THIS COPY MAY NOT SAY (founder-ruled 2026-07-25)
 * ----------------------------------------------------
 * The GW-014 card ships a SECOND footer control, "Cookie settings" →
 * `/legal/cookie-policy#choices`, and this file used to describe it in three
 * places as a live link that reopens a panel. SEO-RULES §3.12 does not list it,
 * `site-footer.tsx` does not render it, and WEB-BUILD.md:53 parks building it
 * as a founder decision. The ruling was to reword rather than to build: the
 * copy now names the control that genuinely exists — the "Change your choice"
 * button in section 3 — and the footer is untouched.
 *
 * The same ruling governs the SHAPE of the choice. The card draws four toggles;
 * what ships is ONE binary record (`lib/consent.ts` — `"all" | "essential"`),
 * written by the banner's two buttons. Copy describing four independent
 * switches, a per-category "turn it off", or a banner you can close without
 * answering was describing software that does not exist. Every such sentence is
 * now written against `consent-banner.tsx` and `lib/consent.ts`.
 *
 * And the reader's own stored answer is READ, not asserted: the live line in
 * the section-3 record is `components/legal/consent-state-line.tsx`. It used to
 * be a fixed "Essential only" served identically to everyone, including
 * everyone who had pressed Accept all — on the one page whose whole job is
 * disclosing what the reader chose.
 *
 * PECA is deliberately NOT quoted here: its shipped scope is consent for
 * electronic MESSAGES, and stretching it to cover browser storage would be
 * inventing a legal basis. The privacy policy quotes it in its own scope.
 */
export const cookiePolicyPage: LegalPageContent = {
  path: "/legal/cookie-policy",
  metaDescription:
    "What SalamStay stores in your browser, the four categories it can fall into, and how to change the one consent choice you are asked for, at any time.",
  h1: "Cookie policy",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Cookie policy", path: "/legal/cookie-policy" },
  ],
  lede: [
    "What SalamStay stores in your browser, and what you can decline. ",
    bold("Only the storage the site genuinely needs is on when you arrive"),
    " — everything else waits for you to say yes, and you can change your mind at any time.",
  ],
  lastUpdated: "24 July 2026",

  sections: [
    {
      id: "scope",
      heading: "Scope",
      blocks: [
        {
          kind: "p",
          text: [
            "A cookie is a small file a website asks your browser to keep. This policy covers cookies and the similar browser storage SalamStay uses on the website — local storage and session storage work the same way, and the same choices apply to them.",
          ],
        },
        {
          kind: "p",
          text: [
            "It covers the website. What SalamStay collects about you as a person — your account, your bookings, your verification — is a different question, answered in the ",
            link("/legal/privacy", "privacy policy"),
            ".",
          ],
        },
      ],
    },

    {
      id: "categories",
      heading: "The four categories",
      blocks: [
        {
          kind: "note",
          text: [
            "Everything SalamStay stores falls into one of four groups. Only the first is on when you arrive.",
          ],
        },
        {
          kind: "table",
          captionId: "categories-table",
          caption:
            "Cookie categories, what each is for, and its state before you choose anything.",
          head: ["Category", "What it's for", "Before you choose", "Is it yours to change?"],
          rows: [
            {
              header: ["Essential"],
              cells: [
                [
                  "Keeps you signed in, keeps a booking you're part-way through, remembers whether you're reading in English or Urdu, remembers whether you told us a help article helped, and remembers the cookie choice you make below.",
                ],
                [bold("On")],
                [
                  "No — without these the site can't sign you in or take a booking. They're disclosed rather than hidden.",
                ],
              ],
            },
            {
              header: ["Analytics"],
              cells: [
                [
                  "Would let us see which pages help and which confuse — in aggregate, to improve the product.",
                ],
                [bold("Off")],
                ["Yes, though not on its own: one answer covers all three optional categories."],
              ],
            },
            {
              header: ["Marketing"],
              cells: [
                ["Would let us measure whether an advert brought you here."],
                [bold("Off")],
                [
                  "Yes, with the other two — and it is never needed to book or host.",
                ],
              ],
            },
            {
              header: ["Preferences"],
              cells: [
                [
                  "Would remember non-essential choices — a map view you prefer, a panel you've dismissed.",
                ],
                [bold("Off")],
                ["Yes, with the other two."],
              ],
            },
          ],
        },
        {
          kind: "callout",
          title: ["Nothing is chosen for you"],
          body: [
            "Three of the four categories start off, and stay off unless you accept them. That's the same rule the rest of SalamStay follows — the marketing messages you can opt into are off by default too.",
          ],
        },
      ],
    },

    {
      id: "choices",
      heading: "Your choices",
      blocks: [
        {
          kind: "note",
          text: [
            "You are asked ",
            bold("one question, not four"),
            ": accept everything, or only what the site needs. The banner asks it; the button at the end of this section brings the banner back so you can answer it again. There's only one record, so there's no second place to check.",
          ],
        },
        {
          kind: "states",
          items: [
            {
              title: ["Essential"],
              body: [
                "Sign-in, a booking in progress, your language, an answer you gave on a help article, and this choice. These ",
                bold("stay on"),
                " — they carry what the site needs to work at all, and you'll always be told they're here rather than finding them later.",
              ],
              state: "Always on",
              locked: true,
            },
            {
              title: ["Analytics, Marketing and Preferences"],
              body: [
                "The three optional categories, and one answer covers all three: ",
                bold("Accept all"),
                ", or ",
                bold("Only what's needed"),
                ". There is no switch for one of them on its own, and nothing here is pre-selected for you.",
              ],
              state: "Off by default",
            },
          ],
        },
        {
          kind: "consentRecord",
          title: ["Your current choice"],
          body: [
            "It's kept in this browser and nowhere else. Change it with the button below — that clears the record and asks you again.",
          ],
        },
      ],
    },

    {
      id: "banner",
      heading: "The consent banner",
      blocks: [
        {
          kind: "p",
          text: [
            "The first time you visit, a banner asks for this choice. It appears once, it doesn't block the page behind it, and ",
            bold("declining is exactly as easy as accepting"),
            ' — the two buttons are the same size, in the same style, with neither one promoted. There is no pre-selected option and no hidden "reject" behind an extra screen.',
          ],
        },
        {
          kind: "p",
          text: [
            "There is also no close button, because there is nothing to close past: the banner carries two buttons and both of them are answers. If you leave without giving one, you'll be asked again next time — ",
            bold("silence is a no, not a yes"),
            ", and nothing beyond the essentials is stored in the meantime.",
          ],
        },
      ],
    },

    {
      id: "inventory",
      heading: "Exactly what we set",
      blocks: [
        {
          kind: "p",
          text: [
            "A cookie policy is only as useful as its inventory — the actual names, what each one does, how long it lasts, and whether anyone other than SalamStay sets it. Ours isn't published yet, and we'd rather show you the empty table than fill it with plausible-looking entries.",
          ],
        },
        /*
         * Checkable, and checked before it was written: `apps/web` has no
         * middleware, no `next/headers` cookies() call, no `document.cookie`,
         * no third-party <script> or <iframe> and no analytics package. The
         * only storage the site writes today is `localStorage` —
         * `salamstay.cookie-consent` (the record in section 3) and
         * `salamstay.help-vote` (the help-article answer, now named in the
         * essential row of section 2). Re-run those greps before editing this
         * paragraph; it is the one sentence on the page that would go stale the
         * day a vendor lands.
         */
        {
          kind: "p",
          text: [
            "What is true today is narrower than that table will one day be: SalamStay sets ",
            bold("no cookie of its own"),
            " on this website, and no third party sets one here either — there is no advertising tag, no analytics vendor and no embedded player on any page. What the site does keep, it keeps in your browser's own storage, and the essential row in section ",
            num("2"),
            " is the whole of it.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed at build",
          title: [num("5.1"), "  The cookie inventory"],
          body: [
            "One row per cookie, under the columns below. ",
            bold("No cookie name, lifetime or third party is stated on SalamStay today"),
            ", so none is listed here — and if a third party ever sets one, it will be named in this table before it is set.",
          ],
          columns: ["Name", "Category", "Purpose", "Lifetime"],
        },
      ],
    },

    {
      id: "change",
      heading: "Changing your mind",
      blocks: [
        {
          kind: "p",
          text: [
            bold("Change this anytime."),
            " The ",
            bold("Change your choice"),
            " button in section ",
            num("3"),
            " clears the record and brings the banner back, so you can answer it again — the same two buttons, in the same place they were the first time. Every page's footer links to this policy, so you never have to remember the address.",
          ],
        },
        {
          kind: "p",
          text: [
            "A new answer replaces the old one from that moment. You can also clear this site's storage in your own browser at any time; if you do, the site will ask for your choice again, because the record of it was itself stored in your browser.",
          ],
        },
      ],
    },

    {
      id: "related",
      heading: "Cookies and your other data",
      blocks: [
        {
          kind: "p",
          text: [
            "Nothing on this page changes what's in the ",
            link("/legal/privacy", "privacy policy"),
            ": ",
            bold("your personal information is never sold"),
            ", your phone and email are never shown to other members, and your NADRA verification documents stay redacted, always.",
          ],
        },
        {
          kind: "p",
          text: [
            "Marketing messages are a separate choice from marketing cookies, and neither one is on unless you say so. You can change the messages choice in your notification and channel preferences.",
          ],
        },
      ],
    },

    {
      id: "contact",
      heading: "Contact us",
      blocks: [
        {
          kind: "p",
          text: [
            "If anything on this page is unclear, ask us — in Urdu or in English. We would rather explain it twice than have you guess.",
          ],
        },
      ],
    },
  ],

  closing: {
    title: "Questions about cookies",
    body: [
      "Read the ",
      link("/legal/privacy", "privacy policy"),
      ", the ",
      link("/legal/terms", "Terms of Service"),
      ", or browse the ",
      link("/help", "help center"),
      ".",
    ],
    ctaLabel: "Contact support",
    ctaHref: "/help/contact",
  },
};
