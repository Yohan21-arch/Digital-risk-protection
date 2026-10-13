import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { monitoringResults, monitoringMetrics, resolveNavigation, isApp, isSocial } from '../src/lib/monitoring';
import { MonitoringView } from '../src/components/MonitoringView';
import { Sidebar } from '../src/components/Sidebar';
import { runBrandDetection } from '../src/lib/detectionEngine';
import { PROTOTYPE_CANDIDATE_DATASET } from '../src/data/candidateData';
import { INITIAL_VERIFIED_ASSETS } from '../src/data/mockData';
const threats = runBrandDetection('Paytm', PROTOTYPE_CANDIDATE_DATASET, INITIAL_VERIFIED_ASSETS);
const noop = () => {};
test('Monitoring combines channels once, sorts by severity then score, and does not mutate results', () => {
  const before = JSON.stringify(threats);
  const all = monitoringResults(threats, 'All');
  assert.equal(all.length, threats.filter(t => isApp(t) || isSocial(t)).length);
  assert.equal(new Set(all.map(t => t.id)).size, all.length);
  const severity = ['Trusted', 'Low', 'Medium', 'High', 'Critical'];
  for (let i = 1; i < all.length; i++) {
    assert.ok(severity.indexOf(all[i-1].riskCategory) >= severity.indexOf(all[i].riskCategory));
    if (all[i-1].riskCategory === all[i].riskCategory) assert.ok(all[i-1].riskScore >= all[i].riskScore);
  }
  assert.equal(JSON.stringify(threats), before);
  assert.ok(all.every(t => threats.includes(t)));
});
test('Monitoring composes search, risk and platform filters and derives channel metrics', () => {
  for (const channel of ['All', 'Social Accounts', 'Mobile Apps'] as const) {
    const results = monitoringResults(threats, channel);
    const metrics = monitoringMetrics(results);
    assert.equal(metrics['Total Monitored'], results.length);
    assert.equal(metrics['Social Accounts'] + metrics['Mobile Apps'], results.length);
    assert.equal(metrics.Platforms, new Set(results.map(t => t.platform)).size);
    if (channel === 'Social Accounts') assert.equal(metrics['Mobile Apps'], 0);
    if (channel === 'Mobile Apps') assert.equal(metrics['Social Accounts'], 0);
  }
  const app = threats.find(t => t.platform === 'App Store')!;
  assert.ok(app);
  assert.deepEqual(monitoringResults(threats, 'Mobile Apps', 'App Store', app.riskCategory, app.handleOrPkg), [app]);
  assert.equal(monitoringResults(threats, 'Social Accounts', 'All', 'All', 'no-such-candidate-9876').length, 0);
  assert.equal(monitoringMetrics([]).Platforms, 0);
});
test('legacy navigation selects the correct Monitoring channel', () => {
  assert.deepEqual(resolveNavigation('Social Monitoring'), { tab: 'Monitoring', channel: 'Social Accounts' });
  assert.deepEqual(resolveNavigation('App Monitoring'), { tab: 'Monitoring', channel: 'Mobile Apps' });
  assert.deepEqual(resolveNavigation('Detection Center'), { tab: 'Detection Center' });
  const html = renderToStaticMarkup(<Sidebar currentTab="Monitoring" onTabChange={noop} threatCount={0} isCollapsed={false} onToggleCollapse={noop} />);
  assert.ok(html.includes('title="Monitoring"'));
  assert.ok(!html.includes('Social Monitoring') && !html.includes('App Monitoring'));
});
test('unified Monitoring exposes accessible channels, independent signals and accurate empty states', () => {
  const html = renderToStaticMarkup(<MonitoringView threats={threats} brand="Paytm" onInvestigate={noop} onOpenTakedown={noop} />);
  assert.equal((html.match(/role="tab"/g) || []).length, 3);
  for (const text of ['Social Account', 'Mobile App', 'Publisher Match:', 'Package Match:', 'Description Text Match:', 'Visual Similarity:', 'Impersonation signals', 'Deep Investigation']) assert.ok(html.includes(text), text);
  const empty = renderToStaticMarkup(<MonitoringView threats={[]} brand="New brand" onInvestigate={noop} onOpenTakedown={noop} />);
  assert.ok(empty.includes('No monitoring candidates match'));
});
