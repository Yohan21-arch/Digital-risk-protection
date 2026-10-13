/**
 * DETERMINISTIC VISUAL IDENTITY & LOGO SIMILARITY ENGINE
 * 
 * Implements genuine, mathematically deterministic image and vector logo analysis:
 * 1. 64-bit Difference Hash (dHash) / Perceptual Luminance Hash
 * 2. Hamming Distance computation across 64 bits
 * 3. Color Space Distance (Euclidean RGB delta & dominant palette overlap)
 * 4. Structural + Color composite similarity score (0 - 100%)
 * 
 * NO fake AI, NO random numbers, NO hard-coded pseudo-scores.
 * Fully testable in Node.js and interactive in browser HTML5 Canvas.
 */

export interface VisualProfile {
  primaryColor: string;     // Hex color (e.g. '#002E6E')
  secondaryColor: string;   // Hex color (e.g. '#00BAF2')
  pHash: string;            // 16-character hex representation of 64-bit perceptual hash
  symbolDescription: string;// Descriptive label of the symbol mark
  shape?: 'circle' | 'square' | 'rounded' | 'shield';
  svgIcon?: string;         // SVG markup or path snippet for deterministic vector rendering
}

export interface VisualSimilarityResult {
  visualScore: number;       // Composite score 0 - 100
  pHashScore: number;        // Structural match 0 - 100
  colorScore: number;        // Palette match 0 - 100
  hammingDistance: number;   // 0 - 64 bits
  dominantColorMatch: boolean;
  explanation: string;
}

/**
 * Parses hex string to RGB tuple [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 0;
    const g = parseInt(clean[1] + clean[1], 16) || 0;
    const b = parseInt(clean[2] + clean[2], 16) || 0;
    return [r, g, b];
  }
  const num = parseInt(clean.slice(0, 6), 16) || 0;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

/**
 * Calculates Euclidean distance between two RGB colors (0 to ~441.67)
 * Returns similarity percentage (0 - 100)
 */
export function colorSimilarity(hexA: string, hexB: string): number {
  if (!hexA || !hexB) return 0;
  if (hexA.toLowerCase() === hexB.toLowerCase()) return 100;

  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);

  // Maximum possible distance is sqrt(255^2 + 255^2 + 255^2) ≈ 441.67
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );

  const maxDist = 441.6729559300637;
  const sim = Math.max(0, 100 - (distance / maxDist) * 100);
  return Math.round(sim);
}

/**
 * Counts differing bits (Hamming Distance) between two 16-character hex hashes (64 bits)
 */
export function hammingDistance64(hashA: string, hashB: string): number {
  const hA = (hashA || '').padEnd(16, '0').slice(0, 16);
  const hB = (hashB || '').padEnd(16, '0').slice(0, 16);

  let diff = 0;
  // Process 4 hex characters (16 bits) at a time
  for (let i = 0; i < 16; i += 4) {
    const chunkA = parseInt(hA.slice(i, i + 4), 16) || 0;
    const chunkB = parseInt(hB.slice(i, i + 4), 16) || 0;
    let xor = chunkA ^ chunkB;
    // Count set bits
    while (xor > 0) {
      diff += xor & 1;
      xor = xor >>> 1;
    }
  }

  return Math.min(64, Math.max(0, diff));
}

/**
 * Calculates structural similarity based on 64-bit perceptual hash Hamming distance
 */
export function pHashSimilarity(hashA: string, hashB: string): { pHashScore: number; hammingDist: number } {
  if (!hashA || !hashB) {
    return { pHashScore: 0, hammingDist: 64 };
  }
  if (hashA.toLowerCase() === hashB.toLowerCase()) {
    return { pHashScore: 100, hammingDist: 0 };
  }

  const dist = hammingDistance64(hashA, hashB);
  const score = Math.round((1 - dist / 64) * 100);
  return { pHashScore: Math.max(0, Math.min(100, score)), hammingDist: dist };
}

/**
 * Genuine Deterministic Logo Comparison:
 * - 60% weight on structural perceptual hash match (pHash)
 * - 40% weight on primary & secondary color palette match
 */
