import { bold, link, num } from "./types";
import type { LegalPageContent } from "./types";

/**
 * GW-012 — Guest refund policy, `/legal/guest-refund-policy`.
 *
 * SLUG: the card file is `gw-012-refund-policy.html`, but the ROUTE is
 * `/legal/guest-refund-policy` — the slug shipped in the §3.12 footer
 * inventory, in SEO-RULES §3.8 and in the SCREENS §2 row. There is no
 * `/legal/refund-policy` anywhere in the corpus.
 *
 * This is the CANONICAL cancellation source (GATE 14 / F16), so it is composed
 * exclusively from figures already shipped — nothing is derived, rounded or
 * extrapolated. The three tier windows come from the HA-078 radiogroup, the
 * service-fee sentence and the quiet no-refund line from GA-034, the timing
 * rows from GA-034 + GA-106. (The Ramadan/Eid extension and its Hijri callout
 * were removed on 2026-07-26 — see the note where the section stood.)
 *
 * THE WORKED EXAMPLE IS ARITHMETIC, AND IT HAS TO BALANCE:
 *   25,000 refunded + 12,500 first night + 4,850 fee and taxes = 42,350 paid.
 * Every one of those four figures is a shipped number; the identity between
 * them is the reason the ledger can be published at all. Change one and the
 * page is lying about the other three.
 */
