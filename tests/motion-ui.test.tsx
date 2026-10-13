import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AnimatedNumber, ProgressFill, ViewTransition } from '../src/components/MotionUI';
import { BrandSearchModule } from '../src/components/BrandSearchModule';
import { SocialMonitoringView, AppMonitoringView } from '../src/components/OtherViews';
import { runBrandDetection } from '../src/lib/detectionEngine';
import { PROTOTYPE_CANDIDATE_DATASET } from '../src/data/candidateData';
import { INITIAL_VERIFIED_ASSETS } from '../src/data/mockData';

test('monitoring risk badges render numeric values rather than template markup', () => {
  const props = { threats: runBrandDetection('Paytm', PROTOTYPE_CANDIDATE_DATASET, INITIAL_VERIFIED_ASSETS),
    verifiedAssets: INITIAL_VERIFIED_ASSETS, takedowns: [], brand: 'Paytm',
    onInvestigate: () => {}, onOpenTakedown: () => {}, onTriggerToast: () => {} };
  for (const View of [SocialMonitoringView, AppMonitoringView]) {
    const html = renderToStaticMarkup(<View {...props} />);
    assert.ok(!html.includes('AnimatedNumber'));
    assert.match(html, /Risk <span[^>]*>[\s\S]*?class="sr-only">\d+<\/span>/);
  }
});

test('counters expose the exact final value once to assistive technology and reserve digit space', () => {
  const html = renderToStaticMarkup(<AnimatedNumber value={87} />);
  assert.match(html, /class="sr-only">87<\/span>/);
  assert.match(html, /aria-hidden="true">87<\/span>/);
  assert.match(html, /min-width:3ch/);
  assert.ok(!html.includes('aria-live'));
  assert.match(renderToStaticMarkup(<AnimatedNumber value={1000} />), /min-width:4ch/);
});

test('static/reduced-motion first render remains visible with accurate progress', () => {
  const html = renderToStaticMarkup(<ViewTransition><ProgressFill value={50} /></ViewTransition>);
  assert.ok(!html.includes('opacity:0'));
  assert.match(html, /scaleX\(0.5\)/);
});

test('scan progress identifies the active stage instead of marking it complete', () => {
  const noop = () => {};
  const html = renderToStaticMarkup(<BrandSearchModule currentBrand="Nike" threats={[]} verifiedAssets={[]}
    selectedPlatform="All" selectedRisk="All" isScanning={true} scanStep={3}
    onBrandChange={noop} onSelectPlatform={noop} onSelectRisk={noop} onInvestigate={noop}
    onOpenCharacterMatrix={noop} onOpenRegisterAsset={noop} onTriggerScan={noop} />);
  assert.match(html, /role="progressbar"[^>]*aria-valuenow="3"/);
  assert.equal((html.match(/aria-current="step"/g) || []).length, 1);
  assert.match(html, /aria-current="step"[^>]*>[\s\S]*?Social Web[\s\S]*?progress_activity/);
  assert.ok(!html.includes('animate-spin'));
  assert.ok(!html.includes('animate-ping'));
});
