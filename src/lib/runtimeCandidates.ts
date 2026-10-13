import { CandidateEntity } from '../types';
import { PROTOTYPE_CANDIDATE_DATASET } from '../data/candidateData';

const STORAGE_KEY = 'sentinalbrand.runtimeCandidates';
const BUILT_IN_IDS = new Set(PROTOTYPE_CANDIDATE_DATASET.map((candidate) => candidate.id));

const ALLOWED_PLATFORMS: CandidateEntity['platform'][] = [
  'X',
  'Google Play',
  'Facebook',
  'Instagram',
  'App Store',
  'Telegram',
  'Web Domain',
];

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asPlatform(value: unknown): CandidateEntity['platform'] {
  const candidate = asString(value) as CandidateEntity['platform'];
  if (!ALLOWED_PLATFORMS.includes(candidate)) {
    throw new Error(`Unsupported platform: ${candidate || '(empty)'}`);
  }
  return candidate;
}

export function normalizeRuntimeCandidate(raw: unknown, index = 0): CandidateEntity {
  if (!raw || typeof raw !== 'object') throw new Error(`Candidate ${index + 1} is not an object.`);
  const item = raw as Record<string, unknown>;

  const targetBrand = asString(item.targetBrand);
  const name = asString(item.name);
  const handleOrPkg = asString(item.handleOrPkg);
  if (!targetBrand || !name || !handleOrPkg) {
    throw new Error(`Candidate ${index + 1} must include targetBrand, name, and handleOrPkg.`);
  }

  const platform = asPlatform(item.platform);
  const details = (item.details && typeof item.details === 'object'
    ? item.details
    : {}) as Record<string, unknown>;

  const id = asString(item.id) || `LOCAL-${Date.now()}-${index + 1}`;
  if (BUILT_IN_IDS.has(id)) {
    throw new Error(`Candidate id "${id}" is reserved by the built-in demo dataset.`);
  }

  const publisher = asString(item.publisher) || asString(details.publisher) || 'Unknown / not supplied';

  return {
    id,
    targetBrand,
    name,
    handleOrPkg,
    platform,
    avatarType: ['letter', 'icon', 'badge'].includes(asString(item.avatarType))
      ? (asString(item.avatarType) as CandidateEntity['avatarType'])
      : 'letter',
    avatarBg: asString(item.avatarBg, '#0f2930'),
    avatarText: asString(item.avatarText, name.slice(0, 2).toUpperCase()),
    audience: asString(item.audience, 'Unknown'),
    dateDetected: asString(item.dateDetected, new Date().toISOString().split('T')[0]),
    publisher,
    summary: asString(item.summary, 'Locally imported prototype candidate.'),
    // Imported monitoring candidates can never self-assert Trusted status. Official
    // exceptions must come from the trusted asset/brand registry workflow instead.
    isKnownOfficial: false,
    officialEntity: undefined,
    visualProfile:
      item.visualProfile && typeof item.visualProfile === 'object'
        ? (item.visualProfile as CandidateEntity['visualProfile'])
        : undefined,
    visual:
      item.visual && typeof item.visual === 'object'
        ? (item.visual as CandidateEntity['visual'])
        : undefined,
    details: {
      publisher,
      redirectTunnel: asString(details.redirectTunnel) || undefined,
      purpose: asString(details.purpose, 'Local prototype monitoring candidate'),
      homographEntropy: asString(details.homographEntropy, 'Not precomputed'),
      sha256Hash: asString(details.sha256Hash, 'Not supplied'),
      registrar: asString(details.registrar, 'Not supplied'),
      ipAddress: asString(details.ipAddress, 'Not supplied'),
      registeredDate: asString(details.registeredDate, 'Not supplied'),
      mxRecords: asString(details.mxRecords, 'Not supplied'),
      evProof: asString(details.evProof) || undefined,
    },
  };
}

export function parseCandidateImport(text: string): CandidateEntity[] {
  if (!text.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Candidate import must be valid JSON.');
  }

  const list = Array.isArray(parsed) ? parsed : [parsed];
  if (!list.length) return [];
  return list.map((item, index) => normalizeRuntimeCandidate(item, index));
}

export function getStoredRuntimeCandidates(): CandidateEntity[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => normalizeRuntimeCandidate(item, index));
  } catch {
    return [];
  }
}

export function storeRuntimeCandidates(candidates: CandidateEntity[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
}

export function mergeCandidateSets(base: CandidateEntity[], incoming: CandidateEntity[]): CandidateEntity[] {
  const byId = new Map<string, CandidateEntity>();
  for (const candidate of base) byId.set(candidate.id, candidate);
  for (const candidate of incoming) byId.set(candidate.id, candidate);
  return Array.from(byId.values());
}

function syncActiveDataset(runtimeCandidates: CandidateEntity[]): void {
  const builtInOnly = PROTOTYPE_CANDIDATE_DATASET.filter((candidate) => BUILT_IN_IDS.has(candidate.id));
  const merged = mergeCandidateSets(builtInOnly, runtimeCandidates);
  PROTOTYPE_CANDIDATE_DATASET.splice(0, PROTOTYPE_CANDIDATE_DATASET.length, ...merged);
}

export function hydrateStoredRuntimeCandidates(): CandidateEntity[] {
  const stored = getStoredRuntimeCandidates();
  syncActiveDataset(stored);
  return stored;
}

export function appendRuntimeCandidates(incoming: CandidateEntity[]): CandidateEntity[] {
  const current = getStoredRuntimeCandidates();
  const merged = mergeCandidateSets(current, incoming);
  storeRuntimeCandidates(merged);
  syncActiveDataset(merged);
  return merged;
}

export function clearRuntimeCandidates(): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  syncActiveDataset([]);
}

if (typeof window !== 'undefined') hydrateStoredRuntimeCandidates();
