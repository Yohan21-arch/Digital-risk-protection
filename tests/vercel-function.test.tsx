import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { transformSync } from 'esbuild';

test('emitted Vercel entry and its local ESM graph load in native Node without a TS resolver', () => {
  const root = resolve(import.meta.dirname, '..');
  const cache = join(root, 'node_modules', '.cache');
  mkdirSync(cache, { recursive: true });
  const output = mkdtempSync(join(cache, 'mirage-function-'));
  try {
    writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const source of ['api/analyze-threat.ts', 'server/aiInvestigation.ts', 'src/lib/aiContract.ts']) {
      const destination = join(output, source.replace(/\.ts$/, '.js'));
      mkdirSync(resolve(destination, '..'), { recursive: true });
      // Transpile each file separately, deliberately preserving runtime imports.
      // Bundling or tsx would hide the exact production extension-resolution failure.
      const compiled = transformSync(readFileSync(join(root, source), 'utf8'), { loader: 'ts', format: 'esm', target: 'node22' });
      writeFileSync(destination, compiled.code);
    }
    writeFileSync(join(output, 'smoke.mjs'), `
      import assert from 'node:assert/strict';
      import endpoint, { handleAnalysis } from './api/analyze-threat.js';
      import { InvestigationError } from './server/aiInvestigation.js';
      assert.equal(endpoint.fetch, handleAnalysis);
      assert.equal((await endpoint.fetch(new Request('https://mirage.test/api/analyze-threat'))).status, 405);
      const request = new Request('https://mirage.test/api/analyze-threat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
      const response = await handleAnalysis(request, async () => { throw new InvestigationError(503, 'AI_NOT_CONFIGURED', 'AI not configured'); });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).code, 'AI_NOT_CONFIGURED');
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      console.log('Native Node ESM endpoint smoke passed');
    `);
    const result = execFileSync(process.execPath, [join(output, 'smoke.mjs')], { encoding: 'utf8', timeout: 20000 });
    assert.match(result, /Native Node ESM endpoint smoke passed/);
  } finally {
    // Delete only this test's checked temporary directory inside node_modules/.cache.
    assert.ok(output.startsWith(join(cache, 'mirage-function-')));
    rmSync(output, { recursive: true, force: true });
  }
});
