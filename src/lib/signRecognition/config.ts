/** Minimum combined similarity (0–1) to accept a match. */
export const CONFIDENCE_THRESHOLD = 0.58;

/** Best match must beat second-best by at least this margin (reduces ambiguous picks). */
export const MIN_SCORE_MARGIN = 0.06;

/** Weight for perceptual hash vs color histogram in the combined score. */
export const DHASH_WEIGHT = 0.72;
export const HISTOGRAM_WEIGHT = 0.28;
