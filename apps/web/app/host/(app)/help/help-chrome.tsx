import Link from "next/link";
import type { ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { focusRing, inlineAction } from "@/components/ui";
import { exampleStrip } from "@/components/ui/example-strip";

/**
 * Shared parts of the host help tree — the context line, the topic row, and the
 * two glyphs this family needs that no shared set carries.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHY THERE IS A SECOND CONTEXT COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * `HOST-SHELL.md` §1 forbids a breadcrumb on every host route, and §7.6a gives
 * the replacement: a plain "{Hub} · {Section}" text line whose first half is a
 * real link back. `app/host/(app)/onboarding/host-setup.tsx` already exports
 * `HostSetupContext` for exactly this, and it is NOT reused here for one
 * structural reason: it hard-codes `/host/onboarding` as the return point and
 * the word "Host setup" as the hub. These pages belong to a different hub, and
 * a context line that pointed a host reading about cantonment permissions back
 * at the setup checklist would be worse than no line at all.
 *
 * The shape, the separator, the `aria-hidden` on the `·` and the reasoning for
 * all three are that file's, copied in behaviour rather than in code because
 * there is nothing to share once the two strings differ. It is a paragraph with
 * one link in it: no `<nav>`, no `<ol>`, no `BreadcrumbList` — §1's "the context
 * line is chrome, not a breadcrumb, and emits no markup".
 */
export function HostHelpContext({
  section,
  className = "",
}: {
  readonly section: string;
  readonly className?: string;
}) {
  return (
    <p className={`text-bodySm font-regular text-secondary ${className}`}>
      <Link href="/host/help" className={inlineAction}>
        Help for hosts
      </Link>
      <span aria-hidden="true"> · </span>
      <span className="font-medium text-primary">{section}</span>
    </p>
  );
}

/* ───────────────────────────── honesty ──────────────────────────────────── */

/**
 * The hub's strip — `components/ui/example-strip.ts`'s recipe, this family's own
 * sentence.
 *
 * WHAT THE SENTENCE HAS TO SAY. `ha-070` draws a help centre with a search
 * field, six category tiles and a "N results" count. None of the three can be
 * honest here: there is no search index, the six categories are routes nobody
 * has written, and a result count over an index that does not exist is a
 * number. So the hub lists what exists, and the strip names the two absences a
 * reader would otherwise assume away.
 *
 * IT SAYS IT IN THE STRIP AND NOT IN THE PAGE, deliberately. A sentence in the
 * body reading "there is no search yet" is prose that turns into a lie on the
 * day search ships; the strip is the block that gets deleted whole, so the
 * absence and its statement leave together.
 */
export function HostHelpStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p className={`${exampleStrip} ${className}`}>
      <b className="font-semibold text-primary">This help centre is still being written.</b> What is
      listed below is what exists — there is no search over it, and no article is hidden behind one.
      Anything not answered here has to go to a person, and the form that would reach one is not
      connected yet.
    </p>
  );
}

/* ─────────────────────── the send that cannot send ──────────────────────── */

/**
 * `btnPrimaryPill`'s geometry wearing the disabled skin — the shipped idiom for
 * a control the product cannot honour, and the reason it is spelled out rather
 * than composed is Tailwind's: utilities are emitted in token order, so
 * appending `bg-raised` to a string that already carries `bg-interactive` is
 * decided by the stylesheet rather than by the order written here. A state is a
 * whole recipe (`components/ui.ts` records the same against `btnSecondaryMd`).
 *
 * ═══ DUPLICATION, DECLARED — AND HELD TO ONE COPY ═══════════════════════════
 * `app/messages/[threadId]/composer.tsx` and
 * `app/host/(app)/messages/[threadId]/composer.tsx` hold this string already,
 * byte for byte, with a note that it belongs in `components/ui.ts` beside
 * `btnPrimaryPill` and was left alone because other authors were in that file.
 * That is still true this wave, so it is still not moved — but the two surfaces
 * in THIS pass (`/host/help/contact` and a booking's case) share one copy from
 * here rather than adding a third and a fourth. When the fold-up happens, three
 * call sites move, not five.
 *
 * THE BORDER IS NOT DECORATION: `bg.raised` against `bg.canvas` measures 1.06:1
 * in light and 1.08:1 in dark, so without an edge a disabled primary is dim text
 * with no shape at all (`checkout-step.tsx` measured it).
 *
 * NO `pressable`. A control that cannot be pressed does not answer a press, and
 * that absence IS the signal — TASTE §1's rule that the press, like the shadow,
 * is what the enabled state spends.
 */
