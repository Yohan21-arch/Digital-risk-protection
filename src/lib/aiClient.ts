import { parseAIAnalysis, type InvestigationEvidence } from './aiContract';
export async function requestInvestigation(evidence: InvestigationEvidence, signal: AbortSignal, fetcher = fetch) {
  const response = await fetcher('/api/analyze-threat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evidence), signal });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('AI endpoint unavailable. Use the Vercel deployment or vercel dev. Deterministic results remain available.');
  const body = await response.json();
  if (!response.ok) {
    const messages: Record<string, string> = { AI_NOT_CONFIGURED: 'AI is not configured. Set GEMINI_API_KEY on the server.', AI_TIMEOUT: 'AI analysis timed out. Please retry.', AI_RATE_LIMIT: 'AI rate limit reached. Please retry later.', INVALID_AI_RESPONSE: 'AI returned invalid analysis. Please retry.', INVALID_REQUEST: 'Investigation evidence is invalid.' };
    throw new Error(messages[body?.code] || 'AI service unavailable. Please retry.');
  }
  try { return parseAIAnalysis(body.analysis); } catch { throw new Error('AI returned invalid analysis. Please retry.'); }
}
