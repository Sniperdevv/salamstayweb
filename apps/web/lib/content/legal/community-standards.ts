import { bold, link, num, term } from "./types";
import type { LegalPageContent } from "./types";

/**
 * GW-013 — Community standards, `/legal/community-standards`.
 *
 * THE CULTURAL LINE THIS PAGE HOLDS (NEVER #3), and how the structure keeps it
 * ---------------------------------------------------------------------------
 * This is the page most likely to drift into religious authority, so the
 * structure prevents it rather than the wording:
 *
 *  · The only Shariah-adjacent sentences are §5 registry claims in their exact
 *    registered form. No new cultural statement is authored anywhere.
 *  · The honesty boundary is stated ONCE, in its own block, using the sentence
 *    already shipped on GW-007 verbatim.
 *  · THE STRUCTURAL RULING: the cultural items ("No alcohol on the premises",
 *    "Kitchen is kept halal", "Prayer mat & marked Qibla", "Shoes off inside")
 *    ship in GA-035 under "What the host asks", glossed as the host's own
 *    preferences. They are therefore rendered here as THE HOST'S STATED
 *    PREFERENCES FOR THEIR OWN HOME, in their own container, explicitly NOT as
 *    SalamStay conduct rules — which is why `hostGroup` is a block kind and not
 *    another `facts` list. SalamStay's own standards are the neutral ones:
 *    accuracy, honesty, respect, safety. Collapsing the two would make
 *    SalamStay the arbiter of religious practice.
 *  · No certification, fatwa, scholar, advisor or board is named.
 *
 * The enforcement section states what SalamStay can actually do today (an
 * account hold during a payment dispute; a listing pause during a licence
 * renewal, neither of which is a conduct penalty) and parks the conduct ladder
 * as an unwritten standard rather than describing a system that does not exist.
 */
