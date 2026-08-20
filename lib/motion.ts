/** Motion tokens — PROJECT.md §5.2. Typed as tuples for framer-motion's Easing type. */

export const DURATION = {
  instant: 0.1,
  fast: 0.18,
  base: 0.26,
  slow: 0.4,
  story: 0.7,
} as const;

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_IN = [0.55, 0, 1, 0.45] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
