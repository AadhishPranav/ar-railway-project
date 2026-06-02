import { matchCapturedImage } from "./matchSign";
import { loadReferenceIndex } from "./referenceIndex";
import type { SignMatchResult, SignRecognitionEngine } from "./types";

/**
 * Current production engine: perceptual hashing + color histograms.
 * Replace or wrap with `TensorFlowSignEngine` when a TF.js model is added.
 */
export const dhashHistogramEngine: SignRecognitionEngine = {
  name: "dhash-histogram-v1",
  async preload() {
    await loadReferenceIndex();
  },
  match(imageDataUrl: string): Promise<SignMatchResult> {
    return matchCapturedImage(imageDataUrl);
  },
};

/** Default engine — swap this export when integrating TensorFlow.js. */
export const signRecognitionEngine: SignRecognitionEngine = dhashHistogramEngine;
