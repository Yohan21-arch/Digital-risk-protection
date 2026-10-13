import React, { useState } from 'react';
import { CandidateEntity } from '../types';
import { parseCandidateImport } from '../lib/runtimeCandidates';

interface CandidateIntakePanelProps {
  runtimeCandidateCount: number;
  onImport: (candidates: CandidateEntity[]) => void;
  onClear: () => void;
  onToast: (message: string) => void;
}

const SAMPLE = `[
  {
    "targetBrand": "Paytm",
    "name": "Paytm Help Desk Rewards",
    "handleOrPkg": "@paytm_rewards_help",
    "platform": "Instagram",
    "summary": "Claim cashback rewards through our verification portal.",
    "audience": "1.2K followers",
    "details": {
      "publisher": "Unknown operator",
      "redirectTunnel": "https://paytm-rewards-example.test/login",
      "purpose": "Controlled prototype phishing candidate"
    }
  }
]`;

export const CandidateIntakePanel: React.FC<CandidateIntakePanelProps> = ({
  runtimeCandidateCount,
  onImport,
  onClear,
  onToast,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const importCandidates = () => {
    setError(null);
    try {
      const candidates = parseCandidateImport(text);
      if (!candidates.length) throw new Error('Paste at least one candidate object.');
      onImport(candidates);
      setText('');
      onToast(`Imported ${candidates.length} local prototype candidate${candidates.length === 1 ? '' : 's'}.`);
    } catch (err: any) {
      setError(err?.message || 'Unable to import candidate data.');
    }
  };

  return (
    <section className="bg-white border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#cce5ff] text-[#002841] font-['JetBrains_Mono'] text-[10px] font-bold">PHASE 3 • CANDIDATE INTAKE</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">{runtimeCandidateCount} local candidates stored</span>
          </div>
          <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c]">Controlled Candidate Import</h2>
          <p className="text-xs text-[#515f74] mt-1 max-w-3xl">
            Paste JSON from a prepared dataset or connector export. Imported entries stay in localStorage and pass through the same deterministic scoring engine as built-in demo candidates.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setText(SAMPLE)} className="px-3 py-1.5 border border-[#c2c7ca] rounded-lg text-xs font-semibold text-[#515f74] hover:bg-[#f3f4f3]">Load Sample</button>
          <button onClick={onClear} className="px-3 py-1.5 border border-[#c2c7ca] rounded-lg text-xs font-semibold text-[#515f74] hover:bg-[#f3f4f3]">Clear Local</button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        spellCheck={false}
        placeholder="Paste one candidate object or an array of candidates as JSON..."
        className="w-full max-w-full min-w-0 rounded-lg border border-[#c2c7ca] bg-[#f9f9f8] p-3 font-['JetBrains_Mono'] text-[11px] leading-relaxed text-[#1a1c1c] focus:outline-none focus:border-[#2b94d7] resize-y"
      />

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-[10px] text-[#72787a] font-['Inter']">
          Required: targetBrand, name, handleOrPkg, platform. Supported platforms match the current monitoring engine.
        </span>
        <button onClick={importCandidates} className="px-4 py-2 rounded-lg bg-[#0f2930] hover:bg-[#133942] text-white text-xs font-semibold shadow-xs shrink-0">
          Import & Reanalyze
        </button>
      </div>
    </section>
  );
};
