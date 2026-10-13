import React from 'react';
import { BRAND_METADATA } from '../data/brandMetadata';
import { ThreatItem } from '../types';

interface DeepInvestigationModalProps {
  threat: ThreatItem | null;
  onClose: () => void;
  onDismiss: (threatId: string) => void;
  onMarkTrusted: (threatId: string) => void;
  onSaveDossier: (threat: ThreatItem) => void;
  onConfirmTakedown: (threat: ThreatItem) => void;
}

function detectBrandKey(threat: ThreatItem): keyof typeof BRAND_METADATA {
  const text = `${threat.name} ${threat.handleOrPkg} ${threat.details?.publisher || ''}`.toLowerCase();
  if (/amazon|amaz0n/.test(text)) return 'amazon';
  if (/nike|nikee/.test(text)) return 'nike';
  if (/phonepe|phone pe|ph0nepe/.test(text)) return 'phonepe';
  if (/microsoft|micros0ft|msft/.test(text)) return 'microsoft';
  return 'paytm';
}

const riskClasses: Record<ThreatItem['riskCategory'], string> = {
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-amber-100 text-amber-900 border-amber-200',
  Medium: 'bg-orange-100 text-orange-900 border-orange-200',
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
  Trusted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export const DeepInvestigationModal: React.FC<DeepInvestigationModalProps> = ({
  threat,
  onClose,
  onDismiss,
  onMarkTrusted,
  onSaveDossier,
  onConfirmTakedown,
}) => {
  if (!threat) return null;

  const brandKey = detectBrandKey(threat);
  const metadata = BRAND_METADATA[brandKey];
  const visual = threat.analysis?.visualSimilarity;
  const isTrusted = threat.riskCategory === 'Trusted';
  const isApp = threat.platform === 'Google Play' || threat.platform === 'App Store';

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-5xl max-h-[94vh] rounded-2xl shadow-2xl border border-[#c2c7ca] overflow-hidden flex flex-col">
        <header className="px-5 sm:px-6 py-4 border-b border-[#eeeeed] bg-gradient-to-r from-[#f9f9f8] to-[#eef6f9] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-['Noto_Serif',serif] text-lg sm:text-xl font-bold text-[#1a1c1c]">
                Threat Investigation
              </h2>
              <span className={`px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] text-[10px] font-bold ${riskClasses[threat.riskCategory]}`}>
                {threat.riskCategory.toUpperCase()} • {threat.riskScore}/100
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0f2930] text-[#cce7f0] font-['JetBrains_Mono'] text-[10px] font-bold">
                CASE-{threat.id.slice(0, 10).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#515f74] font-['Inter'] mt-1">
              Controlled prototype analysis using deterministic identity, registry and visual signals.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white text-[#515f74] cursor-pointer" aria-label="Close investigation">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/20">
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-emerald-800">TRUSTED PROTOTYPE REFERENCE</span>
              <h3 className="font-['Noto_Serif',serif] font-bold mt-2 text-[#1a1c1c]">{metadata.officialLogo.name}</h3>
              <p className="text-xs text-[#515f74] mt-1">Reference publisher: {metadata.officialPublishers[0] || 'Not specified'}</p>
              <p className="text-xs text-[#515f74]">Reference domain: {metadata.domains[0] || 'Not specified'}</p>
            </div>
            <div className={`border rounded-xl p-4 ${isTrusted ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'}`}>
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#515f74]">DETECTED IDENTITY</span>
              <h3 className="font-['Noto_Serif',serif] font-bold mt-2 text-[#1a1c1c]">{threat.name}</h3>
              <p className="font-['JetBrains_Mono'] text-xs text-[#515f74] mt-1 break-all">{threat.handleOrPkg}</p>
              <p className="text-xs text-[#515f74]">Publisher / owner: {threat.details.publisher}</p>
            </div>
          </section>

          <section className="border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-5 bg-white">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div>
                <h3 className="font-['Noto_Serif',serif] font-bold text-[#1a1c1c]">Visual Identity Comparison</h3>
                <p className="text-xs text-[#515f74] mt-0.5">Official reference versus controlled candidate visual.</p>
              </div>
              {visual?.status === 'available' ? (
                <span className="font-['JetBrains_Mono'] text-xs font-bold px-2.5 py-1 rounded bg-[#eef6f9] text-[#004b73] border border-[#c2c7ca]/60">
                  {visual.visualScore}% visual match
                </span>
              ) : (
                <span className="font-['JetBrains_Mono'] text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Visual signal unavailable
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <div className="rounded-xl border border-[#eeeeed] p-4 text-center bg-[#f9f9f8]">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border border-[#c2c7ca]/60 bg-white flex items-center justify-center">
                  {metadata.officialLogo.imageSrc ? (
                    <img src={metadata.officialLogo.imageSrc} alt="Official demo reference" className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-bold text-[#515f74]">REF</span>
                  )}
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] block mt-2">Demo Official Reference</span>
              </div>

              <div className="font-['Noto_Serif',serif] font-bold text-[#72787a] text-center">VS</div>

              <div className="rounded-xl border border-[#eeeeed] p-4 text-center bg-[#f9f9f8]">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border border-[#c2c7ca]/60 bg-white flex items-center justify-center">
                  {threat.visual?.imageSrc ? (
                    <img src={threat.visual.imageSrc} alt="Detected demo visual" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: threat.avatarBg }}>
                      {threat.avatarText}
                    </div>
                  )}
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] block mt-2">{threat.visual?.label || 'Candidate visual unavailable'}</span>
              </div>
            </div>

            {visual?.status === 'available' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
                  <span className="text-[#72787a] block">Structural dHash Match</span>
                  <strong className="font-['JetBrains_Mono'] text-[#1a1c1c]">{visual.pHashScore}%</strong>
                </div>
                <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
                  <span className="text-[#72787a] block">Hamming Distance</span>
                  <strong className="font-['JetBrains_Mono'] text-[#1a1c1c]">{visual.hammingDistance} / 64</strong>
                </div>
                <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
                  <span className="text-[#72787a] block">Color Similarity</span>
                  <strong className="font-['JetBrains_Mono'] text-[#1a1c1c]">{visual.colorScore}%</strong>
                </div>
              </div>
            )}
          </section>

          <section className="border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <div>
                <h3 className="font-['Noto_Serif',serif] font-bold text-[#1a1c1c]">Explainable Detection Signals</h3>
                <p className="text-xs text-[#515f74] mt-0.5">Every contribution comes from the deterministic prototype engine.</p>
              </div>
              <span className="font-['JetBrains_Mono'] text-xs font-bold bg-[#0f2930] text-white px-2.5 py-1 rounded">Score {threat.riskScore}/100</span>
            </div>

            {isApp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-xs">
                <div className="p-3 rounded-lg bg-[#f9f9f8] border border-[#eeeeed]"><span className="text-[#72787a] block">Description Similarity</span><strong>{threat.analysis?.descriptionSimilarity ?? 0}%</strong></div>
                <div className="p-3 rounded-lg bg-[#f9f9f8] border border-[#eeeeed]"><span className="text-[#72787a] block">Publisher Match</span><strong>{threat.analysis?.publisherMatch || 'UNKNOWN'}</strong></div>
                <div className="p-3 rounded-lg bg-[#f9f9f8] border border-[#eeeeed]"><span className="text-[#72787a] block">Package Match</span><strong>{threat.analysis?.packageMatch || 'UNKNOWN'}</strong></div>
                <div className="p-3 rounded-lg bg-[#f9f9f8] border border-[#eeeeed]"><span className="text-[#72787a] block">Official Asset</span><strong>{threat.analysis?.isOfficialAssetMatch ? 'YES' : 'NO'}</strong></div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {threat.explainableSignals.map((signal, index) => (
                <div key={`${signal.label}-${index}`} className={`p-3 rounded-lg border text-xs ${signal.type === 'safe' ? 'bg-emerald-50 border-emerald-200' : 'bg-[#f9f9f8] border-[#eeeeed]'}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#515f74]">SIGNAL {index + 1}</span>
                    <span className="font-['JetBrains_Mono'] font-bold">{signal.score > 0 ? `+${signal.score}` : '0'} pts</span>
                  </div>
                  <p className="font-semibold text-[#1a1c1c]">{signal.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#c2c7ca]/70 rounded-xl p-4 bg-[#f9f9f8]">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-bold">Prototype Infrastructure Metadata</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-xs font-['Inter']">
              <div><span className="text-[#72787a]">Registrar / source:</span> <strong>{threat.details.registrar}</strong></div>
              <div><span className="text-[#72787a]">Recorded date:</span> <strong>{threat.details.registeredDate}</strong></div>
              <div><span className="text-[#72787a]">Purpose:</span> <strong>{threat.details.purpose}</strong></div>
              <div><span className="text-[#72787a]">Look-alike note:</span> <strong>{threat.details.homographEntropy}</strong></div>
            </div>
          </section>
        </div>

        <footer className="px-5 sm:px-6 py-3.5 bg-[#f9f9f8] border-t border-[#eeeeed] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onDismiss(threat.id)} className="px-3.5 py-2 border border-[#c2c7ca] rounded-lg text-xs font-semibold cursor-pointer">Dismiss</button>
            <button onClick={() => onMarkTrusted(threat.id)} className="px-3.5 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold cursor-pointer">Mark as Trusted</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onSaveDossier(threat)} className="px-3.5 py-2 border border-[#c2c7ca] rounded-lg text-xs font-semibold cursor-pointer">Save Evidence Dossier</button>
            {!isTrusted && (
              <button onClick={() => onConfirmTakedown(threat)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer">Open Takedown Workflow</button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
