import { analyzeThreat, InvestigationError } from '../server/aiInvestigation.js';
const LIMIT = 24000;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
/** Vercel Node Web Handler. No credentials or provider error bodies are returned. */
export async function handleAnalysis(request: Request, analyze = analyzeThreat): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Cross-origin requests are not allowed.' }, 403);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) return json({ error: 'Use application/json.' }, 415);
  if (Number(request.headers.get('content-length')) > LIMIT) return json({ error: 'Evidence is too large.' }, 413);
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Evidence is required.' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > LIMIT) { await reader.cancel(); return json({ error: 'Evidence is too large.' }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let body: unknown;
    try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({ error: 'Invalid JSON evidence.' }, 400); }
    return json({ analysis: await analyze(body) });
  } catch (error) {
    if (error instanceof InvestigationError) return json({ error: error.message, code: error.code }, error.status);
    return json({ error: 'AI investigation unavailable. Please retry.' }, 502);
  }
}
export default { fetch: handleAnalysis };
