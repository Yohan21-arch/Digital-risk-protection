import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  colorSimilarity,
  hammingDistance64,
  pHashSimilarity,
  compareVisualProfiles,
} from '../src/lib/visualIdentity';
import {
  runBrandDetection,
  calculateRisk,
  isOfficialPublisher,
  isOfficialPackage,
  normalizePublisherName,
} from '../src/lib/detectionEngine';
import { PROTOTYPE_CANDIDATE_DATASET as candidates } from '../src/data/candidateData';
import { INITIAL_VERIFIED_ASSETS as assets } from '../src/data/mockData';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { SocialMonitoringView, AppMonitoringView, BrandProfileView } from '../src/components/OtherViews';
import { DeepInvestigationModal } from '../src/components/DeepInvestigationModal';

const noop = () => {};

test('Phase 2 - 1: Color and hash similarity remain deterministic and bounded', () => {
  assert.equal(colorSimilarity('#002E6E', '#002E6E'), 100);
  assert.equal(colorSimilarity('#FFFFFF', '#ffffff'), 100);
  assert.equal(colorSimilarity('#000000', '#FFFFFF'), 0);
  const sim = colorSimilarity('#002E6E', '#00BAF2');
  assert.ok(sim > 0 && sim < 100);

  assert.equal(hammingDistance64('a8b2c4e0f1d3e5a7', 'a8b2c4e0f1d3e5a7'), 0);
  assert.equal(hammingDistance64('0000000000000000', 'ffffffffffffffff'), 64);
  assert.equal(hammingDistance64('0000000000000001', '0000000000000000'), 1);

  const selfMatch = pHashSimilarity('a8b2c4e0f1d3e5a7', 'a8b2c4e0f1d3e5a7');
  assert.equal(selfMatch.pHashScore, 100);
  assert.equal(selfMatch.hammingDist, 0);
});

test('Phase 2 - 2: Visual profile self-comparison is available and returns 100%', () => {
  for (const brandKey of ['paytm', 'amazon', 'nike', 'phonepe', 'microsoft']) {
    const logo = BRAND_METADATA[brandKey].officialLogo;
    const comparison = compareVisualProfiles(logo, logo);
    assert.equal(comparison.status, 'available');
    assert.equal(comparison.visualScore, 100);
    assert.equal(comparison.pHashScore, 100);
    assert.equal(comparison.colorScore, 100);
    assert.equal(comparison.hammingDistance, 0);
  }
});

test('Phase 2 - 3: Missing visual profile is unavailable and contributes no visual evidence', () => {
  const result = compareVisualProfiles(undefined, BRAND_METADATA.paytm.officialLogo);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.visualScore, 0);
  assert.match(result.explanation, /unavailable/i);
});

test('Phase 2 - 4: Benign Nike community remains below High risk', () => {
  const community = candidates.find((c) => c.id === 'CAND-NIKE-COMMUNITY')!;
  const analysis = calculateRisk('Nike', community, assets);
  assert.notEqual(analysis.category, 'High');
  assert.notEqual(analysis.category, 'Critical');
  assert.equal(analysis.breakdown.visualScore, 0);
});

test('Phase 2 - 5: Cloned visual identity adds an explainable deterministic signal', () => {
  const threat = runBrandDetection('Paytm', candidates, assets).find((t) => t.id === 'CAND-PAYTM-002')!;
  assert.ok(threat.analysis?.visualSimilarity);
  assert.equal(threat.analysis!.visualSimilarity!.status, 'available');
  assert.ok(threat.analysis!.visualSimilarity!.visualScore >= 75);
  assert.ok(threat.explainableSignals.some((signal) => /Visual logo resemblance/i.test(signal.desc)));
  assert.ok((threat.analysis!.breakdown.visualScore ?? 0) > 0);
});

test('Phase 2 - 6: Trusted official assets remain Risk 0', () => {
  for (const brand of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    const trusted = runBrandDetection(brand, candidates, assets).find((item) => item.riskCategory === 'Trusted');
    assert.ok(trusted, `Expected a trusted candidate for ${brand}`);
    assert.equal(trusted!.riskScore, 0);
  }
});

