import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  colorSimilarity,
  hammingDistance64,
  pHashSimilarity,
  compareVisualProfiles,
  hexToRgb,
} from '../src/lib/visualIdentity';
import { runBrandDetection, calculateRisk } from '../src/lib/detectionEngine';
import { PROTOTYPE_CANDIDATE_DATASET as candidates } from '../src/data/candidateData';
import { INITIAL_VERIFIED_ASSETS as assets } from '../src/data/mockData';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { SocialMonitoringView, AppMonitoringView, BrandProfileView } from '../src/components/OtherViews';
import { DeepInvestigationModal } from '../src/components/DeepInvestigationModal';

const noop = () => {};

test('Phase 2 - 1: Color similarity and Hamming distance are mathematically deterministic and bounded', () => {
  // Exact same colors
  assert.equal(colorSimilarity('#002E6E', '#002E6E'), 100);
  assert.equal(colorSimilarity('#FFFFFF', '#ffffff'), 100);
  // Complete opposites (black vs white)
  assert.equal(colorSimilarity('#000000', '#FFFFFF'), 0);
  // Intermediate colors are bounded between 0 and 100
  const sim = colorSimilarity('#002E6E', '#00BAF2');
  assert.ok(sim > 0 && sim < 100);

  // Hamming distance
  assert.equal(hammingDistance64('a8b2c4e0f1d3e5a7', 'a8b2c4e0f1d3e5a7'), 0);
  assert.equal(hammingDistance64('0000000000000000', 'ffffffffffffffff'), 64);
  assert.equal(hammingDistance64('0000000000000001', '0000000000000000'), 1);

  // pHash similarity
  const selfMatch = pHashSimilarity('a8b2c4e0f1d3e5a7', 'a8b2c4e0f1d3e5a7');
  assert.equal(selfMatch.pHashScore, 100);
  assert.equal(selfMatch.hammingDist, 0);

  const diffMatch = pHashSimilarity('0000000000000000', 'ffffffffffffffff');
  assert.equal(diffMatch.pHashScore, 0);
  assert.equal(diffMatch.hammingDist, 64);
});

test('Phase 2 - 2: Official brand logo comparison against itself returns 100% visual score', () => {
  for (const brandKey of ['paytm', 'amazon', 'nike', 'phonepe', 'microsoft']) {
    const meta = BRAND_METADATA[brandKey];
    assert.ok(meta.officialLogo);
    assert.ok(meta.officialLogo.pHash.length === 16);
    assert.ok(meta.officialLogo.primaryColor.startsWith('#'));

    const comparison = compareVisualProfiles(meta.officialLogo, meta.officialLogo);
    assert.equal(comparison.visualScore, 100);
    assert.equal(comparison.pHashScore, 100);
    assert.equal(comparison.colorScore, 100);
    assert.equal(comparison.hammingDistance, 0);
    assert.equal(comparison.dominantColorMatch, true);
  }
});

test('Phase 2 - 3: Benign fan community preserves 0 visual score and stays below High risk', () => {
  const comm = candidates.find((c) => c.id === 'CAND-NIKE-COMMUNITY')!;
  const analysis = calculateRisk('Nike', comm, assets);
  assert.equal(analysis.category, 'Medium');
  assert.equal(analysis.calculatedScore, 50);
  assert.equal(analysis.breakdown.visualScore, 0);
});

test('Phase 2 - 4: Cloned logo impersonators reflect explainable visual score in detection analysis', () => {
  const paytmThreat = runBrandDetection('Paytm', candidates, assets).find(
    (t) => t.id === 'CAND-PAYTM-002'
  )!;
  assert.ok(paytmThreat);
  assert.ok(paytmThreat.analysis?.visualSimilarity);
  assert.ok(paytmThreat.analysis.visualSimilarity.visualScore >= 75);
  assert.ok(
    paytmThreat.explainableSignals.some((s) => s.desc.includes('Visual logo mimicry'))
  );
  assert.ok((paytmThreat.analysis.breakdown.visualScore ?? 0) > 0);
});

test('Phase 2 - 5: Controlled App Store candidates exist for demo brands and validate publisher identities', () => {
  for (const brand of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    const results = runBrandDetection(brand, candidates, assets);
    const appStoreApps = results.filter((t) => t.platform === 'App Store');
    assert.ok(
      appStoreApps.length >= 1,
      `Expected at least 1 App Store candidate for ${brand}`
    );

    // Verify official vs rogue publisher differentiation
    const officialApp = appStoreApps.find((t) => t.riskCategory === 'Trusted');
    assert.ok(officialApp, `Expected an official App Store app for ${brand}`);
    assert.equal(officialApp.riskScore, 0);

    const rogueApp = appStoreApps.find((t) => t.riskCategory !== 'Trusted');
    if (rogueApp) {
      assert.ok(
        rogueApp.analysis?.breakdown.platformOrPublisherScore! >= 15,
        'Expected publisher mismatch penalty for rogue app'
      );
    }
  }
});

