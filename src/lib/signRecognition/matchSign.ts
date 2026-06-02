import {
  CONFIDENCE_THRESHOLD,
  DHASH_WEIGHT,
  HISTOGRAM_WEIGHT,
  MIN_SCORE_MARGIN,
} from "./config";
import {
  computeColorHistogram,
  computeDHash,
  dHashSimilarity,
  histogramSimilarity,
  loadImageData,
} from "./imageFeatures";
import { loadReferenceIndex } from "./referenceIndex";
import type { SignMatchResult } from "./types";

interface ScoredCandidate {
  signId: number;
  score: number;
  dHashScore: number;
  histScore: number;
}

function scoreAgainstReferences(
  queryHash: string,
  queryHist: Float32Array,
  references: Awaited<ReturnType<typeof loadReferenceIndex>>
): ScoredCandidate[] {
  return references
    .map((ref) => {
      const dHashScore = dHashSimilarity(queryHash, ref.dHash);
      const histScore = histogramSimilarity(queryHist, ref.histogram);
      const score = DHASH_WEIGHT * dHashScore + HISTOGRAM_WEIGHT * histScore;
      return {
        signId: ref.sign.id,
        score,
        dHashScore,
        histScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Match a captured camera frame against all 15 railway signs in the database.
 *
 * Algorithm: difference hash (dHash) + RGB histogram intersection.
 * Designed as a drop-in precursor to a future TensorFlow.js classifier.
 */
export async function matchCapturedImage(
  imageDataUrl: string
): Promise<SignMatchResult> {
  const references = await loadReferenceIndex();
  const queryData = await loadImageData(imageDataUrl);
  const queryHash = computeDHash(queryData);
  const queryHist = computeColorHistogram(queryData);

  const ranked = scoreAgainstReferences(queryHash, queryHist, references);

  const best = ranked[0];
  const second = ranked[1];

  if (!best) {
    return {
      recognized: false,
      sign: null,
      confidence: 0,
      score: 0,
      secondBestScore: 0,
      algorithm: "dhash-histogram-v1",
    };
  }

  const secondBestScore = second?.score ?? 0;
  const margin = best.score - secondBestScore;
  const recognized =
    best.score >= CONFIDENCE_THRESHOLD && margin >= MIN_SCORE_MARGIN;

  const matchedRef = references.find((r) => r.sign.id === best.signId);

  // eslint-disable-next-line no-console
  console.info("[signRecognition] Match result", {
    best: {
      sign: matchedRef?.sign.name,
      score: best.score.toFixed(3),
      dHash: best.dHashScore.toFixed(3),
      histogram: best.histScore.toFixed(3),
      margin: margin.toFixed(3),
    },
    second: second
      ? {
          signId: second.signId,
          score: second.score.toFixed(3),
        }
      : null,
    recognized,
  });

  return {
    recognized,
    sign: recognized && matchedRef ? matchedRef.sign : null,
    confidence: Math.round(best.score * 100),
    score: best.score,
    secondBestScore,
    algorithm: "dhash-histogram-v1",
  };
}
