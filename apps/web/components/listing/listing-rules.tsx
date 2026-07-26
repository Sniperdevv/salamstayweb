import type { ReactElement } from "react";
import Link from "next/link";
import { Num } from "@/components/numerals";
import { ArrowRightIcon } from "@/components/icons";
import { NoAlcoholIcon } from "@/components/home-icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { ListingContent, RuleId } from "@/lib/content/listings/is-f7-2bed";
import { ClockIcon, GuestsIcon, NoPartiesIcon, NoSmokingIcon, QuietHoursIcon } from "./icons";
import { Copy, listingH3, listingLink, listingPara, listingSection } from "./shell";

/**
 * House rules & host policy — the page's "things to know" block, and the
 * clearest place on the site to see §1's third clause doing its work.
 *
 * **Open columns, no plates.** Two columns in open space: the six rules on the
 * left, the cancellation policy on the right. Icon + title + body, and nothing
 * around any of it. The card draws the cancellation block as a bordered panel;
 * §1 is explicit that a content block carries neither border nor shadow, and
 * this class of section is the example the rule names. It is also the whole
 * argument for the restraint — a page whose only boxes are the booking form and
 * the photographs reads as considered, and the same page with a plate under
 * every paragraph reads as a settings screen.
 *
 * **Both columns get an `<h3>`, so the outline has no gaps.** The H2 names the
 * pair; each column names itself. A column of six rules under a heading that
 * also covers a policy on the other side of a 48px gutter is a reader guessing
 * which heading owns what.
 *
 * **The rules are a list, and the list is `<ul>`.** Six items, one glyph each
 * at a uniform thin stroke, outline only (§11.3). Times carry `.num` isolation
 * like every other digit run on the page.
 *
 * On the alcohol rule sharing `NoAlcoholIcon` with the amenity grid: same fact,
 * same glyph. Two drawings of one idea on one page is the drift the shared icon
 * sets exist to prevent.
 */

type IconComponent = (props: { readonly className?: string }) => ReactElement;

const RULE_ICONS: Record<RuleId, IconComponent> = {
  "check-in": ClockIcon,
  guests: GuestsIcon,
  smoking: NoSmokingIcon,
  parties: NoPartiesIcon,
  alcohol: NoAlcoholIcon,
  quiet: QuietHoursIcon,
};

export function ListingRules({ listing }: { readonly listing: ListingContent }) {
  const { rules } = listing;

  return (
    <section aria-labelledby="rules-h" className={listingSection}>
      <h2 id="rules-h" className={sectionH2}>
        {rules.heading}
      </h2>

      <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        <div>
          <h3 className={listingH3}>{rules.listHeading}</h3>
          <ul className="mt-4 flex flex-col gap-4">
            {rules.items.map((rule) => {
              const Icon = RULE_ICONS[rule.id];
              return (
                <li key={rule.id} className="flex gap-3.5">
                  <Icon className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <span className="min-w-0">
                    <span className="block text-bodySm font-medium text-primary">
                      <Num>{rule.title}</Num>
                    </span>
                    {rule.detail ? (
                      <span className="mt-0.5 block text-bodySm text-secondary">
                        <Num>{rule.detail}</Num>
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className={listingH3}>{rules.cancellation.heading}</h3>
          <p className={`mt-3 ${listingPara}`}>
            {/* The emphasis comes from the listing, not from here. This read
                `bold={["48 hours"]}` until 2026-07-26 — correct for the seven
                Flexible homes and wrong for the three Moderate ones, where it
                either bolded nothing at all or, worse, bolded the phrase that
                names what is NOT refunded as though it were the free window. */}
            <Copy text={rules.cancellation.body} bold={[rules.cancellation.bold]} />
          </p>
          <Link
            href={rules.cancellation.link.href}
            className={`mt-4 ${listingLink} ${focusRing}`}
          >
            {rules.cancellation.link.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ListingRules;
