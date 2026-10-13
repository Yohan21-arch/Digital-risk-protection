import React from 'react';
import { ThreatItem } from '../types';

interface DeepInvestigationModalProps {
  threat: ThreatItem | null;
  onClose: () => void;
  onDismiss: (threatId: string) => void;
  onMarkTrusted: (threatId: string) => void;
  onSaveDossier: (threat: ThreatItem) => void;
  onConfirmTakedown: (threat: ThreatItem) => void;
}

export const DeepInvestigationModal: React.FC<DeepInvestigationModalProps> = ({
  threat,
  onClose,
  onDismiss,
  onMarkTrusted,
  onSaveDossier,
  onConfirmTakedown,
}) => {
  if (!threat) return null;

  const isCritical = threat.riskCategory === 'Critical';

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/50 backdrop-blur-xs flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-700">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Manrope'] text-lg font-bold text-[#1a1c1c]">
                  Forensic Threat Investigation
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-['JetBrains_Mono'] text-[10px] font-bold">
                  CASE-2026-{threat.id.slice(0, 4).toUpperCase()}
                </span>
              </div>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#515f74]">
                Side-by-Side Anchor Verification & Explainable Neural Risk Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#515f74] hover:text-[#1a1c1c] hover:bg-[#f3f4f3] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body (Scrollable Workbench) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* SIDE-BY-SIDE FORENSIC COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Official Verified Brand Anchor */}
            <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/15 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-1.5 uppercase">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  Official Brand Anchor
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-emerald-700 font-bold">
                  Risk 0 • Safe
                </span>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-emerald-200/60">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-xs border border-blue-400 shrink-0 font-['Manrope']">
                  PAYTM
                </div>
                <div>
                  <h3 className="font-['Manrope'] text-base font-bold text-[#1a1c1c]">
                    Paytm Official
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs font-semibold text-emerald-800">
                    @paytm
                  </span>
                  <p className="text-xs text-[#515f74] mt-0.5 font-['Inter']">
                    Verified Corporate Identity Handle
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-emerald-200/40 text-xs mt-3 space-y-2 font-['Inter']">
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Publisher / Registrant</dt>
                  <dd className="font-semibold text-[#1a1c1c]">
                    One97 Communications Ltd.
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Primary Canonical Domain</dt>
                  <dd className="font-['JetBrains_Mono'] text-emerald-800 font-bold">
                    paytm.com
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Official Care Channel</dt>
                  <dd className="font-['JetBrains_Mono'] text-[#1a1c1c] font-semibold">
                    @PaytmCare
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Security Protocol</dt>
                  <dd className="text-[#1a1c1c] font-medium">
                    EV SSL • DNSSEC Signed
                  </dd>
                </div>
              </dl>
            </div>

            {/* Detected Impersonator (Adversary) */}
            <div className="border border-red-300 rounded-xl p-5 bg-red-50/15 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-red-100 text-red-800 font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-1.5 uppercase">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    report
                  </span>
                  Detected Impersonator
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-red-700 font-bold">
                  Risk {threat.riskScore} • {threat.riskCategory}
                </span>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-red-200/60">
                <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-xs border border-red-400 shrink-0 font-['Manrope']">
                  {threat.avatarText.length <= 2 ? threat.avatarText : 'P'}
                </div>
                <div>
                  <h3 className="font-['Manrope'] text-base font-bold text-[#1a1c1c]">
                    {threat.name}
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs font-semibold text-red-700">
                    {threat.handleOrPkg}
                  </span>
                  <p className="text-xs text-red-600 mt-0.5 font-['Inter']">
                    Unverified Rogue Asset
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-red-200/40 text-xs mt-3 space-y-2 font-['Inter']">
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Publisher / Registrant</dt>
                  <dd className="font-semibold text-red-700 truncate max-w-[220px]">
                    {threat.details.publisher}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Redirect Tunnel</dt>
                  <dd className="font-['JetBrains_Mono'] text-red-700 font-bold truncate max-w-[220px]">
                    {threat.details.redirectTunnel || 'Direct Malicious Endpoint'}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Declared Purpose</dt>
                  <dd className="text-red-700 font-medium truncate max-w-[220px]">
                    {threat.details.purpose}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Homograph Entropy</dt>
                  <dd className="font-['JetBrains_Mono'] text-red-700 font-bold">
                    {threat.details.homographEntropy}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* EXPLAINABLE RISK BREAKDOWN */}
          <div className="border border-[#c2c7ca]/60 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Manrope'] text-sm font-bold text-[#1a1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2b94d7] text-[18px]">
                  psychology
                </span>
                Explainable Risk Breakdown: Why was this flagged?
              </h3>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#515f74]">
                Neural Weights v4.1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {threat.explainableSignals.map((sig, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-red-50/60 border border-red-200 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-red-800 font-bold uppercase truncate">
                      {sig.label.split(':')[0]}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-red-700 font-bold text-xs">
                      +{sig.score || 20}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#515f74] font-['Inter'] line-clamp-2">
                    {sig.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#eeeeed] flex items-center justify-between font-['JetBrains_Mono'] text-xs">
              <span className="text-[#515f74]">Cumulative Algorithm Score:</span>
              <span className="text-red-700 font-bold">
                {threat.riskScore} / 100 ({threat.riskCategory.toUpperCase()} THREAT)
              </span>
            </div>
          </div>

          {/* Evidence Screenshot & Technical Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 border border-[#c2c7ca]/60 rounded-xl p-4 bg-[#f3f4f3]/30">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block mb-2">
                Automated Evidence Capture
              </span>
              <div className="w-full h-36 bg-slate-900 rounded-lg border border-[#c2c7ca] flex flex-col items-center justify-center p-3 text-center text-slate-300">
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-400">
                  screenshot_monitor
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px]">
                  SHA-256 Verified Capture
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-slate-400 mt-1 truncate w-full font-mono">
                  {threat.details.sha256Hash}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 border border-[#c2c7ca]/60 rounded-xl p-4 bg-[#f3f4f3]/30">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block mb-2">
                WHOIS & Infrastructure Attribution
              </span>
              <div className="font-['JetBrains_Mono'] text-xs text-[#515f74] space-y-1.5">
                <div className="flex justify-between">
                  <span>Registrar:</span>
                  <span className="font-semibold text-[#1a1c1c]">
                    {threat.details.registrar}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="font-semibold text-[#1a1c1c]">
                    {threat.details.ipAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Date:</span>
                  <span className="font-semibold text-[#1a1c1c]">
                    {threat.details.registeredDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>MX Records:</span>
                  <span className="font-semibold text-red-600">
                    {threat.details.mxRecords}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#eeeeed] bg-[#f9f9f8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDismiss(threat.id)}
              className="px-4 py-2 border border-[#c2c7ca] rounded-lg text-[#515f74] hover:text-[#1a1c1c] hover:bg-[#f3f4f3] text-xs font-semibold font-['Manrope'] transition-all cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => onMarkTrusted(threat.id)}
              className="px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                check_circle
              </span>
              <span>Mark as Trusted</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSaveDossier(threat)}
              className="px-4 py-2 border border-[#c2c7ca] rounded-lg text-[#001319] hover:bg-[#f3f4f3] text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Evidence Dossier</span>
            </button>
            <button
              onClick={() => onConfirmTakedown(threat)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Confirm Threat / Issue Takedown</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