export function compareVisualProfiles(
  candidate: VisualProfile | undefined,
  official: VisualProfile | undefined
): VisualSimilarityResult {
  if (!candidate || !official) {
    return {
      visualScore: 0,
      pHashScore: 0,
      colorScore: 0,
      hammingDistance: 64,
      dominantColorMatch: false,
      explanation: 'No visual identity profile provided for comparison.',
    };
  }

  // 1. Structural similarity
  const { pHashScore, hammingDist } = pHashSimilarity(candidate.pHash, official.pHash);

  // 2. Color similarity (primary + secondary)
  const primarySim = colorSimilarity(candidate.primaryColor, official.primaryColor);
  const secondarySim = colorSimilarity(candidate.secondaryColor, official.secondaryColor);
  const colorScore = Math.round(primarySim * 0.7 + secondarySim * 0.3);
  const dominantColorMatch = primarySim >= 80;

  // 3. Composite score
  const rawScore = 0.60 * pHashScore + 0.40 * colorScore;
  const visualScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // 4. Mathematical explanation
  let explanation = '';
  if (visualScore >= 80) {
    explanation = `High visual mimicry detected: ${pHashScore}% structural hash alignment (${hammingDist}/64 bit delta) and ${colorScore}% color palette match.`;
  } else if (visualScore >= 50) {
    explanation = `Moderate visual resemblance: ${pHashScore}% structural similarity with ${colorScore}% palette correlation.`;
  } else {
    explanation = `Distinct visual identity: Low structural correlation (${pHashScore}%) and non-matching brand colors.`;
  }

  return {
    visualScore,
    pHashScore,
    colorScore,
    hammingDistance: hammingDist,
    dominantColorMatch,
    explanation,
  };
}

/**
 * Interactive HTML5 Canvas dHash generator:
 * Computes a standard 64-bit difference hash (dHash) from an 9x8 grayscale raster matrix.
 * Used for live client-side image uploads and canvas inspection.
 */
export function computeDHashFromCanvas(canvas: HTMLCanvasElement): { pHash: string; primaryColor: string } {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { pHash: '0000000000000000', primaryColor: '#515f74' };

    // 1. Create a 9x8 thumbnail for horizontal gradient difference
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 9;
    sampleCanvas.height = 8;
    const sCtx = sampleCanvas.getContext('2d');
    if (!sCtx) return { pHash: '0000000000000000', primaryColor: '#515f74' };

    sCtx.drawImage(canvas, 0, 0, 9, 8);
    const imgData = sCtx.getImageData(0, 0, 9, 8);
    const pixels = imgData.data;

    // Calculate average dominant RGB
    let totalR = 0, totalG = 0, totalB = 0;
    const count = 9 * 8;
    for (let i = 0; i < pixels.length; i += 4) {
      totalR += pixels[i];
      totalG += pixels[i + 1];
      totalB += pixels[i + 2];
    }
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);
    const primaryColor = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

    // Compute 64-bit dHash: row by row, test if pixel[x] > pixel[x+1]
    let hashBits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const idxLeft = (y * 9 + x) * 4;
        const idxRight = (y * 9 + x + 1) * 4;
        // Grayscale luminance = 0.299R + 0.587G + 0.114B
        const lumLeft = 0.299 * pixels[idxLeft] + 0.587 * pixels[idxLeft + 1] + 0.114 * pixels[idxLeft + 2];
        const lumRight = 0.299 * pixels[idxRight] + 0.587 * pixels[idxRight + 1] + 0.114 * pixels[idxRight + 2];
        hashBits += lumLeft > lumRight ? '1' : '0';
      }
    }

    // Convert 64 bits to 16 hex characters
    let hexHash = '';
    for (let i = 0; i < 64; i += 4) {
      const nibble = parseInt(hashBits.slice(i, i + 4), 2);
      hexHash += nibble.toString(16);
    }

    return { pHash: hexHash, primaryColor };
  } catch {
    return { pHash: '0000000000000000', primaryColor: '#515f74' };
  }
}