export const communityStandardsPage: LegalPageContent = {
  path: "/legal/community-standards",
  metaDescription:
    "What is and isn't acceptable on SalamStay, for guests and hosts alike — house rules, listing accuracy, respect between people, and how to report or block.",
  h1: "Community standards",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Community standards", path: "/legal/community-standards" },
  ],
  lede: [
    "What is and isn't acceptable on SalamStay, for guests and hosts alike — ",
    bold("written plainly, applied to both sides of a booking"),
    ". Short, because there isn't much to say: be accurate, be respectful, and keep the home the way you found it.",
  ],
  lastUpdated: "24 July 2026",

  sections: [
    {
      id: "reading",
      heading: "How to read these",
      blocks: [
        {
          kind: "p",
          text: [
            "These standards apply to ",
            bold("both sides of a booking"),
            ". A host doesn't get a longer leash than a guest, and a guest doesn't get one over a host. Where a standard names one side, it's because only that side can do the thing described.",
          ],
        },
        {
          kind: "p",
          text: [
            "They are also short on purpose. ",
            bold("You are trusted by default"),
            " — we don't ask you to prove anything about yourself before you've done anything, and we don't write a rule for a problem we haven't had.",
          ],
        },
        {
          kind: "boundary",
          text: [
            "SalamStay is not a religious authority and does not certify compliance — we build features that respect how our guests live.",
          ],
          source: [
            "This applies to every standard below. Where a home is described as no-alcohol, halal-kitchen or women-only, that is ",
            bold("the host's stated policy for their home"),
            ", shown as a fact you can read and act on — not a judgement SalamStay makes about anyone.",
          ],
        },
      ],
    },

    {
      id: "home",
      heading: "Respect for the home",
      blocks: [
        {
          kind: "p",
          text: [
            "Every home carries its host's house rules. They cover the practical things — when you can arrive, when the neighbours sleep, whether visitors can stay over. ",
            bold("You'll agree to these rules once, at booking review, before you pay"),
            ", so nothing in them is a surprise on arrival.",
          ],
        },
        { kind: "h3", text: "What the standards themselves require" },
        {
          kind: "facts",
          items: [
            {
              title: ["Keep to the arrival and departure times"],
              body: [
                "Check-in and check-out windows are on every listing — a typical one is check-in ",
                num("2:00"),
                " PM–",
                num("8:00"),
                " PM and check-out before ",
                num("11:00"),
                " AM. Message the host if you'll arrive later.",
              ],
            },
            {
              title: ["Keep quiet hours"],
              body: [
                "Where the listing sets them — often ",
                num("10:00"),
                " PM–",
                num("6:00"),
                " AM. Many homes are in family buildings; keep music and gatherings low at night.",
              ],
            },
            {
              title: ["Bring only the people on the booking"],
              body: [
                "Daytime visitors are welcome where the host allows them — let the host know if guests will stay overnight. No parties or events where the building doesn't allow large gatherings.",
              ],
            },
            {
              title: ["Follow the smoking and pet rules on the listing"],
              body: [
                "Many homes are no-smoking inside, with a balcony available, and pet-free for allergies. What the listing says is what applies.",
              ],
            },
          ],
        },
        {
          kind: "hostGroup",
          heading: "Separate — what the host asks",
          note: [
            "Some hosts add their own requests for their home. These are ",
            bold(
              "the host's preferences, stated by them and shown on the listing before you book",
            ),
            " — please read them the same way as the rest of the house rules. They are not SalamStay rules, and SalamStay does not assess or certify them.",
          ],
          items: [
            {
              title: ["No alcohol on the premises"],
              quote: '"This is a no-alcohol home."',
            },
            {
              title: ["Kitchen is kept halal"],
              quote: '"Please don\'t bring pork into the home."',
            },
            {
              title: ["Prayer mat & marked Qibla"],
              quote: '"In the main bedroom, there if you\'d like them."',
            },
            {
              title: ["Shoes off inside, please"],
              quote: '"There\'s a rack by the front door."',
            },
          ],
        },
      ],
    },

    {
      id: "alcohol",
      heading: "Alcohol and what a listing states",
      blocks: [
        {
          kind: "p",
          text: [
            bold("No-alcohol listings by default."),
            " Hosts who allow alcohol must explicitly opt in and disclose it. That means the default position on SalamStay is stated for you, and any departure from it is a fact printed on the listing — never something you have to ask about or guess at.",
          ],
        },
        {
          kind: "p",
          text: [
            "The standard here is about honesty, not observance: ",
            bold("a listing must state what is actually true of the home"),
            ", and a guest must keep to what the listing says. A host who allows alcohol and hides it, and a guest who ignores a no-alcohol home, break the same standard.",
          ],
        },
        {
          kind: "p",
          text: [
            "The same logic covers the other attributes a host can state — ",
            bold("Halal-kitchen, prayer-space, and Qibla direction shown on listings"),
            ", and ",
            bold("Women-only stays hosted by women"),
            ". These are options some hosts set for their home, stated on the listing as host policy — never assumed for you, never applied to your account.",
          ],
        },
      ],
    },

    {
      id: "photos",
      heading: "Photographs",
      blocks: [
        {
          kind: "p",
          text: [
            "Listing photos have to do two jobs at once: show a guest what they're actually booking, and protect the privacy of everyone who lives in or near the home. Hosts commit to ",
            bold("pardah-respectful photography"),
            " — modest, respectful photos throughout the listing.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["No people in frame"],
              body: [
                "Family members and staff stay out of shot — never identify anyone by including them, even in the background.",
              ],
            },
            {
              title: ["Family-space discretion"],
              body: [
                "Personal or family areas — like a women-only floor — are shown empty and tidy, never candid.",
              ],
            },
            {
              title: ["Windows framed away from neighbours"],
              body: [
                "Angle shots so a window doesn't look directly into a neighbouring home.",
              ],
            },
            {
              title: ["Show what guests will actually find"],
              body: [
                "Wide shots from a corner, not close-ups. Skip filters — the photo should match the home on arrival.",
              ],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "These are practical and dignified, not a checklist to pass — they're the same considerations any thoughtful host already applies.",
          ],
        },
        {
          kind: "slot",
          label: "Standard not yet written",
          title: ["What a guest may photograph inside a home"],
          body: [
            "The rules above are what a ",
            bold("host"),
            " commits to when photographing their own listing. SalamStay has ",
            bold("not yet written the guest-side standard"),
            " — whether and how a guest may photograph a home they are staying in, and the people in it. Until it exists, ask your host, and treat anyone else's presence as private.",
          ],
        },
      ],
    },

    {
      id: "people",
      heading: "Respect between people",
      blocks: [
        {
          kind: "p",
          text: [
            "These are the behaviours SalamStay acts on. They apply in messages, on profiles, and in the home — and they apply identically to guests and hosts.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Harassment or bullying"],
              body: ["Threatening, abusive, or repeated unwanted contact."],
            },
            {
              title: ["Inappropriate messages"],
              body: ["Messages that are offensive or make you uncomfortable."],
            },
            {
              title: ["Suspicious behaviour"],
              body: ["Something feels off — a possible scam or fake account."],
            },
            {
              title: ["Safety concerns"],
              body: ["Anything that makes you worry about your safety, or someone else's."],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "If something doesn't fit any of these, tell us in your own words. The list is how we sort reports, not a limit on what you can raise.",
          ],
        },
      ],
    },

    {
      id: "listings",
      heading: "Listings must be accurate",
      blocks: [
        {
          kind: "p",
          text: [
            "A listing is a promise about a real place. These are the ways that promise gets broken, and each is something we act on.",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Inaccurate listing"],
              body: ["Photos, location or details don't match the real place."],
            },
            {
              title: ["Safety concern"],
              body: ["Something here could put a guest at risk."],
            },
            {
              title: ["Breaks SalamStay policy"],
              body: ["Discrimination, prohibited items, or off-platform requests."],
            },
            {
              title: ["Offensive content"],
              body: ["Text or photos that aren't appropriate."],
            },
            {
              title: ["Possible scam"],
              body: ["Asked to pay or message outside SalamStay."],
            },
            {
              title: ["Attributes must be true"],
              body: [
                "Load-shedding hours, backup power, halal kitchen, prayer space, Qibla and women-only are facts about the home. ",
                bold("Listings show load-shedding hours and backup power"),
                " — stating them wrongly is the same breach as a wrong photo.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "tools",
      heading: "Reporting and blocking",
      blocks: [
        {
          kind: "p",
          text: [
            "These are two separate tools, and ",
            bold("you never have to justify using either one"),
            ".",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["Report a listing or a person"],
              body: [
                "Your report goes to our safety team. ",
                bold("Reporting is private"),
                ", and it helps keep SalamStay safe for everyone — the person you report is not told who reported them. A person on our safety team reads every report.",
              ],
            },
            {
              title: ["Block someone"],
              body: [
                "Blocking sets a clear boundary — it hides, it doesn't accuse. ",
                bold("The blocked person is never notified."),
                " It's reversible at any time from your blocked-people list.",
              ],
            },
          ],
        },
        { kind: "h3", text: "Exactly what blocking does" },
        {
          kind: "facts",
          items: [
            {
              title: ["You can't message each other"],
              body: ["Your conversation closes, both ways."],
            },
            {
              title: ["Neither of you can book the other"],
              body: ["They can't request your listings, and you can't book theirs."],
            },
            {
              title: ["You won't see each other"],
              body: ["You'll disappear from each other's profiles and search."],
            },
            {
              title: ["They are not notified"],
              body: ["Blocking is private. The person is never told you blocked them."],
            },
          ],
        },
      ],
    },

    {
      id: "disagree",
      heading: "When you and a host disagree",
      blocks: [
        {
          kind: "p",
          text: [
            "Not every problem is a breach of these standards. Sometimes a guest and a host simply see a stay differently and need help resolving it. That is what mediation is for — ",
            bold("not a complaint filed against your host"),
            ", and not a case you win.",
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
                "Your host is asked for their side too. Symmetric respect — neither account is treated as the default truth.",
              ],
            },
            {
              title: ["SalamStay mediates"],
              body: [
                "Our team reviews both statements. The ",
                term("amanah"),
                " hold stays in place until the case resolves.",
              ],
            },
            {
              title: ["Resolution"],
              body: [
                "The outcome is stated plainly — what is returned, to whom, and when — with no editorialising about who was right.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "enforcement",
      heading: "If a standard is broken",
      blocks: [
        {
          kind: "p",
          text: [
            "We'd rather be straight with you about what SalamStay can actually do today than describe a system we haven't built. Two things can currently interrupt an account or a listing, and ",
            bold("neither of them is a conduct penalty"),
            ":",
          ],
        },
        {
          kind: "facts",
          items: [
            {
              title: ["An account hold, while a payment dispute is resolved"],
              body: [
                bold("Nothing here is permanent — let's get it resolved together."),
                " You keep your trips, receipts and support; new bookings and messaging pause. You can appeal, and ",
                bold("a person on our team reads every appeal"),
                ".",
              ],
            },
            {
              title: ["A listing pause, while a licence is renewed"],
              body: [
                "Per-listing and reversible: confirmed bookings are honoured, the calendar and photos are kept, and it comes back the moment the renewal verifies.",
              ],
            },
          ],
        },
        {
          kind: "p",
          text: [
            "Beyond those, a report goes to the safety team and a person reviews it. ",
            bold("We don't state a reply time we can't keep, so none is stated."),
          ],
        },
        {
          kind: "slot",
          label: "Standard not yet written",
          title: ["The conduct-enforcement ladder, and appeal rights against it"],
          body: [
            "What follows a substantiated report — warning, suspension, removal — how each step is decided, how long it lasts, and how you appeal it. ",
            bold("No conduct-enforcement ladder exists on SalamStay today"),
            ", so none is described here. Publishing one before it is built would claim a power we have not defined, and promise you an appeal route that has nowhere to go.",
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
    title: "Questions about these standards",
    body: [
      "Read ",
      link("/trust-and-safety", "trust & safety"),
      ", ",
      link("/shariah-policy", "our Shariah-respectful approach"),
      ", the ",
      link("/legal/terms", "Terms of Service"),
      ", or the ",
      link("/legal/host-terms", "host terms"),
      ".",
    ],
    ctaLabel: "Contact support",
    ctaHref: "/help/contact",
  },
};
