import type { ReactNode } from "react";

/**
 * The shell's one panel anatomy, used three times: the "no search yet" state,
 * the relax-a-filter state, and the map note.
 *
 * A `bg.raised` strip at `radius.lg`, a 40px canvas disc for the glyph, a
 * 16/600 title and one line of body. Three uses, one anatomy: that is the
 * truth of it, where three bespoke boxes would read as three systems.
 *
 * NO BORDER, and no shadow either (§1 + the closing-review ruling). The gw-005
 * card draws `.empty` as a hairlined plate; the ruling is that guidance blocks
 * are open columns or `bg.raised` strips and never bordered canvas cards, and
 * the tint alone already separates the strip from the page. §1 gives the
 * reason a border would be wrong on its own terms: a border is a form boundary
 * or an unselected choice, and none of these three is either. Nothing floats
 * here, so nothing casts.
 *
 * The type step is 16/600 over 14/400 (ruling 2), never 14 on 14: a title set
 * at the same size as its body is not a title, it is a bold first sentence.
 */
export interface PanelProps {
  /** The glyph, already sized by the caller (`size-5`). */
  readonly icon: ReactNode;
  readonly title: string;
  readonly body: ReactNode;
  /** Optional block under the body — the relax rows. */
  readonly children?: ReactNode;
}

export function Panel({ icon, title, body, children }: PanelProps) {
  return (
    <div className="flex items-start gap-3.5 rounded-lg bg-raised p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas text-secondary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-bodyMd font-semibold text-primary">{title}</p>
        <p className="mt-1.5 max-w-prose text-bodySm text-secondary">{body}</p>
        {children}
      </div>
    </div>
  );
}

export default Panel;
