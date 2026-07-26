import { bold, link, num, term } from "./types";
import type { LegalPageContent } from "./types";

/**
 * GW-011 — Privacy Policy, `/legal/privacy`.
 *
 * Every data-practice fact on this page comes from a shipped consent surface,
 * row by row: GA-075 for the NADRA one-time match, GA-086 for the age gate,
 * GW-007 for document privacy, GA-076 for the WhatsApp/SMS split and the PECA
 * sentence, GA-080 for the export manifest, GA-059 for Meezan custody, HA-012
 * for the FBR withholding line, GW-006 for guest registration.
 *
 * Three things are NOT settled and therefore ship as counsel slots rather than
 * as numbers: the full retention schedule, the storage region, and the
 * published processor list. SalamStay states no retention period it has not
 * settled and names no location it has not chosen.
 */
export const privacyPage: LegalPageContent = {
  path: "/legal/privacy",
  metaDescription:
    "What SalamStay collects, why, and who it goes to — plus how to export or delete your data. Your NADRA verification documents stay redacted, always.",
  h1: "Privacy Policy",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/legal/privacy" },
  ],
  lede: [
    "What SalamStay collects, why it collects it, and who it goes to — set out row by row, so you can check any single fact without reading the whole page. You can ",
    bold("export or delete your data anytime"),
    "; your NADRA verification documents stay redacted, always.",
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
            "This policy covers the personal information SalamStay handles when you browse, book a stay, or host one — on the website and in the apps. It applies to guests and hosts alike.",
          ],
        },
        {
          kind: "p",
          text: [
            "It sits alongside the ",
            link("/legal/terms", "Terms of Service"),
            ", which govern the account itself, and the ",
            link("/legal/cookie-policy", "cookie policy"),
            ", which covers what is stored in your browser.",
          ],
        },
      ],
    },

    {
      id: "collect",
      heading: "What we collect, and where it goes",
      blocks: [
        {
          kind: "note",
          text: [
            "Each row names one thing we hold, the single reason we hold it, and every party that sees it. If a party is not named in this table, your information does not go to them.",
          ],
        },
        {
          kind: "table",
          captionId: "collect-table",
          caption:
            'What SalamStay collects, why, and who receives it. Rows marked "you only" are visible to you and to no other member.',
          head: ["What we hold", "Why we hold it", "Who sees it"],
          rows: [
            {
              header: ["Name, CNIC number, date of birth"],
              cells: [
                [
                  "To run the identity check — ",
                  bold("CNIC-verified guests and hosts via NADRA Verisys"),
                  ". Your details are encrypted and used only for this one-time match.",
                ],
                [
                  "NADRA Verisys, for the match. ",
                  bold("Nothing beyond this — never shared with hosts or other guests."),
                ],
              ],
            },
            {
              header: ["Date of birth"],
              cells: [
                ["Confirms you're old enough to use SalamStay and helps with verification."],
                ["You only — ", bold("it's never shown on your profile"), "."],
              ],
            },
            {
              header: ["Nikah Nama, FRC or B-Form"],
              cells: [
                [
                  "Asked for only when a rule applies to your booking type — ",
                  bold("Nikah Nama–verified couples' bookings"),
                  " and ",
                  bold("FRC-verified family bookings"),
                  ".",
                ],
                [
                  "You only. The document confirms your booking type and is then kept encrypted. Your host ",
                  bold("never sees it"),
                  ", and it is never published on your profile.",
                ],
              ],
            },
            {
              header: ["Mobile number"],
              cells: [
                [
                  "Booking confirmations, verification codes, messages from your host — by WhatsApp, with SMS as a backup channel if WhatsApp can't reach you.",
                ],
                [
                  "The messaging channel you're contacted on. ",
                  bold("Your phone and email are never shown to other members."),
                ],
              ],
            },
            {
              header: ["Your bookings, messages, reviews and profile"],
              cells: [
                [
                  "To run your trips, your conversations and your reviews — and to give you a copy on request.",
                ],
                ["You, and the host or guest on the other side of that specific booking."],
              ],
            },
            {
              header: ["Payment details"],
              cells: [
                [
                  "To take payment in Pakistani Rupees and hold it in trust until you check in.",
                ],
                [
                  "The rail you chose — HBL, JazzCash, EasyPaisa, Raast or Stripe — and Meezan Bank, which holds the custody account.",
                ],
              ],
            },
            {
              header: ["Host tax details (NTN, filer status)"],
              cells: [
                [
                  "The withholding tax on your payouts is calculated from your NTN and FBR filer status, ",
                  bold("under FBR rules — used only for that calculation"),
                  ".",
                ],
                ["You, for hosting only. Not shown to guests."],
              ],
            },
            {
              header: ["Guest-registration details"],
              cells: [
                [
                  "Short-stay guest registration is a routine legal requirement in Pakistan — the same formality any hotel or guest house completes. ",
                  bold("SalamStay files this for you"),
                  " and your host.",
                ],
                [
                  "Islamabad Capital Territory (ICT) Police, or Punjab Police via Hotel Eye. Only the details the registration process asks for are shared — ",
                  bold("nothing more"),
                  ".",
                  " Your host sees names and guest count with CNIC numbers masked; the full number goes to the police portal, never to another guest or host.",
                ],
              ],
            },
          ],
        },
      ],
    },

    {
      id: "nadra",
      heading: "Your NADRA verification",
      blocks: [
        {
          kind: "p",
          text: [
            "The identity check is a one-time match. Exactly three fields are sent for it, and nothing else:",
          ],
        },
        {
          kind: "facts",
          items: [
            { title: ["Name"], body: ["As it appears on your CNIC."] },
            {
              title: ["CNIC number"],
              body: ["Your ", num("13"), "-digit identity number."],
            },
            {
              title: ["Date of birth"],
              body: ["Confirms the match against NADRA's record."],
            },
            {
              title: ["Nothing beyond this"],
              body: ["Never shared with hosts or other guests."],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "Your CNIC is encrypted and used only for verification — hosts and guests never see it. Your CNIC number is never shown on your profile or to anyone you book with, and ",
            bold("your NADRA documents stay redacted, always"),
            " — including in the copy of your data you can download for yourself.",
          ],
        },
      ],
    },

    {
      id: "consent",
      heading: "How consent works here",
      blocks: [
        {
          kind: "p",
          text: [
            bold("Nothing is ticked for you."),
            " Every consent box on SalamStay starts empty, and the button that follows it stays inactive until you tick it yourself. That is true of the terms box at sign-up and of the NADRA box before verification.",
          ],
        },
        {
          kind: "p",
          text: [
            "If you decline the identity check, you're told plainly what that means rather than being pushed: ",
            bold("you can still browse stays"),
            " — you just won't be able to book until you consent. ",
            bold("You can consent anytime from Verification."),
          ],
        },
        { kind: "h3", text: "Messages: what's needed, and what's optional" },
        {
          kind: "states",
          items: [
            {
              title: ["WhatsApp and SMS — needed for your bookings"],
              body: [
                "Booking confirmations, verification codes, messages from your host; SMS is the backup channel if WhatsApp can't reach you. These two ",
                bold("stay on"),
                " — they carry the messages every booking needs, and you'll always be told why before one arrives.",
              ],
              state: "Always on",
              locked: true,
            },
            {
              title: ["Offers & tips — marketing"],
              body: [
                "Occasional deals and travel ideas, by WhatsApp or SMS. ",
                bold("Off unless you turn it on."),
                " Turning it on is entirely your choice, and never needed to book or host.",
              ],
              state: "Off",
            },
          ],
        },
        {
          kind: "callout",
          title: ["Why it's built this way"],
          body: [
            "This meets Pakistan's Electronic Crime Act (PECA) rules for consent: transactional messages are disclosed plainly, and marketing is opt-in only. Change this anytime in ",
            bold("Notification & channel preferences"),
            ".",
          ],
        },
      ],
    },

    {
      id: "never",
      heading: "What we never share",
      blocks: [
        {
          kind: "note",
          text: [
            "Three things are kept private, always — not as a setting you have to find, but as a rule of the product.",
          ],
        },
        {
          kind: "facts",
          single: true,
          items: [
            {
              title: ["Your exact location is never shown before a booking is confirmed"],
              body: ["Until then, a home shows as a general neighbourhood."],
            },
            {
              title: ["Your phone and email are never shown to other members"],
              body: ["Messages go through SalamStay, so your contact details stay yours."],
            },
            {
              title: ["Your personal information is never sold"],
              body: ["Not to advertisers, not to data brokers, not to anyone."],
            },
          ],
        },
      ],
    },

    {
      id: "defaults",
      heading: "Your privacy defaults",
      blocks: [
        {
          kind: "p",
          text: [
            "You're in control of what others can see and who can reach you. ",
            bold("We start you on the more private choice"),
            " — you don't have to go hunting through settings to be safe by default.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Who can see your profile — hosts you book with"],
              body: ["Only hosts of a stay you request or book can see your profile."],
            },
            {
              title: ["Who can message you — hosts with a booking"],
              body: [
                "Only a host you've requested or booked with can start a chat. You can still block anyone.",
              ],
            },
            {
              title: ["Approximate location"],
              body: [
                "Your area shows as a general neighbourhood until a booking is confirmed.",
              ],
            },
            {
              title: ["Blocked people"],
              body: [
                "People you block can't message or book with you, and are ",
                bold("never told"),
                " they were blocked. Unblock any time.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "rights",
      heading: "Export and delete",
      blocks: [
        { kind: "h3", text: "Getting a copy of your data" },
        {
          kind: "p",
          text: [
            "We'll gather your bookings, messages, reviews, and profile into one file you can download — as JSON, which keeps the full structure, or as CSV if you'd rather open it in a spreadsheet. Preparing it takes a little while; we'll message you when it's ready. ",
            "The file stays available for a ",
            bold("limited period"),
            " and is then deleted for you — the exact date is shown beside the download.",
          ],
        },
        {
          kind: "p",
          text: [
            bold("Your NADRA documents aren't included."),
            " Your CNIC and family verification documents stay redacted — they aren't part of the export, even for you.",
          ],
        },
        { kind: "h3", text: "Deleting your account" },
        {
          kind: "p",
          text: [
            "You can close your SalamStay account whenever you like. Here's exactly what happens.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Your profile and saved places are removed"],
              body: ["Profile, wishlists, drafts, and messages are deleted."],
            },
            {
              title: ["Completed bookings are kept, anonymized"],
              body: [
                "Bookings you've completed are retained in anonymized form, as the law requires — not linked to you.",
              ],
            },
            {
              title: ["Your NADRA documents stay redacted"],
              body: ["They were never readable to us, and they're deleted with your account."],
            },
            {
              title: ["Finish any active trip or payout first"],
              body: ["Deletion waits until nothing is in flight."],
            },
          ],
        },
        {
          kind: "callout",
          title: ["You can change your mind"],
          body: [
            "You have ",
            bold(num("14"), " days"),
            " to change your mind — just sign back in and your account is restored, nothing lost. After that, deletion is permanent.",
          ],
        },
      ],
    },

    {
      id: "cookies",
      heading: "Cookies",
      blocks: [
        {
          kind: "p",
          text: [
            "What is stored in your browser, which categories exist, and how to change your choices are set out in full in the ",
            link("/legal/cookie-policy", "cookie policy"),
            ". The same rule applies there as here: nothing beyond what's needed to run the site is on unless you turn it on.",
          ],
        },
      ],
    },

    {
      id: "keep",
      heading: "How long we keep things",
      blocks: [
        {
          kind: "p",
          text: [
            "Two retention facts are settled today, and they're stated above rather than hidden here: your ",
            bold("downloaded data file is deleted for you"),
            " after the window shown beside it, and a deleted account is ",
            bold("restorable for ", num("14"), " days"),
            " before deletion becomes permanent. Completed bookings are kept in anonymized form, as the law requires.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("9.1"), "  The full retention schedule"],
          body: [
            "How long each category in the table above is kept, and what triggers its deletion. ",
            bold("SalamStay states no retention period it has not settled"),
            " — we would rather leave this visibly unfinished than publish a number we'd have to walk back.",
          ],
        },
      ],
    },

    {
      id: "where",
      heading: "Where your data is stored",
      blocks: [
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("10.1"), "  Storage location and any transfer outside Pakistan"],
          body: [
            "The region your data is stored in, whether any of it leaves Pakistan, and on what basis. ",
            bold("No location is named on this page until that is settled"),
            " — including in the apps, where nothing is claimed about it either.",
          ],
        },
      ],
    },

    {
      id: "processors",
      heading: "Who else handles your data",
      blocks: [
        {
          kind: "p",
          text: [
            "Every party that receives anything is named in the table in section ",
            num("2"),
            " — NADRA Verisys for the identity match, Meezan Bank for custody, the payment rail you chose, and the police registration portal for your province. There is no other recipient.",
          ],
        },
        {
          kind: "slot",
          label: "To be completed with counsel",
          title: [num("11.1"), "  The published processor list, and the data-protection contact"],
          body: [
            "A maintained list of every processor and sub-processor, plus who to write to about your data and where to complain if you're not satisfied. Until it's published, ",
            bold("the recipients named in section ", num("2"), " are the complete set"),
            ", and ",
            link("/help/contact", "support"),
            " is the route for any question about it.",
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
            "If anything on this page is unclear, ask us — in Urdu or in English. We would rather explain it twice than have you guess. A person reads every ticket.",
          ],
        },
      ],
    },
  ],

  closing: {
    title: "Questions about your data",
    body: [
      "Read the ",
      link("/legal/terms", "Terms of Service"),
      ", the ",
      link("/legal/cookie-policy", "cookie policy"),
      ", or how verification works in ",
      link("/verification", "verification and house rules"),
      ".",
    ],
    ctaLabel: "Contact support",
    ctaHref: "/help/contact",
  },
};
