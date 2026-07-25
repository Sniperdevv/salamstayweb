import { spaceBase } from "@salamstay/design-tokens/spacing";

/**
 * Rail card width — THE single place this number lives. The Tailwind
 * `w-rail-card` utility and every `sizes`/preload hint derive from it; a width
 * change that lands in only one encoding site ships an undersampled LCP
 * (city review B1-B3).
 *
 * 52 steps on the 4px grid = 208px: titles fit unclipped and six-card rails
 * overflow the 1232 content box, so the peek + live arrows exist at 1280.
 */
export const RAIL_CARD_STEPS = 52;
export const RAIL_CARD_PX = spaceBase * RAIL_CARD_STEPS;
/** Honest `sizes` hint: a 20/19 cover crop of a 3:2 source needs ~1.27x width. */
export const RAIL_CARD_SIZES = `${Math.round(RAIL_CARD_PX * 1.27)}px`;
