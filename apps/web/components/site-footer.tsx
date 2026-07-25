import Link from "next/link";
import { focusRing, gutter } from "./ui";

/**
 * SiteFooter — the SEO-RULES §3.12 canonical footer, reproduced from the gw-001
 * card (identical in gw-002 / gw-015 / gw-016 / ha-001).
 *
 * Link-dense and typographic, never decorated: an sr-only "Footer" heading, the
 * entity intro, then FOUR labelled navs whose grouping is the contract — Cities
 * (the six beta cities), Hosting, Company, Legal — and a bottom rule carrying
 * the editorial / corrections / standards / Shariah quartet. Every anchor is a
 * route registered in `lib/seo/route-registry.ts` (G37); routes flip from
 * stub/todo to real pages as the build waves land — see WEB-BUILD.md.
 *
 * Drawn to the TASTE-RULES §10 footer redline, which is four decisions:
 *
 *  · **`bg.raised` band, hairline top.** §6: raised does five jobs and this is
 *    one of them. A footer on the bare canvas has no edge; a footer with a
 *    heavy rule has a scar. Tint plus hairline is the whole treatment.
 *  · **Links 16/400 INK, no underline at rest.** This is the one place §8's
 *    underline-at-rest rule is deliberately suspended: forty underlined rows is
 *    a hatch pattern, not a link list. Ink at body weight already reads as
 *    navigable inside a labelled `<nav>`; the underline arrives on hover.
 *  · **36px row pitch** — the most generous repeated gap on the site, and most
 *    of why a link-dense footer reads as calm instead of as a sitemap dump.
 *  · **15/600 headings, not `overline`.** §7 is explicit that `overline` is a
 *    FORM-LABEL token (CHECK-IN, GUESTS) and never a section eyebrow; four
 *    uppercase micro-caps above four columns is exactly the eyebrow tic §11.20
 *    bans. The nearest role below the link size, set semibold, does the same
 *    grouping work without shouting.
 *
 * The §3.12 link set, the four `aria-label`s and the sr-only h2 are byte-exact
 * and structural (G37/G78). Nothing below changes an href, a label or an
 * element — only type roles, colour roles and spacing.
 */

const CITIES = [
  { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
  { href: "/stays-in-karachi", label: "Stays in Karachi" },
  { href: "/stays-in-lahore", label: "Stays in Lahore" },
  { href: "/stays-in-peshawar", label: "Stays in Peshawar" },
  { href: "/stays-in-faisalabad", label: "Stays in Faisalabad" },
  { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
] as const;

const HOSTING = [
  { href: "/become-a-host", label: "Become a host" },
  { href: "/legal/host-terms", label: "Host terms" },
  { href: "/legal/community-standards", label: "Community standards" },
] as const;

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/trust-and-safety", label: "Trust & safety" },
  { href: "/shariah-policy", label: "Shariah approach" },
  { href: "/help", label: "Help center" },
] as const;

const LEGAL = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/guest-refund-policy", label: "Guest refund policy" },
  { href: "/legal/cookie-policy", label: "Cookie policy" },
] as const;

const BOTTOM = [
  { href: "/legal/editorial-policy", label: "Editorial policy" },
  { href: "/legal/corrections", label: "Corrections" },
  { href: "/legal/community-standards", label: "Community standards" },
  { href: "/shariah-policy", label: "Shariah approach" },
] as const;

/**
 * One footer row. The 36px box IS the pitch: the row sets the rhythm, so the
 * gap between two links is one value rather than a line box plus two paddings
 * that have to be reasoned about together. Ink at 16/400, underline on hover
 * only, `underline-offset-4` so the rule clears the descenders.
 *
 * `min-h-9`, NOT `h-9`. A fixed height is right until a label wraps — at 375
 * "Community standards" takes two lines, and a hard 36px box let the second
 * line escape and collide with the row above it. As a minimum the pitch is
 * exact for every single-line row (which is all but one of them at every
 * breakpoint) and the one wrapping row simply gets the height it needs.
 */
const colLink =
  "-mx-1 flex min-h-9 items-center rounded-md px-1 py-1 text-bodyMd text-primary underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-secondary hover:underline motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

function Column({
  label,
  links,
}: {
  readonly label: string;
  readonly links: readonly { readonly href: string; readonly label: string }[];
}) {
  return (
    <nav aria-label={label}>
      <h3 className="mb-2 text-bodySm font-semibold text-primary">{label}</h3>
      {links.map((l) => (
        <Link key={l.href + l.label} href={l.href} className={`${colLink} ${focusRing}`}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Same v1 rule as the header: EN is active, اردو is a span until `/ur` ships.
 * Active segment is ink (`interactive.selectedFill`), not brand — see the note
 * on the shared `LanguageGroup` in components/language-group.tsx.
 */
function LanguageGroup() {
  return (
    <span
      role="group"
      aria-label="Language"
      className="inline-flex items-center overflow-hidden rounded-full border border-border-default"
    >
      <span
        lang="en"
        aria-current="true"
        className="flex items-center bg-selected px-3 py-2 text-label font-semibold leading-none text-selected-fg"
      >
        EN
      </span>
      <span
        lang="ur"
        className="flex items-center px-3 py-2 font-urdu text-label leading-none text-secondary"
      >
        اردو
      </span>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-raised">
      <h2 className="sr-only">Footer</h2>
      <div className={`mx-auto max-w-wide pb-10 pt-12 md:pb-12 ${gutter}`}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            {/* Green role 1 of 4: the wordmark dot. The only brand mark in the
                footer, and the reason the rest of this surface is ink. */}
            <div className="text-h5 font-semibold tracking-tight text-primary">
              Salam<span className="text-interactive">.</span>Stay
            </div>
            {/* Two sentences, no em-dash. The dash was doing the work a full
                stop does, and §12's exception list covers claims and card
                contracts, not chrome copy — so there is nothing here to
                protect and no reason for the site's one remaining em-dash to
                sit under the wordmark. Same words, same facts, same length. */}
            <p className="mt-2 max-w-[44ch] text-bodySm text-secondary">
              SalamStay, a home-sharing marketplace for Pakistan. Verified homes and rooms
              across six cities.
            </p>
          </div>
          <LanguageGroup />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Column label="Cities" links={CITIES} />
          <Column label="Hosting" links={HOSTING} />
          <Column label="Company" links={COMPANY} />
          <Column label="Legal" links={LEGAL} />
        </div>

        {/* `text.tertiary` is AA-large only (≥18.66px per the token's own note);
            at `caption` it under-runs 4.5:1 on either surface, so the bottom
            rule is set in `text.secondary`. */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-5 text-caption text-secondary">
          <span>
            © <span className="num">2026</span> SalamStay
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {BOTTOM.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`-mx-1 rounded-md px-1 py-1 underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-primary hover:underline motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate ${focusRing}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
