export type { SignMatchResult, SignRecognitionEngine } from "./types";
export {
  CONFIDENCE_THRESHOLD,
  MIN_SCORE_MARGIN,
} from "./config";
export { loadReferenceIndex, getReferenceIndex } from "./referenceIndex";
export { matchCapturedImage } from "./matchSign";
export {
  signRecognitionEngine,
  dhashHistogramEngine,
} from "./dhashHistogramEngine";

export const RECOGNITION_RESULT_KEY = "recognitionResult";

export function saveRecognitionResult(result: import("./types").SignMatchResult): void {
  sessionStorage.setItem(RECOGNITION_RESULT_KEY, JSON.stringify(result));
}

export function loadRecognitionResult(): import("./types").SignMatchResult | null {
  const raw = sessionStorage.getItem(RECOGNITION_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as import("./types").SignMatchResult;
  } catch {
    return null;
  }
}

export function clearRecognitionSession(): void {
  sessionStorage.removeItem("capturedImage");
  sessionStorage.removeItem(RECOGNITION_RESULT_KEY);
}
