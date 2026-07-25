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

const colLink =
  "-mx-1 block rounded-md px-1 py-1 text-bodySm text-secondary transition-colors duration-instant ease-decelerate hover:text-primary hover:underline";

function Column({
  label,
  links,
}: {
  readonly label: string;
  readonly links: readonly { readonly href: string; readonly label: string }[];
}) {
  return (
    <nav aria-label={label}>
      <h3 className="mb-3 text-overline uppercase text-tertiary">{label}</h3>
      {links.map((l) => (
        <Link key={l.href + l.label} href={l.href} className={`${colLink} ${focusRing}`}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/** Same v1 rule as the header: EN is active, اردو is a span until `/ur` ships. */
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
        className="flex items-center bg-interactive px-3 py-2 text-label font-semibold leading-none text-on-brand"
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
    <footer className="border-t border-hairline bg-canvas">
      <h2 className="sr-only">Footer</h2>
      <div className={`mx-auto max-w-wide pt-12 ${gutter}`}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-h5 font-semibold tracking-tight text-primary">
              Salam<span className="text-interactive">.</span>Stay
            </div>
            <p className="mt-2 max-w-[44ch] text-bodySm text-secondary">
              SalamStay, a home-sharing marketplace for Pakistan — verified homes and rooms
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-5 text-caption text-tertiary">
          <span>
            © <span className="num">2026</span> SalamStay
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {BOTTOM.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`-mx-1 rounded-md px-1 py-1 text-tertiary transition-colors duration-instant ease-decelerate hover:text-secondary hover:underline ${focusRing}`}
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
