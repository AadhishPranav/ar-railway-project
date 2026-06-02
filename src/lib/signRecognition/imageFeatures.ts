const FEATURE_SIZE = 128;

/** Load an image URL into a square canvas and return ImageData (same-origin / CORS-safe URLs only). */
export function loadImageData(
  src: string,
  size = FEATURE_SIZE
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      const data = ctx.getImageData(0, 0, size, size);
      resolve(data);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function toGrayscale(data: ImageData): Uint8Array {
  const gray = new Uint8Array(data.width * data.height);
  const { data: px, width, height } = data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      gray[y * width + x] = Math.round(
        0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
      );
    }
  }
  return gray;
}

/**
 * Difference hash (dHash) — 64-bit perceptual fingerprint.
 * Robust to scale/lighting; standard lightweight CV technique for browser use.
 */
export function computeDHash(imageData: ImageData): string {
  const srcW = imageData.width;
  const srcH = imageData.height;
  const gray = toGrayscale(imageData);

  const w = 9;
  const h = 8;
  const small = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = Math.floor((x / w) * srcW);
      const sy = Math.floor((y / h) * srcH);
      small[y * w + x] = gray[sy * srcW + sx];
    }
  }

  let bits = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - 1; x++) {
      const left = small[y * w + x];
      const right = small[y * w + x + 1];
      bits += left < right ? "1" : "0";
    }
  }
  return bits;
}

export function hammingDistance(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  let dist = 0;
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) dist++;
  }
  return dist + Math.abs(a.length - b.length);
}

/** Normalized RGB histogram (8 bins per channel = 512 bins). */
export function computeColorHistogram(imageData: ImageData): Float32Array {
  const bins = 8;
  const hist = new Float32Array(bins * bins * bins);
  const { data, width, height } = imageData;
  const total = width * height;

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.min(bins - 1, (data[i] >> 5));
    const g = Math.min(bins - 1, (data[i + 1] >> 5));
    const b = Math.min(bins - 1, (data[i + 2] >> 5));
    hist[r * bins * bins + g * bins + b] += 1;
  }

  for (let i = 0; i < hist.length; i++) {
    hist[i] /= total;
  }
  return hist;
}

/** Histogram intersection similarity (0–1). */
export function histogramSimilarity(a: Float32Array, b: Float32Array): number {
  let intersection = 0;
  for (let i = 0; i < a.length; i++) {
    intersection += Math.min(a[i], b[i]);
  }
  return intersection;
}

export function dHashSimilarity(hashA: string, hashB: string): number {
  const maxBits = Math.max(hashA.length, hashB.length);
  if (maxBits === 0) return 0;
  return 1 - hammingDistance(hashA, hashB) / maxBits;
}
