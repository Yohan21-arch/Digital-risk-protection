import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RuntimeRegistryPanel } from '../src/components/RuntimeRegistryPanel';
import { CandidateIntakePanel } from '../src/components/CandidateIntakePanel';
import {
  normalizeRuntimeProfile,
  runtimeProfileFromMetadata,
} from '../src/lib/runtimeRegistry';
import {
  mergeCandidateSets,
  normalizeRuntimeCandidate,
  parseCandidateImport,
} from '../src/lib/runtimeCandidates';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { PROTOTYPE_CANDIDATE_DATASET as candidates } from '../src/data/candidateData';

const noop = () => {};

test('Phase 3 - 1: runtime brand profile normalization is deterministic', () => {
  const normalized = normalizeRuntimeProfile({
    domains: ['HTTPS://PAYTM.COM/', 'paytm.com', ' paytmbank.com '],
    appDescription: '  Official reference description  ',
    officialPublishers: ['One97 Communications Ltd.', 'One97 Communications Ltd.'],
    officialPackages: ['net.one97.paytm', ' net.one97.paytm '],
    officialHandles: [
      { platform: 'X', handle: '@paytm' },
      { platform: 'X', handle: '@paytm' },
    ],
  });

  assert.deepEqual(normalized.domains, ['paytm.com', 'paytmbank.com']);
  assert.equal(normalized.appDescription, 'Official reference description');
  assert.deepEqual(normalized.officialPublishers, ['One97 Communications Ltd.']);
  assert.deepEqual(normalized.officialPackages, ['net.one97.paytm']);
  assert.deepEqual(normalized.officialHandles, [{ platform: 'X', handle: '@paytm' }]);
});

test('Phase 3 - 2: built-in metadata can be represented as an editable runtime profile', () => {
  const profile = runtimeProfileFromMetadata(BRAND_METADATA.paytm);
  assert.ok(profile.domains.includes('paytm.com'));
  assert.ok(profile.officialPublishers.length > 0);
  assert.ok(profile.officialPackages.length > 0);
  assert.ok(profile.officialHandles.some((item) => item.handle.toLowerCase() === '@paytm'));
});

test('Phase 3 - 3: controlled candidate JSON import validates and normalizes entries', () => {
  const imported = parseCandidateImport(JSON.stringify({
    id: 'LOCAL-PHASE3-001',
    targetBrand: 'Paytm',
    name: 'Paytm Help Desk Rewards',
    handleOrPkg: '@paytm_rewards_help',
    platform: 'Instagram',
    summary: 'Claim cashback rewards through a verification portal.',
    details: { publisher: 'Unknown operator' },
  }));

  assert.equal(imported.length, 1);
  assert.equal(imported[0].id, 'LOCAL-PHASE3-001');
  assert.equal(imported[0].platform, 'Instagram');
  assert.equal(imported[0].details.publisher, 'Unknown operator');
});

test('Phase 3 - 4: unsupported platforms and reserved built-in IDs are rejected', () => {
  assert.throws(
    () => normalizeRuntimeCandidate({
      id: 'LOCAL-BAD-PLATFORM',
      targetBrand: 'Paytm',
      name: 'Paytm Something',
      handleOrPkg: '@paytm_something',
      platform: 'Unknown Network',
    }),
    /Unsupported platform/
  );

  const reserved = candidates[0].id;
  assert.throws(
    () => normalizeRuntimeCandidate({
      id: reserved,
      targetBrand: 'Paytm',
      name: 'Collision',
      handleOrPkg: '@collision',
      platform: 'X',
    }),
    /reserved by the built-in demo dataset/
  );
});

test('Phase 3 - 5: candidate merge is ID-stable and supports updates', () => {
  const first = normalizeRuntimeCandidate({
    id: 'LOCAL-MERGE-001',
    targetBrand: 'Paytm',
    name: 'Original',
    handleOrPkg: '@original',
    platform: 'X',
  });
  const replacement = { ...first, name: 'Updated' };
  const merged = mergeCandidateSets([first], [replacement]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].name, 'Updated');
});

test('Phase 3 - 6: registry and candidate intake panels render judge-facing controls', () => {
  const registryHtml = renderToStaticMarkup(
    <RuntimeRegistryPanel brand="Paytm" onToast={noop} />
  );
  assert.ok(registryHtml.includes('PHASE 3 • LOCAL BRAND REGISTRY'));
  assert.ok(registryHtml.includes('Save Registry'));
  assert.ok(registryHtml.includes('Official Packages / Bundle IDs'));

  const intakeHtml = renderToStaticMarkup(<CandidateIntakePanel onToast={noop} />);
  assert.ok(intakeHtml.includes('PHASE 3 • CANDIDATE INTAKE'));
  assert.ok(intakeHtml.includes('Import Candidates'));
  assert.ok(intakeHtml.includes('Load Sample'));
});