export const guestRefundPolicyPage: LegalPageContent = {
  path: "/legal/guest-refund-policy",
  metaDescription:
    "How cancellations and refunds work on SalamStay: the three policies a host can set, what the service fee covers, and when your money reaches you.",
  h1: "Guest refund policy",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Guest refund policy", path: "/legal/guest-refund-policy" },
  ],
  lede: [
    "Every home carries one of three cancellation policies, set by its host and shown to you before you pay. This page is the full version of what you see there — ",
    bold("the windows, what isn't refunded, and when the money reaches you"),
    ". You always see the exact rupee amount before you confirm anything.",
  ],
  lastUpdated: "24 July 2026",

  sections: [
    {
      id: "scope",
      heading: "Which policy applies to you",
      blocks: [
        {
          kind: "p",
          text: [
            "The host chooses one of three policies for their home. It's printed on the listing, shown again at booking review before you pay, and repeated in your trip details afterwards — so you never have to come to this page to find out which one you're on.",
          ],
        },
        {
          kind: "p",
          text: [
            "Because your payment is held in trust until you check in, ",
            "your refund comes straight back from that hold — ",
            bold("no waiting on the host"),
            " — for whatever the stay's cancellation policy allows.",
          ],
        },
      ],
    },

    {
      id: "tiers",
      heading: "The three cancellation policies",
      blocks: [
        {
          kind: "note",
          text: [
            "Read across your host's row. All times are measured against your check-in, and a full refund means everything you paid comes back.",
          ],
        },
        {
          kind: "table",
          captionId: "tiers-table",
          caption:
            'Cancellation windows by policy. "Half" means half of your nightly total returns; the service fee is kept.',
          head: ["Policy", "Full refund", "Half refund", "No refund"],
          rows: [
            {
              header: ["Flexible"],
              cells: [
                [
                  "Free cancellation until ",
                  bold(num("5"), " days before check-in"),
                  " — everything you paid comes back.",
                ],
                ["Until ", bold(num("48"), " hours before check-in"), "."],
                ["After that, or once you've checked in."],
              ],
            },
            {
              header: ["Moderate"],
              cells: [
                [
                  "Free cancellation until ",
                  bold(num("7"), " days before check-in"),
                  " — everything you paid comes back.",
                ],
                ["Until ", bold(num("48"), " hours before check-in"), "."],
                ["After that, or once you've checked in."],
              ],
            },
            {
              header: ["Strict"],
              cells: [
                [
                  "Free cancellation only ",
                  bold("within ", num("48"), " hours of booking"),
                  ", if that's ",
                  bold(num("14"), "+ days before check-in"),
                  ".",
                ],
                ["Until ", bold(num("7"), " days before check-in"), "."],
                ["Within ", num("7"), " days of check-in, or after arrival."],
              ],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "A host who asks for Strict is asking for more certainty about their calendar. It isn't a judgement about you, and it's stated on the listing before you commit.",
          ],
        },
      ],
    },

    // REMOVED 2026-07-26 — the "Ramadan and Eid" section (GO-LIVE A9).
    //
    // It promised a host-settable extension of free cancellation to 10 days for
    // stays over Ramadan and Eid, with a callout explaining that the boundaries
    // "follow the Hijri calendar". Three things were true of that promise and
    // none of them survived scrutiny: the product ships no Hijri calendar (the
    // founder's ruling dropped that layer from the date picker), no host UI
    // exists to set the extension, and no guest surface could show it. A
    // canonical refund page is the last place to describe an entitlement that
    // cannot be exercised — a guest who cancelled at day 8 expecting a full
    // refund would have been reading a policy the system cannot honour.
    //
    // The IDEA is good and specifically Pakistani: travel plans really do move
    // around Eid. It is logged as a Phase-2 feature to build properly, with the
    // window expressed in dates SalamStay publishes each year rather than in a
    // calendar the product does not carry. Nothing replaces the section here —
    // a labelled slot on a guest-facing legal page advertises an absence.

    {
      id: "notrefunded",
      heading: "What isn't refunded",
      blocks: [
        {
          kind: "p",
          text: [
            "Two things sit outside a partial refund, and both are visible on your price breakdown before you pay — ",
            bold("Transparent fees and tax — every rupee shown before you book or earn"),
            ".",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["The service fee"],
              body: [
                "Half of your nightly total returns; the service fee is kept. SalamStay acts as your booking agent and charges a fixed, disclosed commission for arranging and safeguarding your stay — it's a flat agency fee shown up front, not interest and not a hidden markup on the host's price.",
              ],
            },
            {
              title: ["Nights already reserved for you"],
              body: [
                "Nights already reserved for you are non-refundable — the home was held off the calendar for those dates.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "example",
      heading: "A worked example",
      blocks: [
        {
          kind: "note",
          text: [
            "A real three-night booking, cancelled after the free window closed. This is the same ledger you'd see in the app before confirming — every line, with the total.",
          ],
        },
        {
          kind: "ledger",
          title: ["You're cancelling"],
          meta: [
            "Margalla View Apartment · Fri ",
            num("14"),
            " – Mon ",
            num("17"),
            " Aug ",
            num("2026"),
            " · paid PKR ",
            num("42,350"),
          ],
          rows: [
            {
              title: ["Nights ", num("2"), " & ", num("3")],
              note: [num("2"), " nights × PKR ", num("12,500"), " · refunded"],
              value: ["PKR ", num("25,000")],
            },
            {
              title: ["First night"],
              note: ["Held per policy · non-refundable"],
              value: ["PKR ", num("12,500")],
              muted: true,
            },
            {
              title: ["Service fee & taxes"],
              note: ["Already earned · non-refundable"],
              value: ["PKR ", num("4,850")],
              muted: true,
            },
          ],
          total: {
            title: ["Total refund"],
            note: ["Back to the card you paid with"],
            value: ["PKR ", num("25,000")],
          },
        },
        {
          kind: "p",
          text: [
            "This policy's free-cancellation window closed ",
            num("7"),
            " Aug. Cancelling on ",
            num("10"),
            " Aug, the first night is non-refundable — ",
            bold("everything else comes back, exactly as above"),
            ". Nothing is estimated: you see this ledger, for today's date, before you confirm.",
          ],
        },
      ],
    },

    {
      id: "timing",
      heading: "How your refund reaches you",
      blocks: [
        {
          kind: "p",
          text: [
            "Refunds return to the ",
            bold("same card, wallet, or bank account"),
            " you paid with — you don't choose a different destination, and you don't need to ask for it.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Card refunds"],
              body: [
                "Most reach you in ",
                bold(num("5"), "–", num("7"), " business days"),
                " once sent.",
              ],
            },
            {
              title: ["Wallet refunds"],
              body: [
                "JazzCash and EasyPaisa refunds usually arrive sooner than card refunds — timing depends on your bank.",
              ],
            },
            {
              title: ["Bank transfers"],
              body: ["Local bank transfers can take a little longer."],
            },
            {
              title: ["You can follow it"],
              body: [
                "Requested, processing, sent — each stage is dated in your trips, with the destination shown.",
              ],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "Cancel any time from Trips. You'll see the exact refund for today's date before you confirm — no surprises.",
          ],
        },
      ],
    },

    {
      id: "changes",
      heading: "If a host changes their policy",
      blocks: [
        {
          kind: "p",
          text: [
            "A host can change the cancellation policy on their home at any time. It never reaches back to you: policy changes apply to ",
            bold("new bookings only"),
            " — guests who already booked keep the policy they booked under.",
          ],
        },
      ],
    },

    {
      id: "disputes",
      heading: "If you and your host disagree",
      blocks: [
        {
          kind: "p",
          text: [
            "Sometimes a guest and a host see a stay differently and need help resolving it. That is what mediation is for — ",
            bold("not a complaint filed against your host"),
            ", and not a case you win. Both sides are asked for their view, and the outcome is stated plainly.",
          ],
        },
        {
          kind: "steps",
          items: [
            {
              title: ["Case opened"],
              body: [
                "You describe what happened, scoped to one booking, and attach anything that helps.",
              ],
            },
            {
              title: ["Both sides share their view"],
              body: [
                "Your host is asked for their side too. Neither account is treated as the default truth.",
              ],
            },
            {
              title: ["SalamStay mediates"],
              body: [
                // Was `term("amanah")` until 2026-07-26. REPOSITIONING.md's money
                // table maps the term to plain English precisely because a guest
                // reading a refund page needs to know where their money is, not
                // learn a word. The mechanism is unchanged; only the label went.
                "Our team reviews both statements. Your payment stays held in trust until the case resolves.",
              ],
            },
            {
              title: ["Resolution"],
              body: ["The outcome is stated plainly — what is returned, to whom, and when."],
            },
          ],
        },
        {
          kind: "p",
          text: ["Read more about ", link("/trust-and-safety", "how mediation works"), "."],
        },
      ],
    },

    {
      id: "special",
      heading: "Special circumstances",
      blocks: [
        {
          kind: "p",
          text: [
            "Beyond the windows above, SalamStay does not currently operate a separate extenuating-circumstances policy. If something serious happens, ",
            link("/help/contact", "talk to support"),
            " — a person reads every ticket — and if the stay is already in dispute, mediation is the route.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("9.1"), "  A force-majeure and extenuating-circumstances policy"],
          body: [
            "Which events override the host's policy, what evidence is asked for, and who bears the cost. ",
            bold("No such entitlement exists on SalamStay today"),
            ", so none is described here — a policy that promised one would be a promise we couldn't keep at the counter.",
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
    title: "Questions about a refund",
    body: [
      "Read the ",
      link("/legal/terms", "Terms of Service"),
      ", the ",
      link("/legal/community-standards", "community standards"),
      ", or see ",
      link("/trust-and-safety", "how your money is held"),
      ".",
    ],
    ctaLabel: "Contact support",
    ctaHref: "/help/contact",
  },
};
