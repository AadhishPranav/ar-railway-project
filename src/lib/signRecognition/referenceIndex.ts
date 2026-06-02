import { railwaySigns, type RailwaySign } from "@/data/railwaySigns";
import {
  computeColorHistogram,
  computeDHash,
  loadImageData,
} from "./imageFeatures";

export interface SignReferenceFeatures {
  sign: RailwaySign;
  dHash: string;
  histogram: Float32Array;
}

let referenceCache: SignReferenceFeatures[] | null = null;
let loadPromise: Promise<SignReferenceFeatures[]> | null = null;

/** Use local SVG assets only — avoids CORS tainting and matches the library database. */
function referenceImageSrc(sign: RailwaySign): string {
  return sign.imageUrl;
}

export async function loadReferenceIndex(): Promise<SignReferenceFeatures[]> {
  if (referenceCache) return referenceCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const entries: SignReferenceFeatures[] = [];

    for (const sign of railwaySigns) {
      const src = referenceImageSrc(sign);
      const imageData = await loadImageData(src);
      entries.push({
        sign,
        dHash: computeDHash(imageData),
        histogram: computeColorHistogram(imageData),
      });
    }

    referenceCache = entries;
    // eslint-disable-next-line no-console
    console.info("[signRecognition] Reference index loaded", {
      count: entries.length,
    });
    return entries;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

export function getReferenceIndex(): SignReferenceFeatures[] | null {
  return referenceCache;
}

export function clearReferenceIndex(): void {
  referenceCache = null;
  loadPromise = null;
}