test('Phase 2 - 7: Publisher matching uses normalized exact equality, not substring matching', () => {
  const official = BRAND_METADATA.paytm.officialPublishers;
  assert.equal(normalizePublisherName('One97 Communications Ltd.'), normalizePublisherName('One97 Communications Ltd'));
  assert.equal(isOfficialPublisher('One97 Communications Ltd.', official), true);
  assert.equal(isOfficialPublisher('One97 Communications Ltd', official), true);
  assert.equal(isOfficialPublisher('Fake One97 Communications Ltd Support', official), false);
});

test('Phase 2 - 8: Package matching requires exact normalized registry membership', () => {
  const official = BRAND_METADATA.paytm.officialPackages;
  assert.equal(isOfficialPackage('net.one97.paytm', official), true);
  assert.equal(isOfficialPackage('bundle: net.one97.paytm', official), true);
  assert.equal(isOfficialPackage('com.paytm.rewards.bonus', official), false);
});

test('Phase 2 - 9: App Store prototype candidates remain available for every demo brand', () => {
  for (const brand of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    const appStoreApps = runBrandDetection(brand, candidates, assets).filter((item) => item.platform === 'App Store');
    assert.ok(appStoreApps.length >= 1, `Expected App Store candidate for ${brand}`);
    const trusted = appStoreApps.find((item) => item.riskCategory === 'Trusted');
    assert.ok(trusted, `Expected trusted App Store candidate for ${brand}`);
    assert.equal(trusted!.riskScore, 0);
  }
});

test('Phase 2 - 10: Existing Social and App Monitoring surfaces still render', () => {
  const threats = runBrandDetection('Paytm', candidates, assets);
  const common = {
    threats,
    verifiedAssets: assets,
    takedowns: [],
    brand: 'Paytm',
    onInvestigate: noop,
    onOpenTakedown: noop,
    onTriggerToast: noop,
  };

  const socialHtml = renderToStaticMarkup(<SocialMonitoringView {...common} />);
  assert.ok(socialHtml.includes('Cloned Brand Logos'));
  assert.ok(socialHtml.includes('Bio Redirect Tunnels'));

  const appHtml = renderToStaticMarkup(<AppMonitoringView {...common} />);
  assert.ok(appHtml.includes('Official Authorized Developer Baseline'));
  assert.ok(appHtml.includes('One97 Communications Ltd.'));
});

test('Phase 2 - 11: Brand Profile keeps local reference upload controls', async () => {
  const threats = runBrandDetection('Paytm', candidates, assets);
  const profileHtml = renderToStaticMarkup(
    <BrandProfileView
      threats={threats}
      verifiedAssets={assets}
      takedowns={[]}
      brand="Paytm"
      onInvestigate={noop}
      onOpenTakedown={noop}
      onTriggerToast={noop}
    />
  );

  assert.ok(profileHtml.includes('OFFICIAL VISUAL REFERENCE'));
  assert.ok(profileHtml.includes('Upload Reference Logo'));

  for (const brand of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    assert.ok(
      candidates.some((candidate) =>
        candidate.targetBrand.toLowerCase() === brand.toLowerCase() &&
        candidate.visual?.imageSrc?.startsWith('/demo-logos/')
      )
    );
  }

  const { computeProfileFromImageFile } = await import('../src/lib/visualIdentity');
  const oversized = { name: 'huge.png', type: 'image/png', size: 2 * 1024 * 1024 } as File;
  await assert.rejects(() => computeProfileFromImageFile(oversized), /maximum size of 1 MB/);

  const invalid = { name: 'doc.pdf', type: 'application/pdf', size: 500 } as File;
  await assert.rejects(() => computeProfileFromImageFile(invalid), /Unsupported format/);
});

test('Phase 2 - 12: Deep Investigation shows side-by-side visual and registry evidence', () => {
  const threat = runBrandDetection('Paytm', candidates, assets).find((item) => item.id === 'CAND-PAYTM-002')!;
  const html = renderToStaticMarkup(
    <DeepInvestigationModal
      threat={threat}
      onClose={noop}
      onDismiss={noop}
      onMarkTrusted={noop}
      onSaveDossier={noop}
      onConfirmTakedown={noop}
    />
  );

  assert.ok(html.includes('Visual Identity Comparison'));
  assert.ok(html.includes('Structural dHash Match'));
  assert.ok(html.includes('Hamming Distance'));
  assert.ok(html.includes('Color Similarity'));
  assert.ok(html.includes('Prototype Infrastructure Metadata'));
});
