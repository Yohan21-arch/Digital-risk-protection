import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BUILT_IN_BRANDS } from '../src/data/brandCatalog';
import { PROTOTYPE_CANDIDATE_DATASET } from '../src/data/candidateData';
import { PHASE35_SUPPLEMENTAL_CANDIDATES } from '../src/data/phase35SupplementalCandidates';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { runBrandDetection } from '../src/lib/detectionEngine';
import { INITIAL_VERIFIED_ASSETS } from '../src/data/mockData';
import { mergeCandidateSets, normalizeRuntimeCandidate } from '../src/lib/runtimeCandidates';

const combined = [...PROTOTYPE_CANDIDATE_DATASET, ...PHASE35_SUPPLEMENTAL_CANDIDATES];
const riskFor = (brand: string, id: string) =>
  runBrandDetection(brand, combined, INITIAL_VERIFIED_ASSETS).find((item) => item.id === id);

test('Phase 3.5 - 1: catalog includes at least 20 unique protected brands', () => {
  assert.ok(BUILT_IN_BRANDS.length >= 20);
  assert.equal(new Set(BUILT_IN_BRANDS.map((brand) => brand.toLowerCase())).size, BUILT_IN_BRANDS.length);
});

test('Phase 3.5 - 2: expanded dataset stays within hackathon target size', () => {
  assert.ok(combined.length >= 130);
  assert.ok(combined.length < 250);
});

test('Phase 3.5 - 3: every protected brand has useful official and non-official coverage', () => {
  for (const brand of BUILT_IN_BRANDS) {
    const candidates = combined.filter((candidate) => candidate.targetBrand === brand);
    assert.ok(candidates.length >= 5, `${brand} has only ${candidates.length} candidates`);
    assert.ok(candidates.some((candidate) => candidate.isKnownOfficial === true), `${brand} lacks an official reference`);
    assert.ok(candidates.some((candidate) => candidate.isKnownOfficial !== true), `${brand} lacks non-official monitoring candidates`);
  }
});

test('Phase 3.5 - 4: every supported platform is represented and Facebook coverage reaches target', () => {
  const platforms = new Set(combined.map((candidate) => candidate.platform));
  for (const platform of ['X', 'Instagram', 'Facebook', 'Telegram', 'Google Play', 'App Store', 'Web Domain']) {
    assert.ok(platforms.has(platform as any), `Missing ${platform}`);
  }
  assert.ok(combined.filter((candidate) => candidate.platform === 'Facebook').length >= 10);
});

test('Phase 3.5 - 5: official candidates remain trusted at risk 0', () => {
  for (const brand of BUILT_IN_BRANDS) {
    const official = combined.find((candidate) => candidate.targetBrand === brand && candidate.isKnownOfficial === true);
    assert.ok(official, `${brand} lacks an official candidate`);
    const result = riskFor(brand, official!.id);
    assert.ok(result, `${brand} official candidate was not scanned`);
    assert.equal(result!.riskScore, 0);
    assert.equal(result!.riskCategory, 'Trusted');
  }
});

test('Phase 3.5 - 6: selected benign communities remain below High', () => {
  const benignCases: Array<[string, string]> = [
    ['Nike', 'CAND-NIKE-COMMUNITY'],
    ['Google Pay', 'CAND-GPAY-007'],
    ['HDFC Bank', 'CAND-HDFC-006'],
    ['Flipkart', 'CAND-FLIP-006'],
    ['Netflix', 'CAND-NETFLIX-FB-COMMUNITY'],
    ['Spotify', 'CAND-SPOTIFY-FB-COMMUNITY'],
  ];
  for (const [brand, id] of benignCases) {
    const result = riskFor(brand, id);
    assert.ok(result, `${id} missing from ${brand} scan`);
    assert.ok(['Trusted', 'Low', 'Medium'].includes(result!.riskCategory), `${id} escalated to ${result!.riskCategory}`);
  }
});

test('Phase 3.5 - 7: candidate IDs are unique', () => {
  const ids = combined.map((candidate) => candidate.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('Phase 3.5 - 8: expanded suspicious web-domain scenarios use reserved test domains', () => {
  const newBrandSet = new Set(BUILT_IN_BRANDS.slice(5));
  const webCandidates = combined.filter(
    (candidate) => candidate.platform === 'Web Domain' && newBrandSet.has(candidate.targetBrand)
  );
  assert.ok(webCandidates.length >= 15);
  for (const candidate of webCandidates) {
    assert.match(candidate.handleOrPkg, /\.test$/i, `${candidate.id} should use a reserved .test domain`);
  }
});

test('Phase 3.5 - 9: brand metadata exists for every protected brand', () => {
  const normalize = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const brand of BUILT_IN_BRANDS) {
    assert.ok(BRAND_METADATA[normalize(brand)], `Missing metadata for ${brand}`);
  }
});

test('Phase 3.5 - 10: runtime candidates still merge without overwriting built-in IDs', () => {
  const local = normalizeRuntimeCandidate({
    id: 'LOCAL-PHASE35-MERGE',
    targetBrand: 'Spotify',
    name: 'Spotify Local Test Candidate',
    handleOrPkg: '@spotify_local_demo',
    platform: 'Instagram',
  });
  const merged = mergeCandidateSets(combined, [local]);
  assert.equal(merged.length, combined.length + 1);
  assert.equal(merged.find((candidate) => candidate.id === local.id)?.targetBrand, 'Spotify');
  assert.throws(
    () => normalizeRuntimeCandidate({
      id: combined[0].id,
      targetBrand: 'Paytm',
      name: 'Collision',
      handleOrPkg: '@collision',
      platform: 'X',
    }),
    /reserved by the built-in demo dataset/
  );
});
