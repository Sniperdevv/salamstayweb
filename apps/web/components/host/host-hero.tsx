import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import {
  FeesReceiptIcon,
  HalalKitchenIcon,
  ShieldCheckIcon,
} from "@/components/home-icons";
import { focusRing } from "@/components/ui";
import { HOST_CLAIMS } from "@/lib/content/become-a-host";
import { HOST_IMAGES, image } from "@/lib/content/image-manifest";
import { shell } from "@/components/discovery/shell";

/**
 * HA-001 hero — the TASTE-RULES §10 funnel split, and the ONE place on the site
 * that draws it.
 *
 * §7 reserves `display` (52) and `displayLg` (64) for funnel and marketing
 * heroes, once per journey, and §4 reserves `heroMedia` (the 3xl / 40px
 * squircle) the same way. Both budgets are spent here and nowhere else: every
 * other SalamStay surface is a content page whose H1 sits at ≈26 and whose
 * photographs round at `lg`. That scarcity is the whole effect — the 64px line
 * has power because it is the only one, and the squircle reads as a decision
 * because nothing else on the scroll is cut that way.
 *
 * The recipe, and what each half is doing:
 *
 *  · **50/50 from `lg`.** Below it the photograph drops under the copy and
 *    both run full width; the split is a desktop composition and pretending
 *    otherwise gives a 375px phone two 160px columns.
 *  · **H1 two lines, never three.** The role steps `h2 → display → displayLg`
 *    with the measure: at 464px (the `lg` column) 64px would break "Become a
 *    host on SalamStay" into four lines, so `displayLg` waits for `xl` where
 *    the column is 592 and the line breaks after "on". Two lines at every
 *    width, which is what §10 asks for.
 *  · **One 20/400 gray sub, two lines.** There is no 20/400 role in the scale
 *    (`h5` is 20/600), so the role carries the size and `font-regular` carries
 *    the weight. The line is plain neutral description under §5: it states
 *    what a host lists and what a host sets, and it paraphrases no claim — the
 *    three registry claims are directly below, byte-exact, with their glyphs.
 *  · **One `rounded-full` pill, hairline, NO shadow.** §1 is explicit that a
 *    border and a shadow are alternatives: a shadow says "floats above the
 *    plane", a border says "form boundary", and the address-style input on a
 *    funnel hero is the second thing. Hover therefore strengthens the border
 *    rather than growing a shadow the recipe forbids.
 *  · **One photograph, `rounded-3xl`, no scrim and no text on it** (§9). The
 *    frame is the manifest's declared `/become-a-host` editorial stand-in and
 *    it is the page's LCP element, so it is the only `priority` image here.
 *  · **One action.** The card draws two hero CTAs — "Start hosting" and a ghost
 *    button to the estimator — and §10 draws one. The estimator keeps its own
 *    call in the earnings block below, where its heading already reads "See
 *    what hosting could look like"; running that same sentence twice on one
 *    scroll spends the hero's contrast on a repeat. SCREENS §1.2's "no signup
 *    wall" still holds: the arithmetic, the fees and the FAQ are all readable
 *    without an account.
 *
 * Green (§2): the pill's submit circle is this page's ONE primary-CTA green.
 * The header's wordmark dot and Sign up button are shared chrome and arrive
 * with every route; nothing else in the page body is brand-coloured, which is
 * why the claim glyphs below are gray and the two trust links further down are
 * ink and underlined instead of green.
 *
 * Motion: hover and press only, the shipped grammar. Nothing enters on load —
 * this is the top of a conversion funnel and a staged entrance delays the one
 * paint the visitor came for.
 */

/**
 * The pill. `h-16` with a `size-12` circle inset by `pr-2` puts 8px of white
 * on all four sides of the submit — §10's "diameter = pill height − 12" to the
 * nearest token, and token-clean beats a two-pixel win on an arbitrary value.
 */
const heroPill =
  "group mt-8 flex h-16 w-full max-w-md items-center justify-between gap-4 rounded-full border border-hairline bg-canvas pl-6 pr-2 " +
  "transition-[transform,border-color] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const submitCircle =
  "grid size-12 shrink-0 place-items-center rounded-full bg-interactive transition-colors duration-instant ease-decelerate " +
  "group-hover:bg-interactive-hover motion-reduce:transition-[opacity,background-color,border-color,color] " +
  "motion-reduce:duration-instant motion-reduce:ease-decelerate";

/**
 * `sizes` for the squircle: 592px inside the 1232 shell from `xl`, ~46vw for
 * the 50/50 split between `lg` and `xl`, full width below that.
 */
const HERO_MEDIA_SIZES = "(min-width: 1280px) 592px, (min-width: 1024px) 46vw, 100vw";

const CLAIM_ICONS = {
  shield: ShieldCheckIcon,
  fees: FeesReceiptIcon,
  halal: HalalKitchenIcon,
} as const;

export function HostHero() {
  const hero = image(HOST_IMAGES.pageHero);

  return (
    <section className={`${shell} pb-10 pt-6 md:pb-14 md:pt-8`}>
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <h1 className="text-h2 text-primary sm:text-display xl:text-displayLg">
            Become a host on SalamStay
          </h1>

          <p className="mt-5 text-h5 font-regular text-secondary">
            List a room or your whole home. You set the house rules, the price and who
            you accept.
          </p>

          {/* Honest affordance: this goes to the sign-up route, and the label
              says so. The card's own CTA wording, verbatim. */}
          <Link href="/signup" className={`${heroPill} ${focusRing}`}>
            <span className="truncate text-bodyMd font-medium text-primary">
              Start hosting
            </span>
            <span className={submitCircle}>
              <ArrowRightIcon className="size-5 text-on-brand" />
            </span>
          </Link>
        </div>

        <Image
          src={hero.file}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes={HERO_MEDIA_SIZES}
          className="aspect-[3/2] w-full rounded-3xl object-cover lg:aspect-[4/3]"
        />
      </div>
    </section>
  );
}

/**
 * The card's hero claim strip, moved one block down.
 *
 * The strip is three §5 claims, and §10 is explicit that the funnel hero holds
 * the H1, the sub, the pill and the photograph and nothing else — the power of
 * the 64px line comes from a 4:1 contrast against one 16px control, which a
 * third text block inside the same composition spends. So the claims keep their
 * verbatim wording and their card order and take the position directly under
 * the hero, which is where a trust row belongs anyway.
 *
 * Glyphs are gray, not brand (§2: "Icons are ink or gray"). Three green marks
 * across a claim row is a green field with text in it, and the green budget on
 * this page is already spent on the pill.
 */
export function HostClaims() {
  return (
    <ul
      className={`${shell} grid grid-cols-1 gap-x-8 gap-y-4 pb-12 sm:grid-cols-2 md:pb-16 lg:grid-cols-3`}
    >
      {HOST_CLAIMS.map(({ claim, icon }) => {
        const Icon = CLAIM_ICONS[icon];
        return (
          <li key={claim} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-secondary" />
            <span className="text-bodySm font-medium text-primary">{claim}</span>
          </li>
        );
      })}
    </ul>
  );
}
