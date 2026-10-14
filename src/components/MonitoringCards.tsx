import React from 'react';
import { ThreatItem } from '../types';
import { AnimatedNumber } from './MotionUI';
interface CardProps { t: ThreatItem; brand: string; onInvestigate: (t: ThreatItem) => void; onOpenTakedown: (t: ThreatItem) => void }
export function SocialMonitoringCard({ t, onInvestigate, onOpenTakedown }: CardProps) {
            const isOfficial = t.riskCategory === 'Trusted';
            const visualSim = t.analysis?.visualSimilarity;
            const hasClonedLogo = visualSim && visualSim.visualScore >= 75 && !isOfficial;

            return (
              <div
                key={t.id}
                className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-w-0 transition-all ${
                  isOfficial
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : t.riskCategory === 'Critical'
                    ? 'border-red-300 hover:border-red-400'
                    : 'border-[#c2c7ca]/70'
                }`}
              >
                <div>
                  {/* Top Bar: Platform & Severity */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#eeeeed] text-[#515f74] font-['JetBrains_Mono'] text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        {t.platform === 'X' ? 'tag' : t.platform === 'Instagram' ? 'photo_camera' : 'share'}
                      </span>
                      Social Account · {t.platform}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {hasClonedLogo && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-['JetBrains_Mono'] text-[10px] font-bold border border-red-200">
                          {visualSim.visualScore}% Logo Match
                        </span>
                      )}
                      <span
                        className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded ${
                          isOfficial
                            ? 'text-emerald-800 bg-emerald-100'
                            : t.riskCategory === 'Critical'
                            ? 'text-red-700 bg-red-100'
                            : 'text-amber-800 bg-amber-100'
                        }`}
                      >
                        <>Risk <AnimatedNumber value={t.riskScore} />/100 · {t.riskCategory}</>
                      </span>
                    </div>
                  </div>

                  {/* Identity with Avatar */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0 font-['Manrope']"
                      style={{ backgroundColor: t.avatarBg }}
                    >
                      {t.avatarText}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Noto_Serif',serif] font-bold text-sm text-[#1a1c1c] truncate">
                        {t.name}
                      </h3>
                      <p className={`font-['JetBrains_Mono'] text-xs font-semibold truncate ${isOfficial ? 'text-emerald-700' : 'text-red-700'}`}>
                        {t.handleOrPkg}
                      </p>
                      <span className="text-[11px] text-[#72787a] font-['Inter'] block mt-0.5">
                        {t.audience}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Vector */}
                  <p className="text-xs text-[#515f74] font-['Inter'] leading-relaxed line-clamp-2 mb-3">
                    {t.summary}
                  </p>

                  <ul className="text-xs text-[#515f74] space-y-1 mb-3" aria-label="Impersonation signals">
                    {t.explainableSignals.map((signal, index) => <li key={index}><strong>{signal.label}:</strong> {signal.desc}</li>)}
                  </ul>
                  {/* Bio Redirect Alert if Present */}
                  {t.details?.redirectTunnel && (
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-[11px] font-['Inter'] mb-3">
                      <span className="font-semibold text-red-800 block">Observed Bio Redirect:</span>
                      <span className="font-['JetBrains_Mono'] text-red-700 truncate block mt-0.5">
                        {t.details.redirectTunnel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#eeeeed] flex items-center justify-between gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a] truncate">
                    {t.dateDetected}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isOfficial && (
                      <button
                        onClick={() => onOpenTakedown(t)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Takedown
                      </button>
                    )}
                    <button
                      onClick={() => onInvestigate(t)}
                      className="px-3 py-1 bg-[#0f2930] hover:bg-[#133942] text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Deep Investigation
                    </button>
                  </div>
                </div>
              </div>
            );
}
export function AppMonitoringCard({ t, onInvestigate, onOpenTakedown }: CardProps) {
          const isOfficial = t.riskCategory === 'Trusted';
          const visualSim = t.analysis?.visualSimilarity;
          const publisher = t.details?.publisher || 'Unknown Developer';
          const isOfficialPub = t.analysis?.publisherMatch === 'MATCHED';

          return (
            <div
              key={t.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0 ${
                isOfficial ? 'border-emerald-300 bg-emerald-50/15' : 'border-[#c2c7ca]/70'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold ${
                        isOfficial
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Mobile App · {t.platform}
                    </span>
                    {visualSim && visualSim.visualScore >= 75 && !isOfficial && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-['JetBrains_Mono'] text-[10px] font-bold">
                        {visualSim.visualScore}% Icon Resemblance
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c] truncate">
                    {t.name}
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#515f74] block truncate mt-0.5">
                    {t.handleOrPkg}
                  </span>
                </div>

                <span
                  className={`font-['JetBrains_Mono'] text-sm font-bold shrink-0 px-2.5 py-1 rounded ${
                    isOfficial
                      ? 'text-emerald-800 bg-emerald-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  <>Risk <AnimatedNumber value={t.riskScore} />/100 · {t.riskCategory}</>
                </span>
              </div>

              {/* Side-by-side Forensic Verification Specs */}
              <div className="p-3 bg-[#f9f9f8] rounded-xl border border-[#eeeeed] space-y-2 text-xs font-['Inter']">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#515f74]">Publisher Identity:</span>
                  <span className={`font-semibold truncate max-w-[240px] ${isOfficialPub ? 'text-emerald-800' : 'text-red-700'}`}>
                    {publisher}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                  <span className="text-[#515f74]">Package Namespace:</span>
                  <span className={`font-['JetBrains_Mono'] text-[11px] truncate max-w-[240px] ${isOfficial ? 'text-emerald-800' : 'text-[#1a1c1c]'}`}>
                    {t.handleOrPkg}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between gap-2 border-t border-[#eeeeed] py-1"><span>Publisher Match:</span><strong>{t.analysis?.publisherMatch ?? 'UNKNOWN'}</strong></div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-[#eeeeed] py-1"><span>Package Match:</span><strong>{t.analysis?.packageMatch ?? 'UNKNOWN'}</strong></div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-[#eeeeed] py-1"><span>Visual Similarity:</span><strong>{visualSim?.status === 'available' ? visualSim.visualScore + '%' : 'Unavailable'}</strong></div>
                {t.analysis?.descriptionSimilarity === undefined && <div>Description Text Match: Unavailable</div>}
                {t.analysis?.descriptionSimilarity !== undefined && (
                  <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                    <span className="text-[#515f74]">Description Text Match:</span>
                    <span className="font-semibold text-[#1a1c1c]">
                      {t.analysis.descriptionSimilarity}% token overlap with official description
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                  <span className="text-[#515f74]">Observed User Reach:</span>
                  <span className="font-semibold text-[#1a1c1c]">{t.audience}</span>
                </div>
              </div>

              {/* Description & Threat Vector */}
              <p className="text-xs text-[#515f74] font-['Inter'] leading-relaxed line-clamp-2">
                <strong>Analysis:</strong> {t.summary}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#eeeeed]">
                {!isOfficial && (
                  <button
                    onClick={() => onOpenTakedown(t)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer shadow-xs"
                  >
                    Generate Store Takedown Notice
                  </button>
                )}
                <button
                  onClick={() => onInvestigate(t)}
                  className="px-3.5 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Deep Investigation
                </button>
              </div>
            </div>
          );
}
