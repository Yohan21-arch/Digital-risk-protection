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

// Helper to determine the official anchor based on the detected threat's target brand
function getOfficialAnchor(threat: ThreatItem) {
  const combined = `${threat.name} ${threat.handleOrPkg} ${threat.details?.publisher || ''}`.toLowerCase();

  if (combined.includes('amazon') || combined.includes('amaz0n')) {
    return {
      name: 'Amazon Official',
      handle: '@amazon',
      badge: 'AZ',
      badgeBg: '#ff9900',
      publisher: 'Amazon Technologies, Inc.',
      domain: 'amazon.com',
      careChannel: '@AmazonHelp',
      security: 'EV SSL • DNSSEC Signed • Verified Anchor',
    };
  }
  if (combined.includes('nike') || combined.includes('nikee')) {
    return {
      name: 'Nike Official',
      handle: '@nike',
      badge: 'NK',
      badgeBg: '#111111',
      publisher: 'Nike, Inc. Corporate Headquarters',
      domain: 'nike.com',
      careChannel: '@NikeService',
      security: 'EV SSL • DNSSEC Signed • Verified Anchor',
    };
  }
  if (combined.includes('phonepe') || combined.includes('phone pe') || combined.includes('ph0nepe')) {
    return {
      name: 'PhonePe Official',
      handle: '@PhonePe',
      badge: 'PP',
      badgeBg: '#5f259f',
      publisher: 'PhonePe Private Limited',
      domain: 'phonepe.com',
      careChannel: '@PhonePeSupport',
      security: 'EV SSL • RBI Licensed • Verified Anchor',
    };
  }
  if (combined.includes('microsoft') || combined.includes('micros0ft') || combined.includes('msft')) {
    return {
      name: 'Microsoft Official',
      handle: '@microsoft',
      badge: 'MS',
      badgeBg: '#0078D4',
      publisher: 'Microsoft Corporation',
      domain: 'microsoft.com',
      careChannel: '@MicrosoftHelps',
      security: 'EV SSL • Entra ID Signed • Verified Anchor',
    };
  }

  // Default Paytm
  return {
    name: 'Paytm Official',
    handle: '@paytm',
    badge: 'PT',
    badgeBg: '#002E6E',
    publisher: 'One97 Communications Ltd.',
    domain: 'paytm.com',
    careChannel: '@PaytmCare',
    security: 'EV SSL • DNSSEC Signed • NPCI Verified',
  };
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
  const isHigh = threat.riskCategory === 'High';
  const isTrusted = threat.riskCategory === 'Trusted';
  const officialAnchor = getOfficialAnchor(threat);
  const analysis = threat.analysis;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-8 animate-fadeIn select-none">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-5xl max-h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#eeeeed] bg-gradient-to-r from-[#f9f9f8] to-[#eef6f9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0f2930] rounded-xl text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px] text-[#2b94d7]">
                travel_explore
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="text-lg sm:text-xl font-bold text-[#1a1c1c]"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Forensic Threat Investigation
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#0f2930] text-[#cce7f0] font-['JetBrains_Mono'] text-[10px] font-bold">
                  CASE-{threat.id.slice(0, 12).toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-bold ${
                    isCritical
                      ? 'bg-red-100 text-red-800'
                      : isHigh
                      ? 'bg-amber-100 text-amber-900'
                      : isTrusted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-orange-100 text-orange-900'
                  }`}
                >
                  {threat.riskCategory.toUpperCase()} RISK ({threat.riskScore}/100)
                </span>
              </div>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#515f74] mt-0.5">
                Deterministic Identity Matching • Official Safe Harbor Comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#515f74] hover:text-[#1a1c1c] hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Close Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body (Scrollable Workbench) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {/* SIDE-BY-SIDE FORENSIC COMPARISON: OFFICIAL IDENTITY vs DETECTED IDENTITY (PART P) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. Official Verified Brand Anchor */}
            <div className="border border-emerald-300 rounded-xl p-4 sm:p-5 bg-gradient-to-br from-white to-emerald-50/30 relative shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-1.5 uppercase">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  OFFICIAL IDENTITY
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-emerald-800 font-bold bg-emerald-100/60 px-2 py-0.5 rounded">
                  Risk 0 • Safe Harbor
                </span>
              </div>

              <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-200/60">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs border border-white/40 shrink-0 font-['Manrope']"
                  style={{ backgroundColor: officialAnchor.badgeBg }}
                >
                  {officialAnchor.badge}
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-base sm:text-lg font-bold text-[#1a1c1c] truncate"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {officialAnchor.name}
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs font-semibold text-emerald-800 block">
                    {officialAnchor.handle}
                  </span>
                  <p className="text-xs text-[#515f74] mt-0.5 font-['Inter'] truncate">
                    Authorized Sovereign Corporate Asset
                  </p>
                </div>
              </div>

              <dl className="divide-y divide-emerald-200/40 text-xs mt-3 space-y-2 font-['Inter']">
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Publisher / Legal Entity</dt>
                  <dd className="font-semibold text-[#1a1c1c] text-right truncate max-w-[200px]">
                    {officialAnchor.publisher}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Primary Canonical Domain</dt>
                  <dd className="font-['JetBrains_Mono'] text-emerald-800 font-bold">
                    {officialAnchor.domain}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Official Care Channel</dt>
                  <dd className="font-['JetBrains_Mono'] text-[#1a1c1c] font-semibold">
                    {officialAnchor.careChannel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Security Standard</dt>
                  <dd className="text-emerald-900 font-medium text-right truncate max-w-[200px]">
                    {officialAnchor.security}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 2. Detected Impersonator (Adversary) */}
            <div
              className={`border rounded-xl p-4 sm:p-5 relative shadow-xs ${
                isTrusted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-red-300 bg-gradient-to-br from-white to-red-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2.5 py-1 rounded-full font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-1.5 uppercase ${
                    isTrusted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isTrusted ? 'verified' : 'report'}
                  </span>
                  {isTrusted ? 'VERIFIED EXCEPTION' : 'DETECTED IDENTITY'}
                </span>
                <span
                  className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded ${
                    isTrusted
                      ? 'text-emerald-800 bg-emerald-100/60'
                      : 'text-red-700 bg-red-100/80'
                  }`}
                >
                  Risk {threat.riskScore} • {threat.riskCategory}
                </span>
              </div>

              <div className="flex items-center gap-3.5 pb-4 border-b border-red-200/60">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs border border-white/40 shrink-0 font-['Manrope']"
                  style={{ backgroundColor: threat.avatarBg }}
                >
                  {threat.avatarText}
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-base sm:text-lg font-bold text-[#1a1c1c] truncate"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {threat.name}
                  </h3>
                  <span
                    className={`font-['JetBrains_Mono'] text-xs font-bold block ${
                      isTrusted ? 'text-emerald-800' : 'text-red-700'
                    }`}
                  >
                    {threat.handleOrPkg}
                  </span>
                  <p className="text-xs text-[#515f74] mt-0.5 font-['Inter'] truncate">
                    Platform: {threat.platform}
                  </p>
                </div>
              </div>

              <dl className="divide-y divide-red-200/40 text-xs mt-3 space-y-2 font-['Inter']">
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Publisher / Registrant</dt>
                  <dd
                    className={`font-semibold text-right truncate max-w-[200px] ${
                      isTrusted ? 'text-[#1a1c1c]' : 'text-red-700'
                    }`}
                  >
                    {threat.details.publisher}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Redirect Tunnel / Endpoint</dt>
                  <dd className="font-['JetBrains_Mono'] text-red-700 font-bold text-right truncate max-w-[200px]">
                    {threat.details.redirectTunnel || 'Direct Ingestion Endpoint'}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Declared Purpose</dt>
                  <dd className="text-red-700 font-medium text-right truncate max-w-[200px]">
                    {threat.details.purpose}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#515f74]">Look-alike Manipulation</dt>
                  <dd className="font-['JetBrains_Mono'] text-red-700 font-bold text-right truncate max-w-[200px]">
                    {threat.details.homographEntropy}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* EXPLAINABLE RISK BREAKDOWN (PART I & PART P: Generated from Algorithm) */}
          <div className="border border-[#c2c7ca]/70 rounded-xl p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3
                  className="text-base font-bold text-[#1a1c1c] flex items-center gap-2"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  <span className="material-symbols-outlined text-[#2b94d7] text-[19px]">
                    analytics
                  </span>
                  <span>Why was this flagged? (Explainable Neural Signals)</span>
                </h3>
                <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
                  Deterministic algorithm signals contributing to the final risk classification.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#0f2930] text-[#cce7f0] font-['JetBrains_Mono'] text-xs font-bold shrink-0">
                Score: {threat.riskScore} / 100
              </span>
            </div>

            {/* Algorithm Signal Contribution Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {threat.explainableSignals.map((sig, idx) => {
                const isSafe = sig.type === 'safe';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs font-['Inter'] ${
                      isSafe
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-red-50/60 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`font-['JetBrains_Mono'] text-[10px] font-bold uppercase truncate ${
                          isSafe ? 'text-emerald-800' : 'text-red-800'
                        }`}
                      >
                        Signal {idx + 1}
                      </span>
                      <span
                        className={`font-['JetBrains_Mono'] font-bold text-xs ${
                          isSafe ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {isSafe ? '0' : `+${sig.score}`} pts
                      </span>
                    </div>
                    <p className="text-[#1a1c1c] font-semibold text-xs leading-snug">
                      {sig.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Why This Matters Box */}
            <div className="mt-4 p-3.5 bg-[#f3f4f3]/70 rounded-xl border border-[#eeeeed]">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#002841] block mb-1">
                Why this matters:
              </span>
              <p className="text-xs text-[#515f74] font-['Inter'] leading-relaxed">
                {analysis?.whyThisMatters ||
                  'The candidate entity demonstrates significant visual or semantic similarity to the authentic brand while lacking corporate ownership verification.'}
              </p>
            </div>
          </div>

          {/* Evidence Screenshot & Technical Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 border border-[#c2c7ca]/60 rounded-xl p-4 bg-[#f9f9f8]">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block mb-2">
                Automated Evidence Capture
              </span>
              <div className="w-full h-36 bg-slate-900 rounded-lg border border-[#c2c7ca] flex flex-col items-center justify-center p-3 text-center text-slate-300">
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-400">
                  screenshot_monitor
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-white font-bold">
                  SHA-256 Verified Capture
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-slate-400 mt-1 truncate w-full font-mono">
                  {threat.details.sha256Hash}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 border border-[#c2c7ca]/60 rounded-xl p-4 bg-[#f9f9f8]">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block mb-2">
                WHOIS & Infrastructure Attribution
              </span>
              <div className="font-['JetBrains_Mono'] text-xs text-[#515f74] space-y-2">
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
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#eeeeed] bg-[#f9f9f8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDismiss(threat.id)}
              className="px-3.5 py-2 border border-[#c2c7ca] rounded-lg text-[#515f74] hover:text-[#1a1c1c] hover:bg-white text-xs font-semibold font-['Manrope'] transition-all cursor-pointer shadow-xs"
            >
              Dismiss
            </button>
            <button
              onClick={() => onMarkTrusted(threat.id)}
              className="px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Mark as Trusted</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSaveDossier(threat)}
              className="px-4 py-2 border border-[#c2c7ca] rounded-lg text-[#001319] hover:bg-white text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Evidence Dossier</span>
            </button>
            <button
              onClick={() => onConfirmTakedown(threat)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Issue Takedown</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
