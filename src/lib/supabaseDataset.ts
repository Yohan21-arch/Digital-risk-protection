import { BRAND_METADATA } from '../data/brandMetadata';
import { PROTOTYPE_CANDIDATE_DATASET } from '../data/candidateData';
import { normalizeBrandCatalogKey } from '../data/brandCatalog';
import type { CandidateEntity } from '../types';
import type { VisualProfile } from './visualIdentity';

export type DatasetSource = 'supabase' | 'local-fallback';

export interface DatasetHydrationResult {
  source: DatasetSource;
  brandCount: number;
  candidateCount: number;
  reason?: string;
}

interface SupabaseBrandRow {
  id: string;
  name: string;
  sector: string;
  description: string;
}

interface SupabaseDomainRow {
  brand_id: string;
  domain: string;
  is_primary: boolean;
}

interface SupabasePublisherRow {
  brand_id: string;
  publisher_name: string;
}

interface SupabasePackageRow {
  brand_id: string;
  package_identifier: string;
  store: string | null;
}

interface SupabaseHandleRow {
  brand_id: string;
  platform: string;
  handle: string;
}

interface SupabaseBrandVisualRow {
  brand_id: string;
  label: string;
  image_path: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  dhash: string | null;
  symbol_description: string | null;
  shape: string | null;
  source: string;
  is_primary: boolean;
}

interface SupabaseCandidateRow {
  id: string;
  brand_id: string;
  name: string;
  handle_or_package: string;
  platform: CandidateEntity['platform'];
  publisher: string | null;
  official_entity: string | null;
  summary: string;
  audience: string | null;
  detected_at: string | null;
  is_known_official: boolean;
  details: Record<string, unknown> | null;
}

interface SupabaseCandidateVisualRow {
  candidate_id: string;
  image_path: string | null;
  label: string;
  source: string;
  primary_color: string | null;
  secondary_color: string | null;
  dhash: string | null;
  symbol_description: string | null;
  shape: string | null;
}

interface SupabaseDatasetRows {
  brands: SupabaseBrandRow[];
  domains: SupabaseDomainRow[];
  publishers: SupabasePublisherRow[];
  packages: SupabasePackageRow[];
  handles: SupabaseHandleRow[];
  brandVisuals: SupabaseBrandVisualRow[];
  candidates: SupabaseCandidateRow[];
  candidateVisuals: SupabaseCandidateVisualRow[];
}

function envValue(name: string): string | undefined {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return viteEnv?.[name]?.trim() || undefined;
}

export function getSupabaseRuntimeConfig(): { url: string; key: string } | null {
  const url = envValue('VITE_SUPABASE_URL');
  const key = envValue('VITE_SUPABASE_ANON_KEY') || envValue('VITE_SUPABASE_PUBLISHABLE_KEY');
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseRuntimeConfig() !== null;
}

function headerSet(key: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: key,
    Accept: 'application/json',
  };
  // Legacy anon keys are JWTs and may also be sent as Bearer tokens. New publishable
  // keys are intentionally sent only as apikey headers.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  return headers;
}

