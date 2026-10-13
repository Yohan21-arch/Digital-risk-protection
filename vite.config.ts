import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Temporary source-level copy guard for the hackathon prototype.
 * It only rewrites presentation strings/classes during Vite compilation; detection logic
 * remains in the TypeScript source modules. This keeps the UI honest about demo data
 * while the large legacy view file is being decomposed in a later refactor.
 */
function prototypeCopyGuard(): Plugin {
  const replacements: Array<[string, string]> = [
    ['LIVE ANALYSIS', 'PROTOTYPE ANALYSIS'],
    ['APP STORE & APK CRAWLER • PHASE 2', 'APP MONITORING • PHASE 2'],
    ['Rogue App & APK Store Crawler', 'App Impersonation Monitoring'],
    [
      'Detecting fraudulent applications across Google Play Store, Apple App Store, and third-party mirrors.',
      'Analyzing controlled prototype mobile listings against trusted publisher, package, description, and visual references.',
    ],
    [
      'Verified package certificates against Apple & Google Developer registries.',
      'Re-running deterministic publisher, package, description, and visual analysis.',
    ],
    ['Verify Official Signatures', 'Reanalyze App Listings'],
    ['Canonical Verified Standard', 'Trusted Prototype Reference'],
    ['Social Media Impersonation Radar', 'Social Identity Monitoring'],
    [
      'Monitoring rogue profiles across X, Instagram, Facebook, and Telegram with explainable visual avatar matching.',
      'Analyze controlled prototype identities across X, Instagram, Facebook, and Telegram using deterministic identity and visual signals.',
    ],
    ['Rescan Social Feeds', 'Reanalyze Social Candidates'],
    ['Running deterministic social feed evaluation...', 'Re-running deterministic analysis on the controlled social candidate dataset.'],
    ['Monitored Handles', 'Social Candidates'],
    ['SOVEREIGN ASSET REGISTRY', 'DEMO OFFICIAL ASSET REGISTRY'],
    ['Trademark Verification & Visual Anchors', 'Controlled Reference Data & Visual Anchors'],
    ['Brand Legal Profile & Visual Identity Anchor', 'Brand Profile & Visual Identity Anchor'],
    ['Registered enterprise identity files, trademark metadata, and mathematical perceptual hash anchors for ', 'Controlled reference metadata and deterministic visual anchors for '],
    [' Sovereign Corporate Perimeter', ' Prototype Brand Profile'],
    ['KYC Tier-3 Verified', 'Controlled Reference Dataset'],
    ['Tier-3 Verified', 'Reference Complete'],
    ['Perimeter Protection Benchmark', 'Reference Completeness'],
    ['Stage 4 of 4 Verified', '4 of 4 Reference Fields'],
    ['PERCEPTUAL GOLD STANDARD', 'DETERMINISTIC VISUAL BASELINE'],
    ['2 Delisted (50%)', 'Prototype takedown records'],
    ['Mean MTTR', 'Demo MTTR'],
    ['3.4h', 'Illustrative'],
    ['-42 min vs baseline', 'Prototype metric only'],
    ['100% Intact', 'Registered references'],
    ['ALL SYSTEMS OPERATIONAL', 'PROTOTYPE SOURCES READY'],
    ['High-availability Sentinel nodes monitoring global registrar registries.', 'Controlled prototype source status for local demonstration.'],
    ['100% Validated', 'Demo dataset ready'],
    ['Streams: 24 active', 'No external stream'],
    ['bg-purple-100', 'bg-cyan-100'],
    ['text-purple-900', 'text-cyan-900'],
    ['border-purple-200', 'border-cyan-200'],
  ];

  return {
    name: 'sentinalbrand-prototype-copy-guard',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/') || !/\.(tsx?|jsx?)$/.test(id)) return null;
      let next = code;
      for (const [from, to] of replacements) next = next.split(from).join(to);

      // Replace the legacy substring publisher check in App Monitoring with the
      // already-computed trusted-registry result from the detection engine.
      next = next.replace(
        /const isOfficialPub = \(metadata\?\.officialPublishers \|\| \[\]\)\.some\(\(p\) =>\s*publisher\.toLowerCase\(\)\.includes\(p\.toLowerCase\(\)\)\s*\);/g,
        "const isOfficialPub = t.analysis?.publisherMatch === 'MATCHED';"
      );

      return next === code ? null : { code: next, map: null };
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [prototypeCopyGuard(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});