export const sendDisabled =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 " +
  "whitespace-nowrap rounded-full border border-border-default bg-raised px-6 text-bodyMd " +
  `font-semibold text-disabled ${focusRing}`;

/* ───────────────────────────── topic rows ───────────────────────────────── */

export interface HelpTopic {
  readonly href: string;
  readonly title: string;
  readonly body: string;
  readonly icon: ReactNode;
}

/**
 * A list of destinations, as hairline-divided rows in open space.
 *
 * `ha-070` draws six bordered, rounded category tiles in a 2-up grid. They do
 * not ship as tiles, for the reason `/host/verify` and `/host/onboarding` both
 * already gave when they refused the same plates: TASTE §1 gives a shadow to
 * what floats over scrolled content and a border to a form boundary or an
 * unselected choice, and a link to an article is neither. `HOST-SHELL.md` §8
 * repeats it for host surfaces specifically. So a row is a glyph, a title and a
 * line of body, divided by one hairline PER GAP — never a rule under every row,
 * which is TASTE §11.9's hatch pattern rather than a list.
 *
 * The title is the link and the row is not, which keeps the target the size of
 * the words a reader is aiming at and leaves the body selectable.
 */
export function HelpTopicList({
  topics,
  labelledBy,
}: {
  readonly topics: readonly HelpTopic[];
  readonly labelledBy: string;
}) {
  return (
    <ul aria-labelledby={labelledBy} className="mt-6 divide-y divide-hairline">
      {topics.map((topic) => (
        <li key={topic.href} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
          <span aria-hidden="true" className="mt-0.5 flex-none text-secondary">
            {topic.icon}
          </span>
          <div className="min-w-0 flex-1">
            {/* The tag carries the outline, the class carries the visual rank
                (TASTE §7: card titles at 16/500-600). Same split
                `/host/verify` uses for its six checks. */}
            <h3 className="text-bodyMd font-semibold text-primary">
              {/* TASTE §8 — ink, underlined at rest. Never brand: `HOST-SHELL.md`
                  §7 caps this shell's green at what `ha-046` already spends and
                  says to add nothing to it. */}
              <Link href={topic.href} className={inlineAction}>
                {topic.title}
              </Link>
            </h3>
            <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              {topic.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Two marks the shared sets do not carry.
 *
 * `components/icons.tsx` is chrome-shared, `components/home-icons.tsx` is the
 * `gw-001` claim set and `components/host/host-icons.tsx` is the wizard's — the
 * standing convention (`/host/verify`, `/host/insights`) is that a mark used on
 * one surface lives on that surface until a second one needs it.
 *
 * `ZoneIcon` is drawn a second time here rather than lifted out of
 * `app/host/(app)/verify/page.tsx`, where the same boundary-with-a-gate exists:
 * it is a local function inside a `page.tsx`, and exporting a component from a
 * route module to import it across the tree is worse than one repeated path.
 * The day a third surface wants it, all three move to a shared set together.
 */

type GlyphProps = { readonly className?: string };

function Glyph({ className, children }: GlyphProps & { readonly children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** A boundary with a gate in it. A restricted zone, and never a shield. */
export function ZoneIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 20V7l8-3 8 3v13" />
      <path d="M4 20h16" />
      <path d="M10 20v-5h4v5" />
    </Glyph>
  );
}

/** Two people either side of a level line. Mediation, not a verdict. */
export function BothSidesIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="6.5" cy="7" r="2.5" />
      <circle cx="17.5" cy="7" r="2.5" />
      <path d="M3 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h0a3.5 3.5 0 0 1 3.5 3.5V20" />
      <path d="M14 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h0a3.5 3.5 0 0 1 3.5 3.5V20" />
      <path d="M12 4v16" />
    </Glyph>
  );
}