async function fetchTable<T>(
  config: { url: string; key: string },
  table: string,
  query: string,
  signal: AbortSignal
): Promise<T[]> {
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: headerSet(config.key),
    signal,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${table} request failed (${response.status})${body ? `: ${body.slice(0, 180)}` : ''}`);
  }
  return (await response.json()) as T[];
}

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function safeAvatarType(value: unknown): CandidateEntity['avatarType'] {
  return value === 'icon' || value === 'badge' || value === 'letter' ? value : 'letter';
}

function safeShape(value: string | null | undefined): VisualProfile['shape'] {
  return value === 'circle' || value === 'square' || value === 'rounded' || value === 'shield'
    ? value
    : undefined;
}

function visualProfileFromRow(row: SupabaseCandidateVisualRow | SupabaseBrandVisualRow | undefined): VisualProfile | undefined {
  if (!row) return undefined;
  const primaryColor = row.primary_color || '';
  const secondaryColor = row.secondary_color || '';
  const pHash = row.dhash || '';
  const symbolDescription = row.symbol_description || '';
  if (!primaryColor && !secondaryColor && !pHash && !symbolDescription) return undefined;
  return {
    primaryColor,
    secondaryColor,
    pHash,
    symbolDescription,
    shape: safeShape(row.shape),
  };
}

function applySupabaseBrandRegistry(rows: SupabaseDatasetRows): void {
  const byBrandId = new Map(rows.brands.map((brand) => [brand.id, brand]));
  const visualByBrand = new Map<string, SupabaseBrandVisualRow>();
  for (const visual of rows.brandVisuals) {
    if (visual.is_primary || !visualByBrand.has(visual.brand_id)) visualByBrand.set(visual.brand_id, visual);
  }

  for (const brand of byBrandId.values()) {
    const key = normalizeBrandCatalogKey(brand.name);
    const existing = BRAND_METADATA[key];
    if (!existing) continue;

    const visual = visualByBrand.get(brand.id);
    const profile = visualProfileFromRow(visual);

    BRAND_METADATA[key] = {
      ...existing,
      category: brand.sector || existing.category,
      appDescription: brand.description || existing.appDescription,
      domains: rows.domains.filter((row) => row.brand_id === brand.id).map((row) => row.domain),
      officialPublishers: rows.publishers
        .filter((row) => row.brand_id === brand.id)
        .map((row) => row.publisher_name),
      officialPackages: rows.packages
        .filter((row) => row.brand_id === brand.id)
        .map((row) => row.package_identifier),
      officialHandles: rows.handles
        .filter((row) => row.brand_id === brand.id)
        .map((row) => ({ platform: row.platform, handle: row.handle })),
      officialLogo: {
        ...existing.officialLogo,
        ...(profile || {}),
        name: visual?.label || existing.officialLogo.name,
        imageSrc: visual?.image_path || existing.officialLogo.imageSrc,
        description: 'Controlled official reference loaded from the Mirage Supabase registry.',
      },
    };
  }
}

export function mapSupabaseCandidates(
  brands: SupabaseBrandRow[],
  candidateRows: SupabaseCandidateRow[],
  visualRows: SupabaseCandidateVisualRow[]
): CandidateEntity[] {
  const brandNameById = new Map(brands.map((brand) => [brand.id, brand.name]));
  const visualByCandidateId = new Map(visualRows.map((visual) => [visual.candidate_id, visual]));

  return candidateRows.flatMap((row): CandidateEntity[] => {
    const targetBrand = brandNameById.get(row.brand_id);
    if (!targetBrand) return [];

    const details = row.details || {};
    const publisher = row.publisher || safeString(details.publisher, 'Unknown / not supplied');
    const visualRow = visualByCandidateId.get(row.id);
    const visualProfile = visualProfileFromRow(visualRow);

    return [
      {
        id: row.id,
        targetBrand,
        name: row.name,
        handleOrPkg: row.handle_or_package,
        platform: row.platform,
        avatarType: safeAvatarType(details.avatarType),
        avatarBg: safeString(details.avatarBg, row.is_known_official ? '#0f2930' : '#515f74'),
        avatarText: safeString(details.avatarText, row.name.slice(0, 2).toUpperCase()),
        audience: row.audience || 'Unknown',
        dateDetected: row.detected_at || '',
        publisher,
        summary: row.summary || 'Controlled prototype candidate loaded from Supabase.',
        isKnownOfficial: row.is_known_official,
        officialEntity: row.official_entity || undefined,
        visualProfile,
        visual: visualRow?.image_path
          ? {
              imageSrc: visualRow.image_path,
              source: visualRow.source === 'uploaded' ? 'uploaded' : 'demo',
              label: visualRow.label,
            }
          : undefined,
        details: {
          publisher,
          redirectTunnel: safeString(details.redirectTunnel) || undefined,
          purpose: safeString(details.purpose, 'Controlled Prototype Candidate'),
          homographEntropy: safeString(details.homographEntropy, 'Not precomputed'),
          sha256Hash: safeString(details.sha256Hash),
          registrar: safeString(details.registrar, 'Not supplied'),
          ipAddress: safeString(details.ipAddress),
          registeredDate: safeString(details.registeredDate),
          mxRecords: safeString(details.mxRecords, 'Not supplied'),
          evProof: safeString(details.evProof) || undefined,
        },
      },
    ];
  });
}

async function loadSupabaseRows(config: { url: string; key: string }): Promise<SupabaseDatasetRows> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const [brands, domains, publishers, packages, handles, brandVisuals, candidates, candidateVisuals] = await Promise.all([
      fetchTable<SupabaseBrandRow>(config, 'brands', 'select=id,name,sector,description&is_active=eq.true&order=name.asc', controller.signal),
      fetchTable<SupabaseDomainRow>(config, 'brand_domains', 'select=brand_id,domain,is_primary', controller.signal),
      fetchTable<SupabasePublisherRow>(config, 'brand_publishers', 'select=brand_id,publisher_name', controller.signal),
      fetchTable<SupabasePackageRow>(config, 'brand_packages', 'select=brand_id,package_identifier,store', controller.signal),
      fetchTable<SupabaseHandleRow>(config, 'brand_social_handles', 'select=brand_id,platform,handle', controller.signal),
      fetchTable<SupabaseBrandVisualRow>(config, 'brand_visual_references', 'select=brand_id,label,image_path,primary_color,secondary_color,dhash,symbol_description,shape,source,is_primary', controller.signal),
      fetchTable<SupabaseCandidateRow>(config, 'candidates', 'select=id,brand_id,name,handle_or_package,platform,publisher,official_entity,summary,audience,detected_at,is_known_official,details&is_builtin=eq.true&order=id.asc', controller.signal),
      fetchTable<SupabaseCandidateVisualRow>(config, 'candidate_visuals', 'select=candidate_id,image_path,label,source,primary_color,secondary_color,dhash,symbol_description,shape', controller.signal),
    ]);
    return { brands, domains, publishers, packages, handles, brandVisuals, candidates, candidateVisuals };
  } finally {
    clearTimeout(timeout);
  }
}

export async function hydrateSupabaseDataset(): Promise<DatasetHydrationResult> {
  const config = getSupabaseRuntimeConfig();
  if (!config) {
    return {
      source: 'local-fallback',
      brandCount: Object.keys(BRAND_METADATA).length,
      candidateCount: PROTOTYPE_CANDIDATE_DATASET.length,
      reason: 'Supabase environment variables are not configured.',
    };
  }

  try {
    const rows = await loadSupabaseRows(config);
    const mappedCandidates = mapSupabaseCandidates(rows.brands, rows.candidates, rows.candidateVisuals);
    if (!rows.brands.length || !mappedCandidates.length) {
      throw new Error('Supabase returned an empty protected-brand dataset.');
    }

    applySupabaseBrandRegistry(rows);
    PROTOTYPE_CANDIDATE_DATASET.splice(0, PROTOTYPE_CANDIDATE_DATASET.length, ...mappedCandidates);

    // Phase 3 browser-local imports remain additive even when Supabase is the primary source.
    if (typeof window !== 'undefined') {
      try {
        const runtime = await import('./runtimeCandidates');
        runtime.hydrateStoredRuntimeCandidates();
      } catch {
        // A local import failure must never block the seeded Supabase dataset.
      }
    }

    return {
      source: 'supabase',
      brandCount: rows.brands.length,
      candidateCount: mappedCandidates.length,
    };
  } catch (error) {
    return {
      source: 'local-fallback',
      brandCount: Object.keys(BRAND_METADATA).length,
      candidateCount: PROTOTYPE_CANDIDATE_DATASET.length,
      reason: error instanceof Error ? error.message : 'Unknown Supabase loading error',
    };
  }
}
