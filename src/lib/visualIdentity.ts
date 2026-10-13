/**
 * DETERMINISTIC VISUAL IDENTITY & LOGO SIMILARITY ENGINE
 *
 * Implements browser-side, deterministic image/vector analysis:
 * 1. 64-bit Difference Hash (dHash)
 * 2. Hamming Distance
 * 3. RGB palette distance
 * 4. Composite similarity score (0-100)
 *
 * No neural model, random score, or external image API is used.
 */

export interface VisualProfile {
  primaryColor: string;
  secondaryColor: string;
  pHash: string;
  symbolDescription: string;
  shape?: 'circle' | 'square' | 'rounded' | 'shield';
  svgIcon?: string;
}

export interface VisualSimilarityResult {
  status: 'available' | 'unavailable';
  visualScore: number;
  pHashScore: number;
  colorScore: number;
  hammingDistance: number;
  dominantColorMatch: boolean;
  explanation: string;
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 0;
    const g = parseInt(clean[1] + clean[1], 16) || 0;
    const b = parseInt(clean[2] + clean[2], 16) || 0;
    return [r, g, b];
  }
  const num = parseInt(clean.slice(0, 6), 16) || 0;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function colorSimilarity(hexA: string, hexB: string): number {
  if (!hexA || !hexB) return 0;
  if (hexA.toLowerCase() === hexB.toLowerCase()) return 100;

  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
  const maxDist = 441.6729559300637;
  return Math.round(Math.max(0, 100 - (distance / maxDist) * 100));
}

export function hammingDistance64(hashA: string, hashB: string): number {
  const hA = (hashA || '').padEnd(16, '0').slice(0, 16);
  const hB = (hashB || '').padEnd(16, '0').slice(0, 16);
  let diff = 0;

  for (let i = 0; i < 16; i += 4) {
    const chunkA = parseInt(hA.slice(i, i + 4), 16) || 0;
    const chunkB = parseInt(hB.slice(i, i + 4), 16) || 0;
    let xor = chunkA ^ chunkB;
    while (xor > 0) {
      diff += xor & 1;
      xor >>>= 1;
    }
  }
  return Math.min(64, Math.max(0, diff));
}

export function pHashSimilarity(
  hashA: string,
  hashB: string
): { pHashScore: number; hammingDist: number } {
  if (!hashA || !hashB) return { pHashScore: 0, hammingDist: 64 };
  if (hashA.toLowerCase() === hashB.toLowerCase()) {
    return { pHashScore: 100, hammingDist: 0 };
  }
  const dist = hammingDistance64(hashA, hashB);
  return {
    pHashScore: Math.max(0, Math.min(100, Math.round((1 - dist / 64) * 100))),
    hammingDist: dist,
  };
}

export function compareVisualProfiles(
  candidate: VisualProfile | undefined,
  official: VisualProfile | undefined
): VisualSimilarityResult {
  if (!candidate || !official || !candidate.pHash || !official.pHash) {
    return {
      status: 'unavailable',
      visualScore: 0,
      pHashScore: 0,
      colorScore: 0,
      hammingDistance: 64,
      dominantColorMatch: false,
      explanation: 'Visual signal unavailable. No visual risk points were added.',
    };
  }

  const { pHashScore, hammingDist } = pHashSimilarity(candidate.pHash, official.pHash);
  const primarySim = colorSimilarity(candidate.primaryColor, official.primaryColor);
  const secondarySim = colorSimilarity(candidate.secondaryColor, official.secondaryColor);
  const colorScore = Math.round(primarySim * 0.7 + secondarySim * 0.3);
  const dominantColorMatch = primarySim >= 80;
  const visualScore = Math.round(Math.max(0, Math.min(100, 0.6 * pHashScore + 0.4 * colorScore)));

  let explanation = '';
  if (visualScore >= 80) {
    explanation = `High visual resemblance: ${pHashScore}% structural match (${hammingDist}/64 bit delta) and ${colorScore}% palette match.`;
  } else if (visualScore >= 50) {
    explanation = `Moderate visual resemblance: ${pHashScore}% structural similarity with ${colorScore}% palette correlation.`;
  } else {
    explanation = `Low visual resemblance: ${pHashScore}% structural similarity and ${colorScore}% palette match.`;
  }

  return {
    status: 'available',
    visualScore,
    pHashScore,
    colorScore,
    hammingDistance: hammingDist,
    dominantColorMatch,
    explanation,
  };
}

