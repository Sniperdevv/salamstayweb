/**
 * v1 language control, shared by the desktop header bar and the mobile menu so
 * the two cannot drift.
 *
 * `/ur` does not exist yet, so اردو is a plain span rather than a dead link —
 * the corpus' EN/اردو affordance without a promise the router cannot keep. EN
 * is the active language on every shipped route.
 *
 * The active segment is INK, not brand (TASTE-RULES §2 / §3): "this one is
 * chosen" is `interactive.selectedFill`, and brand green is reserved for the
 * wordmark dot, the search-submit circle, the surface's one primary CTA and
 * verification marks. A green EN chip next to a green Sign up button spends two
 * roles saying two different things in the same colour.
 */
export function LanguageGroup({ className = "" }: { readonly className?: string }) {
  return (
    <span
      role="group"
      aria-label="Language"
      className={`items-center overflow-hidden rounded-full border border-border-default ${className}`}
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

export default LanguageGroup;
