import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { BRAND_CATALOG, BUILT_IN_BRANDS, normalizeBrandCatalogKey } from '../src/data/brandCatalog';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { PROTOTYPE_CANDIDATE_DATASET } from '../src/data/candidateData';
import { PHASE35_SUPPLEMENTAL_CANDIDATES } from '../src/data/phase35SupplementalCandidates';
import { PHASE35_LOOKALIKE_LOGOS } from '../src/data/phase35Visuals';
import type { CandidateEntity } from '../src/types';

const OUTPUT = resolve('supabase/migrations/20261014020000_seed_sentinalbrand_dataset.sql');

const LEGACY_DOMAIN_REPLACEMENTS: Array<[string, string]> = [
  ['paytm-refund-portal.me', 'paytm-refund-portal.test'],
  ['paytm-merchant-verify.cc', 'paytm-merchant-verify.test'],
  ['amz-festive-bonus.click', 'amz-festive-bonus.test'],
  ['nikee-store-direct.top', 'nikee-store-direct.test'],
  ['microsoft-verify-auth.org', 'microsoft-verify-auth.test'],
  ['micros0ft-support.org', 'micros0ft-support.test'],
];

function normalizePrototypeString(value: string): string {
  return LEGACY_DOMAIN_REPLACEMENTS.reduce(
    (next, [from, to]) => next.split(from).join(to),
    value
  );
}

function normalizePrototypeValue<T>(value: T): T {
  if (typeof value === 'string') return normalizePrototypeString(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizePrototypeValue(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        normalizePrototypeValue(item),
      ])
    ) as T;
  }
  return value;
}

function sqlText(value: string | null | undefined): string {
  if (value == null) return 'null';
  return `'${normalizePrototypeString(value).replaceAll("'", "''")}'`;
}

function sqlBool(value: boolean | undefined): string {
  return value ? 'true' : 'false';
}

