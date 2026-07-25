import type { ReactElement } from "react";
import { eyebrow, sectionHeading, sectionRule, sectionShell } from "./styles";

/**
 * Practical notes — the `.notes` block both discovery cards draw: three plain
 * panels, each one thing a traveller actually has to plan around here. The
 * load-shedding note states the honest position (lighter in the capital, still
 * real in summer, per-listing hours on every home) rather than a national
 * figure nobody can stand behind.
 *
 * Panels do not lift on hover. They are not links, and motion on a thing that
 * cannot be pressed is a promise the page does not keep.
 *
 * Glyphs arrive resolved rather than as ids: the two templates map different
 * roles onto this same grid (weather on a city page, walkability on an area
 * page), and a shared id union would have to grow every time a template does.
 */
export interface NoteItem {
  readonly heading: string;
  readonly body: string;
  readonly Icon: (props: { readonly className?: string }) => ReactElement;
}

export function NotesSection({
  id,
  eyebrow: label,
  heading,
  items,
}: {
  /** Anchors `aria-labelledby`; each card names this section differently. */
  readonly id: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly NoteItem[];
}) {
  return (
    <section aria-labelledby={id} className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{label}</p>
        <h2 id={id} className={`mt-2 ${sectionHeading}`}>
          {heading}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map(({ heading: title, body, Icon }) => (
            <div key={title} className="rounded-lg border border-hairline bg-canvas p-5">
              <span className="mb-3 grid size-10 place-items-center rounded-full border border-hairline bg-raised text-secondary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-bodyMd font-semibold text-primary">{title}</h3>
              <p className="mt-2 text-bodySm text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NotesSection;
