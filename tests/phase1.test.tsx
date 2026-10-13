import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runBrandDetection, calculateRisk, textSimilarity, hasDomainMismatch } from '../src/lib/detectionEngine';
import { PROTOTYPE_CANDIDATE_DATASET as candidates } from '../src/data/candidateData';
import { INITIAL_VERIFIED_ASSETS as assets } from '../src/data/mockData';
import { BRAND_METADATA } from '../src/data/brandMetadata';
import { BrandSearchModule } from '../src/components/BrandSearchModule';
import { DeepInvestigationModal } from '../src/components/DeepInvestigationModal';

const scan = (brand: string) => runBrandDetection(brand, candidates, assets);
const noop = () => {};
const props = {
  currentBrand: 'Paytm', onBrandChange: noop, threats: scan('Paytm'), verifiedAssets: assets,
  selectedPlatform: 'All' as const, onSelectPlatform: noop, selectedRisk: 'All' as const,
  onSelectRisk: noop, onInvestigate: noop, onOpenCharacterMatrix: noop,
  onOpenRegisterAsset: noop, onTriggerScan: noop, isScanning: false, scanStep: 0,
};
const render = (overrides = {}) => renderToStaticMarkup(<BrandSearchModule {...props} {...overrides} />);
function nodes(tree: any): any[] {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!React.isValidElement(tree)) return [];
  return [tree, ...nodes((tree.props as any).children)];
}

test('A: each demo brand stays relevant; official Paytm is Trusted / 0', () => {
  for (const brand of ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft']) {
    const results = scan(brand);
    assert.ok(results.length > 0);
    for (const result of results) assert.equal(candidates.find(c => c.id === result.id)?.targetBrand, brand);
  }
  const official = scan('Paytm').find(t => t.handleOrPkg === '@paytm')!;
  assert.equal(official.riskCategory, 'Trusted');
  assert.equal(official.riskScore, 0);
});

test('B/C: Amaz0n and Micros0ft substitutions are detected', () => {
  for (const [brand, spelling] of [['Amazon', 'Amaz0n'], ['Microsoft', 'Micros0ft']]) {
    const threat = scan(brand).find(t => t.name.includes(spelling))!;
    assert.ok(threat.analysis?.lookalikeSignals.some(s => s.original === 'o' && s.replacement === '0'));
  }
});

test('D: benign fan community and correlated name/handle signals stay below High', () => {
  const candidate = candidates.find(c => c.id === 'CAND-NIKE-COMMUNITY')!;
  const analysis = calculateRisk('Nike', candidate, assets);
  assert.equal(analysis.category, 'Medium');
  assert.equal(analysis.calculatedScore, 50);
  assert.equal(analysis.breakdown.platformOrPublisherScore, 0);
  assert.equal(analysis.breakdown.unofficialIdentityScore, 5);
  const wordingOnly = calculateRisk('Nike', { ...candidate, name: 'Nike Official Support' }, assets);
  assert.ok(wordingOnly.calculatedScore < 60);
  const multiple = calculateRisk('Nike', { ...candidate, name: 'Nike Official Support', details: { ...candidate.details, redirectTunnel: 'https://nike.example.org' } }, assets);
  assert.equal(multiple.category, 'High');
  for (const c of candidates) {
    const result = calculateRisk(c.targetBrand, c, assets);
    assert.ok(result.calculatedScore >= 0 && result.calculatedScore <= 100);
  }
});

test('domain evidence uses exact hosts/subdomains, not registrars or brand substrings', () => {
  for (const url of [undefined, '', 'invalid', 'https://nike.com', 'https://shop.nike.com', 'https://NIKE.COM./']) {
    assert.equal(hasDomainMismatch(url, ['nike.com']), false);
  }
  assert.equal(hasDomainMismatch('https://nike.com.attacker.test', ['nike.com']), true);
  assert.equal(hasDomainMismatch('https://notnike.com', ['nike.com']), true);
  assert.equal(hasDomainMismatch('https://unknown.test', []), false);
});

test('E: unsupported brand produces a true empty state', () => {
  assert.deepEqual(scan('UnrelatedZebraCompany'), []);
  const html = render({ currentBrand: 'UnrelatedZebraCompany', threats: [] });
  assert.ok(html.includes('No related identities were found in the prototype dataset.'));
  assert.ok(!html.includes('Clear filters'));
});