function sqlJson(value: unknown): string {
  const normalized = normalizePrototypeValue(value);
  return `${sqlText(JSON.stringify(normalized))}::jsonb`;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sectorFor(brand: string): string {
  const group = BRAND_CATALOG.find((entry) => entry.brands.includes(brand));
  if (!group) throw new Error(`Missing sector for ${brand}`);
  return group.sector;
}

function combinedCandidates(): CandidateEntity[] {
  const byId = new Map<string, CandidateEntity>();
  for (const candidate of [
    ...PROTOTYPE_CANDIDATE_DATASET,
    ...PHASE35_SUPPLEMENTAL_CANDIDATES,
  ]) {
    if (byId.has(candidate.id)) throw new Error(`Duplicate candidate id: ${candidate.id}`);
    byId.set(candidate.id, normalizePrototypeValue(candidate));
  }
  return [...byId.values()];
}

function validateDataset(candidates: CandidateEntity[]): void {
  if (BUILT_IN_BRANDS.length !== 23) {
    throw new Error(`Expected 23 built-in brands, found ${BUILT_IN_BRANDS.length}`);
  }
  if (candidates.length < 160 || candidates.length > 250) {
    throw new Error(`Unexpected candidate count: ${candidates.length}`);
  }

  const supportedPlatforms = new Set([
    'X',
    'Instagram',
    'Facebook',
    'Telegram',
    'Google Play',
    'App Store',
    'Web Domain',
  ]);

  for (const brand of BUILT_IN_BRANDS) {
    const key = normalizeBrandCatalogKey(brand);
    if (!BRAND_METADATA[key]) throw new Error(`Missing BRAND_METADATA for ${brand}`);
    const brandCandidates = candidates.filter((candidate) => candidate.targetBrand === brand);
    if (brandCandidates.length < 5) throw new Error(`${brand} has only ${brandCandidates.length} candidates`);
  }

  for (const candidate of candidates) {
    if (!BUILT_IN_BRANDS.includes(candidate.targetBrand)) {
      throw new Error(`${candidate.id} targets unknown built-in brand ${candidate.targetBrand}`);
    }
    if (!supportedPlatforms.has(candidate.platform)) {
      throw new Error(`${candidate.id} has unsupported platform ${candidate.platform}`);
    }
  }

  const facebookCount = candidates.filter((candidate) => candidate.platform === 'Facebook').length;
  if (facebookCount < 10) throw new Error(`Expected at least 10 Facebook candidates, found ${facebookCount}`);
}

function inferredImagePath(candidate: CandidateEntity): string | undefined {
  if (candidate.visual?.imageSrc) return candidate.visual.imageSrc;
  if (
    !candidate.isKnownOfficial &&
    candidate.visualProfile &&
    candidate.visualProfile.primaryColor.toLowerCase() !== '#515f74'
  ) {
    return PHASE35_LOOKALIKE_LOGOS[candidate.targetBrand];
  }
  return undefined;
}

const candidates = combinedCandidates();
validateDataset(candidates);

const sql: string[] = [
  '-- SentinalBrand Phase 3.75B: deterministic prototype dataset seed',
  '-- Generated from the TypeScript source-of-truth by scripts/generateSupabaseSeed.ts.',
  '-- Suspicious identities are controlled synthetic prototype scenarios and are not claims about live malicious accounts.',
  '',
  'begin;',
  '',
];

for (const brand of BUILT_IN_BRANDS) {
  const metadata = BRAND_METADATA[normalizeBrandCatalogKey(brand)];
  sql.push(
    `insert into public.brands (slug, name, sector, description, is_builtin, is_active) values (` +
      `${sqlText(slugify(brand))}, ${sqlText(brand)}, ${sqlText(sectorFor(brand))}, ${sqlText(metadata.appDescription)}, true, true)` +
      ` on conflict (name) do update set slug = excluded.slug, sector = excluded.sector, description = excluded.description, is_builtin = true, is_active = true, updated_at = now();`
  );
}

sql.push('', '-- Brand registry references');

for (const brand of BUILT_IN_BRANDS) {
  const metadata = BRAND_METADATA[normalizeBrandCatalogKey(brand)];
  const brandId = `(select id from public.brands where name = ${sqlText(brand)})`;

  metadata.domains.forEach((domain, index) => {
    sql.push(
      `insert into public.brand_domains (brand_id, domain, is_primary) values (${brandId}, ${sqlText(domain)}, ${index === 0 ? 'true' : 'false'}) on conflict (brand_id, domain) do update set is_primary = excluded.is_primary;`
    );
  });

  metadata.officialPublishers.forEach((publisher) => {
    sql.push(
      `insert into public.brand_publishers (brand_id, publisher_name) values (${brandId}, ${sqlText(publisher)}) on conflict (brand_id, publisher_name) do nothing;`
    );
  });

  metadata.officialPackages.forEach((pkg) => {
    sql.push(
      `insert into public.brand_packages (brand_id, package_identifier, store) values (${brandId}, ${sqlText(pkg)}, null) on conflict (brand_id, package_identifier) do nothing;`
    );
  });

  metadata.officialHandles.forEach((handle) => {
    if (!['X', 'Instagram', 'Facebook', 'Telegram'].includes(handle.platform)) return;
    sql.push(
      `insert into public.brand_social_handles (brand_id, platform, handle) values (${brandId}, ${sqlText(handle.platform)}::public.candidate_platform, ${sqlText(handle.handle)}) on conflict (brand_id, platform, handle) do nothing;`
    );
  });

  const logo = metadata.officialLogo;
  sql.push(
    `insert into public.brand_visual_references (` +
      `brand_id, label, image_path, primary_color, secondary_color, dhash, symbol_description, shape, source, is_primary` +
      `) select ${brandId}, ${sqlText('Demo Official Reference')}, ${sqlText(logo.imageSrc)}, ${sqlText(logo.primaryColor)}, ${sqlText(logo.secondaryColor)}, ${sqlText(logo.pHash)}, ${sqlText(logo.symbolDescription)}, ${sqlText(logo.shape)}, 'prototype-seed', true` +
      ` where not exists (select 1 from public.brand_visual_references where brand_id = ${brandId} and source = 'prototype-seed' and is_primary = true);`
  );
}

sql.push('', '-- Controlled monitored candidates');

for (const candidate of candidates) {
  const brandId = `(select id from public.brands where name = ${sqlText(candidate.targetBrand)})`;
  const detailsPayload = {
    ...(candidate.details || {}),
    avatarType: candidate.avatarType,
    avatarBg: candidate.avatarBg,
    avatarText: candidate.avatarText,
  };

  sql.push(
    `insert into public.candidates (` +
      `id, brand_id, name, handle_or_package, platform, publisher, official_entity, summary, audience, detected_at, is_known_official, is_builtin, source_label, details` +
      `) values (` +
      `${sqlText(candidate.id)}, ${brandId}, ${sqlText(candidate.name)}, ${sqlText(candidate.handleOrPkg)}, ${sqlText(candidate.platform)}::public.candidate_platform, ${sqlText(candidate.publisher || candidate.details?.publisher)}, ${sqlText(candidate.officialEntity)}, ${sqlText(candidate.summary)}, ${sqlText(candidate.audience)}, ${candidate.dateDetected ? `${sqlText(candidate.dateDetected)}::timestamptz` : 'null'}, ${sqlBool(candidate.isKnownOfficial)}, true, ${sqlText(candidate.isKnownOfficial ? 'Controlled Official Reference' : 'Controlled Prototype Candidate')}, ${sqlJson(detailsPayload)}` +
      `) on conflict (id) do update set ` +
      `brand_id = excluded.brand_id, name = excluded.name, handle_or_package = excluded.handle_or_package, platform = excluded.platform, publisher = excluded.publisher, official_entity = excluded.official_entity, summary = excluded.summary, audience = excluded.audience, detected_at = excluded.detected_at, is_known_official = excluded.is_known_official, is_builtin = true, source_label = excluded.source_label, details = excluded.details, updated_at = now();`
  );

  const profile = candidate.visualProfile;
  const imagePath = inferredImagePath(candidate);
  if (profile || imagePath) {
    sql.push(
      `insert into public.candidate_visuals (` +
        `candidate_id, image_path, label, source, primary_color, secondary_color, dhash, symbol_description, shape` +
        `) values (` +
        `${sqlText(candidate.id)}, ${sqlText(imagePath)}, ${sqlText(candidate.visual?.label || (candidate.isKnownOfficial ? 'Demo Official Candidate Visual' : 'Demo Candidate Visual'))}, ${sqlText(candidate.visual?.source || 'prototype')}, ${sqlText(profile?.primaryColor)}, ${sqlText(profile?.secondaryColor)}, ${sqlText(profile?.pHash)}, ${sqlText(profile?.symbolDescription)}, ${sqlText(profile?.shape)}` +
        `) on conflict (candidate_id) do update set image_path = excluded.image_path, label = excluded.label, source = excluded.source, primary_color = excluded.primary_color, secondary_color = excluded.secondary_color, dhash = excluded.dhash, symbol_description = excluded.symbol_description, shape = excluded.shape;`
    );
  }
}

sql.push(
  '',
  `-- Seed validation snapshot: ${BUILT_IN_BRANDS.length} brands, ${candidates.length} candidates.`,
  `do $$`,
  `declare`,
  `  brand_count integer;`,
  `  candidate_count integer;`,
  `begin`,
  `  select count(*) into brand_count from public.brands where is_builtin = true;`,
  `  select count(*) into candidate_count from public.candidates where is_builtin = true;`,
  `  if brand_count < ${BUILT_IN_BRANDS.length} then raise exception 'SentinalBrand seed expected at least ${BUILT_IN_BRANDS.length} brands, found %', brand_count; end if;`,
  `  if candidate_count < ${candidates.length} then raise exception 'SentinalBrand seed expected at least ${candidates.length} candidates, found %', candidate_count; end if;`,
  `end $$;`,
  '',
  'commit;',
  ''
);

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${sql.join('\n')}\n`, 'utf8');

console.log(`Generated ${OUTPUT}`);
console.log(`Brands: ${BUILT_IN_BRANDS.length}`);
console.log(`Candidates: ${candidates.length}`);
console.log(`Facebook candidates: ${candidates.filter((candidate) => candidate.platform === 'Facebook').length}`);
