import { BRAND_METADATA, BrandMetadataEntry } from '../data/brandMetadata';
import { toAlphaNumeric } from './detectionEngine';

export interface RuntimeBrandProfile {
  domains: string[];
  appDescription: string;
  officialPublishers: string[];
  officialPackages: string[];
  officialHandles: { platform: string; handle: string }[];
}

const STORAGE_PREFIX = 'sentinalbrand.brandProfile.';

const cleanList = (items: string[]) =>
  Array.from(
    new Set(
      items
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

const cleanHandles = (handles: RuntimeBrandProfile['officialHandles']) => {
  const seen = new Set<string>();
  return handles
    .map((item) => ({
      platform: item.platform.trim(),
      handle: item.handle.trim(),
    }))
    .filter((item) => item.platform && item.handle)
    .filter((item) => {
      const key = `${item.platform.toLowerCase()}::${item.handle.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export function normalizeRuntimeProfile(profile: RuntimeBrandProfile): RuntimeBrandProfile {
  return {
    domains: cleanList(profile.domains.map((domain) => domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, ''))),
    appDescription: profile.appDescription.trim(),
    officialPublishers: cleanList(profile.officialPublishers),
    officialPackages: cleanList(profile.officialPackages),
    officialHandles: cleanHandles(profile.officialHandles),
  };
}

export function getStoredRuntimeProfile(brand: string): RuntimeBrandProfile | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  const key = toAlphaNumeric(brand);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return normalizeRuntimeProfile(JSON.parse(raw) as RuntimeBrandProfile);
  } catch {
    return null;
  }
}

export function storeRuntimeProfile(brand: string, profile: RuntimeBrandProfile): RuntimeBrandProfile {
  const normalized = normalizeRuntimeProfile(profile);
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const key = toAlphaNumeric(brand);
    if (key) localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(normalized));
  }
  return normalized;
}

export function clearRuntimeProfile(brand: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  const key = toAlphaNumeric(brand);
  if (key) localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

function genericMetadata(brand: string): BrandMetadataEntry {
  const safeName = brand.trim() || 'Custom Brand';
  return {
    domains: [],
    appDescription: '',
    officialPublishers: [],
    officialPackages: [],
    officialHandles: [],
    officialLogo: {
      name: `${safeName} Local Reference`,
      trademarkNumber: 'LOCAL-PROTOTYPE',
      primaryColor: '#0f2930',
      secondaryColor: '#2b94d7',
      pHash: '',
      symbolDescription: `${safeName} local prototype visual reference`,
      shape: 'rounded',
      description: 'Local prototype reference. No external verification claimed.',
      vectorSvg: `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0f2930"/><text x="50" y="58" text-anchor="middle" fill="#ffffff" font-size="34" font-family="Inter, sans-serif" font-weight="700">${safeName.slice(0, 2).toUpperCase()}</text></svg>`,
    },
  };
}

export function getEffectiveBrandMetadata(brand: string): BrandMetadataEntry {
  const key = toAlphaNumeric(brand);
  const base = BRAND_METADATA[key] || genericMetadata(brand);
  const stored = getStoredRuntimeProfile(brand);
  if (!stored) return base;

  return {
    ...base,
    domains: stored.domains,
    appDescription: stored.appDescription,
    officialPublishers: stored.officialPublishers,
    officialPackages: stored.officialPackages,
    officialHandles: stored.officialHandles,
  };
}

/**
 * Applies the current local runtime profile to the in-memory metadata registry used by
 * the existing synchronous detection engine. This keeps Phase 1/2 scoring intact while
 * allowing the Phase 3 editor to become the source of truth for official identifiers.
 */
export function applyRuntimeBrandProfile(brand: string): BrandMetadataEntry {
  const key = toAlphaNumeric(brand);
  const effective = getEffectiveBrandMetadata(brand);
  if (key) BRAND_METADATA[key] = effective;
  return effective;
}

export function runtimeProfileFromMetadata(metadata: BrandMetadataEntry): RuntimeBrandProfile {
  return {
    domains: [...metadata.domains],
    appDescription: metadata.appDescription,
    officialPublishers: [...metadata.officialPublishers],
    officialPackages: [...metadata.officialPackages],
    officialHandles: metadata.officialHandles.map((item) => ({ ...item })),
  };
}
