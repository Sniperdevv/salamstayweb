import { bold, link, num, term } from "./types";
import type { LegalPageContent } from "./types";

/**
 * GW-010 — Terms of Service, `/legal/terms`.
 *
 * Every substantive sentence here is lifted from copy already shipped on a
 * screen: age eligibility from GA-086, the `amanah` hold from GA-059, the
 * `wakala` definition from GA-050, the account hold and appeal from GA-113.
 *
 * The four clauses a Terms of Service normally turns on — legal entity,
 * governing law and forum, liability, and how the terms change — ship as
 * LABELLED COUNSEL SLOTS. A repo-wide grep found zero shipped copy for any of
 * them: no entity name, no SECP registration, no jurisdiction, no forum, no
 * statute. Writing them would mean inventing a legal person and a body of law,
 * so they are parked for the founder and shown as visibly unfinished rows.
 *
 * §5 registry claims appear VERBATIM and nowhere else: claims 1, 2, 3 in "Your
 * account and verification", claim 9 in "Booking a stay", claim 4 in "House
 * rules and conduct".
 */
export const termsPage: LegalPageContent = {
  path: "/legal/terms",
  metaDescription:
    "The terms behind a SalamStay account: who can join, how verification works, how payments are held in amanah until check-in, and how to reach us.",
  h1: "Terms of Service",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/legal/terms" },
  ],
  lede: [
    "These are the terms behind a SalamStay account. They cover ",
    bold("guests and hosts alike"),
    " — who can join, how verification works, how your money is held until you check in, and what happens when something goes wrong. Written plainly, because you should be able to read them once and know where you stand.",
  ],
  lastUpdated: "24 July 2026",

  sections: [
    {
      id: "scope",
      heading: "Scope — who these terms cover",
      blocks: [
        {
          kind: "p",
          text: [
            "SalamStay is a home-sharing marketplace for Pakistan. These terms apply to ",
            bold("everyone with a SalamStay account"),
            " — guests who book, hosts who list, and anyone who switches between the two. They apply from the moment you create an account, and they sit alongside the other policies linked throughout this page.",
          ],
        },
        {
          kind: "p",
          text: [
            "SalamStay is not the owner of the homes on it. Each stay is a booking between you and a host, arranged through SalamStay. ",
            bold("SalamStay acts as your booking agent (", term("wakala"), ")"),
            " and charges a fixed, disclosed commission for arranging and safeguarding your stay. It's a flat agency fee shown up front — not interest, and not a hidden markup on the host's price.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["If you book"],
              body: [
                "These terms, plus the ",
                link("/legal/guest-refund-policy", "guest refund policy"),
                " and the ",
                link("/legal/community-standards", "community standards"),
                ".",
              ],
            },
            {
              title: ["If you host"],
              body: [
                "These terms, plus the ",
                link("/legal/host-terms", "host terms"),
                " and the same community standards — they apply to both sides of a booking.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "who",
      heading: "Who can use SalamStay",
      blocks: [
        {
          kind: "p",
          text: [
            bold("SalamStay accounts are for adults ", num("18"), " and over."),
            " You must be ",
            num("18"),
            " or older to book. We ask for your date of birth when you sign up and check it before your account is created.",
          ],
        },
        {
          kind: "p",
          text: [
            "Your date of birth confirms you're old enough to use SalamStay and helps with verification — it's never shown on your profile.",
          ],
        },
        {
          kind: "callout",
          title: ["Children on a booking"],
          body: [
            "Children can travel with you on a stay. They don't hold accounts of their own, and a family booking may ask for a B-Form — see ",
            link("/shariah-policy", "our Shariah-respectful approach"),
            " for which document applies to which booking type.",
          ],
        },
      ],
    },

    {
      id: "account",
      heading: "Your account and verification",
      blocks: [
        {
          kind: "p",
          text: [
            "SalamStay runs on ",
            bold("CNIC-verified guests and hosts via NADRA Verisys"),
            ". Guests verify. Hosts verify. The same check runs on both sides of every booking, and we only ask for a document when a rule actually applies to your booking type — ",
            bold("you are trusted by default"),
            ".",
          ],
        },
        { kind: "h3", text: "Documents we may ask for" },
        {
          kind: "facts",
          items: [
            {
              title: ["CNIC-verified guests and hosts via NADRA Verisys"],
              body: ["The base check on every account, run once against NADRA's record."],
            },
            {
              title: ["Nikah Nama–verified couples' bookings"],
              body: ["Asked for only when the booking is made as a couple."],
            },
            {
              title: ["FRC-verified family bookings"],
              body: [
                "The NADRA Family Registration Certificate, for mixed-gender siblings.",
              ],
            },
            {
              title: ["Your documents stay private"],
              body: [
                "A Nikah Nama, an FRC or a B-Form confirms your booking type and is then kept encrypted. Your host never sees it, and it is never published on your profile.",
              ],
            },
          ],
        },
        { kind: "h3", text: "If a check doesn't pass" },
        {
          kind: "p",
          text: [
            "A check that doesn't pass is never a verdict on you. You see what was unclear and what to do next, and you can re-submit — or reach a person at ",
            link("/help/contact", "contact support"),
            ".",
          ],
        },
      ],
    },

    {
      id: "booking",
      heading: "Booking a stay",
      blocks: [
        {
          kind: "p",
          text: [
            "A booking is confirmed when the host accepts it and your payment is taken. Before you pay, you see the whole price: ",
            bold("Transparent fees and tax — every rupee shown before you book or earn."),
            " The same breakdown is shown to your host before they earn. Nothing is added afterwards.",
          ],
        },
        {
          kind: "p",
          text: [
            "Each home carries the host's own house rules. ",
            bold("You'll agree to these rules once, at booking review, before you pay"),
            " — they're part of the booking, not fine print discovered later.",
          ],
        },
        {
          kind: "callout",
          title: ["What the listing says is what applies"],
          body: [
            "The attributes on a listing — including ",
            bold("no-alcohol listings by default"),
            " and whether a home is women-only — are the host's stated policy for that home, and they form part of your booking.",
          ],
        },
      ],
    },

    {
      id: "money",
      heading: "Paying, and how your money is held",
      blocks: [
        {
          kind: "p",
          text: [
            "When you pay, your money doesn't go straight to the host. We hold it in ",
            term("amanah"),
            " — a trust — and release it ",
            bold("only after you've checked in"),
            ". It protects both sides: you know the host is paid once you've arrived, and the host knows the money is really there.",
          ],
        },
        {
          kind: "steps",
          items: [
            {
              title: ["You pay"],
              body: ["Your payment leaves your card or wallet in Pakistani Rupees."],
            },
            {
              title: ["Held in amanah"],
              body: [
                "It sits in a custody account at Meezan Bank — not spent, not lent out, no interest earned on it.",
              ],
            },
            {
              title: ["You check in"],
              body: ["Once your stay begins and check-in is confirmed, the hold is released."],
            },
            {
              title: ["The host is paid"],
              body: ["The stay amount is sent to the host. You get your receipt in the app."],
            },
          ],
        },
        { kind: "h3", text: "Why Meezan Bank" },
        {
          kind: "p",
          text: [
            "Meezan is an Islamic bank, so your money is held in a ",
            bold("custody arrangement, not a lending one"),
            " — it isn't put to work to earn interest while it waits. It's simply kept until it's due. SalamStay does not spend it, lend it, or earn interest on it — it's yours until it's released to the host or refunded to you.",
          ],
        },
        {
          kind: "p",
          text: [
            "Read the fuller explanation in ",
            link("/trust-and-safety", "trust & safety"),
            ".",
          ],
        },
      ],
    },

    {
      id: "cancel",
      heading: "Cancellations and refunds",
      blocks: [
        {
          kind: "p",
          text: [
            "Every home carries one of three cancellation policies, set by its host. The policy that applies to your booking is shown on the listing and again at booking review, before you pay.",
          ],
        },
        {
          kind: "p",
          text: [
            "Because the money is still held, your refund comes straight back from that hold — no waiting on the host — for whatever the stay's cancellation policy allows. The full tiers, the worked figures and the timings live in the ",
            link("/legal/guest-refund-policy", "guest refund policy"),
            ", which is the canonical source for all cancellation text.",
          ],
        },
      ],
    },

    {
      id: "conduct",
      heading: "House rules and conduct",
      blocks: [
        {
          kind: "p",
          text: [
            "Two sets of rules apply to a stay. The ",
            bold("host's house rules"),
            " are specific to that home — check-in and check-out times, quiet hours, whether visitors may stay overnight, and the host's own requests for the home. The ",
            bold("community standards"),
            " apply everywhere on SalamStay, to guests and hosts alike.",
          ],
        },
        {
          kind: "p",
          text: [
            bold("No-alcohol listings by default."),
            " Hosts who allow alcohol must explicitly opt in and disclose it on the listing, so what you read is what applies.",
          ],
        },
        {
          kind: "p",
          text: [
            "Read the full ",
            link("/legal/community-standards", "community standards"),
            " — what is and isn't acceptable on SalamStay, for guests and hosts alike, written plainly and applied to both sides of a booking.",
          ],
        },
      ],
    },

    {
      id: "hosting",
      heading: "Hosting on SalamStay",
      blocks: [
        {
          kind: "p",
          text: [
            "Your SalamStay account works for both — ",
            bold("your guest verification carries over"),
            ", so you don't verify twice. When you start hosting, the ",
            link("/legal/host-terms", "host terms"),
            " apply in addition to this page: listing accuracy, payouts, tax, and the licences a short-stay host needs in their province.",
          ],
        },
        {
          kind: "p",
          text: [
            "Everything in these terms about verification, conduct, data and account holds applies to you as a host in exactly the same way it applies to you as a guest.",
          ],
        },
      ],
    },

    {
      id: "data",
      heading: "Your data",
      blocks: [
        {
          kind: "p",
          text: [
            "You can ",
            bold("export or delete it anytime"),
            "; your NADRA verification documents stay redacted, always. Your CNIC is encrypted and used only for verification — hosts and guests never see it.",
          ],
        },
        {
          kind: "p",
          text: [
            "What we collect, why, who it is shared with, and how to exercise those rights is set out in the ",
            link("/legal/privacy", "privacy policy"),
            ". Cookies and similar technologies are covered separately in the ",
            link("/legal/cookie-policy", "cookie policy"),
            ".",
          ],
        },
      ],
    },

    {
      id: "hold",
      heading: "If your account is put on hold",
      blocks: [
        {
          kind: "p",
          text: [
            "An account can be put on hold while something is sorted out — an unresolved payment dispute on a recent booking, for example. ",
            bold("Nothing here is permanent — let's get it resolved together."),
            " You're told what needs sorting, and what is paused meanwhile.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Still available"],
              body: ["View your trips & receipts. Message our support team."],
            },
            {
              title: ["Paused for now"],
              body: ["Making new bookings. Messaging hosts."],
            },
          ],
        },
        { kind: "h3", text: "Telling us your side" },
        {
          kind: "p",
          text: [
            "You can appeal. Share anything that helps us understand what happened — there's no wrong way to explain it. ",
            bold("A person on our team reads every appeal"),
            " and replies by email and in the app. You can keep using support while you wait.",
          ],
        },
        {
          kind: "callout",
          title: ["Disagreements about a specific stay go to mediation, not here"],
          body: [
            "If you and a host see a stay differently, that's mediation — ",
            bold("not a complaint filed against your host"),
            ", and not a case you win. Both sides are asked for their view. See ",
            link("/trust-and-safety", "how mediation works"),
            ".",
          ],
        },
      ],
    },

    {
      id: "counsel",
      heading: "Clauses still being completed",
      blocks: [
        {
          kind: "note",
          text: [
            "SalamStay is in beta. Four clauses that belong in a Terms of Service are ",
            bold("not written yet"),
            ", because writing them means naming a legal person, a forum and a body of law — and we would rather show you an empty box than a sentence we can't stand behind. They are being completed with counsel and will appear here, with the effective date stamped at the top of this page.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("11.1"), "  The SalamStay legal entity"],
          body: [
            "The registering company, its incorporation details, and the registered address that notices should be sent to. ",
            bold("No entity name is stated anywhere on SalamStay today"),
            ", and none is asserted here.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("11.2"), "  Governing law and where disputes are heard"],
          body: [
            "Which law governs these terms, and the forum for a dispute that mediation doesn't resolve. Until this is settled, ",
            bold("SalamStay makes no claim about jurisdiction or forum"),
            " — and the mediation route in clause ",
            num("10"),
            " is what actually exists today.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("11.3"), "  Liability, and what each side is responsible for"],
          body: [
            "The limits of SalamStay's responsibility as the agent arranging a stay, and what a guest and a host each carry. Nothing on this page should be read as a limitation of liability until this clause is written.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("11.4"), "  How these terms change, and how you'll be told"],
          body: [
            "How far in advance a change is announced, how you'll hear about it, and what happens to a booking made under the previous version. The pattern SalamStay already follows elsewhere is that ",
            bold("policy changes apply to new bookings only"),
            " — guests who already booked keep the policy they booked under.",
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
            "If anything on this page is unclear, ask us — in Urdu or in English. We would rather explain it twice than have you guess. ",
            bold("Two-way reviews and ", num("24/7"), " Urdu + English support"),
            " — a person reads every ticket.",
          ],
        },
      ],
    },
  ],

  closing: {
    title: "Questions about these terms",
    body: [
      "Read the ",
      link("/legal/privacy", "privacy policy"),
      ", the ",
      link("/legal/guest-refund-policy", "guest refund policy"),
      " or the ",
      link("/legal/community-standards", "community standards"),
      " — or browse the ",
      link("/help", "help center"),
      ".",
    ],
    ctaLabel: "Contact support",
    ctaHref: "/help/contact",
  },
};
