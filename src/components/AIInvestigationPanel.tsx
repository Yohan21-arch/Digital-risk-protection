import React, { useEffect, useRef, useState } from 'react';
import { BRAND_METADATA } from '../data/brandMetadata';
import { toAlphaNumeric } from '../lib/detectionEngine';
import { buildInvestigationEvidence, investigationReport } from '../lib/aiEvidence';
import { requestInvestigation } from '../lib/aiClient';
import { type AIThreatAnalysis, type InvestigationEvidence, PRINCIPLE } from '../lib/aiContract';
import type { ThreatItem } from '../types';
import { ViewTransition } from './MotionUI';

export function AIInvestigationPanel({ brand, threat }: { brand: string; threat: ThreatItem }) {
  const [result, setResult] = useState<{ analysis: AIThreatAnalysis; evidence: InvestigationEvidence } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  const supported = threat.platform !== 'Web Domain' && Boolean(brand.trim());
  async function analyze() {
    if (pending.current) return;
    const controller = new AbortController(); pending.current = controller;
    setLoading(true); setError(''); setReportStatus('');
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const evidence = buildInvestigationEvidence(brand, threat, BRAND_METADATA[toAlphaNumeric(brand)]);
      const analysis = await requestInvestigation(evidence, controller.signal);
      if (!controller.signal.aborted) setResult({ analysis, evidence });
    } catch (err) {
      setError(controller.signal.aborted ? 'AI analysis timed out or was cancelled. Please retry.' : err instanceof Error ? err.message : 'AI analysis failed. Please retry.');
    } finally { clearTimeout(timer); pending.current = null; setLoading(false); }
  }
  async function copy() {
    if (!result) return;
    try { await navigator.clipboard.writeText(investigationReport(result.evidence, result.analysis)); setReportStatus('Report copied.'); }
    catch { setReportStatus('Clipboard unavailable. Download the text report instead.'); }
  }
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([investigationReport(result.evidence, result.analysis)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'SentinalBrand-investigation.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setReportStatus('Report downloaded.');
  }
  return <section className="border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-5 bg-[#f9f9f8] min-w-0 break-words" aria-label="AI Investigation">
    <h3 className="font-['Noto_Serif',serif] font-bold text-base">AI Investigation</h3>
    <p className="text-xs text-[#515f74] mt-2">{PRINCIPLE}</p>
    <div className="mt-3 p-3 bg-white border border-[#c2c7ca]/60 rounded-lg text-sm">
      <strong>SentinalBrand Risk: {threat.riskScore} / 100 · {threat.riskCategory}</strong>
      <p className="text-xs text-[#515f74]">Authoritative deterministic assessment</p>
    </div>
    <p className="text-xs text-[#515f74] mt-3">On request, relevant candidate text, brand references and computed signals are sent to Gemini. AI findings support human review and do not change risk points.</p>
    {!supported ? <p className="mt-3 text-xs text-[#515f74]">AI investigation requires a selected brand and a social account or mobile app candidate. Deterministic investigation remains available.</p> : <button disabled={loading} onClick={analyze} className="mt-3 px-4 py-2 bg-[#0f2930] text-white rounded-lg text-xs font-semibold disabled:opacity-60">{loading ? 'Analyzing evidence…' : error ? 'Retry AI Analysis' : result ? 'Analyze Again' : 'Analyze with AI'}</button>}
    {loading && <ViewTransition><p role="status" className="text-xs text-[#004b73] mt-3">Semantic analysis and evidence correlation in progress. Generating investigation…</p></ViewTransition>}
    {error && <p role="alert" className="mt-3 text-sm text-amber-800">{error} Deterministic results are unchanged.</p>}
    {result && <ViewTransition><AIInvestigationResult analysis={result.analysis} />
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={copy} className="px-3 py-2 border border-[#c2c7ca] bg-white rounded-lg text-xs font-semibold">Copy Report</button>
        <button onClick={download} className="px-3 py-2 border border-[#c2c7ca] bg-white rounded-lg text-xs font-semibold">Download .txt Report</button>
      </div>
      <p role="status" className="text-xs text-[#515f74] mt-2">{reportStatus}</p>
    </ViewTransition>}
  </section>;
}
export function AIInvestigationResult({ analysis: a }: { analysis: AIThreatAnalysis }) {
  const findings = [ ['Impersonation language', a.semanticAnalysis.impersonationLanguageDetected], ['Support claim', a.semanticAnalysis.supportClaimDetected], ['Official-brand claim', a.semanticAnalysis.officialBrandClaimDetected], ['Suspicious intent', a.semanticAnalysis.suspiciousIntentDetected] ] as const;
  return <div className="space-y-4 mt-4 text-xs text-[#515f74]">
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-white rounded-lg border border-[#c2c7ca] p-3"><span>AI Assessment</span><p className="text-sm font-bold text-[#004b73]">{a.verdict}</p></div>
      <div className="bg-white rounded-lg border border-[#c2c7ca] p-3"><span>AI Confidence</span><p className="text-sm font-bold text-[#004b73]">{a.confidence}%</p><p>Confidence in the AI verdict; not a risk score.</p></div>
    </div>
    <div><h4 className="font-semibold text-[#1a1c1c]">Summary</h4><p>{a.summary}</p></div>
    <div><h4 className="font-semibold text-[#1a1c1c]">AI Semantic Findings</h4>
      <p>Semantic similarity: {a.semanticAnalysis.similarity === null ? 'Unavailable' : `${a.semanticAnalysis.similarity}%`}</p>
      <ul className="list-disc pl-4 mt-1">{findings.map(([label, found]) => <li key={label}>{label}: {found ? 'Detected' : 'Not detected'}</li>)}</ul>
      <p className="mt-2">{a.semanticAnalysis.explanation}</p>
    </div>
    <div><h4 className="font-semibold text-[#1a1c1c]">Key Evidence</h4><ul className="space-y-2 mt-1">{a.keyEvidence.map((e, i) => <li key={i}><strong>{e.signal} · {e.severity}</strong><p>{e.explanation}</p></li>)}</ul></div>
    <div><h4 className="font-semibold text-[#1a1c1c]">Related Concerns</h4><ul>{a.relatedConcerns.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
    <div><h4 className="font-semibold text-[#1a1c1c]">Recommended Analyst Action</h4><p>{a.recommendedAction}</p></div>
    <div><h4 className="font-semibold text-[#1a1c1c]">Limitations</h4><p>AI findings may be incorrect. Human verification is required; no live ownership or platform verification was performed.</p><ul>{a.limitations.map((l, i) => <li key={i}>{l}</li>)}</ul></div>
  </div>;
}
