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
 * corpus: every hit is the footer anchor pointing here. There is no shipped
 * banner copy, no category table, no cookie name, no lifetime and no named
 * analytics vendor. So this page is built the only honest way available:
 *
 *  1. The four CATEGORY NAMES come from the design registry itself
 *     (SCREENS.md "consent toggles (Essential/Analytics/Marketing/
 *     Preferences)"). That is a design spec, not a factual claim.
 *  2. The DEFAULTS and the TONE are transplanted from the shipped consent
 *     doctrine: nothing pre-ticked, marketing off by default, essential
 *     visible-but-disabled and disclosed rather than hidden.
 *  3. Every FACTUAL detail is a slot. No cookie name, lifetime or third party
 *     is stated, because none is shipped. An inventory of invented cookie names
 *     is worse than an inventory that admits it is not published yet.
 *
 * PECA is deliberately NOT quoted here: its shipped scope is consent for
 * electronic MESSAGES, and stretching it to cover browser storage would be
 * inventing a legal basis. The privacy policy quotes it in its own scope.
 */
export const cookiePolicyPage: LegalPageContent = {
  path: "/legal/cookie-policy",
  metaDescription:
    "What SalamStay stores in your browser, the four categories you can control, and how to change your choice at any time.",
  h1: "Cookie policy",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Cookie policy", path: "/legal/cookie-policy" },
  ],
  lede: [
    "What SalamStay stores in your browser, and what you can switch off. ",
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
          head: ["Category", "What it's for", "Before you choose", "Can you switch it off?"],
          rows: [
            {
              header: ["Essential"],
              cells: [
                [
                  "Keeps you signed in, keeps a booking you're part-way through, remembers whether you're reading in English or Urdu, and remembers the cookie choice you make below.",
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
                ["Yes. It stays off unless you turn it on."],
              ],
            },
            {
              header: ["Marketing"],
              cells: [
                ["Would let us measure whether an advert brought you here."],
                [bold("Off")],
                [
                  "Yes. It stays off unless you turn it on, and it is never needed to book or host.",
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
                ["Yes. It stays off unless you turn it on."],
              ],
            },
          ],
        },
        {
          kind: "callout",
          title: ["Nothing is ticked for you"],
          body: [
            "Three of the four categories start off, and stay off until you switch them on. That's the same rule the rest of SalamStay follows — the marketing messages you can opt into are off by default too.",
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
            "This is the control itself. It's the same panel the banner opens, and the same one the ",
            bold("Cookie settings"),
            " link in the footer reopens — there's only one, so there's no second place to check.",
          ],
        },
        {
          kind: "states",
          items: [
            {
              title: ["Essential"],
              body: [
                "Sign-in, a booking in progress, your language, and this choice. These ",
                bold("stay on"),
                " — they carry what the site needs to work at all, and you'll always be told they're here rather than finding them later.",
              ],
              state: "Always on",
              locked: true,
            },
            {
              title: ["Analytics"],
              body: [
                "Helps us see which pages work and which don't. ",
                bold("Off unless you turn it on."),
              ],
              state: "Off",
            },
            {
              title: ["Marketing"],
              body: [
                "Measures whether an advert brought you here. ",
                bold("Off unless you turn it on."),
                " Turning it on is entirely your choice, and never needed to book or host.",
              ],
              state: "Off",
            },
            {
              title: ["Preferences"],
              body: [
                "Remembers non-essential choices you've made. ",
                bold("Off unless you turn it on."),
              ],
              state: "Off",
            },
          ],
        },
        {
          kind: "consentRecord",
          title: ["Your current choice"],
          body: [
            "Essential only. Analytics, Marketing and Preferences are off. Change it here or from ",
            bold("Cookie settings"),
            " in the footer of any page.",
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
            ' — the two buttons are the same size, in the same style, side by side. There is no pre-selected option and no hidden "reject" behind an extra screen.',
          ],
        },
        {
          kind: "p",
          text: ["If you close the banner without choosing, nothing is turned on. Silence is a no, not a yes."],
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
            bold("Cookie settings"),
            " link sits in the footer of every page and reopens the same panel in section ",
            num("3"),
            " — you don't have to find this policy again to change a switch.",
          ],
        },
        {
          kind: "p",
          text: [
            "Turning a category off stops it from that moment. You can also clear cookies in your own browser at any time; if you do, the site will ask for your choice again, because the record of it was itself stored in your browser.",
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
            "Marketing messages are a separate choice from marketing cookies, and both are off unless you turn them on. You can change the messages one in your notification and channel preferences.",
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
