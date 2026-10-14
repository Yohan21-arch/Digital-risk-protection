/** Shared, credential-free contract. No model output can contain a riskScore field. */
export const VERDICTS = ['Likely Impersonation', 'Suspicious', 'Probably Legitimate', 'Insufficient Evidence'] as const;
export interface AIThreatAnalysis {
  verdict: typeof VERDICTS[number]; confidence: number; summary: string;
  semanticAnalysis: { similarity: number | null; impersonationLanguageDetected: boolean; supportClaimDetected: boolean; officialBrandClaimDetected: boolean; suspiciousIntentDetected: boolean; explanation: string };
  keyEvidence: { signal: string; severity: 'low' | 'medium' | 'high'; explanation: string }[];
  relatedConcerns: string[]; recommendedAction: string; limitations: string[];
}
export interface InvestigationEvidence {
  brand: { name: string; description: string; handles: string[]; publishers: string[]; packages: string[] };
  candidate: { name: string; identifier: string; platform: string; type: 'social' | 'mobile app'; description: string; publisher: string; redirect: string };
  deterministic: { riskScore: number; riskCategory: string; signals: { label: string; explanation: string; points: number }[];
    nameSimilarity: number | null; handleSimilarity: number | null; descriptionSimilarity: number | null; visualSimilarity: number | null;
    publisherMatch: string; packageMatch: string; suspiciousUnicode: boolean; lookalikes: string[] };
}
export const PRINCIPLE = "Mirage's risk score is calculated by our deterministic explainable detection engine. AI operates as an investigation layer that interprets the evidence, performs semantic analysis, and helps analysts understand the threat.";
export const PROTOTYPE_NOTICE = 'This hackathon prototype uses controlled and/or simulated monitoring data where live platform monitoring integrations are unavailable.';
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid object');
  return value as Record<string, unknown>;
}
export function text(value: unknown, max = 2000): string {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid text');
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim();
}
export function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Invalid number');
  return value;
}
function boolean(value: unknown): boolean { if (typeof value !== 'boolean') throw new Error('Invalid boolean'); return value; }
export function list<T>(value: unknown, parse: (v: unknown) => T, max = 20): T[] {
  if (!Array.isArray(value) || value.length > max) throw new Error('Invalid list');
  return value.map(parse);
}
export function choice<T extends string>(value: unknown, values: readonly T[]): T {
  if (!values.includes(value as T)) throw new Error('Invalid enum'); return value as T;
}
const percent = (v: unknown) => Math.min(100, Math.max(0, number(v)));
export function parseAIAnalysis(value: unknown): AIThreatAnalysis {
  const v = object(value), s = object(v.semanticAnalysis);
  return { verdict: choice(v.verdict, VERDICTS), confidence: percent(v.confidence), summary: text(v.summary),
    semanticAnalysis: { similarity: s.similarity === null ? null : percent(s.similarity),
      impersonationLanguageDetected: boolean(s.impersonationLanguageDetected), supportClaimDetected: boolean(s.supportClaimDetected),
      officialBrandClaimDetected: boolean(s.officialBrandClaimDetected), suspiciousIntentDetected: boolean(s.suspiciousIntentDetected), explanation: text(s.explanation) },
    keyEvidence: list(v.keyEvidence, item => { const e = object(item); return { signal: text(e.signal, 200), severity: choice(e.severity, ['low', 'medium', 'high']), explanation: text(e.explanation) }; }, 12),
    relatedConcerns: list(v.relatedConcerns, item => text(item), 10), recommendedAction: text(v.recommendedAction), limitations: list(v.limitations, item => text(item), 10) };
}
export function parseEvidence(value: unknown): InvestigationEvidence {
  const v = object(value), b = object(v.brand), c = object(v.candidate), d = object(v.deterministic);
  const bounded = (v: unknown) => { const n = number(v); if (n < 0 || n > 100) throw new Error('Invalid score'); return n; };
  const optional = (v: unknown) => v === null ? null : bounded(v);
  const strings = (v: unknown) => list(v, item => text(item, 300));
  const platform = choice(c.platform, ['X', 'Instagram', 'Facebook', 'Telegram', 'Google Play', 'App Store']);
  const type = choice(c.type, ['social', 'mobile app']);
  if ((type === 'mobile app') !== ['Google Play', 'App Store'].includes(platform)) throw new Error('Invalid channel');
  const name = text(b.name, 200); if (!name) throw new Error('Missing brand');
  return { brand: { name, description: text(b.description, 4000), handles: strings(b.handles), publishers: strings(b.publishers), packages: strings(b.packages) },
    candidate: { name: text(c.name, 300), identifier: text(c.identifier, 300), platform, type, description: text(c.description, 4000), publisher: text(c.publisher, 300), redirect: text(c.redirect, 1000) },
    deterministic: { riskScore: bounded(d.riskScore), riskCategory: choice(d.riskCategory, ['Critical', 'High', 'Medium', 'Low', 'Trusted']),
      signals: list(d.signals, item => { const e = object(item); return { label: text(e.label, 200), explanation: text(e.explanation), points: number(e.points) }; }),
      nameSimilarity: optional(d.nameSimilarity), handleSimilarity: optional(d.handleSimilarity), descriptionSimilarity: optional(d.descriptionSimilarity), visualSimilarity: optional(d.visualSimilarity),
      publisherMatch: choice(d.publisherMatch, ['MATCHED', 'MISMATCH', 'UNKNOWN']), packageMatch: choice(d.packageMatch, ['MATCHED', 'MISMATCH', 'UNKNOWN']), suspiciousUnicode: boolean(d.suspiciousUnicode), lookalikes: strings(d.lookalikes) } };
}
