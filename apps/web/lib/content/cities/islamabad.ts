import { ISLAMABAD_AREAS, LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Islamabad — the GW-002 instance, at `/stays-in-islamabad`, on the v2
 * inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §1: real
 * sectors (F-6, F-7, F-8, E-7, Blue Area), real landmarks (Faisal Mosque,
 * Daman-e-Koh, Pakistan Monument, Rawal Lake, Centaurus), qualitative
 * load-shedding and the Metrobus Red Line. Items the research file marked
 * "[verify before publish]" — G-sectors, named hospitals — are OMITTED.
 *
 * What moved in the v2 rewrite, string by string:
 * - The five-line intro is gone. Its three `<strong>` §5 claims are NOT
 *   restated in shorter words anywhere: "CNIC-verified guests and hosts via
 *   NADRA Verisys" and "load-shedding hours and backup power" are already
 *   verbatim in FAQ answers 2 and 3, which G49 pins in place; the no-alcohol
 *   claim leaves the page body and stays where it is checkable, in the
 *   `no_alcohol=1` filter chip and in the meta description. `support` is one
 *   plain line about where in the capital the homes are.
 * - The hero photograph is gone, so `hero` is gone with it. The LCP element is
 *   the first card of the featured rail.
 * - Area blurbs became one-line labels. Every sector detail they carried is
 *   still on the page, verbatim, in FAQ answer 1 — which reads as a paragraph
 *   about F-6, F-7, F-8, E-7 and Blue Area precisely because it was written to
 *   answer that question in full.
 * - Note bodies, filter labels, FAQ questions and answers, related links and
 *   the meta description are BYTE-IDENTICAL to v1.
 *
 * Deliberate absences, all load-bearing and all unchanged:
 * - NO price figure. "PKR —" is the card's own data-driven placeholder; a
 *   nightly rate ships only when live pricing does (G14 / §5).
 * - NO ratings, review counts, listing counts or "X homes from Y". Pre-launch,
 *   none of those numbers exists.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - Claims appear only in their SEO-RULES §5 registry wording.
 */
export const islamabad: CityContent = {
  slug: "islamabad",
  path: "/stays-in-islamabad",
  name: "Islamabad",
  metaDescription:
    "Find verified stays in Islamabad. Filter by no-alcohol listings, halal kitchen, women-only stays, and prayer space — with load-shedding hours and backup power shown on each home.",

  h1: "Stays in Islamabad",
  /** Fifteen words. Names the sectors the inventory actually sits in, which is
   *  the one thing the H1 does not already say. */
  support:
    "Verified homes and rooms from central F-6 and F-7 to the Margalla foothills of E-7.",

  facts: [
    { icon: "season", label: "Best season", value: "Spring & autumn", muted: "· cool, clear" },
    { icon: "transit", label: "Getting around", value: "Metrobus", muted: "+ ride-hailing" },
    { icon: "areas", label: "Popular areas", value: "F-6 · F-7 · E-7", muted: "· Blue Area" },
    { icon: "price", label: "Nightly price", value: "PKR —", muted: "· live pricing" },
  ],

  stays: {
    heading: "Featured stays in Islamabad",
    items: [
      {
        href: "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market",
        title: "Sunlit 2-bed near Kohsar Market",
        areaPin: "F-6",
        location: "F-6, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market"],
        attributes: ["halal-kitchen", "no-alcohol", "backup-power"],
        schemaName: "Sunlit 2-bed near Kohsar Market — F-6, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/central-studio-by-jinnah-super",
        title: "Central studio by Jinnah Super",
        areaPin: "F-7",
        location: "F-7, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/central-studio-by-jinnah-super"],
        attributes: ["women-only", "halal-kitchen", "backup-power"],
        schemaName: "Central studio by Jinnah Super — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz",
        title: "Quiet family home in F-8 Markaz",
        areaPin: "F-8",
        location: "F-8, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz"],
        attributes: ["halal-kitchen", "prayer-space", "no-alcohol"],
        schemaName: "Quiet family home in F-8 Markaz — F-8, Islamabad",
      },
      {
        href: "/stays-in-islamabad/e-7/margalla-view-apartment",
        title: "Margalla-view apartment",
        areaPin: "E-7",
        location: "E-7, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/e-7/margalla-view-apartment"],
        attributes: ["halal-kitchen", "no-alcohol", "backup-power"],
        schemaName: "Margalla-view apartment — E-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue",
        title: "Business studio on Jinnah Avenue",
        areaPin: "Blue Area",
        location: "Blue Area, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/blue-area/business-studio-jinnah-avenue"],
        attributes: ["no-alcohol", "backup-power", "halal-kitchen"],
        schemaName: "Business studio on Jinnah Avenue — Blue Area, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar",
        title: "Garden guest house near Kohsar",
        areaPin: "F-6",
        location: "F-6, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-6/garden-guest-house-near-kohsar"],
        attributes: ["family-friendly", "halal-kitchen", "backup-power"],
        schemaName: "Garden guest house near Kohsar — F-6, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad", label: "View all stays in Islamabad" },
  },

  areas: {
    heading: "Popular areas in Islamabad",
    intro:
      "Islamabad is laid out in lettered, numbered sectors at the foot of the Margalla Hills — greener and more orderly than the plains cities. These are the sectors travellers stay in most.",
    items: [
      {
        name: "F-6",
        line: "Central, leafy, Kohsar Market",
        href: "/stays-in-islamabad/f-6",
        linkLabel: "View stays in F-6",
        image: ISLAMABAD_AREAS["f-6"],
      },
      {
        name: "F-7",
        line: "F-7 Markaz and Jinnah Super",
        href: "/stays-in-islamabad/f-7",
        linkLabel: "View stays in F-7",
        image: ISLAMABAD_AREAS["f-7"],
      },
      {
        name: "F-8",
        line: "Upscale, quiet, own markaz",
        href: "/stays-in-islamabad/f-8",
        linkLabel: "View stays in F-8",
        image: ISLAMABAD_AREAS["f-8"],
      },
      {
        name: "E-7",
        line: "Margalla foothills, high-end",
        href: "/stays-in-islamabad/e-7",
        linkLabel: "View stays in E-7",
        image: ISLAMABAD_AREAS["e-7"],
      },
      {
        name: "Blue Area",
        line: "Banks, offices, Jinnah Avenue",
        href: "/stays-in-islamabad/blue-area",
        linkLabel: "View stays in Blue Area",
        image: ISLAMABAD_AREAS["blue-area"],
      },
      {
        /**
         * Not a place you book — a navigation aid, so no photograph and no
         * link. Its line keeps the full landmark sentence rather than a
         * shortened one: Faisal Mosque, Daman-e-Koh, the Pakistan Monument,
         * Rawal Lake and Centaurus appear nowhere else on this page, and the
         * tile clamps to two lines without dropping any of them from the HTML.
         */
        name: "Wayfinding landmarks",
        line: "Navigate by Faisal Mosque, Daman-e-Koh and the Margalla viewpoints, the Pakistan Monument at Shakarparian, Rawal Lake, and Centaurus Mall.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Islamabad",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, though summer peak-demand cuts still happen. Guest houses commonly run UPS or a generator — and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "The Rawalpindi–Islamabad Metrobus (Red Line) runs from Pak Secretariat to Saddar, with ride-hailing (Careem, inDrive, Yango) and taxis alongside. The grid of lettered, numbered sectors makes navigation easy.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        // The space before °C is U+00A0, as the card’s `40&nbsp;°C` is.
        body: "Hot summers peaking near 40 °C in June, monsoon rains in July and August, and pleasant spring and autumn with cool winters. The air is cleaner and cooler than the Punjab plains.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Islamabad",
    items: [
      {
        icon: "no-alcohol",
        label: "No-alcohol listings",
        href: "/search?city=islamabad&no_alcohol=1",
      },
      {
        icon: "halal-kitchen",
        label: "Halal kitchen",
        href: "/search?city=islamabad&halal_kitchen=1",
      },
      {
        icon: "women-only",
        label: "Women-only stays",
        href: "/search?city=islamabad&women_only=1",
      },
      {
        icon: "prayer-space",
        label: "Prayer space",
        href: "/search?city=islamabad&prayer_space=1",
      },
      {
        icon: "backup-power",
        label: "Backup power",
        href: "/search?city=islamabad&backup_power=1",
      },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=islamabad&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Islamabad?",
        answer:
          "F-6 and F-7 are the most central and leafy sectors, walkable to Kohsar Market and Jinnah Super. F-8 is a secure, upscale residential sector with its own markaz. E-7 sits against the Margalla foothills next to the diplomatic enclave — quiet and high-end. Blue Area, along Jinnah Avenue, is the commercial spine and best for business trips.",
      },
      {
        question: "How does verification work for a booking in Islamabad?",
        answer:
          "Every stay uses CNIC-verified guests and hosts via NADRA Verisys. A couple confirms the booking with a Nikah Nama, and a mixed-gender family or siblings verify with an FRC. You are trusted by default; the right document is simply matched to your booking type before you reserve.",
      },
      {
        question: "Will load-shedding affect my stay in Islamabad?",
        answer:
          "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, but summer peak-demand cuts still happen, and guest houses commonly run UPS or generator backup. Rather than a fixed figure, every listing shows its own load-shedding hours and backup power so you can plan.",
      },
      {
        question: "How do I get around Islamabad without a car?",
        answer:
          "The Rawalpindi–Islamabad Metrobus (Red Line) runs from Pak Secretariat to Saddar, and ride-hailing apps such as Careem, inDrive and Yango cover the city, alongside taxis. Islamabad’s grid of lettered and numbered sectors makes it one of the easiest Pakistani cities to navigate.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Islamabad stay",
    columns: [
      {
        heading: "Islamabad areas",
        links: [
          { href: "/stays-in-islamabad/f-6", label: "Stays in F-6" },
          { href: "/stays-in-islamabad/f-7", label: "Stays in F-7" },
          { href: "/stays-in-islamabad/e-7", label: "Stays in E-7" },
        ],
        note: "Area pages publish as each sector clears the local-content bar.",
      },
      {
        heading: "Nearby cities",
        links: [
          { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
          { href: "/stays-in-lahore", label: "Stays in Lahore" },
          {
            href: "/guides/where-to-stay-in-islamabad",
            label: "Where to stay in Islamabad guide",
          },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
          { href: "/become-a-host", label: "Become a host in Islamabad" },
        ],
      },
    ],
  },
};

export default islamabad;