test('F: filter-only empty state clears both filters without changing the brand', () => {
  const changes: string[] = [];
  const custom = { ...props, threats: scan('Nike').filter(t => t.riskCategory === 'Trusted'), selectedRisk: 'Critical' as const,
    onSelectPlatform: (value: string) => changes.push('platform:' + value), onSelectRisk: (value: string) => changes.push('risk:' + value) };
  const html = render(custom);
  assert.ok(html.includes('No detections match the selected filters.'));
  assert.ok(!html.includes('No related identities were found'));
  const clear = nodes(BrandSearchModule(custom)).find(n => n.type === 'button' && n.props.children === 'Clear filters');
  clear.props.onClick();
  assert.deepEqual(changes, ['platform:All', 'risk:All']);
});

test('G: App Store filter is visible, counted, selects and filters the results', () => {
  const ios = { ...candidates.find(c => c.platform === 'Google Play' && c.targetBrand === 'Paytm')!, id: 'TEST-IOS', handleOrPkg: 'test.ios.paytm', platform: 'App Store' as const };
  const results = runBrandDetection('Paytm', [...candidates, ios], assets);
  const count = results.filter(t => t.platform === 'App Store').length;
  assert.ok(count > 0);
  let selected = '';
  const tree = BrandSearchModule({ ...props, threats: results, onSelectPlatform: value => { selected = value; } });
  const button = nodes(tree).find(n => n.type === 'button' && n.props.children === 'App Store (' + count + ')');
  assert.ok(button);
  button.props.onClick();
  assert.equal(selected, 'App Store');
  const html = render({ threats: results, selectedPlatform: 'App Store' });
  for (const result of results) assert.equal(html.includes(result.handleOrPkg), result.platform === 'App Store');
});

test('H: adding a trusted candidate to the registry makes subsequent scans risk 0', () => {
  const threat = scan('Amazon').find(t => t.riskCategory !== 'Trusted')!;
  const updated = [...assets, { id: 'TEST-TRUSTED', name: threat.name, identifier: threat.handleOrPkg,
    type: threat.platform + ' Endpoint', legalEntity: 'Amazon Verified Exception', status: 'ANCHOR ACTIVE' as const, registeredDate: '2026-10-13' }];
  const rescanned = runBrandDetection('Amazon', candidates, updated).find(t => t.id === threat.id)!;
  assert.equal(rescanned.riskScore, 0);
  assert.equal(rescanned.riskCategory, 'Trusted');
});

test('description similarity is deterministic, variable, bounded, and visible in investigation', () => {
  assert.equal(textSimilarity('', ''), 0);
  assert.equal(textSimilarity('PAYMENTS payments, Wallet!', 'wallet payments'), 100);
  assert.equal(textSimilarity('a b', 'b c'), 33);
  assert.equal(textSimilarity('football boots', 'payments wallet'), 0);
  const app = candidates.find(c => c.platform === 'Google Play' && c.targetBrand === 'Amazon')!;
  const identical = { ...app, summary: BRAND_METADATA.amazon.appDescription };
  const high = calculateRisk('Amazon', identical, assets);
  const low = calculateRisk('Amazon', { ...app, summary: 'football boots' }, assets);
  assert.equal(high.descriptionSimilarity, 100);
  assert.equal(high.breakdown.handleScore, 15);
  assert.equal(low.descriptionSimilarity, 0);
  assert.equal(low.breakdown.handleScore, 0);
  const threat = runBrandDetection('Amazon', [identical], assets)[0];
  const html = renderToStaticMarkup(<DeepInvestigationModal threat={threat} onClose={noop} onDismiss={noop} onMarkTrusted={noop} onSaveDossier={noop} onConfirmTakedown={noop} />);
  assert.match(html, /Description Similarity.*100%/);
});

test('verified registry total remains separate from matched scan count; networks are dynamic', () => {
  const tree = BrandSearchModule({ ...props, threats: [] });
  const section: any = nodes(tree).find(n => n.type === 'section');
  const htmls = React.Children.toArray(section.props.children).filter(React.isValidElement).map(n => renderToStaticMarkup(n));
  const verified = htmls.find(h => h.includes('Verified Assets'))!;
  assert.match(verified, new RegExp('>\\s*' + assets.length + '\\s*</span>'));
  assert.ok(verified.includes('0 matched in this scan'));
  assert.match(htmls.find(h => h.includes('Networks Indexed'))!, />\s*0\s*<\/span>/);
});