test('Phase 2 - 6: Social Monitoring and App Monitoring views render rich forensic elements', () => {
  const paytmThreats = runBrandDetection('Paytm', candidates, assets);

  // Social Monitoring View
  const socialHtml = renderToStaticMarkup(
    <SocialMonitoringView
      threats={paytmThreats}
      verifiedAssets={assets}
      takedowns={[]}
      brand="Paytm"
      onInvestigate={noop}
      onOpenTakedown={noop}
      onTriggerToast={noop}
    />
  );
  assert.ok(socialHtml.includes('Social Media Impersonation Radar'));
  assert.ok(socialHtml.includes('Cloned Brand Logos'));
  assert.ok(socialHtml.includes('Bio Redirect Tunnels'));

  // App Monitoring View
  const appHtml = renderToStaticMarkup(
    <AppMonitoringView
      threats={paytmThreats}
      verifiedAssets={assets}
      takedowns={[]}
      brand="Paytm"
      onInvestigate={noop}
      onOpenTakedown={noop}
      onTriggerToast={noop}
    />
  );
  assert.ok(appHtml.includes('Rogue App &amp; APK Store Crawler') || appHtml.includes('Rogue App & APK Store Crawler'));
  assert.ok(appHtml.includes('Official Authorized Developer Baseline'));
  assert.ok(appHtml.includes('One97 Communications Ltd.'));

  // Brand Profile View with Visual Logo Anchor
  const profileHtml = renderToStaticMarkup(
    <BrandProfileView
      threats={paytmThreats}
      verifiedAssets={assets}
      takedowns={[]}
      brand="Paytm"
      onInvestigate={noop}
      onOpenTakedown={noop}
      onTriggerToast={noop}
    />
  );
  assert.ok(profileHtml.includes('Official Registered Logo Anchor'));
  assert.ok(profileHtml.includes('Live Visual Matcher Workbench'));
  assert.ok(profileHtml.includes('Perceptual Hash (dHash)'));
});

test('Phase 2 - 7: Deep Investigation Modal shows deterministic visual logo comparison', () => {
  const threat = runBrandDetection('Paytm', candidates, assets).find(
    (t) => t.id === 'CAND-PAYTM-002'
  )!;
  const modalHtml = renderToStaticMarkup(
    <DeepInvestigationModal
      threat={threat}
      onClose={noop}
      onDismiss={noop}
      onMarkTrusted={noop}
      onSaveDossier={noop}
      onConfirmTakedown={noop}
    />
  );

  assert.ok(modalHtml.includes('Visual Logo Similarity:'));
  assert.ok(modalHtml.includes('Deterministic dHash &amp; RGB delta') || modalHtml.includes('Deterministic dHash & RGB delta'));
  assert.ok(modalHtml.includes('pHash structural match:'));
});

test('Phase 2 - 8: Local official logo upload, SVG pipeline, and reference section', async () => {
  const paytmThreats = runBrandDetection('Paytm', candidates, assets);
  const profileHtml = renderToStaticMarkup(
    <BrandProfileView
      threats={paytmThreats}
      verifiedAssets={assets}
      takedowns={[]}
      brand="Paytm"
      onInvestigate={noop}
      onOpenTakedown={noop}
      onTriggerToast={noop}
    />
  );

  // 1. Verify OFFICIAL VISUAL REFERENCE section and upload button
  assert.ok(profileHtml.includes('OFFICIAL VISUAL REFERENCE'));
  assert.ok(profileHtml.includes('Local Prototype Reference'));
  assert.ok(profileHtml.includes('Upload Reference Logo'));

  // 2. Verify visual demo SVG pipeline across all 5 major brands
  for (const b of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    const brandCandidates = candidates.filter((c) => c.targetBrand.toLowerCase() === b.toLowerCase());
    const hasVisual = brandCandidates.some((c) => c.visual && c.visual.imageSrc?.startsWith('/demo-logos/'));
    assert.ok(hasVisual, `Expected at least one candidate with /demo-logos/ asset for ${b}`);
  }

  // 3. Verify file validation in computeProfileFromImageFile
  const { computeProfileFromImageFile } = await import('../src/lib/visualIdentity');
  const oversizedFile = { name: 'huge.png', type: 'image/png', size: 2 * 1024 * 1024 } as File;
  await assert.rejects(
    () => computeProfileFromImageFile(oversizedFile),
    /File exceeds maximum size of 1 MB/
  );

  const invalidTypeFile = { name: 'doc.pdf', type: 'application/pdf', size: 500 } as File;
  await assert.rejects(
    () => computeProfileFromImageFile(invalidTypeFile),
    /Unsupported format/
  );
});
