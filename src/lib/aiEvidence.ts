import type { ThreatItem } from '../types';
import type { BrandMetadataEntry } from '../data/brandMetadata';
import { type AIThreatAnalysis, type InvestigationEvidence, parseEvidence, PRINCIPLE, PROTOTYPE_NOTICE } from './aiContract';
/** Explicit allowlist: no application state, credentials, images, or infrastructure metadata. */
export function buildInvestigationEvidence(brand: string, threat: ThreatItem, metadata?: BrandMetadataEntry): InvestigationEvidence {
  const a = threat.analysis;
  return parseEvidence({ brand: { name: brand, description: metadata?.appDescription || '', handles: metadata?.officialHandles.map(h => `${h.platform}: ${h.handle}`) || [], publishers: metadata?.officialPublishers || [], packages: metadata?.officialPackages || [] },
    candidate: { name: threat.name, identifier: threat.handleOrPkg, platform: threat.platform, type: ['Google Play', 'App Store'].includes(threat.platform) ? 'mobile app' : 'social', description: threat.summary, publisher: threat.details?.publisher || '', redirect: threat.details?.redirectTunnel || '' },
    deterministic: { riskScore: threat.riskScore, riskCategory: threat.riskCategory,
      signals: threat.explainableSignals.map(s => ({ label: s.label, explanation: s.desc, points: s.score })), nameSimilarity: a?.nameSimilarity ?? null, handleSimilarity: a?.handleSimilarity ?? null, descriptionSimilarity: a?.descriptionSimilarity ?? null,
      visualSimilarity: a?.visualSimilarity?.status === 'available' ? a.visualSimilarity.visualScore : null, publisherMatch: a?.publisherMatch ?? 'UNKNOWN', packageMatch: a?.packageMatch ?? 'UNKNOWN', suspiciousUnicode: a?.hasSuspiciousUnicode ?? false,
      lookalikes: a?.lookalikeSignals.filter(s => s.detected).map(s => `${s.technique}: ${s.original} -> ${s.replacement}`) || [] } });
}
export function investigationReport(e: InvestigationEvidence, a: AIThreatAnalysis): string {
  return ['MIRAGE INVESTIGATION REPORT', `Brand: ${e.brand.name}`, `Candidate: ${e.candidate.name}`, `Identifier: ${e.candidate.identifier}`, `Platform: ${e.candidate.platform}`, `Candidate Type: ${e.candidate.type}`, '', PRINCIPLE,
    '', 'DETERMINISTIC ASSESSMENT', `Risk Score: ${e.deterministic.riskScore}/100`, `Risk Category: ${e.deterministic.riskCategory}`,
    ...e.deterministic.signals.map(s => `- ${s.label} (${s.points} pts): ${s.explanation}`),
    `Computed comparisons: ${JSON.stringify({ name: e.deterministic.nameSimilarity, handle: e.deterministic.handleSimilarity, description: e.deterministic.descriptionSimilarity, visual: e.deterministic.visualSimilarity, publisherMatch: e.deterministic.publisherMatch, packageMatch: e.deterministic.packageMatch })}`,
    '', 'AI INVESTIGATION', `AI Verdict: ${a.verdict}`, `AI Confidence: ${a.confidence}% (not a risk score)`, a.summary,
    '', 'AI SEMANTIC FINDINGS', `Semantic similarity: ${a.semanticAnalysis.similarity === null ? 'Unavailable' : a.semanticAnalysis.similarity + '%'}`, a.semanticAnalysis.explanation,
    `Impersonation language: ${a.semanticAnalysis.impersonationLanguageDetected}; support claim: ${a.semanticAnalysis.supportClaimDetected}; official-brand claim: ${a.semanticAnalysis.officialBrandClaimDetected}; suspicious intent: ${a.semanticAnalysis.suspiciousIntentDetected}`,
    '', 'KEY EVIDENCE', ...a.keyEvidence.map(s => `- [${s.severity}] ${s.signal}: ${s.explanation}`), '', 'RELATED CONCERNS', ...a.relatedConcerns.map(c => `- ${c}`),
    '', 'RECOMMENDED ANALYST ACTION', a.recommendedAction, '', 'LIMITATIONS', 'AI findings may be incorrect. Human verification is required; no live ownership or platform verification was performed.', ...a.limitations.map(l => `- ${l}`), '', 'PROTOTYPE NOTICE', PROTOTYPE_NOTICE].join('\n');
}