export function computeDHashFromCanvas(canvas: HTMLCanvasElement): { pHash: string; primaryColor: string } {
  try {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 9;
    sampleCanvas.height = 8;
    const sCtx = sampleCanvas.getContext('2d');
    if (!sCtx) return { pHash: '0000000000000000', primaryColor: '#515f74' };

    sCtx.drawImage(canvas, 0, 0, 9, 8);
    const pixels = sCtx.getImageData(0, 0, 9, 8).data;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    const count = 9 * 8;
    for (let i = 0; i < pixels.length; i += 4) {
      totalR += pixels[i];
      totalG += pixels[i + 1];
      totalB += pixels[i + 2];
    }

    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);
    const primaryColor = `#${avgR.toString(16).padStart(2, '0')}${avgG
      .toString(16)
      .padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

    let hashBits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const left = (y * 9 + x) * 4;
        const right = (y * 9 + x + 1) * 4;
        const lumLeft = 0.299 * pixels[left] + 0.587 * pixels[left + 1] + 0.114 * pixels[left + 2];
        const lumRight = 0.299 * pixels[right] + 0.587 * pixels[right + 1] + 0.114 * pixels[right + 2];
        hashBits += lumLeft > lumRight ? '1' : '0';
      }
    }

    let hexHash = '';
    for (let i = 0; i < 64; i += 4) {
      hexHash += parseInt(hashBits.slice(i, i + 4), 2).toString(16);
    }
    return { pHash: hexHash, primaryColor };
  } catch {
    return { pHash: '0000000000000000', primaryColor: '#515f74' };
  }
}

function imageElementToProfile(img: HTMLImageElement, description: string, sourceData?: string): VisualProfile {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(9, img.naturalWidth || img.width || 100);
  canvas.height = Math.max(8, img.naturalHeight || img.height || 100);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create canvas 2D context.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { pHash, primaryColor } = computeDHashFromCanvas(canvas);

  return {
    primaryColor,
    secondaryColor: primaryColor,
    pHash,
    symbolDescription: description,
    shape: 'rounded',
    svgIcon: sourceData,
  };
}

export async function computeProfileFromImageSource(
  src: string,
  description = 'Demo Candidate Visual'
): Promise<VisualProfile> {
  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    throw new Error('Image analysis is unavailable outside a browser runtime.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        resolve(imageElementToProfile(img, description, src));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load visual asset: ${src}`));
    img.src = src;
  });
}

export async function computeProfileFromImageFile(file: File): Promise<VisualProfile> {
  if (file.size > 1024 * 1024) throw new Error('File exceeds maximum size of 1 MB.');

  const validExts = /\.(png|jpe?g|webp|svg)$/i;
  const validMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
  if (!validMimes.includes(file.type) && !validExts.test(file.name)) {
    throw new Error('Unsupported format. Please upload PNG, JPEG, WEBP, or SVG.');
  }

  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new Error('FileReader not supported in this runtime.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read image data.'));
        return;
      }

      if (typeof Image === 'undefined' || typeof document === 'undefined') {
        reject(new Error('Canvas image analysis is unavailable in this runtime.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          resolve(imageElementToProfile(img, `Uploaded Reference Logo (${file.name})`, dataUrl));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to render uploaded image to canvas.'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Error reading local image file.'));
    reader.readAsDataURL(file);
  });
}

export function getStoredVisualReference(
  brandKey: string
): (VisualProfile & { source: 'uploaded'; label: string }) | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`sentinalbrand.visualReference.${brandKey.toLowerCase()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeVisualReference(
  brandKey: string,
  profile: VisualProfile,
  label = 'Uploaded Reference'
): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      `sentinalbrand.visualReference.${brandKey.toLowerCase()}`,
      JSON.stringify({ ...profile, source: 'uploaded' as const, label })
    );
  } catch {
    // Storage may be unavailable or full. The in-memory state still works.
  }
}

export function clearStoredVisualReference(brandKey: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(`sentinalbrand.visualReference.${brandKey.toLowerCase()}`);
  } catch {
    // Ignore unavailable storage.
  }
}
